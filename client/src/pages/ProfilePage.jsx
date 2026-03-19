import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, CheckCircle, Loader, UserCircle, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        username: '',
        bio: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.getOwnProfile();
                setUser(res.data);
                setForm({
                    username: res.data.username || '',
                    bio: res.data.bio || '',
                    password: '',
                    confirmPassword: ''
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (form.password && form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setSaving(true);
        setError('');
        try {
            const payload = {
                username: form.username,
                bio: form.bio
            };
            if (form.password) payload.password = form.password;

            const res = await api.updateOwnProfile(payload);

            // Update local storage user data
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({
                ...storedUser,
                username: res.data.user.username
            }));

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 bg-background h-screen flex flex-col items-center justify-center">
                <Loader className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-background h-screen overflow-y-auto p-12 text-white border-r border-slate-700/50"
        >
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-primary/20 rounded-2xl text-primary shadow-xl">
                        <UserCircle size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
                        <p className="text-slate-400">Manage your identity and account security.</p>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-8 bg-slate-800/20 p-8 rounded-3xl border border-slate-700/50">
                    {/* Username & Bio Section */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            Profile Information
                        </h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-100"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">About You</label>
                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-100 resize-none"
                                placeholder="Write a short bio about yourself..."
                            />
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="space-y-6 pt-6 border-t border-slate-700/50">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            Security Settings
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">New Password</label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-100"
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Confirm New Password</label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-100"
                                        placeholder="Confirm your new password"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium flex items-center gap-3">
                            <Shield size={18} /> {error}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                            <Mail size={14} /> Email cannot be changed (Contact support)
                        </p>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-3 bg-primary hover:bg-indigo-600 text-white font-bold py-3.5 px-10 rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                            {success ? "Profile Updated!" : "Save Changes"}
                        </button>
                    </div>
                </form>

                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="fixed bottom-12 right-12 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold z-50 shadow-emerald-500/20"
                    >
                        <CheckCircle size={20} />
                        Your changes have been deployed successfully!
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ProfilePage;
