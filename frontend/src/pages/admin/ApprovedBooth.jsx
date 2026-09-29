
import React, { useState, useEffect } from 'react';
import axios from '../../lib/api';
import {
  Search,
  ExternalLink,
  MapPin,
  Building2,
  Award,
  Loader2,
  ArrowLeft,
  Trophy,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ApprovedExhibitors = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchApprovedData = async () => {
      try {
        const res = await axios.get('/api/booths/all', config);

        const approvedOnly = res.data.filter(
          (booth) => booth.status === 'Booked'
        );

        setData(approvedOnly);
      } catch (err) {
        console.error(
          'Error fetching approved exhibitors:',
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedData();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.companyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.boothNumber?.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-fadeInUp text-white">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 p-8 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5">
        <div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="group flex items-center gap-2 text-[#d100a0] hover:text-white transition-colors mb-4 text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Admin Dashboard
          </button>

          <h2 className="text-3xl font-black font-heading tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.4)]">
              <ShieldCheck size={23} />
            </div>
            Approved Booths
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            List of all verified partners and allocated booth spaces.
          </p>
        </div>

        {/* Search */}
        <div className="relative group w-full xl:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#d100a0] transition-colors"
            size={20}
          />

          <input
            type="text"
            placeholder="Search by company or booth #..."
            className="w-full bg-white/5 border border-white/10 focus:border-[#d100a0]/50 outline-none transition-all rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 shadow-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="p-16 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-[#d100a0]">
          <Loader2 className="animate-spin mb-4" size={46} />

          <p className="text-gray-300 font-medium animate-pulse text-sm">
            Filtering verified records...
          </p>
        </div>
      ) : filteredData.length === 0 ? (
        /* Empty */
        <div className="p-16 rounded-3xl border border-dashed border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#d100a0]/10 border border-[#d100a0]/20 flex items-center justify-center mb-5">
            <Award size={42} className="text-[#d100a0]/50" />
          </div>

          <h3 className="text-xl font-bold text-white">
            No Approved Exhibitors
          </h3>

          <p className="text-gray-500 mt-2 text-sm">
            Requests that are approved by admin will appear here.
          </p>
        </div>
      ) : (
        /* Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div
              key={item._id}
              className="group relative p-7 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-all duration-500 overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#d100a0]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Verified Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                  Verified
                </span>
              </div>

              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#d100a0]/20 to-purple-900/30 rounded-2xl flex items-center justify-center mb-6 border border-[#d100a0]/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(209,0,160,0.15)]">
                <Trophy className="text-[#e879d4]" size={30} />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white group-hover:text-[#e879d4] transition-colors truncate font-heading">
                  {item.companyName}
                </h3>

                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Building2 size={14} className="text-[#d100a0]" />
                  {item.expoId?.title || 'Annual Expo 2026'}
                </p>
              </div>

              {/* Booth Details */}
              <div className="mt-7 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-white/10 bg-black/20 hover:border-[#d100a0]/20 transition-colors">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-1 tracking-wider">
                    Booth Slot
                  </p>

                  <p className="text-lg font-mono font-bold text-white">
                    #{item.boothNumber}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-black/20 text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-1 tracking-wider">
                    Category
                  </p>

                  <p className="text-lg font-bold text-[#e879d4]">
                    Premium
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-7 h-7 rounded-lg bg-[#d100a0]/10 flex items-center justify-center">
                    <MapPin
                      size={13}
                      className="text-[#d100a0]"
                    />
                  </div>

                  <span>Main Exhibition Hall</span>
                </div>

                <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:bg-[#d100a0] hover:border-[#d100a0] transition-all duration-300">
                  <ExternalLink size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {!loading && filteredData.length > 0 && (
        <div className="p-6 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-[#d100a0]" />

            <p className="text-gray-400 text-sm">
              Total of{' '}
              <span className="text-[#e879d4] font-black">
                {filteredData.length}
              </span>{' '}
              partners have been officially onboarded.
            </p>

            <Sparkles size={16} className="text-[#d100a0]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedExhibitors;
