import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Globe, Users, Plus, Trash, FileText, X } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

const VIS_CONFIG = {
    private: { icon: <Lock size={13} />, label: 'Private', color: 'text-slate-400', bg: 'bg-slate-700/40 border-slate-600/50' },
    public: { icon: <Globe size={13} />, label: 'Public', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
};

const NoteCard = ({ note, onClick, onDelete }) => {
    const vis = VIS_CONFIG[note.visibility] || VIS_CONFIG.private;
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className="group relative p-5 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 hover:border-slate-600 transition-all cursor-pointer"
        >
            {/* Delete button */}
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition p-1.5 rounded-lg hover:bg-red-500/20 text-red-400/50 hover:text-red-400"
            >
                <X size={13} />
            </button>

            <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
                    <FileText size={16} />
                </div>
                <h3 className="font-semibold text-slate-100 leading-tight line-clamp-2 pr-6">
                    {note.title || ' '}
                </h3>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                {note.content?.substring(0, 100) || 'No content yet...'}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-1.5 flex-wrap">
                    {note.tags?.slice(0, 3).map(t => (
                        <span key={t} className="text-[11px] bg-slate-700/60 text-slate-400 px-2 py-0.5 rounded-md">#{t}</span>
                    ))}
                </div>
                <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border ${vis.bg} ${vis.color}`}>
                    {vis.icon} {vis.label}
                </span>
            </div>

            <p className="text-[10px] text-slate-600 mt-3">
                {new Date(note.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
        </motion.div>
    );
};

const AllNotes = () => {
    const { notes, loading, createNote, deleteNote, setActiveNoteId, setCurrentView } = useWorkspace();
    const [filter, setFilter] = useState('all');

    console.log("AllNotes rendering with:", notes.length, "notes");
    const filtered = filter === 'all' ? notes : notes.filter(n => n.visibility === filter);

    const handleOpen = (id) => {
        setActiveNoteId(id);
        setCurrentView('workspace');
    };

    const tabs = [
        { key: 'all', label: 'All Notes', count: notes.length },
        { key: 'private', label: 'Private', count: notes.filter(n => n.visibility === 'private').length },
        { key: 'public', label: 'Public', count: notes.filter(n => n.visibility === 'public').length },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 bg-background h-screen overflow-y-auto p-10 text-white border-r border-slate-700/50 w-full"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">All Notes</h2>
                    <p className="text-slate-400 mt-1">All your notes stored in the database, organized by visibility.</p>
                </div>
                <button
                    onClick={createNote}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-indigo-600 text-white rounded-full text-sm font-medium transition shadow-lg shadow-primary/20"
                >
                    <Plus size={16} /> New Note
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 p-1 bg-slate-800/40 rounded-xl border border-slate-700/50 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === tab.key ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        {tab.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab.key ? 'bg-white/20' : 'bg-slate-700/70 text-slate-500'}`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Notes Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-44 bg-slate-800/30 rounded-xl border border-slate-700/50 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-slate-400 font-medium text-lg">No notes found</p>
                    <p className="text-slate-600 text-sm mt-1">Create your first note to get started!</p>
                    <button onClick={createNote} className="mt-6 px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-indigo-600 transition">
                        Create Note
                    </button>
                </div>
            ) : (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    <AnimatePresence>
                        {filtered.map(note => (
                            <NoteCard
                                key={note._id}
                                note={note}
                                onClick={() => handleOpen(note._id)}
                                onDelete={deleteNote}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AllNotes;
