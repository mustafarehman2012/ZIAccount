import React, { useState } from 'react';
import { SetPassword } from './pages/SetPassword';
import { SuccessPage } from './pages/SuccessPage';

const App: React.FC = () => {
  // Simple state-based routing for this specific flow
  // In a larger app, use react-router-dom
  const [view, setView] = useState<'reset' | 'success'>('reset');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-primary-50 to-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background decoration elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl translate-y-1/2" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Brand Logo Placeholder */}
        <div className="mb-8 flex items-center gap-2">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">SecureSet</span>
        </div>

        {/* Content Area */}
        {view === 'reset' && (
          <SetPassword onSuccess={() => setView('success')} />
        )}
        
        {view === 'success' && (
          <SuccessPage />
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-slate-400 text-xs">
          <p>&copy; {new Date().getFullYear()} SecureSet Inc. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;