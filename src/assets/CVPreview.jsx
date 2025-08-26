// src/CVPreview.jsx
import React, { useEffect, useRef, useState } from 'react';

const CVPreview = ({ cvData, cvRef }) => {
  const [pageBreaks, setPageBreaks] = useState([]);
  const contentRef = useRef(null);
  
  // A4 dimensions in points (PDF units): 595.28 x 841.89 pts
  // Convert to pixels at 96 DPI: 794px x 1123px
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const MARGIN_PX = 48; // 48px margin on all sides
  const CONTENT_HEIGHT_PX = A4_HEIGHT_PX - (MARGIN_PX * 2); // 1027px content area

  useEffect(() => {
    const calculatePageBreaks = () => {
      if (!contentRef.current) return;
      
      const sections = contentRef.current.querySelectorAll('[data-section]');
      const breaks = [];
      let currentPageHeight = 0;
      let pageNumber = 1;
      
      sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        
        // If adding this section would exceed page height, create a page break
        if (currentPageHeight + sectionHeight > CONTENT_HEIGHT_PX && currentPageHeight > 0) {
          breaks.push({
            pageNumber,
            yPosition: currentPageHeight + (pageNumber - 1) * A4_HEIGHT_PX + MARGIN_PX
          });
          pageNumber++;
          currentPageHeight = sectionHeight;
        } else {
          currentPageHeight += sectionHeight;
        }
      });
      
      setPageBreaks(breaks);
    };

    // Calculate on mount and when content changes
    calculatePageBreaks();
    
    // Recalculate on window resize
    const handleResize = () => setTimeout(calculatePageBreaks, 100);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [cvData, CONTENT_HEIGHT_PX]);

  return (
    <div className="relative">
      {/* Page Break Indicators - Now accurately positioned */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {/* Grid lines for A4 pages */}
        <div 
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent ${A4_HEIGHT_PX - 2}px,
              #ef4444 ${A4_HEIGHT_PX - 2}px,
              #ef4444 ${A4_HEIGHT_PX}px
            )`,
            backgroundPosition: `0 ${MARGIN_PX}px`,
            height: '100%',
            width: '100%'
          }}
        />
        
        {/* Page numbers */}
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="absolute right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow"
            style={{ 
              top: `${i * A4_HEIGHT_PX + 8}px`,
              fontSize: '10px'
            }}
          >
            Page {i + 1}
          </div>
        ))}
        
        {/* Dynamic page break warnings */}
        {pageBreaks.map((pageBreak, i) => (
          <div
            key={i}
            className="absolute left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded shadow"
            style={{ 
              top: `${pageBreak.yPosition}px`,
              fontSize: '10px'
            }}
          >
            ⚠ Page {pageBreak.pageNumber + 1} starts here
          </div>
        ))}
      </div>

      <div
        ref={cvRef}
        className="bg-white shadow-xl w-full mx-auto relative z-0"
        id="cv-preview"
        style={{ 
          backgroundColor: '#ffffff', 
          color: '#111827',
          width: `${A4_WIDTH_PX}px`,
          minHeight: `${A4_HEIGHT_PX}px`,
          padding: `${MARGIN_PX}px`
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
                <div key={i} className="mb-3 last:mb-0">
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