import { Home, Edit3, Plus, Settings, Sparkles, BookOpen, User, GitCommit, Search, Compass, LayoutGrid, Trash2, Save, Users, LogOut } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useNavigate } from 'react-router-dom';

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-primary/10 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}`}>
        {icon}
        {label}
    </button>
);

const Sidebar = () => {
    const navigate = useNavigate();
    const {
        filteredNotes,
        activeNoteId,
        setActiveNoteId,
        createNote,
        deleteNote,
        saveNote,
        searchQuery,
        setSearchQuery,
        currentView,
        setCurrentView
    } = useWorkspace();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="w-64 h-screen bg-surface border-r border-slate-700/50 flex flex-col pt-6 pb-4 px-4 hidden md:flex shrink-0 overflow-y-auto">
            <div className="flex items-center gap-3 px-2 mb-8 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">NexNote</span>
            </div>


            <button
                onClick={createNote}
                className="w-full mb-6 flex items-center justify-center gap-2 bg-primary hover:bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg transition shadow-lg shadow-primary/20">
                <Plus size={16} /> New Note
            </button>

            <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Views</div>
                <NavItem icon={<Home size={16} />} label="Workspace" active={currentView === 'workspace'} onClick={() => setCurrentView('workspace')} />
                <NavItem icon={<LayoutGrid size={16} />} label="All Notes" active={currentView === 'allnotes'} onClick={() => setCurrentView('allnotes')} />
                <NavItem icon={<Compass size={16} />} label="Explore" active={currentView === 'explore'} onClick={() => setCurrentView('explore')} />

                <NavItem icon={<BookOpen size={16} />} label="Study Decks" active={currentView === 'study'} onClick={() => setCurrentView('study')} />

                <NavItem icon={<BookOpen size={16} />} label="Analytics" active={currentView === 'analytics'} onClick={() => setCurrentView('analytics')} />

            </nav>

            <div className="mt-6 pt-4 border-t border-slate-700/50 shrink-0 space-y-1">
                <NavItem icon={<User size={18} />} label="Profile" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
                <NavItem icon={<LogOut size={18} />} label="Logout" onClick={handleLogout} />
            </div>
        </div>
    );
};

export default Sidebar;
