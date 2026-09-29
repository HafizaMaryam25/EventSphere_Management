import React, { useState, useEffect } from 'react';
import axios from '../../lib/api';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Loader2,
  Sparkles,
  Building2,
  Hash,
  Tag,
  IndianRupee
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateBooth = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expos, setExpos] = useState([]);

  const [formData, setFormData] = useState({
    boothNumber: '',
    price: '',
    category: 'Standard',
    expoId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const [exposRes, boothRes] = await Promise.all([
          axios.get('/admin/get', config),
          axios.get(`/api/booths/single/${id}`, config)
        ]);

        setExpos(exposRes.data);

        const booth = boothRes.data;

        setFormData({
          boothNumber: booth.boothNumber || '',
          price: booth.price || '',
          category: booth.category || 'Standard',
          expoId: booth.expoId?._id || booth.expoId || ''
        });
      } catch (err) {
        console.error('Error fetching data:', err);

        toast.error(
          err.response?.data?.message ||
            'Data load karne mein masla hua.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.warn('Session Expired! Please login again.');
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const updateData = {
        boothNumber: formData.boothNumber,
        price: Number(formData.price),
        category: formData.category,
        expoId:
          typeof formData.expoId === 'object'
            ? formData.expoId._id
            : formData.expoId
      };

      await axios.put(`/api/booths/update/${id}`, updateData, config);

      toast.success('Booth Updated Successfully!', {
        position: 'top-right',
        autoClose: 2000
      });

      setTimeout(() => {
        navigate('/admin/dashboard/manage-booth');
      }, 2000);
    } catch (err) {
      console.error('Update Error:', err.response?.data);

      if (err.response?.status === 401) {
        toast.error('Unauthorized Access');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error(
          err.response?.data?.message ||
            'Internal Server Error'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#d100a0]">
        <Loader2
          className="animate-spin mb-4"
          size={44}
        />
        <p className="text-gray-300 font-medium animate-pulse text-sm">
          Loading Booth Information...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-8 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 text-white">
        <div>
          <button
            onClick={() =>
              navigate('/admin/dashboard/manage-booth')
            }
            className="flex items-center gap-2 text-gray-400 hover:text-[#d100a0] transition-colors mb-4 text-sm font-semibold"
          >
            <ArrowLeft size={18} />
            Back to Manage Booths
          </button>

          <h2 className="text-3xl font-black font-heading tracking-tight text-white flex items-center gap-3">
            <Sparkles
              className="text-[#d100a0]"
              size={28}
            />
            Edit Booth Details
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Update booth information, pricing and category.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="p-8 md:p-10 rounded-3xl border border-white/10 hover:border-[#d100a0]/30 transition-all duration-500 backdrop-blur-xl bg-white/5 shadow-2xl"
        >
          {/* Section Heading */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#d100a0] to-purple-800 flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.35)]">
              <Building2
                size={20}
                className="text-white"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Booth Configuration
              </h3>
              <p className="text-xs text-gray-400">
                Modify the selected booth information.
              </p>
            </div>
          </div>

          {/* Expo */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              <Building2
                size={14}
                className="text-[#d100a0]"
              />
              Target Expo Event
            </label>

            <select
              name="expoId"
              value={formData.expoId}
              onChange={handleChange}
              required
              className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-[#d100a0] focus:ring-1 focus:ring-[#d100a0] p-4 rounded-2xl text-white outline-none transition-all"
            >
              <option
                value=""
                disabled
                className="bg-[#0f0518]"
              >
                Select Expo
              </option>

              {expos.map((expo) => (
                <option
                  key={expo._id}
                  value={expo._id}
                  className="bg-[#0f0518]"
                >
                  {expo.title}
                </option>
              ))}
            </select>
          </div>

          {/* Booth + Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                <Hash
                  size={14}
                  className="text-[#d100a0]"
                />
                Booth Number
              </label>

              <input
                name="boothNumber"
                value={formData.boothNumber}
                onChange={handleChange}
                placeholder="e.g. A-101"
                required
                className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-[#d100a0] focus:ring-1 focus:ring-[#d100a0] p-4 rounded-2xl text-white placeholder-gray-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                <IndianRupee
                  size={14}
                  className="text-[#d100a0]"
                />
                Price
              </label>

              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter booth price"
                required
                className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-[#d100a0] focus:ring-1 focus:ring-[#d100a0] p-4 rounded-2xl text-white placeholder-gray-600 outline-none transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div className="mt-6">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              <Tag
                size={14}
                className="text-[#d100a0]"
              />
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-[#d100a0] focus:ring-1 focus:ring-[#d100a0] p-4 rounded-2xl text-white outline-none transition-all"
            >
              <option
                value="Standard"
                className="bg-[#0f0518]"
              >
                Standard
              </option>

              <option
                value="Premium"
                className="bg-[#0f0518]"
              >
                Premium
              </option>

              <option
                value="VIP"
                className="bg-[#0f0518]"
              >
                VIP
              </option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="group relative w-full mt-8 inline-flex items-center justify-center gap-3 py-4 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_30px_rgba(209,0,160,0.5)] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_0_45px_rgba(209,0,160,0.8)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {saving ? (
              <Loader2
                size={20}
                className="animate-spin relative z-10"
              />
            ) : (
              <Save
                size={20}
                className="relative z-10"
              />
            )}

            <span className="relative z-10 text-xs sm:text-sm uppercase tracking-wider font-heading">
              {saving
                ? 'Updating Booth...'
                : 'Update Booth Information'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBooth;