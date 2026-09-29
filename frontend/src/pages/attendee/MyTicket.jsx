import React, { useState, useEffect, useRef } from 'react';
import axios from '../../lib/api';
import {
  Ticket,
  Calendar,
  MapPin,
  Download,
  X,
  Loader2,
  CheckCircle2,
  ArrowLeft as ArrowIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const ticketRef = useRef(null);
  const attendeeId = localStorage.getItem('userId')?.replace(/["']/g, '');

  useEffect(() => {
    if (attendeeId) {
      fetchTickets();
    } else {
      setLoading(false);
    }
  }, [attendeeId]);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/attendee/dashboard/${attendeeId}`
      );

      const ticketData = res.data.upcomingExpos || res.data || [];

      setTickets(Array.isArray(ticketData) ? ticketData : []);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!ticketRef.current || !selectedTicket) return;

    setIsDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const element = ticketRef.current;

      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: '#0f111a',
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'px', [
        canvas.width / 3,
        canvas.height / 3,
      ]);

      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        canvas.width / 3,
        canvas.height / 3
      );

      pdf.save(`Pass_${selectedTicket.qrCode || 'VisionEye'}.pdf`);
    } catch (err) {
      console.error('PDF Error:', err);
      alert('Download failed!');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DashboardLayout title="My Entry Passes">
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2
            className="animate-spin text-purple-500"
            size={40}
          />
        </div>
      ) : tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 page-transition">
          {tickets.map((ticket) => (
            <motion.div
              key={ticket._id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedTicket(ticket)}
              className="group relative overflow-hidden rounded-[2.5rem] p-8 border border-white/10 bg-white/5 cursor-pointer hover:border-purple-500/50 hover:bg-white/[0.08] shadow-2xl flex flex-col justify-between min-h-[280px] transition-all duration-500"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest">
                    {ticket.ticketType || 'GENERAL'} PASS
                  </div>

                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-purple-600 transition-all">
                    <Ticket className="text-white" size={20} />
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-4 leading-tight text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                  {ticket.expoId?.title || 'Untitled Exhibition'}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-purple-500" />

                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                      {ticket.expoId?.startDate
                        ? new Date(
                            ticket.expoId.startDate
                          ).toLocaleDateString()
                        : 'Date TBA'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-purple-500" />

                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider line-clamp-1">
                      {ticket.expoId?.location || 'Location TBA'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">
                <span>View Digital Pass</span>

                <CheckCircle2
                  size={18}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-[2.5rem]">
          <Ticket
            size={45}
            className="text-purple-500/30 mx-auto mb-5"
          />

          <p className="text-gray-500 font-bold uppercase tracking-widest">
            No passes found in your vault.
          </p>
        </div>
      )}

      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto"
          >
            <div className="w-full max-w-sm relative my-8">
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors font-bold text-xs uppercase tracking-widest group"
              >
                <ArrowIcon
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back to Passes
              </button>

              <button
                onClick={() => setSelectedTicket(null)}
                className="absolute -top-1 right-0 text-white/50 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>

              <div
                ref={ticketRef}
                className="bg-[#0f111a] rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] p-10 text-center"
              >
                <div className="bg-white p-5 rounded-[2.5rem] inline-block mb-8 shadow-2xl">
                  <QRCodeSVG
                    value={
                      selectedTicket.qrCode || 'VisionEye'
                    }
                    size={160}
                    level="H"
                    includeMargin={false}
                  />

                  <p className="text-black font-mono font-black mt-4 text-[9px] border-t border-black/10 pt-2 tracking-[0.3em] uppercase">
                    {selectedTicket.qrCode || 'VisionEye'}
                  </p>
                </div>

                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                  {selectedTicket.expoId?.title ||
                    'Untitled Exhibition'}
                </h2>

                <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                  {selectedTicket.ticketType || 'GENERAL'} ACCESS
                </p>

                <div className="space-y-4 text-left bg-white/5 p-6 rounded-[2rem] border border-white/5">
                  <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
                    <span className="text-purple-500 text-[9px] font-black uppercase tracking-widest">
                      Location
                    </span>

                    <span className="text-sm font-bold text-white">
                      {selectedTicket.expoId?.location ||
                        'Location TBA'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-purple-500 text-[9px] font-black uppercase tracking-widest">
                      Event Date
                    </span>

                    <span className="text-sm font-bold text-white">
                      {selectedTicket.expoId?.startDate
                        ? new Date(
                            selectedTicket.expoId.startDate
                          ).toLocaleString([], {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : 'Date TBA'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={downloadPDF}
                disabled={isDownloading}
                className="w-full mt-6 py-5 rounded-[2rem] font-black text-[10px] bg-purple-600 text-white hover:bg-purple-500 transition-all flex justify-center items-center gap-3 tracking-[0.3em] shadow-xl shadow-purple-900/40 disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2
                    className="animate-spin"
                    size={18}
                  />
                ) : (
                  <>
                    <Download size={18} />
                    DOWNLOAD OFFLINE PASS
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default MyTickets;