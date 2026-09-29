import React from 'react';

const StatBox = ({ label, value, icon: Icon }) => (
  <div className="p-6 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.3)] hover:bg-white/10 backdrop-blur-xl bg-white/5 cursor-pointer transition-all duration-500 hover:-translate-y-1 flex items-center justify-between group">
    <div>
      <p className="text-gray-300 text-sm font-medium tracking-wide">{label}</p>
      <h3 className="text-3xl md:text-4xl font-black text-white mt-2 font-heading tracking-tight drop-shadow-md">
        {value}
      </h3>
    </div>
    <div className="w-14 h-14 bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.5)] group-hover:scale-110 transition-transform duration-300 border border-white/20 flex-shrink-0">
      <Icon className="text-2xl text-white" size={24} />
    </div>
  </div>
);

export default StatBox;