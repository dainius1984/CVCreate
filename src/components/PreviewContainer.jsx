import React from 'react';
import CVPreview from '../assets/CVPreview.jsx';

const PreviewContainer = ({ cvData, cvRef }) => {
  return (
    <div className="w-full lg:w-1/2 p-4 lg:p-8 flex justify-center overflow-auto">
      <CVPreview cvData={cvData} cvRef={cvRef} />
    </div>
  );
};

export default PreviewContainer;
