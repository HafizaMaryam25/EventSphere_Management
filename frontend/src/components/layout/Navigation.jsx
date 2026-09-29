import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'FEATURES', path: '/features' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'CONTACT US', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#12071f]/80 backdrop-blur-md border-b border-white/10 px-6 md:px-12 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* EventSphere Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <svg 
            className="w-7 h-7 text-[#d100a0] drop-shadow-[0_0_8px_rgba(209,0,160,0.8)] transition-transform duration-300 group-hover:scale-110" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            {/* Sparkle Logo Icon */}
            <path d="M12 2C12 6.5 15.5 10 20 10C15.5 10 12 13.5 12 18C12 13.5 8.5 10 4 10C8.5 10 12 6.5 12 2Z" />
            <path d="M19 2H21V4H23V6H21V8H19V6H17V4H19V2Z" />
            <circle cx="5" cy="19" r="1.5" />
          </svg>
          <span className="text-xl md:text-2xl font-black tracking-tight text-white font-heading">
            EventSphere
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-8 text-xs lg:text-sm font-bold tracking-wider text-gray-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  className={`transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(209,0,160,0.9)] ${
                    isActive ? 'text-[#d100a0] drop-shadow-[0_0_10px_rgba(209,0,160,0.8)]' : ''
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
          
          {/* Exact Login Button Style from Screenshot */}
          <li>
            <Link 
              to="/login" 
              className="px-6 py-2 rounded-full border border-white/70 text-white font-semibold text-xs tracking-wider uppercase hover:border-[#d100a0] hover:bg-[#d100a0] hover:shadow-[0_0_20px_rgba(209,0,160,0.6)] transition-all duration-300 inline-block"
            >
              LOGIN
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-white text-2xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-6 px-4 bg-[#12071f]/95 rounded-2xl border border-white/10 backdrop-blur-xl flex flex-col gap-4 text-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`py-2 text-sm font-bold tracking-wider text-gray-200 hover:text-[#d100a0] transition-colors ${
                location.pathname === link.path ? 'text-[#d100a0]' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/login"
            onClick={() => setIsOpen(false)}
            className="mt-2 py-2.5 rounded-full border border-white/70 text-white font-semibold text-xs tracking-wider uppercase hover:border-[#d100a0] hover:bg-[#d100a0]"
          >
            LOGIN
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navigation;