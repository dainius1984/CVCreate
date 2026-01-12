import React from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const SaveAsPdfButton = ({ onClick }) => {
  const { t } = useLanguage();
  
  return (
    <button
      type="button"
      onClick={() => {
        try {
          console.log('Save as PDF: click');
          if (typeof onClick === 'function') onClick();
        } catch (e) {
          console.error('Save as PDF handler error:', e);
        }
      }}
      className="w-full bg-emerald-600 text-white py-3 rounded-lg shadow-md hover:bg-emerald-700 transition duration-300 font-bold mt-4"
    >
      {t('saveAsPdf')}
    </button>
  );
};

export default SaveAsPdfButton;


