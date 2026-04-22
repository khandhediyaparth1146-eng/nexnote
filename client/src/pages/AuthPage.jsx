import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ username: '', email: '', password: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
            const res = isLogin ? await api.login(payload) : await api.register(payload);
            const data = res.data;

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/workspace');
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-md w-full relative z-10"
            >
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 mb-6"
                    >
                        <Sparkles size={32} className="text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                        Nex<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Note</span>
                    </h1>
                    <p className="text-slate-400 font-medium">The Intelligent Workspace for Creators</p>
                </div>

                {/* Auth Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Progress Bar */}
                    <AnimatePresence mode="wait">
                        {loading && (
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 z-20"
                            />
                        )}
                    </AnimatePresence>

                    <div className="flex justify-center mb-8 bg-slate-800/50 p-1 rounded-xl">
                        <button 
                            onClick={() => !isLogin && toggleMode()}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => isLogin && toggleMode()}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Register
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-1.5"
                            >
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                                    {isLogin ? 'Sign In to Workspace' : 'Create Your Account'}
                                    <ArrowRight size={18} className="ml-1" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                <p className="mt-8 text-center text-slate-500 text-sm">
                    Protected by NexNote Security. <br className="md:hidden" />
                    By continuing, you agree to our <span className="text-slate-400 hover:text-white cursor-pointer transition-colors underline underline-offset-4">Terms of Service</span>.
                </p>
            </motion.div>
        </div>
    );
};

export default AuthPage;

