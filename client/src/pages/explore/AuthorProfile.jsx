import React, { useState, useEffect } from 'react';
import { User, FileText, Map as MapIcon, Users, Loader, TrendingUp, ChevronLeft, Globe, Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorkspace } from '../../context/WorkspaceContext';
import { api } from '../../services/api';

const AuthorProfile = () => {
    const { selectedAuthorId, setCurrentView } = useWorkspace();
    const [profile, setProfile] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!selectedAuthorId) {
                setCurrentView('explore');
                return;
            }
            try {
                const res = await api.fetchAuthorProfile(selectedAuthorId);
                setProfile(res.data.user);
                setNotes(res.data.notes);
                setIsFollowing(res.data.isFollowing);
                setFollowersCount(res.data.user.followers?.length || 0);
            } catch (err) {
                console.error('Failed to fetch author profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [selectedAuthorId]);

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await api.unfollowUser(selectedAuthorId);
                setIsFollowing(false);
                setFollowersCount(prev => prev - 1);
            } else {
                await api.followUser(selectedAuthorId);
                setIsFollowing(true);
                setFollowersCount(prev => prev + 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 bg-[#020617] h-screen flex flex-col items-center justify-center">
                <Loader className="animate-spin text-indigo-500 mb-6" size={48} />
                <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Synchronizing Author Node...</p>
            </div>
        );
    }

    if (!profile) return null;

    const isSelf = currentUser.id === selectedAuthorId;

    return (
        <div className="flex-1 bg-[#020617] h-screen overflow-y-auto w-full text-white font-outfit scrollbar-hide relative">
            {/* Dynamic Header */}
            <div className="h-64 w-full bg-gradient-to-br from-indigo-900 via-slate-950 to-purple-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" 
                />
                
                <button
                    onClick={() => setCurrentView('explore')}
                    className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all z-20"
                >
                    <ChevronLeft size={16} /> Back To Hub
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-12 relative z-10 -translate-y-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                        <div className="w-40 h-40 bg-slate-950 p-2 rounded-[40px] shadow-2xl relative">
                            <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[32px] flex items-center justify-center text-5xl font-black text-white">
                                {profile.username?.[0]?.toUpperCase()}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-slate-950 rounded-full flex items-center justify-center">
                                <Award size={18} className="text-white" />
                            </div>
                        </div>
                        
                        <div className="text-center md:text-left pb-4">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <h2 className="text-5xl font-black tracking-tight">{profile.username}</h2>
                                {isFollowing && <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-400">Following</span>}
                            </div>
                            <p className="text-slate-400 mt-4 text-xl font-medium max-w-xl leading-relaxed italic">
                                "{profile.bio || "This NexNote user is a silent observer in the global knowledge network."}"
                            </p>
                        </div>
                    </div>

                    {!isSelf && (
                        <button
                            onClick={handleFollow}
                            className={`px-10 py-4 font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl transition-all active:scale-95 mb-4 ${isFollowing
                                    ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                                    : 'bg-white text-slate-950 hover:bg-indigo-500 hover:text-white shadow-white/5'
                                }`}
                        >
                            {isFollowing ? 'Unfollow' : 'Follow Author'}
                        </button>
                    )}
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
                    <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-md">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Followers</p>
                        <h4 className="text-3xl font-black text-white">{followersCount}</h4>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-md">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Public Insights</p>
                        <h4 className="text-3xl font-black text-white">{notes.length}</h4>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Node Membership</p>
                        <div className="flex items-center gap-2 text-indigo-400 font-black text-sm">
                            <Calendar size={14} />
                            Since {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Notes Grid */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Globe size={14} className="text-indigo-500" /> Published Network Nodes
                        </h3>
                        <div className="h-px flex-1 bg-slate-800/50 ml-6" />
                    </div>

                    {notes.length === 0 ? (
                        <div className="py-24 text-center border-2 border-dashed border-slate-800/50 rounded-[40px]">
                            <p className="text-slate-600 font-black uppercase tracking-widest text-xs italic">This author has not yet committed to the public node.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {notes.map(note => (
                                <motion.div 
                                    key={note._id} 
                                    whileHover={{ y: -5 }}
                                    className="p-8 bg-slate-900/30 border border-slate-800/50 rounded-[32px] hover:border-indigo-500/30 transition-all shadow-xl group"
                                >
                                    <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors mb-4">{note.title || "Untitled Node"}</h3>
                                    <p className="text-sm text-slate-500 font-bold leading-relaxed line-clamp-3 mb-8 italic">
                                        {note.content?.slice(0, 180) || "Access restricted or no preview content available..."}
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                                        <div className="flex gap-2">
                                            {note.tags?.slice(0, 2).map(tag => (
                                                <span key={tag} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">#{tag}</span>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                                            {new Date(note.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AuthorProfile;

