import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../lib/api';
import { toast } from 'react-toastify';
import { 
  ArrowLeft as ArrowIcon, 
  Save, 
  Clock, 
  MapPin, 
  User, 
  Tag, 
  Loader2, 
  Sparkles 
} from 'lucide-react';

const CreateSession = () => {
  const navigate = useNavigate();
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    expoId: '',
    title: '',
    speaker: '',
    startTime: '',
    endTime: '',
    location: ''
  });

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const res = await axios.get('/admin/get');
        setExpos(res.data);
      } catch (err) {
        toast.error("Expos load nahi ho sake. Dropdown empty rahega.", {
          style: { backgroundColor: '#0f0518', color: '#fff', border: '1px solid rgba(225,29,72,0.5)' }
        });
      }
    };
    fetchExpos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      return toast.error("End time, Start time ke baad honi chahiye!", {
        style: { backgroundColor: '#0f0518', color: '#fff', border: '1px solid rgba(225,29,72,0.5)' }
      });
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/admin/manage/sessions', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Session successfully schedule ho gaya!", {
        position: "top-right",
        autoClose: 2000,
        style: { backgroundColor: '#0f0518', color: '#fff', border: '1px solid rgba(209,0,160,0.5)' }
      });

      setTimeout(() => {
        navigate('/admin/dashboard/manage-sessions');
      }, 2200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Session create nahi ho saka", {
        style: { backgroundColor: '#0f0518', color: '#fff', border: '1px solid rgba(225,29,72,0.5)' }
      });
    } finally {
      setLoading(false);
    }
  };

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

      {/* Main Form Container */}
      <div className="p-8 sm:p-10 rounded-3xl border border-white/10 hover:border-[#d100a0]/40 transition-all duration-500 backdrop-blur-xl bg-white/5 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.4)]">
            <Sparkles className="text-white" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading tracking-tight text-white">Schedule New Session</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the details to add a new speaker session to an expo.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Expo Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
              Select Event (Expo)
            </label>
            <div className="relative flex items-center">
              <Tag className="absolute left-4 text-[#d100a0]" size={18} />
              <select 
                required
                value={formData.expoId}
                onChange={(e) => setFormData({...formData, expoId: e.target.value})}
                className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#0f0518] text-gray-400">Choose an Expo</option>
                {expos.map(expo => (
                  <option key={expo._id} value={expo._id} className="bg-[#0f0518] text-white">
                    {expo.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Session Title & Speaker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
                Session Title
              </label>
              <div className="relative flex items-center">
                <Sparkles className="absolute left-4 text-[#d100a0]" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. Future of Web Tech"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 placeholder:text-gray-500" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
                Speaker Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 text-purple-400" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  required
                  value={formData.speaker}
                  onChange={(e) => setFormData({...formData, speaker: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 placeholder:text-gray-500" 
                />
              </div>
            </div>
          </div>

          {/* Timings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
              Location / Hall Name
            </label>
            <div className="relative flex items-center">
              <MapPin className="absolute left-4 text-[#d100a0]" size={18} />
              <input 
                type="text" 
                placeholder="e.g. Seminar Hall A"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 placeholder:text-gray-500" 
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="group relative w-full mt-4 inline-flex items-center justify-center gap-3 py-4 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_30px_rgba(209,0,160,0.6)] transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(209,0,160,0.9)] active:scale-95 disabled:opacity-50 cursor-pointer uppercase tracking-wider text-sm font-heading"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span className="relative z-10">{loading ? "Scheduling..." : "Confirm & Schedule Session"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSession;