import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader, ClipboardCopy, PenLine, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from '../../context/WorkspaceContext';

// Typewriter effect component — streams text character by character
const TypewriterText = ({ text, onDone }) => {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        let i = 0;
        setDisplayed('');
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayed(prev => prev + text[i]);
                i++;
            } else {
                clearInterval(interval);
                if (onDone) onDone(text);
            }
        }, 18); // speed: 18ms per character
        return () => clearInterval(interval);
    }, [text]);

    return <span>{displayed}<span className="animate-pulse">▌</span></span>;
};

// Single AI message bubble
const MessageBubble = ({ m, onInsertToNote, onCopy, isOwner }) => {
    const [typed, setTyped] = useState(false);
    const [copied, setCopied] = useState(false);
    const isAI = m.role === 'assistant';
    const isStreaming = isAI && m.streaming;

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
            transition={{ duration: 0.25 }}
            className={`rounded-xl text-sm leading-relaxed ${isAI
                ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-100 shadow-lg'
                : 'bg-slate-800/80 text-slate-400 ml-6 px-3 py-2'
                }`}
        >
            {isAI && (
                <div className="flex items-center gap-1.5 px-3 pt-3 pb-1 text-indigo-400/70 text-[10px] font-semibold uppercase tracking-wider">
                    <Sparkles size={10} /> AI Copilot
                </div>
            )}

            <div className={`${isAI ? 'px-3 pb-2' : ''}`}>
                {isStreaming && !typed ? (
                    <TypewriterText text={m.text} onDone={() => setTyped(true)} />
                ) : (
                    <span>{m.text}</span>
                )}
            </div>

            {/* Action buttons — only shown on AI messages after typing is done */}
            {isAI && (isStreaming ? typed : true) && (
                <div className="flex gap-2 px-3 pb-3 mt-2 border-t border-indigo-500/10 pt-2">
                    {isOwner && (
                        <button
                            onClick={() => onInsertToNote && onInsertToNote(m.text)}
                            title="Insert into note"
                            className="flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 transition font-medium"
                        >
                            <PenLine size={12} /> Insert into note
                        </button>
                    )}
                    <button
                        onClick={handleCopy}
                        title="Copy to clipboard"
                        className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition ml-auto"
                    >
                        {copied ? <><CheckCheck size={12} className="text-emerald-400" /> Copied!</> : <><ClipboardCopy size={12} /> Copy</>}
                    </button>
                </div>
            )}
        </motion.div>
    );
};

const WELCOME_MSG = {
    role: 'assistant',
    streaming: false,
    text: 'Hi! I\'m your NexNote AI Copilot. Click a button below to instantly analyze your active note — I\'ll summarize it, extract keywords, and even generate study flashcards!'
};

