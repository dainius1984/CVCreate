import React, { useState } from 'react';

const AuthScreen = ({
  authLoading,
  cloudError,
  onEmailLogin,
  onGoogleLogin,
  onContinueWithoutAccount,
  supabaseConfigured,
}) => {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Login / Signup</h1>
        <p className="text-sm text-gray-600 mb-5">
          Sign in with Google or get a magic link by email to store CVs in cloud.
        </p>

        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          <button
            type="button"
            onClick={() => onEmailLogin(email)}
            disabled={authLoading || !supabaseConfigured}
            className="w-full px-3 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {authLoading ? 'Sending link...' : 'Send email login link'}
          </button>

          <button
            type="button"
            onClick={onGoogleLogin}
            disabled={authLoading || !supabaseConfigured}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white font-medium hover:bg-black disabled:opacity-60"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={onContinueWithoutAccount}
            className="w-full px-3 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
          >
            Continue without account
          </button>
        </div>

        {!supabaseConfigured ? (
          <p className="text-sm text-red-600 mt-4">Supabase env not configured.</p>
        ) : null}
        {cloudError ? <p className="text-sm text-red-600 mt-3">{cloudError}</p> : null}
      </div>
    </div>
  );
};

export default AuthScreen;

