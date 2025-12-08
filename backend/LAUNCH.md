# 🚀 MealWell Backend Launch Guide

## Prerequisites Checklist

Before launching the server, ensure you have:

- [ ] Node.js installed (v16+ recommended)
- [ ] MongoDB running locally or MongoDB Atlas connection string
- [ ] Environment variables configured in `.env` file
- [ ] All dependencies installed (`npm install`)

## Environment Variables

Create a `.env` file in the `backend` directory with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/mealwell
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mealwell

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Gemini AI (Optional - fallback plan works without it)
GEMINI_API_KEY=your_gemini_api_key_here

# Razorpay (Optional - for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Installation

```bash
cd backend
npm install
```

## Launch Commands

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Health Check

Once the server is running, verify it's working:

```bash
curl http://localhost:5000/api/health
```

Or visit in browser: `http://localhost:5000/api/health`

## API Endpoints

- **Health Check**: `GET /api/health`
- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **AI Meal Plans**: `/api/ai/*`
- **Chefs**: `/api/chefs/*`
- **Orders**: `/api/orders/*`
- **Payments**: `/api/payments/*`

## Seed Sample Data (Optional)

To populate the database with sample chef accounts and orders:

```bash
npm run seed:chef
```

This creates:
- 3 sample chef accounts (see CHEF_DASHBOARD_SETUP.md for credentials)
- 5 sample customer accounts
- Sample dishes and orders

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify `MONGO_URI` in `.env` is correct

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 5000

### AI Generation Errors
- The app works fine without Gemini API (uses fallback plan)
- If you want AI, ensure `GEMINI_API_KEY` is set correctly
- Get API key from: https://makersuite.google.com/app/apikey

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name mealwell-backend
   ```
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates
5. Configure environment variables securely

## Server Status

When running successfully, you should see:

```
✅ Connected to MongoDB
📦 Database: mealwell
============================================================
🚀 MealWell Backend Server Started Successfully!
============================================================
📍 Server URL: http://localhost:5000
🌍 Environment: development
📡 Health Check: http://localhost:5000/api/health
🤖 AI Model: gemini-flash-latest
============================================================
```

## Support

For issues or questions, check:
- Server logs in terminal
- MongoDB connection status
- Environment variables configuration
- Network/firewall settings

