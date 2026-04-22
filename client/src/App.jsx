import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Workspace from './pages/Workspace';
import LandingPage from './pages/LandingPage';
import { WorkspaceProvider } from './context/WorkspaceContext';

import AuthPage from './pages/AuthPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

function App() {
    return (
        <Router>
            <WorkspaceProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/workspace" element={<Workspace />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsConditions />} />
                </Routes>
            </WorkspaceProvider>
        </Router>
    );
}

export default App;
