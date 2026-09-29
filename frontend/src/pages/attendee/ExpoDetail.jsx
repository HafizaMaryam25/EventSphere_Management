import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../lib/api';
import {
  Calendar,
  MapPin,
  Ticket,
  ArrowLeft,
  Building2,
  MessageSquare,
  Loader2,
  CheckCircle,
  ShieldCheck,
  Zap,
  Bookmark,
  BookmarkCheck,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { toast } from 'react-toastify';

const ExpoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expo, setExpo] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [booths, setBooths] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');

  const [isRegistered, setIsRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const [sessionBookmarks, setSessionBookmarks] = useState([]);

  const userFromStorage = localStorage.getItem('user');

  let currentUser = null;

  try {
    currentUser = userFromStorage
      ? JSON.parse(userFromStorage)
      : null;
  } catch {
    currentUser = null;
  }

  const currentUserId =
    currentUser?._id ||
    currentUser?.id ||
    localStorage.getItem('userId');

  useEffect(() => {
    fetchFullDetails();

    if (currentUserId) {
      checkRegistrationStatus();
      fetchUserBookmarks();
    }
  }, [id, currentUserId]);

  const fetchFullDetails = async () => {
    try {
      setLoading(true);

      const [expoRes, sessionsRes, boothsRes] = await Promise.all([
        axios.get(`/attendee/expo/${id}`),
        axios.get(`/attendee/sessions/${id}`),
        axios.get(`/api/booths/expo/${id}`)
      ]);

      setExpo(expoRes.data);
      setSessions(sessionsRes.data || []);
      setBooths(boothsRes.data || []);
    } catch (err) {
      console.error('Expo details error:', err);
      toast.error('Failed to load expo details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookmarks = async () => {
    try {
      const res = await axios.get(
        `/api/bookmarks/my-ids/${currentUserId}`
      );

      setSessionBookmarks(res.data || []);
    } catch (err) {
      console.error('Bookmark fetch error:', err);
    }
  };

  const toggleBookmark = async (e, sessionId) => {
    e.stopPropagation();

    if (!currentUserId) {
      toast.warn('Please login first.');
      return;
    }

    try {
      const res = await axios.post(
        '/api/bookmarks/toggle',
        {
          attendeeId: currentUserId,
          sessionId
        }
      );

      if (res.data.isBookmarked) {
        setSessionBookmarks(prev =>
          prev.includes(sessionId)
            ? prev
            : [...prev, sessionId]
        );

        toast.success('Added to your schedule');
      } else {
        setSessionBookmarks(prev =>
          prev.filter(id => id !== sessionId)
        );

        toast.info('Removed from your schedule');
      }
    } catch (err) {
      console.error('Bookmark error:', err);
      toast.error('Failed to update bookmark.');
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const res = await axios.get(
        `/attendee/dashboard/${currentUserId}`
      );

      const registrations = res.data?.upcomingExpos || [];

      const alreadyRegistered = registrations.some(
        booking =>
          String(booking.expoId?._id) === String(id)
      );

      setIsRegistered(alreadyRegistered);
    } catch (err) {
      console.error('Registration status error:', err);
    }
  };

  const handleRegistration = async () => {
    if (!currentUserId) {
      toast.warn('Please login first.');
      return;
    }

    if (isRegistered) return;

    try {
      setRegLoading(true);

      const res = await axios.post(
        '/attendee/register',
        {
          attendeeId: currentUserId,
          expoId: id
        }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success('Registered Successfully!');
        setIsRegistered(true);
      }
    } catch (err) {
      console.error('Registration error:', err);

      toast.error(
        err.response?.data?.message ||
        'Registration failed.'
      );
    } finally {
      setRegLoading(false);
    }
  };

  const handleStartChat = booth => {
    const exhibitorId =
      booth.bookedBy?._id ||
      booth.bookedBy;

    if (!exhibitorId) {
      toast.error('Exhibitor contact unavailable.');
      return;
    }

    const sellerName =
      booth.companyName ||
      booth.exhibitorName ||
      'Exhibitor';

    navigate(
      `/attendee/messages?withId=${exhibitorId}&withName=${encodeURIComponent(
        sellerName
      )}&withRole=Exhibitor`
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2
            className="animate-spin text-purple-500 mb-4"
            size={40}
          />

          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            Processing Request...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!expo) {
    return (
      <DashboardLayout title="Expo Details">
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-gray-400 mb-5">
            Expo not found.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-400"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const bookedBooths = booths.filter(
    booth => booth.status === 'Booked'
  );

  return (
    <DashboardLayout title="">
      <div className="min-h-screen text-white p-2">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-purple-400 mb-8 transition-all"
        >
          <ArrowLeft size={18} />

          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Exit Portal
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">

              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                {expo.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-10">

                <div className="bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full text-[9px] font-black border border-purple-500/20 uppercase tracking-widest">
                  {expo.theme || 'Exhibition'}
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <MapPin
                    size={14}
                    className="text-purple-500"
                  />

                  <span>
                    {expo.location || 'Location TBA'}
                  </span>
                </div>

                {expo.startDate && (
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                    <Calendar
                      size={14}
                      className="text-purple-500"
                    />

                    <span>
                      {new Date(
                        expo.startDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* TABS */}
              <div className="flex gap-8 border-b border-white/5 mb-10 overflow-x-auto scrollbar-hide">

                {['about', 'schedule', 'exhibitors'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-purple-400'
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {tab}

                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[250px]">

                <AnimatePresence mode="wait">

                  {/* ABOUT */}
                  {activeTab === 'about' && (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="text-gray-400 leading-relaxed text-lg font-light">
                        {expo.description ||
                          'No description available for this exhibition.'}
                      </p>
                    </motion.div>
                  )}

                  {/* SCHEDULE */}
                  {activeTab === 'schedule' && (
                    <motion.div
                      key="schedule"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {sessions.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                          <Clock
                            className="mx-auto text-gray-600 mb-3"
                            size={30}
                          />

                          <p className="text-gray-500 text-sm">
                            No sessions available.
                          </p>
                        </div>
                      ) : (
                        sessions.map(session => {
                          const bookmarked =
                            sessionBookmarks.includes(
                              session._id
                            );

                          return (
                            <div
                              key={session._id}
                              className="bg-white/[0.02] border border-white/5 p-5 rounded-[1.5rem] flex justify-between items-center hover:bg-white/[0.05] transition-all"
                            >
                              <div>
                                <h4 className="text-lg font-bold text-white">
                                  {session.title}
                                </h4>

                                <p className="text-[10px] text-purple-500 font-black uppercase tracking-widest mt-1">
                                  {session.speaker ||
                                    'Guest TBA'}
                                </p>

                                {session.startTime && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    {new Date(
                                      session.startTime
                                    ).toLocaleString()}
                                  </p>
                                )}
                              </div>

                              <button
                                onClick={e =>
                                  toggleBookmark(
                                    e,
                                    session._id
                                  )
                                }
                                className={`p-3 rounded-xl transition-all ${
                                  bookmarked
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'bg-white/5 text-gray-600 hover:text-purple-400'
                                }`}
                              >
                                {bookmarked ? (
                                  <BookmarkCheck
                                    size={22}
                                    fill="currentColor"
                                  />
                                ) : (
                                  <Bookmark size={22} />
                                )}
                              </button>
                            </div>
                          );
                        })
                      )}
                    </motion.div>
                  )}

                  {/* EXHIBITORS */}
                  {activeTab === 'exhibitors' && (
                    <motion.div
                      key="exhibitors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {bookedBooths.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                          <Building2
                            className="mx-auto text-gray-600 mb-3"
                            size={32}
                          />

                          <p className="text-gray-500 text-sm">
                            No exhibitors available yet.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          {bookedBooths.map(booth => (
                            <div
                              key={booth._id}
                              className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] group hover:border-purple-500/30 transition-all"
                            >

                              <div className="flex items-center gap-4 mb-6">

                                <div className="bg-purple-600/20 p-3 rounded-2xl text-purple-400">
                                  {booth.logo ? (
                                    <img
                                      src={`${API}/${booth.logo}`}
                                      alt="Company"
                                      className="w-6 h-6 rounded object-cover"
                                    />
                                  ) : (
                                    <Building2 size={24} />
                                  )}
                                </div>

                                <div>
                                  <h4 className="text-lg font-black text-white">
                                    {booth.companyName ||
                                      'Exhibitor'}
                                  </h4>

                                  <p className="text-[9px] text-purple-400 uppercase tracking-widest">
                                    {booth.industry ||
                                      booth.category ||
                                      'Exhibitor'}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() =>
                                  handleStartChat(booth)
                                }
                                className="w-full py-4 bg-white/5 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-purple-600 hover:border-purple-600 transition-all flex items-center justify-center gap-2"
                              >
                                <MessageSquare size={16} />
                                Open Channel
                              </button>
                            </div>
                          ))}

                        </div>
                      )}
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-10 sticky top-8 shadow-2xl">

              <div className="flex items-center justify-between mb-8">

                <div className="px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400 text-[9px] font-black uppercase tracking-widest">
                  Secure Portal
                </div>

                <div className="p-3 bg-white/5 rounded-2xl">
                  <Ticket
                    className="text-white"
                    size={20}
                  />
                </div>
              </div>

              <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">
                Event Access
              </h3>

              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-8">
                Register for this exhibition and receive your
                digital entry pass.
              </p>

              <button
                onClick={handleRegistration}
                disabled={regLoading || isRegistered}
                className={`w-full py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 ${
                  isRegistered
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                    : 'bg-white text-black hover:bg-gray-200 active:scale-95'
                }`}
              >
                {regLoading ? (
                  <Loader2
                    className="animate-spin"
                    size={18}
                  />
                ) : isRegistered ? (
                  <>
                    <ShieldCheck size={18} />
                    REGISTERED
                  </>
                ) : (
                  'GET TICKET'
                )}
              </button>

              <div className="mt-10 pt-8 border-t border-white/10">

                <div className="space-y-4">

                  <div className="flex items-center gap-3">
                    <Zap
                      size={16}
                      className="text-purple-500"
                    />

                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      Immediate Activation
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle
                      size={16}
                      className="text-purple-500"
                    />

                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      QR Code Secured
                    </p>
                  </div>

                </div>
              </div>

              <div className="mt-8 pt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">
                <span>VisionEye Verified</span>
                <ShieldCheck
                  size={18}
                  className="opacity-50"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExpoDetails;