import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen selection:bg-[#d100a0] selection:text-white bg-[#0f0518] text-white flex overflow-hidden relative">
      {/* Home Page Matching Glowing Radial Background Backgrounds */}
      <div className="fixed -top-32 -left-32 w-[500px] h-[500px] bg-[#d100a0]/20 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed top-1/2 -right-32 w-[500px] h-[500px] bg-[#6b21a8]/25 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed -bottom-32 left-1/3 w-[450px] h-[450px] bg-[#d100a0]/15 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-6 md:p-10 overflow-y-auto min-h-screen relative z-10">
        <header className="mb-8">
          <div className="w-24 md:w-36 h-[3px] bg-gradient-to-r from-transparent via-[#d100a0] to-transparent shadow-[0_0_20px_rgba(209,0,160,1)] rounded-full mb-3"></div>
          <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3e8ff] to-[#e0aaff] drop-shadow-lg">
            {title}
          </h1>
        </header>

        {/* Dynamic Glass Container matching Home Card styling */}
        <div className="p-6 md:p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/30 transition-all duration-500 backdrop-blur-xl bg-white/5 min-h-[80vh] shadow-[0_0_50px_rgba(15,5,24,0.8)] relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;