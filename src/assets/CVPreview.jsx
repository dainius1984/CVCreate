// src/CVPreview.jsx
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { getPageBreaks, getProtectedPageRanges } from '../utils/pageLayout.js';

const CVPreview = ({ cvData, cvRef, onSelectElement, selectedElement, sectionOrder = ['summary', 'education', 'experience', 'skills'], appearance }) => {
  const { t, language } = useLanguage();
  const contentRef = useRef(null);
  const pageStackRef = useRef(null);
  const [pageBreaks, setPageBreaks] = useState([]);
  
  // A4 dimensions matching PDF export
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const MARGIN_PX = 54 * (96/72); // Convert 54pt margin to pixels (72px)
  const PDF_PAGE_WIDTH_PT = 595.28;
  const PDF_PAGE_HEIGHT_PT = 841.89;
  const PDF_MARGIN_PT = 54;
  const PDF_CONTENT_WIDTH_PT = PDF_PAGE_WIDTH_PT - PDF_MARGIN_PT * 2;
  const PDF_CONTENT_HEIGHT_PT = PDF_PAGE_HEIGHT_PT - PDF_MARGIN_PT * 2;
  const selectionProps = (id, selection) => ({
    'data-editor-id': id,
    'data-editor-selection': JSON.stringify({ id, ...selection }),
    onClick: (event) => {
      event.stopPropagation();
      onSelectElement?.({ id, ...selection });
    },
    onKeyDown: (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelectElement?.({ id, ...selection });
      }
    },
    role: 'button',
    tabIndex: 0,
    'aria-pressed': selectedElement?.id === id
  });
  const sectionPosition = (section) => sectionOrder.indexOf(section) + 1;

  useEffect(() => {
    const updatePageBreaks = () => {
      const content = contentRef.current;
      if (!content) return;
      const protectedRanges = getProtectedPageRanges(content);

      const cssToPt = PDF_CONTENT_WIDTH_PT / content.clientWidth;
      const pageContentHeight = PDF_CONTENT_HEIGHT_PT / cssToPt;
      setPageBreaks(getPageBreaks(content.scrollHeight, pageContentHeight, protectedRanges));
    };
    updatePageBreaks();
    const observer = new ResizeObserver(updatePageBreaks);
    if (contentRef.current) observer.observe(contentRef.current);
    if (cvRef?.current) observer.observe(cvRef.current);
    window.addEventListener('resize', updatePageBreaks);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePageBreaks);
    };
  }, [cvRef, cvData, language, sectionOrder, appearance, PDF_CONTENT_HEIGHT_PT, PDF_CONTENT_WIDTH_PT]);

  useLayoutEffect(() => {
    const source = contentRef.current;
    const pageStack = pageStackRef.current;
    if (!source || !pageStack) return;

    pageStack.replaceChildren();
    const pageBounds = [0, ...pageBreaks, source.scrollHeight];

    for (let index = 0; index < pageBounds.length - 1; index++) {
      const page = document.createElement('div');
      page.className = 'cv-page-sheet';
      page.setAttribute('role', 'group');
      page.setAttribute('aria-label', language === 'pl' ? `Strona ${index + 1}` : `Page ${index + 1}`);

      const clone = source.cloneNode(true);
      clone.removeAttribute('data-cv-content');
      clone.classList.remove('cv-source-content');
      clone.style.position = 'absolute';
      clone.style.left = `${MARGIN_PX}px`;
      clone.style.top = `${MARGIN_PX - pageBounds[index]}px`;
      clone.style.width = `${A4_WIDTH_PX - MARGIN_PX * 2}px`;
      clone.style.paddingBottom = '16px';
      clone.style.visibility = 'visible';
      clone.style.pointerEvents = 'auto';
      page.appendChild(clone);

      const pageNumber = document.createElement('span');
      pageNumber.className = 'cv-page-number';
      pageNumber.setAttribute('aria-hidden', 'true');
      pageNumber.textContent = language === 'pl' ? `Strona ${index + 1}` : `Page ${index + 1}`;
      page.appendChild(pageNumber);
      pageStack.appendChild(page);

      const selectFromPage = (event) => {
        const selection = event.target.closest('[data-editor-selection]');
        if (selection) onSelectElement?.(JSON.parse(selection.dataset.editorSelection));
      };
      page.addEventListener('click', selectFromPage);
      page.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const selection = event.target.closest('[data-editor-selection]');
        if (!selection) return;
        event.preventDefault();
        onSelectElement?.(JSON.parse(selection.dataset.editorSelection));
      });
    }
  }, [pageBreaks, cvData, language, sectionOrder, appearance, selectedElement, onSelectElement, A4_WIDTH_PX, MARGIN_PX]);

  return (
    <div className="relative" style={{ width: `${A4_WIDTH_PX}px` }}>
      <div
        ref={cvRef}
        className="bg-white w-full mx-auto relative z-0 cv-page-preview"
        id="cv-preview"
        style={{
          backgroundColor: '#e5e7eb',
          color: '#111827',
          width: `${A4_WIDTH_PX}px`,
          minHeight: `${A4_HEIGHT_PX}px`,
          padding: 0,
          '--cv-font-scale': appearance?.fontScale ?? 1,
          '--cv-section-spacing': `${appearance?.sectionSpacing ?? 16}px`,
          border: 'none !important',
          borderTop: 'none !important',
          borderRight: 'none !important',
          borderBottom: 'none !important',
          borderLeft: 'none !important',
          boxShadow: 'none !important',
          outline: 'none !important',
          borderStyle: 'none !important',
          borderWidth: '0 !important',
          borderColor: 'transparent !important'
        }}
      >
        <div ref={pageStackRef} className="cv-page-stack" aria-label={language === 'pl' ? 'Podgląd stron CV' : 'CV page preview'} />
        <div ref={contentRef} data-cv-content className="cv-content-flow cv-source-content" style={{ paddingBottom: '16px' }}>
          {/* Header */}
          <header
            data-section="header"
            {...selectionProps('personal', { section: 'personal', kind: 'section' })}
            className="flex flex-col md:flex-row items-center md:items-start justify-between mb-4"
            style={{ 
              order: 0,
              paddingBottom: '12px',
              borderBottom: '2px solid #e5e7eb'
            }}
          >
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                {cvData.name || 'Your Name'}
              </h1>
              {cvData.title && (
                <p className="mt-2 text-xl font-semibold text-gray-700">
                  {cvData.title}
                </p>
              )}
              <p className="text-base text-gray-600 mt-3">
                <span>Phone: {cvData.phone || '[Phone Number]'}</span>
                <span className="mx-2">|</span>
                <span>Email: {cvData.email || '[Email Address]'}</span>
              </p>
            </div>
            {cvData.photoUrl && (
              <div className="mt-4 md:mt-0 flex-shrink-0">
                <img
                  src={cvData.photoUrl}
                  alt="Your Photo"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 object-cover rounded-full shadow-md border-2 border-gray-200"
                />
              </div>
            )}
          </header>

          {/* Summary */}
          {cvData.summary && (
            <section 
              data-section="summary"
              data-cv-section="summary"
              {...selectionProps('summary', { section: 'summary', kind: 'section' })}
              className="mb-4"
              style={{ 
                order: sectionPosition('summary'),
                marginBottom: 'var(--cv-section-spacing, 16px)',
                paddingBottom: '8px'
              }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-1">{t('summary')}</h2>
              <div style={{ width: '180px', height: '2px', backgroundColor: '#2563eb', marginBottom: '8px' }} />
              <p className="text-gray-700 leading-relaxed text-sm">{cvData.summary}</p>
            </section>
          )}

          {/* Education */}
          {cvData.education && cvData.education.length > 0 && (
            <section 
              data-section="education"
              data-cv-section="education"
              {...selectionProps('education', { section: 'education', kind: 'section' })}
              className="mb-4"
              style={{ 
                order: sectionPosition('education'),
                marginBottom: 'var(--cv-section-spacing, 16px)',
                paddingBottom: '8px',
                borderBottom: '1px solid #e5e7eb'
              }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-1">{t('education')}</h2>
              <div style={{ width: '180px', height: '2px', backgroundColor: '#2563eb', marginBottom: '8px' }} />
              {cvData.education.map((ed, i) => (
                <div key={i} className="mb-2 last:mb-0" data-section={`education-item-${i}`}>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {ed.degree || '[Degree Name]'} | {ed.university || '[University Name]'}, {ed.cityState || '[City, State]'}
                  </h3>
                  <p className="text-gray-500 text-sm italic">
                    {ed.year || '[Graduation Year]'}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Professional Experience */}
          {cvData.experience && (() => {
            // Filter out empty experiences or those with only placeholder values
            const validExperiences = cvData.experience.filter(exp => {
              const hasJobTitle = exp.jobTitle && exp.jobTitle.trim() && !exp.jobTitle.includes('[Job Title]');
              const hasCompany = exp.company && exp.company.trim() && !exp.company.includes('[Company');
              return hasJobTitle || hasCompany;
            });
            
            if (validExperiences.length === 0) return null;
            
            return (
              <section data-section="experience" data-cv-section="experience" className="mb-4" style={{ order: sectionPosition('experience'), marginBottom: 'var(--cv-section-spacing, 16px)' }} {...selectionProps('experience-section', { section: 'experience', kind: 'section' })}>
                <h2 data-section="experience-header" className="text-xl font-bold text-gray-800 mb-1">{t('experience')}</h2>
                <div style={{ width: '220px', height: '2px', backgroundColor: '#2563eb', marginBottom: '8px' }} />
                
                {validExperiences.map((exp, expIndex) => {
                  const jobTitle = exp.jobTitle && !exp.jobTitle.includes('[Job Title]') ? exp.jobTitle : '';
                  const company = exp.company && !exp.company.includes('[Company') ? exp.company : '';
                  const cityState = exp.cityState && !exp.cityState.includes('[City') ? exp.cityState : '';
                  let dates = exp.dates && !exp.dates.includes('[Start Date]') ? exp.dates : '';

                  // Normalize "Present"/"obecnie" to match current UI language
                  if (dates) {
                    if (language === 'pl') {
                      dates = dates.replace(/present/gi, 'obecnie');
                    } else {
                      dates = dates.replace(/obecnie/gi, 'Present');
                    }
                  }
                  
                  const titleParts = [];
                  if (jobTitle) titleParts.push(jobTitle);
                  if (company) titleParts.push(company);
                  if (cityState) titleParts.push(cityState);
                  
                  return (
                    <div 
                      key={expIndex} 
                      data-section={`experience-${expIndex}`}
                      {...selectionProps(`experience-${expIndex}`, { section: 'experience', kind: 'experience', index: expIndex })}
                      className="mb-2 last:mb-0"
                      style={{
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid',
                        marginBottom: '10px',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        width: '100%',
                        maxWidth: '100%',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div data-section={`experience-entry-header-${expIndex}`}>
                        {titleParts.length > 0 && (
                        <h3 
                          className="text-lg font-semibold text-gray-800 mb-1"
                          style={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            maxWidth: '100%',
                            boxSizing: 'border-box'
                          }}
                        >
                          {titleParts.join(' | ')}
                        </h3>
                      )}
                      {dates && (
                        <p 
                          className="text-gray-500 text-sm italic mb-2"
                          style={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            maxWidth: '100%',
                            boxSizing: 'border-box'
                          }}
                        >
                          {dates}
                        </p>
                      )}
                      </div>
                  
                  {exp.responsibilities && exp.responsibilities.filter((resp) => String(resp || '').trim()).length > 0 && (
                    <div className="space-y-1 text-gray-700 text-sm">
                      {exp.responsibilities
                        .filter((resp) => String(resp || '').trim())
                        .map((resp, respIndex) => (
                        <div 
                          key={respIndex} 
                          className="leading-relaxed" 
                          data-break
                          style={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            maxWidth: '100%',
                            boxSizing: 'border-box'
                          }}
                        >
                          <span>{`• ${String(resp).trim()}`}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                      {expIndex < validExperiences.length - 1 && (
                        <div className="mt-2 pt-2 border-t border-gray-200" />
                      )}
                    </div>
                  );
                })}
                
                <div style={{ borderBottom: '1px solid #e5e7eb', marginTop: '16px' }} />
              </section>
            );
          })()}
          
          {/* Skills */}
          {cvData.skills && (() => {
            const hasSection = (sectionId) => {
              if (sectionId === 'technical') return cvData.skills.technical && cvData.skills.technical !== null;
              if (sectionId === 'soft') return cvData.skills.soft && cvData.skills.soft !== null;
              if (sectionId === 'languages') return cvData.skills.languages && cvData.skills.languages !== null;
              if (sectionId.startsWith('custom-')) {
                const idx = parseInt(sectionId.split('-')[1]);
                return cvData.skills.custom?.[idx]?.title && cvData.skills.custom[idx].content;
              }
              return false;
            };

            const getSectionTitle = (sectionId) => {
              if (sectionId === 'technical') return t('technicalSkills');
              if (sectionId === 'soft') return t('softSkills');
              if (sectionId === 'languages') return t('languages');
              if (sectionId.startsWith('custom-')) {
                const idx = parseInt(sectionId.split('-')[1]);
                return cvData.skills.custom?.[idx]?.title || '';
              }
              return '';
            };

            const getSectionContent = (sectionId) => {
              if (sectionId === 'technical') return cvData.skills.technical;
              if (sectionId === 'soft') return cvData.skills.soft;
              if (sectionId === 'languages') return cvData.skills.languages;
              if (sectionId.startsWith('custom-')) {
                const idx = parseInt(sectionId.split('-')[1]);
                return cvData.skills.custom?.[idx]?.content || '';
              }
              return '';
            };

            const order = cvData.skills.order || ['technical', 'soft', 'languages'];
            const visibleSections = order.filter(hasSection);
            
            if (visibleSections.length === 0) return null;

            const sectionTitle = cvData.skills.title || t('competencies');

            return (
              <section data-section="skills" data-cv-section="skills" style={{ order: sectionPosition('skills'), marginBottom: 'var(--cv-section-spacing, 16px)' }} {...selectionProps('skills-section', { section: 'skills', kind: 'section' })}>
                <h2 className="text-xl font-bold text-gray-800 mb-1">{sectionTitle}</h2>
                <div style={{ width: '180px', height: '2px', backgroundColor: '#2563eb', marginBottom: '12px' }} />
                <div className="space-y-3">
                  {visibleSections.map((sectionId) => {
                    const title = getSectionTitle(sectionId);
                    const content = getSectionContent(sectionId);
                    if (!title || !content) return null;
                    
                    return (
                      <div key={sectionId} data-section={`skill-item-${sectionId}`} {...selectionProps(`skill-${sectionId}`, { section: 'skills', kind: 'skill', sectionId })}>
                        <h3 className="text-base font-semibold text-gray-700">{title}:</h3>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{content}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default CVPreview;