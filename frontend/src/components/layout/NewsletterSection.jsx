import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaEnvelope } from 'react-icons/fa';
import newsletterBg from '../../assets/contactus-bg.jpg';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Handle newsletter subscription
      console.log('Newsletter subscription:', email);
      alert('Thank you for subscribing to our newsletter!');
      setEmail('');
    }
  };

  return (
    <section className="py-20 px-6 md:px-12 relative overflow-hidden">
      <div 
        className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 25%, #DC2626 75%, #EA580C 100%)',
          boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
        }}
      >
        {/* Background overlay with subtle image */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{ backgroundImage: `url(${newsletterBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        ></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Stay Tuned with Weekly Newsletter
          </h2>

          {/* Email Signup Form */}
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-6">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-6 py-4 rounded-full text-gray-800 placeholder-gray-500 bg-white/95 backdrop-blur-sm border-0 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300"
                required
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
              style={{
                background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                boxShadow: '0 10px 25px rgba(236, 72, 153, 0.4)'
              }}
            >
              Subscribe
            </button>
          </form>

          {/* Privacy Assurance */}
          <p className="text-white/80 text-sm mb-8">
            No worries, we won't spam your inbox
          </p>

          {/* Social Media Links */}
          <div className="flex justify-center gap-6">
            <a 
              href="#" 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group"
              aria-label="Facebook"
            >
              <FaFacebook className="text-white text-xl group-hover:scale-110 transition-transform duration-300" />
              <span className="text-white font-medium">16k</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group"
              aria-label="Instagram"
            >
              <FaInstagram className="text-white text-xl group-hover:scale-110 transition-transform duration-300" />
              <span className="text-white font-medium">22k</span>
            </a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>
    </section>
  );
};

export default NewsletterSection;
