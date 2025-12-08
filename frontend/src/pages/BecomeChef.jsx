import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ChefHat,
  CheckCircle,
  ArrowRight,
  Loader2,
  Upload,
  X,
  MapPin,
  DollarSign,
  Award,
  FileText,
  Camera,
  Navigation,
  Mic,
  MicOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
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

export default function BecomeChef() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationStatus, setApplicationStatus] = useState(null);

  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    location: "",
    coordinates: null, // Store lat/lng for location
    
    // Professional Information
    experienceYears: "",
    cuisines: [],
    specialties: [],
    pricePerMeal: "",
    bio: "",
    signatureDishes: [],
    
    // Documents
    idProof: null,
    kitchenPhoto: null,
    certificate: null,
  });

  const [signatureDishInput, setSignatureDishInput] = useState("");
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [mapPosition, setMapPosition] = useState([28.6139, 77.2090]); // Default to Delhi
  const [isListening, setIsListening] = useState({});
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!authLoading && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
    
    // Check if user already has an application
    checkApplicationStatus();

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const activeField = Object.keys(isListening).find(key => isListening[key]);
        if (activeField) {
          if (activeField === 'bio') {
            setFormData((prev) => ({
              ...prev,
              [activeField]: prev[activeField] + ' ' + transcript,
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              [activeField]: transcript,
            }));
          }
          setIsListening({});
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening({});
      };

      recognitionRef.current.onend = () => {
        setIsListening({});
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [authLoading, user]);

  const checkApplicationStatus = async () => {
    try {
      const response = await api.get("/chef-applications/my-application");
      if (response.data.success && response.data.data) {
        setApplicationStatus(response.data.data);
        if (response.data.data.status === "pending") {
          setSuccess(true);
        }
      }
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const cuisinesOptions = ['Indian', 'Continental', 'Asian', 'Mediterranean', 'Vegan', 'Keto', 'All'];
  const specialtiesOptions = ['Diabetic-Friendly', 'Heart-Healthy', 'Weight Loss', 'High Protein', 'Low Sodium', 'Vegan', 'All'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [field]: currentArray.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...currentArray, value],
        };
      }
    });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Convert to base64 for now (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [field]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSignatureDish = () => {
    if (signatureDishInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        signatureDishes: [...prev.signatureDishes, signatureDishInput.trim()],
      }));
      setSignatureDishInput("");
    }
  };

  const removeSignatureDish = (index) => {
    setFormData((prev) => ({
      ...prev,
      signatureDishes: prev.signatureDishes.filter((_, i) => i !== index),
    }));
  };

  const removeFile = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  // Voice input handlers
  const startListening = (fieldName) => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    setIsListening({ [fieldName]: true });
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening({});
  };

  // Location map handlers
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapPosition([latitude, longitude]);
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please select on map.');
        },
        {
          enableHighAccuracy: true,
          timeout: 25000,
          maximumAge: 0,
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const reverseGeocode = async (lat, lng) => {
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
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.address) {
          const addr = data.address;
          const locationString = [
            addr.city || addr.town || addr.municipality,
            addr.state || addr.region,
          ].filter(Boolean).join(', ');
          
          setFormData((prev) => ({
            ...prev,
            location: locationString,
            coordinates: { lat, lng },
          }));
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  // Map click handler component
  function LocationMarker({ setPosition }) {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
      },
    });
    return null;
  }

  // Map view updater component
  function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
      if (center && Array.isArray(center) && center.length === 2) {
        map.flyTo(center, 16, {
          duration: 1.5,
        });
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      }
    }, [center, map]);
    return null;
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.location;
      case 2:
        return formData.experienceYears && formData.pricePerMeal && formData.cuisines.length > 0;
      case 3:
        return formData.idProof && formData.kitchenPhoto;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      setError(null);
    } else {
      setError("Please fill in all required fields");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      navigate("/login", {
        state: { from: "/become-chef" },
      });
      return;
    }

    if (!validateStep(4)) {
      setError("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        coordinates: formData.coordinates,
        experienceYears: parseInt(formData.experienceYears),
        cuisines: formData.cuisines,
        specialties: formData.specialties,
        pricePerMeal: parseFloat(formData.pricePerMeal),
        bio: formData.bio,
        signatureDishes: formData.signatureDishes,
        documents: {
          idProof: formData.idProof,
          kitchenPhoto: formData.kitchenPhoto,
          certificate: formData.certificate,
        },
      };

      const response = await api.post("/chef-applications", payload);

      if (response.data.success) {
        setSuccess(true);
        setApplicationStatus(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success && applicationStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Application Submitted Successfully!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Your application has been received and is under review. We'll notify you once the admin reviews your application.
          </p>
          {applicationStatus.status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800 font-medium">
                Status: <span className="font-bold">Pending Review</span>
              </p>
            </div>
          )}
          {applicationStatus.status === "approved" && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-800 font-medium">
                Status: <span className="font-bold">Approved!</span>
              </p>
            </div>
          )}
          {applicationStatus.status === "rejected" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 font-medium">
                Status: <span className="font-bold">Rejected</span>
              </p>
              {applicationStatus.adminNotes && (
                <p className="text-red-700 text-sm mt-2">{applicationStatus.adminNotes}</p>
              )}
            </div>
          )}
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Go to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
            <ChefHat className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">Become a Chef</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Join Our Chef Community
          </h1>
          <p className="text-lg text-gray-600">
            Fill out the form below to apply as a home chef
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                  </div>
                  <span className="text-xs mt-2 text-gray-600 hidden sm:block">
                    {step === 1 && "Personal"}
                    {step === 2 && "Professional"}
                    {step === 3 && "Documents"}
                    {step === 4 && "Review"}
                  </span>
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      currentStep > step ? "bg-emerald-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-10"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Personal Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                      required
                    />
                    {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
                      <button
                        type="button"
                        onClick={() => isListening.name ? stopListening() : startListening('name')}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition ${
                          isListening.name
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600'
                        }`}
                        title="Voice input"
                      >
                        {isListening.name ? (
                          <MicOff className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, State"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLocationMap(!showLocationMap);
                        if (!showLocationMap) {
                          getCurrentLocation();
                        }
                      }}
                      className="w-full px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      {showLocationMap ? 'Hide Map' : 'Select Location on Map'}
                    </button>
                    {showLocationMap && (
                      <div className="h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                        <MapContainer
                          center={mapPosition}
                          zoom={13}
                          style={{ height: '100%', width: '100%' }}
                          scrollWheelZoom={true}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <ChangeView center={mapPosition} />
                          <LocationMarker setPosition={setMapPosition} />
                          <Marker position={mapPosition} />
                        </MapContainer>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Professional Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Per Meal (₹) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      name="pricePerMeal"
                      value={formData.pricePerMeal}
                      onChange={handleInputChange}
                      min="0"
                      step="10"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Cuisines You Specialize In *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {cuisinesOptions.map((cuisine) => (
                    <label
                      key={cuisine}
                      className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-500 transition"
                    >
                      <input
                        type="checkbox"
                        checked={formData.cuisines.includes(cuisine)}
                        onChange={() => handleCheckboxChange("cuisines", cuisine)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium">{cuisine}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Specialties (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {specialtiesOptions.map((specialty) => (
                    <label
                      key={specialty}
                      className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-500 transition"
                    >
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => handleCheckboxChange("specialties", specialty)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio (Optional)
                </label>
                <div className="relative">
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    maxLength="500"
                    placeholder="Tell us about your cooking journey..."
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                  {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
                    <button
                      type="button"
                      onClick={() => isListening.bio ? stopListening() : startListening('bio')}
                      className={`absolute right-2 top-2 p-2 rounded-lg transition ${
                        isListening.bio
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600'
                      }`}
                      title="Voice input"
                    >
                      {isListening.bio ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Signature Dishes (Optional)
                </label>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={signatureDishInput}
                      onChange={(e) => setSignatureDishInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSignatureDish())}
                      placeholder="Enter dish name and press Enter"
                      className="w-full px-4 py-2 pr-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    />
                    {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
                      <button
                        type="button"
                        onClick={() => {
                          const fieldName = 'signatureDish';
                          if (isListening[fieldName]) {
                            stopListening();
                          } else {
                            setIsListening({ [fieldName]: true });
                            recognitionRef.current.onresult = (event) => {
                              const transcript = event.results[0][0].transcript;
                              setSignatureDishInput(transcript);
                              setIsListening({});
                            };
                            recognitionRef.current.start();
                          }
                        }}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition ${
                          isListening.signatureDish
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600'
                        }`}
                        title="Voice input"
                      >
                        {isListening.signatureDish ? (
                          <MicOff className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={addSignatureDish}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.signatureDishes.map((dish, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      {dish}
                      <button
                        type="button"
                        onClick={() => removeSignatureDish(index)}
                        className="hover:text-emerald-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Documents</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ID Proof (Aadhaar/PAN) *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 transition">
                    {formData.idProof ? (
                      <div className="space-y-3">
                        <FileText className="w-12 h-12 text-emerald-600 mx-auto" />
                        <p className="text-sm text-gray-600">ID Proof uploaded</p>
                        <button
                          type="button"
                          onClick={() => removeFile("idProof")}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, "idProof")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kitchen Photo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 transition">
                    {formData.kitchenPhoto ? (
                      <div className="space-y-3">
                        <Camera className="w-12 h-12 text-emerald-600 mx-auto" />
                        <p className="text-sm text-gray-600">Kitchen photo uploaded</p>
                        <button
                          type="button"
                          onClick={() => removeFile("kitchenPhoto")}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "kitchenPhoto")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cooking Certificate (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 transition">
                    {formData.certificate ? (
                      <div className="space-y-3">
                        <Award className="w-12 h-12 text-emerald-600 mx-auto" />
                        <p className="text-sm text-gray-600">Certificate uploaded</p>
                        <button
                          type="button"
                          onClick={() => removeFile("certificate")}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, "certificate")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Review Your Application</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="font-medium">{formData.name}</span></div>
                    <div><span className="text-gray-600">Email:</span> <span className="font-medium">{formData.email}</span></div>
                    <div><span className="text-gray-600">Phone:</span> <span className="font-medium">{formData.phone}</span></div>
                    <div><span className="text-gray-600">Location:</span> <span className="font-medium">{formData.location}</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3">Professional Information</h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-600">Experience:</span> <span className="font-medium">{formData.experienceYears} years</span></div>
                    <div><span className="text-gray-600">Price per meal:</span> <span className="font-medium">₹{formData.pricePerMeal}</span></div>
                    <div><span className="text-gray-600">Cuisines:</span> <span className="font-medium">{formData.cuisines.join(", ")}</span></div>
                    {formData.specialties.length > 0 && (
                      <div><span className="text-gray-600">Specialties:</span> <span className="font-medium">{formData.specialties.join(", ")}</span></div>
                    )}
                  </div>
                </div>

                {formData.bio && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Bio</h3>
                    <p className="text-sm text-gray-700">{formData.bio}</p>
                  </div>
                )}

                {formData.signatureDishes.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Signature Dishes</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.signatureDishes.map((dish, index) => (
                        <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3">Documents</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {formData.idProof ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                      <span>ID Proof {formData.idProof ? "Uploaded" : "Missing"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.kitchenPhoto ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                      <span>Kitchen Photo {formData.kitchenPhoto ? "Uploaded" : "Missing"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.certificate ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="w-5 h-5 text-gray-400">-</span>
                      )}
                      <span>Certificate {formData.certificate ? "Uploaded" : "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
