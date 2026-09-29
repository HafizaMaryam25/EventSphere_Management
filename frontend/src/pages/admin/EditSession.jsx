import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../lib/api';
import { 
  Save, 
  ArrowLeft as ArrowIcon, 
  Loader2, 
  Clock, 
  User, 
  MapPin, 
  Sparkles 
} from 'lucide-react';
import { toast } from 'react-toastify';

const EditSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    startTime: '',
    endTime: '',
    location: ''
  });

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const res = await axios.get('/admin/manage/sessions');
        const sessionToEdit = res.data.find(s => s._id === id);
        
        if (sessionToEdit) {
          setFormData({
            title: sessionToEdit.title,
            speaker: sessionToEdit.speaker,
            startTime: new Date(sessionToEdit.startTime).toISOString().slice(0, 16),
            endTime: new Date(sessionToEdit.endTime).toISOString().slice(0, 16),
            location: sessionToEdit.location
          });
        }
      } catch (err) {
        toast.error("Session details load nahi ho sakiin", {
          style: { backgroundColor: '#0f0518', color: '#fff', border: '1px solid rgba(225,29,72,0.5)' }
        });
      }  {
        setLoading(false);
      }
    };
    fetchSessionDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/admin/manage/sessions/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Session successfully update ho gaya!", {
        position: "top-right",
        autoClose: 2000,
        style: { backgroundColor: '#0f0518', color: '#fff', border: '1px solid rgba(209,0,160,0.5)' }
      });
      
      setTimeout(() => {
        navigate('/admin/dashboard/manage-sessions');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update fail ho gaya", {
        style: { backgroundColor: '#0f0518', color: '#fff', border: '1px solid rgba(225,29,72,0.5)' }
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-[#d100a0]">
        <Loader2 className="animate-spin" size={44} />
        <p className="text-gray-300 text-sm font-medium animate-pulse">Fetching session details...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeInUp">
      {/* Back Button */}
      <button 
        type="button" 
        onClick={() => navigate('/admin/dashboard/manage-sessions')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-[#d100a0] transition-colors duration-300"
      >
        <ArrowIcon size={18} /> Back to Manage Sessions
      </button>

      {/* Main Glass Form Container */}
      <div className="p-8 sm:p-10 rounded-3xl border border-white/10 hover:border-[#d100a0]/40 transition-all duration-500 backdrop-blur-xl bg-white/5 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.4)]">
            <Sparkles className="text-white" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading tracking-tight text-white">Edit Session Details</h2>
            <p className="text-xs text-gray-400 mt-0.5">Modify the timing, speaker, or location of the scheduled session.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
              Session Title
            </label>
            <div className="relative flex items-center">
              <Sparkles className="absolute left-4 text-[#d100a0]" size={18} />
              <input 
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. AI Revolution in 2026"
                className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Speaker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
                Speaker Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 text-purple-400" size={18} />
                <input 
                  type="text"
                  required
                  value={formData.speaker}
                  onChange={(e) => setFormData({...formData, speaker: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
                Location / Hall
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-4 text-[#d100a0]" size={18} />
                <input 
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
                Start Time
              </label>
              <div className="relative flex items-center">
                <Clock className="absolute left-4 text-[#d100a0]" size={18} />
                <input 
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 [color-scheme:dark]"
                />
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
                End Time
              </label>
              <div className="relative flex items-center">
                <Clock className="absolute left-4 text-purple-400" size={18} />
                <input 
                  type="datetime-local"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-4 border-t border-white/10">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all border border-white/10 font-heading"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={updating}
              className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_25px_rgba(209,0,160,0.5)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(209,0,160,0.8)] active:scale-95 disabled:opacity-50 text-xs uppercase tracking-wider font-heading"
            >
              {updating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSession;