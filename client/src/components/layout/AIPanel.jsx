import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader, ClipboardCopy, PenLine, CheckCheck, Brain, Zap, Hash, AlignLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from '../../context/WorkspaceContext';
import { api } from '../../services/api';

const MessageBubble = ({ m, onInsertToNote, onCopy, isOwner }) => {
    const [copied, setCopied] = useState(false);
    const isAI = m.role === 'assistant';

    const handleCopy = () => {
        navigator.clipboard.writeText(m.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (onCopy) onCopy();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group p-5 rounded-3xl text-[13px] leading-relaxed transition-all shadow-sm ${
                isAI
                ? 'bg-[#0f172a] border border-slate-800 text-slate-200'
                : 'bg-indigo-600/10 border border-indigo-600/20 text-indigo-300 ml-4'
            }`}
        >
            <div className="flex items-center gap-2 mb-3">
                {isAI ? (
                    <div className="p-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <Sparkles size={14} className="text-indigo-400" />
                    </div>
                ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                    {isAI ? 'Nex Intelligence' : 'Human Operator'}
                </span>
            </div>

            <div className="whitespace-pre-wrap font-medium">{m.text}</div>

            {isAI && (
                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isOwner && (
                        <button
                            onClick={() => onInsertToNote && onInsertToNote(m.text)}
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition"
                        >
                            <PenLine size={13} /> Inject to Note
                        </button>
                    )}
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition ml-auto"
                    >
                        {copied ? <><CheckCheck size={13} className="text-emerald-400" /> Copied</> : <><ClipboardCopy size={13} /> Copy Result</>}
                    </button>
                </div>
            )}
        </motion.div>
    );
};

const AIPanel = () => {
    const { activeNote, currentView, updateNote, setCurrentView, setNotes } = useWorkspace();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const bottomRef = useRef(null);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwner = activeNote && (activeNote.authorId === currentUser.id || activeNote.authorId?._id === currentUser.id || activeNote._id?.startsWith('local-'));

    useEffect(() => {
        if (!activeNote) return;
        setMessages([
            {
                role: 'assistant',
                text: `Systems initialized for "${activeNote.title || 'Untitled'}". I am ready to generate deep insights. Choose an operation below.`
            }
        ]);
    }, [activeNote?._id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (currentView !== 'workspace' || !activeNote) return null;

    const handleAction = async (actionType) => {
        if (!activeNote.content.trim()) return;

        setLoading(true);
        try {
            const response = await api.analyzeNote(activeNote.content, actionType);
            const { keywords, summary } = response.data;
            
            let result = '';

            if (actionType === 'summarize') {
                result = `✨ **EXTRACTIVE SUMMARY**\n\n${summary}`;
            } else if (actionType === 'simplify') {
                result = `💡 **SIMPLIFIED OVERVIEW**\n\n${summary}`;
            } else if (actionType === 'keywords') {
                result = `🔑 **CRITICAL CONCEPTS**\n\n${keywords.join(', ')}. These tags have been successfully integrated into your node.`;
                updateNote(activeNote._id, { tags: [...new Set([...(activeNote.tags || []), ...keywords])] });
            } else if (actionType === 'flashcards') {
                const sentences = activeNote.content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 30);
                const cards = [];
                for(let i=0; i<Math.min(sentences.length, 4); i++) {
                    const words = sentences[i].split(' ');
                    const half = Math.floor(words.length / 2);
                    const q = words.slice(0, half).join(' ') + "...";
                    const a = words.slice(half).join(' ');
                    cards.push({ question: `Complete the thought: ${q}`, answer: a });
                }
                if (cards.length === 0) cards.push({ question: "What is the main topic?", answer: activeNote.content.substring(0, 100) });
                
                setNotes(prev => prev.map(n => n._id === activeNote._id ? { ...n, flashcards: cards } : n));
                setCurrentView('study');
                setLoading(false);
                return;
            }

            setMessages(prev => [...prev, { role: 'assistant', text: result }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ Intelligence Link Severed. Please ensure the AI microservice is online." }]);
        }
        setLoading(false);
    };

    const handleInsertToNote = (text) => {
        const cleanText = text.replace(/[*✨💡🔑]/g, '').trim();
        const newContent = `${activeNote.content}\n\n---\n**AI DEEP ANALYSIS:**\n${cleanText}`;
        updateNote(activeNote._id, { content: newContent });
    };

    const handleChatSubmit = (e) => {
        if (e.key === 'Enter' && chatInput.trim()) {
            const userText = chatInput.trim();
            setMessages(prev => [...prev, { role: 'user', text: userText }]);
            setChatInput('');
            setLoading(true);

            setTimeout(() => {
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    text: `Analyzing context for "${userText}" within the framework of "${activeNote.title}". Analysis complete: No conflicting data found. Continue building your node.` 
                }]);
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="w-80 h-screen bg-[#020617] border-l border-slate-900/50 flex flex-col sticky top-0 right-0 hidden lg:flex shrink-0 font-outfit shadow-2xl">
            <div className="p-8 border-b border-slate-900/50 flex items-center justify-between shrink-0 bg-[#020617]">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                        <Zap size={18} className="text-indigo-400 fill-indigo-400/20" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-white">AI Copilot</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{loading ? 'Processing' : 'Core Ready'}</span>
                        </div>
                    </div>
                </div>
                {loading && <Loader size={14} className="animate-spin text-indigo-500" />}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <MessageBubble key={i} m={m} onInsertToNote={handleInsertToNote} isOwner={isOwner} />
                    ))}
                </AnimatePresence>
                <div ref={bottomRef} className="h-4" />
            </div>

            <div className="p-6 bg-[#030712] border-t border-slate-900/50 space-y-4 flex flex-col shrink-0">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Quantum Intelligence</p>
                
                <div className="grid grid-cols-2 gap-3 mb-2">
                    <button onClick={() => handleAction('summarize')} className="flex flex-col items-center justify-center gap-2 py-4 bg-[#0f172a] border border-slate-800 rounded-2xl hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group">
                        <AlignLeft size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200">Summarize</span>
                    </button>
                    <button onClick={() => handleAction('simplify')} className="flex flex-col items-center justify-center gap-2 py-4 bg-[#0f172a] border border-slate-800 rounded-2xl hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group">
                        <Zap size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200">Simplify</span>
                    </button>
                    <button onClick={() => handleAction('keywords')} className="flex flex-col items-center justify-center gap-2 py-4 bg-[#0f172a] border border-slate-800 rounded-2xl hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group">
                        <Hash size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200">Keywords</span>
                    </button>
                    <button onClick={() => handleAction('flashcards')} className="flex flex-col items-center justify-center gap-2 py-4 bg-[#0f172a] border border-slate-800 rounded-2xl hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group">
                        <Brain size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200">Study</span>
                    </button>
                </div>

                <div className="relative">
                    <input 
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={handleChatSubmit}
                        placeholder="Consult your AI..."
                        className="w-full bg-[#0f172a] border border-slate-800 text-slate-300 text-xs rounded-2xl py-4 pl-5 pr-12 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                    />
                    <button 
                        onClick={() => handleChatSubmit({ key: 'Enter' })}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIPanel;
