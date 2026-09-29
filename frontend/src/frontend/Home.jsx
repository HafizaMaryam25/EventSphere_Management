import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaBolt, 
  FaQuoteLeft, 
  FaCheckCircle, 
  FaRocket, 
  FaChartLine, 
  FaEnvelope, 
  FaUserPlus, 
  FaCalendarCheck, 
  FaArrowRight 
} from 'react-icons/fa';

import heroBg from '../assets/heroimage1.jpg';
import NewsletterSection from '../components/layout/NewsletterSection';
import MarqueeSlider from '../components/layout/MarqueeSlider';
import howItWorksImg from '../assets/heroimage5.jpg';
import techSummitImg from '../assets/techsummit.jpg';
import startupMeetupImg from '../assets/startupmeetup.jpg';
import productLaunchImg from '../assets/productlaucnhparty.jpg';

function Home() {
  const [eventsCount, setEventsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [satisfactionCount, setSatisfactionCount] = useState(0);
  
  const eventsRef = useRef(null);
  const usersRef = useRef(null);
  const satisfactionRef = useRef(null);

  const animateCounter = (ref, setter, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.floor(start));
      }
    }, 16);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target === eventsRef.current) {
              animateCounter(eventsRef, setEventsCount, 10000);
            }
            if (entry.target === usersRef.current) {
              animateCounter(usersRef, setUsersCount, 50000);
            }
            if (entry.target === satisfactionRef.current) {
              animateCounter(satisfactionRef, setSatisfactionCount, 99);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (eventsRef.current) observer.observe(eventsRef.current);
    if (usersRef.current) observer.observe(usersRef.current);
    if (satisfactionRef.current) observer.observe(satisfactionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

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
      {/* Hero Section */}
      <header 
        className="relative min-h-[90vh] lg:min-h-screen px-6 md:px-12 bg-cover bg-center bg-no-repeat text-white flex items-center justify-center overflow-hidden pt-20 pb-12" 
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0f0518]/95"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center justify-center">
          
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="w-32 md:w-48 h-[3px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_25px_rgba(209,0,160,1)] rounded-full"></div>
          </div>
          
          <h1 className="animate-fadeInUp text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight sm:leading-tight md:leading-tight mb-4 md:mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3e8ff] to-[#e0aaff] drop-shadow-lg font-heading">
            Manage Your Events With Event Sphere
          </h1>
          
          <p className="animate-fadeInUp text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-description leading-relaxed font-normal" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            Your all-in-one platform for seamless event management. Automate ticket sales, marketing, and engagement tracking.
          </p>
          
          <div className="animate-fadeInUp flex flex-col sm:flex-row gap-5 justify-center items-center" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Link 
              to="/signup" 
              className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_30px_rgba(209,0,160,0.6)] transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_0_50px_rgba(209,0,160,0.9)] hover:border-white/60 active:scale-95 focus:outline-none focus:ring-0 select-none cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d100a0] to-[#7210a6] blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500 -z-10"></span>
              <span className="relative z-10 tracking-wider font-heading uppercase text-xs sm:text-sm md:text-base">Get Started</span>
              <FaArrowRight className="relative z-10 text-base transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>

        </div>
      </header>

      {/* Stats Counter Section */}
      <section className="py-20 px-6 md:px-12 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div ref={eventsRef} className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.3)] cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
                <FaCalendarCheck className="text-3xl text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-heading tracking-tight">
                {eventsCount.toLocaleString()}+
              </div>
              <p className="text-gray-300 text-lg font-medium">Events Managed</p>
            </div>
            
            <div ref={usersRef} className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.3)] cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
                <FaUsers className="text-3xl text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-heading tracking-tight">
                {usersCount.toLocaleString()}+
              </div>
              <p className="text-gray-300 text-lg font-medium">Active Users</p>
            </div>
            
            <div ref={satisfactionRef} className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.3)] cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
                <FaChartLine className="text-3xl text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-heading tracking-tight">
                {satisfactionCount}%
              </div>
              <p className="text-gray-300 text-lg font-medium">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-28 px-6 md:px-12 relative z-20">
        <div className="flex justify-center mb-6">
          <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
        </div>
        <h2 className="scroll-animate text-4xl md:text-6xl font-black text-white mb-6 text-center transition-all duration-300 cursor-default drop-shadow-md font-heading tracking-tight">
          Why You Should Join The Event ?
        </h2>
        <p className="scroll-animate text-xl text-gray-300 mb-20 max-w-2xl mx-auto font-medium text-center font-description">
          Powerful features designed to make event management effortless and enjoyable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: FaCalendarAlt, title: "Easy Scheduling", list: ["Drag & drop calendar", "Auto-reminders", "Time zone support"] },
            { icon: FaUsers, title: "Invite Friends", list: ["Bulk invitations", "RSVP tracking", "Guest management"] },
            { icon: FaBolt, title: "Simple & Fast", list: ["Quick setup", "Instant updates", "Mobile optimized"] },
            { icon: FaRocket, title: "Smart Analytics", list: ["Real-time insights", "Attendance tracking", "Export reports"] },
            { icon: FaEnvelope, title: "Email Marketing", list: ["Custom templates", "Automated campaigns", "Open tracking"] },
            { icon: FaUserPlus, title: "Team Collaboration", list: ["Role-based access", "Shared calendars", "Task assignments"] }
          ].map((feature, idx) => (
            <div key={idx} className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <div className="space-y-3 mb-6">
                  {feature.list.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <FaCheckCircle className="text-[#d100a0] text-sm flex-shrink-0" />
                      <span className="text-gray-300 font-normal">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[#d100a0] hover:text-white font-semibold transition-colors duration-300 inline-flex items-center gap-1 group cursor-pointer">
                Learn More <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-28 px-6 md:px-12 relative z-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate text-center mb-20">
            <div className="flex justify-center mb-4">
              <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium font-description">Get started with EventSphere in four simple steps</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { num: "1", title: "Sign Up", desc: "Create your free account in seconds and unlock powerful tools." },
                { num: "2", title: "Create Event", desc: "Set up your event with our intuitive interface and options." },
                { num: "3", title: "Invite Guests", desc: "Send invitations and track RSVPs with our smart system." },
                { num: "4", title: "Manage", desc: "Monitor attendance, send updates, and analyze performance." }
              ].map((step, idx) => (
                <div key={idx} className="visible p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d100a0]/50 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(209,0,160,0.25)] transition-all duration-300 text-center backdrop-blur-md hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
                    <span className="text-xl font-black text-white">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="lg:w-1/2 w-full visible">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(209,0,160,0.25)] border border-white/15 group">
                <img src={howItWorksImg} alt="How EventSphere Works" className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-[#1e0b36]/30 to-transparent opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-28 px-6 md:px-12 relative z-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate text-center mb-20">
            <div className="flex justify-center mb-4">
              <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">Upcoming Events</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium font-description">Discover amazing events happening near you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { img: techSummitImg, title: "Tech Summit 2024", desc: "Annual technology conference featuring keynote speakers and workshops.", attendees: "250+ Attendees", date: "Dec 15, 2024" },
              { img: startupMeetupImg, title: "Startup Meetup", desc: "Connect with entrepreneurs and investors in your area.", attendees: "100+ Attendees", date: "Dec 18, 2024" },
              { img: productLaunchImg, title: "Product Launch Party", desc: "Celebrate the launch of our latest innovative product.", attendees: "500+ Attendees", date: "Dec 20, 2024" }
            ].map((evt, idx) => (
              <div key={idx} className="scroll-animate group cursor-pointer rounded-3xl overflow-hidden border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] transition-all duration-500 flex flex-col h-full backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:-translate-y-2">
                <div className="h-52 overflow-hidden relative">
                  <img src={evt.img} alt={evt.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518]/90 via-transparent to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#d100a0] transition-colors duration-300">{evt.title}</h3>
                  <p className="text-gray-300 mb-6 flex-grow leading-relaxed">{evt.desc}</p>
                  <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-white/10">
                    <span className="text-[#d100a0] font-semibold">{evt.attendees}</span>
                    <span className="text-gray-400">{evt.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="scroll-animate text-center mt-12 flex justify-center">
            <button 
              type="button" 
              className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_30px_rgba(209,0,160,0.6)] transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_0_50px_rgba(209,0,160,0.9)] hover:border-white/60 active:scale-95 focus:outline-none focus:ring-0 select-none cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d100a0] to-[#7210a6] blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500 -z-10"></span>
              <span className="relative z-10 tracking-wider font-heading uppercase text-xs sm:text-sm md:text-base">View All Events</span>
              <FaArrowRight className="relative z-10 text-base transition-transform duration-300 group-hover:translate-x-2" />
            </button>
          </div>
        </div>
      </section>

      <MarqueeSlider words={["Ticketing", "Analytics", "Networking", "Management"]} />

      {/* Testimonials Section */}
      <section className="py-28 px-6 md:px-12 relative z-20 border-t border-white/10">
        <div className="scroll-animate text-center mb-20">
          <div className="flex justify-center mb-4">
            <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">What Our Users Say</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium font-description">Real stories from real customers who love EventSphere</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 flex flex-col h-full">
            <FaQuoteLeft className="text-3xl text-[#d100a0] mb-4 opacity-80" />
            <p className="text-gray-300 mb-6 flex-grow leading-relaxed">
              EventSphere has completely transformed how we manage our tech conferences. The analytics and guest management features are incredible, saving us hours of work every event.
            </p>
            <div className="flex items-center mt-auto pt-4 border-t border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-[#d100a0] to-[#7210a6] rounded-full flex items-center justify-center mr-3 shadow-md">
                <span className="text-white font-bold text-sm">JD</span>
              </div>
              <h4 className="font-bold text-white">Jhon doe</h4>
            </div>
          </div>
          
          <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 flex flex-col h-full">
            <FaQuoteLeft className="text-3xl text-[#d100a0] mb-4 opacity-80" />
            <p className="text-gray-300 mb-6 flex-grow leading-relaxed">
              The networking features are phenomenal. We've doubled our event attendance and the RSVP tracking system works flawlessly.
            </p>
            <div className="flex items-center mt-auto pt-4 border-t border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-full flex items-center justify-center mr-3 shadow-md">
                <span className="text-white font-bold text-sm">SR</span>
              </div>
              <h4 className="font-bold text-white">Sarah Richardson</h4>
            </div>
          </div>
          
          <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 flex flex-col h-full">
            <FaQuoteLeft className="text-3xl text-[#d100a0] mb-4 opacity-80" />
            <p className="text-gray-300 mb-6 flex-grow leading-relaxed">
              Best event Management platform we've ever used. The team collaboration tools and analytics have made our events more successful than ever.
            </p>
            <div className="flex items-center mt-auto pt-4 border-t border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-rose-600 rounded-full flex items-center justify-center mr-3 shadow-md">
                <span className="text-white font-bold text-sm">MJ</span>
              </div>
              <h4 className="font-bold text-white">Michael Johnson</h4>
            </div>
          </div>
        </div>
        
        <div className="scroll-animate text-center mt-12 flex justify-center">
          <button 
            type="button" 
            className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_30px_rgba(209,0,160,0.6)] transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_0_50px_rgba(209,0,160,0.9)] hover:border-white/60 active:scale-95 focus:outline-none focus:ring-0 select-none cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d100a0] to-[#7210a6] blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500 -z-10"></span>
            <span className="relative z-10 tracking-wider font-heading uppercase text-xs sm:text-sm md:text-base">Read More Reviews</span>
            <FaArrowRight className="relative z-10 text-base transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}

export default Home;