import React, { useEffect, useState } from 'react';
import axios from '../../lib/api';
import {
  Loader2,
  BookmarkX,
  Clock,
  User,
  BookmarkPlus,
  Ticket,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_API_URL || 'https://eventsphere-backend-mocha.vercel.app';

const MyBookmarks = () => {
  const navigate = useNavigate();

  const [bookmarkedSessions, setBookmarkedSessions] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const userFromStorage =
    localStorage.getItem('user');

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
    if (currentUserId) {
      fetchMyBookmarks();
    } else {
      setLoading(false);
    }
  }, [currentUserId]);

  const fetchMyBookmarks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/api/bookmarks/details/${currentUserId}`
      );

      setBookmarkedSessions(res.data || []);
    } catch (err) {
      console.error('Bookmarks error:', err);

      if (err.response?.status !== 404) {
        toast.error('Failed to load bookmarks');
      }

      setBookmarkedSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async sessionId => {
    try {
      const res = await axios.post(
        `${API}/api/bookmarks/toggle`,
        {
          attendeeId: currentUserId,
          sessionId
        }
      );

      if (!res.data.isBookmarked) {
        setBookmarkedSessions(prev =>
          prev.filter(
            session =>
              String(session._id) !==
              String(sessionId)
          )
        );

        toast.info('Removed from schedule');
      }
    } catch (err) {
      console.error('Remove bookmark error:', err);
      toast.error('Failed to remove bookmark');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">

          <Loader2
            className="animate-spin text-purple-400 mb-4"
            size={40}
          />

          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            Updating Schedule...
          </p>

        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="">

      <div className="max-w-7xl mx-auto pb-10 md:pb-20 px-4 sm:px-6 lg:px-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-purple-400 mb-8 transition-all"
        >
          <ArrowLeft size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Back
          </span>
        </button>

        <div className="mb-8 md:mb-14">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            My Bookmarks
          </h1>

          <div className="h-[3px] w-12 bg-purple-500 rounded-full"></div>

        </div>

        {bookmarkedSessions.length === 0 ? (

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 sm:p-16 md:p-24 text-center">

            <BookmarkPlus
              size={48}
              className="text-purple-400/30 mx-auto mb-6"
            />

            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
              No Bookmarked Sessions
            </h3>

            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Your bookmarked sessions will appear here.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

            {bookmarkedSessions.map(session => (

              <div
                key={session._id}
                className="bg-[#242630] border border-white/10 p-6 md:p-8 rounded-[1.8rem] md:rounded-[2.2rem] flex flex-col justify-between hover:bg-[#2a2d3a] hover:border-purple-500/30 transition-all duration-500 relative group shadow-2xl overflow-hidden min-h-[340px]"
              >

                <div>

                  <div className="flex justify-between items-start mb-6">

                    <span className="text-[8px] font-bold bg-purple-900/30 text-purple-300 px-3 py-1.5 rounded-full uppercase tracking-widest border border-purple-500/10">
                      Saved Session
                    </span>

                    <div className="bg-purple-600 p-2.5 rounded-xl">
                      <Ticket
                        size={18}
                        className="text-white"
                      />
                    </div>

                  </div>

                  <h4 className="text-lg md:text-xl font-bold text-white mb-5 leading-tight group-hover:text-purple-300 transition-colors line-clamp-2">
                    {session.title ||
                      'Untitled Session'}
                  </h4>

                  <div className="space-y-3.5 mb-6">

                    {session.startTime && (
                      <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">

                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                          <Clock
                            size={14}
                            className="text-purple-500"
                          />
                        </div>

                        {new Date(
                          session.startTime
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}

                      </div>
                    )}

                    <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">

                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                        <User
                          size={14}
                          className="text-purple-500"
                        />
                      </div>

                      <span className="truncate">
                        {session.speaker ||
                          'Keynote Session'}
                      </span>

                    </div>

                    {session.date && (
                      <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">

                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                          <Calendar
                            size={14}
                            className="text-purple-500"
                          />
                        </div>

                        {new Date(
                          session.date
                        ).toLocaleDateString()}

                      </div>
                    )}

                  </div>

                </div>

                <div className="pt-5 border-t border-white/5 flex justify-between items-center mt-auto">

                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em]">
                    Digital Pass
                  </span>

                  <button
                    onClick={() =>
                      removeBookmark(session._id)
                    }
                    className="p-2.5 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/10 active:scale-90"
                    title="Remove Bookmark"
                  >
                    <BookmarkX size={16} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </DashboardLayout>
  );
};

export default MyBookmarks;