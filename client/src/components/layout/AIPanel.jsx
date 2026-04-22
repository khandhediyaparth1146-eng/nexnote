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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group p-4 rounded-2xl text-sm leading-relaxed transition-all ${
                isAI
                ? 'bg-slate-900 border border-slate-800 text-slate-200'
                : 'bg-indigo-600/10 border border-indigo-600/20 text-indigo-300 ml-6'
            }`}
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
        >
            <div className="flex items-center gap-2 mb-2">
                {isAI ? <Sparkles size={12} className="text-indigo-400" /> : <div className="w-1 h-1 rounded-full bg-indigo-500" />}
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
                    {isAI ? 'Nex AI' : 'You'}
                </span>
            </div>

            <div className="whitespace-pre-wrap">{m.text}</div>

            {isAI && (
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isOwner && (
                        <button
                            onClick={() => onInsertToNote && onInsertToNote(m.text)}
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition"
                        >
                            <PenLine size={12} /> Insert
                        </button>
                    )}
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-white transition ml-auto"
                    >
                        {copied ? <><CheckCheck size={12} className="text-emerald-400" /> Copied</> : <><ClipboardCopy size={12} /> Copy</>}
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
                text: `Ready to analyze "${activeNote.title || 'Untitled'}"! Choose a quick action below to get started.`
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
            // Call AI Microservice
            const response = await api.analyzeNote(activeNote.content);
            const { keywords, summary } = response.data;
            
            let result = '';

            if (actionType === 'summarize') {
                result = `📝 ${summary}`;
            } else if (actionType === 'simplify') {
                result = `✨ Simplified perspective:\n${summary}`;
            } else if (actionType === 'keywords') {
                result = `🔑 Key terms detected: ${keywords.join(', ')}. These have been added to your note tags.`;
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
            setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ AI service is offline. Using local fallback..." }]);
            // Fallback to local logic (kept simple)
            const fallbackSummary = `Summary: ${activeNote.content.substring(0, 100)}...`;
            setMessages(prev => [...prev, { role: 'assistant', text: fallbackSummary }]);
        }
        setLoading(false);
    };

    const handleInsertToNote = (text) => {
        const cleanText = text.replace(/[📝✨🔑🧠]/g, '').trim();
        const newContent = `${activeNote.content}\n\n---\n**AI Analysis:**\n${cleanText}`;
        updateNote(activeNote._id, { content: newContent });
    };

    const handleChatSubmit = (e) => {
        if (e.key === 'Enter' && chatInput.trim()) {
            const userText = chatInput.trim();
            setMessages(prev => [...prev, { role: 'user', text: userText }]);
            setChatInput('');
            setLoading(true);

            // Mock AI chat response (since real LLM isn't available)
            setTimeout(() => {
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    text: `Based on your note "${activeNote.title}", I found some context regarding "${userText}". Keep adding details to your note so I can assist you further!` 
                }]);
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="w-80 h-screen bg-[#020617] border-l border-slate-900 flex flex-col sticky top-0 right-0 hidden lg:flex shrink-0 font-outfit">
            <div className="p-6 border-b border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-indigo-400 fill-indigo-400/20" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">AI Copilot</h3>
                </div>
                {loading && <Loader size={14} className="animate-spin text-indigo-500" />}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ overflowY: 'scroll', minHeight: 0 }}>
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <MessageBubble key={i} m={m} onInsertToNote={handleInsertToNote} isOwner={isOwner} />
                    ))}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>

            <div className="p-6 bg-[#030712] border-t border-slate-900 space-y-4 flex flex-col">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Quick Intelligence</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <button 
                        onClick={() => handleAction('summarize')}
                        className="flex flex-col items-start gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-all group"
                    >
                        <AlignLeft size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-slate-300">Summarize</span>
                    </button>
                    <button 
                        onClick={() => handleAction('simplify')}
                        className="flex flex-col items-start gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-purple-500/50 transition-all group"
                    >
                        <Zap size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-slate-300">Simplify</span>
                    </button>
                    <button 
                        onClick={() => handleAction('keywords')}
                        className="flex flex-col items-start gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-all group"
                    >
                        <Hash size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-slate-300">Keywords</span>
                    </button>
                    <button 
                        onClick={() => handleAction('flashcards')}
                        className="flex flex-col items-start gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-amber-500/50 transition-all group"
                    >
                        <Brain size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-slate-300">Study</span>
                    </button>
                </div>

                <div className="relative mt-2">
                    <input 
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={handleChatSubmit}
                        placeholder="Ask your brain..."
                        className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button 
                        onClick={() => handleChatSubmit({ key: 'Enter' })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIPanel;
