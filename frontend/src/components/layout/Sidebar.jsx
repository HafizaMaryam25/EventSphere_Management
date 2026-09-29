import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Layout, Calendar, Users, PieChart, LogOut, Ticket, Layers, MessageSquare, LifeBuoy 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    setTimeout(() => {
      logout();
      navigate('/');
    }, 1500); 
  };

  const menuConfig = {
    Admin: [
      { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
      { icon: Calendar, label: 'Manage Expos', path: 'manage-expo' },
      { icon: Layout, label: 'Manage Sessions', path: 'manage-sessions' },
      { icon: Layers, label: 'Manage Booths', path: 'manage-booth' },
      { icon: Users, label: 'Registered Exhibitors', path: 'exhibitor-list' },
      { icon: Users, label: 'Registered Attendees', path: 'manage-attendees' },
      { icon: PieChart, label: 'Analytics', path: 'analytics' },
      { icon: LifeBuoy, label: 'Feedback & Ratings', path: 'feedbacks' },
      { icon: MessageSquare, label: 'Chating and Inquires', path: 'all-chats' },
    ],
    Exhibitor: [
      { icon: LayoutDashboard, label: 'Overview', path: '/exhibitor/dashboard' },
      { icon: Layers, label: 'Reserve Booth', path: 'Booth-Booking' },
      { icon: Users, label: 'Company Profile', path: 'add-profile' },
      { icon: MessageSquare, label: 'All Chats', path: 'all-chats' },
    ],
    Attendee: [
      { icon: LayoutDashboard, label: 'Overview', path: '/attendee/dashboard' },
      { icon: Ticket, label: 'My Tickets', path: '/tickets' },
      { icon: Layout, label: 'Explore Expos', path: '/attendee/explore' }, 
      { icon: LifeBuoy, label: 'Feedback & Ratings', path: '/support' },
    ]
  };

  const currentMenu = menuConfig[user?.role] || [];

  return (
    <aside className="w-64 bg-[#0f0518]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col fixed h-full z-50">
      {/* Brand Logo & Header */}
      <div className="p-6 border-b border-white/10">
        <NavLink to="/" className="flex items-center gap-2 group cursor-pointer mb-2">
          <svg 
            className="w-7 h-7 text-[#d100a0] drop-shadow-[0_0_12px_rgba(209,0,160,0.9)] transition-transform duration-300 group-hover:scale-110" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 2C12 6.5 15.5 10 20 10C15.5 10 12 13.5 12 18C12 13.5 8.5 10 4 10C8.5 10 12 6.5 12 2Z" />
            <path d="M19 2H21V4H23V6H21V8H19V6H17V4H19V2Z" />
            <circle cx="5" cy="19" r="1.5" />
          </svg>
          <span className="text-xl font-black tracking-tight text-white font-heading">
            EventSphere
          </span>
        </NavLink>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d100a0] bg-[#d100a0]/10 border border-[#d100a0]/30 px-3 py-1 rounded-full inline-block shadow-[0_0_10px_rgba(209,0,160,0.2)]">
          {user?.role || 'Guest'} Portal
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {currentMenu.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path}
            end={item.path === '/admin/dashboard'}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-xs tracking-wider uppercase transition-all duration-300 ${
              isActive 
                ? 'bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] text-white font-bold shadow-[0_0_25px_rgba(209,0,160,0.6)] border border-white/30' 
                : 'text-gray-300 hover:bg-white/10 hover:text-white hover:border border-transparent hover:border-white/10'
            }`}
          >
            <item.icon size={18} />
            <span className="font-heading">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Footer Button */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-rose-500/20 cursor-pointer"
        >
          <LogOut size={18} />
          <span className="font-heading">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;