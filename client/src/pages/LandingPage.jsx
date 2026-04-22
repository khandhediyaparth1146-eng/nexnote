import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BrainCircuit, Share2, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-[#030712] text-white font-sans overflow-hidden selection:bg-primary/30 relative">
            {/* Ultra-High Performance CSS Animated Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[#030712]" />
                <div className="absolute inset-0 opacity-30 animate-pulse-slow">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[100px]" />
                </div>
            </div>

            {/* Content Container (Scrollable) */}
            <div className="relative h-full overflow-y-auto z-10 scrollbar-hide">
                <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">NexNote</span>
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
                    className="relative group"
                >
                    {/* Subtle outer glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    
                    <button 
                        onClick={() => navigate('/auth')} 
                        className="relative flex items-center justify-center gap-3 px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl font-black text-xl hover:from-indigo-500 hover:to-purple-600 transition-all shadow-2xl shadow-indigo-600/40 hover:scale-[1.05] active:scale-[0.95] overflow-hidden"
                    >
                        {/* Shimmer effect */}
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shimmer" />
                        
                        <span className="relative z-10">Sign In or Register</span>
                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="relative z-10"
                        >
                            <ArrowRight size={26} strokeWidth={3} />
                        </motion.div>
                    </button>
                </motion.div>

                {/* Feature Highlights Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 w-full text-left"
                >
                    <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition">
                        <BrainCircuit className="text-primary mb-4" size={32} />
                        <h3 className="text-xl font-semibold mb-2">AI Intelligence</h3>
                        <p className="text-slate-400 text-sm">Auto-summarize, simplify complex concepts, and extract semantic keywords dynamically as you type.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition">
                        <Network className="text-accent mb-4" size={32} />
                        <h3 className="text-xl font-semibold mb-2">Knowledge Graph</h3>
                        <p className="text-slate-400 text-sm">Visually map how your ideas connect across different domains to find knowledge gaps.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition">
                        <Share2 className="text-emerald-400 mb-4" size={32} />
                        <h3 className="text-xl font-semibold mb-2">Public Community</h3>
                        <p className="text-slate-400 text-sm">Share your best notes publicly or explore trending topics from leading authors across the network.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition">
                        <Sparkles className="text-purple-400 mb-4" size={32} />
                        <h3 className="text-xl font-semibold mb-2">Study Mode</h3>
                        <p className="text-slate-400 text-sm">Automatically generate flashcards and quizzes from your notes to accelerate learning and retention.</p>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800/50 bg-[#030712]/80 backdrop-blur-md relative z-10 py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    
                    {/* Brand & Info merged */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <Sparkles className="w-3 h-3 text-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white">NexNote</span>
                        </div>
                        <div className="text-slate-400 text-sm font-medium">
                            <p>✉️ khandhediyaparth1146@gmail.com &nbsp;|&nbsp; 📞 +91 9825361146</p>
                        </div>
                        <p className="text-xs text-slate-500 tracking-wide mt-1">
                            &copy; {new Date().getFullYear()} NexNote. All rights reserved.
                        </p>
                    </div>

                    {/* Links & Dev merged */}
                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="flex gap-6 text-sm text-slate-400 font-medium">
                            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium tracking-wide">
                            Developed by <span className="text-white">Parth Khandhediya</span>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    </div>
    );
};

export default LandingPage;
