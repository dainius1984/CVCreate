import React from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import CVForm from '../assets/CVForm.jsx';
import SaveAsPdfButton from '../assets/SaveAsPdfButton.jsx';
import ExportJsonButton from '../assets/ExportJsonButton.jsx';
import ImportJsonButton from '../assets/ImportJsonButton.jsx';

const CVBuilderLayout = ({ 
  cvData, 
  handleDataChange, 
  handleAddResponsibility, 
  handleRemoveResponsibility, 
  handleAddExperience, 
  handleRemoveExperience, 
  handleAddEducation, 
  handleRemoveEducation,
  handleRemoveEducationSection,
  handleAddCustomSkill,
  handleRemoveCustomSkill,
  handleRemoveSkillSection,
  handleMoveSkillSection,
  handlePdfExport, 
  importCVData, 
  mergeCVData 
}) => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div className="w-full lg:w-1/2 p-4 lg:p-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{t('cvBuilder')}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('pl')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                language === 'pl' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              PL
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                language === 'en' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              EN
            </button>
          </div>
        </div>
        <p className="text-gray-600 mb-6">{t('fillForm')}</p>
        
        <CVForm
          cvData={cvData}
          handleDataChange={handleDataChange}
          handleAddExperience={handleAddExperience}
          handleRemoveExperience={handleRemoveExperience}
          handleAddEducation={handleAddEducation}
          handleRemoveEducation={handleRemoveEducation}
          handleRemoveEducationSection={handleRemoveEducationSection}
          handleAddCustomSkill={handleAddCustomSkill}
          handleRemoveCustomSkill={handleRemoveCustomSkill}
          handleRemoveSkillSection={handleRemoveSkillSection}
          handleMoveSkillSection={handleMoveSkillSection}
        />
        
        <div className="flex gap-3 flex-wrap">
          <SaveAsPdfButton onClick={handlePdfExport} />
          <ExportJsonButton data={cvData} fileName={`${cvData.name.replace(/\s/g, '_') || 'cv'}_data.json`} />
          <ImportJsonButton onImport={importCVData} />
        </div>
      </div>
    </div>
  );
};

export default CVBuilderLayout;
