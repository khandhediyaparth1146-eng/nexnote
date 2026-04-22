import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import AIPanel from '../components/layout/AIPanel';
import Editor from '../components/editor/Editor';
import KnowledgeGraph from './graph/KnowledgeGraph';
import AnalyticsDashboard from './analytics/AnalyticsDashboard';
import ExplorePage from './explore/ExplorePage';
import AuthorProfile from './explore/AuthorProfile';
import StudyMode from './study/StudyMode';
import AllNotes from './AllNotes';
import GroupManager from '../components/groups/GroupManager';
import ProfilePage from './ProfilePage';
import { useWorkspace } from '../context/WorkspaceContext';
import MobileNav from '../components/layout/MobileNav';

const Workspace = () => {
    const { currentView, refreshNotes } = useWorkspace();

    React.useEffect(() => {
        refreshNotes();
    }, [refreshNotes]);

    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-[#030712] overflow-hidden text-slate-200 font-outfit relative">
            <Sidebar />
            
            {/* Main Content Area - padded at bottom on mobile to account for MobileNav */}
            <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] md:h-screen overflow-hidden">
                {currentView === 'workspace' && <Editor />}
                {currentView === 'allnotes' && <AllNotes />}
                {currentView === 'graph' && <KnowledgeGraph />}
                {currentView === 'analytics' && <AnalyticsDashboard />}
                {currentView === 'explore' && <ExplorePage />}
                {currentView === 'author' && <AuthorProfile />}
                {currentView === 'study' && <StudyMode />}
                {currentView === 'groups' && <GroupManager />}
                {currentView === 'profile' && <ProfilePage />}
            </div>

            <AIPanel />
            <MobileNav />
        </div>
    );
};

export default Workspace;
