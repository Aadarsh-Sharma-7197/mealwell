import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const userType = user?.userType;

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
              <Link
                to="/"
                className="text-gray-700 hover:text-emerald-600 transition font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-700 hover:text-emerald-600 transition font-medium"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/browse-chefs"
                className="text-gray-700 hover:text-emerald-600 transition font-medium"
              >
                Browse Chefs
              </Link>
            </li>
            <li>
              <Link
                to="/create-diet-plan"
                className="text-gray-700 hover:text-emerald-600 transition font-medium"
              >
                Create Diet Plan
              </Link>
            </li>
            {userType !== "chef" && (
              <li>
                <Link
                  to="/become-chef"
                  className="text-gray-700 hover:text-emerald-600 transition font-medium"
                >
                  Become a Chef
                </Link>
              </li>
            )}
          </ul>

          {/* Desktop Auth/User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to={userType === "chef" ? "/chef" : "/customer"}
                  className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold overflow-hidden">
                    {user?.profile?.avatar ? (
                      <img
                        src={user.profile.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0) || "U"
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-gray-600 hover:text-red-500 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-gray-700 font-bold hover:text-emerald-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition shadow-lg shadow-emerald-200"
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
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
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
                {userType !== "chef" && (
                  <li>
                    <Link
                      to="/become-chef"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-gray-700 hover:text-emerald-600 transition font-medium"
                    >
                      Become a Chef
                    </Link>
                  </li>
                )}

                <li className="pt-4 border-t border-gray-100">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <Link
                        to={userType === "chef" ? "/chef" : "/customer"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-emerald-600 font-medium"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 text-gray-600 hover:text-red-500"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-gray-700 font-bold"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-emerald-600 font-bold"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
