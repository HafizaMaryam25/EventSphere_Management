import React, { useState } from 'react';
import { MapPin, AlignLeft, Palette, Calendar as CalendarIcon, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import axios from '../../lib/api';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateExpo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    theme: ''
  });

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/admin/create', formData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Expo Created Successfully!", {
          position: "top-right",
          autoClose: 2000,
          style: {
            backgroundColor: '#0f0518',
            color: '#fff',
            border: '1px solid rgba(209,0,160,0.5)'
          }
        });

        setFormData({
          title: '', startDate: '', endDate: '', location: '', description: '', theme: ''
        });

        setTimeout(() => {
          navigate('/admin/dashboard/manage-expo');
        }, 2200);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Error creating expo event", {
        style: {
          backgroundColor: '#0f0518',
          color: '#fff',
          border: '1px solid rgba(225,29,72,0.5)'
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeInUp">
      {/* Back Button */}
      <button 
        type="button" 
        onClick={() => navigate('/admin/dashboard/manage-expo')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-[#d100a0] transition-colors duration-300"
      >
        <ArrowLeft size={18} /> Back to Manage Expos
      </button>

      {/* Main Glass Form Container */}
      <div className="p-8 sm:p-10 rounded-3xl border border-white/10 hover:border-[#d100a0]/40 transition-all duration-500 backdrop-blur-xl bg-white/5 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#d100a0] to-purple-800 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.4)]">
            <Sparkles className="text-white" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading tracking-tight text-white">Create New Expo</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the event details to host a new exhibition.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
              Expo Title
            </label>
            <div className="relative flex items-center">
              <Sparkles className="absolute left-4 text-[#d100a0]" size={18} />
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Global Tech Summit 2026"
                className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
                Start Date
              </label>
              <div className="relative flex items-center">
                <CalendarIcon className="absolute left-4 text-[#d100a0]" size={18} />
                <input
                  required
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={today}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 [color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
                End Date
              </label>
              <div className="relative flex items-center">
                <CalendarIcon className="absolute left-4 text-purple-400" size={18} />
                <input
                  required
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || today} 
                  className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Location & Theme */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
                Location / Venue
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-4 text-[#d100a0]" size={18} />
                <input
                  required
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Convention Center, NY"
                  className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 placeholder:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
                Event Theme
              </label>
              <div className="relative flex items-center">
                <Palette className="absolute left-4 text-purple-400" size={18} />
                <input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  placeholder="Future of Artificial Intelligence"
                  className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-heading">
              Description
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 text-gray-400" size={18} />
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe the expo's purpose, key targets, and details..."
                className="w-full bg-black/40 border border-white/10 focus:border-[#d100a0] focus:shadow-[0_0_15px_rgba(209,0,160,0.3)] text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 placeholder:text-gray-500 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="group relative w-full mt-4 inline-flex items-center justify-center gap-3 py-4 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_30px_rgba(209,0,160,0.6)] transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(209,0,160,0.9)] active:scale-95 disabled:opacity-50 cursor-pointer uppercase tracking-wider text-sm font-heading"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
            <span className="relative z-10">{loading ? "Creating Event..." : "Create Expo Event"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateExpo;