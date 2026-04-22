import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, ArrowLeft, RotateCw, CheckCircle2, XCircle, BookOpen, Layers } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

const StudyMode = () => {
    const { notes } = useWorkspace();
    const [cardIndex, setCardIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [filterNoteId, setFilterNoteId] = useState('all');
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });

    // ─── LIVE SYNC: Derive flashcards directly from notes context ────────────────
    // This means: note added → new cards appear, note deleted → cards removed,
    // note flashcards regenerated → cards update — ALL automatically.
    const notesWithCards = notes?.filter(n => n.flashcards && n.flashcards.length > 0) || [];

    const allFlashcards = notesWithCards.flatMap(n =>
        n.flashcards.map(fc => ({
            noteId: n._id,
            noteTitle: n.title || 'Untitled Note',
            q: fc.question || fc.q || 'Question unavailable',
            a: fc.answer || fc.a || 'Answer unavailable',
        }))
    );

    // Filter by selected note
    const displayCards = filterNoteId === 'all'
        ? allFlashcards
        : allFlashcards.filter(fc => fc.noteId === filterNoteId);

    const hasCards = displayCards.length > 0;
    const currentCard = displayCards[cardIndex] || null;

    // ─── Reset card index when filter or note list changes ───────────────────────
    useEffect(() => {
        setCardIndex(0);
        setFlipped(false);
    }, [filterNoteId, notes]);

    // ─── Clamp index if cards shrink (e.g., note deleted) ────────────────────────
    useEffect(() => {
        if (cardIndex >= displayCards.length && displayCards.length > 0) {
            setCardIndex(displayCards.length - 1);
            setFlipped(false);
        }
    }, [displayCards.length]);

    const handleNext = () => {
        setFlipped(false);
        setTimeout(() => setCardIndex(prev => (prev + 1) % displayCards.length), 150);
    };

    const handlePrev = () => {
        setFlipped(false);
        setTimeout(() => setCardIndex(prev => (prev - 1 + displayCards.length) % displayCards.length), 150);
    };

    const handleCorrect = () => {
        setScore(s => ({ ...s, correct: s.correct + 1 }));
        handleNext();
    };

    const handleIncorrect = () => {
        setScore(s => ({ ...s, incorrect: s.incorrect + 1 }));
        handleNext();
    };

    return (
        <div className="flex-1 bg-background h-full overflow-y-auto flex flex-col items-center p-4 md:p-10 w-full border-r border-slate-700/50 pb-20 md:pb-10">

            {/* Header */}
            <div className="w-full max-w-2xl mb-8">
                <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                    <Brain className="text-accent" /> AI Study Mode
                </h2>
                <p className="text-slate-400 text-sm">Flashcards auto-sync with your notes. Add, update, or delete notes and cards update instantly.</p>
            </div>

            {/* Note Filter Tabs */}
            <div className="w-full max-w-2xl mb-6 flex flex-wrap gap-2">
                <button
                    onClick={() => setFilterNoteId('all')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${filterNoteId === 'all' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                >
                    <Layers size={12} /> All Notes ({allFlashcards.length} cards)
                </button>
                {notesWithCards.map(n => (
                    <button
                        key={n._id}
                        onClick={() => setFilterNoteId(n._id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${filterNoteId === n._id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                    >
                        <BookOpen size={12} />
                        {n.title?.slice(0, 20) || 'Untitled'} ({n.flashcards.length})
                    </button>
                ))}
            </div>

            {/* Score tracker */}
            {(score.correct + score.incorrect) > 0 && (
                <div className="w-full max-w-2xl mb-4 flex gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <CheckCircle2 size={14} /> {score.correct} Correct
                    </span>
                    <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                        <XCircle size={14} /> {score.incorrect} Incorrect
                    </span>
                </div>
            )}

            {/* No cards fallback */}
            {!hasCards ? (
                <div className="w-full max-w-2xl flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                        <Brain size={32} className="text-slate-600" />
                    </div>
                    <h3 className="text-white font-semibold text-xl mb-2">No Flashcards Yet</h3>
                    <p className="text-slate-400 text-sm max-w-sm">
                        {filterNoteId === 'all'
                            ? 'Open a note in Workspace and click "🧠 Generate Flashcards" in the AI Copilot.'
                            : 'This note has no flashcards. Regenerate them from the AI Copilot.'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Note source label */}
                    {currentCard && (
                        <p className="w-full max-w-2xl text-xs text-slate-500 mb-2 flex items-center gap-1">
                            <BookOpen size={11} /> From: <span className="text-indigo-400 font-medium">{currentCard.noteTitle}</span>
                        </p>
                    )}

                    {/* Flashcard */}
                    <div className="w-full max-w-2xl" style={{ minHeight: '280px', position: 'relative' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={cardIndex + (flipped ? '-back' : '-front')}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className={`w-full p-10 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center cursor-pointer border transition-colors ${flipped
                                        ? 'bg-indigo-900/80 border-indigo-600/50 text-indigo-100'
                                        : 'bg-slate-800 border-slate-700/50 text-white'
                                    }`}
                                onClick={() => setFlipped(f => !f)}
                                style={{ minHeight: '260px' }}
                            >
                                <span className={`text-xs font-bold uppercase tracking-widest mb-5 ${flipped ? 'text-indigo-400' : 'text-slate-500'}`}>
                                    {flipped ? '✅ Answer' : '❓ Question'}
                                </span>
                                <p className="text-xl font-medium leading-relaxed">
                                    {flipped ? currentCard.a : currentCard.q}
                                </p>
                                {!flipped && (
                                    <p className="absolute bottom-6 text-xs text-slate-600 flex items-center gap-1">
                                        <RotateCw size={12} /> Click to reveal answer
                                    </p>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="mt-8 flex items-center gap-4">
                        <button onClick={handlePrev} className="p-3 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition">
                            <ArrowLeft size={20} />
                        </button>

                        {flipped && (
                            <>
                                <button onClick={handleIncorrect} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition font-medium text-sm">
                                    <XCircle size={16} /> Wrong
                                </button>
                                <button onClick={handleCorrect} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition font-medium text-sm">
                                    <CheckCircle2 size={16} /> Got it!
                                </button>
                            </>
                        )}

                        <button onClick={handleNext} className="p-3 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition">
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <p className="text-slate-500 text-sm mt-6">Card {cardIndex + 1} of {displayCards.length}</p>
                </>
            )}
        </div>
    );
};

export default StudyMode;
