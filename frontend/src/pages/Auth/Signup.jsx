import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Shield } from 'lucide-react';
import { FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authBg from '../../assets/heroimage4.jpg';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Attendee',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Signup specific validations
  const validateForm = () => {
    const { name, email, password } = formData;

    if (name.trim().length < 3) {
      toast.error('Name must be at least 3 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await signup(formData);

      if (result.success) {
        toast.success('Account Created! Moving to Login...', {
          position: 'top-right',
          autoClose: 2000,
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(result.message || 'Signup failed!');
      }
    } catch (err) {
      toast.error('Server Error. Please try later.');
    }
  };

  return (
    <div
      className="
        min-h-screen
        w-full
        flex
        items-center
        justify-center
        px-4
        py-8
        relative
        bg-cover
        bg-center
        bg-no-repeat
        selection:bg-[#d100a0]
        selection:text-white
      "
      style={{
        backgroundImage: `url(${authBg})`,
      }}
    >
      {/* =========================================================
          BACKGROUND OVERLAY
      ========================================================= */}
      <div
        className="
          absolute
          inset-0
          z-0
          bg-gradient-to-b
          from-black/80
          via-[#100619]/90
          to-[#0c0414]/95
        "
      />

      {/* Extra purple ambient glow */}
      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[420px]
          h-[420px]
          rounded-full
          bg-[#d100a0]/15
          blur-[130px]
          pointer-events-none
          z-0
        "
      />

      {/* =========================================================
          SIGNUP CARD (PROPERLY PROPORTIONED)
      ========================================================= */}
      <div
        className="
          animate-fadeInUp
          relative
          z-10
          w-full
          max-w-[460px]
          p-6
          sm:p-7
          rounded-[24px]

          /* CARD COLOR */
          bg-gradient-to-br
          from-[#2a1935]/95
          via-[#24172d]/95
          to-[#1d1227]/95

          /* CARD BORDER */
          border
          border-[#8d4c91]/35

          /* GLASS EFFECT */
          backdrop-blur-2xl

          /* PURPLE SHADOW */
          shadow-[0_0_50px_rgba(140,38,137,0.28)]

          transition-all
          duration-500

          hover:border-[#d100a0]/50
          hover:shadow-[0_0_60px_rgba(209,0,160,0.32)]
        "
      >
        {/* =========================================================
            TOP DECORATIVE NEON LINE
        ========================================================= */}
        <div className="flex justify-center mb-3">
          <div
            className="
              w-20
              sm:w-24
              h-[3px]
              rounded-full
              bg-gradient-to-r
              from-transparent
              via-[#d100a0]
              to-transparent
              shadow-[0_0_15px_rgba(209,0,160,0.9)]
            "
          />
        </div>

        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="text-center mb-5">
          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              group
              cursor-pointer
              mb-1.5
            "
          >
            {/* EventSphere Icon */}
            <svg
              className="
                w-6
                h-6
                text-[#d100a0]
                drop-shadow-[0_0_10px_rgba(209,0,160,0.9)]
                transition-transform
                duration-300
                group-hover:scale-110
              "
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C12 6.5 15.5 10 20 10C15.5 10 12 13.5 12 18C12 13.5 8.5 10 4 10C8.5 10 12 6.5 12 2Z" />
              <path d="M19 2H21V4H23V6H21V8H19V6H17V4H19V2Z" />
              <circle cx="5" cy="19" r="1.5" />
            </svg>

            <span
              className="
                text-xl
                sm:text-2xl
                font-black
                tracking-tight
                text-white
                font-heading
              "
            >
              EventSphere
            </span>
          </Link>

          <h1
            className="
              text-xl
              sm:text-2xl
              font-black
              text-transparent
              bg-clip-text
              bg-gradient-to-r
              from-white
              via-[#f3e8ff]
              to-[#e0aaff]
              font-heading
              tracking-tight
            "
          >
            Join Us
          </h1>

          <p
            className="
              text-gray-300
              text-xs
              sm:text-sm
              font-medium
              mt-1
            "
          >
            Create your account to start managing events
          </p>
        </div>

        {/* =========================================================
            FORM
        ========================================================= */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* FULL NAME */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300 ml-0.5">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 text-[#aaa0b2] pointer-events-none" size={17} />
              <input
                type="text"
                name="name"
                className="
                  w-full pl-10 pr-4 py-2.5 bg-[#34253b]/80 border border-[#806582]/35 rounded-xl
                  text-white placeholder-[#92869a] focus:outline-none focus:border-[#d100a0]
                  focus:ring-1 focus:ring-[#d100a0] transition-all text-xs sm:text-sm font-medium backdrop-blur-md
                  hover:bg-[#3a2942]/90 hover:border-[#95699a]/50
                "
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* EMAIL ADDRESS */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300 ml-0.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-[#aaa0b2] pointer-events-none" size={17} />
              <input
                type="email"
                name="email"
                className="
                  w-full pl-10 pr-4 py-2.5 bg-[#34253b]/80 border border-[#806582]/35 rounded-xl
                  text-white placeholder-[#92869a] focus:outline-none focus:border-[#d100a0]
                  focus:ring-1 focus:ring-[#d100a0] transition-all text-xs sm:text-sm font-medium backdrop-blur-md
                  hover:bg-[#3a2942]/90 hover:border-[#95699a]/50
                "
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300 ml-0.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-[#aaa0b2] pointer-events-none" size={17} />
              <input
                type="password"
                name="password"
                className="
                  w-full pl-10 pr-4 py-2.5 bg-[#34253b]/80 border border-[#806582]/35 rounded-xl
                  text-white placeholder-[#92869a] focus:outline-none focus:border-[#d100a0]
                  focus:ring-1 focus:ring-[#d100a0] transition-all text-xs sm:text-sm font-medium backdrop-blur-md
                  hover:bg-[#3a2942]/90 hover:border-[#95699a]/50
                "
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ROLE SELECT */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300 ml-0.5">
              I am an
            </label>
            <div className="relative flex items-center">
              <Shield className="absolute left-3.5 text-[#aaa0b2] pointer-events-none" size={17} />
              <select
                name="role"
                className="
                  w-full pl-10 pr-10 py-2.5 bg-[#34253b]/80 border border-[#806582]/35 rounded-xl
                  text-white focus:outline-none focus:border-[#d100a0] focus:ring-1 focus:ring-[#d100a0]
                  transition-all text-xs sm:text-sm font-medium backdrop-blur-md hover:bg-[#3a2942]/90
                  hover:border-[#95699a]/50 cursor-pointer appearance-none
                "
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Attendee" className="bg-[#24172d] text-white">Attendee</option>
                <option value="Exhibitor" className="bg-[#24172d] text-white">Exhibitor</option>
              </select>
              <div className="absolute right-3.5 pointer-events-none text-[#aaa0b2]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* CREATE ACCOUNT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              className="
                group relative w-full inline-flex items-center justify-center gap-2 px-6 py-3
                font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border
                border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8]
                shadow-[0_0_20px_rgba(209,0,160,0.5)] transition-all duration-300 hover:scale-[1.01]
                hover:shadow-[0_0_30px_rgba(209,0,160,0.8)] active:scale-95 focus:outline-none cursor-pointer
              "
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10 tracking-wider font-heading uppercase text-xs sm:text-sm">
                Create Account
              </span>
              <FaArrowRight className="relative z-10 text-xs sm:text-sm transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </form>

        {/* FOOTER */}
        <div className="mt-5 text-center text-xs sm:text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#d100a0] font-bold hover:text-[#f02ac4] transition-colors hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;