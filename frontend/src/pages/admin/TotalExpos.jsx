import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Search, Loader2, LayoutGrid, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TotalExpos = () => {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const response = await axios.get('/admin/get');
        setExpos(response.data);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpos();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const filteredExpos = expos.filter(expo =>
    expo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expo.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 page-transition">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
              
      <button 
        type="button" 
        onClick={() => navigate('/admin/dashboard')}
        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Admin Dashboard
      </button>
          <h2 className="text-3xl font-bold text-white mb-2">Total Registered Expos</h2>
          <p className="text-gray-400 text-sm">Overview of all exhibition events currently in the system.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search expos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 p-2.5 pl-10 rounded-xl text-white outline-none focus:border-purple-500/50 w-full md:w-64 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExpos.map((expo) => (
          <div 
            key={expo._id}
            className="group bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between shadow-lg text-white"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                  <Calendar size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                  {expo.theme || 'Event'}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-400 transition-colors">
                {expo.title}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Calendar size={14} className="text-purple-500/70" />
                  <span>{formatDate(expo.startDate)} — {formatDate(expo.endDate)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <MapPin size={14} className="text-purple-500/70" />
                  <span className="truncate">{expo.location}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/admin/dashboard/manage-expos`)}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-purple-600 rounded-xl text-white text-sm font-bold transition-all border border-white/5 group-hover:border-purple-500/30"
            >
              View in Management <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalExpos;