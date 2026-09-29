import React, { useState, useEffect } from 'react';
import axios from '../../lib/api';
import {
  Loader2,
  CheckCircle,
  Lock,
  Clock,
  XCircle,
  LayoutGrid,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExhibitorBooking = () => {
  const [booths, setBooths] = useState([]);
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpo, setSelectedExpo] = useState('');

  const loggedInUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    const loadExpos = async () => {
      try {
        const res = await axios.get('/admin/get');

        setExpos(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadExpos();
  }, []);

  const fetchAllBooths = async () => {
    if (!selectedExpo) {
      setBooths([]);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(`/api/booths/all?expoId=${selectedExpo}`);

      setBooths(res.data);

    } catch (err) {
      toast.error("Error loading booths");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooths();
  }, [selectedExpo]);

  const handleBookNow = async (boothId) => {
    try {
      await axios.patch(`/api/booths/book/${boothId}`, {}, config);

      toast.success("Request sent!");
      fetchAllBooths();

    } catch (err) {
      toast.error("Failed to send request");
    }
  };

  return (
    <div className="space-y-8 animate-fadeInUp">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/30 backdrop-blur-xl bg-white/5 transition-all duration-500">

        <div>
          <h2 className="text-3xl font-black font-heading tracking-tight text-white flex items-center gap-3">
            <Sparkles
              className="text-[#d100a0]"
              size={28}
            />
            Reserve Booth
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Select an available booth and reserve it for your business.
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.4)] border border-white/20">
          <LayoutGrid size={22} className="text-white" />
        </div>

      </div>

      {/* Expo Selector */}
      <div className="p-6 md:p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/40 backdrop-blur-xl bg-white/5 transition-all duration-500">

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#d100a0]/15 border border-[#d100a0]/30 flex items-center justify-center">
            <Calendar size={18} className="text-[#d100a0]" />
          </div>

          <div>
            <h3 className="text-white font-bold">
              Choose an Active Expo
            </h3>

            <p className="text-gray-500 text-xs mt-0.5">
              Select an expo to view its available booths.
            </p>
          </div>
        </div>

        <select
          className="w-full max-w-md bg-[#0f0518] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#d100a0] focus:ring-1 focus:ring-[#d100a0]/40 transition-all cursor-pointer"
          value={selectedExpo}
          onChange={(e) => setSelectedExpo(e.target.value)}
        >
          <option
            value=""
            className="bg-[#0f0518] text-gray-400"
          >
            -- Select an Expo --
          </option>

          {expos.map((e) => (
            <option
              key={e._id}
              value={e._id}
              className="bg-[#0f0518] text-white"
            >
              {e.title}
            </option>
          ))}
        </select>

      </div>

      {/* Loading */}
      {loading ? (

        <div className="p-16 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-[#d100a0]">
          <Loader2
            className="animate-spin mb-4"
            size={44}
          />

          <p className="text-gray-300 font-medium animate-pulse text-sm">
            Fetching floor plan data...
          </p>
        </div>

      ) : !selectedExpo ? (

        /* No Expo */
        <div className="p-16 rounded-3xl border border-dashed border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-center">

          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
            <LayoutGrid
              size={32}
              className="text-[#d100a0]"
            />
          </div>

          <h3 className="text-xl font-bold text-white">
            No Expo Selected
          </h3>

          <p className="text-gray-500 text-sm max-w-sm mt-2">
            Please choose an expo from the dropdown above to view available booths.
          </p>

        </div>

      ) : booths.length === 0 ? (

        /* No Booths */
        <div className="p-16 rounded-3xl border border-dashed border-red-500/20 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-center">

          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
            <Info
              size={32}
              className="text-red-400"
            />
          </div>

          <h3 className="text-xl font-bold text-white">
            No Booths Found
          </h3>

          <p className="text-gray-500 text-sm max-w-sm mt-2">
            Currently, there are no booths registered for this specific expo.
            Please check back later or contact admin.
          </p>

        </div>

      ) : (

        /* Booth Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {booths.map((booth) => {

            const boothBookerId =
              booth.bookedBy?._id || booth.bookedBy;

            const isMyRequest =
              String(boothBookerId) === String(loggedInUserId);

            let displayStatus = booth.status;

            if (booth.status === 'Rejected') {
              displayStatus = isMyRequest
                ? 'Rejected'
                : 'Available';
            }

            return (
              <div
                key={booth._id}
                className={`group relative overflow-hidden p-6 rounded-3xl border backdrop-blur-xl bg-white/5 transition-all duration-500 hover:-translate-y-1 ${
                  displayStatus === 'Available'
                    ? 'border-[#d100a0]/30 hover:border-[#d100a0]/60 hover:shadow-[0_0_30px_rgba(209,0,160,0.2)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >

                {/* Glow */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#d100a0]/5 blur-[60px] rounded-full group-hover:bg-[#d100a0]/10 transition-all" />

                <div className="relative z-10">

                  {/* Top */}
                  <div className="flex justify-between items-start mb-5">

                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">
                        Exhibition Booth
                      </p>

                      <h3 className="text-2xl font-black text-white font-heading">
                        Booth {booth.boothNumber}
                      </h3>
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        displayStatus === 'Booked'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : displayStatus === 'Pending'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          : displayStatus === 'Rejected'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-[#d100a0]/10 text-[#d100a0] border-[#d100a0]/30'
                      }`}
                    >
                      {displayStatus}
                    </span>

                  </div>

                  {/* Price */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6">

                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                      Booth Price
                    </p>

                    <p className="text-2xl font-black text-white mt-1">
                      <span className="text-[#d100a0]">Rs.</span>{' '}
                      {booth.price}
                    </p>

                  </div>

                  {/* Buttons */}
                  {displayStatus === 'Available' ? (

                    <button
                      onClick={() => handleBookNow(booth._id)}
                      className="group/btn relative overflow-hidden w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] text-white font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_25px_rgba(209,0,160,0.5)] hover:scale-[1.02] active:scale-95"
                    >
                      <CheckCircle size={18} />
                      Reserve Now
                    </button>

                  ) : displayStatus === 'Pending' && isMyRequest ? (

                    <button
                      disabled
                      className="w-full py-3.5 rounded-2xl bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/20 flex items-center justify-center gap-2"
                    >
                      <Clock size={18} />
                      Waiting Approval
                    </button>

                  ) : displayStatus === 'Rejected' && isMyRequest ? (

                    <button
                      disabled
                      className="w-full py-3.5 rounded-2xl bg-red-500/10 text-red-400 font-bold border border-red-500/20 flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} />
                      Rejected By Admin
                    </button>

                  ) : (

                    <button
                      disabled
                      className="w-full py-3.5 rounded-2xl bg-white/5 text-gray-500 font-bold flex items-center justify-center gap-2 border border-white/10"
                    >
                      <Lock size={18} />
                      {displayStatus === 'Booked'
                        ? 'Occupied'
                        : 'Restricted'}
                    </button>

                  )}

                </div>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default ExhibitorBooking;