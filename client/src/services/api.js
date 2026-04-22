import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
const AI_BASE = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

// Interceptor to add auth token
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
    // Notes CRUD
    getAllNotes: (visibility) => axios.get(`${BASE}/notes${visibility ? `?visibility=${visibility}` : ''}`),
    getNote: (id) => axios.get(`${BASE}/notes/${id}`),
    createNote: (data) => axios.post(`${BASE}/notes`, data),
    updateNote: (id, data) => axios.put(`${BASE}/notes/${id}`, data),
    deleteNote: (id) => axios.delete(`${BASE}/notes/${id}`),

    // Explore — public notes
    getPublicNotes: () => axios.get(`${BASE}/notes/explore/public`),
    getFollowingNotes: () => axios.get(`${BASE}/notes/explore/following`),
    saveNoteToWorkspace: (id) => axios.post(`${BASE}/notes/${id}/save`),

    // Social
    followUser: (id) => axios.post(`${BASE}/auth/follow/${id}`),
    unfollowUser: (id) => axios.post(`${BASE}/auth/unfollow/${id}`),

    // Groups
    getGroups: () => axios.get(`${BASE}/groups`),
    createGroup: (data) => axios.post(`${BASE}/groups`, data),

    // Profile
    getOwnProfile: () => axios.get(`${BASE}/auth/me`),
    updateOwnProfile: (data) => axios.put(`${BASE}/auth/profile`, data),
    fetchAuthorProfile: (id) => axios.get(`${BASE}/auth/profile/${id}`),

    // Health
    health: () => axios.get(`${BASE}/health`),

    // Auth
    login: (data) => axios.post(`${BASE}/auth/login`, data),
    register: (data) => axios.post(`${BASE}/auth/register`, data),

    // AI Microservice
    analyzeNote: (text) => axios.post(`${AI_BASE}/analyze`, { text }),
};
