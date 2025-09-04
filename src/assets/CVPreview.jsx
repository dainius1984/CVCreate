// src/CVPreview.jsx
import React, { useEffect, useRef, useState } from 'react';

const CVPreview = ({ cvData, cvRef }) => {
  const [pageBreaks, setPageBreaks] = useState([]);
  const contentRef = useRef(null);
  
  // A4 dimensions matching PDF export
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const MARGIN_PX = 54 * (96/72); // Convert 54pt margin to pixels (72px)
  const CONTENT_HEIGHT_PX = A4_HEIGHT_PX - (MARGIN_PX * 2);

  useEffect(() => {
    const calculatePageBreaks = () => {
      if (!contentRef.current) return;
      
      const sections = contentRef.current.querySelectorAll('[data-section]');
      const breaks = [];
      let currentY = 0;
      let pageNumber = 1;
      
      // Simulate the same logic as PDF export
      sections.forEach((section, index) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + sectionHeight;
        
        // Check if we need a page break before this section (matching PDF export logic)
        if (currentY > 0 && sectionBottom - currentY > CONTENT_HEIGHT_PX * 0.7) {
          // Find best break point (matching PDF export logic)
          const idealBreak = currentY + CONTENT_HEIGHT_PX;
          let actualBreak = Math.min(sectionTop, idealBreak);
          
          breaks.push({
            yPosition: actualBreak,
            pageNumber: pageNumber,
            reason: `Page ${pageNumber + 1} starts here (before ${section.getAttribute('data-section')})`
          });
          
          currentY = actualBreak;
          pageNumber++;
        }
        
        // Update current position if this section extends further
        currentY = Math.max(currentY, sectionBottom);
      });
      
      setPageBreaks(breaks);
    };

    calculatePageBreaks();
    
    const handleResize = () => setTimeout(calculatePageBreaks, 100);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [cvData, CONTENT_HEIGHT_PX]);

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
        
      {/* Smart page break indicators */}
      {pageBreaks.map((pageBreak, i) => (
        <div key={i} style={{ position: 'absolute', zIndex: 50, pointerEvents: 'none' }}>
          {/* Break line */}
          <div
            style={{ 
              position: 'absolute',
              left: '0px',
              right: '0px',
              top: `${pageBreak.yPosition + MARGIN_PX}px`,
              borderTop: '2px dashed #ef4444',
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: 'none'
            }}
          />
          {/* Break label */}
          <div
            style={{ 
              position: 'absolute',
              left: '8px',
              top: `${pageBreak.yPosition + MARGIN_PX - 15}px`,
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '10px',
              padding: '4px 8px',
              borderRadius: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            📄 {pageBreak.reason}
          </div>
        </div>
      ))}
      
      {/* Page numbers */}
      {Array.from({ length: Math.ceil((contentRef.current?.offsetHeight || 0) / A4_HEIGHT_PX) + 1 }, (_, i) => (
        <div
          key={i}
          style={{ 
            position: 'absolute',
            right: '8px',
            top: `${i * A4_HEIGHT_PX + 8}px`,
            backgroundColor: '#3b82f6',
            color: 'white',
            fontSize: '10px',
            padding: '4px 8px',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            zIndex: 50,
            pointerEvents: 'none'
          }}
        >
          Page {i + 1}
        </div>
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
          outline: 'none !important'
        }}
      >
        <div ref={contentRef}>
          {/* Header */}
          <header
            data-section="header"
            className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8"
            style={{ 
              paddingBottom: '24px',
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
              className="mb-8"
              style={{ 
                paddingBottom: '20px',
                borderBottom: '1px solid #e5e7eb'
              }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3">Summary</h2>
              <p className="text-gray-700 leading-relaxed text-sm">{cvData.summary}</p>
            </section>
          )}

          {/* Education */}
          {cvData.education && cvData.education.length > 0 && (
            <section 
              data-section="education"
              className="mb-8"
              style={{ 
                paddingBottom: '20px',
                borderBottom: '1px solid #e5e7eb'
              }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3">Education</h2>
              {cvData.education.map((ed, i) => (
                <div key={i} className="mb-3 last:mb-0" data-section={`education-item-${i}`}>
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
          {cvData.experience && cvData.experience.length > 0 && (
            <section data-section="experience" className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Experience</h2>
              
              {cvData.experience.map((exp, expIndex) => (
                <div 
                  key={expIndex} 
                  data-section={`experience-${expIndex}`}
                  className="mb-6 last:mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {exp.jobTitle || '[Job Title]'} | {exp.company || '[Company Name]'}, {exp.cityState || '[City, State]'}
                  </h3>
                  <p className="text-gray-500 text-sm italic mb-2">
                    {exp.dates || '[Start Date] - [End Date]'}
                  </p>
                  
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                      {exp.responsibilities.map((resp, respIndex) => (
                        <li key={respIndex} className="leading-relaxed" data-break>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {expIndex < cvData.experience.length - 1 && (
                    <div className="mt-4 pt-3 border-t border-gray-200" />
                  )}
                </div>
              ))}
              
              <div style={{ borderBottom: '1px solid #e5e7eb', marginTop: '16px' }} />
            </section>
          )}
          
          {/* Skills */}
          <section data-section="skills">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Skills</h2>
            <div className="space-y-3">
              {cvData.skills?.technical && (
                <div>
                  <h3 className="text-base font-semibold text-gray-700">Technical Skills:</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{cvData.skills.technical}</p>
                </div>
              )}
              
              {cvData.skills?.soft && (
                <div>
                  <h3 className="text-base font-semibold text-gray-700">Soft Skills:</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{cvData.skills.soft}</p>
                </div>
              )}
              
              {cvData.skills?.languages && (
                <div>
                  <h3 className="text-base font-semibold text-gray-700">Languages:</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{cvData.skills.languages}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;