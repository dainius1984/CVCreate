import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const Summary = ({ summary, onChange }) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">{t('summary')}</h2>
      <textarea
        name="summary"
        value={summary}
        onChange={(e) => onChange('summary', e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        rows="4"
      ></textarea>
    </div>
  );
};

export default Summary;


