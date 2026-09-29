import React, { useEffect } from 'react';
import { 
  FaReact, 
  FaNodeJs, 
  FaDatabase, 
  FaCode, 
  FaGithub, 
  FaServer, 
  FaChartLine, 
  FaRegClock, 
  FaTimesCircle, 
  FaCheckCircle, 
  FaStripe, 
  FaSlack, 
  FaAws, 
  FaPaypal, 
  FaMailchimp, 
  FaFigma, 
  FaGoogle, 
  FaDropbox,
  FaArrowRight 
} from 'react-icons/fa';
import aboutBg from '../assets/heroimageaboutus.jpg';
import whyBetterImg from '../assets/samantha-gades-fIHozNWfcvs-unsplash.jpg';
import journeyImg from '../assets/nick-night-52F2gX0COs4-unsplash.jpg';
import MarqueeSlider from '../components/layout/MarqueeSlider';
import visionImg from '../assets/campaign-creators-qCi_MzVODoU-unsplash.jpg';

function About() {
  // Intersection Observer for scroll animations (Same as Home Page)
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
      
      {/* Hero / Our Vision Section */}
      <header 
        className="relative min-h-[85vh] lg:min-h-screen px-6 md:px-12 bg-cover bg-center bg-no-repeat text-white flex items-center justify-center overflow-hidden pt-20 pb-12" 
        style={{ backgroundImage: `url(${aboutBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0f0518]/95"></div>
        
        <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-left">
            <div className="flex justify-start mb-4 md:mb-6">
              <div className="w-32 md:w-48 h-[3px] bg-gradient-to-r from-[#d100a0] to-transparent shadow-[0_0_25px_rgba(209,0,160,1)] rounded-full"></div>
            </div>
            
            <h1 className="animate-fadeInUp text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3e8ff] to-[#e0aaff] drop-shadow-lg font-heading">
              Our Vision
            </h1>
            
            <p className="animate-fadeInUp text-base sm:text-lg md:text-xl text-gray-200 mb-8 font-description leading-relaxed font-normal" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              Events bring people together. We built EventSphere to make planning easy, so you can stop worrying about management and focus on the <span className="text-[#d100a0] font-bold">experience.</span>
            </p>
          </div>

          <div className="lg:w-1/2 w-full animate-fadeInUp" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(209,0,160,0.25)] border border-white/15 group">
              {/* Image zoom transition same as Home Page */}
              <img src={visionImg} alt="Team Collaborating" className="w-full h-[380px] sm:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-[#1e0b36]/30 to-transparent opacity-80"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Why We Are Better Section */}
      <section className="py-28 px-6 md:px-12 relative z-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate text-center mb-20">
            <div className="flex justify-center mb-4">
              <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight transition-all duration-300">Why We Are Better</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium font-description">A modern approach vs traditional event management hassles</p>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-12">
            <div className="w-full lg:w-1/2 scroll-animate">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(209,0,160,0.25)] border border-white/15 group h-full min-h-[420px]">
                <img src={whyBetterImg} alt="Event Vibe" className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0518] via-[#0f0518]/60 to-transparent opacity-85"></div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              {/* Old Way Card - Applied Home Page Card Transitions */}
              <div className="scroll-animate p-8 sm:p-10 rounded-3xl border border-white/10 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <FaRegClock className="text-8xl text-gray-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-6 flex items-center gap-3">
                  <FaTimesCircle className="text-red-500 text-3xl" /> The Old Way
                </h3>
                <ul className="space-y-5 text-gray-300">
                  <li className="flex items-start gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <div><strong className="text-white">Too Many Tools:</strong> Using many different apps for tickets, sharing, and chatting at the same time.</div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <div><strong className="text-white">No Clear Data:</strong> Not knowing if people actually liked the event or participated in it.</div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <div><strong className="text-white">Doing Everything by Hand:</strong> Sending hundreds of emails one by one and tracking guests in messy spreadsheets.</div>
                  </li>
                </ul>
              </div>

              {/* EventSphere Way Card - Applied Exact Home Page Transitions */}
              <div className="scroll-animate p-8 sm:p-10 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 relative overflow-hidden group">
                <div className="absolute top-0 -right-4 p-4 opacity-15 group-hover:scale-110 transition-transform duration-700">
                  <FaChartLine className="text-9xl text-[#d100a0]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FaCheckCircle className="text-[#d100a0] text-3xl" /> The EventSphere Way
                </h3>
                <ul className="space-y-5 text-gray-200">
                  <li className="flex items-start gap-4 relative z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#d100a0] mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(209,0,160,1)]"></div>
                    <div><strong className="text-white">Everything in One Place:</strong> Manage tickets, payments, and live updates easily from a single dashboard.</div>
                  </li>
                  <li className="flex items-start gap-4 relative z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#d100a0] mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(209,0,160,1)]"></div>
                    <div><strong className="text-white">Smart Insights:</strong> Simple charts and data that show you exactly what your guests need.</div>
                  </li>
                  <li className="flex items-start gap-4 relative z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#d100a0] mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(209,0,160,1)]"></div>
                    <div><strong className="text-white">Automatic Tasks:</strong> Set things up once and let the system handle the hard work automatically.</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="py-28 px-6 md:px-12 relative z-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate text-center mb-20">
            <div className="flex justify-center mb-4">
              <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight transition-all duration-300">Our Journey</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium font-description">How EventSphere evolved into an all-in-one platform</p>
          </div>

          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="w-full lg:w-1/2 scroll-animate">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(209,0,160,0.25)] border border-white/15 group h-full min-h-[450px]">
                <img src={journeyImg} alt="Our Journey" className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-[#0f0518]/30 to-transparent opacity-80"></div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="relative border-l-2 border-[#d100a0]/40 pl-8 space-y-12 ml-4">
                {/* Scroll animate on each phase */}
                <div className="relative scroll-animate transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute left-[-41px] w-5 h-5 rounded-full bg-[#0f0518] border-4 border-[#d100a0] shadow-[0_0_15px_rgba(209,0,160,1)] z-10 transition-transform duration-300 hover:scale-125"></div>
                  <div className="inline-block px-4 py-1 mb-3 rounded-full bg-[#d100a0]/10 border border-[#d100a0]/30 text-[#d100a0] text-xs font-bold tracking-widest uppercase">Phase 01</div>
                  <h3 className="text-2xl font-bold text-white mb-2">The Setup</h3>
                  <p className="text-gray-300 font-description leading-relaxed">We started by building a strong and fast system that can handle many users at once.</p>
                </div>

                <div className="relative scroll-animate transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute left-[-41px] w-5 h-5 rounded-full bg-[#0f0518] border-4 border-white/80 shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10 transition-transform duration-300 hover:scale-125 hover:border-[#d100a0]"></div>
                  <div className="inline-block px-4 py-1 mb-3 rounded-full bg-white/5 border border-white/20 text-white text-xs font-bold tracking-widest uppercase">Phase 02</div>
                  <h3 className="text-2xl font-bold text-white mb-2">The Design</h3>
                  <p className="text-gray-300 font-description leading-relaxed">We wanted the app to look amazing, so we designed a beautiful dark theme that is easy and fun to use.</p>
                </div>

                <div className="relative scroll-animate transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute left-[-42px] w-6 h-6 rounded-full bg-[#d100a0] border-4 border-[#0f0518] shadow-[0_0_20px_rgba(209,0,160,1)] z-10 animate-pulse"></div>
                  <div className="inline-block px-4 py-1 mb-3 rounded-full bg-gradient-to-r from-[#d100a0] to-[#7210a6] text-white shadow-[0_0_15px_rgba(209,0,160,0.5)] text-xs font-bold tracking-widest uppercase">We Are Here</div>
                  <h3 className="text-2xl font-bold text-[#d100a0] mb-2">Going Live</h3>
                  <p className="text-gray-300 font-description leading-relaxed">Making the website public and ensuring it works perfectly without crashing for all our users.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Partners Section - Updated to match Home Page Neon Pink Hover Style */}
      <section className="py-28 px-6 md:px-12 relative z-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="scroll-animate mb-16">
            <div className="flex justify-center mb-4">
              <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight transition-all duration-300">Our Partners</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium font-description">Trusted by leading organizations in the event management and hospitality industry</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              { icon: FaStripe, name: "Stripe", role: "Payment Partner" },
              { icon: FaSlack, name: "Slack", role: "Communications" },
              { icon: FaAws, name: "AWS", role: "Cloud Infrastructure" },
              { icon: FaPaypal, name: "PayPal", role: "Ticketing" },
              { icon: FaMailchimp, name: "Mailchimp", role: "Marketing Integration" },
              { icon: FaFigma, name: "Figma", role: "Event Design" },
              { icon: FaGoogle, name: "Google", role: "Calendar Sync" },
              { icon: FaDropbox, name: "Dropbox", role: "Asset Management" }
            ].map((partner, idx) => (
              <div key={idx} className="scroll-animate p-6 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-center group">
                <partner.icon className="text-4xl md:text-5xl text-gray-400 mb-3 transition-colors duration-300 group-hover:text-[#d100a0]" />
                <p className="text-base text-white font-bold">{partner.name}</p>
                <p className="text-xs text-gray-400 mt-1">{partner.role}</p>
              </div>
            ))}
          </div>

          <div className="scroll-animate text-center mt-12 flex flex-col items-center justify-center">
            <p className="text-gray-300 text-sm mb-4">Join our growing network of industry partners</p>
            {/* Same Gradient Button as Home Page */}
            <button className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_30px_rgba(209,0,160,0.6)] transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_0_50px_rgba(209,0,160,0.9)] hover:border-white/60 active:scale-95 focus:outline-none focus:ring-0 select-none cursor-pointer">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d100a0] to-[#7210a6] blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500 -z-10"></span>
              <span className="relative z-10 tracking-wider font-heading uppercase text-xs sm:text-sm md:text-base">Become a Partner</span>
              <FaArrowRight className="relative z-10 text-base transition-transform duration-300 group-hover:translate-x-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Marquee Divider */}
      <MarqueeSlider words={["Innovation", "Vision", "Community", "Excellence"]} />

      {/* Built With Modern Tools Section - Updated to match Home Page hover style */}
      <section className="py-28 px-6 md:px-12 relative z-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="scroll-animate mb-16">
            <div className="flex justify-center mb-4">
              <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight transition-all duration-300">Built With Modern Tools</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium font-description">Made using the best new technologies for a fast, smooth, and modern website.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              { icon: FaReact, name: "React" },
              { icon: FaCode, name: "Tailwind CSS" },
              { icon: FaNodeJs, name: "Node.js" },
              { icon: FaDatabase, name: "MongoDB" },
              { icon: FaGithub, name: "Git" },
              { icon: FaServer, name: "Express" }
            ].map((tech, idx) => (
              <div key={idx} className="scroll-animate w-32 h-32 md:w-36 md:h-36 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center gap-3 group">
                <tech.icon className="text-4xl md:text-5xl text-gray-400 transition-colors duration-300 group-hover:text-[#d100a0]" />
                <span className="text-xs md:text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;