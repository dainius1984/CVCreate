import React from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const ExportJsonButton = ({ data, fileName = 'cv_data.json' }) => {
  const { t } = useLanguage();
  const handleExport = () => {
    try {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export JSON failed', e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-800 focus:outline-none"
    >
      {t('exportJson')}
    </button>
  );
};

export default ExportJsonButton;


