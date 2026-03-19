import React, { useState, useEffect } from 'react';
import { User, FileText, Map as MapIcon, Users, Loader, TrendingUp, ChevronLeft } from 'lucide-react';
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
            alert('Failed to update follow status');
        }
    };

    if (loading) {
        return (
            <div className="flex-1 bg-background h-screen flex flex-col items-center justify-center opacity-50">
                <Loader className="animate-spin mb-4" size={32} />
                <p>Loading author community profile...</p>
            </div>
        );
    }

    if (!profile) return null;

    const isSelf = currentUser.id === selectedAuthorId;

    return (
        <div className="flex-1 bg-background h-screen overflow-y-auto w-full text-white border-r border-slate-700/50 scrollbar-hide">
            {/* Header / Cover */}
            <div className="h-48 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                <button
                    onClick={() => setCurrentView('explore')}
                    className="absolute top-6 left-8 bg-black/30 hover:bg-black/50 p-2 rounded-full backdrop-blur-md transition-all text-white border border-white/20"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            <div className="max-w-4xl mx-auto px-8 py-4 -translate-y-16">
                <div className="flex justify-between items-end mb-8 px-2">
                    <div className="w-32 h-32 bg-slate-900 border-8 border-slate-900 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden group">
                        <div className="w-full h-full bg-gradient-to-tr from-primary to-accent grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <User size={64} className="text-white absolute z-10 opacity-80" />
                    </div>
                    <div className="flex gap-3 mb-4">
                        {!isSelf && (
                            <button
                                onClick={handleFollow}
                                className={`px-6 py-2.5 font-semibold rounded-xl shadow-lg transition-all active:scale-95 ${isFollowing
                                        ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                                        : 'bg-primary text-white shadow-indigo-500/20 hover:bg-indigo-600'
                                    }`}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow Author'}
                            </button>
                        )}
                        <button className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition" title="Report">
                            <Users size={18} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                <div className="mb-12 px-2">
                    <h2 className="text-4xl font-bold tracking-tight">{profile.username}</h2>
                    <p className="text-slate-400 mt-3 text-lg max-w-2xl leading-relaxed">
                        {profile.bio || "This NexNote user hasn't added a bio yet. They contribute to the public knowledge system."}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 mt-8">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 rounded-full border border-slate-700/50">
                            <Users size={16} className="text-slate-500" />
                            <span className="font-bold text-slate-200">{followersCount}</span>
                            <span className="text-sm text-slate-500">Followers</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 rounded-full border border-slate-700/50">
                            <FileText size={16} className="text-slate-500" />
                            <span className="font-bold text-slate-200">{notes.length}</span>
                            <span className="text-sm text-slate-500">Public Notes</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <TrendingUp size={16} />
                            <span>Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                <div className="px-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 section-line">
                        Published Insights
                    </h3>

                    {notes.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                            <p className="text-slate-600">No public notes published yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {notes.map(note => (
                                <div key={note._id} className="p-6 bg-[#111827] border border-slate-800 rounded-2xl hover:border-indigo-500/50 hover:bg-[#111827]/80 transition-all cursor-pointer group shadow-lg">
                                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-primary transition">{note.title || "Untitled Insight"}</h3>
                                    <p className="text-sm text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                                        {note.content?.slice(0, 150) || "No preview available..."}
                                    </p>
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                            {note.tags?.slice(0, 2).map(tag => (
                                                <span key={tag} className="bg-slate-800 px-2 py-1 rounded">#{tag}</span>
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-medium">
                                            {new Date(note.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorProfile;

