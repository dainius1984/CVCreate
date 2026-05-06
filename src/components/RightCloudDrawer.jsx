import React, { useMemo, useState } from 'react';
import CloudCVPanel from './CloudCVPanel.jsx';

const RightCloudDrawer = ({
  authUser,
  authLoading,
  cloudLoading,
  cloudError,
  savedCVs,
  selectedCloudCVId,
  onEmailLogin,
  onGoogleLogin,
  onLogout,
  onSaveCurrentCV,
  onSaveAsNewCloudCV,
  onLoadCloudCV,
  onDeleteCloudCV,
  onDuplicateCloudCV,
  supabaseConfigured,
}) => {
  const [open, setOpen] = useState(false);

  const profileName = useMemo(() => {
    if (!authUser) return 'Guest';
    return (
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.email ||
      'User'
    );
  }, [authUser]);

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed left-4 top-24 z-30 px-4 py-2 rounded-r-xl rounded-l-md bg-white border border-gray-300 shadow-lg text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          My CVs
        </button>
      ) : null}

      {open ? (
        <button
          type="button"
          aria-label="Close drawer overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/35 z-40"
        />
      ) : null}

      <aside
        className={`fixed top-0 left-0 h-full w-full sm:w-[440px] bg-white z-50 shadow-2xl border-r border-gray-200 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">My account</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>
          </div>

          <div className="mb-4 p-3 rounded-xl border border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">Profile</p>
            <p className="text-base font-semibold text-gray-800">{profileName}</p>
            <p className="text-sm text-gray-600 break-all">{authUser?.email || 'Not logged in'}</p>
          </div>

          <CloudCVPanel
            user={authUser}
            authLoading={authLoading}
            cloudLoading={cloudLoading}
            cloudError={cloudError}
            savedCVs={savedCVs}
            selectedCVId={selectedCloudCVId}
            onEmailLogin={onEmailLogin}
            onGoogleLogin={onGoogleLogin}
            onLogout={onLogout}
            onSaveCurrent={onSaveCurrentCV}
            onSaveAsNew={onSaveAsNewCloudCV}
            onLoadCV={onLoadCloudCV}
            onDeleteCV={onDeleteCloudCV}
            onDuplicateCV={onDuplicateCloudCV}
            disabled={!supabaseConfigured}
          />
        </div>
      </aside>
    </>
  );
};

export default RightCloudDrawer;

