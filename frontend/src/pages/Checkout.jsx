import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Lock, Check, ChevronRight, Tag, Smartphone, Building } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const selectedPlan = location.state?.selectedPlan;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Default plan if none selected
  const defaultPlan = {
    id: 'monthly',
    name: 'Monthly Plan',
    price: { monthly: 8999 },
    originalPrice: 9999,
    savings: '10% off'
  };

  const currentPlan = selectedPlan || defaultPlan;
  const planPrice = currentPlan.price.weekly || currentPlan.price.monthly || currentPlan.price.quarterly;
  const gst = Math.round(planPrice * 0.18);
  const totalAmount = planPrice + gst - discount;

  const features = [
    'AI-personalized meal plans',
    'Verified chefs',
    'Flexible delivery schedule',
    'Real-time order tracking',
    'Nutrition insights dashboard',
    '24/7 customer support',
    'Cancel anytime'
  ];

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Kotak Mahindra Bank',
    'Yes Bank'
  ];

  const handleApplyCoupon = () => {
    const validCoupons = {
      'WELCOME10': 0.1,
      'SAVE20': 0.2,
      'NEWUSER': 0.15
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      const discountPercent = validCoupons[couponCode.toUpperCase()];
      setDiscount(Math.round(planPrice * discountPercent));
      alert(`Coupon applied! ${discountPercent * 100}% discount`);
    } else {
      alert('Invalid coupon code');
      setDiscount(0);
    }
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // Load Razorpay script
    const res = await loadRazorpayScript();
    
    if (!res) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    // In production, create order on backend first
    // For demo, using test configuration
    const options = {
      key: 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay test key
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      name: 'MealWell',
      description: `${currentPlan.name} Subscription`,
      image: 'https://your-logo-url.com/logo.png',
      handler: function (response) {
        // Payment successful
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        // Redirect to success page or dashboard
        navigate('/customer');
      },
      prefill: {
        name: user?.name || 'Customer',
        email: user?.email || '',
        contact: user?.phone || ''
      },
      notes: {
        plan: currentPlan.name,
        user_id: user?.id || 'guest'
      },
      theme: {
        color: '#10b981'
      },
      modal: {
        ondismiss: function() {
          alert('Payment cancelled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Complete Your <span className="text-emerald-600">Payment</span>
          </h1>
          <p className="text-lg text-gray-600">Secure checkout powered by Razorpay</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Selected Plan</h2>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                <div>
                  <h3 className="text-xl font-black text-gray-900">{currentPlan.name}</h3>
                  {currentPlan.savings && (
                    <span className="text-sm text-emerald-600 font-semibold">{currentPlan.savings}</span>
                  )}
                </div>
                <div className="text-right">
                  {currentPlan.originalPrice && (
                    <div className="text-sm text-gray-400 line-through">₹{currentPlan.originalPrice}</div>
                  )}
                  <div className="text-3xl font-black text-emerald-600">₹{planPrice}</div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                    paymentMethod === 'card'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2" />
                  Card
                </button>
                
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-6 h-6 mx-auto mb-2" />
                  UPI
                </button>
                
                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building className="w-6 h-6 mx-auto mb-2" />
                  Net Banking
                </button>
              </div>

              {paymentMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="123"
                          maxLength="3"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'upi' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  />
                  <p className="text-sm text-gray-500 mt-2">Enter your UPI ID (Google Pay, PhonePe, Paytm, etc.)</p>
                  
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                      <div key={app} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1">
                          {app === 'Google Pay' && '🌐'}
                          {app === 'PhonePe' && '💜'}
                          {app === 'Paytm' && '💙'}
                          {app === 'BHIM' && '🟢'}
                        </div>
                        <div className="text-xs text-gray-600">{app}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'netbanking' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select Bank</label>
                  <select 
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  >
                    <option value="">Select your bank</option>
                    {banks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </motion.div>
              )}
            </div>

            {/* Apply Coupon */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Have a coupon code?</h3>
              <div className="flex gap-3">
                <div className="relative flex-grow">
                  <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all uppercase"
                  />
                </div>
                <button 
                  onClick={handleApplyCoupon}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
                >
                  Apply
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Try: WELCOME10, SAVE20, or NEWUSER</p>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">{currentPlan.name}</span>
                  <span className="font-bold text-gray-900">₹{planPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-bold text-gray-900">₹{gst}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-bold">-₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-xl font-black text-gray-900 mb-6">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2 mb-6"
              >
                Complete Payment
                <ChevronRight className="w-5 h-5" />
              </motion.button>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Lock className="w-4 h-4" />
                  <span className="font-semibold">Secure payment powered by Razorpay</span>
                </div>
                <p className="text-xs text-gray-500">Your payment information is encrypted and secure</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">What's included:</h3>
                <ul className="space-y-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-gray-500 mt-6 text-center">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
