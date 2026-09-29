import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, MapPin, Calendar, Loader2, Plus, AlertTriangle, Sparkles } from 'lucide-react';
import axios from '../../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageExpos = () => {
  const navigate = useNavigate();
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/get');
      setExpos(response.data);
    } catch (error) {
      console.error("Error fetching expos:", error);
      toast.error("Failed to load expos data.");
    }  {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpos();
  }, []);

  // Custom Dark Glass Toast Confirmation
  const handleDelete = (id) => {
    const Msg = ({ closeToast }) => (
      <div className="flex flex-col gap-3 p-2 text-white">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <AlertTriangle size={20} />
          <span>Confirm Action</span>
        </div>
        <p className="text-xs text-gray-300">
          Are you sure you want to delete this Expo permanently? This action cannot be undone.
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
    const loadingToast = toast.loading("Deleting expo...", {
      style: { backgroundColor: '#0f0518', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
    try {
      await axios.delete(`/admin/delete/${id}`);
      setExpos(expos.filter(expo => expo._id !== id));
      
      toast.update(loadingToast, { 
        render: "Expo deleted successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
    } catch (error) {
      toast.update(loadingToast, { 
        render: "Error deleting expo.", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-8 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 text-white">
        <div>
          <h2 className="text-3xl font-black font-heading tracking-tight text-white flex items-center gap-3">
            <Sparkles className="text-[#d100a0]" size={28} />
            Manage Expos
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Monitor, edit, and organize all live and scheduled exhibition events.
          </p>
        </div>

        <Link 
          to="/admin/dashboard/create-expo" 
          className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_25px_rgba(209,0,160,0.5)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(209,0,160,0.8)] active:scale-95 text-xs uppercase tracking-wider font-heading"
        >
          <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
          <span>Create New Expo</span>
        </Link>
      </div>

      {/* Main Table Card */}
      {loading ? (
        <div className="p-16 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-[#d100a0]">
          <Loader2 className="animate-spin mb-4" size={44} />
          <p className="text-gray-300 font-medium animate-pulse text-sm">Loading Exhibition Data...</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 hover:border-[#d100a0]/30 transition-all duration-500 backdrop-blur-xl bg-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/10 border-b border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider font-heading">
                  <th className="px-8 py-6">Event Details</th>
                  <th className="px-8 py-6">Schedule</th>
                  <th className="px-8 py-6">Location</th>
                  <th className="px-8 py-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {expos.length > 0 ? (
                  expos.map((expo) => (
                    <tr key={expo._id} className="hover:bg-white/10 transition-colors duration-300 group">
                      {/* Event Details */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-lg group-hover:text-[#d100a0] transition-colors font-heading tracking-wide">
                            {expo.title}
                          </span>
                          <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                            Theme: <span className="text-purple-300 font-normal">{expo.theme || 'N/A'}</span>
                          </span>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-[#d100a0] w-10">Start:</span>
                            <Calendar size={14} className="text-[#d100a0]" />
                            <span className="text-gray-200 font-medium">{formatDate(expo.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-purple-400 w-10">End:</span>
                            <Calendar size={14} className="text-purple-400" />
                            <span className="text-gray-200 font-medium">{formatDate(expo.endDate)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2.5 text-gray-200">
                          <div className="w-8 h-8 rounded-xl bg-[#d100a0]/15 border border-[#d100a0]/30 flex items-center justify-center flex-shrink-0">
                            <MapPin size={16} className="text-[#d100a0]" />
                          </div>
                          <span className="text-sm font-medium">{expo.location}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => navigate(`/admin/dashboard/edit-expo/${expo._id}`)} 
                            className="p-3 bg-white/5 hover:bg-[#d100a0] text-gray-300 hover:text-white rounded-2xl border border-white/10 hover:border-[#d100a0] transition-all duration-300 hover:shadow-[0_0_15px_rgba(209,0,160,0.5)] active:scale-95"
                            title="Edit Event"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(expo._id)}
                            className="p-3 bg-white/5 hover:bg-rose-600 text-gray-300 hover:text-white rounded-2xl border border-white/10 hover:border-rose-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(225,29,72,0.5)] active:scale-95"
                            title="Delete Event"
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
                        <Calendar size={48} className="text-[#d100a0] opacity-50" />
                        <p className="text-base font-medium">No Expos Found</p>
                        <p className="text-xs text-gray-500">Click "Create New Expo" above to add your first event.</p>
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

export default ManageExpos;