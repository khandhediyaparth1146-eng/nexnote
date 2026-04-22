import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const WorkspaceContext = createContext();
export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentView, setCurrentView] = useState('workspace');
    const [loading, setLoading] = useState(true);
    const [dbConnected, setDbConnected] = useState(false);
    const [saving, setSaving] = useState(false); // New state
    const [selectedAuthorId, setSelectedAuthorId] = useState(null);
    const [exploreNotes, setExploreNotes] = useState([]);
    const [followingNotes, setFollowingNotes] = useState([]);
    const saveTimerRef = React.useRef(null);

    const refreshNotes = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await api.getAllNotes();
            setNotes(res.data);
            setDbConnected(true);

            if (res.data.length > 0) {
                setActiveNoteId(prev => {
                    if (prev && res.data.find(n => n._id === prev)) return prev;
                    return res.data[0]._id;
                });
            } else {
                // Feature: Auto-create first note on new login/empty state
                const payload = {
                    title: 'Welcome to NexNote! 🚀',
                    content: 'Start your intelligent note-taking journey here. You can summarize, simplify, and extract keywords from your notes using the AI panel on the right!',
                    tags: ['welcome', 'getting-started'],
                    categories: ['General'],
                    visibility: 'private'
                };
                const newNoteRes = await api.createNote(payload);
                setNotes([newNoteRes.data]);
                setActiveNoteId(newNoteRes.data._id);
            }
        } catch (err) {
            console.error('Core sync failed:', err);
            setDbConnected(false);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshExplore = useCallback(async () => {
        try {
            setExploreNotes([]); // Clear previous data to show loading state
            setFollowingNotes([]); // Clear previous data to show loading state
            const [publicRes, followingRes] = await Promise.all([
                api.getPublicNotes(),
                api.getFollowingNotes().catch(() => ({ data: [] }))
            ]);
            setExploreNotes(publicRes.data);
            setFollowingNotes(followingRes.data);
        } catch (err) {
            console.error('Explore refresh failed:', err);
        }
    }, []);

    // ─── Load all notes from backend on mount ───────────────────────────────────
    useEffect(() => {
        refreshNotes();
    }, []); // Run on initial load

    const activeNote = notes.find(n => n._id === activeNoteId);

    // ─── Debounced Save Logic ──────────────────────────────────────────────
    const debouncedSave = useCallback((id, data) => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

        setSaving(true);
        saveTimerRef.current = setTimeout(async () => {
            try {
                await api.updateNote(id, data);
                setSaving(false);
            } catch (err) {
                console.error('Auto-save failed:', err);
                setSaving(false);
            }
        }, 1000); // 1 second debounce
    }, []);

    // ─── Create Note ────────────────────────────────────────────────────────────
    const createNote = useCallback(async () => {
        const payload = { title: 'Untitled Note', content: '', tags: [], categories: ['General'], visibility: 'private' };
        try {
            setSaving(true);
            const res = await api.createNote(payload);
            setNotes(prev => [res.data, ...prev]);
            setActiveNoteId(res.data._id);
            setCurrentView('workspace');
            setSaving(false);
        } catch (err) {
            console.error('Failed to create server note, falling back to local:', err);
            const local = { ...payload, _id: `local-${Date.now()}`, createdAt: new Date().toISOString() };
            setNotes(prev => [local, ...prev]);
            setActiveNoteId(local._id);
            setCurrentView('workspace');
            setSaving(false);
            // Alert removed for smoother UX
        }
    }, [setCurrentView]);

    // ─── Update Note ────────────────────────────────────────────────────────────
    const updateNote = useCallback(async (id, updates) => {
        // Optimistically update local state first
        setNotes(prev => prev.map(n => n._id === id ? { ...n, ...updates } : n));

        // Don't auto-save local-prefixed notes to backend
        if (id.toString().startsWith('local-')) return;

        debouncedSave(id, updates);
    }, [debouncedSave]);

    // ─── Delete Note ────────────────────────────────────────────────────────────
    const deleteNote = useCallback(async (id) => {
        setNotes(prev => {
            const remaining = prev.filter(n => n._id !== id);
            if (activeNoteId === id && remaining.length > 0) setActiveNoteId(remaining[0]._id);
            if (remaining.length === 0) setActiveNoteId(null);
            return remaining;
        });

        if (id.toString().startsWith('local-')) return;

        try {
            await api.deleteNote(id);
        } catch (err) {
            console.error('Delete failed:', err);
        }
    }, [activeNoteId]);

    // ─── Save Note explicitly ───────────────────────────────────────────────────
    const saveNote = useCallback(async (id) => {
        const note = notes.find(n => n._id === id);
        if (!note || id.toString().startsWith('local-')) return;

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

        setSaving(true);
        try {
            await api.updateNote(id, note);
            setSaving(false);
        } catch (err) {
            setSaving(false);
            console.error('Manual save failed:', err);
        }
    }, [notes]);

    // ─── AI Mock Functions (keeping these as-is) ───────────────────────────────
    const generateAISummary = async (text) => {
        await new Promise(r => setTimeout(r, 800));
        return `📝 Summary: ${text.slice(0, 50)}... [Synced with core cloud]`;
    };

    const simplifyText = async (text) => {
        await new Promise(r => setTimeout(r, 800));
        return `✨ Simplified: ${text.slice(0, 50)}... [Optimized context]`;
    };

    const extractKeywords = async (text) => {
        await new Promise(r => setTimeout(r, 600));
        return ['knowledge', 'cloud', 'sync'];
    };

    // ─── Filter notes by search ─────────────────────────────────────────────────
    const filteredNotes = notes.filter(n =>
        n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return (
        <WorkspaceContext.Provider value={{
            notes, setNotes, loading, dbConnected, saving, refreshNotes,
            activeNoteId, setActiveNoteId, activeNote,
            createNote, updateNote, deleteNote, saveNote,
            searchQuery, setSearchQuery, filteredNotes,
            currentView, setCurrentView,
            selectedAuthorId, setSelectedAuthorId,
            exploreNotes, setExploreNotes, followingNotes, setFollowingNotes,
            refreshExplore,
            generateAISummary, simplifyText, extractKeywords,
        }}>
            {children}
        </WorkspaceContext.Provider>
    );
};
