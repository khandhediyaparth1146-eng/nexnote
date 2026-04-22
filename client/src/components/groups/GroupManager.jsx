import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Shield, Network, ArrowUpRight, Sparkles, X, Layout, Lock, Globe } from 'lucide-react';
import { api } from '../../services/api';

const GroupManager = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await api.getGroups();
            setGroups(res.data);
        } catch (err) {
            console.error('Failed to load groups');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await api.createGroup({ name, description, groupType });
            setShowCreate(false);
            setName('');
            setDescription('');
            fetchGroups();
        } catch (err) {
            console.error('Failed to create group');
        }
    };

    return (
        <div className="flex-1 bg-[#030712] h-screen overflow-y-auto w-full font-outfit relative scrollbar-hide">
            <div className="max-w-6xl mx-auto p-12">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div>
                        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">Collaboration <span className="text-indigo-500">Hub</span></h2>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Sync your intelligence with research circles</p>
                    </div>

                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-white text-slate-950 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5 flex items-center gap-2"
                    >
                        <Plus size={18} /> Establish Circle
                    </button>
                </div>

                {/* Create Group Modal */}
                <AnimatePresence>
                    {showCreate && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowCreate(false)}
                                className="absolute inset-0 bg-[#030712]/90 backdrop-blur-xl"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />
                                
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400">
                                            <Network size={20} />
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">New Intelligence Circle</h3>
                                    </div>
                                    <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateGroup} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Circle Identity</label>
                                            <input 
                                                required 
                                                type="text" 
                                                value={name} 
                                                onChange={e => setName(e.target.value)} 
                                                placeholder="e.g. Physics Quantum Research" 
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium" 
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Circle Archetype</label>
                                                <select 
                                                    value={groupType} 
                                                    onChange={e => setGroupType(e.target.value)} 
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium appearance-none"
                                                >
                                                    <option>Study Group</option>
                                                    <option>Project Team</option>
                                                    <option>Research Group</option>
                                                    <option>Open Network</option>
                                                </select>
                                            </div>
                                            <div className="flex items-end">
                                                <div className="w-full bg-indigo-600/5 border border-indigo-600/10 rounded-2xl px-5 py-4 flex items-center gap-3 text-indigo-400">
                                                    <Shield size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Secured Node</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Objectives</label>
                                            <textarea 
                                                value={description} 
                                                onChange={e => setDescription(e.target.value)} 
                                                placeholder="What intelligence will be synced here?" 
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium resize-none h-32" 
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-[11px] py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                                    >
                                        Initialize Circle
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Group Detail Modal */}
                <AnimatePresence>
                    {selectedGroup && (
                        <div className="fixed inset-0 z-50 flex items-center justify-end">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedGroup(null)}
                                className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="relative w-full max-w-2xl h-full bg-[#030712] border-l border-slate-800 shadow-2xl p-12 flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-12">
                                    <button onClick={() => setSelectedGroup(null)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest">
                                        <X size={20} /> Close Circle
                                    </button>
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <Shield size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Verified Intelligence Circle</span>
                                    </div>
                                </div>

                                <div className="mb-12">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/5 px-4 py-1.5 rounded-full border border-indigo-500/10 mb-6 inline-block">
                                        {selectedGroup.groupType}
                                    </span>
                                    <h3 className="text-6xl font-black text-white italic tracking-tighter mb-6 leading-none">{selectedGroup.name}</h3>
                                    <p className="text-slate-500 text-lg font-bold leading-relaxed">{selectedGroup.description || "Synthesizing knowledge without a defined objective..."}</p>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Circle Members ({selectedGroup.members.length})</h4>
                                        <button className="text-indigo-400 hover:text-indigo-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                            <Plus size={14} /> Invite Mind
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {selectedGroup.members.map((member, i) => (
                                            <div key={member.user?._id || i} className="flex items-center justify-between p-6 bg-slate-900/50 rounded-3xl border border-slate-800/50 hover:border-indigo-500/30 transition-all">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg">
                                                        {member.user?.username?.[0].toUpperCase() || "M"}
                                                    </div>
                                                    <div>
                                                        <h5 className="text-white font-black text-lg tracking-tight">{member.user?.username || "Anonymous Mind"}</h5>
                                                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{member.role === 'admin' ? 'Circle Founder' : 'Researcher Node'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {member.role === 'admin' && (
                                                        <span className="px-3 py-1 bg-indigo-600 rounded-lg text-[9px] font-black text-white uppercase tracking-tighter">Founder</span>
                                                    )}
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="mt-8 w-full bg-slate-900 border border-slate-800 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 text-slate-500 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all">
                                    Leave Intelligence Circle
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Groups Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-900/20 rounded-[40px] border border-slate-800/50 animate-pulse" />
                        ))
                    ) : groups.length === 0 ? (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-900/50 rounded-[40px]">
                            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                                <Users size={40} className="text-slate-800" />
                            </div>
                            <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-xs">No active circles found</p>
                        </div>
                    ) : (
                        groups.map((group, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={group._id} 
                                onClick={() => setSelectedGroup(group)}
                                className="group relative p-10 bg-slate-900/30 border border-slate-800/50 rounded-[40px] hover:border-indigo-500/30 transition-all duration-500 cursor-pointer shadow-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight size={20} className="text-indigo-400" />
                                </div>

                                <div className="flex flex-col h-full relative z-10">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            <Sparkles size={24} />
                                        </div>
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/5 px-4 py-1.5 rounded-full border border-indigo-500/10">
                                            {group.groupType}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors mb-4 tracking-tighter">
                                        {group.name}
                                    </h3>
                                    
                                    <p className="text-[13px] text-slate-500 font-bold leading-relaxed line-clamp-3 mb-12 italic">
                                        {group.description || "Synthesizing knowledge without a defined objective..."}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-slate-800/50">
                                        <div className="flex -space-x-3">
                                            {group.members.slice(0, 3).map((member, m) => (
                                                <div key={m} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#030712] flex items-center justify-center text-[10px] font-black text-slate-500">
                                                    {member.user?.username?.[0].toUpperCase() || "?"}
                                                </div>
                                            ))}
                                            {group.members.length > 0 && (
                                                <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-[#030712] flex items-center justify-center text-[10px] font-black text-white">
                                                    +{group.members.length}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Lock size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Internal Circle</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupManager;
