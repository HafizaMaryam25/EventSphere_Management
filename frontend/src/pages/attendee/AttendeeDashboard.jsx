import { useState, useEffect } from 'react';
import axios, { getImageUrl } from '../../lib/api';
import {
  Ticket,
  Bookmark,
  ArrowRight,
  Calendar,
  Building2,
  LayoutGrid,
  User,
  Clock,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatBox from '../../components/layout/StatBox';

const AttendeeDashboard = () => {
  const [data, setData] = useState(null);
  const [featuredBooths, setFeaturedBooths] = useState([]);
  const [totalBoothsCount, setTotalBoothsCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const attendeeId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!attendeeId) return;

      try {
        setLoading(true);

        // 1. Fetch Stats & Bookings
        const dashRes = await axios.get(`/attendee/dashboard/${attendeeId}`);

        setData(dashRes.data);

        // 2. Fetch All Booths
        const boothsRes = await axios.get('/api/booths/all');

        setTotalBoothsCount(boothsRes.data.length);

        // 3. Fetch Bookmarks
        const bookmarkRes = await axios.get(`/api/bookmarks/my-ids/${attendeeId}`);

        setBookmarkCount(bookmarkRes.data.length);

        // 4. Recommended Exhibitors
        const bookedOnes = boothsRes.data
          .filter((b) => b.status === 'Booked')
          .slice(0, 3);

        setFeaturedBooths(bookedOnes);

        setLoading(false);
      } catch (err) {
        console.error('Dashboard error:', err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [attendeeId]);

  if (loading) {
    return (
      <DashboardLayout title="Overview">
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2
            className="animate-spin text-[#d100a0]"
            size={45}
          />

          <p className="text-gray-500 mt-4 text-sm animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Overview">

      <div className="space-y-8 animate-fadeInUp">

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <StatBox
            label="Registrations"
            value={data?.upcomingExpos?.length || 0}
            icon={Ticket}
          />

          <StatBox
            label="Saved Sessions"
            value={bookmarkCount}
            icon={Bookmark}
          />

          <StatBox
            label="Exhibition Booths"
            value={totalBoothsCount || '0'}
            icon={LayoutGrid}
          />

        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ================= LEFT SIDE ================= */}
          <div className="xl:col-span-2 space-y-6">

            {/* Recent Bookings */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 md:p-8">

              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d100a0]/10 blur-[100px] rounded-full" />

              <div className="relative z-10">

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-7">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-2xl bg-[#d100a0]/10 border border-[#d100a0]/20 flex items-center justify-center">
                      <Ticket
                        size={20}
                        className="text-[#d100a0]"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Recent Bookings
                      </h2>

                      <p className="text-xs text-gray-500 mt-1">
                        Your upcoming exhibition registrations
                      </p>
                    </div>

                  </div>

                  <Link
                    to="/tickets"
                    className="text-[#d100a0] text-sm font-bold flex items-center gap-1 hover:text-pink-400 transition-colors"
                  >
                    View All
                    <ArrowRight size={15} />
                  </Link>

                </div>

                <div className="space-y-4">

                  {data?.upcomingExpos?.length > 0 ? (
                    data.upcomingExpos
                      .slice(0, 2)
                      .map((booking) => (

                        <div
                          key={booking._id}
                          className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#d100a0]/30 hover:bg-white/[0.07] transition-all duration-300"
                        >

                          <div className="flex items-center gap-4 min-w-0">

                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#d100a0]/20 to-purple-700/20 border border-[#d100a0]/20 flex items-center justify-center">

                              <Calendar
                                size={21}
                                className="text-[#d100a0]"
                              />

                            </div>

                            <div className="min-w-0">

                              <h4 className="font-bold text-white truncate group-hover:text-[#d100a0] transition-colors">
                                {booking.expoId?.title}
                              </h4>

                              <p className="text-xs text-gray-500 mt-1">
                                {booking.expoId?.startDate
                                  ? new Date(
                                      booking.expoId.startDate
                                    ).toDateString()
                                  : 'Date not available'}
                              </p>

                            </div>

                          </div>

                          <Link
                            to={`/attendee/expo/${booking.expoId?._id}`}
                            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-[#d100a0] hover:border-[#d100a0] transition-all"
                          >
                            <ArrowRight size={17} />
                          </Link>

                        </div>

                      ))
                  ) : (

                    <div className="text-gray-500 text-center py-8 italic text-sm border border-dashed border-white/10 rounded-2xl">
                      No active registrations found.
                    </div>

                  )}

                </div>

              </div>
            </div>

            {/* Recommended Exhibitors */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 md:p-8">

              <div className="flex items-center justify-between mb-7">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-2xl bg-[#d100a0]/10 border border-[#d100a0]/20 flex items-center justify-center">
                    <Bookmark
                      size={19}
                      className="text-[#d100a0]"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Recommended for You
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                      Explore exhibitors participating in events
                    </p>
                  </div>

                </div>

                <Sparkles
                  size={20}
                  className="text-[#d100a0]"
                />

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {featuredBooths.length > 0 ? (

                  featuredBooths.map((booth) => (

                    <div
                      key={booth._id}
                      className="group relative overflow-hidden bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-[#d100a0]/40 hover:bg-white/[0.07] transition-all duration-300"
                    >

                      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#d100a0]/10 blur-3xl rounded-full" />

                      <div className="relative z-10">

                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 overflow-hidden border border-white/10">

                          {booth.logo ? (
                            <img
                              src={getImageUrl(booth.logo)}
                              alt="Logo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2
                              className="text-gray-600"
                              size={21}
                            />
                          )}

                        </div>

                        <h5 className="font-black text-white text-sm truncate group-hover:text-[#d100a0] transition-colors">
                          {booth.companyName || 'Individual'}
                        </h5>

                        <p className="text-[9px] text-[#d100a0]/70 uppercase font-bold tracking-widest mt-1">
                          {booth.industry || 'Exhibitor'}
                        </p>

                      </div>

                    </div>

                  ))

                ) : (

                  <p className="col-span-full text-gray-600 text-sm italic">
                    Discovering new exhibitors...
                  </p>

                )}

              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="space-y-6">

            {/* Event Access */}
            <div className="relative overflow-hidden rounded-3xl border border-[#d100a0]/20 bg-gradient-to-br from-[#d100a0]/20 via-purple-900/20 to-indigo-900/20 p-8 shadow-2xl">

              <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#d100a0]/20 blur-[70px] rounded-full" />

              <div className="relative z-10">

                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-5">
                  <Ticket
                    size={22}
                    className="text-white"
                  />
                </div>

                <h3 className="font-black mb-3 text-white text-xl uppercase tracking-tight">
                  Event Access
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed mb-7">
                  Your digital passes are generated automatically upon registration.
                </p>

                <Link
                  to="/tickets"
                  className="block w-full py-4 bg-white text-black text-center rounded-2xl font-black text-xs tracking-widest hover:bg-gray-100 transition-all active:scale-95 shadow-xl"
                >
                  MY PASSES
                </Link>

              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7">

              <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-5 opacity-50">
                Quick Links
              </h4>

              <div className="space-y-3">

                <Link
                  to="/attendee/bookmarks"
                  className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-[#d100a0]/10 hover:border-[#d100a0]/20 border border-white/5 transition-all group"
                >

                  <div className="flex items-center gap-3">

                    <Clock
                      size={18}
                      className="text-gray-400 group-hover:text-[#d100a0]"
                    />

                    <span className="text-sm text-gray-300 group-hover:text-white">
                      My Favourites
                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    {bookmarkCount > 0 && (
                      <span className="bg-[#d100a0] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-[#d100a0]/20">
                        {bookmarkCount}
                      </span>
                    )}

                    <ArrowRight
                      size={14}
                      className="text-gray-600 group-hover:text-[#d100a0] group-hover:translate-x-1 transition-all"
                    />

                  </div>

                </Link>

                <Link
                  to="/attendee/profile"
                  className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-[#d100a0]/10 hover:border-[#d100a0]/20 border border-white/5 transition-all group"
                >

                  <div className="flex items-center gap-3">

                    <User
                      size={18}
                      className="text-gray-400 group-hover:text-[#d100a0]"
                    />

                    <span className="text-sm text-gray-300 group-hover:text-white">
                      View Profile
                    </span>

                  </div>

                  <ArrowRight
                    size={14}
                    className="text-gray-600 group-hover:text-[#d100a0] group-hover:translate-x-1 transition-all"
                  />

                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default AttendeeDashboard;