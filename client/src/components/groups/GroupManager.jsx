import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Shield, Network } from 'lucide-react';
import { api } from '../../services/api';

const GroupManager = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [groupType, setGroupType] = useState('Study Group');

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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 bg-background h-screen overflow-y-auto p-10 text-white w-full border-r border-slate-700/50">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Users className="text-primary" size={32} />
                            Friend Groups
                        </h2>
                        <p className="text-slate-400 mt-2">Manage your study groups, teams, and research circles to share notes.</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-indigo-600 text-white rounded-full text-sm font-medium transition shadow-lg shadow-primary/20"
                    >
                        <Plus size={16} /> Create Group
                    </button>
                </div>

                {showCreate && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-6 bg-slate-800/40 border border-slate-700/50 rounded-xl"
                    >
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Network size={18} className="text-emerald-400" /> New Group Details</h3>
                        <form onSubmit={handleCreateGroup} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Group Name</label>
                                    <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Physics 101 Study Group" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Group Type</label>
                                    <select value={groupType} onChange={e => setGroupType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                                        <option>Study Group</option>
                                        <option>Project Team</option>
                                        <option>Research Group</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description (Optional)</label>
                                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this group about?" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-slate-400 hover:text-white transition">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg transition shadow-md">Create Group</button>
                            </div>
                        </form>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {loading ? (
                        [1, 2].map(i => <div key={i} className="h-32 bg-slate-800/30 rounded-xl border border-slate-700/50 animate-pulse" />)
                    ) : groups.length === 0 ? (
                        <div className="col-span-full py-16 text-center border border-dashed border-slate-700 rounded-xl bg-slate-800/20">
                            <Users size={48} className="mx-auto text-slate-600 mb-4" />
                            <h3 className="text-xl font-medium text-slate-300">No groups yet</h3>
                            <p className="text-slate-500 mt-2">Create one to start sharing notes with your friends.</p>
                        </div>
                    ) : (
                        groups.map(group => (
                            <div key={group._id} className="p-6 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 transition relative group cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-medium px-2 py-1 rounded-full">{group.groupType}</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{group.description || 'No description provided.'}</p>

                                <div className="flex items-center gap-2 mt-auto border-t border-slate-700/50 pt-4">
                                    <Shield size={14} className="text-slate-500" />
                                    <span className="text-xs text-slate-400">{group.members.length} member(s)</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default GroupManager;
