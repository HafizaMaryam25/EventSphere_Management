import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock, 
  FaQuestionCircle, 
  FaArrowRight, 
  FaCheck, 
  FaShieldAlt, 
  FaPlug 
} from 'react-icons/fa';
import contactBg from '../assets/contactus.jpg';
import MarqueeSlider from '../components/layout/MarqueeSlider';
import faqImg from '../assets/teemu-paananen-bzdhc5b3Bxs-unsplash.jpg';
import formImg from '../assets/rachel-coyne-U7HLzMO4SIY-unsplash (1).jpg';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Simulate form submission
    console.log('Contact form submitted:', formData);
    setSuccess('Thank you for your message! We\'ll get back to you soon.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen selection:bg-[#d100a0] selection:text-white bg-transparent">
      {/* Hero Section - Fixed to full screen */}
      <header 
        className="relative w-full min-h-screen px-6 md:px-12 bg-cover bg-center bg-no-repeat text-white flex items-center justify-center overflow-hidden pt-20 pb-12"
        style={{ backgroundImage: `url(${contactBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#0f0518]"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center justify-center">
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="w-32 md:w-48 h-[3px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_25px_rgba(209,0,160,1)] rounded-full"></div>
          </div>
          
          <h1 className="animate-fadeInUp text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 md:mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3e8ff] to-[#e0aaff] drop-shadow-lg font-heading">
            Contact Us
          </h1>
          
          <p className="animate-fadeInUp text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-description leading-relaxed font-normal" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            Have questions about EventSphere? Our highly responsive support team is on standby to help you host an unforgettable experience.
          </p>
        </div>
      </header>

      {/* Contact Cards Section */}
      <section className="py-20 px-6 md:px-12 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Email Card */}
            <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.3)] transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 flex flex-col items-start justify-center">
              <div className="w-14 h-14 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
                <FaEnvelope className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Email</h3>
              <p className="text-gray-300 text-sm mb-1 break-all font-medium">support@eventsphere.com</p>
              <p className="text-gray-300 text-sm break-all font-medium">info@eventsphere.com</p>
            </div>
            
            {/* Phone Card */}
            <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.3)] transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 flex flex-col items-start justify-center">
              <div className="w-14 h-14 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
                <FaPhone className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Phone</h3>
              <p className="text-gray-300 text-sm mb-1 font-medium">+1 (800) 555-0199</p>
              <p className="text-gray-300 text-sm font-medium">+1 (800) 555-0100</p>
            </div>
            
            {/* Office Card */}
            <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.3)] transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 flex flex-col items-start justify-center">
              <div className="w-14 h-14 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
                <FaMapMarkerAlt className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Office</h3>
              <p className="text-gray-300 text-sm mb-1 font-medium">EventSphere Headquarters</p>
              <p className="text-gray-300 text-sm font-medium">100 Innovation Way, Tech City</p>
            </div>
            
            {/* Business Hours Card */}
            <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.3)] transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 flex flex-col items-start justify-center">
              <div className="w-14 h-14 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
                <FaClock className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Business Hours</h3>
              <p className="text-gray-300 text-sm mb-1 font-medium">Mon-Fri: 9AM - 6PM</p>
              <p className="text-gray-300 text-sm font-medium">Sat-Sun: 10AM - 4PM</p>
            </div>
          </div>
        </div>
      </section>

      <MarqueeSlider words={["Support", "Connect", "Help", "Reach Out"]} />

      {/* FAQ Section */}
      <section className="py-28 px-6 md:px-12 relative z-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate text-center mb-20">
            <div className="flex justify-center mb-4">
              <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium font-description">Some Common Questions</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-stretch gap-12">
            <div className="w-full lg:w-1/2 scroll-animate hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(209,0,160,0.25)] border border-white/15 group h-full min-h-[500px]">
                <img src={faqImg} alt="FAQ Support" className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-[#1e0b36]/40 to-transparent opacity-80"></div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              {[
                {
                  icon: FaQuestionCircle,
                  title: "How do I get started with EventSphere?",
                  desc: "Simply sign up for a free account, complete your organizer profile, and you can publish your first event in under two minutes!"
                },
                {
                  icon: FaCheck,
                  title: "What types of events can I manage?",
                  desc: "You can manage literally any kind of event—from intimate 10-person online workshops to massive 5,000+ attendee regional conferences."
                },
                {
                  icon: FaShieldAlt,
                  title: "Is my data secure?",
                  desc: "Absolutely. We encrypt all user data and payment information using the highest industry standards to guarantee your attendees' safety."
                },
                {
                  icon: FaPlug,
                  title: "Can I integrate with other tools?",
                  desc: "Yes! EventSphere seamlessly integrates with your favorite tools like Zoom, Calendly, and Zapier to supercharge your workflow."
                }
              ].map((faq, idx) => (
                <div key={idx} className="scroll-animate group relative overflow-hidden rounded-3xl p-8 border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 transition-all duration-500 backdrop-blur-xl bg-white/5 flex flex-col justify-between">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
                      <faq.icon className="text-xl text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d100a0] transition-colors duration-300">{faq.title}</h3>
                      <p className="text-gray-300 leading-relaxed font-normal">{faq.desc}</p>
                    </div>
                  </div>
                  <Link to="/features" className="text-[#d100a0] hover:text-white font-semibold transition-colors duration-300 inline-flex items-center gap-2 group/link mt-2 self-start">
                    <span>Learn more</span>
                    <FaArrowRight className="text-xs transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-28 px-6 md:px-12 relative z-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(209,0,160,0.25)] flex flex-col lg:flex-row backdrop-blur-xl bg-white/5">
            
            <div className="w-full lg:w-5/12 relative hidden lg:block">
              <img src={formImg} alt="Contact Support Team" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f0518]/80 via-[#1e0b36]/60 to-transparent"></div>
            </div>

            <div className="w-full lg:w-7/12 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex mb-4">
                  <div className="w-32 h-[2px] bg-gradient-to-r from-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2 font-heading tracking-tight">Send Us a Message</h2>
                <p className="text-gray-300 font-medium font-description">We'd love to hear from you</p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-gray-200 text-sm font-semibold mb-2 group-focus-within:text-[#d100a0] transition-colors duration-300">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d100a0] focus:bg-white/10 focus:shadow-[0_0_20px_rgba(209,0,160,0.3)] transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-gray-200 text-sm font-semibold mb-2 group-focus-within:text-[#d100a0] transition-colors duration-300">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d100a0] focus:bg-white/10 focus:shadow-[0_0_20px_rgba(209,0,160,0.3)] transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-gray-200 text-sm font-semibold mb-2 group-focus-within:text-[#d100a0] transition-colors duration-300">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d100a0] focus:bg-white/10 focus:shadow-[0_0_20px_rgba(209,0,160,0.3)] transition-all duration-300"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-gray-200 text-sm font-semibold mb-2 group-focus-within:text-[#d100a0] transition-colors duration-300">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d100a0] focus:bg-white/10 focus:shadow-[0_0_20px_rgba(209,0,160,0.3)] transition-all duration-300 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>
                
                {error && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-300 text-sm backdrop-blur-md">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-sm backdrop-blur-md">
                    {success}
                  </div>
                )}
                
                <button
                  type="submit"
                  className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_30px_rgba(209,0,160,0.6)] transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(209,0,160,0.9)] hover:border-white/60 active:scale-95 focus:outline-none cursor-pointer"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                  <span className="relative z-10 tracking-wider font-heading uppercase text-sm sm:text-base">Send Message</span>
                  <FaArrowRight className="relative z-10 text-base transition-transform duration-300 group-hover:translate-x-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;