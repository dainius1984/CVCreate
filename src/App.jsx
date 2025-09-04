import React, { useRef } from 'react';
import { useCVData } from './hooks/useCVData.js';
import { CVPdfExporter } from './utils/pdfExporter.js';
import CVBuilderLayout from './components/CVBuilderLayout.jsx';
import PreviewContainer from './components/PreviewContainer.jsx';

// Main App component
const App = () => {
  const cvRef = useRef(null);
  const {
    cvData,
    handleDataChange,
    handleAddResponsibility,
    handleRemoveResponsibility,
    handleAddExperience,
    handleRemoveExperience,
    handleAddEducation,
    handleRemoveEducation,
    importCVData,
    mergeCVData,
  } = useCVData();

  const handlePdfExport = () => CVPdfExporter.exportToPdf(cvRef.current, cvData);


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
        handlePdfExport={handlePdfExport}
        importCVData={importCVData}
        mergeCVData={mergeCVData}
      />
      <PreviewContainer cvData={cvData} cvRef={cvRef} />
    </div>
  );
};

export default App;
