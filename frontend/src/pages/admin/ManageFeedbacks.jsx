import React, { useEffect, useState } from 'react';
import axios from '../../lib/api';
import { toast } from 'react-toastify';
import {
  MessageSquare,
  Trash2,
  User,
  Star,
  Calendar,
  RefreshCcw,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Clock,
} from 'lucide-react';

const ManageFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        '/api/feedback/all'
      );

      setFeedbacks(res.data.data || []);
    } catch (err) {
      console.error('Feedback fetch error:', err);
      toast.error('Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `/api/feedback/update-status/${id}`,
        { status: newStatus }
      );

      if (res.data.success) {
        setFeedbacks((prev) =>
          prev.map((fb) =>
            fb._id === id
              ? { ...fb, status: newStatus }
              : fb
          )
        );

        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Status update error:', err);

      toast.error(
        err.response?.data?.message || 'Update Failed'
      );
    }
  };

  const handleDelete = (id) => {
    const Msg = ({ closeToast }) => (
      <div className="flex flex-col gap-3 p-2 text-white">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertTriangle size={20} />
          <span className="font-bold uppercase tracking-wider">
            Confirm Action
          </span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Are you sure you want to delete this feedback permanently?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={closeToast}
            className="
              px-4 py-2
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              bg-white/10
              hover:bg-white/20
              text-white
              rounded-full
              transition-all
              border border-white/10
            "
          >
            Cancel
          </button>

          <button
            onClick={() => {
              closeToast();
              executeDelete(id);
            }}
            className="
              px-4 py-2
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              bg-gradient-to-r
              from-red-600
              to-rose-700
              hover:from-red-500
              hover:to-rose-600
              text-white
              rounded-full
              transition-all
              shadow-[0_0_15px_rgba(225,29,72,0.4)]
            "
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
        backdropFilter: 'blur(16px)',
        color: '#fff',
      },
    });
  };

  const executeDelete = async (id) => {
    const loadingToast = toast.loading('Deleting feedback...', {
      style: {
        backgroundColor: '#0f0518',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
      },
    });

    try {
      await axios.delete(
        `/api/feedback/${id}`
      );

      setFeedbacks((prev) =>
        prev.filter((fb) => fb._id !== id)
      );

      toast.update(loadingToast, {
        render: 'Feedback deleted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2500,
      });
    } catch (err) {
      console.error('Delete error:', err);

      toast.update(loadingToast, {
        render: 'Delete failed.',
        type: 'error',
        isLoading: false,
        autoClose: 2500,
      });
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-fadeInUp">

      {/* ================= HEADER ================= */}
      <div
        className="
          flex flex-col sm:flex-row
          justify-between
          items-start sm:items-center
          gap-5
          p-8
          rounded-3xl
          border border-white/10
          backdrop-blur-xl
          bg-white/5
          text-white
        "
      >
        <div>
          <h2
            className="
              text-3xl
              font-black
              font-heading
              tracking-tight
              text-white
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                w-12 h-12
                bg-gradient-to-br
                from-[#d100a0]
                to-purple-800
                rounded-2xl
                flex items-center justify-center
                shadow-[0_0_20px_rgba(209,0,160,0.4)]
              "
            >
              <MessageSquare size={22} />
            </div>

            Manage Feedbacks
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Monitor and moderate all user submitted feedback and ratings.
          </p>
        </div>

        <button
          onClick={fetchFeedbacks}
          disabled={loading}
          className="
            group
            relative
            inline-flex
            items-center
            gap-2.5
            px-6
            py-3.5
            font-extrabold
            text-white
            rounded-full
            overflow-hidden
            backdrop-blur-xl
            border border-white/20
            bg-gradient-to-r
            from-[#d100a0]
            via-[#a21caf]
            to-[#6b21a8]
            shadow-[0_0_25px_rgba(209,0,160,0.5)]
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-[0_0_40px_rgba(209,0,160,0.8)]
            active:scale-95
            text-xs
            uppercase
            tracking-wider
            font-heading
            disabled:opacity-60
          "
        >
          <span
            className="
              absolute inset-0
              bg-gradient-to-r
              from-transparent
              via-white/30
              to-transparent
              -translate-x-full
              group-hover:translate-x-full
              transition-transform
              duration-1000
            "
          />

          <RefreshCcw
            size={17}
            className={loading ? 'animate-spin' : ''}
          />

          <span className="relative z-10">
            Refresh Data
          </span>
        </button>
      </div>

      {/* ================= LOADING ================= */}
      {loading ? (
        <div
          className="
            p-16
            rounded-3xl
            border border-white/10
            backdrop-blur-xl
            bg-white/5
            flex flex-col
            items-center
            justify-center
            text-[#d100a0]
          "
        >
          <Loader2
            className="animate-spin mb-4"
            size={44}
          />

          <p
            className="
              text-gray-300
              font-medium
              animate-pulse
              text-sm
            "
          >
            Synchronizing Feedback Data...
          </p>
        </div>
      ) : (
        /* ================= FEEDBACK GRID ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {feedbacks.length > 0 ? (
            feedbacks.map((fb) => {
              const isResolved = fb.status === 'Resolved';

              return (
                <div
                  key={fb._id}
                  className="
                    relative
                    overflow-hidden
                    p-6
                    rounded-3xl
                    border border-white/10
                    backdrop-blur-xl
                    bg-white/5
                    text-white
                    group
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:border-[#d100a0]/50
                    hover:shadow-[0_0_30px_rgba(209,0,160,0.25)]
                  "
                >
                  {/* Glow */}
                  <div
                    className="
                      absolute
                      -bottom-12
                      -right-12
                      w-32
                      h-32
                      bg-[#d100a0]/10
                      blur-3xl
                      rounded-full
                      group-hover:bg-[#d100a0]/20
                      transition-all
                      duration-500
                    "
                  />

                  {/* TOP */}
                  <div className="relative z-10 flex justify-between items-start mb-5">

                    <div className="flex items-center gap-3 min-w-0">

                      <div
                        className="
                          w-12 h-12
                          bg-gradient-to-br
                          from-[#d100a0]
                          to-purple-800
                          rounded-2xl
                          flex items-center justify-center
                          shadow-[0_0_18px_rgba(209,0,160,0.35)]
                          border border-white/20
                          flex-shrink-0
                        "
                      >
                        <User size={20} />
                      </div>

                      <div className="min-w-0">
                        <h4
                          className="
                            text-white
                            font-bold
                            text-base
                            truncate
                            capitalize
                            tracking-tight
                            flex
                            items-center
                            gap-2
                          "
                        >
                          {fb.userId?.name || 'Anonymous User'}

                          {isResolved && (
                            <CheckCircle2
                              size={15}
                              className="text-emerald-400 flex-shrink-0"
                            />
                          )}
                        </h4>

                        {/* STARS */}
                        <div className="flex gap-1 mt-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              fill={
                                i < (fb.rating || 0)
                                  ? '#d100a0'
                                  : 'none'
                              }
                              className={
                                i < (fb.rating || 0)
                                  ? 'text-[#d100a0]'
                                  : 'text-gray-600'
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(fb._id)}
                      className="
                        p-3
                        bg-white/5
                        text-gray-400
                        rounded-2xl
                        hover:bg-rose-600
                        hover:text-white
                        border border-white/10
                        hover:border-rose-500
                        transition-all
                        duration-300
                        hover:shadow-[0_0_15px_rgba(225,29,72,0.5)]
                        active:scale-95
                        flex-shrink-0
                      "
                      title="Delete Feedback"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* MESSAGE BOX */}
                  <div
                    className="
                      relative
                      bg-black/20
                      p-5
                      rounded-2xl
                      mb-5
                      border border-white/5
                      min-h-[145px]
                    "
                  >
                    <div className="flex justify-between items-center mb-3">

                      <p
                        className="
                          text-[10px]
                          font-black
                          uppercase
                          tracking-widest
                          text-[#d100a0]
                        "
                      >
                        Subject
                      </p>

                      <span
                        className="
                          text-[9px]
                          text-gray-400
                          font-bold
                          uppercase
                          tracking-wider
                          px-2.5
                          py-1
                          rounded-full
                          bg-white/5
                          border border-white/10
                        "
                      >
                        {fb.type || 'Feedback'}
                      </span>
                    </div>

                    <p
                      className="
                        text-white
                        text-sm
                        font-semibold
                        mb-3
                        line-clamp-1
                      "
                    >
                      {fb.subject || 'No Subject'}
                    </p>

                    <p
                      className="
                        text-gray-400
                        text-sm
                        leading-relaxed
                        italic
                        line-clamp-3
                      "
                    >
                      "{fb.message}"
                    </p>

                    {!isResolved && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            fb._id,
                            'Resolved'
                          )
                        }
                        className="
                          mt-4
                          text-[10px]
                          font-bold
                          text-emerald-400
                          hover:text-emerald-300
                          transition-colors
                          uppercase
                          tracking-widest
                          flex
                          items-center
                          gap-1.5
                        "
                      >
                        <CheckCircle2 size={13} />
                        Mark Resolved
                      </button>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div
                    className="
                      relative z-10
                      flex
                      justify-between
                      items-center
                      gap-3
                      pt-4
                      border-t
                      border-white/5
                    "
                  >
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-gray-400
                      "
                    >
                      <Calendar
                        size={13}
                        className="text-[#d100a0]"
                      />

                      {formatDate(fb.createdAt)}
                    </span>

                    <span
                      className={`
                        flex
                        items-center
                        gap-1.5
                        px-3
                        py-1.5
                        rounded-full
                        border
                        text-[9px]
                        font-black
                        uppercase
                        tracking-wider
                        ${
                          isResolved
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                            : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                        }
                      `}
                    >
                      {isResolved ? (
                        <CheckCircle2 size={11} />
                      ) : (
                        <Clock size={11} />
                      )}

                      {fb.status || 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            /* EMPTY STATE */
            <div
              className="
                col-span-full
                p-20
                rounded-3xl
                border border-white/10
                border-dashed
                backdrop-blur-xl
                bg-white/5
                flex
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  w-16 h-16
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#d100a0]/20
                  to-purple-800/20
                  border border-[#d100a0]/20
                  flex items-center justify-center
                  mb-4
                "
              >
                <MessageSquare
                  size={30}
                  className="text-[#d100a0]"
                />
              </div>

              <p className="text-white font-bold text-lg">
                No Feedbacks Found
              </p>

              <p className="text-gray-500 text-xs mt-2">
                No user feedback or ratings are available yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageFeedbacks;