// src/CVPreview.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const CVPreview = ({ cvData, cvRef }) => {
  const { t } = useLanguage();
  const contentRef = useRef(null);
  const [pages, setPages] = useState(1);
  
  // A4 dimensions matching PDF export
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const MARGIN_PX = 54 * (96/72); // Convert 54pt margin to pixels (72px)
  const CONTENT_HEIGHT_PX = A4_HEIGHT_PX - (MARGIN_PX * 2);

  // Re-introduce simple page-start markers (subtle)
  useEffect(() => {
    const updatePages = () => {
      const h = contentRef.current?.offsetHeight || 0;
      const p = Math.max(1, Math.ceil(h / A4_HEIGHT_PX));
      setPages(p);
    };
    updatePages();
    const ro = new ResizeObserver(updatePages);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener('resize', updatePages);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updatePages);
    };
  }, []);

  return (
    <div className="relative">
      {/* Simple left guide line only */}
      <div 
        style={{
          position: 'absolute',
          left: `${MARGIN_PX}px`,
          top: '0px',
          bottom: '0px',
          width: '2px',
          height: '100%',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          border: 'none !important',
          margin: '0',
          padding: '0',
          outline: 'none !important',
          boxShadow: 'none !important',
          zIndex: 40,
          pointerEvents: 'none'
        }}
      />
        
      {/* Page start markers with label */}
      {Array.from({ length: pages }, (_, i) => (
        i === 0 ? null : (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                left: `${MARGIN_PX}px`,
                right: `${MARGIN_PX}px`,
                top: `${i * A4_HEIGHT_PX + MARGIN_PX}px`,
                height: '0px',
                borderTop: '1px dashed rgba(37,99,235,0.45)',
                zIndex: 10,
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: `${MARGIN_PX + 6}px`,
                top: `${i * A4_HEIGHT_PX + MARGIN_PX - 12}px`,
                backgroundColor: 'rgba(37,99,235,0.12)',
                color: '#2563eb',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '6px',
                border: '1px solid rgba(37,99,235,0.35)',
                zIndex: 11,
                pointerEvents: 'none'
              }}
            >
              Page {i + 1} starts
            </div>
          </div>
        )
      ))}

      {/* CV Content */}
      <div
        ref={cvRef}
        className="bg-white w-full mx-auto relative z-0"
        id="cv-preview"
        style={{ 
          backgroundColor: '#ffffff', 
          color: '#111827',
          width: `${A4_WIDTH_PX}px`,
          minHeight: `${A4_HEIGHT_PX}px`,
          padding: `${MARGIN_PX}px`,
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
        <div ref={contentRef}>
          {/* Header */}
          <header
            data-section="header"
            className="flex flex-col md:flex-row items-center md:items-start justify-between mb-4"
            style={{ 
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
              className="mb-4"
              style={{ 
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
              className="mb-4"
              style={{ 
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
              <section data-section="experience" className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{t('experience')}</h2>
                <div style={{ width: '220px', height: '2px', backgroundColor: '#2563eb', marginBottom: '8px' }} />
                
                {validExperiences.map((exp, expIndex) => {
                  const jobTitle = exp.jobTitle && !exp.jobTitle.includes('[Job Title]') ? exp.jobTitle : '';
                  const company = exp.company && !exp.company.includes('[Company') ? exp.company : '';
                  const cityState = exp.cityState && !exp.cityState.includes('[City') ? exp.cityState : '';
                  const dates = exp.dates && !exp.dates.includes('[Start Date]') ? exp.dates : '';
                  
                  const titleParts = [];
                  if (jobTitle) titleParts.push(jobTitle);
                  if (company) titleParts.push(company);
                  if (cityState) titleParts.push(cityState);
                  
                  return (
                    <div 
                      key={expIndex} 
                      data-section={`experience-${expIndex}`}
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
                  
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="space-y-1 text-gray-700 text-sm">
                      {exp.responsibilities.map((resp, respIndex) => (
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
                          {resp}
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
              <section data-section="skills">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{sectionTitle}</h2>
                <div style={{ width: '180px', height: '2px', backgroundColor: '#2563eb', marginBottom: '12px' }} />
                <div className="space-y-3">
                  {visibleSections.map((sectionId) => {
                    const title = getSectionTitle(sectionId);
                    const content = getSectionContent(sectionId);
                    if (!title || !content) return null;
                    
                    return (
                      <div key={sectionId}>
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