import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings as SettingsIcon, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';


export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();


  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black">
            <span className="text-emerald-600">Meal</span>
            <span className="text-gray-900">Well</span>
          </Link>
          
          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center space-x-8">
            <li>
              <Link to="/" className="text-gray-700 hover:text-emerald-600 transition font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-700 hover:text-emerald-600 transition font-medium">
                About
              </Link>
            </li>
            <li>
              <Link to="/plans" className="text-gray-700 hover:text-emerald-600 transition font-medium">
                Plans
              </Link>
            </li>
            <li>
              <Link to="/browse-chefs" className="text-gray-700 hover:text-emerald-600 transition font-medium">
                Browse Chefs
              </Link>
            </li>
            <li>
              <Link to="/create-diet-plan" className="text-gray-700 hover:text-emerald-600 transition font-medium">
                Create Diet Plan
              </Link>
            </li>
            <li>
              <Link to="/become-chef" className="text-gray-700 hover:text-emerald-600 transition font-medium">
                Become a Chef
              </Link>
            </li>
          </ul>


          {/* Desktop Auth/User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 text-sm">{user?.name || 'User'}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.userType || 'customer'}</div>
                  </div>
                </button>


                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2"
                    >
                      <Link
                        to={user?.userType === 'chef' ? '/chef' : '/customer'}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all"
                      >
                        <LayoutDashboard className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all"
                      >
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">My Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all"
                      >
                        <SettingsIcon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">Settings</span>
                      </Link>
                      <div className="border-t border-gray-100 my-2" />
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all text-red-600"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-gray-700 font-semibold hover:text-emerald-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:shadow-lg transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>


          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-emerald-600"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>


      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <div className="container mx-auto px-6 py-6">
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-emerald-600 transition font-medium"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-emerald-600 transition font-medium"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/plans"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-emerald-600 transition font-medium"
                  >
                    Plans
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse-chefs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-emerald-600 transition font-medium"
                  >
                    Browse Chefs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-diet-plan"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-emerald-600 transition font-medium"
                  >
                    Create Diet Plan
                  </Link>
                </li>
                <li>
                  <Link
                    to="/become-chef"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-emerald-600 transition font-medium"
                  >
                    Become a Chef
                  </Link>
                </li>
              </ul>


              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{user?.name || 'User'}</div>
                      <div className="text-sm text-gray-500 capitalize">{user?.userType || 'customer'}</div>
                    </div>
                  </div>
                  <Link
                    to={user?.userType === 'chef' ? '/chef' : '/customer'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-semibold text-center"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-semibold text-center"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-center"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-gray-100">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-6 py-3 text-gray-700 font-semibold hover:text-emerald-600 transition border border-gray-200 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
