const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage, cloudinary } = require('../cloudinary');
const Property = require('../models/Property');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { protect, isOwner } = require('../middleware/auth');
const { validateProperty } = require('../middleware/validate');
const { getRecommendations } = require('../utils/recommendation');

const upload = multer({ storage });

// ── GET all / search / filter ──────────────────────────────────────────────
router.get(
  '/',
  wrapAsync(async (req, res) => {
    const {
      keyword, type, category, city, state,
      minPrice, maxPrice, bedrooms, bathrooms,
      furnished, parking, status = 'available',
      sort = '-createdAt', page = 1, limit = 12,
    } = req.query;

    const query = {};

    // Text search
    if (keyword) query.$text = { $search: keyword };

    // Filters
    if (type) query.type = type;
    if (category) query.category = category;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (state) query['location.state'] = { $regex: state, $options: 'i' };
    if (status) query.status = status;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (bedrooms) query['features.bedrooms'] = { $gte: Number(bedrooms) };
    if (bathrooms) query['features.bathrooms'] = { $gte: Number(bathrooms) };
    if (furnished) query['features.furnished'] = furnished;
    if (parking === 'true') query['features.parking'] = true;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);

    const properties = await Property.find(query)
      .populate('owner', 'name avatar phone email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      properties,
    });
  })
);

// ── GET featured properties ────────────────────────────────────────────────
router.get(
  '/featured',
  wrapAsync(async (req, res) => {
    const properties = await Property.find({ featured: true, status: 'available' })
      .populate('owner', 'name avatar')
      .limit(6)
      .sort('-createdAt');
    res.json({ success: true, properties });
  })
);

// ── GET single property ────────────────────────────────────────────────────
router.get(
  '/:id',
  wrapAsync(async (req, res, next) => {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name avatar phone email createdAt'
    );
    if (!property) return next(new ExpressError('Property not found.', 404));

    // Increment views
    property.views += 1;
    await property.save({ validateBeforeSave: false });

    const recommendations = await getRecommendations(property);

    res.json({ success: true, property, recommendations });
  })
);

// ── POST create property ───────────────────────────────────────────────────
router.post(
  '/',
  protect,
  upload.array('images', 10),
  wrapAsync(async (req, res, next) => {
    let body;
    try {
      body = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
    } catch {
      return next(new ExpressError('Invalid JSON data.', 400));
    }

    const { error } = require('../middleware/validate');
    const images = (req.files || []).map((f) => ({ url: f.path, filename: f.filename }));

    const property = await Property.create({
      ...body,
      images,
      owner: req.user._id,
    });

    res.status(201).json({ success: true, property });
  })
);

// ── PUT update property ────────────────────────────────────────────────────
router.put(
  '/:id',
  protect,
  isOwner(Property),
  upload.array('images', 10),
  wrapAsync(async (req, res, next) => {
    let body;
    try {
      body = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
    } catch {
      return next(new ExpressError('Invalid JSON data.', 400));
    }

    const property = req.doc;

    // Handle image deletions
    if (body.deleteImages && Array.isArray(body.deleteImages)) {
      for (const filename of body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      property.images = property.images.filter(
        (img) => !body.deleteImages.includes(img.filename)
      );
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => ({ url: f.path, filename: f.filename }));
      property.images.push(...newImages);
    }

    // Update fields
    const updatable = ['title', 'description', 'price', 'type', 'category', 'status', 'location', 'features', 'featured'];
    updatable.forEach((key) => {
      if (body[key] !== undefined) property[key] = body[key];
    });

    await property.save();
    res.json({ success: true, property });
  })
);

// ── DELETE property ────────────────────────────────────────────────────────
router.delete(
  '/:id',
  protect,
  isOwner(Property),
  wrapAsync(async (req, res) => {
    const property = req.doc;

    // Delete all images from Cloudinary
    for (const img of property.images) {
      if (img.filename) await cloudinary.uploader.destroy(img.filename);
    }

    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted successfully.' });
  })
);

// ── GET my properties ──────────────────────────────────────────────────────
router.get(
  '/user/my-properties',
  protect,
  wrapAsync(async (req, res) => {
    const properties = await Property.find({ owner: req.user._id }).sort('-createdAt');
    res.json({ success: true, properties });
  })
);

module.exports = router;
