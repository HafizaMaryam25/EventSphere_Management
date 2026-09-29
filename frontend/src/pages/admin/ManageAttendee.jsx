
import React, { useState, useEffect } from 'react';
import axios from '../../lib/api';
import {
  User,
  QrCode,
  Calendar,
  Clock,
  Loader2,
  Users,
  Ticket,
  CheckCircle,
} from 'lucide-react';

const ManageAttendees = () => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          '/admin/all-attendees'
        );

        setAttendees(res.data || []);
      } catch (err) {
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';

    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8 animate-fadeInUp text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5">
        <div>
          <h2 className="text-3xl font-black font-heading tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.4)]">
              <Users size={23} />
            </div>
            Manage Attendees
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Review every registration record and attendee booking.
          </p>
        </div>

        <div className="px-5 py-3 rounded-full bg-[#d100a0]/10 border border-[#d100a0]/30">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e879d4]">
            {attendees.length} Registrations
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="p-16 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center text-[#d100a0]">
          <Loader2 className="animate-spin mb-4" size={44} />
          <p className="text-gray-300 font-medium animate-pulse text-sm">
            Fetching registration records...
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 hover:border-[#d100a0]/30 transition-all duration-500 backdrop-blur-xl bg-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="bg-white/10 border-b border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider font-heading">
                  <th className="px-8 py-6">Attendee & ID</th>
                  <th className="px-8 py-6">Booking Ref / QR</th>
                  <th className="px-8 py-6">Ticket & Status</th>
                  <th className="px-8 py-6 text-right">Date & Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {attendees.length > 0 ? (
                  attendees.map((row) => (
                    <tr
                      key={row._id}
                      className="hover:bg-white/10 transition-colors duration-300 group"
                    >
                      {/* Attendee */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center text-white font-bold shrink-0 shadow-[0_0_15px_rgba(209,0,160,0.3)] group-hover:scale-105 transition-transform">
                            {row.attendeeId?.name?.charAt(0) || 'U'}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-white font-bold text-base group-hover:text-[#e879d4] transition-colors truncate">
                              {row.attendeeId?.name || 'Guest'}
                            </span>

                            <span className="text-gray-500 text-xs truncate mt-0.5">
                              {row.attendeeId?.email || 'No email'}
                            </span>

                            <span className="text-[10px] text-gray-600 font-mono mt-1">
                              UID: {row.attendeeId?._id || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* QR */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-[#facc15] text-sm font-mono bg-yellow-500/5 w-fit px-3 py-2 rounded-xl border border-yellow-500/10">
                            <QrCode size={14} />
                            {row.qrCode || 'N/A'}
                          </div>

                          <span className="text-[10px] text-gray-500 font-mono pl-1">
                            BID: {row._id}
                          </span>
                        </div>
                      </td>

                      {/* Ticket */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                          <span className="w-fit flex items-center gap-2 bg-[#d100a0]/10 text-[#e879d4] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border border-[#d100a0]/20">
                            <Ticket size={12} />
                            {row.ticketType || 'Standard'}
                          </span>

                          <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle size={13} />
                            Confirmed
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end gap-2 text-gray-300">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Calendar
                              size={14}
                              className="text-[#d100a0]"
                            />
                            {formatDate(row.bookedAt)}
                          </div>

                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Clock
                              size={14}
                              className="text-purple-400"
                            />
                            {formatTime(row.bookedAt)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-20">
                      <div className="flex flex-col items-center gap-4 text-gray-500">
                        <div className="w-16 h-16 rounded-2xl bg-[#d100a0]/10 flex items-center justify-center">
                          <User
                            size={34}
                            className="text-[#d100a0]/60"
                            strokeWidth={1.5}
                          />
                        </div>

                        <div>
                          <p className="text-white font-semibold">
                            No Registration Records
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            No attendees have registered yet.
                          </p>
                        </div>
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

export default ManageAttendees;

