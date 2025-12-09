import React from 'react';
import CVForm from '../assets/CVForm.jsx';
import SaveAsPdfButton from '../assets/SaveAsPdfButton.jsx';
import ImportPdfButton from '../assets/ImportPdfButton.jsx';
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
  handlePdfExport, 
  importCVData, 
  mergeCVData 
}) => {
  return (
    <div className="w-full lg:w-1/2 p-4 lg:p-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">CV Builder</h1>
        <p className="text-gray-600 mb-6">Fill in the form to generate your CV. The preview will update automatically.</p>
        
        <CVForm
          cvData={cvData}
          handleDataChange={handleDataChange}
          handleAddExperience={handleAddExperience}
          handleRemoveExperience={handleRemoveExperience}
          handleAddEducation={handleAddEducation}
          handleRemoveEducation={handleRemoveEducation}
        />
        
        <div className="flex gap-3 flex-wrap">
          <SaveAsPdfButton onClick={handlePdfExport} />
          <ImportPdfButton onImport={mergeCVData} />
          <ExportJsonButton data={cvData} fileName={`${cvData.name.replace(/\s/g, '_') || 'cv'}_data.json`} />
          <ImportJsonButton onImport={importCVData} />
        </div>
      </div>
    </div>
  );
};

export default CVBuilderLayout;
