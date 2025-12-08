import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Hi! I\'m MealWell AI assistant. How can I help you today?', 
      sender: 'bot',
      action: null
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const quickReplies = [
    'Show meal plans',
    'Find chefs near me',
    'Track my order',
    'Health insights',
    'Create diet plan',
    'Payment history'
  ];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Intent recognition and response generation
  const processMessage = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    let response = '';
    let action = null;
    let actionData = null;

    // Navigation intents
    if (message.includes('meal plan') || message.includes('mealplan') || message.includes('my meals')) {
      if (isAuthenticated) {
        response = 'I\'ll take you to your meal plan page!';
        action = 'navigate';
        actionData = '/meal-plan';
      } else {
        response = 'Please log in first to view your meal plan. Would you like me to take you to the login page?';
        action = 'navigate';
        actionData = '/login';
      }
    }
    else if (message.includes('chef') || message.includes('browse chef') || message.includes('find chef')) {
      response = 'I\'ll show you all available chefs!';
      action = 'navigate';
      actionData = '/browse-chefs';
    }
    else if (message.includes('track') || message.includes('order') || message.includes('delivery')) {
      if (isAuthenticated) {
        response = 'I\'ll take you to your order tracking page!';
        action = 'navigate';
        actionData = '/order-tracking';
      } else {
        response = 'Please log in first to track your orders. Would you like me to take you to the login page?';
        action = 'navigate';
        actionData = '/login';
      }
    }
    else if (message.includes('health') || message.includes('insight') || message.includes('analytics')) {
      if (isAuthenticated) {
        response = 'I\'ll show you your health insights!';
        action = 'navigate';
        actionData = '/health-insights';
      } else {
        response = 'Please log in first to view your health insights. Would you like me to take you to the login page?';
        action = 'navigate';
        actionData = '/login';
      }
    }
    else if (message.includes('create') && (message.includes('diet') || message.includes('plan'))) {
      response = 'I\'ll help you create a personalized diet plan!';
      action = 'navigate';
      actionData = '/create-diet-plan';
    }
    else if (message.includes('payment') || message.includes('history') || message.includes('transaction')) {
      if (isAuthenticated) {
        response = 'I\'ll show you your payment history!';
        action = 'navigate';
        actionData = '/payment-history';
      } else {
        response = 'Please log in first to view your payment history. Would you like me to take you to the login page?';
        action = 'navigate';
        actionData = '/login';
      }
    }
    else if (message.includes('dashboard') || message.includes('my account')) {
      if (isAuthenticated) {
        const dashboardPath = user?.userType === 'chef' ? '/chef' : '/customer';
        response = `I'll take you to your ${user?.userType || 'customer'} dashboard!`;
        action = 'navigate';
        actionData = dashboardPath;
      } else {
        response = 'Please log in first to access your dashboard. Would you like me to take you to the login page?';
        action = 'navigate';
        actionData = '/login';
      }
    }
    else if (message.includes('login') || message.includes('sign in') || message.includes('log in')) {
      response = 'I\'ll take you to the login page!';
      action = 'navigate';
      actionData = '/login';
    }
    else if (message.includes('signup') || message.includes('sign up') || message.includes('register')) {
      response = 'I\'ll take you to the signup page!';
      action = 'navigate';
      actionData = '/signup';
    }
    else if (message.includes('become chef') || message.includes('apply chef')) {
      response = 'I\'ll take you to the chef application page!';
      action = 'navigate';
      actionData = '/become-chef';
    }
    else if (message.includes('about') || message.includes('info')) {
      response = 'I\'ll show you more about MealWell!';
      action = 'navigate';
      actionData = '/about';
    }
    else if (message.includes('plans') || message.includes('pricing')) {
      response = 'I\'ll show you our meal plans and pricing!';
      action = 'navigate';
      actionData = '/plans';
    }
    // Greeting intents
    else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      response = 'Hello! I\'m here to help you with MealWell. You can ask me about meal plans, chefs, orders, or navigate to any page!';
    }
    else if (message.includes('help') || message.includes('what can you do')) {
      response = 'I can help you with:\n• Navigate to meal plans, chefs, orders\n• Track your orders\n• View health insights\n• Create diet plans\n• Check payment history\n• Answer questions about MealWell\n\nJust ask me anything!';
    }
    // FAQ intents
    else if (message.includes('what is mealwell') || message.includes('what is this')) {
      response = 'MealWell is an AI-powered personalized nutrition platform that delivers fresh, healthy meals to your door. We connect you with local chefs who prepare meals tailored to your dietary needs and health goals.';
    }
    else if (message.includes('how does it work') || message.includes('how it works')) {
      response = 'Here\'s how MealWell works:\n1. Create a personalized diet plan based on your goals\n2. Browse and select from local chefs\n3. Place your order and choose delivery address\n4. Track your order in real-time\n5. Enjoy fresh, healthy meals delivered to you!';
    }
    else if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      response = 'Meal prices vary by chef, typically ranging from ₹200-500 per meal. You can view detailed pricing on our Plans page or when browsing chefs. Each chef sets their own prices based on ingredients and preparation.';
    }
    else if (message.includes('delivery') || message.includes('deliver')) {
      response = 'We offer delivery to your selected address. You can choose your delivery location during checkout. Delivery times depend on your chef\'s schedule and location.';
    }
    else if (message.includes('diet') || message.includes('nutrition')) {
      response = 'MealWell offers personalized diet plans based on your health goals, dietary restrictions, and preferences. You can create a custom plan using our AI-powered diet plan generator!';
    }
    // Default response
    else {
      response = 'I understand you\'re asking about "' + userMessage + '". I can help you with:\n• Navigating to different pages\n• Finding chefs and meal plans\n• Tracking orders\n• Creating diet plans\n• Answering questions about MealWell\n\nTry asking me to "show meal plans" or "find chefs"!';
    }

    return { response, action, actionData };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const { response, action, actionData } = processMessage(userMessage);
      
      const botResponse = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        action,
        actionData
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Execute action if available
      if (action === 'navigate' && actionData) {
        setTimeout(() => {
          navigate(actionData);
          setIsOpen(false); // Close chatbot after navigation
        }, 500);
      }
    }, 1000);
  };

  const handleQuickReply = (reply) => {
    setInput(reply);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-emerald-500/50 transition-all"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-lg">MealWell AI</h3>
                  <p className="text-sm opacity-90">
                    {isAuthenticated ? `Hello, ${user?.name || 'User'}!` : 'Always here to help'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-gray-900 shadow-md'
                  }`}>
                    <p className="whitespace-pre-line">{message.text}</p>
                    {message.action === 'navigate' && (
                      <p className="text-xs mt-2 opacity-75">
                        Navigating...
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 shadow-md rounded-2xl px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-all"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
