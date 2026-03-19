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

const Workspace = () => {
    const { currentView, refreshNotes } = useWorkspace();

    React.useEffect(() => {
        refreshNotes();
    }, [refreshNotes]);

    return (
        <div className="flex flex-row h-screen w-full bg-background overflow-hidden text-text font-sans">
            <Sidebar />
            {currentView === 'workspace' && <Editor />}
            {currentView === 'allnotes' && <AllNotes />}
            {currentView === 'graph' && <KnowledgeGraph />}
            {currentView === 'analytics' && <AnalyticsDashboard />}
            {currentView === 'explore' && <ExplorePage />}
            {currentView === 'author' && <AuthorProfile />}
            {currentView === 'study' && <StudyMode />}
            {currentView === 'groups' && <GroupManager />}
            {currentView === 'profile' && <ProfilePage />}
            <AIPanel />
        </div>
    );
};

export default Workspace;
