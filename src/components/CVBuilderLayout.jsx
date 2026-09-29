import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import CVForm from '../assets/CVForm.jsx';
import SaveAsPdfButton from '../assets/SaveAsPdfButton.jsx';
import ExportJsonButton from '../assets/ExportJsonButton.jsx';
import ImportJsonButton from '../assets/ImportJsonButton.jsx';

const CVBuilderLayout = ({ 
  cvData, 
  selectedElement,
  sectionOrder,
  setSectionOrder,
  appearance,
  setAppearance,
  handleDataChange, 
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
  handleMoveSkillSection,
  handlePdfExport, 
  importCVData,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const formPanelRef = useRef(null);
  const [draggedSection, setDraggedSection] = useState(null);
  const [dropTargetSection, setDropTargetSection] = useState(null);

  useEffect(() => {
    if (!selectedElement?.section) return;
    const section = formPanelRef.current?.querySelector(`[data-editor-section="${selectedElement.section}"]`);
    const item = section && [...section.querySelectorAll('[data-editor-item]')]
      .find(element => element.dataset.editorItem === selectedElement.id);
    (item || section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedElement?.id, selectedElement?.section]);

  const moveSection = (section, direction) => {
    const currentIndex = sectionOrder.indexOf(section);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sectionOrder.length) return;
    const next = [...sectionOrder];
    [next[currentIndex], next[targetIndex]] = [next[targetIndex], next[currentIndex]];
    setSectionOrder(next);
  };
  const handleSectionDragStart = (event, section) => {
    if (event.target.closest('button')) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', section);
    setDraggedSection(section);
    setDropTargetSection(null);
  };
  const handleSectionDragOver = (event, section) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (section !== draggedSection) setDropTargetSection(section);
  };
  const handleSectionDrop = (event, targetSection) => {
    event.preventDefault();
    const sourceSection = event.dataTransfer.getData('text/plain') || draggedSection;
    if (!sourceSection || sourceSection === targetSection) return;
    const next = sectionOrder.filter(section => section !== sourceSection);
    const targetIndex = next.indexOf(targetSection);
    next.splice(targetIndex < 0 ? next.length : targetIndex, 0, sourceSection);
    setSectionOrder(next);
    setDraggedSection(null);
    setDropTargetSection(null);
  };
  const handleSectionDragEnd = () => {
    setDraggedSection(null);
    setDropTargetSection(null);
  };
  const sectionNames = language === 'pl'
    ? { summary: 'O mnie', education: 'Edukacja', experience: 'Doświadczenie', skills: 'Umiejętności' }
    : { summary: 'Summary', education: 'Education', experience: 'Experience', skills: 'Skills' };
  
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

        <section className="mb-6 grid gap-4 border-b border-gray-200 pb-5" aria-label={language === 'pl' ? 'Wygląd i kolejność' : 'Appearance and order'}>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm font-medium text-gray-700">
              {language === 'pl' ? 'Rozmiar tekstu' : 'Text size'}
              <input type="range" min="0.9" max="1.15" step="0.05" value={appearance.fontScale} onChange={event => setAppearance(prev => ({ ...prev, fontScale: Number(event.target.value) }))} className="mt-2 block w-full accent-blue-600" aria-label={language === 'pl' ? 'Rozmiar tekstu' : 'Text size'} />
            </label>
            <label className="text-sm font-medium text-gray-700">
              {language === 'pl' ? 'Odstęp sekcji' : 'Section spacing'}
              <input type="range" min="8" max="32" step="2" value={appearance.sectionSpacing} onChange={event => setAppearance(prev => ({ ...prev, sectionSpacing: Number(event.target.value) }))} className="mt-2 block w-full accent-blue-600" aria-label={language === 'pl' ? 'Odstęp sekcji' : 'Section spacing'} />
            </label>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">{language === 'pl' ? 'Kolejność sekcji' : 'Section order'}</p>
            <div className="flex flex-wrap gap-2">
              {sectionOrder.map((section, index) => (
                <div
                  key={section}
                  draggable
                  onDragStart={event => handleSectionDragStart(event, section)}
                  onDragOver={event => handleSectionDragOver(event, section)}
                  onDrop={event => handleSectionDrop(event, section)}
                  onDragEnd={handleSectionDragEnd}
                  aria-grabbed={draggedSection === section}
                  className={`inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-sm cursor-grab select-none transition ${draggedSection === section ? 'section-order-dragging' : ''} ${dropTargetSection === section ? 'section-order-drop-target' : ''}`}
                >
                  <span>{sectionNames[section]}</span>
                  <button type="button" onClick={() => moveSection(section, 'up')} disabled={index === 0} aria-label={`${sectionNames[section]} ${language === 'pl' ? 'w górę' : 'up'}`} className="px-1 text-gray-600 disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => moveSection(section, 'down')} disabled={index === sectionOrder.length - 1} aria-label={`${sectionNames[section]} ${language === 'pl' ? 'w dół' : 'down'}`} className="px-1 text-gray-600 disabled:opacity-30">↓</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div ref={formPanelRef}>
        <CVForm
          cvData={cvData}
          selectedElement={selectedElement}
          handleDataChange={handleDataChange}
          handleAddExperience={handleAddExperience}
          handleRemoveExperience={handleRemoveExperience}
          handleMoveExperience={handleMoveExperience}
          handleAddEducation={handleAddEducation}
          handleRemoveEducation={handleRemoveEducation}
          handleMoveEducation={handleMoveEducation}
          handleRemoveEducationSection={handleRemoveEducationSection}
          handleAddCustomSkill={handleAddCustomSkill}
          handleRemoveCustomSkill={handleRemoveCustomSkill}
          handleRemoveSkillSection={handleRemoveSkillSection}
          handleMoveSkillSection={handleMoveSkillSection}
        />
        </div>
        
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
