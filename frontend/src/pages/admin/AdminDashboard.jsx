import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from '../../lib/api';
import { io } from 'socket.io-client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Users, Calendar, CheckCircle, Clock, Activity, Bell, TrendingUp, ArrowRight 
} from 'lucide-react';

import DashboardLayout from '../../components/layout/DashboardLayout';
import StatBox from '../../components/layout/StatBox';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMainDashboard = location.pathname === '/admin/dashboard';

  const [stats, setStats] = useState({
    totalExpos: 0,
    allApplications: 0,
    approvedBooths: 0,
    upcomingSessions: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const config = { 
    headers: { 
      Authorization: `Bearer ${localStorage.getItem('token')}` 
    } 
  };

  useEffect(() => {
    // 1. Socket.io Connection
    const socketUrl = import.meta.env.VITE_API_URL || 'https://eventsphere-backend-mocha.vercel.app';
    const socket = io(socketUrl);
    const userId = localStorage.getItem('userId'); 
    if (userId) socket.emit('join', userId);

    socket.on('new_notification', (newNote) => {
      setNotifications((prev) => [newNote, ...prev]);
    });

    // 2. Data Fetching
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [expoRes, boothRes, sessionRes, notifyRes, analyticsRes] = await Promise.all([
          axios.get('/admin/get'),
          axios.get('/api/booths/all', config),
          axios.get('/admin/manage/sessions'),
          axios.get('/api/notifications', config),
          axios.get('/admin/analytics', config)
        ]);
        
        // Stats Calculation
        const allApps = boothRes.data.filter(b => b.status?.toLowerCase() !== 'available').length;
        const approved = boothRes.data.filter(b => 
          ['booked', 'approved'].includes(b.status?.toLowerCase())
        ).length;

        const sessionData = Array.isArray(sessionRes.data) ? sessionRes.data : (sessionRes.data.sessions || []);

        setStats({
          totalExpos: expoRes.data.length,
          allApplications: allApps,
          approvedBooths: approved,
          upcomingSessions: sessionData.length
        });

        setNotifications(notifyRes.data);
        setAnalyticsData(analyticsRes.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      }  {
        setLoading(false);
      }
    };

    if (isMainDashboard) fetchDashboardData();

    return () => socket.disconnect();
  }, [isMainDashboard]);

  const handleMarkRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`, {}, config);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const formatNum = (n) => (n < 10 ? `0${n}` : n);

  const adminStats = [
    { label: 'Total Expos', value: formatNum(stats.totalExpos), icon: Calendar, path: 'total-expo' },
    { label: 'Exhibitor Applications', value: formatNum(stats.allApplications), icon: Users, path: 'booking-request' },
    { label: 'Approved Booths', value: formatNum(stats.approvedBooths), icon: CheckCircle, path: 'approved-booth' },
    { label: 'Upcoming Sessions', value: formatNum(stats.upcomingSessions), icon: Clock, path: 'manage-sessions' },
  ];

  return (
    <DashboardLayout title={"Admin Dashboard"}>
      <Outlet />

      {isMainDashboard && (
        <div className="space-y-8 animate-fadeInUp">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStats.map((stat, index) => (
              <div 
                key={index} 
                onClick={() => navigate(stat.path)} 
                className="cursor-pointer transition-all duration-500 hover:-translate-y-2"
              >
                <StatBox {...stat} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Analytics Chart Box */}
            <div className="p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] transition-all duration-500 backdrop-blur-xl bg-white/5 text-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.4)]">
                      <Activity className="text-white" size={22} />
                    </div>
                    <h2 className="text-2xl font-bold font-heading tracking-tight text-white">Booth Traffic Analysis</h2>
                  </div>
                  <TrendingUp size={22} className="text-[#d100a0]" />
                </div>

                <div className="h-64 w-full">
                  {loading ? (
                    <div className="h-full flex items-center justify-center animate-pulse text-gray-400 font-medium">Loading Chart...</div>
                  ) : analyticsData?.boothTrafficData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.boothTrafficData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" tick={{fill:'#cbd5e1', fontSize: 11}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill:'#cbd5e1', fontSize: 11}} axisLine={false} tickLine={false} />
                        <Tooltip 
                          cursor={{fill: 'rgba(209,0,160,0.1)'}}
                          contentStyle={{ backgroundColor: '#0f0518', border: '1px solid rgba(209,0,160,0.4)', borderRadius: '16px', color: '#fff' }}
                        />
                        <Bar dataKey="booked" fill="#d100a0" radius={[6, 6, 0, 0]} barSize={28} name="Booked" />
                        <Bar dataKey="available" fill="#7210a6" radius={[6, 6, 0, 0]} barSize={28} name="Available" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 italic font-medium">No Data Available</div>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications & Recent Activity Box */}
            <div className="p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.25)] transition-all duration-500 backdrop-blur-xl bg-white/5 text-white flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold font-heading text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.4)]">
                      <Bell size={22} className="text-white" />
                    </div>
                    Recent Activity
                  </h2>
                  
                  <span className="text-xs font-bold bg-[#d100a0]/20 text-white border border-[#d100a0]/50  px-3 py-2 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(209,0,160,0.3)]">
                    {notifications.filter(n => !n.isRead).length} New Updates
                  </span>
                </div>
                
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2">
                  {notifications.length > 0 ? (
                    notifications.map((note) => (
                      <div 
                        key={note._id} 
                        onClick={() => !note.isRead && handleMarkRead(note._id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                          note.isRead 
                          ? 'border-white/5 bg-white/5 opacity-60' 
                          : 'border-[#d100a0]/40 bg-white/10 hover:bg-white/15 shadow-[0_0_20px_rgba(209,0,160,0.15)]'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className={`text-sm ${!note.isRead ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>
                            {note.title}
                          </p>
                          {!note.isRead && <div className="h-2.5 w-2.5 bg-[#d100a0] rounded-full animate-pulse shadow-[0_0_10px_rgba(209,0,160,1)]"></div>}
                        </div>
                        <p className="text-xs text-gray-300 mt-1 line-clamp-1">{note.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-[10px] text-gray-400 font-medium">{new Date(note.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          <span className="text-[9px] uppercase px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-gray-300 font-bold tracking-wider">
                            {note.type}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                      <Activity size={36} className="text-[#d100a0] mb-2" />
                      <p className="text-sm font-medium">No recent activity found</p>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => navigate('booking-request')}
                className="group relative w-full mt-6 inline-flex items-center justify-center gap-3 py-3.5 sm:py-4 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_30px_rgba(209,0,160,0.6)] transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(209,0,160,0.9)] hover:border-white/60 active:scale-95 focus:outline-none cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d100a0] to-[#7210a6] blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500 -z-10"></span>
                <span className="relative z-10 tracking-wider font-heading uppercase text-xs sm:text-sm">View All Applications</span>
                <ArrowRight className="relative z-10 text-base transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;