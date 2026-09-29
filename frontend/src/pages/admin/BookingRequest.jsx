import React, { useState, useEffect } from 'react';
import axios from '../../lib/api';
import { Check, X, Loader2, Building2, RefreshCcw, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const BookingRequests = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/booths/all', config);
      // Sirf wo booths dikhayen jo 'Available' nahi hain (Pending or Booked)
      const filtered = res.data.filter(b => b.status !== 'Available');
      setAllRequests(filtered);
    } catch (err) { 
      toast.error("Failed to load requests"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id, actionType) => {
    try {
      await axios.patch(`/api/booths/status/${id}`, { action: actionType }, config);
      toast.success(`Request ${actionType === 'approve' ? 'Approved' : 'Rejected'}`);
      fetchRequests(); 
    } catch (err) { 
      toast.error(err.response?.data?.message || "Action failed"); 
    }
  };

  return (
    <div className="p-8 page-transition">

        <button 
            type="button" 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Admin Dashboard
          </button>
      
      <div className="flex justify-between items-center mb-8">
        
        <h2 className="text-3xl font-bold text-white">Exhibitor Applications</h2>
        <button onClick={fetchRequests} className="p-2 text-purple-400 hover:rotate-180 transition-all duration-500">
          <RefreshCcw size={20} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-500" size={40} /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-5">Booth</th>
                <th className="p-5">Company</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allRequests.map((booth) => (
                <tr key={booth._id} className="hover:bg-white/[0.02]">
                  <td className="p-5">
                    <div className="font-bold text-white">#{booth.boothNumber}</div>
                    <div className="text-xs text-gray-500">{booth.expoId?.title}</div>
                  </td>
                  <td className="p-5 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-purple-400" />
                      {booth.companyName || "N/A"}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                      booth.status === 'Booked' ? 'bg-green-500/20 text-green-400' : 
                      booth.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {booth.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-2">
                      <button 
                        disabled={booth.status !== 'Pending'} 
                        onClick={() => handleAction(booth._id, 'approve')} 
                        className={`p-2 rounded-lg transition-all ${booth.status === 'Pending' ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'opacity-20 cursor-not-allowed'}`}
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        disabled={booth.status !== 'Pending'} 
                        onClick={() => handleAction(booth._id, 'reject')} 
                        className={`p-2 rounded-lg transition-all ${booth.status === 'Pending' ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'opacity-20 cursor-not-allowed'}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allRequests.length === 0 && <p className="p-10 text-center text-gray-500 italic">No exhibitor requests found.</p>}
        </div>
      )}
    </div>
  );
};

export default BookingRequests;