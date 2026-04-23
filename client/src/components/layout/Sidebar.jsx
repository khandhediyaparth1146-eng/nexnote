import { Home, LayoutGrid, Compass, BookOpen, BarChart3, User, LogOut, Sparkles, Plus, Search, Users, Zap, Flame } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
            active 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
        }`}
    >
        <div className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`}>
            {icon}
        </div>
        {label}
    </button>
);

const calculateStreak = (notes) => {
    if (!notes || notes.length === 0) return 0;

    // Get all unique dates when notes were created or updated
    const activeDays = new Set(
        notes.map(n => {
            const d = new Date(n.updatedAt || n.createdAt);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    );

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (activeDays.has(key)) {
            streak++;
        } else {
            break; // streak is broken
        }
    }
    return streak;
};

const Sidebar = () => {
    const navigate = useNavigate();
    const { createNote, currentView, setCurrentView, notes } = useWorkspace();
    const streak = calculateStreak(notes);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="w-64 h-screen bg-[#020617] border-r border-slate-900 flex flex-col pt-8 pb-6 px-4 hidden md:flex shrink-0 font-outfit">
            {/* Logo */}
            <div className="flex items-center gap-3 px-3 mb-10 shrink-0 cursor-pointer" onClick={() => setCurrentView('workspace')}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Sparkles size={20} className="text-white" />
                </div>
                <span className="text-xl font-black text-white tracking-tight">Nex<span className="text-indigo-400">Note</span></span>
            </div>

            {/* Action */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={createNote}
                className="w-full mb-10 flex items-center justify-center gap-2 bg-white text-slate-950 text-sm font-bold py-3 rounded-xl transition shadow-xl shadow-white/5 hover:bg-slate-100"
            >
                <Plus size={18} /> New Note
            </motion.button>

            {/* Navigation */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-hide">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-4">Workspace</p>
                <NavItem icon={<Home size={18} />} label="Editor" active={currentView === 'workspace'} onClick={() => setCurrentView('workspace')} />
                <NavItem icon={<LayoutGrid size={18} />} label="All Notes" active={currentView === 'allnotes'} onClick={() => setCurrentView('allnotes')} />
                <NavItem icon={<BookOpen size={18} />} label="Study Decks" active={currentView === 'study'} onClick={() => setCurrentView('study')} />
                <NavItem icon={<BarChart3 size={18} />} label="Analytics" active={currentView === 'analytics'} onClick={() => setCurrentView('analytics')} />
                
                <div className="h-4" />
                
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-4">Community</p>
                <NavItem icon={<Compass size={18} />} label="Explore" active={currentView === 'explore'} onClick={() => setCurrentView('explore')} />
                <NavItem icon={<Users size={18} />} label="Groups" active={currentView === 'groups'} onClick={() => setCurrentView('groups')} />

                {/* Gamification: Streak */}
                <div className="mt-8 mx-2 p-4 bg-indigo-600/10 border border-indigo-600/20 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Streak</span>
                        {streak >= 3 
                            ? <Flame size={14} className="text-amber-400 fill-amber-400" />
                            : <Zap size={14} className="text-amber-400 fill-amber-400" />
                        }
                    </div>
                    <div className="flex items-end gap-2">
                        <motion.span
                            key={streak}
                            initial={{ scale: 1.4, color: '#f59e0b' }}
                            animate={{ scale: 1, color: '#ffffff' }}
                            transition={{ duration: 0.4 }}
                            className="text-2xl font-black text-white"
                        >
                            {streak}
                        </motion.span>
                        <span className="text-[10px] font-bold text-slate-500 mb-1 uppercase">Days</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                        {streak === 0 && 'Write a note today to start!'}
                        {streak === 1 && 'Great start! Keep it up 🚀'}
                        {streak >= 2 && streak < 7 && `${streak} day streak! Stay consistent 💪`}
                        {streak >= 7 && `🔥 ${streak} day streak! You're on fire!`}
                    </p>
                </div>
            </nav>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-900 shrink-0 space-y-1.5">
                <NavItem icon={<User size={18} />} label="My Profile" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

