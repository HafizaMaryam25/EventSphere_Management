import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../lib/api';
import {
  Calendar,
  MapPin,
  Ticket,
  Search,
  Loader2,
  Lock,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { toast } from 'react-toastify';

const ExploreExpos = () => {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpos();
  }, [searchTerm]);

  const fetchExpos = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`/attendee/explore?search=${searchTerm}`);

      setExpos(res.data);

    } catch (err) {
      toast.error(
        'Exhibitions load nahi ho sakeen.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (e, id) => {
    e.stopPropagation();

    if (bookmarks.includes(id)) {

      setBookmarks(
        bookmarks.filter(
          (b) => b !== id
        )
      );

      toast.info(
        'Removed from bookmarks'
      );

    } else {

      setBookmarks([
        ...bookmarks,
        id
      ]);

      toast.success(
        'Added to bookmarks!'
      );

    }

    // Backend API can be added here
  };

  return (
    <DashboardLayout title="Explore Exhibitions">

      <div className="space-y-8 animate-fadeInUp">

        {/* ================= HEADER ================= */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 md:p-8">

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d100a0]/10 blur-[100px] rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center border border-white/20 shadow-[0_0_25px_rgba(209,0,160,0.4)]">
                <Ticket
                  size={25}
                  className="text-white"
                />
              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-3xl font-black text-white font-heading tracking-tight">
                    Explore Exhibitions
                  </h2>

                  <Sparkles
                    size={19}
                    className="text-[#d100a0]"
                  />

                </div>

                <p className="text-gray-400 text-sm mt-1">
                  Discover upcoming exhibitions and explore participating exhibitors.
                </p>

              </div>

            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search exhibitions..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-[#d100a0]/50 focus:ring-1 focus:ring-[#d100a0]/20 transition-all"
              />

            </div>

          </div>
        </div>

        {/* ================= LOADING ================= */}
        {loading ? (

          <div className="p-20 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center">

            <Loader2
              className="animate-spin text-[#d100a0]"
              size={45}
            />

            <p className="text-gray-500 mt-4 text-sm animate-pulse">
              Discovering exhibitions...
            </p>

          </div>

        ) : expos.length === 0 ? (

          /* ================= EMPTY ================= */
          <div className="p-20 rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-center">

            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">

              <Search
                size={35}
                className="text-[#d100a0]"
              />

            </div>

            <h3 className="text-xl font-bold text-white">
              No Exhibitions Found
            </h3>

            <p className="text-gray-500 text-sm mt-2 max-w-sm">
              No exhibitions match your current search. Try a different keyword.
            </p>

          </div>

        ) : (

          /* ================= EXPO GRID ================= */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {expos.map((expo) => {

              const today = new Date();

              today.setHours(
                0,
                0,
                0,
                0
              );

              const eventEnd = new Date(
                expo.endDate ||
                expo.startDate
              );

              const isExpired =
                eventEnd < today;

              const isBookmarked =
                bookmarks.includes(
                  expo._id
                );

              return (

                <div
                  key={expo._id}
                  onClick={() =>
                    !isExpired &&
                    navigate(
                      `/attendee/expo/${expo._id}`
                    )
                  }
                  className={`group relative overflow-hidden rounded-3xl p-7 border transition-all duration-500 flex flex-col justify-between min-h-[360px] ${
                    isExpired
                      ? 'bg-black/30 border-white/5 cursor-not-allowed opacity-50 grayscale'
                      : 'bg-white/5 border-white/10 cursor-pointer hover:border-[#d100a0]/50 hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(209,0,160,0.18)]'
                  }`}
                >

                  {/* Glow */}
                  {!isExpired && (
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#d100a0]/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}

                  <div className="relative z-10">

                    {/* Top */}
                    <div className="flex justify-between items-start mb-7">

                      <div
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          isExpired
                            ? 'bg-gray-800 text-gray-500 border-gray-700'
                            : 'bg-[#d100a0]/10 text-[#d100a0] border-[#d100a0]/20'
                        }`}
                      >
                        {expo.theme}
                      </div>

                      {!isExpired && (
                        <button
                          onClick={(e) =>
                            toggleBookmark(
                              e,
                              expo._id
                            )
                          }
                          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 border ${
                            isBookmarked
                              ? 'bg-[#d100a0] border-[#d100a0] text-white shadow-[0_0_20px_rgba(209,0,160,0.35)]'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-[#d100a0]/30 hover:bg-[#d100a0]/10'
                          }`}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck
                              size={18}
                            />
                          ) : (
                            <Bookmark
                              size={18}
                            />
                          )}
                        </button>
                      )}

                      {isExpired && (
                        <div className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-1.5">
                          <Lock size={12} />
                          Closed
                        </div>
                      )}

                    </div>

                    {/* Content */}
                    <div>

                      <h3
                        className={`text-2xl font-black mb-6 leading-tight transition-colors ${
                          isExpired
                            ? 'text-gray-500'
                            : 'text-white group-hover:text-[#d100a0]'
                        }`}
                      >
                        {expo.title}
                      </h3>

                      <div className="space-y-4">

                        {/* Date */}
                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                            <Calendar
                              size={17}
                              className={
                                isExpired
                                  ? 'text-gray-700'
                                  : 'text-[#d100a0]'
                              }
                            />
                          </div>

                          <div>

                            <p className="text-[9px] uppercase tracking-widest text-gray-600 font-bold">
                              Event Date
                            </p>

                            <p
                              className={`text-sm mt-0.5 ${
                                isExpired
                                  ? 'text-gray-600'
                                  : 'text-gray-300 font-semibold'
                              }`}
                            >
                              {expo.startDate
                                ? new Date(
                                    expo.startDate
                                  ).toLocaleDateString(
                                    'en-GB',
                                    {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    }
                                  )
                                : 'Date unavailable'}
                            </p>

                          </div>

                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                            <MapPin
                              size={17}
                              className={
                                isExpired
                                  ? 'text-gray-700'
                                  : 'text-[#d100a0]'
                              }
                            />
                          </div>

                          <div>

                            <p className="text-[9px] uppercase tracking-widest text-gray-600 font-bold">
                              Location
                            </p>

                            <p
                              className={`text-sm mt-0.5 ${
                                isExpired
                                  ? 'text-gray-600'
                                  : 'text-gray-400'
                              }`}
                            >
                              {expo.location ||
                                'Location unavailable'}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Footer */}
                  <div className="relative z-10 mt-8 pt-5 border-t border-white/10 flex justify-between items-center">

                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        isExpired
                          ? 'text-gray-700'
                          : 'text-[#d100a0]'
                      }`}
                    >
                      {isExpired
                        ? 'Event Ended'
                        : 'Join Exhibition'}
                    </span>

                    {!isExpired && (

                      <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-300 group-hover:bg-gradient-to-br group-hover:from-[#d100a0] group-hover:to-[#6b21a8] group-hover:text-white group-hover:border-[#d100a0] group-hover:shadow-[0_0_20px_rgba(209,0,160,0.3)] transition-all duration-300">

                        <ArrowRight
                          size={19}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />

                      </div>

                    )}

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

    </DashboardLayout>
  );
};

export default ExploreExpos;