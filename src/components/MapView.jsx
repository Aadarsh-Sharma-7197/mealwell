import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

export default function MapView({ origin, destination }) {
  // In production, integrate Google Maps API or Mapbox
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Navigation className="w-5 h-5 text-emerald-600" />
        Live Tracking
      </h3>
      
      <div className="relative bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl h-96 overflow-hidden">
        {/* Placeholder Map - Replace with actual map in production */}
        <img 
          src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.2090,28.6139,12,0/800x600?access_token=YOUR_MAPBOX_TOKEN"
          alt="Map"
          className="w-full h-full object-cover opacity-50"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🚚
            </motion.div>
            <p className="text-gray-700 font-semibold bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl">
              En route to your location
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 justify-center text-sm bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Distance: 2.5 km</span>
              </div>
              <div className="text-sm bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg font-medium">
                ETA: 15 minutes
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">📍</span>
          </div>
          <div>
            <div className="font-bold text-gray-900 mb-1">Delivery Address</div>
            <div className="text-sm text-gray-600">{destination || '123, Green Park, New Delhi - 110016'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
