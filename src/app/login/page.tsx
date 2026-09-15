'use client';

import React, { useState } from 'react';
import { Sparkles, Phone, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('password');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (!identifier) {
        throw new Error('Please enter your mobile number or email.');
      }

      const emailVal = identifier.includes('@') ? identifier : `${identifier}@anant.app`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailVal,
        password: password || 'AnantDevotee2026!',
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-amber-500" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500/10 text-amber-400 rounded-full mb-4 border border-amber-500/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your Anant Spiritual Account</p>
        </div>

        {success ? (
          <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-emerald-200">Login Successful!</h3>
            <p className="text-slate-300 text-sm mt-2">Redirecting to your spiritual sanctuary...</p>
            <a
              href="/"
              className="mt-6 inline-block bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold px-6 py-2.5 rounded-xl transition"
            >
              Open Anant App
            </a>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            {errorMsg && (
              <div className="bg-rose-950/50 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-sm">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Mobile Number or Email <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="+91 98765 43210 or email"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {loginMethod === 'password' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
                className="text-amber-400 hover:underline"
              >
                {loginMethod === 'password' ? 'Login with WhatsApp OTP instead' : 'Login with Password'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                New to Anant?{' '}
                <a href="/register" className="text-amber-400 hover:underline font-medium">
                  Create an account
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
