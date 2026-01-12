import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const Education = ({ education, onChange, onAddEducation, onRemoveEducation, onRemoveEducationSection }) => {
  const { t, language } = useLanguage();
  
  const hasEducation = education && education.length > 0;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-700">{t('education')}</h2>
        {hasEducation && (
          <button
            onClick={onRemoveEducationSection}
            className="text-red-500 hover:text-red-700 flex items-center gap-1"
            title={language === 'pl' ? 'Usuń całą sekcję edukacji' : 'Remove entire education section'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{language === 'pl' ? 'Usuń sekcję' : 'Remove section'}</span>
          </button>
        )}
      </div>
      {hasEducation && education.map((ed, idx) => (
        <div key={idx} className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
          <div className="flex justify-end">
            <button onClick={() => onRemoveEducation(idx)} className="text-red-500 hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"/></svg>
            </button>
          </div>
          <label className="block mb-2">
            <span className="text-gray-700">{t('degree')}</span>
            <input type="text" value={ed.degree} onChange={(e)=>onChange(`education.${idx}.degree`, e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">{t('university')}</span>
            <input type="text" value={ed.university} onChange={(e)=>onChange(`education.${idx}.university`, e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">{t('cityState')}</span>
            <input type="text" value={ed.cityState} onChange={(e)=>onChange(`education.${idx}.cityState`, e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
          </label>
          <label className="block">
            <span className="text-gray-700">{t('year')}</span>
            <input type="text" value={ed.year} onChange={(e)=>onChange(`education.${idx}.year`, e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
          </label>
        </div>
      ))}
      {hasEducation && (
        <button onClick={onAddEducation} className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">+ {t('addEducation')}</button>
      )}
      {!hasEducation && (
        <button onClick={onAddEducation} className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">+ {t('addEducation')}</button>
      )}
    </div>
  );
};

export default Education;


