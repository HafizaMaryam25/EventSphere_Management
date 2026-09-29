import React from 'react';
import { Link } from 'react-router-dom';

import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="text-white py-12 px-6 md:px-12 bg-deep-bg relative overflow-hidden mt-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 max-w-4xl h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,1)]"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 mt-6">
        <div className="flex flex-col items-center text-center">
        
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-[13px] font-bold text-gray-400 uppercase tracking-wide">
          <Link to="/" className="hover:text-magenta-accent transition-colors duration-300">Home</Link>
          <Link to="/features" className="hover:text-magenta-accent transition-colors duration-300">Features</Link>
          <Link to="/about" className="hover:text-magenta-accent transition-colors duration-300">About Us</Link>
          <Link to="/contact" className="hover:text-magenta-accent transition-colors duration-300">Contact Us</Link>
          <Link to="/login" className="hover:text-magenta-accent transition-colors duration-300">Login</Link>
        </div>
        
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="w-10 h-10 flex items-center justify-center rounded bg-white/5 hover:bg-magenta-accent transition text-gray-300 hover:text-white shadow-sm"><FaFacebookF /></a>
          <a href="#" className="w-10 h-10 flex items-center justify-center rounded bg-white/5 hover:bg-magenta-accent transition text-gray-300 hover:text-white shadow-sm"><FaInstagram /></a>
          <a href="#" className="w-10 h-10 flex items-center justify-center rounded bg-white/5 hover:bg-magenta-accent transition text-gray-300 hover:text-white shadow-sm"><FaYoutube /></a>
          <a href="#" className="w-10 h-10 flex items-center justify-center rounded bg-white/5 hover:bg-magenta-accent transition text-gray-300 hover:text-white shadow-sm"><FaLinkedinIn /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
