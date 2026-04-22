import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, User as UserIcon, BookOpen, Loader, Globe, ArrowUpRight, Zap } from 'lucide-react';
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

    const getTopAuthors = () => {
        const authorsMap = new Map();
        exploreNotes.forEach(note => {
            const author = note.authorId;
            if (author) {
                const existing = authorsMap.get(author._id);
                authorsMap.set(author._id, {
                    username: author.username,
                    count: (existing?.count || 0) + 1,
                    id: author._id,
                    bio: author.bio || 'Contributing to the global brain.'
                });
            }
        });
        return Array.from(authorsMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
    };

    const topAuthors = getTopAuthors();

    const handleSaveToWorkspace = async (noteId) => {
        try {
            const res = await api.saveNoteToWorkspace(noteId);
            const allNotesRes = await api.getAllNotes();
            setNotes(allNotesRes.data);
            setActiveNoteId(res.data._id);
            setCurrentView('workspace');
        } catch (err) {
            console.error(err);
        }
    };

    const handleViewAuthor = (authorId) => {
        setSelectedAuthorId(authorId);
        setCurrentView('author');
    };

    const NoteCard = ({ note }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-300 shadow-xl overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={18} className="text-indigo-400" />
            </div>

            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <h4 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-3">{note.title || 'Untitled'}</h4>
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {note.tags?.slice(0, 2).map(t => (
                            <span key={t} className="text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800/50">
                    <div className="flex items-center justify-between mb-4">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleViewAuthor(note.authorId?._id); }}
                            className="flex items-center gap-2 group/author"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                                {note.authorId?.username?.[0]?.toUpperCase()}
                            </div>
                            <div className="text-left">
                                <p className="text-[11px] font-black text-slate-300 group-hover/author:text-white transition-colors">{note.authorId?.username}</p>
                                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">Active Author</p>
                            </div>
                        </button>
                        <span className="text-[10px] font-bold text-slate-600">{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleSaveToWorkspace(note._id); }}
                        className="w-full py-2.5 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95 shadow-lg shadow-white/5"
                    >
                        Save To Workspace
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="flex-1 bg-[#020617] h-screen overflow-y-auto w-full font-outfit relative">
            {/* Background Texture */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto p-12 relative z-10">
                <div className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-2xl">
                            <Globe size={28} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black tracking-tight text-white uppercase italic">Community <span className="text-indigo-500">Hub</span></h2>
                            <p className="text-slate-500 font-bold tracking-wide uppercase text-[10px]">Access the collective intelligence of NexNote users</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => { setLoading(true); refreshExplore().finally(() => setLoading(false)); }}
                        className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all flex items-center gap-3"
                    >
                        {loading ? <Loader size={14} className="animate-spin" /> : <Zap size={14} className="text-indigo-400" />}
                        Sync Network
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader className="animate-spin text-indigo-500 mb-6" size={48} />
                        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Connecting to Node Feed...</p>
                    </div>
                ) : (
                    <div className="space-y-24">
                        {/* Authors Showcase */}
                        {topAuthors.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <UserIcon size={16} className="text-indigo-500" />
                                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Notable Contributors</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {topAuthors.map((author, i) => (
                                        <motion.div 
                                            key={i} 
                                            whileHover={{ y: -5 }}
                                            onClick={() => handleViewAuthor(author.id)}
                                            className="group flex flex-col p-6 bg-slate-900/20 border border-slate-800/50 rounded-3xl cursor-pointer hover:bg-slate-900/40 hover:border-indigo-500/30 transition-all duration-500"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl group-hover:scale-110 transition-transform">
                                                    {author.username?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-white group-hover:text-indigo-400 transition-colors">{author.username}</h4>
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase">{author.count} Public Insights</p>
                                                </div>
                                            </div>
                                            <p className="text-[12px] text-slate-500 font-bold leading-relaxed line-clamp-2 italic">"{author.bio}"</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Trending Notes */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <TrendingUp size={16} className="text-purple-500" />
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Trending Intelligence</h3>
                            </div>
                            
                            {exploreNotes.length === 0 ? (
                                <div className="p-20 bg-slate-900/20 rounded-[40px] border-2 border-dashed border-slate-800/50 text-center">
                                    <p className="text-slate-600 font-black uppercase tracking-widest text-xs">The network is currently silent.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {exploreNotes.map(note => (
                                        <NoteCard key={note._id} note={note} />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;

