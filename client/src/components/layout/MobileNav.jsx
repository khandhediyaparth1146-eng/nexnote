import React from 'react';
import { Home, LayoutGrid, Compass, BookOpen, User } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

const MobileNav = () => {
    const { currentView, setCurrentView } = useWorkspace();

    const NavItem = ({ icon, viewId }) => {
        const isActive = currentView === viewId;
        return (
            <button 
                onClick={() => setCurrentView(viewId)}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
                {React.cloneElement(icon, { size: 22 })}
            </button>
        );
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#020617] border-t border-slate-900 flex items-center justify-around z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <NavItem icon={<Home />} viewId="workspace" />
            <NavItem icon={<LayoutGrid />} viewId="allnotes" />
            <NavItem icon={<Compass />} viewId="explore" />
            <NavItem icon={<BookOpen />} viewId="study" />
            <NavItem icon={<User />} viewId="profile" />
        </div>
    );
};

export default MobileNav;
