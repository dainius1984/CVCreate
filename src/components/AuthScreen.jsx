import React, { useEffect, useRef, useState } from 'react';

const AuthScreen = ({
  authLoading,
  cloudError,
  onEmailLogin,
  onGoogleLogin,
  onContinueWithoutAccount,
  supabaseConfigured,
}) => {
  const [email, setEmail] = useState('');
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const videoSources = ['/video/1.mp4', '/video/2.mp4'];

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = 0.75; // slower playback
  }, [videoIndex]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950">
      <div className="absolute inset-0">
        <video
          key={videoSources[videoIndex]}
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={() => setVideoIndex((prev) => (prev + 1) % videoSources.length)}
          onLoadedMetadata={() => {
            if (videoRef.current) videoRef.current.playbackRate = 0.75;
          }}
          className="w-full h-full object-cover grayscale brightness-[0.38] contrast-110 blur-[9px] scale-105"
        >
          <source src={videoSources[videoIndex]} type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white/92 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-white/80">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">CVCreate Cloud</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Login / Signup</h1>
            <p className="text-sm text-gray-700 mt-2">
              Sign in with Google or get a magic link by email to store and manage your CV versions.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <button
              type="button"
              onClick={() => onEmailLogin(email)}
              disabled={authLoading || !supabaseConfigured}
              className="w-full px-3 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {authLoading ? 'Sending link...' : 'Send email login link'}
            </button>

            <button
              type="button"
              onClick={onGoogleLogin}
              disabled={authLoading || !supabaseConfigured}
              className="w-full px-3 py-2.5 rounded-lg bg-gray-900 text-white font-semibold hover:bg-black disabled:opacity-60"
            >
              Continue with Google
            </button>

            <button
              type="button"
              onClick={onContinueWithoutAccount}
              className="w-full px-3 py-2.5 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
            >
              Continue without account
            </button>
          </div>

          {!supabaseConfigured ? (
            <p className="text-sm text-red-700 mt-4 font-medium">Supabase env not configured.</p>
          ) : null}
          {cloudError ? <p className="text-sm text-red-700 mt-3">{cloudError}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;

