import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChartLine, 
  FaTicketAlt, 
  FaShieldAlt, 
  FaHeadset, 
  FaClock, 
  FaCheckCircle, 
  FaArrowRight, 
  FaStar, 
  FaLock, 
  FaCreditCard, 
  FaGraduationCap, 
  FaCloud, 
  FaTachometerAlt, 
  FaUserCheck, 
  FaDollarSign, 
  FaPercentage 
} from 'react-icons/fa';

import featuresBg from '../assets/heroimage6.jpg';
import MarqueeSlider from '../components/layout/MarqueeSlider';

import analyticsImg from '../assets/kate-trysh-ZUWls_bDgAk-unsplash.jpg';
import ticketsImg from '../assets/alexandre-pellaes-6vAjp0pscX0-unsplash.jpg';
import securityImg from '../assets/product-school-nOvIa_x_tfo-unsplash.jpg';

function Features() {
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
        className="relative w-full min-h-screen px-6 md:px-12 bg-cover bg-center bg-no-repeat text-white flex items-center justify-center overflow-hidden pt-28 pb-16" 
        style={{ backgroundImage: `url(${featuresBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0f0518]/95"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center justify-center">
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="w-32 md:w-48 h-[3px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_25px_rgba(209,0,160,1)] rounded-full"></div>
          </div>
          
          <h1 className="animate-fadeInUp text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight sm:leading-tight mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3e8ff] to-[#e0aaff] drop-shadow-lg font-heading">
            Transform Your Events with EventSphere
          </h1>
          
          <p className="animate-fadeInUp text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-description leading-relaxed font-normal" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            EventSphere empowers organizers with powerful tools to create, manage, and analyze events of any size.
          </p>
        </div>
      </header>

      {/* Real-Time Analytics Section */}
      <section className="py-28 px-6 md:px-12 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate text-center mb-20">
            <div className="w-16 h-16 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
              <FaTachometerAlt className="text-3xl text-white" />
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">Real-Time Analytics</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium font-description">Make data-driven decisions with live insights into your event performance</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
            <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(209,0,160,0.4)]">
                  <FaChartLine className="text-xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Attendance Insights</h3>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-center gap-3"><FaCheckCircle className="text-[#d100a0] text-sm flex-shrink-0" /> Live check-in</li>
                  <li className="flex items-center gap-3"><FaCheckCircle className="text-[#d100a0] text-sm flex-shrink-0" /> Peak analysis</li>
                  <li className="flex items-center gap-3"><FaCheckCircle className="text-[#d100a0] text-sm flex-shrink-0" /> Demographics</li>
                </ul>
              </div>

              <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(209,0,160,0.4)]">
                  <FaDollarSign className="text-xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Revenue Tracking</h3>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-center gap-3"><FaCheckCircle className="text-[#d100a0] text-sm flex-shrink-0" /> Sales monitoring</li>
                  <li className="flex items-center gap-3"><FaCheckCircle className="text-[#d100a0] text-sm flex-shrink-0" /> Forecasting</li>
                  <li className="flex items-center gap-3"><FaCheckCircle className="text-[#d100a0] text-sm flex-shrink-0" /> Profit margins</li>
                </ul>
              </div>

              <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5 sm:col-span-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(209,0,160,0.4)]">
                  <FaUserCheck className="text-xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Engagement Metrics</h3>
                <ul className="space-y-3 text-gray-300 text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <li className="flex items-center gap-3"><FaCheckCircle className="text-[#d100a0] text-sm flex-shrink-0" /> Session rates</li>
                  <li className="flex items-center gap-3"><FaCheckCircle className="text-[#d100a0] text-sm flex-shrink-0" /> Networking</li>
                  <li className="flex items-center gap-3"><FaCheckCircle className="text-[#d100a0] text-sm flex-shrink-0" /> Feedback analysis</li>
                  <li className="flex items-center gap-3"><FaCheckCircle className="text-[#d100a0] text-sm flex-shrink-0" /> Social engagement</li>
                </ul>
              </div>
            </div>

            <div className="lg:w-1/2 w-full scroll-animate">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(209,0,160,0.25)] border border-white/15 group">
                <img src={analyticsImg} alt="Analytics Dashboard" className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-[#1e0b36]/30 to-transparent opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Ticketing Section */}
      <section className="py-28 px-6 md:px-12 relative z-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate text-center mb-20">
            <div className="w-16 h-16 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
              <FaTicketAlt className="text-3xl text-white" />
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">Advanced Ticketing & Pricing</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium font-description">Flexible pricing strategies to maximize attendance and revenue</p>
          </div>

          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 w-full scroll-animate">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(209,0,160,0.25)] border border-white/15 group">
                <img src={ticketsImg} alt="Ticketing" className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-[#1e0b36]/30 to-transparent opacity-80"></div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full grid grid-cols-1 gap-6">
              <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(209,0,160,0.4)]">
                  <FaClock className="text-xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Early Bird Pricing</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3"><FaCheckCircle className="text-[#d100a0] text-sm mt-1 flex-shrink-0" /> <div><strong className="text-white">Tiered Structure:</strong> Auto-updating prices based on limits or dates.</div></li>
                  <li className="flex items-start gap-3"><FaCheckCircle className="text-[#d100a0] text-sm mt-1 flex-shrink-0" /> <div><strong className="text-white">Limited Quantity:</strong> Create urgency with slot allocations.</div></li>
                </ul>
              </div>

              <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(209,0,160,0.4)]">
                  <FaPercentage className="text-xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Discount Codes</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3"><FaCheckCircle className="text-[#d100a0] text-sm mt-1 flex-shrink-0" /> <div><strong className="text-white">Custom Generation:</strong> Create unlimited promo codes easily.</div></li>
                  <li className="flex items-start gap-3"><FaCheckCircle className="text-[#d100a0] text-sm mt-1 flex-shrink-0" /> <div><strong className="text-white">Advanced Targeting:</strong> Assign codes to specific user groups.</div></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Support Section */}
      <section className="py-28 px-6 md:px-12 relative z-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate text-center mb-20">
            <div className="w-16 h-16 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
              <FaShieldAlt className="text-3xl text-white" />
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">Security & Support</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium font-description">Your data and events are protected with industry-leading security measures</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(209,0,160,0.4)]">
                  <FaLock className="text-xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Data Protection</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• GDPR compliant</li>
                  <li>• E2E encryption</li>
                </ul>
              </div>

              <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(209,0,160,0.4)]">
                  <FaCreditCard className="text-xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Payment Security</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• PCI DSS certified</li>
                  <li>• Fraud detection</li>
                </ul>
              </div>

              <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(209,0,160,0.4)]">
                  <FaHeadset className="text-xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">24/7 Support</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Live chat support</li>
                  <li>• Dedicated managers</li>
                </ul>
              </div>

              <div className="scroll-animate p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] hover:bg-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(209,0,160,0.4)]">
                  <FaGraduationCap className="text-xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Resources</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Video tutorials</li>
                  <li>• Weekly webinars</li>
                </ul>
              </div>
            </div>

            <div className="lg:w-1/2 w-full scroll-animate">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(209,0,160,0.25)] border border-white/15 group">
                <img src={securityImg} alt="Security and Support" className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-[#1e0b36]/30 to-transparent opacity-80"></div>
              </div>
            </div>
          </div>

          <div className="scroll-animate mt-12 p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] transition-all duration-500 backdrop-blur-xl bg-white/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(209,0,160,0.4)]">
                <FaCloud className="text-xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Backup & Disaster Recovery</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
              <div>
                <strong className="text-white">Automated Backups</strong>
                <p className="text-sm mt-2">Hourly backups with 30-day retention</p>
              </div>
              <div>
                <strong className="text-white">99.9% Uptime SLA</strong>
                <p className="text-sm mt-2">Guaranteed availability with compensation</p>
              </div>
              <div>
                <strong className="text-white">Instant Recovery</strong>
                <p className="text-sm mt-2">Quick rollback and data restoration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarqueeSlider words={["Automation", "Insights", "Security", "Scalability"]} />

      {/* Success Metrics Section */}
      <section className="py-28 px-6 md:px-12 relative z-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate text-center mb-20">
            <div className="w-16 h-16 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(209,0,160,0.4)]">
              <FaStar className="text-3xl text-white" />
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">Proven Success Metrics</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium font-description">See how EventSphere delivers real results for event organizers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="scroll-animate text-center p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-heading tracking-tight drop-shadow-[0_0_15px_rgba(209,0,160,0.8)]">85%</div>
              <p className="text-white font-bold mb-2">Increase in Attendance</p>
              <p className="text-gray-300 text-sm">Average growth seen by our customers</p>
            </div>

            <div className="scroll-animate text-center p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-heading tracking-tight drop-shadow-[0_0_15px_rgba(209,0,160,0.8)]">92%</div>
              <p className="text-white font-bold mb-2">Customer Satisfaction</p>
              <p className="text-gray-300 text-sm">Based on 10,000+ customer reviews</p>
            </div>

            <div className="scroll-animate text-center p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-heading tracking-tight drop-shadow-[0_0_15px_rgba(209,0,160,0.8)]">60%</div>
              <p className="text-white font-bold mb-2">Time Saved</p>
              <p className="text-gray-300 text-sm">On average per event management</p>
            </div>

            <div className="scroll-animate text-center p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl bg-white/5">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-heading tracking-tight drop-shadow-[0_0_15px_rgba(209,0,160,0.8)]">3.5x</div>
              <p className="text-white font-bold mb-2">ROI Average</p>
              <p className="text-gray-300 text-sm">Return on investment for customers</p>
            </div>
          </div>

          <div className="scroll-animate text-center mt-16 flex justify-center">
            <Link 
              to="/signup" 
              className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_30px_rgba(209,0,160,0.6)] transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_0_50px_rgba(209,0,160,0.9)] hover:border-white/60 active:scale-95 focus:outline-none focus:ring-0 select-none cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d100a0] to-[#7210a6] blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500 -z-10"></span>
              <span className="relative z-10 tracking-wider font-heading uppercase text-xs sm:text-sm md:text-base">Start Your Success Story</span>
              <FaArrowRight className="relative z-10 text-base transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;