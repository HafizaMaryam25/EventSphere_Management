import React, { useState, useEffect } from 'react';
import axios from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  Loader2,
  Plus,
  Edit3,
  AlertTriangle,
  Sparkles,
  Building2,
  Filter,
  Hash,
  Tag,
  IndianRupee
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageBooths = () => {
  const [booths, setBooths] = useState([]);
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterExpo, setFilterExpo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const navigate = useNavigate();

  const fetchBooths = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`/api/booths/all?expoId=${filterExpo}&status=${filterStatus}`);

      setBooths(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to load booths data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadExpos = async () => {
      try {
        const res = await axios.get('/admin/get');

        setExpos(res.data);
      } catch (err) {
        console.error('Expos fetch error:', err);
      }
    };

    loadExpos();
    fetchBooths();
  }, [filterExpo, filterStatus]);

  const getCategoryStyle = (cat) => {
    const category = cat?.toLowerCase();

    if (category === 'gold') {
      return 'bg-amber-400/10 text-amber-400 border-amber-500/20';
    }

    if (category === 'silver') {
      return 'bg-slate-400/10 text-slate-300 border-slate-500/20';
    }

    if (category === 'platinum') {
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }

    if (category === 'premium') {
      return 'bg-[#d100a0]/10 text-[#f472d0] border-[#d100a0]/30';
    }

    if (category === 'vip') {
      return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
    }

    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';

      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';

      case 'Booked':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

      case 'Rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';

      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const handleDelete = (id) => {
    const Msg = ({ closeToast }) => (
      <div className="flex flex-col gap-3 p-2 text-white">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <AlertTriangle size={20} />
          <span>Confirm Action</span>
        </div>

        <p className="text-xs text-gray-300">
          Are you sure you want to delete this Booth permanently?
          This action cannot be undone.
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
      position: 'top-center',
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
    const loadingToast = toast.loading(
      'Deleting booth...',
      {
        style: {
          backgroundColor: '#0f0518',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }
    );

    try {
      await axios.delete(`/api/booths/delete/${id}`);

      setBooths((prev) =>
        prev.filter((booth) => booth._id !== id)
      );

      toast.update(loadingToast, {
        render: 'Booth deleted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (err) {
      toast.update(loadingToast, {
        render: 'Delete failed. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 text-white">
        <div>
          <h2 className="text-3xl font-black font-heading tracking-tight text-white flex items-center gap-3">
            <Sparkles
              className="text-[#d100a0]"
              size={28}
            />
            Manage Booths
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Track, monitor, edit and organize all exhibition booths.
          </p>
        </div>

        <button
          onClick={() =>
            navigate('/admin/dashboard/add-booth')
          }
          className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_25px_rgba(209,0,160,0.5)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(209,0,160,0.8)] active:scale-95 text-xs uppercase tracking-wider font-heading"
        >
          <Plus
            size={18}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          <span>Add New Booths</span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-6 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#d100a0]/15 border border-[#d100a0]/30 flex items-center justify-center">
            <Filter
              size={18}
              className="text-[#d100a0]"
            />
          </div>

          <div>
            <h3 className="text-white font-bold font-heading">
              Booth Filters
            </h3>
            <p className="text-xs text-gray-500">
              Narrow down booths by expo or current status.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-black text-gray-500 mb-2 block">
              Expo Event
            </label>

            <select
              value={filterExpo}
              onChange={(e) =>
                setFilterExpo(e.target.value)
              }
              className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-[#d100a0] p-3.5 rounded-2xl text-sm text-white outline-none transition-all"
            >
              <option
                value=""
                className="bg-[#0f0518]"
              >
                All Expos
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

          <div>
            <label className="text-[10px] uppercase tracking-wider font-black text-gray-500 mb-2 block">
              Booth Status
            </label>

            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value)
              }
              className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-[#d100a0] p-3.5 rounded-2xl text-sm text-white outline-none transition-all"
            >
              <option
                value=""
                className="bg-[#0f0518]"
              >
                All Status
              </option>

              <option
                value="Available"
                className="bg-[#0f0518]"
              >
                Available
              </option>

              <option
                value="Pending"
                className="bg-[#0f0518]"
              >
                Pending
              </option>

              <option
                value="Booked"
                className="bg-[#0f0518]"
              >
                Booked
              </option>

              <option
                value="Rejected"
                className="bg-[#0f0518]"
              >
                Rejected
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-16 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-[#d100a0]">
          <Loader2
            className="animate-spin mb-4"
            size={44}
          />

          <p className="text-gray-300 font-medium animate-pulse text-sm">
            Loading Booth Data...
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 hover:border-[#d100a0]/30 transition-all duration-500 backdrop-blur-xl bg-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-white/10 border-b border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider font-heading">
                  <th className="px-8 py-6">
                    Booth
                  </th>

                  <th className="px-8 py-6">
                    Expo Event
                  </th>

                  <th className="px-8 py-6">
                    Category
                  </th>

                  <th className="px-8 py-6">
                    Price
                  </th>

                  <th className="px-8 py-6">
                    Status
                  </th>

                  <th className="px-8 py-6 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-gray-200">
                {booths.length > 0 ? (
                  booths.map((booth) => (
                    <tr
                      key={booth._id}
                      className="hover:bg-white/10 transition-colors duration-300 group"
                    >
                      {/* Booth */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#d100a0]/15 border border-[#d100a0]/30 flex items-center justify-center">
                            <Hash
                              size={17}
                              className="text-[#d100a0]"
                            />
                          </div>

                          <span className="text-white font-bold group-hover:text-[#d100a0] transition-colors font-heading">
                            {booth.boothNumber}
                          </span>
                        </div>
                      </td>

                      {/* Expo */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2.5">
                          <Building2
                            size={16}
                            className="text-purple-400"
                          />

                          <span className="text-sm text-gray-300 font-medium">
                            {booth.expoId?.title ||
                              'Deleted Expo'}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCategoryStyle(
                            booth.category
                          )}`}
                        >
                          <Tag size={11} />
                          {booth.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <IndianRupee size={14} />
                          <span>
                            {Number(
                              booth.price || 0
                            ).toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(
                            booth.status
                          )}`}
                        >
                          {booth.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/dashboard/update-booth/${booth._id}`
                              )
                            }
                            className="p-3 bg-white/5 hover:bg-[#d100a0] text-gray-300 hover:text-white rounded-2xl border border-white/10 hover:border-[#d100a0] transition-all duration-300 hover:shadow-[0_0_15px_rgba(209,0,160,0.5)] active:scale-95"
                            title="Update Booth"
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(booth._id)
                            }
                            className="p-3 bg-white/5 hover:bg-rose-600 text-gray-300 hover:text-white rounded-2xl border border-white/10 hover:border-rose-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(225,29,72,0.5)] active:scale-95"
                            title="Delete Booth"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-20"
                    >
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Building2
                          size={48}
                          className="text-[#d100a0] opacity-50"
                        />

                        <p className="text-base font-medium">
                          No Booths Found
                        </p>

                        <p className="text-xs text-gray-500">
                          No booths match the selected filters.
                        </p>
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

export default ManageBooths;