# ⚡ Quick Start Guide

## 🚀 Launch Backend Server

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your values:
```bash
# Minimum required:
MONGO_URI=mongodb://localhost:27017/mealwell
JWT_SECRET=your_secret_key_here_min_32_chars
GEMINI_API_KEY=your_api_key_here  # Optional
```

### 3. Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

### 4. Verify Server is Running

Visit: http://localhost:5000/api/health

You should see:
```json
{
  "status": "OK",
  "timestamp": "...",
  "environment": "development"
}
```

## ✅ Success Indicators

When the server starts successfully, you'll see:

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

## 🎯 Next Steps

1. **Seed Sample Data** (Optional):
   ```bash
   npm run seed:chef
   ```

2. **Start Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

3. **Test the API**:
   - Health: http://localhost:5000/api/health
   - API Info: http://localhost:5000/

## 🔧 Troubleshooting

**Port already in use?**
- Change `PORT` in `.env` file

**MongoDB connection failed?**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`

**AI not working?**
- App works fine without AI (uses fallback)
- Check `GEMINI_API_KEY` if you want AI features

## 📚 Full Documentation

See `LAUNCH.md` for detailed setup instructions.

