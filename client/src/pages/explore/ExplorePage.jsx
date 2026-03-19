import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, User as UserIcon, BookOpen, Loader } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { api } from '../../services/api';

const ExplorePage = () => {
    const {
        setCurrentView, setNotes, setActiveNoteId, setSelectedAuthorId,
        exploreNotes, followingNotes, refreshExplore
    } = useWorkspace();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await refreshExplore();
            setLoading(false);
        };
        init();
    }, [refreshExplore]);

    // Helper to get unique authors from public notes
    const getTopAuthors = () => {
        const authorsMap = new Map();
        exploreNotes.forEach(note => {
            const author = note.authorId;
            if (author) {
                const existing = authorsMap.get(author._id);
                authorsMap.set(author._id, {
                    username: author.username,
                    count: (existing?.count || 0) + 1,
                    id: author._id
                });
            }
        });
        return Array.from(authorsMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    };

    const topAuthors = getTopAuthors();

    const handleSaveToWorkspace = async (noteId) => {
        try {
            const res = await api.saveNoteToWorkspace(noteId);
            // Refresh local notes so it shows up in sidebar
            const allNotesRes = await api.getAllNotes();
            setNotes(allNotesRes.data);
            setActiveNoteId(res.data._id);
            setCurrentView('workspace');
        } catch (err) {
            alert('Failed to save note to your workspace.');
        }
    };

    const handleViewAuthor = (authorId) => {
        setSelectedAuthorId(authorId);
        setCurrentView('author');
    };

    const NoteCard = ({ note }) => (
        <div key={note._id} className="p-6 bg-slate-800/40 rounded-xl border border-slate-700 hover:bg-slate-800/80 transition cursor-pointer group flex flex-col justify-between min-h-[160px] shadow-lg hover:border-indigo-500/30">
            <div>
                <h4 className="font-semibold text-lg text-slate-100 group-hover:text-primary transition line-clamp-1">{note.title || 'Untitled Note'}</h4>
                <div className="flex gap-2 mt-3 flex-wrap">
                    {note.tags?.length > 0 ? (
                        note.tags.slice(0, 3).map(t => <span key={t} className="text-[10px] bg-slate-700/50 px-2 py-1 rounded text-slate-400 font-medium">#{t}</span>)
                    ) : (
                        <span className="text-[10px] text-slate-600 uppercase font-semibold tracking-wider">No Tags</span>
                    )}
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between mt-6 pb-2 border-b border-slate-700/30">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-2 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); handleViewAuthor(note.authorId?._id); }}>
                        <div className="w-6 h-6 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-[10px] text-white">
                            {note.authorId?.username?.[0]?.toUpperCase()}
                        </div>
                        {note.authorId?.username || 'Anonymous'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); handleSaveToWorkspace(note._id); }}
                    className="w-full mt-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
                >
                    Save to Workspace
                </button>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 bg-background h-screen overflow-y-auto p-12 text-white border-r border-slate-700/50 w-full scrollbar-hide"
        >
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-primary shadow-inner">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Community Insights</h2>
                        <p className="text-slate-400 text-sm">Discover and save collective knowledge from authors worldwide.</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setLoading(true);
                        refreshExplore().finally(() => setLoading(false));
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition border border-slate-700 shadow-sm"
                >
                    <TrendingUp size={16} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Refreshing...' : 'Refresh Insights'}
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-50">
                    <Loader className="animate-spin mb-4 text-primary" size={40} />
                    <p className="text-slate-400 font-medium tracking-wide">Synthesizing community feed...</p>
                </div>
            ) : (
                <div className="space-y-16">
                    {/* Following Feed */}
                    {followingNotes.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-100 uppercase tracking-widest text-xs">
                                <UserIcon size={14} className="text-indigo-400" /> From Authors You Follow
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {followingNotes.map(note => (
                                    <NoteCard key={note._id} note={note} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trending Notes Grid */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-100 uppercase tracking-widest text-xs">
                            <BookOpen size={14} className="text-accent" /> Trending Insights
                        </h3>
                        {exploreNotes.length === 0 ? (
                            <div className="p-16 bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-700/50 text-center">
                                <p className="text-slate-500 font-medium italic">The village is quiet. Be the first to publish a note!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {exploreNotes.map(note => (
                                    <NoteCard key={note._id} note={note} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Top Authors */}
                    {topAuthors.length > 0 && (
                        <div className="pb-12">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-100 uppercase tracking-widest text-xs">
                                <UserIcon size={14} className="text-emerald-400" /> Notable Contributors
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {topAuthors.map((author, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-slate-800/30 border border-slate-700/50 p-4 rounded-2xl cursor-pointer hover:bg-slate-800/60 transition-all hover:border-indigo-500/30" onClick={() => handleViewAuthor(author.id)}>
                                        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-primary font-bold">
                                            {author.username?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white">{author.username}</h4>
                                            <p className="text-[11px] text-slate-500 font-medium">{author.count} public insights</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default ExplorePage;

