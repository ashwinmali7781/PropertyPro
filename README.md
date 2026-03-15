# 🏠 Property Pro — Real Estate MERN App

A full-stack real estate platform built with the MERN stack (MongoDB, Express, React, Node.js).

## ✨ Features
- 🔐 JWT + Google OAuth authentication
- 🏠 Property listings (buy/rent/sell)
- 🔍 Advanced search & filters (type, category, city, price, bedrooms, etc.)
- 📸 Cloudinary image upload (multiple images per listing)
- ❤️  Save/unsave properties
- 📊 Agent dashboard with listing management
- 🤖 Similar property recommendations
- 📱 Fully responsive UI with Tailwind CSS

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Redux |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB, Mongoose                   |
| Auth       | Passport.js (Local + Google OAuth + JWT) |
| Images     | Cloudinary + Multer                 |
| Validation | Joi                                 |

## 📁 Project Structure
```
PropertyPro/
├── app.js                  # Express entry point
├── .env                    # Environment variables
├── cloudinary/index.js     # Cloudinary + Multer config
├── config/passport.js      # Auth strategies
├── init/index.js           # DB connection
├── models/                 # Mongoose schemas
├── routes/                 # API routes
├── middleware/             # Auth, validation
├── seed/                   # Database seed scripts
├── utils/                  # Helpers
└── client/                 # React frontend (Vite)
    └── src/
        ├── pages/
        ├── components/
        ├── store/          # Redux slices
        └── utils/
```

## 🚀 Getting Started

### 1. Clone & Install
```bash
# Install all dependencies
npm run install:all
```

### 2. Configure Environment
Edit `.env` with your credentials:
```env
MONGO_URI=mongodb://localhost:27017/property-pro
SESSION_SECRET=your_secret_here
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed the Database
```bash
npm run seed
```
Test accounts after seeding:
- `rahul@propertypro.com` / `password123` (agent)
- `admin@propertypro.com` / `admin@123` (admin)

### 4. Run Development Servers
```bash
# Runs both backend (port 5000) + frontend (port 5173)
npm run dev
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/google | Google OAuth |
| GET | /api/auth/me | Current user |
| PUT | /api/auth/me | Update profile |
| POST | /api/auth/save-property/:id | Toggle save |

### Properties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/properties | List + search + filter |
| GET | /api/properties/featured | Featured listings |
| GET | /api/properties/:id | Single property + recommendations |
| POST | /api/properties | Create listing |
| PUT | /api/properties/:id | Update listing |
| DELETE | /api/properties/:id | Delete listing |
| GET | /api/properties/user/my-properties | My listings |
