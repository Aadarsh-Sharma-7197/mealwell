import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I\'m MealWell AI assistant. How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const quickReplies = [
    'Show meal plans',
    'Find chefs near me',
    'Track my order',
    'Health insights'
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: 'I can help you with that! Let me fetch the information for you.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
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
                  <p className="text-sm opacity-90">Always here to help</p>
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
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(reply)}
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
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all"
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
