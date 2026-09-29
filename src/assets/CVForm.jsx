// src/CVForm.jsx
import React from 'react';
import Photo from './form/Photo.jsx';
import PersonalInfo from './form/PersonalInfo.jsx';
import Summary from './form/Summary.jsx';
import Education from './form/Education.jsx';
import Experience from './form/Experience.jsx';
import Skills from './form/Skills.jsx';

const CVForm = ({ 
  cvData, 
  selectedElement,
  handleDataChange, 
  handleAddResponsibility, 
  handleRemoveResponsibility, 
  handleAddExperience, 
  handleRemoveExperience,
  handleMoveExperience,
  handleAddEducation,
  handleRemoveEducation,
  handleMoveEducation,
  handleRemoveEducationSection,
  handleAddCustomSkill,
  handleRemoveCustomSkill,
  handleRemoveSkillSection,
  handleMoveSkillSection
}) => {
  const editorClass = (section) => selectedElement?.section === section ? 'editor-section-active' : '';

  return (
    <div>
      <div data-editor-section="personal" className={editorClass('personal')}>
      <PersonalInfo
        name={cvData.name}
        title={cvData.title}
        email={cvData.email}
        phone={cvData.phone}
        onChange={handleDataChange}
      />
      </div>
      <div className="pt-6 mt-6 border-t border-gray-200">
        <Photo
          photoUrl={cvData.photoUrl}
          onChange={handleDataChange}
          onCroppedChange={(dataUrl) => handleDataChange('photoUrl', dataUrl)}
        />
      </div>

      <div data-editor-section="summary" className={`pt-6 mt-6 border-t border-gray-200 ${editorClass('summary')}`}>
        <Summary summary={cvData.summary} onChange={handleDataChange} />
      </div>

      <div data-editor-section="education" className={`pt-6 mt-6 border-t border-gray-200 ${editorClass('education')}`}>
        <Education
          education={cvData.education}
          onChange={handleDataChange}
          onAddEducation={handleAddEducation}
          onRemoveEducation={handleRemoveEducation}
          onMoveEducation={handleMoveEducation}
          onRemoveEducationSection={handleRemoveEducationSection}
        />
      </div>

      <div data-editor-section="experience" className={`pt-6 mt-6 border-t border-gray-200 ${editorClass('experience')}`}>
        <Experience
          experience={cvData.experience}
          onChange={handleDataChange}
          onAddExperience={handleAddExperience}
          onRemoveExperience={handleRemoveExperience}
          onMoveExperience={handleMoveExperience}
          selectedElement={selectedElement}
        />
      </div>

      <div data-editor-section="skills" className={`pt-6 mt-6 border-t border-gray-200 ${editorClass('skills')}`}>
        <Skills 
          skills={cvData.skills} 
          onChange={handleDataChange}
          onAddCustomSkill={handleAddCustomSkill}
          onRemoveCustomSkill={handleRemoveCustomSkill}
          onRemoveSkillSection={handleRemoveSkillSection}
          onMoveSkillSection={handleMoveSkillSection}
          selectedElement={selectedElement}
        />
      </div>
    </div>
  );
};

export default CVForm;