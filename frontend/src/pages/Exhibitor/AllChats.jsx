import React, { useState, useEffect, useRef } from 'react';
import axios from '../../lib/api';
import {
  Search,
  MessageSquare,
  Loader2,
  Send,
  ArrowLeft,
  ShieldAlert,
  Headset,
  Sparkles,
  UserRound,
  Clock,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const AllChats = () => {
  const { user: currentUser } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const scrollRef = useRef();

  const myId = currentUser?._id || currentUser?.id;
  const myRole = currentUser?.role;

  /* =========================================================
     FETCH CONVERSATIONS
  ========================================================= */
  useEffect(() => {
    if (myId) {
      fetchAllConversations();
    }
  }, [myId]);

  /* =========================================================
     AUTO SCROLL
  ========================================================= */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  /* =========================================================
     FETCH ALL CONVERSATIONS
  ========================================================= */
  const fetchAllConversations = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`/api/messages/conversations/${myId}`);

      setConversations(res.data);
    } catch (err) {
      console.error('Conversation Error:', err);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     START ADMIN / ORGANIZER CHAT
  ========================================================= */
  const startAdminChat = async () => {
    try {
      const res = await axios.get('/api/messages/admin-details');

      const adminData = res.data;

      if (adminData._id === myId) {
        toast.info('You are the Admin.');
        return;
      }

      const adminChat = {
        _id: adminData._id,
        contactDetails: {
          name: adminData.name,
          role: 'Admin',
        },
      };

      openChat(adminChat);
    } catch (err) {
      console.error('Admin Chat Error:', err);
      toast.error('Organizer is offline');
    }
  };

  /* =========================================================
     OPEN CHAT
  ========================================================= */
  const openChat = async (chat) => {
    setSelectedChat(chat);

    try {
      const res = await axios.get(`/api/messages/history/${myId}/${chat._id}`);

      setMessages(res.data);

      await axios.put(`/api/messages/read/${myId}/${chat._id}`);
    } catch (err) {
      console.error('History Error:', err);
      toast.error('Error loading history');
    }
  };

  /* =========================================================
     SEND MESSAGE
  ========================================================= */
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedChat || !myRole) {
      if (!myRole) {
        toast.error('User role not found. Please re-login.');
      }
      return;
    }

    // Sender model
    const sModel =
      myRole === 'Admin' || myRole === 'Attendee'
        ? 'User'
        : 'Exhibitor';

    // Receiver model
    let rModel = 'User';

    if (selectedChat.contactDetails?.role === 'Exhibitor') {
      rModel = 'Exhibitor';
    } else if (
      selectedChat.contactDetails?.role === 'Admin' ||
      selectedChat.contactDetails?.role === 'Attendee'
    ) {
      rModel = 'User';
    }

    const payload = {
      senderId: myId,
      receiverId: selectedChat._id,
      senderModel: sModel,
      receiverModel: rModel,
      text: newMessage,
    };

    try {
      const res = await axios.post('/api/messages/send', payload);

      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');

      fetchAllConversations();
    } catch (err) {
      console.error('Send Error:', err.response?.data);

      toast.error(
        err.response?.data?.message || 'Failed to send message'
      );
    }
  };

  /* =========================================================
     FILTER CHATS
  ========================================================= */
  const filteredChats = conversations.filter((c) =>
    (
      c.contactDetails?.name ||
      c.contactDetails?.companyName ||
      ''
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* =========================================================
     GET CONTACT NAME
  ========================================================= */
  const getContactName = (chat) =>
    chat?.contactDetails?.name ||
    chat?.contactDetails?.companyName ||
    'Unknown User';

  /* =========================================================
     GET INITIAL
  ========================================================= */
  const getInitial = (chat) =>
    getContactName(chat)?.charAt(0)?.toUpperCase() || '?';

  /* =========================================================
     ROLE COLOR
  ========================================================= */
  const getRoleStyle = (role) => {
    switch (role) {
      case 'Admin':
        return {
          avatar:
            'bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8]',
          text: 'text-[#f0abfc]',
          border: 'border-[#d100a0]/40',
          glow: 'shadow-[0_0_20px_rgba(209,0,160,0.35)]',
        };

      case 'Exhibitor':
        return {
          avatar:
            'bg-gradient-to-br from-purple-700 via-violet-700 to-indigo-800',
          text: 'text-purple-300',
          border: 'border-purple-500/30',
          glow: 'shadow-[0_0_20px_rgba(124,58,237,0.25)]',
        };

      default:
        return {
          avatar:
            'bg-gradient-to-br from-fuchsia-700 via-purple-700 to-violet-800',
          text: 'text-fuchsia-300',
          border: 'border-fuchsia-500/30',
          glow: 'shadow-[0_0_20px_rgba(192,38,211,0.25)]',
        };
    }
  };

  return (
    <div className="space-y-8 animate-fadeInUp">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="p-8 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 text-white shadow-2xl">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <h2 className="text-3xl font-black font-heading tracking-tight text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center shadow-[0_0_20px_rgba(209,0,160,0.45)] border border-white/20">
                <MessageSquare size={22} />
              </div>

              Messages
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Manage conversations and communicate with exhibitors,
              attendees, and organizers.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="px-4 py-2.5 rounded-full bg-[#d100a0]/10 border border-[#d100a0]/30 text-xs font-bold text-white uppercase tracking-wider shadow-[0_0_15px_rgba(209,0,160,0.15)]">
              {conversations.length}{' '}
              {conversations.length === 1
                ? 'Conversation'
                : 'Conversations'}
            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CHAT CARD
      ===================================================== */}
      <div className="relative flex h-[calc(100vh-280px)] min-h-[600px] rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 overflow-hidden shadow-2xl">

        {/* Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#d100a0]/5 via-transparent to-purple-900/10 pointer-events-none" />

        {/* =================================================
            SIDEBAR
        ================================================= */}
        <div
          className={`
            w-full md:w-[330px] lg:w-[380px]
            border-r border-white/10
            flex-col
            bg-black/10
            backdrop-blur-xl
            relative z-10
            ${
              selectedChat
                ? 'hidden md:flex'
                : 'flex'
            }
          `}
        >

          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10">

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d100a0] to-purple-800 flex items-center justify-center shadow-[0_0_15px_rgba(209,0,160,0.35)]">
                  <MessageSquare size={19} />
                </div>

                <div>
                  <h3 className="text-white font-bold font-heading">
                    Inbox
                  </h3>

                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                    Recent Conversations
                  </p>
                </div>

              </div>

              <Sparkles
                size={18}
                className="text-[#d100a0]"
              />

            </div>

            {/* Contact Organizer */}
            {myRole !== 'Admin' && (
              <button
                onClick={startAdminChat}
                className="group relative w-full mb-5 inline-flex items-center justify-center gap-2.5 py-3.5 font-extrabold text-white rounded-full overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-r from-[#d100a0] via-[#a21caf] to-[#6b21a8] shadow-[0_0_25px_rgba(209,0,160,0.45)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(209,0,160,0.75)] active:scale-95"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <Headset
                  size={17}
                  className="relative z-10"
                />

                <span className="relative z-10 text-xs uppercase tracking-wider font-heading">
                  Contact Organizer
                </span>
              </button>
            )}

            {/* Search */}
            <div className="relative">

              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />

              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-[#d100a0]/50 focus:bg-white/5 focus:ring-1 focus:ring-[#d100a0]/30 outline-none transition-all"
              />

            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">

                <div className="w-14 h-14 rounded-2xl bg-[#d100a0]/10 border border-[#d100a0]/20 flex items-center justify-center mb-4">
                  <Loader2
                    className="animate-spin text-[#d100a0]"
                    size={26}
                  />
                </div>

                <p className="text-xs font-medium">
                  Loading conversations...
                </p>

              </div>
            ) : filteredChats.length > 0 ? (

              filteredChats.map((chat) => {

                const roleStyle = getRoleStyle(
                  chat.contactDetails?.role
                );

                const isSelected =
                  selectedChat?._id === chat._id;

                return (
                  <div
                    key={chat._id}
                    onClick={() => openChat(chat)}
                    className={`
                      p-4 mb-2 rounded-2xl
                      flex items-center gap-3
                      cursor-pointer
                      transition-all duration-300
                      border
                      group
                      ${
                        isSelected
                          ? `bg-[#d100a0]/10 ${roleStyle.border} ${roleStyle.glow}`
                          : 'bg-white/[0.02] border-transparent hover:bg-white/10 hover:border-white/10'
                      }
                    `}
                  >

                    {/* Avatar */}
                    <div
                      className={`
                        w-12 h-12
                        rounded-2xl
                        flex-shrink-0
                        flex items-center justify-center
                        text-white font-black text-lg
                        border border-white/20
                        shadow-lg
                        ${roleStyle.avatar}
                        ${
                          isSelected
                            ? 'scale-105'
                            : 'group-hover:scale-105'
                        }
                        transition-transform duration-300
                      `}
                    >
                      {getInitial(chat)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">

                      <div className="flex items-center justify-between gap-2">

                        <h4 className="text-sm font-bold text-white truncate group-hover:text-[#f0abfc] transition-colors">
                          {getContactName(chat)}
                        </h4>

                        {chat.contactDetails?.role ===
                          'Admin' && (
                          <ShieldAlert
                            size={14}
                            className="text-[#d100a0] flex-shrink-0"
                          />
                        )}

                      </div>

                      <div className="flex items-center justify-between gap-2 mt-1">

                        <span
                          className={`text-[9px] uppercase tracking-wider font-black ${roleStyle.text}`}
                        >
                          {chat.contactDetails?.role ||
                            'User'}
                        </span>

                        <span className="text-[9px] text-gray-500 flex items-center gap-1">
                          {chat.lastMessageDate && (
                            <Clock size={9} />
                          )}

                          {chat.lastMessageDate
                            ? new Date(
                                chat.lastMessageDate
                              ).toLocaleTimeString(
                                [],
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )
                            : ''}
                        </span>

                      </div>

                      <p className="text-xs text-gray-400 truncate mt-1">
                        {chat.lastMessage ||
                          'No messages yet'}
                      </p>

                    </div>
                  </div>
                );
              })

            ) : (

              <div className="flex flex-col items-center justify-center text-center py-20 px-5">

                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <MessageSquare
                    size={28}
                    className="text-[#d100a0] opacity-60"
                  />
                </div>

                <p className="text-white font-semibold text-sm">
                  No Conversations Found
                </p>

                <p className="text-gray-500 text-xs mt-1">
                  Try searching for another contact.
                </p>

              </div>
            )}
          </div>
        </div>

        {/* =================================================
            CHAT AREA
        ================================================= */}
        <div
          className={`
            flex-1
            flex-col
            relative z-10
            bg-black/10
            backdrop-blur-md
            ${
              !selectedChat
                ? 'hidden md:flex'
                : 'flex'
            }
          `}
        >

          {selectedChat ? (
            <>

              {/* =================================================
                  CHAT HEADER
              ================================================= */}
              <div className="p-5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">

                <div className="flex items-center gap-4">

                  {/* Mobile Back */}
                  <button
                    onClick={() =>
                      setSelectedChat(null)
                    }
                    className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-[#d100a0]/20 hover:border-[#d100a0]/40 transition-all flex items-center justify-center"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  {/* Avatar */}
                  <div className="relative">

                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] flex items-center justify-center text-white font-black text-lg border border-white/20 shadow-[0_0_20px_rgba(209,0,160,0.35)]">
                      {getInitial(selectedChat)}
                    </div>

                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#17101d] shadow-[0_0_10px_rgba(16,185,129,0.7)]" />

                  </div>

                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <h3 className="text-white font-bold font-heading text-base truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                        {getContactName(
                          selectedChat
                        )}
                      </h3>

                      {selectedChat.contactDetails
                        ?.role === 'Admin' && (
                        <ShieldAlert
                          size={15}
                          className="text-[#d100a0] flex-shrink-0"
                        />
                      )}

                    </div>

                    <div className="text-[10px] text-[#d100a0] font-black uppercase tracking-wider mt-1">
                      {selectedChat.contactDetails
                        ?.role || 'User'}
                    </div>

                  </div>

                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-[9px] text-emerald-300 uppercase tracking-wider font-bold">
                    Active
                  </span>
                </div>

              </div>

              {/* =================================================
                  MESSAGES
              ================================================= */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 custom-scrollbar">

                {messages.length > 0 ? (

                  messages.map((msg, i) => {

                    const isMe =
                      (msg.senderId?._id ||
                        msg.senderId) === myId;

                    return (
                      <div
                        key={i}
                        className={`flex ${
                          isMe
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >

                        <div
                          className={`
                            max-w-[80%]
                            sm:max-w-[70%]
                            group
                            ${
                              isMe
                                ? 'items-end'
                                : 'items-start'
                            }
                          `}
                        >

                          <div
                            className={`
                              px-4 py-3.5
                              rounded-2xl
                              text-sm
                              leading-relaxed
                              shadow-lg
                              border
                              ${
                                isMe
                                  ? 'bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] text-white border-[#d100a0]/30 rounded-tr-sm shadow-[0_0_20px_rgba(209,0,160,0.18)]'
                                  : 'bg-white/5 text-gray-200 border-white/10 rounded-tl-sm backdrop-blur-xl'
                              }
                            `}
                          >
                            <p className="break-words">
                              {msg.text}
                            </p>

                            <div
                              className={`
                                text-[8px]
                                mt-2
                                font-medium
                                opacity-60
                                ${
                                  isMe
                                    ? 'text-right'
                                    : 'text-left'
                                }
                              `}
                            >
                              {new Date(
                                msg.createdAt
                              ).toLocaleTimeString(
                                [],
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })

                ) : (

                  <div className="h-full flex flex-col items-center justify-center text-center">

                    <div className="w-16 h-16 rounded-2xl bg-[#d100a0]/10 border border-[#d100a0]/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(209,0,160,0.15)]">
                      <MessageSquare
                        size={30}
                        className="text-[#d100a0]"
                      />
                    </div>

                    <h3 className="text-white font-bold font-heading">
                      Start the Conversation
                    </h3>

                    <p className="text-gray-500 text-xs mt-1">
                      Send your first message below.
                    </p>

                  </div>
                )}

                <div ref={scrollRef} />

              </div>

              {/* =================================================
                  MESSAGE INPUT
              ================================================= */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.03]"
              >

                <div className="flex gap-3 items-center">

                  <div className="flex-1 relative">

                    <input
                      value={newMessage}
                      onChange={(e) =>
                        setNewMessage(e.target.value)
                      }
                      className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-5 pr-5 text-white text-sm placeholder:text-gray-500 outline-none focus:border-[#d100a0]/50 focus:ring-1 focus:ring-[#d100a0]/20 focus:bg-white/5 transition-all"
                      placeholder="Type your message..."
                    />

                  </div>

                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="group relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#d100a0] via-[#a21caf] to-[#6b21a8] text-white flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(209,0,160,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(209,0,160,0.7)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                    <Send
                      size={19}
                      className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </button>

                </div>

                <div className="flex items-center justify-between mt-2 px-1">

                  <p className="text-[9px] text-gray-600 uppercase tracking-wider font-semibold">
                    Secure messaging
                  </p>

                  <p className="text-[9px] text-gray-600">
                    Press Enter to send
                  </p>

                </div>

              </form>

            </>
          ) : (

            /* =================================================
               EMPTY CHAT STATE
            ================================================= */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">

              <div className="relative mb-6">

                <div className="absolute inset-0 rounded-3xl bg-[#d100a0]/20 blur-2xl" />

                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#d100a0]/20 via-purple-800/20 to-[#6b21a8]/20 border border-[#d100a0]/30 flex items-center justify-center shadow-[0_0_30px_rgba(209,0,160,0.2)]">
                  <MessageSquare
                    size={42}
                    className="text-[#d100a0]"
                  />
                </div>

              </div>

              <h3 className="text-2xl font-black text-white font-heading">
                Your Messages
              </h3>

              <p className="text-gray-400 text-sm mt-2 max-w-sm">
                Select a conversation from your inbox to
                view messages and start chatting.
              </p>

              <div className="flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <UserRound
                  size={13}
                  className="text-[#d100a0]"
                />

                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                  {conversations.length} Active Threads
                </span>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllChats;

