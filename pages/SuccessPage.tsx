import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SuccessPage: React.FC = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect logic would go here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up p-8 text-center border border-slate-100">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-[bounce_1s_infinite]">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h2>
      <p className="text-slate-600 mb-8">
        Your password has been successfully updated. You can now log in with your new credentials.
      </p>

      <div className="space-y-4">
        <Button fullWidth onClick={() => window.location.reload()}>
          Go to Login
        </Button>
        
        <p className="text-xs text-slate-400">
          Redirecting automatically in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};