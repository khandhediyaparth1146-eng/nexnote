import React, { useState, useEffect } from 'react';
import { 
    Trash, Globe, Lock, Calendar, Tag, 
    CheckCircle2, Sparkles, Mic, MicOff, Download
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { motion, AnimatePresence } from 'framer-motion';

const Editor = () => {
    const { activeNote, updateNote, deleteNote } = useWorkspace();
    const [tagInput, setTagInput] = useState('');
    const [showCover, setShowCover] = useState(false);
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwner = activeNote && (activeNote.authorId === currentUser.id || activeNote.authorId?._id === currentUser.id || activeNote._id?.startsWith('local-'));

    const handleExport = () => {
        const element = document.createElement('a');
        const file = new Blob([`# ${activeNote.title || 'Untitled'}\n\n${activeNote.content}`], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = `${(activeNote.title || 'Note').replace(/ /g, '_')}.md`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // Web Speech API Setup
    const handleDictation = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Sorry, your browser doesn't support voice dictation.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        if (isListening) {
            recognition.stop();
            setIsListening(false);
            return;
        }

        recognition.onstart = () => setIsListening(true);
        
        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                }
            }
            if (finalTranscript) {
                const newContent = activeNote.content + (activeNote.content.endsWith(' ') ? '' : ' ') + finalTranscript;
                updateNote(activeNote._id, { content: newContent });
            }
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    const handleSlashCommand = (command) => {
        let newContent = activeNote.content.slice(0, -1); // remove slash
        
        if (command === 'heading') newContent += '\n# ';
        else if (command === 'ai-summary') newContent += '\n\n---\n✨ **AI Summary Block**\n---\n';
        else if (command === 'flashcard') newContent += '\n\n**Flashcard**\nQ: \nA: ';
        
        updateNote(activeNote._id, { content: newContent });
        setShowSlashMenu(false);
    };

    if (!activeNote) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#030712] text-slate-600 font-outfit">
                <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center mb-6">
                    <Sparkles size={40} className="text-slate-800" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.3em]">No Node Selected</p>
            </div>
        );
    }

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            const newTags = [...new Set([...(activeNote.tags || []), tagInput.trim()])];
            updateNote(activeNote._id, { tags: newTags });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag) => {
        if (!isOwner) return;
        const newTags = activeNote.tags.filter(t => t !== tag);
        updateNote(activeNote._id, { tags: newTags });
    };

    const toggleVisibility = () => {
        if (!isOwner) return;
        const newVisibility = activeNote.visibility === 'public' ? 'private' : 'public';
        updateNote(activeNote._id, { visibility: newVisibility });
    };

    return (
        <div className="flex-1 flex flex-col bg-[#030712] overflow-hidden font-outfit relative">
            
            <div className="max-w-4xl mx-auto w-full h-full flex flex-col pt-12 md:pt-20 px-4 md:px-8 overflow-y-auto scrollbar-hide">
                
                {/* Magic Cover Area */}
                <AnimatePresence>
                    {showCover && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 200 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="relative w-full md:h-[300px] rounded-3xl md:rounded-[40px] overflow-hidden mb-8 md:mb-12 group shadow-2xl shrink-0"
                        >
                            <img 
                                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
                                alt="Magic Cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
                            <button 
                                onClick={() => setShowCover(false)}
                                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 md:mb-12 shrink-0">
                    <div className="flex items-center gap-3">
                        {isOwner && (
                            <button 
                                onClick={() => setShowCover(true)}
                                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-indigo-600/10 border border-indigo-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-600/5"
                            >
                                <Sparkles size={14} /> <span className="hidden sm:inline">Magic Cover</span>
                            </button>
                        )}
                        {isOwner && (
                            <button 
                                onClick={handleDictation}
                                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    isListening 
                                    ? 'bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse'
                                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400'
                                }`}
                            >
                                {isListening ? <Mic size={14} /> : <MicOff size={14} />} 
                                <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Dictate'}</span>
                            </button>
                        )}
                        {isOwner && (
                            <button 
                                onClick={handleExport}
                                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
                            >
                                <Download size={14} /> <span className="hidden sm:inline">Export</span>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Synced</span>
                        </div>
                        
                        {isOwner && (
                            <button
                                onClick={toggleVisibility}
                                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    activeNote.visibility === 'public'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                                }`}
                            >
                                {activeNote.visibility === 'public' ? <Globe size={14} /> : <Lock size={14} />}
                                <span className="hidden sm:inline">{activeNote.visibility}</span>
                            </button>
                        )}

                        {isOwner && (
                            <button
                                onClick={() => deleteNote(activeNote._id)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                            >
                                <Trash size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col flex-1">
                    {/* Metadata */}
                    <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6 text-slate-600 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] flex-wrap">
                        <Calendar size={12} />
                        <span>{new Date(activeNote.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <div className="w-1 h-1 bg-slate-800 rounded-full" />
                        <span className="text-indigo-500">{activeNote.authorId?.username || 'Private Node'}</span>
                    </div>

                    {/* Title */}
                    <input
                        type="text"
                        value={activeNote.title}
                        disabled={!isOwner}
                        onChange={(e) => updateNote(activeNote._id, { title: e.target.value })}
                        className="w-full text-4xl md:text-6xl font-black bg-transparent border-none outline-none text-white mb-6 md:mb-8 placeholder-slate-900 focus:ring-0 leading-[1.1] tracking-tighter"
                        placeholder="Untitled Node"
                    />

                    {/* Tags */}
                    <div className="flex items-center gap-3 mb-12 flex-wrap">
                        <div className="flex gap-2 flex-wrap">
                            <AnimatePresence>
                                {activeNote.tags?.map(tag => (
                                    <motion.span
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => handleRemoveTag(tag)}
                                        className={`inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900/50 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-800/50 transition-all ${isOwner ? 'hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 cursor-pointer' : ''}`}
                                    >
                                        #{tag}
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </div>
                        
                        {isOwner && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/30 rounded-xl border border-slate-800/50 focus-within:border-indigo-500/50 transition-colors">
                                <Tag size={12} className="text-slate-600" />
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Add Node Label..."
                                    className="bg-transparent border-none text-slate-500 text-[10px] font-black uppercase outline-none w-28 focus:ring-0"
                                />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="relative flex-1 flex flex-col">
                        <textarea
                            value={activeNote.content}
                            disabled={!isOwner}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.endsWith('/')) setShowSlashMenu(true);
                                else setShowSlashMenu(false);
                                updateNote(activeNote._id, { content: val });
                            }}
                            className="w-full h-full min-h-[600px] bg-transparent border-none outline-none text-slate-400 text-xl leading-[2] resize-none focus:ring-0 placeholder-slate-900 font-medium pb-40"
                            placeholder="Commit your intelligence to the node... (Type '/' for commands)"
                        />

                        {/* Notion-Style Slash Menu */}
                        <AnimatePresence>
                            {showSlashMenu && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute bottom-20 left-4 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                                >
                                    <div className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800/50 mb-2">
                                        Advanced Commands
                                    </div>
                                    <button onClick={() => handleSlashCommand('heading')} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-indigo-600/10 rounded-xl text-left transition-colors group">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-600/20">H1</div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-200">Heading 1</div>
                                            <div className="text-[10px] text-slate-500 font-medium">Large section heading</div>
                                        </div>
                                    </button>
                                    <button onClick={() => handleSlashCommand('ai-summary')} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-purple-600/10 rounded-xl text-left transition-colors group">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-purple-400 group-hover:bg-purple-600/20">
                                            <Sparkles size={14} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-200">AI Summary Block</div>
                                            <div className="text-[10px] text-slate-500 font-medium">Insert summary block</div>
                                        </div>
                                    </button>
                                    <button onClick={() => handleSlashCommand('flashcard')} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-amber-600/10 rounded-xl text-left transition-colors group">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-600/20">
                                            <Tag size={14} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-200">Flashcard Block</div>
                                            <div className="text-[10px] text-slate-500 font-medium">Q & A format</div>
                                        </div>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
