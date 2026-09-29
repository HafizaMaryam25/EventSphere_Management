
import React, { useState, useEffect } from 'react';
import axios, { getImageUrl } from '../../lib/api';
import {
  Users,
  Search,
  Eye,
  FileText,
  Globe,
  Phone,
  Mail,
  X,
  Loader2,
  Calendar,
  Building2,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const ExhibitorList = () => {
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExhibitor, setSelectedExhibitor] = useState(null);

  useEffect(() => {
    const fetchExhibitors = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get('/api/exhibitor/all-exhibitors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setExhibitors(res.data);
      } catch (err) {
        console.error('Error fetching exhibitors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitors();
  }, []);

  const filteredExhibitors = exhibitors.filter(
    (ex) =>
      ex.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeInUp text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-8 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5">
        <div>
          <h2 className="text-3xl font-black font-heading tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.4)]">
              <Users size={23} />
            </div>
            Exhibitor Directory
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Monitor and manage all registered company profiles and assets.
          </p>
        </div>

        {/* Search */}
        <div className="relative group w-full lg:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#d100a0] transition-colors"
            size={20}
          />

          <input
            type="text"
            placeholder="Search by company or industry..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-[#d100a0]/50 focus:shadow-[0_0_20px_rgba(209,0,160,0.15)] transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="p-16 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-[#d100a0]">
          <Loader2 className="animate-spin mb-4" size={44} />
          <p className="text-gray-300 font-medium animate-pulse text-sm">
            Loading exhibitor data...
          </p>
        </div>
      ) : (
        <>
          {/* Empty Database */}
          {exhibitors.length === 0 ? (
            <div className="p-16 rounded-3xl border border-dashed border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-[#d100a0]/10 border border-[#d100a0]/20 flex items-center justify-center mb-5">
                <Building2 size={42} className="text-[#d100a0]/60" />
              </div>

              <h3 className="text-xl font-bold text-white">
                No Exhibitors Registered
              </h3>

              <p className="text-gray-500 mt-2 text-sm">
                Currently, there are no company profiles available in the
                system.
              </p>
            </div>
          ) : filteredExhibitors.length === 0 ? (
            /* No Search Match */
            <div className="p-16 rounded-3xl border border-dashed border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                <AlertCircle size={42} className="text-red-400/70" />
              </div>

              <h3 className="text-xl font-bold text-white">
                No Match Found
              </h3>

              <p className="text-gray-500 mt-2 text-sm max-w-md">
                We couldn't find any company or industry matching{' '}
                <span className="text-[#d100a0] font-semibold">
                  "{searchTerm}"
                </span>
                .
              </p>

              <button
                onClick={() => setSearchTerm('')}
                className="mt-6 px-5 py-2.5 rounded-full border border-[#d100a0]/30 bg-[#d100a0]/10 text-[#e879d4] hover:bg-[#d100a0] hover:text-white transition-all duration-300 text-xs font-bold uppercase tracking-wider"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* Exhibitor Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredExhibitors.map((ex) => (
                <div
                  key={ex._id}
                  className="group relative p-6 rounded-3xl border border-white/10 hover:border-[#d100a0]/50 hover:shadow-[0_0_30px_rgba(209,0,160,0.2)] backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-all duration-500 overflow-hidden"
                >
                  {/* Glow */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#d100a0]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Logo + Button */}
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-black/30 overflow-hidden border border-white/10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]">
                      {ex.logo ? (
                        <img
                          src={getImageUrl(ex.logo)}
                          className="w-full h-full object-cover"
                          alt="logo"
                        />
                      ) : (
                        <Building2
                          size={32}
                          className="text-[#d100a0]/60"
                        />
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedExhibitor(ex)}
                      className="group/view inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#d100a0]/20 to-[#6b21a8]/20 border border-[#d100a0]/30 text-white hover:from-[#d100a0] hover:to-[#6b21a8] hover:border-white/30 hover:shadow-[0_0_20px_rgba(209,0,160,0.4)] transition-all duration-300 text-xs font-bold"
                    >
                      <Eye size={15} />
                      View
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white truncate group-hover:text-[#e879d4] transition-colors font-heading">
                    {ex.companyName}
                  </h3>

                  <div className="flex items-center gap-2 mt-1 mb-5">
                    <Sparkles size={12} className="text-[#d100a0]" />
                    <p className="text-[#e879d4] text-[10px] font-black uppercase tracking-widest">
                      {ex.industry || 'Industry N/A'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-5 border-t border-white/5">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-8 h-8 rounded-xl bg-[#d100a0]/10 border border-[#d100a0]/20 flex items-center justify-center shrink-0">
                        <Phone size={14} className="text-[#d100a0]" />
                      </div>

                      <span className="truncate">
                        {ex.contactPhone || 'No phone available'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-8 h-8 rounded-xl bg-[#d100a0]/10 border border-[#d100a0]/20 flex items-center justify-center shrink-0">
                        <Mail size={14} className="text-[#d100a0]" />
                      </div>

                      <span className="truncate">
                        {ex.userId?.email || 'No Email Linked'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selectedExhibitor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/10 backdrop-blur-2xl bg-[#0f0518]/95 shadow-[0_0_60px_rgba(209,0,160,0.25)] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-[#d100a0]/10 via-purple-900/10 to-transparent flex justify-between items-center gap-4">
              <div className="flex items-center gap-5 min-w-0">
                <div className="w-16 h-16 rounded-2xl bg-[#d100a0]/10 border border-[#d100a0]/30 overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(209,0,160,0.2)]">
                  {selectedExhibitor.logo ? (
                    <img
                      src={getImageUrl(selectedExhibitor.logo)}
                      className="w-full h-full object-cover"
                      alt="logo"
                    />
                  ) : (
                    <Globe className="text-[#d100a0]" size={30} />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-2xl font-black text-white truncate font-heading">
                    {selectedExhibitor.companyName}
                  </h2>

                  <p className="text-[#e879d4] text-[10px] font-black uppercase tracking-widest mt-1">
                    {selectedExhibitor.industry || 'Industry N/A'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedExhibitor(null)}
                className="p-3 rounded-2xl bg-white/5 hover:bg-[#d100a0] text-gray-400 hover:text-white border border-white/10 hover:border-[#d100a0] transition-all duration-300 shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    icon: Mail,
                    label: 'Email Address',
                    value: selectedExhibitor.userId?.email || 'N/A',
                  },
                  {
                    icon: Phone,
                    label: 'Contact No',
                    value: selectedExhibitor.contactPhone || 'N/A',
                  },
                  {
                    icon: Calendar,
                    label: 'Registered On',
                    value: selectedExhibitor.createdAt
                      ? new Date(
                          selectedExhibitor.createdAt
                        ).toLocaleDateString()
                      : 'N/A',
                  },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={index}
                      className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-[#d100a0]/30 transition-all text-center"
                    >
                      <Icon
                        size={19}
                        className="text-[#d100a0] mx-auto mb-2"
                      />
                      <p className="text-gray-500 text-[10px] uppercase font-black tracking-wider mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm text-white truncate">
                        {item.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Company Overview */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-7 w-1 rounded-full bg-gradient-to-b from-[#d100a0] to-[#6b21a8]" />
                  <h4 className="text-lg font-bold font-heading">
                    Company Overview
                  </h4>
                </div>

                <div className="p-6 rounded-2xl border border-white/10 bg-black/20 text-gray-400 leading-relaxed">
                  {selectedExhibitor.description ||
                    'No company description provided.'}
                </div>
              </section>

              {/* Products */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-7 w-1 rounded-full bg-gradient-to-b from-[#d100a0] to-[#6b21a8]" />
                  <h4 className="text-lg font-bold font-heading">
                    Product Showcase
                  </h4>
                </div>

                {selectedExhibitor.productShowcase?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedExhibitor.productShowcase.map((prod, i) => (
                      <div
                        key={i}
                        className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-[#d100a0]/40 hover:shadow-[0_0_20px_rgba(209,0,160,0.15)] transition-all"
                      >
                        <div className="h-32 overflow-hidden">
                          <img
                            src={getImageUrl(prod.image)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            alt={prod.name}
                          />
                        </div>

                        <div className="p-3">
                          <p className="text-xs font-bold text-center truncate text-gray-300">
                            {prod.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">
                    No products featured yet.
                  </p>
                )}
              </section>

              {/* Documents */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-7 w-1 rounded-full bg-gradient-to-b from-[#d100a0] to-[#6b21a8]" />
                  <h4 className="text-lg font-bold font-heading">
                    Verification Documents
                  </h4>
                </div>

                {selectedExhibitor.documents?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedExhibitor.documents.map((doc, i) => (
                      <a
                        key={i}
                        href={getImageUrl(doc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#d100a0]/40 transition-all"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="p-3 rounded-xl bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all">
                            <FileText size={20} />
                          </div>

                          <span className="text-sm font-semibold truncate">
                            Document_{i + 1}.pdf
                          </span>
                        </div>

                        <ExternalLink
                          size={17}
                          className="text-gray-600 group-hover:text-[#d100a0] shrink-0"
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">
                    No documents uploaded.
                  </p>
                )}
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end">
              <button
                onClick={() => setSelectedExhibitor(null)}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 font-extrabold text-white rounded-full overflow-hidden border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_25px_rgba(209,0,160,0.45)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(209,0,160,0.7)] active:scale-95"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 text-xs uppercase tracking-wider font-heading">
                  Close Profile
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitorList;

