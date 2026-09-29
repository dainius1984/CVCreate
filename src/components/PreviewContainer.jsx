import React from 'react';
import CVPreview from '../assets/CVPreview.jsx';

const PreviewContainer = ({ cvData, cvRef, onSelectElement, selectedElement, sectionOrder, appearance }) => {
  return (
    <div className="w-full lg:w-1/2 p-4 lg:p-8 flex justify-center overflow-auto">
      <CVPreview
        cvData={cvData}
        cvRef={cvRef}
        onSelectElement={onSelectElement}
        selectedElement={selectedElement}
        sectionOrder={sectionOrder}
        appearance={appearance}
      />
    </div>
  );
};

export default PreviewContainer;
