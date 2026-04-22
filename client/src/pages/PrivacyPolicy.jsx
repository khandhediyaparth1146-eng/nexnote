import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
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
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400">
                        <Shield size={24} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Privacy Policy</h1>
                </div>

                <div className="space-y-8 text-slate-400 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p>We only collect the information necessary to provide you with the NexNote services. This includes your account details, notes, and the knowledge graphs you create. Your data remains strictly yours.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
                        <p>Your notes and text are processed to generate AI summaries, flashcards, and knowledge graphs. We do not sell your personal data or notes to third parties. Our AI models process your data solely for your benefit.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
                        <p>All notes and account details are securely encrypted and stored in our modern database infrastructure. We use industry-standard security measures to prevent unauthorized access.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Contact Information</h2>
                        <p>If you have any questions regarding this privacy policy, please contact us at <strong>khandhediyaparth1146@gmail.com</strong> or call <strong>+91 9825361146</strong>.</p>
                    </section>
                </div>
                
                <div className="mt-20 pt-8 border-t border-slate-800 text-sm text-slate-500 text-center">
                    Last Updated: {new Date().toLocaleDateString()} &copy; NexNote
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
