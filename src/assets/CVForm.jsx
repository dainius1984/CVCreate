// src/CVForm.jsx
import React from 'react';
import Photo from './form/Photo.jsx';
import PersonalInfo from './form/PersonalInfo.jsx';
import Summary from './form/Summary.jsx';
import Education from './form/Education.jsx';
import Experience from './form/Experience.jsx';
import Skills from './form/Skills.jsx';

const CVForm = ({ cvData, handleDataChange, handleAddResponsibility, handleRemoveResponsibility, handleAddExperience, handleRemoveExperience }) => {
  return (
    <div>
      <PersonalInfo
        name={cvData.name}
        title={cvData.title}
        email={cvData.email}
        phone={cvData.phone}
        onChange={handleDataChange}
      />
      <div className="pt-6 mt-6 border-t border-gray-200">
        <Photo
          photoUrl={cvData.photoUrl}
          onChange={handleDataChange}
          onCroppedChange={(dataUrl) => handleDataChange('photoUrl', dataUrl)}
        />
      </div>

      <div className="pt-6 mt-6 border-t border-gray-200">
        <Summary summary={cvData.summary} onChange={handleDataChange} />
      </div>

      <div className="pt-6 mt-6 border-t border-gray-200">
        <Education education={cvData.education} onChange={handleDataChange} />
      </div>

      <div className="pt-6 mt-6 border-t border-gray-200">
        <Experience
          experience={cvData.experience}
          onChange={handleDataChange}
          onAddExperience={handleAddExperience}
          onRemoveExperience={handleRemoveExperience}
          onAddResponsibility={handleAddResponsibility}
          onRemoveResponsibility={handleRemoveResponsibility}
        />
      </div>

      <div className="pt-6 mt-6 border-t border-gray-200">
        <Skills skills={cvData.skills} onChange={handleDataChange} />
      </div>
    </div>
  );
};

export default CVForm;
