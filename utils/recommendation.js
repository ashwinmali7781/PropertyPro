const Property = require('../models/Property');

/**
 * Returns similar properties based on category, type, city and price range
 */
const getRecommendations = async (property, limit = 4) => {
  const priceBuffer = property.price * 0.3; // ±30% price range

  const recommendations = await Property.find({
    _id: { $ne: property._id },
    'location.city': property.location.city,
    category: property.category,
    type: property.type,
    price: {
      $gte: property.price - priceBuffer,
      $lte: property.price + priceBuffer,
    },
    status: 'available',
  })
    .limit(limit)
    .populate('owner', 'name avatar phone')
    .select('title price location features images type category status');

  // If not enough found, relax to just city + type
  if (recommendations.length < limit) {
    const fallback = await Property.find({
      _id: { $ne: property._id, $nin: recommendations.map((r) => r._id) },
      'location.city': property.location.city,
      type: property.type,
      status: 'available',
    })
      .limit(limit - recommendations.length)
      .populate('owner', 'name avatar phone')
      .select('title price location features images type category status');

    return [...recommendations, ...fallback];
  }

  return recommendations;
};

module.exports = { getRecommendations };
