# 🥗 MealWell - Smart Meal Planning & Delivery Platform

![MealWell Banner](https://via.placeholder.com/1200x400?text=MealWell+Platform)

MealWell is a comprehensive web application that connects health-conscious individuals with professional chefs. It combines AI-driven diet planning with a seamless food delivery service, allowing users to get personalized meal plans prepared by local chefs.

## 🌟 Key Features

### 👤 For Customers
-   **AI-Powered Diet Plans**: Generate personalized weekly meal plans using Google Gemini AI based on your health goals and preferences.
-   **Chef Marketplace**: Browse local chefs, view their profiles, and explore their specialties.
-   **Flexible Subscriptions**: specific meal plans (Weight Loss, Muscle Gain, Keto, etc.).
-   **Order Tracking**: Real-time status updates for your daily meal deliveries.
-   **Health Insights**: Track nutritional intake and progress over time.
-   **Secure Payments**: Integrated Razorpay for seamless transactions.

### 👨‍🍳 For Chefs
-   **Chef Dashboard**: Manage orders, deliveries, and menu items from a dedicated interface.
-   **Menu Management**: Create and update dish listings with details like calories, ingredients, and photos.
-   **Earning Reports**: Track revenue and order history.

## 🛠️ Tech Stack

### Frontend
-   **React.js (Vite)**: Fast and responsive user interface.
-   **Tailwind CSS**: Modern execution of custom designs.
-   **Framer Motion**: Smooth animations and transitions.
-   **React Leaflet**: Map integration for address selection.

### Backend
-   **Node.js & Express**: Robust REST API architecture.
-   **MongoDB**: Flexible NoSQL database for users, orders, and varied menu items.
-   **Google Gemini AI**: Powering the intelligent meal generation engine.
-   **Razorpay**: Secure payment gateway integration.
-   **JWT & Bcrypt**: Secure authentication and authorization.

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   MongoDB (Local or Atlas)
-   Gemini API Key
-   Razorpay Account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/mealwell.git
    cd mealwell
    ```

2.  **Install Dependencies:**
    ```bash
    # Install backend dependencies
    cd mealwell/backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in `mealwell/backend` with the following:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_gemini_api_key
    RAZORPAY_KEY_ID=your_razorpay_key
    RAZORPAY_KEY_SECRET=your_razorpay_secret
    FRONTEND_URL=http://localhost:5173
    ```

4.  **Run the Application:**
    You can run both servers concurrently (if configured) or in separate terminals.

    **Backend:**
    ```bash
    cd mealwell/backend
    npm start
    ```

    **Frontend:**
    ```bash
    cd mealwell/frontend
    npm run dev
    ```

## 📂 Project Structure

```
mealwell/
├── backend/            # Express.js API Server
│   ├── models/         # MongoDB Schemas (User, Chef, Order, etc.)
│   ├── routes/         # API Endpoint Definitions
│   ├── controllers/    # Business Logic
│   └── server.js       # Entry point
│
├── frontend/           # React.js Client
│   ├── src/
│   │   ├── pages/      # Full page components (Dashboard, Login, etc.)
│   │   ├── components/ # Reusable UI components
│   │   └── context/    # Global state management
│   └── vite.config.js  # Vite configuration
│
└── vercel.json         # Vercel Deployment Configuration
```

## 🌍 Deployment (Separate Frontend & Backend)

This project is configured for **Separate Deployment** on Vercel. You will create two separate Vercel projects.

### 1. Deploy Backend
1.  Go to Vercel Dashboard > **Add New Project**.
2.  Import this repository.
3.  **Important**: Set **Root Directory** to `backend`.
4.  Add environment variables (MONGO_URI, etc.).
5.  Deploy!
6.  **Copy the assigned Backend URL** (e.g., `https://mealwell-backend.vercel.app`).

### 2. Deploy Frontend
1.  Go to Vercel and **Add New Project** (import the same repo again).
2.  **Important**: Set **Root Directory** to `frontend`.
3.  **Environment Variables**:
    *   `VITE_API_URL`: Set this to your **Backend URL** + `/api` (e.g., `https://mealwell-backend.vercel.app/api`).
4.  Deploy!
5.  **Copy the assigned Frontend URL** (e.g., `https://mealwell-frontend.vercel.app`).

### 3. Link Them (CORS)
1.  Go to your **Backend Project** in Vercel > Settings > Environment Variables.
2.  Add `FRONTEND_URL` with value: `https://your-frontend-url.vercel.app` (no trailing slash).
3.  **Redeploy** the Backend for changes to take effect.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
