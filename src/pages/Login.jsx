import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login - in real app, validate with backend
    login({ name: 'Alex Kumar', email }, 'customer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100"
          >
            <div className="mb-8">
              <h1 className="text-4xl font-black text-gray-900 mb-2">Welcome Back!</h1>
              <p className="text-gray-600">Sign in to continue your health journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 text-emerald-600" />
                  <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
                </div>
                <a href="#" className="text-sm text-emerald-600 font-semibold hover:text-emerald-700">
                  Forgot Password?
                </a>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
              >
                Sign In
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-emerald-600 font-bold hover:text-emerald-700">
                  Sign Up
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Right Side - Images & Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-3xl p-12 shadow-xl"
              >
                <div className="text-center mb-8">
                  <img 
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&auto=format&fit=crop"
                    alt="Healthy Food"
                    className="w-32 h-32 rounded-2xl mx-auto mb-4 object-cover shadow-lg"
                  />
                  <h3 className="text-3xl font-black text-gray-900 mb-2">10,000+ Users</h3>
                  <p className="text-gray-600">Trust MealWell for their nutrition</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop"
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-grow">
                        <div className="font-bold text-gray-900">Lost 15kg in 3 months!</div>
                        <div className="text-sm text-gray-600">- Amit Sharma</div>
                      </div>
                      <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop"
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-grow">
                        <div className="font-bold text-gray-900">Perfect for my diabetes!</div>
                        <div className="text-sm text-gray-600">- Priya Kumar</div>
                      </div>
                      <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
