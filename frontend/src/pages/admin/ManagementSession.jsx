import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../lib/api';
import { Plus, Edit2, Trash2, Clock, User, MapPin, Loader2, AlertTriangle, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const ManageSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/manage/sessions');
      setSessions(Array.isArray(res.data) ? res.data : (res.data.sessions || []));
    } catch (err) {
      toast.error("Records load nahi ho sakay.", {
        style: { backgroundColor: '#0f0518', color: '#fff', border: '1px solid rgba(225,29,72,0.5)' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const confirmDelete = (id, title) => {
    const Msg = ({ closeToast }) => (
      <div className="flex flex-col gap-3 p-2 text-white">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <AlertTriangle size={20} />
          <span>Confirm Action</span>
        </div>
        <p className="text-xs text-gray-300">
          Delete session <span className="text-[#d100a0] font-semibold">"{title}"</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={closeToast}
            className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              closeToast();
              executeDelete(id);
            }}
            className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-full transition-all shadow-[0_0_15px_rgba(225,29,72,0.4)]"
          >
            Delete Now
          </button>
        </div>
      </div>
    );

    toast.warn(<Msg />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      icon: false,
      style: {
        backgroundColor: '#0f0518',
        border: '1px solid rgba(209,0,160,0.4)',
        borderRadius: '20px',
        backdropFilter: 'blur(16px)'
      }
    });
  };

  const executeDelete = async (id) => {
    const loadingToast = toast.loading("Deleting session...", {
      style: { backgroundColor: '#0f0518', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/admin/manage/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(prev => prev.filter(s => s._id !== id));
      
      toast.update(loadingToast, { 
        render: "Session deleted successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
    } catch (err) {
      toast.update(loadingToast, { 
        render: "Delete fail ho gaya.", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-8 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 text-white">
        <div>
          <h2 className="text-3xl font-black font-heading tracking-tight text-white flex items-center gap-3">
            <Sparkles className="text-[#d100a0]" size={28} />
            Manage Sessions
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage speaker schedules, timings, and talk locations.
          </p>
        </div>

        <Link 
          to="/admin/dashboard/add-session" 
          className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_25px_rgba(209,0,160,0.5)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(209,0,160,0.8)] active:scale-95 text-xs uppercase tracking-wider font-heading"
        >
          <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
          <span>Add New Session</span>
        </Link>
      </div>

      {/* Main Table Card */}
      {loading ? (
        <div className="p-16 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-[#d100a0]">
          <Loader2 className="animate-spin mb-4" size={44} />
          <p className="text-gray-300 font-medium animate-pulse text-sm">Loading Schedules...</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 hover:border-[#d100a0]/30 transition-all duration-500 backdrop-blur-xl bg-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/10 border-b border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider font-heading">
                  <th className="px-8 py-6">Session & Speaker</th>
                  <th className="px-8 py-6">Timing</th>
                  <th className="px-8 py-6">Location</th>
                  <th className="px-8 py-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <tr key={session._id} className="hover:bg-white/10 transition-colors duration-300 group">
                      {/* Session & Speaker */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-lg group-hover:text-[#d100a0] transition-colors font-heading tracking-wide">
                            {session.title}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-purple-300 mt-1 uppercase tracking-wider font-semibold">
                            <User size={13} className="text-[#d100a0]" />
                            <span>{session.speaker}</span>
                          </div>
                        </div>
                      </td>

                      {/* Timing */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-[#d100a0]" />
                            <span className="text-gray-200 font-medium">
                              {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar size={12} className="text-purple-400" />
                            <span>
                              {new Date(session.startTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2.5 text-gray-200">
                          <div className="w-8 h-8 rounded-xl bg-[#d100a0]/15 border border-[#d100a0]/30 flex items-center justify-center flex-shrink-0">
                            <MapPin size={16} className="text-[#d100a0]" />
                          </div>
                          <span className="text-sm font-medium">{session.location}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => navigate(`/admin/dashboard/edit-session/${session._id}`)} 
                            className="p-3 bg-white/5 hover:bg-[#d100a0] text-gray-300 hover:text-white rounded-2xl border border-white/10 hover:border-[#d100a0] transition-all duration-300 hover:shadow-[0_0_15px_rgba(209,0,160,0.5)] active:scale-95"
                            title="Edit Session"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => confirmDelete(session._id, session.title)}
                            className="p-3 bg-white/5 hover:bg-rose-600 text-gray-300 hover:text-white rounded-2xl border border-white/10 hover:border-rose-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(225,29,72,0.5)] active:scale-95"
                            title="Delete Session"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-20">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Clock size={48} className="text-[#d100a0] opacity-50" />
                        <p className="text-base font-medium">No Sessions Scheduled</p>
                        <p className="text-xs text-gray-500">Click "Add New Session" above to add your first session.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSessions;