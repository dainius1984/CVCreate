import React from 'react';

const CloudCVPanel = ({
  user,
  authLoading,
  cloudLoading,
  cloudError,
  savedCVs,
  selectedCVId,
  onEmailLogin,
  onGoogleLogin,
  onLogout,
  onSaveCurrent,
  onSaveAsNew,
  onLoadCV,
  onDeleteCV,
  onDuplicateCV,
  disabled,
}) => {
  return (
    <div className="mb-6 p-4 rounded-xl border border-gray-200 bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">My CV Library</h2>
      <p className="text-xs text-gray-500 mb-2">Save role-specific versions and reopen them anytime.</p>

      {!user ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Sign in to save CVs and track job applications.</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onEmailLogin}
              disabled={authLoading || disabled}
              className="px-3 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {authLoading ? 'Sending link...' : 'Continue with Email'}
            </button>
            <button
              type="button"
              onClick={onGoogleLogin}
              disabled={authLoading || disabled}
              className="px-3 py-2 rounded bg-gray-800 text-white text-sm font-medium hover:bg-black disabled:opacity-60"
            >
              Continue with Google
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-gray-700">
              Signed in as <span className="font-semibold">{user.email}</span>
            </p>
            <button
              type="button"
              onClick={onLogout}
              disabled={authLoading}
              className="px-3 py-1.5 rounded bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 disabled:opacity-60"
            >
              Sign out
            </button>
          </div>

          <button
            type="button"
            onClick={onSaveCurrent}
            disabled={cloudLoading || !selectedCVId}
            className="px-3 py-2 rounded bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
          >
            {cloudLoading ? 'Saving...' : 'Update current CV'}
          </button>

          <button
            type="button"
            onClick={onSaveAsNew}
            disabled={cloudLoading}
            className="px-3 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {cloudLoading ? 'Saving...' : 'Save new CV version'}
          </button>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Saved CVs</p>
            {savedCVs.length === 0 ? (
              <p className="text-sm text-gray-500">No saved CVs yet.</p>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
                {savedCVs.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onLoadCV(item.id)}
                    className={`bg-white border rounded p-2 ${
                      selectedCVId === item.id ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200'
                    } cursor-pointer hover:border-blue-300`}
                  >
                    <div className="min-w-0 mb-2">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.position_name || item.title || 'Untitled CV'}
                      </p>
                      {item.job_url ? (
                        <a
                          href={item.job_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline block break-all"
                        >
                          {item.job_url}
                        </a>
                      ) : null}
                      {item.job_description ? (
                        selectedCVId === item.id ? (
                          <p className="text-xs text-gray-700 mt-2 whitespace-pre-line max-h-40 overflow-auto pr-1 bg-gray-50 border border-gray-200 rounded p-2">
                            {item.job_description}
                          </p>
                        ) : (
                          <p
                            className="text-xs text-gray-600 mt-1 overflow-hidden"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {item.job_description}
                          </p>
                        )
                      ) : (
                        <p className="text-xs text-gray-400 mt-1 italic">No job description saved.</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(item.updated_at || item.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoadCV(item.id);
                        }}
                        className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200"
                      >
                        {selectedCVId === item.id ? 'Opened' : 'Open'}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateCV(item.id);
                        }}
                        className="px-2 py-1 rounded bg-violet-100 text-violet-700 text-xs font-medium hover:bg-violet-200"
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCV(item.id);
                        }}
                        className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {cloudError ? <p className="text-sm text-red-600 mt-3">{cloudError}</p> : null}
    </div>
  );
};

export default CloudCVPanel;

