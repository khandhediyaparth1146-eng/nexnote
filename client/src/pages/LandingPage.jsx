import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BrainCircuit, Share2, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-white font-sans overflow-y-auto selection:bg-primary/30">
            {/* Nav */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">NexNote</span>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/auth')} className="px-4 py-2 text-sm text-slate-300 hover:text-white transition">Log in</button>
                    <button onClick={() => navigate('/auth')} className="px-4 py-2 text-sm bg-white text-slate-900 font-medium rounded-full hover:bg-slate-200 transition">Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300 mb-8"
                >
                    <Sparkles size={14} className="text-accent" />
                    AI-Powered Knowledge Management
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-tight"
                >
                    Organize. Discover.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Connect.</span>
                </motion.h1>



                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button onClick={() => navigate('/auth')} className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-indigo-600 transition shadow-lg shadow-primary/25">
                        Start for free <ArrowRight size={18} />
                    </button>
                    <button className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-full font-medium hover:bg-slate-700 transition border border-slate-700">
                        View Demo
                    </button>
                </motion.div>

                {/* Feature Highlights Grid */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left"
                >
                    <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition">
                        <BrainCircuit className="text-primary mb-4" size={32} />
                        <h3 className="text-xl font-semibold mb-2">AI Intelligence</h3>
                        <p className="text-slate-400">Auto-summarize, simplify complex concepts, and extract semantic keywords dynamically as you type.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition">
                        <Network className="text-accent mb-4" size={32} />
                        <h3 className="text-xl font-semibold mb-2">Knowledge Graph</h3>
                        <p className="text-slate-400">Visually map how your ideas connect across different domains to find knowledge gaps.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition">
                        <Share2 className="text-emerald-400 mb-4" size={32} />
                        <h3 className="text-xl font-semibold mb-2">Public Community</h3>
                        <p className="text-slate-400">Share your best notes publicly or explore trending topics from leading authors across the network.</p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default LandingPage;
