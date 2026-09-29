import React, { useState, useEffect } from 'react';
import axios from '../../lib/api';
import {
  Loader2,
  Box,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  RefreshCcw,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyBooths = () => {
  const [myBooths, setMyBooths] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loggedInUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const fetchMyBooths = async () => {
    setLoading(true);

    try {
      const res = await axios.get('/api/booths/all', config);

      const filtered = res.data.filter((booth) => {
        const bookerId =
          booth.bookedBy?._id || booth.bookedBy;

        return String(bookerId) === String(loggedInUserId);
      });

      setMyBooths(filtered);

    } catch (err) {
      toast.error("Failed to load your booths");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooths();
  }, []);

  return (
    <div className="space-y-8 animate-fadeInUp text-white">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate('/exhibitor/dashboard')}
        className="group flex items-center gap-2 text-gray-400 hover:text-[#d100a0] transition-all duration-300 text-sm font-medium"
      >
        <ArrowLeft
          size={18}
          className="transition-transform duration-300 group-hover:-translate-x-1"
        />
        Back to Exhibitor Dashboard
      </button>

      {/* Header */}
      <div className="relative overflow-hidden p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/30 backdrop-blur-xl bg-white/5 transition-all duration-500">

        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#d100a0]/10 blur-[100px] rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center shadow-[0_0_25px_rgba(209,0,160,0.4)] border border-white/20">
              <Box size={25} className="text-white" />
            </div>

            <div>
              <h2 className="text-3xl font-black font-heading tracking-tight">
                My Reserved Booths
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Track the status of your booth applications and reservations.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={fetchMyBooths}
            className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#d100a0]/40 px-5 py-3 rounded-xl transition-all duration-300 font-bold text-sm"
          >
            <RefreshCcw
              size={17}
              className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}
            />
            Refresh
          </button>

        </div>
      </div>

      {/* Loading */}
      {loading ? (

        <div className="p-20 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center">

          <Loader2
            className="animate-spin text-[#d100a0]"
            size={48}
          />

          <p className="text-gray-500 mt-4 animate-pulse text-sm">
            Checking your reservations...
          </p>

        </div>

      ) : myBooths.length === 0 ? (

        /* Empty State */
        <div className="p-20 rounded-3xl border-2 border-dashed border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center text-center">

          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
            <Box
              size={38}
              className="text-[#d100a0]"
            />
          </div>

          <h3 className="text-xl font-bold text-white">
            No Booths Found
          </h3>

          <p className="text-gray-500 mt-2 text-sm max-w-sm leading-relaxed">
            You haven't reserved any booths yet.
            Go to the Floor Plan to start booking.
          </p>

          <button
            onClick={() =>
              navigate('/exhibitor/dashboard/book-booth')
            }
            className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d100a0] to-[#6b21a8] text-white font-bold hover:shadow-[0_0_25px_rgba(209,0,160,0.4)] transition-all duration-300 active:scale-95"
          >
            Browse Booths
          </button>

        </div>

      ) : (

        /* Booth Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {myBooths.map((booth) => (

            <div
              key={booth._id}
              className="group relative overflow-hidden p-6 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.2)] backdrop-blur-xl bg-white/5 transition-all duration-500 hover:-translate-y-1"
            >

              {/* Glow */}
              <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-[#d100a0]/10 blur-[70px] rounded-full group-hover:bg-[#d100a0]/20 transition-all duration-500" />

              <div className="relative z-10">

                {/* Card Top */}
                <div className="flex justify-between items-start mb-6">

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d100a0]/20 to-purple-700/20 border border-[#d100a0]/20 flex items-center justify-center">
                    <Box
                      className="text-[#d100a0]"
                      size={23}
                    />
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      booth.status === 'Booked'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : booth.status === 'Pending'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {booth.status}
                  </span>

                </div>

                {/* Booth Info */}
                <div>

                  <h3 className="text-2xl font-black font-heading">
                    Booth #{booth.boothNumber}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">

                    <MapPin
                      size={14}
                      className="text-[#d100a0]"
                    />

                    <span>
                      {booth.expoId?.title || "Event Location"}
                    </span>

                  </div>

                </div>

                {/* Price / Category */}
                <div className="flex items-center justify-between py-5 mt-5 border-y border-white/10">

                  <div className="flex items-center gap-2">

                    <CreditCard
                      size={16}
                      className="text-gray-500"
                    />

                    <span className="text-sm text-emerald-400 font-bold">
                      Rs. {booth.price}
                    </span>

                  </div>

                  <span className="px-3 py-1 rounded-lg bg-white/5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {booth.category}
                  </span>

                </div>

                {/* Status Message */}
                <div className="pt-5">

                  {booth.status === 'Pending' && (
                    <div className="flex items-center gap-2 text-yellow-400/80 text-xs font-medium">
                      <Clock size={15} />
                      Application is under review by admin
                    </div>
                  )}

                  {booth.status === 'Booked' && (
                    <div className="flex items-center gap-2 text-green-400/80 text-xs font-medium">
                      <CheckCircle size={15} />
                      Congratulations! Your slot is confirmed
                    </div>
                  )}

                  {booth.status === 'Rejected' && (
                    <div className="flex items-center gap-2 text-red-400/80 text-xs font-medium">
                      <XCircle size={15} />
                      This request was declined. Contact Admin.
                    </div>
                  )}

                </div>

              </div>
            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default MyBooths;