import React from 'react';
import Navbar from '../components/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-black mb-4">
                <span className="text-emerald-400">Meal</span>Well
              </h3>
              <p className="text-gray-400 leading-relaxed">
                AI-powered personalized nutrition delivered fresh to your door.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-emerald-400 transition">Home</a></li>
                <li><a href="/about" className="hover:text-emerald-400 transition">About</a></li>
                <li><a href="/plans" className="hover:text-emerald-400 transition">Plans</a></li>
                <li><a href="/browse-chefs" className="hover:text-emerald-400 transition">Browse Chefs</a></li>
                <li><a href="/become-chef" className="hover:text-emerald-400 transition">Become a Chef</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 mealwell@gmail.com</li>
                <li>📱 +91 7895454011</li>
                <li>📍 India</li>
              </ul>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all">
                  <span>📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all">
                  <span>📸</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all">
                  <span>🐦</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 MealWell by CodeCatalyst. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
