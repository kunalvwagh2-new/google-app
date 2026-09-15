'use client';

import React, { useState } from 'react';
import { Sparkles, Shield, User as UserIcon, Building2, Phone, Mail, MapPin, CheckCircle, Lock, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<'devotee' | 'temple_admin'>('devotee');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [templeName, setTempleName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (!firstName || !lastName || !mobile || !location) {
        throw new Error('Please fill in all mandatory fields.');
      }

      // Register with Supabase Auth or mock fallback
      const { data, error } = await supabase.auth.signUp({
        email: email || `${mobile}@anant.app`,
        password: password || 'AnantDevotee2026!',
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: accountType === 'temple_admin' ? 'TEMPLE_ADMIN' : 'USER',
            mobile_number: mobile,
            location: location,
            gender: gender,
            temple_name: templeName
          }
        }
      });

      if (error) throw error;

      // Also upsert into profiles table
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: email || `${mobile}@anant.app`,
          first_name: firstName,
          last_name: lastName,
          role: accountType === 'temple_admin' ? 'TEMPLE_ADMIN' : 'USER',
          mobile_number: mobile,
          location: location,
          gender: gender,
          temple_name: templeName,
          updated_at: new Date().toISOString()
        });
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-amber-500" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500/10 text-amber-400 rounded-full mb-4 border border-amber-500/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Join Anant Sanctuary</h1>
          <p className="text-slate-400 text-sm mt-1">Sacred Daily Darshan, 108 Jaap Mala & Divine Community</p>
        </div>

        {success ? (
          <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-emerald-200">Registration Successful!</h3>
            <p className="text-slate-300 text-sm mt-2">
              Welcome to Anant, {firstName}. Your profile has been created successfully with role: <span className="font-semibold text-amber-400">{accountType.toUpperCase()}</span>.
            </p>
            <a
              href="/"
              className="mt-6 inline-block bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold px-6 py-2.5 rounded-xl transition"
            >
              Enter Anant Sanctum
            </a>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Account Type Toggle Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setAccountType('devotee')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
                  accountType === 'devotee'
                    ? 'bg-amber-600 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Devotee (Seeker)
              </button>
              <button
                type="button"
                onClick={() => setAccountType('temple_admin')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
                  accountType === 'temple_admin'
                    ? 'bg-amber-600 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Temple Trust Admin
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-950/50 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-sm">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  First Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Ramesh"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Last Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Joshi"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gender <span className="text-amber-400">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mobile Number <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="devotee@anant.app"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Location <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Varanasi, UP"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {accountType === 'temple_admin' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Temple Name / Trust <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required={accountType === 'temple_admin'}
                    value={templeName}
                    onChange={(e) => setTempleName(e.target.value)}
                    placeholder="e.g. Kashi Vishwanath Temple Trust"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                'Registering...'
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Register & Begin Journey
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Already registered?{' '}
                <a href="/login" className="text-amber-400 hover:underline font-medium">
                  Login here
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
