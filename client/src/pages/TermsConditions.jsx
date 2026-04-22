import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsConditions = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 md:p-16">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold tracking-widest text-sm uppercase mb-12 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>

                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400">
                        <FileText size={24} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Terms & Conditions</h1>
                </div>

                <div className="space-y-8 text-slate-400 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing and using NexNote, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. User Responsibilities</h2>
                        <p>You are responsible for maintaining the confidentiality of your account credentials. You agree not to use the platform for any illegal or unauthorized purpose. All content generated remains your responsibility.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. AI Processing</h2>
                        <p>Our platform uses advanced AI features to analyze and summarize your text. While we strive for high accuracy, NexNote is not responsible for errors in AI-generated summaries, flashcards, or graphs.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Modifications to Service</h2>
                        <p>We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice. We shall not be liable to you or any third party for any modification or discontinuation of the service.</p>
                    </section>
                </div>

                <div className="mt-20 pt-8 border-t border-slate-800 text-sm text-slate-500 text-center">
                    Last Updated: {new Date().toLocaleDateString()} &copy; NexNote
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
