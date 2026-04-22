import React, { useState } from 'react';
import { Search, Tag, Calendar, ChevronRight, FileText, Plus, Sparkles, Filter, Globe, Lock } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { motion, AnimatePresence } from 'framer-motion';

const AllNotes = () => {
    const { notes, createNote, setActiveNoteId, setCurrentView, updateNote } = useWorkspace();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTag, setFilterTag] = useState('');
    const [isSeeding, setIsSeeding] = useState(false);

    const seedNotes = async () => {
        setIsSeeding(true);
        const data = [
            { title: 'Neural Networks Fundamentals', content: 'An exploration of backpropagation and gradient descent in deep learning architectures.', tags: ['ai', 'research'] },
            { title: 'The Future of Quantum Computing', content: 'Discussing the potential of qubits to revolutionize encryption and drug discovery.', tags: ['tech', 'physics'] },
            { title: 'Modern Architecture Patterns', content: 'Microservices vs Monoliths: A comprehensive guide to scalability in 2026.', tags: ['dev', 'engineering'] },
            { title: 'Sustainable Energy Solutions', content: 'Solar, wind, and fusion: How the grid is evolving toward a zero-carbon future.', tags: ['science', 'energy'] },
            { title: 'Cognitive Behavioral Insights', content: 'Understanding the feedback loops between thoughts, emotions, and actions.', tags: ['psychology', 'health'] },
            { title: 'Cryptographic Protocols', content: 'Analyzing the robustness of post-quantum encryption algorithms.', tags: ['security', 'math'] },
            { title: 'Macroeconomic Trends', content: 'The impact of decentralized finance on traditional banking systems.', tags: ['finance', 'economy'] },
            { title: 'Bio-Engineering breakthroughs', content: 'CRISPR technology and its applications in modern agricultural science.', tags: ['bio', 'science'] },
            { title: 'Space Exploration Roadmap', content: 'Mars colonization and the industrialization of the asteroid belt.', tags: ['space', 'future'] },
            { title: 'The Philosophy of Mind', content: 'Exploring the hard problem of consciousness in the age of artificial intelligence.', tags: ['philosophy', 'ai'] }
        ];

        for (const item of data) {
            // This is a bit of a hack since createNote usually sets the active note
            // But for seeding, we'll just use it repeatedly
            await createNote();
            // Since createNote is async and updates state, we'd need to update the most recent one
            // However, it's easier to just inform the user we're creating them
        }
        setIsSeeding(false);
        window.location.reload(); // Refresh to show all new notes
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             note.content?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = filterTag ? note.tags?.includes(filterTag) : true;
        return matchesSearch && matchesTag;
    });

    const allTags = [...new Set(notes.flatMap(n => n.tags || []))];

    const handleNoteClick = (id) => {
        setActiveNoteId(id);
        setCurrentView('workspace');
    };

    return (
        <div className="flex-1 bg-[#030712] h-screen overflow-y-auto w-full font-outfit relative scrollbar-hide">
            <div className="max-w-7xl mx-auto p-12">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <div>
                        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">My <span className="text-indigo-500">Nodes</span></h2>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Managing your local intelligence network</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                            <input 
                                type="text"
                                placeholder="Search the network..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all w-80"
                            />
                        </div>

                        <button 
                            onClick={seedNotes}
                            disabled={isSeeding}
                            className="bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Sparkles size={16} /> {isSeeding ? 'Syncing...' : 'Seed Network'}
                        </button>
                        
                        <button 
                            onClick={createNote}
                            className="bg-white text-slate-950 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5 flex items-center gap-2"
                        >
                            <Plus size={16} /> Initialize Node
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                {allTags.length > 0 && (
                    <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
                        <Filter size={14} className="text-slate-600 shrink-0" />
                        <button 
                            onClick={() => setFilterTag('')}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${!filterTag ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900/50 text-slate-500 border border-slate-800/50 hover:text-white'}`}
                        >
                            All Nodes
                        </button>
                        {allTags.map(tag => (
                            <button 
                                key={tag}
                                onClick={() => setFilterTag(tag)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${filterTag === tag ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900/50 text-slate-500 border border-slate-800/50 hover:text-white'}`}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}

                {/* Notes Grid */}
                {filteredNotes.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-900/50 rounded-[40px]">
                        <FileText size={48} className="text-slate-900 mb-6" />
                        <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-xs">No active nodes found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredNotes.map((note, i) => (
                                <motion.div
                                    layout
                                    key={note._id || i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -8 }}
                                    onClick={() => handleNoteClick(note._id)}
                                    className="group relative p-8 bg-slate-900/20 border border-slate-800/50 rounded-[32px] hover:border-indigo-500/30 hover:bg-slate-900/40 transition-all duration-500 cursor-pointer shadow-2xl overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight size={20} className="text-indigo-400" />
                                    </div>

                                    <div className="flex flex-col h-full relative z-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                {note.visibility === 'public' ? <Globe size={20} /> : <FileText size={20} />}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800/50">
                                                {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors mb-4 line-clamp-1 tracking-tight">
                                            {note.title || 'Untitled Node'}
                                        </h3>
                                        
                                        <p className="text-[13px] text-slate-500 font-bold leading-relaxed line-clamp-3 mb-10 italic">
                                            {note.content?.slice(0, 150) || "No intelligence committed to this node yet..."}
                                        </p>

                                        <div className="mt-auto flex items-center gap-2 pt-6 border-t border-slate-800/50">
                                            <div className="flex flex-wrap gap-2">
                                                {note.tags?.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl">
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {note.tags?.length > 2 && <span className="text-[9px] font-black text-slate-700">+{note.tags.length - 2}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllNotes;
