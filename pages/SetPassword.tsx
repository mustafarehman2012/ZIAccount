import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, LockKeyhole, Mail, AlertTriangle, Loader2 } from 'lucide-react';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { UserContext } from '../types';
import { supabase } from '../lib/supabaseClient';

interface SetPasswordProps {
  onSuccess: () => void;
}

export const SetPassword: React.FC<SetPasswordProps> = ({ onSuccess }) => {
  // State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [userContext, setUserContext] = useState<UserContext>({ email: '', token: null });
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Derived State
  const passwordsMatch = password === confirmPassword;
  const isStrongEnough = 
    password.length >= 8 && 
    /\d/.test(password) && 
    /[A-Z]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  const isValid = isStrongEnough && passwordsMatch && confirmPassword.length > 0;

  // Initialize Supabase session check
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      // 1. Check if we already have a session (e.g. redirected with hash)
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session check error:", error);
        if (mounted) {
          setGlobalError("Unable to verify security tokens.");
          setIsVerifying(false);
        }
        return;
      }

      if (session?.user?.email) {
        if (mounted) {
          setUserContext({
            email: session.user.email,
            token: session.access_token,
          });
          setIsVerifying(false);
        }
      } else {
        // No immediate session. If URL has hash, Supabase might still be processing.
        // If no hash and no session, it's definitely invalid.
        if (!window.location.hash || !window.location.hash.includes('access_token')) {
             if (mounted) {
                // Fallback for demo: if query params have email/token (custom flow)
                // But generally for Supabase we need the hash or active session
                // We'll show error if no session found.
                setGlobalError("Invalid or expired password reset link.");
                setIsVerifying(false);
             }
        }
      }
    };

    checkSession();

    // 2. Listen for auth changes (this handles the moment the hash is processed)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
        if (session?.user?.email && mounted) {
           setUserContext({
            email: session.user.email,
            token: session.access_token,
          });
          setIsVerifying(false);
          setGlobalError(null); // Clear any previous errors
        }
      } else if (event === 'SIGNED_OUT') {
         if (mounted && !globalError) {
             // If we were not already showing an error, this might mean the session is invalid
         }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    setGlobalError(null);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        throw error;
      }
      
      onSuccess();
    } catch (err: any) {
      setGlobalError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in p-12 text-center border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-slate-900">Verifying security link...</h2>
      </div>
    );
  }

  if (globalError) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Link Expired</h2>
        <p className="text-slate-600 mb-6">
          {globalError}
        </p>
        <p className="text-sm text-slate-500 mb-6">
          Please request a new password reset email.
        </p>
        <Button onClick={() => window.location.href = '/'} fullWidth variant="outline">
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up border border-slate-100">
      {/* Header Decoration */}
      <div className="h-2 bg-gradient-to-r from-primary-500 to-indigo-600 w-full" />
      
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 text-primary-600 mb-4 ring-4 ring-primary-50/50">
            <LockKeyhole className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Set New Password
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Please create a new password for <br/>
            <span className="font-medium text-slate-700 flex items-center justify-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" />
              {userContext.email}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <InputField
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (confirmPassword) setIsDirty(true);
              }}
              autoComplete="new-password"
            />
            
            <PasswordStrengthMeter password={password} />
          </div>

          <div>
            <InputField
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setIsDirty(true);
              }}
              error={isDirty && confirmPassword && !passwordsMatch ? "Passwords do not match" : undefined}
              success={isDirty && passwordsMatch && isValid}
              autoComplete="new-password"
            />
          </div>

          <Button 
            type="submit" 
            fullWidth 
            disabled={!isValid}
            isLoading={isLoading}
            className="mt-2"
          >
            Reset Password
          </Button>
        </form>
      </div>
      
      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
        <a href="#" className="text-xs text-slate-500 hover:text-primary-600 font-medium transition-colors flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Secure 256-bit SSL Encrypted
        </a>
      </div>
    </div>
  );
};