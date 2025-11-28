import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ChefHat, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData, userType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-200/30 rounded-full blur-3xl"
              />
              
              <div className="relative z-10">
                <h1 className="text-5xl font-black text-gray-900 mb-6">
                  Join <span className="text-emerald-600">MealWell</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Start your personalized health journey today with AI-powered nutrition and fresh meals from verified chefs.
                </p>
                
                {/* Feature Images */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                      <img 
                        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop"
                        alt="Healthy Food"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Personalized Plans</h3>
                      <p className="text-gray-600 text-sm">AI creates custom meal plans for your goals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                      <img 
                        src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&auto=format&fit=crop"
                        alt="Chef"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Verified Chefs</h3>
                      <p className="text-gray-600 text-sm">Background-verified local chefs prepare your meals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                      <img 
                        src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=200&auto=format&fit=crop"
                        alt="Progress"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Track Progress</h3>
                      <p className="text-gray-600 text-sm">Monitor your health journey with insights</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Choose your account type and get started</p>
            </div>

            {/* User Type Toggle */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setUserType('customer')}
                className={`p-4 rounded-xl font-bold transition-all border-2 ${
                  userType === 'customer'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Heart className="w-6 h-6 mx-auto mb-2" />
                Customer
              </button>
              <button
                type="button"
                onClick={() => setUserType('chef')}
                className={`p-4 rounded-xl font-bold transition-all border-2 ${
                  userType === 'chef'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <ChefHat className="w-6 h-6 mx-auto mb-2" />
                Chef
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                    minLength="8"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {userType === 'chef' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-700 font-medium">
                    📋 Background verification required during onboarding
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input type="checkbox" id="terms" className="w-4 h-4 text-emerald-600" required />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the <span className="text-emerald-600 font-semibold">Terms & Conditions</span>
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/50 transition-all"
              >
                Create Account
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700">
                  Sign In
                </Link>
              </p>
            </div>

            {/* Social Signup */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button 
                  type="button"
                  className="py-3 px-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  Google
                </button>
                <button 
                  type="button"
                  className="py-3 px-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">📱</span>
                  Phone
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
