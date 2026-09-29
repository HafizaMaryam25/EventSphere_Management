import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from '../../lib/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatBox from '../../components/layout/StatBox';
import { Layout, MessageSquare, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

const ExhibitorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMainDashboard = location.pathname === '/exhibitor/dashboard';

  const [stats, setStats] = useState({
    myBoothsCount: 0,
    inquiries: 0,
    productsCount: 0,
  });

  const [loading, setLoading] = useState(false);

  const loggedInUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    const fetchExhibitorStats = async () => {
      if (!isMainDashboard) return;

      setLoading(true);

      try {
        const boothRes = await axios.get('/api/booths/all', config);

        const myBooths = boothRes.data.filter((booth) => {
          const bookerId = booth.bookedBy?._id || booth.bookedBy;
          return String(bookerId) === String(loggedInUserId);
        });

        const profileRes = await axios.get('/api/exhibitor/my-profile', config);

        const productsLength =
          profileRes.data?.productShowcase?.length || 0;

        const convoRes = await axios.get(`/api/messages/conversations/${loggedInUserId}`, config);

        const inquiriesCount = Array.isArray(convoRes.data)
          ? convoRes.data.length
          : 0;

        setStats({
          myBoothsCount: myBooths.length,
          productsCount: productsLength,
          inquiries: inquiriesCount
        });

      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitorStats();
  }, [isMainDashboard, loggedInUserId]);

  const formatNum = (n) => (n < 10 ? `0${n}` : n);

  const exhibitorStats = [
    {
      label: 'My Booths',
      value: loading ? '..' : formatNum(stats.myBoothsCount),
      icon: Layout,
      path: '/exhibitor/dashboard/my-booth'
    },
    {
      label: 'Products',
      value: loading ? '..' : formatNum(stats.productsCount),
      icon: Briefcase,
      path: '/exhibitor/dashboard/my-products'
    },
    {
      label: 'Inquiries',
      value: loading ? '..' : formatNum(stats.inquiries),
      icon: MessageSquare,
      path: '/exhibitor/dashboard/all-chats'
    },
  ];

  return (
    <DashboardLayout title="Exhibitor Dashboard">
      <Outlet />

      {isMainDashboard && (
        <div className="space-y-8 animate-fadeInUp">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibitorStats.map((stat, index) => (
              <div
                key={index}
                onClick={() => navigate(stat.path)}
                className="cursor-pointer transition-all duration-500 hover:-translate-y-2"
              >
                <StatBox {...stat} />
              </div>
            ))}
          </div>

          {/* Welcome Card */}
          <div className="relative overflow-hidden p-8 md:p-10 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] backdrop-blur-xl bg-white/5 text-white transition-all duration-500">

            {/* Glow Effects */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#d100a0]/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-purple-700/10 blur-[100px] rounded-full" />

            <div className="relative z-10">

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center shadow-[0_0_25px_rgba(209,0,160,0.45)] border border-white/20">
                  <Sparkles size={25} className="text-white" />
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-black font-heading tracking-tight text-white">
                    Welcome back, Exhibitor!
                  </h2>

                  <p className="text-gray-400 text-sm mt-1">
                    Manage your exhibition activities from one place.
                  </p>
                </div>

              </div>

              {/* Description */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-7">
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  You currently have{' '}
                  <span className="text-[#d100a0] font-bold">
                    {stats.inquiries} inquiries
                  </span>{' '}
                  and{' '}
                  <span className="text-purple-400 font-bold">
                    {stats.myBoothsCount} booth
                    {stats.myBoothsCount !== 1 ? 's' : ''}
                  </span>
                  . Keep your company profile and products updated to make
                  the most of your exhibition experience.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <button
                  onClick={() =>
                    navigate('/exhibitor/dashboard/add-profile')
                  }
                  className="group relative inline-flex items-center justify-center gap-3 py-4 px-6 font-extrabold text-white rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_25px_rgba(209,0,160,0.45)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(209,0,160,0.7)] active:scale-95"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  <span className="relative z-10">
                    Update Profile
                  </span>

                  <ArrowRight
                    size={18}
                    className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                <button
                  onClick={() =>
                    navigate('/exhibitor/dashboard/messages')
                  }
                  className="group inline-flex items-center justify-center gap-3 py-4 px-6 font-bold text-white rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#d100a0]/40 transition-all duration-300 active:scale-95"
                >
                  <MessageSquare size={18} className="text-[#d100a0]" />

                  <span>
                    View All Chats
                  </span>

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1 text-gray-400"
                  />
                </button>

              </div>

            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default ExhibitorDashboard;