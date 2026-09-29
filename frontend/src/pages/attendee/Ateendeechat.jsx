import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../lib/api';
import {
  Send,
  User,
  ArrowLeft,
  MessageCircle,
  Clock
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { toast } from 'react-toastify';

const AttendeeChat = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const otherId = queryParams.get('withId');
  const otherName = queryParams.get('withName');
  const myId = localStorage.getItem('userId');

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const scrollRef = useRef();

  // Fetch Messages
  const fetchMessages = async () => {
    if (!myId || !otherId) return;

    try {
      const res = await axios.get(`/api/messages/history/${myId}/${otherId}`);

      setMessages(res.data);
    } catch (err) {
      console.error('History load error:', err);
    }
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(
      fetchMessages,
      4000
    );

    return () => clearInterval(interval);
  }, [otherId]);

  // Auto Scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);

  // Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const payload = {
        senderId: myId,
        receiverId: otherId,
        senderModel: 'User',
        receiverModel: 'Exhibitor',
        text: newMessage
      };

      const res = await axios.post('/api/messages/send', payload);

      setMessages([
        ...messages,
        res.data
      ]);

      setNewMessage('');

    } catch (err) {
      console.error(
        'Message error:',
        err.response?.data
      );

      toast.error(
        'Failed to send message'
      );
    }
  };

  return (
    <DashboardLayout title="Chat Space">

      <div className="space-y-5 animate-fadeInUp">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#d100a0] transition-all text-sm font-medium"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />

          <span>
            Back
          </span>
        </button>

        {/* Chat Container */}
        <div className="max-w-5xl mx-auto h-[75vh] min-h-[550px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col">

          {/* Header */}
          <div className="relative p-5 md:p-6 border-b border-white/10 bg-white/5">

            <div className="absolute -top-16 right-10 w-40 h-40 bg-[#d100a0]/10 blur-[70px] rounded-full" />

            <div className="relative z-10 flex items-center gap-4">

              <div className="relative">

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(209,0,160,0.35)]">
                  <User
                    size={23}
                    className="text-white"
                  />
                </div>

                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#17121b] rounded-full" />

              </div>

              <div>

                <h3 className="text-white font-black tracking-tight text-lg">
                  {otherName || 'Exhibitor'}
                </h3>

                <div className="flex items-center gap-1.5 mt-0.5">

                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />

                  <p className="text-[9px] text-green-400 uppercase font-black tracking-widest">
                    Live Session
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-3 custom-scrollbar">

            {messages.length === 0 ? (

              <div className="h-full flex flex-col items-center justify-center text-center">

                <div className="w-16 h-16 rounded-2xl bg-[#d100a0]/10 border border-[#d100a0]/20 flex items-center justify-center mb-4">
                  <MessageCircle
                    size={28}
                    className="text-[#d100a0]"
                  />
                </div>

                <h3 className="text-white font-bold">
                  Start a Conversation
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  Send a message to {otherName || 'the exhibitor'}.
                </p>

              </div>

            ) : (

              messages.map((msg, index) => {

                const isMe =
                  msg.senderId === myId ||
                  msg.senderId?._id === myId;

                return (
                  <div
                    key={index}
                    className={`flex ${
                      isMe
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >

                    <div
                      className={`max-w-[75%] md:max-w-[65%] px-4 py-3 shadow-xl border ${
                        isMe
                          ? 'bg-gradient-to-br from-[#d100a0] to-[#7e22ce] text-white border-[#d100a0]/30 rounded-2xl rounded-tr-sm'
                          : 'bg-white/5 text-gray-200 border-white/10 rounded-2xl rounded-tl-sm'
                      }`}
                    >

                      <p className="text-sm leading-relaxed break-words">
                        {msg.text}
                      </p>

                      <span
                        className={`text-[9px] block mt-2 text-right font-medium ${
                          isMe
                            ? 'text-white/60'
                            : 'text-gray-500'
                        }`}
                      >
                        {new Date(
                          msg.createdAt
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>

                    </div>

                  </div>
                );

              })

            )}

            <div ref={scrollRef} />

          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 md:p-5 border-t border-white/10 bg-white/5 flex gap-3 items-center"
          >

            <div className="flex-1 relative">

              <input
                type="text"
                value={newMessage}
                onChange={(e) =>
                  setNewMessage(e.target.value)
                }
                placeholder="Type your message here..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 pr-5 text-white text-sm focus:outline-none focus:border-[#d100a0]/50 focus:ring-1 focus:ring-[#d100a0]/20 transition-all placeholder:text-gray-600"
              />

            </div>

            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="w-12 h-12 shrink-0 bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(209,0,160,0.3)] hover:shadow-[0_0_28px_rgba(209,0,160,0.5)] hover:scale-105 active:scale-90 disabled:opacity-40 disabled:hover:scale-100 transition-all duration-300 border border-white/20"
            >
              <Send size={19} />
            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default AttendeeChat;