import React, { useRef } from 'react';

const ImportJsonButton = ({ onImport }) => {
  const inputRef = useRef(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      onImport?.(data);
    } catch (e) {
      console.error('Import JSON failed', e);
      alert('Invalid JSON file');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 focus:outline-none"
      >
        Import JSON
      </button>
    </div>
  );
};

export default ImportJsonButton;


