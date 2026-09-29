import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, AlignLeft, Palette, Save, Loader2, Sparkles, Calendar as CalendarIcon, ArrowLeft as ArrowIcon } from 'lucide-react';
import axios from '../../lib/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditExpo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    theme: ''
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchExpoDetails = async () => {
      try {
        const res = await axios.get(`/admin/get/${id}`);
        const formattedStartDate = res.data.startDate ? res.data.startDate.split('T')[0] : '';
        const formattedEndDate = res.data.endDate ? res.data.endDate.split('T')[0] : '';
        
        setFormData({ 
          ...res.data, 
          startDate: formattedStartDate, 
          endDate: formattedEndDate 
        });
      } catch (err) {
        console.error("Error loading expo details", err);
        toast.error("Could not load expo details.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpoDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const { _id, __v, ...updateData } = formData;
      await axios.put(`/admin/update/${id}`, updateData);
      
      toast.success("Expo Updated Successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate('/admin/dashboard/manage-expo');
      }, 2500);

    } catch (error) {
      setUpdating(false);
      toast.error(error.response?.data?.message || "Update Failed! Please try again.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 text-purple-400">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="text-gray-400 animate-pulse">Loading event details...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto page-transition p-8">
      {/* Container with high z-index to make sure it's visible */}
   

      <button 
        type="button" 
        onClick={() => navigate('/admin/dashboard/manage-expo')}
        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 transition-colors"
      >
        <ArrowIcon size={20} /> Back to Manage Expos
      </button>

      <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
        <form className="auth-form space-y-2" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-white mb-4">Edit Expo Event</h2>
          
          <div className="form-group">
            <label className="form-label text-gray-300">Expo Title</label>
            <div className="input-wrapper relative flex items-center">
              <Sparkles className="input-icon absolute left-3 text-gray-400" size={20} />
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control w-full pl-10 bg-white/5 border-white/10 text-white rounded-lg p-2.5"
                placeholder="e.g. Global Tech Summit 2026"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label text-gray-300">Start Date</label>
              <div className="input-wrapper relative flex items-center">
                <CalendarIcon className="input-icon absolute left-3 text-gray-400" size={20} />
                <input
                  required
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={today}
                  className="form-control w-full pl-10 bg-white/5 border-white/10 text-white rounded-lg p-2.5"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label text-gray-300">End Date</label>
              <div className="input-wrapper relative flex items-center">
                <CalendarIcon className="input-icon absolute left-3 text-gray-400" size={20} />
                <input
                  required
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || today}
                  className="form-control w-full pl-10 bg-white/5 border-white/10 text-white rounded-lg p-2.5"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label text-gray-300">Location / Venue</label>
              <div className="input-wrapper relative flex items-center">
                <MapPin className="input-icon absolute left-3 text-gray-400" size={20} />
                <input
                  required
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-control w-full pl-10 bg-white/5 border-white/10 text-white rounded-lg p-2.5"
                  placeholder="Convention Center, NY"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label text-gray-300">Event Theme</label>
              <div className="input-wrapper relative flex items-center">
                <Palette className="input-icon absolute left-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="form-control w-full pl-10 bg-white/5 border-white/10 text-white rounded-lg p-2.5"
                  placeholder="Future of AI"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label text-gray-300">Description</label>
            <div className="input-wrapper relative">
              <AlignLeft className="input-icon absolute left-3 top-4 text-gray-400" size={20} />
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="form-control w-full pl-10 pt-2 min-h-[120px] bg-white/5 border-white/10 text-white rounded-lg p-2.5"
                placeholder="Describe the expo..."
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              disabled={updating}
              onClick={() => navigate('/admin/dashboard/manage-expo')}
              className="flex-1 px-4 py-4 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={updating}
              className="flex-[2] flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-4 rounded-xl font-bold transition-all shadow-xl shadow-purple-900/20 disabled:opacity-50"
            >
              {updating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {updating ? "Updating..." : "Update Expo Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpo;