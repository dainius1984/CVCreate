import React, { useEffect, useState } from 'react';

const SaveCVModal = ({ open, mode, initialValues, loading, onClose, onSubmit }) => {
  const [positionName, setPositionName] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    if (!open) return;
    setPositionName(initialValues?.positionName || '');
    setJobUrl(initialValues?.jobUrl || '');
    setJobDescription(initialValues?.jobDescription || '');
  }, [open, initialValues]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      positionName: positionName.trim(),
      jobUrl: jobUrl.trim(),
      jobDescription: jobDescription.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            {mode === 'update' ? 'Update saved CV' : 'Save new CV'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Position name (shown in Saved CVs)</span>
          <input
            type="text"
            value={positionName}
            onChange={(e) => setPositionName(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="e.g. Senior .NET Developer"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Job ad URL</span>
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="https://..."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Job description / notes</span>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 min-h-40"
            placeholder="Paste full job description or your notes here..."
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? 'Saving...' : mode === 'update' ? 'Update CV' : 'Save CV'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaveCVModal;

