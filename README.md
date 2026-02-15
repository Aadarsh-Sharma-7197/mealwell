# MealWell - AI-Powered Automated Meal Planner & Delivery System

![MealWell Banner](https://via.placeholder.com/1200x400?text=MealWell+Banner) 

**MealWell** is a full-stack web application designed to revolutionize meal planning and delivery. It uses **Google Gemini AI** to generate personalized diet plans based on user health data and connects users with local chefs who can prepare and deliver these custom meals.

## 🚀 Features

### For Users 👤
-   **AI-Driven Diet Plans**: Generate comprehensive weekly meal plans tailored to your BMI, goals (weight loss, muscle gain, etc.), allergies, and dietary preferences using Google Gemini AI.
-   **Automated Meal Scheduling**: Instantly converts AI plans into a daily schedule.
-   **Order from Local Chefs**: Browse chefs, view their menus, and order meals directly from your generated plan.
-   **PDF Download**: Download your personalized meal plan and shopping list as a PDF.
-   **Dashboard**: Track your orders, current meal plan, and health stats.
-   **Authentication**: Secure login and signup with JWT.

### For Chefs 👨‍🍳
-   **Chef Dashboard**: Manage incoming orders, update meal status (Cooking, Ready, Delivered), and view earnings.
-   **Menu Management**: Create and update your menu offerings.
-   **Profile**: Showcase your culinary skills and specialties.

### For Admins 🛡️
-   **User & Chef Management**: Oversee all users on the platform.

## 🛠️ Tech Stack

### Frontend
-   **React.js** (Vite)
-   **TailwindCSS** (Styling)
-   **Framer Motion** (Animations)
-   **Lucide React** (Icons)
-   **Axios** (API Requests)
-   **jsPDF** (PDF Generation)

### Backend
-   **Node.js** & **Express.js**
-   **MongoDB** (Database)
-   **Mongoose** (ODM)
-   **Google Generative AI SDK** (Gemini)
-   **JsonWebToken (JWT)** (Auth)
-   **Bcryptjs** (Security)

## 📂 Project Structure

```
mealwell/
├── backend/            # Express.js Server & API
│   ├── config/         # Database & internal configs
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   └── service/        # Business logic (AI, etc.)
│
└── frontend/           # React Application
    ├── public/         # Static assets
    └── src/
        ├── api/        # Axios setup
        ├── assets/     # Images & styles
        ├── components/ # Reusable UI components
        ├── context/    # React Context (Auth, Cart)
        ├── hooks/      # Custom hooks
        ├── layouts/    # Page layouts
        └── pages/      # Application pages
```

## ⚡ Getting Started

### Prerequisites
-   Node.js (v18+)
-   MongoDB (Local or Atlas)
-   Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mealwell.git
cd mealwell
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mealwell
JWT_SECRET=your_super_secret_key_123
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional if defaults work):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the React app:
```bash
npm run dev
```

## 📖 Usage Workflow

1.  **Register**: Sign up as a User or apply to become a Chef.
2.  **Create Plan**: Go to "Create Diet Plan", enter your details (Age, height, weight, goals), and let AI generate your schedule.
3.  **Browse Chefs**: View chefs who can cook your planned meals.
4.  **Order**: Place orders for specific meals or the whole week.
5.  **Track**: Monitor order status in your dashboard.
6.  **Download**: Get a PDF copy of your plan for offline use.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
This project is licensed under the MIT License.
