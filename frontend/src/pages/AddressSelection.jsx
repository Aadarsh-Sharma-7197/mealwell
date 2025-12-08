import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Navigation,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";

// Fix for Leaflet marker icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to center map on location change
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && typeof center.lat === 'number' && typeof center.lng === 'number' && 
        !isNaN(center.lat) && !isNaN(center.lng) &&
        center.lat >= -90 && center.lat <= 90 && 
        center.lng >= -180 && center.lng <= 180) {
      // Use flyTo for smooth animation
      map.flyTo([center.lat, center.lng], 16, {
        duration: 1.5,
        easeLinearity: 0.25
      });
      // Also ensure size is correct
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [center, map]);
  return null;
}

// Component to handle map clicks
function LocationMarker({ position, setPosition, setAddress }) {
  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      // Reverse geocoding (OpenStreetMap Nominatim)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`,
          {
            headers: {
              'User-Agent': 'MealWell/1.0',
              'Referer': window.location.origin
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data && data.address) {
          const addr = data.address;
          setAddress((prev) => ({
            ...prev,
            street:
              addr.house_number && addr.road
                ? `${addr.house_number}, ${addr.road}`
                : addr.road ||
                  addr.house_number ||
                  addr.pedestrian ||
                  addr.footway ||
                  addr.suburb ||
                  addr.neighbourhood ||
                  "",
            city:
              addr.city ||
              addr.town ||
              addr.municipality ||
              addr.village ||
              addr.county ||
              "",
            state: addr.state || addr.region || "",
            zipCode: addr.postcode || "",
          }));
        }
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        // Try alternative geocoding service as fallback
        try {
          const altResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );
          const altData = await altResponse.json();
          if (altData && altData.locality) {
            setAddress((prev) => ({
              ...prev,
              street: altData.locality || "",
              city: altData.city || altData.locality || "",
              state: altData.principalSubdivision || "",
              zipCode: altData.postcode || "",
            }));
          }
        } catch (altError) {
          console.error("Alternative geocoding also failed:", altError);
        }
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Delivery Location</Popup>
    </Marker>
  );
}

export default function AddressSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPlan, chef, dietPlan } = location.state || {};

  // Redirect if no plan/chef selected
  useEffect(() => {
    if (!selectedPlan && !chef) {
      navigate("/browse-chefs");
    }
  }, [selectedPlan, chef, navigate]);

  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.209 }); // Default: New Delhi
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [loadingLocation, setLoadingLocation] = useState(false);

  const getCurrentLocation = () => {
    setLoadingLocation(true);
    
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser. Please enter your address manually.");
      setLoadingLocation(false);
      return;
    }

    // Set a timeout to prevent infinite waiting
    const timeoutId = setTimeout(() => {
      if (loadingLocation) {
        setLoadingLocation(false);
        alert("Location request is taking too long. Please try again or enter your address manually.");
      }
    }, 25000); // 25 second timeout

    // Use getCurrentPosition with high accuracy
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude, accuracy } = position.coords;
        console.log("Location obtained:", { latitude, longitude, accuracy });
        
        // Update position immediately
        const newPos = { lat: latitude, lng: longitude };
        setPosition(newPos);
        
        // Wait a moment for map to update
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Then get address
        await handleLocationUpdate(latitude, longitude, accuracy);
      },
      (error) => {
        clearTimeout(timeoutId);
        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0, // Don't use cached position
      }
    );
  };

  const handleLocationUpdate = async (latitude, longitude, accuracy) => {
    try {
      // Log accuracy for debugging
      if (accuracy > 100) {
        console.warn("Location accuracy is:", accuracy, "meters");
      } else {
        console.log("High accuracy location:", accuracy, "meters");
      }
      
      // Try reverse geocoding with Nominatim first
      try {
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=en`,
          {
            headers: {
              'User-Agent': 'MealWell/1.0',
              'Referer': window.location.origin,
              'Accept': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log("Reverse geocoding result:", data);
          
          if (data && data.address) {
            const addr = data.address;
            setAddress((prev) => ({
              ...prev,
              street:
                addr.house_number && addr.road
                  ? `${addr.house_number}, ${addr.road}`
                  : addr.road ||
                    addr.house_number ||
                    addr.pedestrian ||
                    addr.footway ||
                    addr.suburb ||
                    addr.neighbourhood ||
                    addr.quarter ||
                    addr.place ||
                    "",
              city:
                addr.city ||
                addr.town ||
                addr.municipality ||
                addr.village ||
                addr.county ||
                addr.state_district ||
                "",
              state: addr.state || addr.region || "",
              zipCode: addr.postcode || "",
            }));
            setLoadingLocation(false);
            return; // Success, exit early
          }
        }
      } catch (nominatimError) {
        console.error("Nominatim geocoding failed:", nominatimError);
      }
      
      // Fallback to BigDataCloud API
      try {
        const altResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        if (altResponse.ok) {
          const altData = await altResponse.json();
          if (altData) {
            setAddress((prev) => ({
              ...prev,
              street: altData.locality || altData.principalSubdivision || altData.city || "",
              city: altData.city || altData.locality || "",
              state: altData.principalSubdivision || altData.countryName || "",
              zipCode: altData.postcode || "",
            }));
            setLoadingLocation(false);
            return; // Success with fallback
          }
        }
      } catch (altError) {
        console.error("Alternative geocoding failed:", altError);
      }
      
      // Final fallback - show coordinates and let user enter manually
      setAddress((prev) => ({
        ...prev,
        street: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        city: "Please enter address details manually",
      }));
      
    } catch (error) {
      console.error("Location update error:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleLocationError = (error) => {
    console.error("Error getting location:", error);
    let errorMessage = "Could not get your location. ";
    if (error.code === 1) {
      errorMessage += "Please allow location access in your browser settings and try again.";
    } else if (error.code === 2) {
      errorMessage += "Location unavailable. Please check your GPS/network connection.";
    } else if (error.code === 3) {
      errorMessage += "Location request timed out. Please try again.";
    } else {
      errorMessage += "Please check your browser permissions and try again.";
    }
    alert(errorMessage);
    setLoadingLocation(false);
  };

  const handleContinue = () => {
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode ||
      !address.phone
    ) {
      alert("Please fill in all address details.");
      return;
    }

    navigate("/plans", {
      state: {
        chef,
        dietPlan,
        deliveryAddress: address,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8 border-b border-gray-100">
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Delivery Location
            </h1>
            <p className="text-gray-600">Where should we deliver your meals?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Map Section */}
            <div className="h-[400px] md:h-auto md:min-h-[600px] relative">
              <MapContainer
                key={`${position.lat}-${position.lng}`}
                center={[position.lat, position.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%", minHeight: "100%" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeView center={position} />
                <LocationMarker
                  position={position}
                  setPosition={setPosition}
                  setAddress={setAddress}
                />
              </MapContainer>

              <button
                onClick={getCurrentLocation}
                disabled={loadingLocation}
                className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded-xl shadow-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                title="Use Current Location"
              >
                {loadingLocation ? (
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                ) : (
                  <Navigation className="w-6 h-6 text-emerald-600" />
                )}
              </button>
            </div>

            {/* Address Form Section */}
            <div className="p-8 bg-gray-50/50">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Street Address / Flat No.
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="123, Green Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="New Delhi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="Delhi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) =>
                        setAddress({ ...address, zipCode: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="110001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-300 transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleContinue}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