const AIPanel = () => {
    const { activeNote, currentView, generateAISummary, simplifyText, extractKeywords, updateNote, setCurrentView, setNotes } = useWorkspace();
    const [messages, setMessages] = useState([WELCOME_MSG]);
    const [loading, setLoading] = useState(false);
    const [inserted, setInserted] = useState(false);
    const bottomRef = useRef(null);

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwner = activeNote && (activeNote.authorId === currentUser.id || activeNote.authorId?._id === currentUser.id || activeNote._id?.startsWith('local-'));

    // ✅ Auto-reset Copilot whenever active note changes
    useEffect(() => {
        if (!activeNote) return;
        setLoading(false);
        setInserted(false);
        setMessages([
            WELCOME_MSG,
            {
                role: 'assistant',
                streaming: false,
                text: `📄 Note loaded: "${activeNote.title || 'Untitled Note'}"\n\nReady to analyze! Use the Quick Actions below to summarize, simplify, extract keywords, or generate flashcards for this note.`
            }
        ]);
    }, [activeNote?._id]); // Only fires when the note ID changes

    // Auto-scroll to latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (currentView !== 'workspace' || !activeNote) return null;

    const handleAction = async (actionType) => {
        if (!activeNote.content.trim()) {
            setMessages(prev => [
                ...prev,
                { role: 'user', text: 'Analyze this note for me.' },
                { role: 'assistant', streaming: false, text: 'Your note is empty! Start writing something and I\'ll get to work.' }
            ]);
            return;
        }

        const userMessages = {
            summarize: 'Please summarize this note for me.',
            simplify: 'Simplify this note into simple concepts.',
            keywords: 'Extract the most important keywords from this note.',
            flashcards: 'Generate study flashcards from this note.'
        };

        setMessages(prev => [...prev, { role: 'user', text: userMessages[actionType] }]);
        setLoading(true);

        try {
            let result = '';

            if (actionType === 'summarize') {
                const content = activeNote.content.trim();
                const title = activeNote.title || 'this note';

                // Extract top keywords
                const words = content.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
                const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'is', 'are', 'was', 'were', 'of', 'that', 'this', 'with', 'it', 'as', 'be', 'by', 'not', 'from', 'have', 'has', 'i', 'you', 'we', 'they', 'he', 'she', 'its', 'their', 'our', 'my', 'your', 'also', 'just', 'very', 'more', 'into', 'about', 'can', 'will', 'do', 'does', 'did', 'been', 'which', 'when', 'where', 'how', 'what', 'who']);
                const freq = {};
                words.forEach(w => { if (!stopWords.has(w) && w.length > 3) freq[w] = (freq[w] || 0) + 1; });
                const topConcepts = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) => w);

                // Get the first meaningful sentence as context
                const firstSentence = content.split(/(?<=[.!?])\s+/).find(s => s.trim().length > 20)?.trim() || content.slice(0, 120);

                // ✅ BUILD a new summary — don't copy sentences, compose from concepts
                const c1 = topConcepts[0] || title;
                const c2 = topConcepts[1] || '';
                const c3 = topConcepts.slice(2, 5).join(', ');

                const line1 = `This note on "${title}" focuses on ${c1}${c2 ? ` and ${c2}` : ''}.`;
                const line2 = firstSentence.endsWith('.') ? firstSentence : firstSentence + '.';
                const line3 = c3 ? `Other key topics covered include ${c3}.` : '';

                result = `\uD83D\uDCDD Summary\n\n${[line1, line2, line3].filter(Boolean).join(' ')}`;



            } else if (actionType === 'simplify') {
                const content = activeNote.content.trim();

                // Word simplification map — complex → simple English
                const simplifyMap = {
                    'utilize': 'use', 'utilizes': 'uses', 'utilized': 'used', 'utilizing': 'using',
                    'implement': 'build', 'implementation': 'setup', 'implementations': 'setups',
                    'demonstrate': 'show', 'demonstrates': 'shows', 'demonstrated': 'showed',
                    'endeavour': 'try', 'endeavor': 'try', 'approximately': 'about',
                    'subsequently': 'then', 'consequently': 'so', 'furthermore': 'also',
                    'nevertheless': 'but', 'notwithstanding': 'despite', 'commence': 'start',
                    'commences': 'starts', 'commenced': 'started', 'terminate': 'end',
                    'terminates': 'ends', 'terminated': 'ended', 'obtain': 'get',
                    'obtains': 'gets', 'obtained': 'got', 'facilitate': 'help',
                    'facilitates': 'helps', 'facilitated': 'helped', 'comprehend': 'understand',
                    'comprehends': 'understands', 'comprehended': 'understood',
                    'sufficient': 'enough', 'insufficient': 'not enough', 'numerous': 'many',
                    'required': 'needed', 'require': 'need', 'requires': 'needs',
                    'however': 'but', 'therefore': 'so', 'additionally': 'also',
                    'specifically': 'exactly', 'particularly': 'especially',
                    'significant': 'important', 'significantly': 'greatly',
                    'functionality': 'feature', 'functionalities': 'features',
                    'parameter': 'setting', 'parameters': 'settings',
                    'individual': 'person', 'individuals': 'people',
                    'component': 'part', 'components': 'parts',
                    'construct': 'build', 'constructs': 'builds', 'constructed': 'built',
                };

                // Rewrite each sentence with simpler words + break long sentences
                const sentences = content.split(/(?<=[.!?])\s+/).filter(s => s.trim());
                const simplified = sentences.map(sentence => {
                    let s = sentence.trim();
                    // Replace complex words
                    s = s.replace(/\b(\w+)\b/g, (word) => {
                        const lower = word.toLowerCase();
                        const replacement = simplifyMap[lower];
                        if (!replacement) return word;
                        // preserve original capitalisation
                        return word[0] === word[0].toUpperCase()
                            ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
                            : replacement;
                    });
                    return s;
                }).join(' ');

                result = `✨ Simplified Version\n\n${simplified}`;

            } else if (actionType === 'keywords') {
                const words = activeNote.content.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
                const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'is', 'are', 'was', 'were', 'of', 'that', 'this', 'with', 'it', 'as', 'be', 'by', 'not', 'from', 'have', 'has']);
                const freq = {};
                words.forEach(w => { if (!stopWords.has(w) && w.length > 4) freq[w] = (freq[w] || 0) + 1; });
                const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([w]) => w);
                result = `🔑 Top Keywords Extracted:\n\n${topWords.map(k => `• ${k}`).join('\n')}\n\nThese terms were automatically added as tags to your note!`;
                updateNote(activeNote._id, { tags: [...new Set([...(activeNote.tags || []), ...topWords.slice(0, 4)])] });

            } else if (actionType === 'flashcards') {
                const content = activeNote.content.trim();
                const title = activeNote.title || 'this topic';

                // Helper: Fisher-Yates shuffle for randomness every generation
                const shuffle = (arr) => {
                    const a = [...arr];
                    for (let i = a.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [a[i], a[j]] = [a[j], a[i]];
                    }
                    return a;
                };

                // Split content into meaningful sentences
                const allSentences = content
                    .split(/(?<=[.!?])\s+/)
                    .map(s => s.trim())
                    .filter(s => s.length > 20 && s.split(/\s+/).length > 4);

                // Shuffle sentences → different cards each time
                const sentences = shuffle(allSentences);

                // Extract key concepts
                const words = content.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
                const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'is', 'are', 'was', 'were', 'of', 'that', 'this', 'with', 'it', 'as', 'be', 'by', 'not', 'from', 'have', 'has', 'i', 'you', 'we', 'they', 'he', 'she', 'its', 'their', 'our', 'my', 'your', 'can', 'will', 'do', 'does', 'did', 'also', 'just', 'very', 'more', 'than', 'into', 'about']);
                const freq = {};
                words.forEach(w => { if (!stopWords.has(w) && w.length > 4) freq[w] = (freq[w] || 0) + 1; });

                // Shuffle concepts for variety each time
                const topConcepts = shuffle(
                    Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([w]) => w)
                );

                // Varied question templates — randomly pick one per concept
                const questionTemplates = [
                    (concept) => `What does "${title}" explain about "${concept}"?`,
                    (concept) => `How is the concept of "${concept}" described in this note?`,
                    (concept) => `Define "${concept}" based on the content of this note.`,
                    (concept) => `What role does "${concept}" play in "${title}"?`,
                    (concept) => `Explain "${concept}" as mentioned in your notes.`,
                    (concept) => `What key insight about "${concept}" is covered here?`,
                    (concept) => `How would you describe "${concept}" using this note?`,
                    (concept) => `What is significant about "${concept}" in this context?`,
                ];

                // Opening card templates — randomized
                const openingTemplates = shuffle([
                    { question: `What is the main topic covered in "${title}"?`, answer: allSentences[0] || content.slice(0, 150) },
                    { question: `Summarize what "${title}" is primarily about.`, answer: allSentences[0] || content.slice(0, 150) },
                    { question: `What is the core idea behind "${title}"?`, answer: allSentences[0] || content.slice(0, 150) },
                ]);

                // Build flashcards from actual content
                const newCards = [];
                const usedSentences = new Set();

                // Card 1: Randomized opening card
                newCards.push(openingTemplates[0]);
                if (allSentences[0]) usedSentences.add(allSentences[0]);

                // Cards 2+: Generate from shuffled concepts with random question templates
                for (const concept of topConcepts) {
                    if (newCards.length >= 8) break;
                    const relatedSentence = sentences.find(s => s.toLowerCase().includes(concept) && !usedSentences.has(s));
                    if (relatedSentence) {
                        const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
                        newCards.push({ question: template(concept), answer: relatedSentence });
                        usedSentences.add(relatedSentence);
                    }
                }

                // Guarantee minimum 3 unique cards using unused sentences
                for (const s of sentences) {
                    if (newCards.length >= 3) break;
                    if (!usedSentences.has(s)) {
                        const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
                        newCards.push({ question: template(topConcepts[newCards.length] || title), answer: s });
                        usedSentences.add(s);
                    }
                }

                // Final fallback if content is very short
                if (newCards.length < 3) {
                    newCards.push({
                        question: `Why is understanding "${topConcepts[0] || title}" important?`,
                        answer: `Based on the note, "${topConcepts[0] || title}" is a foundational concept that forms the basis of the topic discussed.`
                    });
                }

                result = `🧠 ${newCards.length} Unique Flashcards for "${title}"!\n\n${newCards.map((c, i) => `Q${i + 1}: ${c.question}\n✅ A: ${c.answer}`).join('\n\n')}\n\nOpening Study Decks now...`;

                // ✅ REPLACE flashcards for this note (not append) so they stay fresh
                const mergedFlashcards = newCards; // Replace, not [...old, ...new]
                setNotes(prev => prev.map(n =>
                    n._id === activeNote._id ? { ...n, flashcards: mergedFlashcards } : n
                ));

                // ✅ Also persist immediately to backend (not debounced)
                try {
                    const { api } = await import('../../services/api');
                    await api.updateNote(activeNote._id, { flashcards: mergedFlashcards });
                } catch (e) {
                    console.warn('Flashcard save to backend failed (local state is OK):', e);
                }

                // ✅ Navigate to Study Decks immediately
                setCurrentView('study');
            }

            setMessages(prev => [...prev, { role: 'assistant', streaming: true, text: result }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', streaming: false, text: 'Something went wrong. Please try again.' }]);
        }
        setLoading(false);
    };

    // Insert AI result into the note at the bottom
    const handleInsertToNote = (text) => {
        const cleanText = text.replace(/[📝✨🔑🧠]/g, '').trim();
        const newContent = `${activeNote.content}\n\n---\n**AI Generated:**\n${cleanText}`;
        updateNote(activeNote._id, { content: newContent });
        setInserted(true);
        setTimeout(() => setInserted(false), 3000);
    };

    return (
        <div className="w-96 h-screen bg-[#151E2E] border-l border-slate-700/50 flex flex-col sticky top-0 right-0 hidden lg:flex shrink-0">
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-accent animate-pulse" />
                    <h3 className="font-semibold text-sm">AI Copilot</h3>
                </div>
                <div className="flex items-center gap-2">
                    {inserted && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1"
                        >
                            <CheckCheck size={12} /> Inserted!
                        </motion.span>
                    )}
                    {loading && <Loader size={14} className="animate-spin text-slate-400" />}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <MessageBubble
                            key={i}
                            m={m}
                            onInsertToNote={handleInsertToNote}
                            isOwner={isOwner}
                        />
                    ))}
                </AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 px-3 py-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl"
                    >
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-slate-400">AI is thinking...</span>
                    </motion.div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-slate-700/50 bg-[#111827] shrink-0">
                {isOwner ? (
                    <>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-3">Quick Actions</p>
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                onClick={() => handleAction('summarize')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-sm font-medium hover:bg-indigo-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-left"
                            >
                                📝 Summarize Note
                            </button>
                            <button
                                onClick={() => handleAction('simplify')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-left"
                            >
                                ✨ Simplify Concepts
                            </button>
                            <button
                                onClick={() => handleAction('keywords')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-left"
                            >
                                🔑 Extract Keywords
                            </button>
                            <button
                                onClick={() => handleAction('flashcards')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/20 text-amber-300 border border-purple-500/30 rounded-lg text-sm font-medium hover:bg-amber-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-left"
                            >
                                🧠 Generate Flashcards
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <p className="text-[10px] text-slate-500 uppercase font-bold text-center">Read Only View</p>
                        <p className="text-[11px] text-slate-400 mt-1 text-center leading-tight">AI Analysis is only available for your private workspace notes.</p>
                        <button
                            onClick={() => setCurrentView('explore')}
                            className="w-full mt-3 py-1.5 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 rounded-md text-[10px] uppercase font-bold hover:bg-indigo-600/30 transition"
                        >
                            Find more insights
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIPanel;
