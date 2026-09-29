import { useState, useEffect } from 'react';
import axios from '../../lib/api';
import {
  User,
  Mail,
  ShieldCheck,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const userId = localStorage
    .getItem('userId')
    ?.replace(/["']/g, '');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        console.error('User ID nahi mili storage mein');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/auth/profile/${userId}`);

        setProfile(res.data);
      } catch (err) {
        console.error('Profile Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <DashboardLayout title="Loading Profile...">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2
            className="animate-spin text-purple-500"
            size={40}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-xl mx-auto py-10 px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-purple-400 mb-8 transition-all group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />

          <span className="text-sm font-bold uppercase tracking-widest">
            Back
          </span>
        </button>

        <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full" />

          {profile ? (
            <div className="relative z-10 flex flex-col items-center">
              {/* Profile Icon */}
              <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl border border-white/10">
                <User
                  size={40}
                  className="text-white"
                />
              </div>

              {/* Name */}
              <h2 className="text-3xl font-black text-white tracking-tight text-center">
                {profile.name || 'User'}
              </h2>

              {/* Role */}
              <div className="flex items-center gap-2 mt-3 bg-purple-500/10 px-4 py-1.5 rounded-2xl border border-purple-500/20">
                <ShieldCheck
                  size={14}
                  className="text-purple-400"
                />

                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">
                  Verified {profile.role || 'User'}
                </span>
              </div>

              {/* Details */}
              <div className="w-full mt-12 space-y-4">
                {/* Full Name */}
                <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                  <div className="bg-white/5 p-3 rounded-2xl text-gray-400">
                    <User size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      Full Name
                    </p>

                    <p className="text-white font-medium text-sm break-words">
                      {profile.name || 'Not available'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                  <div className="bg-white/5 p-3 rounded-2xl text-gray-400">
                    <Mail size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      Email Address
                    </p>

                    <p className="text-white font-medium text-sm break-all">
                      {profile.email || 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <User
                size={40}
                className="text-gray-600 mx-auto mb-4"
              />

              <p className="text-gray-500">
                No profile data found.
              </p>
            </div>
          )}

          <p className="text-center mt-12 text-gray-600 text-[10px] uppercase font-bold tracking-[0.3em] opacity-40">
            Antigravity © 2026
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;