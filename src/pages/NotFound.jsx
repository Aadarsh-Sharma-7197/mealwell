import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-8"
        >
          <div className="text-9xl font-black text-gray-200 mb-4">404</div>
          <div className="text-6xl mb-4">🤔</div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-gray-900 mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
        >
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:border-emerald-500 hover:text-emerald-600 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <p className="text-sm text-gray-500 mb-4">Quick links:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/about" className="text-emerald-600 hover:text-emerald-700 font-semibold">About</Link>
            <Link to="/browse-chefs" className="text-emerald-600 hover:text-emerald-700 font-semibold">Browse Chefs</Link>
            <Link to="/meal-plan" className="text-emerald-600 hover:text-emerald-700 font-semibold">Meal Plans</Link>
            <Link to="/customer" className="text-emerald-600 hover:text-emerald-700 font-semibold">Dashboard</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
