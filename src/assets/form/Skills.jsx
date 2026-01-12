import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const Skills = ({ skills, onChange, onAddCustomSkill, onRemoveCustomSkill, onRemoveSkillSection, onMoveSkillSection }) => {
  const { t, language } = useLanguage();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  const handleRemoveSection = (sectionName) => {
    onRemoveSkillSection(sectionName);
  };

  const hasSection = (sectionName) => {
    if (sectionName.startsWith('custom-')) {
      const idx = parseInt(sectionName.split('-')[1]);
      return skills?.custom && skills.custom[idx];
    }
    return skills?.[sectionName] && skills[sectionName] !== null && skills[sectionName] !== '';
  };

  const getSectionTitle = (sectionId) => {
    if (sectionId === 'technical') return t('technicalSkills');
    if (sectionId === 'soft') return t('softSkills');
    if (sectionId === 'languages') return t('languages');
    if (sectionId.startsWith('custom-')) {
      const idx = parseInt(sectionId.split('-')[1]);
      return skills?.custom?.[idx]?.title || `${language === 'pl' ? 'Własna sekcja' : 'Custom Section'} ${idx + 1}`;
    }
    return sectionId;
  };

  const renderSection = (sectionId) => {
    if (sectionId === 'technical') {
      return (
        <div key="technical" className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block flex-1">
              <span className="text-gray-700 font-medium">{t('technicalSkills')}</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onMoveSkillSection('technical', 'up')}
                className="text-blue-500 hover:text-blue-700"
                title={language === 'pl' ? 'Przenieś w górę' : 'Move up'}
                disabled={skills?.order?.indexOf('technical') === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => onMoveSkillSection('technical', 'down')}
                className="text-blue-500 hover:text-blue-700"
                title={language === 'pl' ? 'Przenieś w dół' : 'Move down'}
                disabled={skills?.order?.indexOf('technical') === (skills?.order?.length || 0) - 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => handleRemoveSection('technical')}
                className="text-red-500 hover:text-red-700"
                title={language === 'pl' ? 'Usuń sekcję' : 'Remove section'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <input
            type="text"
            value={skills?.technical || ''}
            onChange={(e) => onChange('skills.technical', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            placeholder={language === 'pl' ? 'np. JavaScript, Python, React' : 'e.g. JavaScript, Python, React'}
          />
        </div>
      );
    }

    if (sectionId === 'soft') {
      return (
        <div key="soft" className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block flex-1">
              <span className="text-gray-700 font-medium">{t('softSkills')}</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onMoveSkillSection('soft', 'up')}
                className="text-blue-500 hover:text-blue-700"
                title={language === 'pl' ? 'Przenieś w górę' : 'Move up'}
                disabled={skills?.order?.indexOf('soft') === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => onMoveSkillSection('soft', 'down')}
                className="text-blue-500 hover:text-blue-700"
                title={language === 'pl' ? 'Przenieś w dół' : 'Move down'}
                disabled={skills?.order?.indexOf('soft') === (skills?.order?.length || 0) - 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => handleRemoveSection('soft')}
                className="text-red-500 hover:text-red-700"
                title={language === 'pl' ? 'Usuń sekcję' : 'Remove section'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <input
            type="text"
            value={skills?.soft || ''}
            onChange={(e) => onChange('skills.soft', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            placeholder={language === 'pl' ? 'np. Komunikacja, Praca zespołowa' : 'e.g. Communication, Teamwork'}
          />
        </div>
      );
    }

    if (sectionId === 'languages') {
      return (
        <div key="languages" className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block flex-1">
              <span className="text-gray-700 font-medium">{t('languages')}</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onMoveSkillSection('languages', 'up')}
                className="text-blue-500 hover:text-blue-700"
                title={language === 'pl' ? 'Przenieś w górę' : 'Move up'}
                disabled={skills?.order?.indexOf('languages') === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => onMoveSkillSection('languages', 'down')}
                className="text-blue-500 hover:text-blue-700"
                title={language === 'pl' ? 'Przenieś w dół' : 'Move down'}
                disabled={skills?.order?.indexOf('languages') === (skills?.order?.length || 0) - 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => handleRemoveSection('languages')}
                className="text-red-500 hover:text-red-700"
                title={language === 'pl' ? 'Usuń sekcję' : 'Remove section'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <input
            type="text"
            value={skills?.languages || ''}
            onChange={(e) => onChange('skills.languages', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            placeholder={language === 'pl' ? 'np. Angielski - komunikatywny' : 'e.g. English - conversational'}
          />
        </div>
      );
    }

    if (sectionId.startsWith('custom-')) {
      const idx = parseInt(sectionId.split('-')[1]);
      const custom = skills?.custom?.[idx];
      if (!custom) return null;

      return (
        <div key={sectionId} className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium text-gray-700">
              {custom.title || `${language === 'pl' ? 'Własna sekcja' : 'Custom Section'} ${idx + 1}`}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => onMoveSkillSection(sectionId, 'up')}
                className="text-blue-500 hover:text-blue-700"
                title={language === 'pl' ? 'Przenieś w górę' : 'Move up'}
                disabled={skills?.order?.indexOf(sectionId) === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => onMoveSkillSection(sectionId, 'down')}
                className="text-blue-500 hover:text-blue-700"
                title={language === 'pl' ? 'Przenieś w dół' : 'Move down'}
                disabled={skills?.order?.indexOf(sectionId) === (skills?.order?.length || 0) - 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => handleRemoveSection(sectionId)}
                className="text-red-500 hover:text-red-700"
                title={language === 'pl' ? 'Usuń sekcję' : 'Remove section'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <label className="block mb-2">
            <span className="text-gray-700">{language === 'pl' ? 'Tytuł sekcji' : 'Section Title'}</span>
            <input
              type="text"
              value={custom.title || ''}
              onChange={(e) => onChange(`skills.custom.${idx}.title`, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              placeholder={language === 'pl' ? 'np. Uprawnienia' : 'e.g. Certifications'}
            />
          </label>
          <label className="block">
            <span className="text-gray-700">{language === 'pl' ? 'Treść' : 'Content'}</span>
            <textarea
              value={custom.content || ''}
              onChange={(e) => onChange(`skills.custom.${idx}.content`, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              rows="3"
              placeholder={language === 'pl' ? 'Wpisz treść sekcji...' : 'Enter section content...'}
            />
          </label>
        </div>
      );
    }

    return null;
  };

  const order = skills?.order || ['technical', 'soft', 'languages'];
  const displayTitle = skills?.title || t('competenciesTitle');

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        {isEditingTitle ? (
          <>
            <input
              type="text"
              value={skills?.title || ''}
              onChange={(e) => onChange('skills.title', e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingTitle(false);
                }
              }}
              className="text-xl font-semibold text-gray-700 flex-1 rounded-md border-gray-300 shadow-sm p-2"
              placeholder={t('competenciesTitle')}
              autoFocus
            />
            <button
              onClick={() => setIsEditingTitle(false)}
              className="text-gray-500 hover:text-gray-700"
              title={language === 'pl' ? 'Zakończ edycję' : 'Finish editing'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-700">{displayTitle}</h2>
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-gray-500 hover:text-gray-700"
              title={language === 'pl' ? 'Edytuj tytuł' : 'Edit title'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </>
        )}
      </div>
      
      {/* Render sections in order */}
      {order
        .filter(sectionId => hasSection(sectionId))
        .map(sectionId => renderSection(sectionId))}

      <button
        onClick={onAddCustomSkill}
        className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        + {language === 'pl' ? 'Dodaj własną sekcję' : 'Add Custom Section'}
      </button>
    </div>
  );
};

export default Skills;
