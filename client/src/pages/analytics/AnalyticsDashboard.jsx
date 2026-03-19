import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { motion } from 'framer-motion';

const AnalyticsDashboard = () => {
    const { notes } = useWorkspace();
    const tagCount = notes.reduce((acc, note) => {
        note.tags.forEach(t => acc[t] = (acc[t] || 0) + 1);
        return acc;
    }, {});

    const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 3);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 bg-background h-screen flex flex-col p-12 text-white overflow-y-auto w-full border-r border-slate-700/50"
        >
            <h2 className="text-3xl font-bold mb-2">Learning Analytics Dashboard</h2>
            <p className="text-slate-400 mb-8">Feature 27: Track your knowledge growth and review patterns.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700 hover:bg-slate-800/60 transition">
                    <p className="text-sm text-slate-400 font-medium tracking-wide">TOTAL KNOWLEDGE BUILT</p>
                    <p className="text-4xl font-bold mt-2 text-indigo-400">{notes.length} Notes</p>
                </div>
                <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700 hover:bg-slate-800/60 transition">
                    <p className="text-sm text-slate-400 font-medium tracking-wide">MOST STUDIED TOPIC</p>
                    <p className="text-4xl font-bold mt-2 text-accent capitalize">{topTags.length ? topTags[0][0] : 'None yet'}</p>
                </div>
                <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700 hover:bg-slate-800/60 transition">
                    <p className="text-sm text-slate-400 font-medium tracking-wide">AI SUGGESTIONS ACTED ON</p>
                    <p className="text-4xl font-bold mt-2 text-emerald-400">12 Ideas</p>
                </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-8 mt-6 w-full">
                <h3 className="text-xl font-semibold mb-4 text-slate-200">Knowledge Timeline (Feature 21)</h3>
                <div className="space-y-4">
                    {notes.map(n => (
                        <div key={n.id} className="flex gap-4 items-center">
                            <div className="w-2 h-2 rounded-full bg-primary mt-1 shadow-lg shadow-indigo-500" />
                            <p className="text-sm text-slate-300">You synthesized a new idea: <span className="font-semibold text-white">{n.title || 'Untitled Space'}</span> - {new Date(n.updatedAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsDashboard;
