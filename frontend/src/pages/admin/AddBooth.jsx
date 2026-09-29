import React, { useState, useEffect } from 'react';
import axios from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  Sparkles,
  Building2,
  Hash,
  Tag,
  IndianRupee,
  Layers
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBooths = () => {
  const [expos, setExpos] = useState([]);
  const [selectedExpo, setSelectedExpo] = useState('');
  const [loading, setLoading] = useState(false);

  const [boothRows, setBoothRows] = useState([
    {
      boothNumber: '',
      price: '',
      category: 'Standard'
    }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const res = await axios.get('/admin/get');

        setExpos(res.data);
      } catch (err) {
        console.error('Expos fetch error:', err);
        toast.error('Failed to load expos.');
      }
    };

    fetchExpos();
  }, []);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;

    const updatedRows = [...boothRows];

    updatedRows[index][name] = value;

    setBoothRows(updatedRows);
  };

  const addNewRow = () => {
    setBoothRows([
      ...boothRows,
      {
        boothNumber: '',
        price: '',
        category: 'Standard'
      }
    ]);
  };

  const removeRow = (index) => {
    if (boothRows.length === 1) return;

    setBoothRows(
      boothRows.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedExpo) {
      return toast.warn('Please select an expo');
    }

    setLoading(true);

    try {
      await axios.post(
        '/api/booths/add-multiple',
        {
          expoId: selectedExpo,
          booths: boothRows
        }
      );

      toast.success(
        'All booths saved successfully!',
        {
          position: 'top-right',
          autoClose: 2000
        }
      );

      setTimeout(() => {
        navigate('/admin/dashboard/manage-booth');
      }, 2500);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to save booths'
      );
    } finally {
      setLoading(false);
    }
  };

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
            Setup Expo Booths
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Create multiple exhibition booths for your selected expo.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Expo Selection */}
        <div className="p-8 rounded-3xl border border-white/10 hover:border-[#d100a0]/30 transition-all duration-500 backdrop-blur-xl bg-white/5 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#d100a0] to-purple-800 flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.35)]">
              <Building2
                size={20}
                className="text-white"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Target Expo
              </h3>

              <p className="text-xs text-gray-400">
                Select the event where these booths will be created.
              </p>
            </div>
          </div>

          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Select Expo Event
          </label>

          <select
            value={selectedExpo}
            onChange={(e) =>
              setSelectedExpo(e.target.value)
            }
            required
            className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-[#d100a0] focus:ring-1 focus:ring-[#d100a0] p-4 rounded-2xl text-white outline-none transition-all"
          >
            <option
              value=""
              className="bg-[#0f0518]"
            >
              -- Choose Expo --
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

        {/* Booth Builder */}
        <div className="rounded-3xl border border-white/10 hover:border-[#d100a0]/30 transition-all duration-500 backdrop-blur-xl bg-white/5 overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="p-6 md:p-8 border-b border-white/10 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#d100a0] to-purple-800 flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.35)]">
                <Layers
                  size={20}
                  className="text-white"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Booth Configuration
                </h3>

                <p className="text-xs text-gray-400">
                  Add as many booths as required.
                </p>
              </div>
            </div>

            <div className="self-start text-[10px] font-bold uppercase tracking-wider text-[#f472d0] bg-[#d100a0]/10 border border-[#d100a0]/20 px-3 py-2 rounded-full">
              {boothRows.length}{' '}
              {boothRows.length === 1
                ? 'Booth'
                : 'Booths'}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/10 border-b border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider font-heading">
                  <th className="px-6 py-5">
                    Booth Number
                  </th>

                  <th className="px-6 py-5">
                    Category
                  </th>

                  <th className="px-6 py-5">
                    Price
                  </th>

                  <th className="px-6 py-5 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {boothRows.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {/* Booth Number */}
                    <td className="px-6 py-5">
                      <div className="relative">
                        <Hash
                          size={15}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d100a0]"
                        />

                        <input
                          name="boothNumber"
                          value={row.boothNumber}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              e
                            )
                          }
                          placeholder="A-1"
                          required
                          className="w-full bg-black/30 border border-white/10 focus:border-[#d100a0] p-3.5 pl-10 rounded-xl text-white placeholder-gray-600 outline-none transition-all"
                        />
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">
                      <div className="relative">
                        <Tag
                          size={15}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none"
                        />

                        <select
                          name="category"
                          value={row.category}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              e
                            )
                          }
                          className="w-full bg-black/30 border border-white/10 focus:border-[#d100a0] p-3.5 pl-10 rounded-xl text-gray-200 outline-none transition-all"
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
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5">
                      <div className="relative">
                        <IndianRupee
                          size={15}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400"
                        />

                        <input
                          name="price"
                          type="number"
                          value={row.price}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              e
                            )
                          }
                          placeholder="5000"
                          required
                          className="w-full bg-black/30 border border-white/10 focus:border-[#d100a0] p-3.5 pl-10 rounded-xl text-white placeholder-gray-600 outline-none transition-all"
                        />
                      </div>
                    </td>

                    {/* Delete */}
                    <td className="px-6 py-5 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          removeRow(index)
                        }
                        disabled={
                          boothRows.length === 1
                        }
                        className="p-3 bg-white/5 text-gray-400 hover:bg-rose-600 hover:text-white rounded-xl border border-white/10 hover:border-rose-500 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                        title="Remove Booth"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-5 space-y-4">
            {boothRows.map((row, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl border border-white/10 bg-black/20"
              >
                <div className="flex justify-between items-center mb-5">
                  <span className="text-xs font-black uppercase tracking-wider text-[#d100a0]">
                    Booth #{index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeRow(index)
                    }
                    disabled={
                      boothRows.length === 1
                    }
                    className="p-2.5 bg-white/5 text-gray-400 hover:bg-rose-600 hover:text-white rounded-xl border border-white/10 disabled:opacity-20"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-2 block">
                      Booth Number
                    </label>

                    <input
                      name="boothNumber"
                      value={row.boothNumber}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          e
                        )
                      }
                      placeholder="A-1"
                      required
                      className="w-full bg-black/30 border border-white/10 focus:border-[#d100a0] p-3.5 rounded-xl text-white placeholder-gray-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-2 block">
                      Category
                    </label>

                    <select
                      name="category"
                      value={row.category}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          e
                        )
                      }
                      className="w-full bg-black/30 border border-white/10 focus:border-[#d100a0] p-3.5 rounded-xl text-white outline-none"
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

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-2 block">
                      Price (Rs.)
                    </label>

                    <input
                      name="price"
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          e
                        )
                      }
                      placeholder="5000"
                      required
                      className="w-full bg-black/30 border border-white/10 focus:border-[#d100a0] p-3.5 rounded-xl text-white placeholder-gray-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Row */}
          <button
            type="button"
            onClick={addNewRow}
            className="group w-full p-5 border-t border-white/10 text-sm text-[#f472d0] hover:text-white hover:bg-[#d100a0]/10 flex items-center justify-center gap-2 transition-all font-bold"
          >
            <Plus
              size={17}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
            Add Another Booth
          </button>
        </div>

        {/* Save */}
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full inline-flex items-center justify-center gap-3 py-4 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_30px_rgba(209,0,160,0.6)] transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(209,0,160,0.9)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

          {loading ? (
            <Loader2
              className="animate-spin relative z-10"
              size={20}
            />
          ) : (
            <Save
              size={20}
              className="relative z-10"
            />
          )}

          <span className="relative z-10 tracking-wider font-heading uppercase text-xs sm:text-sm">
            {loading
              ? 'Saving Booths...'
              : 'Save All Booths for this Expo'}
          </span>
        </button>
      </form>
    </div>
  );
};

export default AddBooths;