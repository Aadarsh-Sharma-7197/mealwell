import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useLenis from './hooks/useLenis';
import MainLayout from './layouts/MainLayout';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Plans from './pages/Plans';
import BecomeChef from './pages/BecomeChef';
import CustomerDashboard from './pages/CustomerDashboard';
import ChefDashboard from './pages/ChefDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MealPlan from './pages/MealPlan';
import BrowseChefs from './pages/BrowseChefs';
import OrderTracking from './pages/OrderTracking';
import HealthInsights from './pages/HealthInsights';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import ChefMenu from './pages/ChefMenu';
import NotFound from './pages/NotFound';

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  useLenis();

  return (
    <>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home isLoaded={isLoaded} setIsLoaded={setIsLoaded} />} />
          <Route path="/about" element={<About />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/become-chef" element={<BecomeChef />} />
          <Route path="/browse-chefs" element={<BrowseChefs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Customer Routes */}
          <Route 
            path="/customer" 
            element={
              <ProtectedRoute allowedType="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/meal-plan" 
            element={
              <ProtectedRoute>
                <MealPlan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-tracking" 
            element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health-insights" 
            element={
              <ProtectedRoute>
                <HealthInsights />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />

          {/* Protected Chef Routes */}
          <Route 
            path="/chef" 
            element={
              <ProtectedRoute allowedType="chef">
                <ChefDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chef-menu" 
            element={
              <ProtectedRoute allowedType="chef">
                <ChefMenu />
              </ProtectedRoute>
            } 
          />

          {/* Protected Common Routes */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
      <Chatbot />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
