import React, { useRef } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.jsx';
import { useCVData } from './hooks/useCVData.jsx';
import { CVPdfExporter } from './utils/pdfExporter.jsx';
import CVBuilderLayout from './components/CVBuilderLayout.jsx';
import PreviewContainer from './components/PreviewContainer.jsx';

// Main App component
const AppContent = () => {
  const cvRef = useRef(null);
  const { language } = useLanguage();
  const {
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
    importCVData,
    mergeCVData,
  } = useCVData();

  const handlePdfExport = () => CVPdfExporter.exportToPdf(cvRef.current, cvData, language);


  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 bg-gray-100 font-sans">
      <CVBuilderLayout
        cvData={cvData}
        handleDataChange={handleDataChange}
        handleAddResponsibility={handleAddResponsibility}
        handleRemoveResponsibility={handleRemoveResponsibility}
        handleAddExperience={handleAddExperience}
        handleRemoveExperience={handleRemoveExperience}
        handleAddEducation={handleAddEducation}
        handleRemoveEducation={handleRemoveEducation}
        handleAddCustomSkill={handleAddCustomSkill}
        handleRemoveCustomSkill={handleRemoveCustomSkill}
        handlePdfExport={handlePdfExport}
        importCVData={importCVData}
        mergeCVData={mergeCVData}
      />
      <PreviewContainer cvData={cvData} cvRef={cvRef} />
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
