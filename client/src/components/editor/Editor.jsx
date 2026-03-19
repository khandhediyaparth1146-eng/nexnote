import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Trash, Tag, Lock, Globe, Users, Save, Check, Clock, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Visibility Selector Component ─────────────────────────────────────────────
const VISIBILITY_OPTIONS = [
    {
        key: 'private',
        label: 'Private',
        desc: 'Only you can see this note',
        icon: <Lock size={16} />,
        color: 'text-slate-300',
        activeBg: 'bg-slate-700 border-slate-500',
        inactiveBg: 'bg-slate-800/50 border-slate-700/50',
        dot: 'bg-slate-400',
    },
    {
        key: 'public',
        label: 'Public',
        desc: 'Anyone on NexNote can read',
        icon: <Globe size={16} />,
        color: 'text-emerald-300',
        activeBg: 'bg-emerald-500/20 border-emerald-400/50',
        inactiveBg: 'bg-slate-800/50 border-slate-700/50',
        dot: 'bg-emerald-400',
    },
];

const VisibilitySelector = ({ value, onChange, groups = [], sharedWithGroups = [], onToggleGroup }) => {
    return (
        <div className="mt-6 mb-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lock size={11} /> Note Visibility
            </p>
            <div className="grid grid-cols-2 gap-3">
                {VISIBILITY_OPTIONS.map(opt => (
                    <button
                        key={opt.key}
                        onClick={() => onChange(opt.key)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${value === opt.key ? opt.activeBg : opt.inactiveBg} hover:scale-105 cursor-pointer`}
                    >
                        <div className={`${value === opt.key ? opt.color : 'text-slate-500'} transition-colors`}>
                            {opt.icon}
                        </div>
                        <span className={`text-xs font-semibold ${value === opt.key ? opt.color : 'text-slate-500'}`}>
                            {opt.label}
                        </span>
                        <span className="text-[10px] text-slate-500 text-center leading-tight hidden sm:block">
                            {opt.desc}
                        </span>
                        {value === opt.key && (
                            <motion.div
                                layoutId="visibility-check"
                                className={`w-1.5 h-1.5 rounded-full ${opt.dot}`}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

// ─── Main Editor ────────────────────────────────────────────────────────────────
const Editor = () => {
    const { activeNote, updateNote, deleteNote, saveNote, createNote, saving } = useWorkspace();
    const [tagInput, setTagInput] = useState('');
    const [groups, setGroups] = useState([]);

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwner = activeNote && (activeNote.authorId === currentUser.id || activeNote.authorId?._id === currentUser.id || activeNote._id?.startsWith('local-'));

    // Fetch groups when editor mounts
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const { api } = await import('../../services/api');
                const res = await api.getGroups();
                setGroups(res.data);
            } catch (err) {
                console.warn('Could not fetch groups', err);
            }
        };
        fetchGroups();
    }, []);


    if (!activeNote) {
        return (
            <div className="flex-1 bg-background h-screen overflow-y-auto w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-slate-500 text-lg font-medium">No note selected</p>
                    <p className="text-slate-600 text-sm mt-1">Create a new note or select one from the sidebar</p>
                </div>
            </div>
        );
    }

    const handleAddTag = (e) => {
        if (!isOwner) return;
        if (e.key === 'Enter' && tagInput.trim()) {
            const newTag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
            updateNote(activeNote._id, { tags: [...new Set([...activeNote.tags, newTag])] });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag) => {
        if (!isOwner) return;
        updateNote(activeNote._id, { tags: activeNote.tags.filter(t => t !== tag) });
    };

    const activeVis = VISIBILITY_OPTIONS.find(o => o.key === activeNote.visibility) || VISIBILITY_OPTIONS[0];

    return (
        <div className="flex-1 bg-background h-screen overflow-y-auto w-full">
            <div className="max-w-3xl mx-auto py-10 px-8 min-h-screen">

                {/* Breadcrumb + Status bar */}
                <div className="flex items-center justify-between gap-2 text-sm text-slate-400 mb-8">
                    <div className="flex items-center gap-2">
                        <span>Workspace</span>
                        <span>/</span>
                        <span className="capitalize">{activeNote.categories?.[0] || 'Uncategorized'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Sync Status */}
                        <div className="flex items-center gap-2 mr-2">
                            {saving ? (
                                <div className="flex items-center gap-1.5 text-xs text-indigo-400">
                                    <Loader size={12} className="animate-spin" />
                                    <span>Syncing...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Check size={12} className="text-emerald-500" />
                                    <span>Synced</span>
                                </div>
                            )}
                        </div>

                        {/* Live visibility badge */}
                        <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${activeVis.activeBg} ${activeVis.color}`}>
                            {activeVis.icon}
                            {activeVis.label}
                        </span>

                        {!isOwner && (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest">
                                Read Only
                            </span>
                        )}

                        {isOwner && (
                            <button
                                onClick={() => deleteNote(activeNote._id)}
                                className="text-red-400/50 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-400/10"
                            >
                                <Trash size={15} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Title */}
                <input
                    type="text"
                    value={activeNote.title}
                    disabled={!isOwner}
                    onChange={(e) => updateNote(activeNote._id, { title: e.target.value })}
                    className={`w-full text-4xl font-bold bg-transparent border-none outline-none text-white mb-4 placeholder-slate-700 focus:ring-0 ${!isOwner ? 'cursor-default' : ''}`}
                    placeholder="Note title..."
                />

                {/* Tags */}
                <div className="flex gap-2 mb-2 items-center flex-wrap">
                    {activeNote.tags?.map(tag => (
                        <span
                            key={tag}
                            onClick={() => handleRemoveTag(tag)}
                            className={`flex items-center gap-1 px-2.5 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-md font-medium border border-indigo-500/20 transition-all ${isOwner ? 'cursor-pointer hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/20' : 'cursor-default'}`}
                            title={isOwner ? "Click to remove" : ""}
                        >
                            #{tag}
                        </span>
                    ))}
                    {isOwner && (
                        <div className="flex items-center gap-1.5">
                            <Tag size={11} className="text-slate-600" />
                            <input
                                type="text"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Add tag + Enter"
                                className="bg-transparent border-b border-slate-800 text-slate-400 text-xs outline-none focus:border-slate-600 px-1 py-1 w-28"
                            />
                        </div>
                    )}
                </div>

                {/* ─── VISIBILITY SELECTOR ─── */}
                {isOwner && (
                    <VisibilitySelector
                        value={activeNote.visibility}
                        onChange={(vis) => updateNote(activeNote._id, { visibility: vis })}
                        groups={groups}
                        sharedWithGroups={activeNote.sharedWithGroups || []}
                        onToggleGroup={(groupId) => {
                            const current = activeNote.sharedWithGroups || [];
                            const updated = current.includes(groupId)
                                ? current.filter(id => id !== groupId)
                                : [...current, groupId];
                            updateNote(activeNote._id, { sharedWithGroups: updated });
                        }}
                    />
                )}

                {/* Note Body */}
                <textarea
                    value={activeNote.content}
                    disabled={!isOwner}
                    onChange={(e) => updateNote(activeNote._id, { content: e.target.value })}
                    className={`w-full min-h-[400px] bg-transparent border-none outline-none text-slate-300 leading-relaxed resize-none focus:ring-0 text-base ${!isOwner ? 'cursor-default' : ''}`}
                    placeholder="Start writing your note here..."
                />

                {/* Save and New Button */}
                <div className="flex justify-end mt-6 border-t border-slate-700/50 pt-6 pb-12">
                    {isOwner ? (
                        <button
                            onClick={async () => {
                                await saveNote(activeNote._id);
                            }}
                            className="flex items-center gap-3 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Save size={18} /> Save Changes
                        </button>
                    ) : (
                        <div className="text-slate-500 text-sm italic">
                            You are viewing a shared community insight.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Editor;
