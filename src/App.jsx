import React, { useState, useRef, useEffect } from 'react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import CVForm from './assets/CVForm.jsx';
import CVPreview from './assets/CVPreview.jsx';
import SaveAsPdfButton from './assets/SaveAsPdfButton.jsx';
import ImportPdfButton from './assets/ImportPdfButton.jsx';
import ExportJsonButton from './assets/ExportJsonButton.jsx';
import ImportJsonButton from './assets/ImportJsonButton.jsx';

// Main App component
const App = () => {
  const cvRef = useRef(null);
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [guideHeightPx, setGuideHeightPx] = useState(0);
  const [contentHeightPx, setContentHeightPx] = useState(0);
  const [cvData, setCvData] = useState({
    name: 'Your Name',
    title: '',
    photoUrl: 'https://placehold.co/150x150/e2e8f0/64748b?text=Your+Photo',
    phone: '[Phone Number]',
    email: '[Email Address]',
    summary: 'A highly motivated and results-driven professional with a passion for [Your Industry]. Adept at [Key Skill 1] and [Key Skill 2], with a proven track record of [Specific Achievement]. Seeking to leverage my expertise to contribute to the success of a dynamic team.',
    experience: [
      {
        jobTitle: '[Job Title]',
        company: '[Company Name]',
        cityState: '[City, State]',
        dates: '[Start Date] – [End Date]',
        responsibilities: [
          'Used [Action Verb] to achieve [Specific Result], leading to a [Quantifiable Outcome, e.g., "15% increase in efficiency"].',
          'Collaborated with [Number] of team members to successfully [Accomplishment].',
        ],
      },
    ],
    education: [
      {
        degree: '[Degree Name]',
        university: '[University Name]',
        cityState: '[City, State]',
        year: '[Graduation Year]',
      },
    ],
    skills: {
      technical: '[List specific software, programming languages, or tools, e.g., JavaScript, Python, Salesforce]',
      soft: '[List key interpersonal and communication skills, e.g., Communication, Problem-solving, Teamwork]',
      languages: '[List any languages you speak and your level of proficiency]',
    },
  });

  const handleDataChange = (path, value) => {
    const setAtPath = (source, pathStr, nextValue) => {
      const parts = pathStr.split('.');
      const rootClone = Array.isArray(source) ? [...source] : { ...source };
      let cursor = rootClone;
      for (let i = 0; i < parts.length - 1; i++) {
        const rawKey = parts[i];
        const key = Number.isNaN(Number(rawKey)) ? rawKey : Number(rawKey);
        const nextRaw = parts[i + 1];
        const nextIsIndex = !Number.isNaN(Number(nextRaw));

        const currentVal = cursor[key];
        let nextContainer;
        if (nextIsIndex) {
          nextContainer = Array.isArray(currentVal) ? [...currentVal] : [];
            } else {
          nextContainer = currentVal && typeof currentVal === 'object' && !Array.isArray(currentVal)
            ? { ...currentVal }
            : {};
        }
        cursor[key] = nextContainer;
        cursor = nextContainer;
      }
      const lastRaw = parts[parts.length - 1];
      const lastKey = Number.isNaN(Number(lastRaw)) ? lastRaw : Number(lastRaw);
      cursor[lastKey] = nextValue;
      return rootClone;
    };

    setCvData(prev => setAtPath(prev, path, value));
  };
  
  const handleAddResponsibility = (expIndex) => {
    const newExperience = [...cvData.experience];
    newExperience[expIndex].responsibilities.push('');
    setCvData({ ...cvData, experience: newExperience });
  };
  
  const handleRemoveResponsibility = (expIndex, respIndex) => {
    const newExperience = [...cvData.experience];
    newExperience[expIndex].responsibilities.splice(respIndex, 1);
    setCvData({ ...cvData, experience: newExperience });
  };
  
  const handleAddExperience = () => {
    setCvData({
      ...cvData,
      experience: [
        ...cvData.experience,
        {
          jobTitle: '',
          company: '',
          cityState: '',
          dates: '',
          responsibilities: [''],
        },
      ],
    });
  };
  
  const handleRemoveExperience = (index) => {
    const newExperience = [...cvData.experience];
    newExperience.splice(index, 1);
    setCvData({
      ...cvData,
      experience: newExperience,
    });
  };

  const handleAddEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: '', university: '', cityState: '', year: '' },
      ],
    }));
  };

  const handleRemoveEducation = (idx) => {
    setCvData(prev => {
      const next = { ...prev, education: [...prev.education] };
      next.education.splice(idx, 1);
      return next;
    });
  };

  useEffect(() => {
    const updateScale = () => {
      const cvEl = cvRef.current;
      const container = previewContainerRef.current;
      if (!cvEl || !container) return;
      const cvHeight = cvEl.scrollHeight;
      const containerHeight = container.clientHeight;
      if (!cvHeight || !containerHeight) return;
      const scale = Math.min(1, (containerHeight - 24) / cvHeight);
      setPreviewScale(scale > 0 && isFinite(scale) ? scale : 1);

      // Update page guide metrics (A4 ratio ≈ 1.414)
      const a4Ratio = 1.41421356237;
      const pageHeight = Math.round(cvEl.clientWidth * a4Ratio);
      setGuideHeightPx(pageHeight);
      setContentHeightPx(cvHeight);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    const cvEl = cvRef.current;
    let ro;
    if (cvEl && 'ResizeObserver' in window) {
      ro = new ResizeObserver(updateScale);
      ro.observe(cvEl);
    }
    return () => {
      window.removeEventListener('resize', updateScale);
      if (ro) ro.disconnect();
    };
  }, [cvRef]);

  const handlePdfExport = async () => {
    try {
      const cvElement = cvRef.current;
      if (!cvElement) {
        console.error('CV element not found.');
        return;
      }
  
      // Temporarily add class to remove shadows and guides during capture
      cvElement.classList.add('exporting');
      
      // Also hide page guides in the parent container
      const pageGuidesContainer = cvElement.parentElement?.querySelector('.page-guides');
      if (pageGuidesContainer) {
        pageGuidesContainer.style.display = 'none';
      }
      
      // Wait a moment for CSS changes to take effect
      await new Promise(resolve => setTimeout(resolve, 100));
  
      const exportWidth = cvElement.scrollWidth;
      const exportHeight = cvElement.scrollHeight;
  
      // PDF setup - A4 dimensions in points
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 595.28 pts
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 841.89 pts
      
      // Margins in points (1 inch = 72 pts, so ~0.75 inch margins)
      const margin = 54; // 54pts = 0.75 inches
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);
  
      // Calculate how the CV scales to fit PDF width
      const scaleRatio = contentWidth / exportWidth;
      const scaledHeight = exportHeight * scaleRatio;
  
      // Find all sections AND bullet points for smart page breaks
      const sections = cvElement.querySelectorAll('[data-section]');
      const bulletPoints = cvElement.querySelectorAll('li[data-break], li');
      const breakPoints = [];
      
      // Add section boundaries
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const cvRect = cvElement.getBoundingClientRect();
        const relativeTop = rect.top - cvRect.top + cvElement.scrollTop;
        const relativeBottom = relativeTop + section.offsetHeight;
        
        breakPoints.push({
          element: section,
          top: relativeTop * scaleRatio,
          bottom: relativeBottom * scaleRatio,
          type: 'section',
          priority: 1, // High priority
          name: section.getAttribute('data-section') || `section-${index}`
        });
      });
  
      // Add bullet point boundaries
      bulletPoints.forEach((bullet, index) => {
        const rect = bullet.getBoundingClientRect();
        const cvRect = cvElement.getBoundingClientRect();
        const relativeTop = rect.top - cvRect.top + cvElement.scrollTop;
        const relativeBottom = relativeTop + bullet.offsetHeight;
        
        breakPoints.push({
          element: bullet,
          top: relativeTop * scaleRatio,
          bottom: relativeBottom * scaleRatio,
          type: 'bullet',
          priority: 2, // Medium priority
          name: `bullet-${index}`
        });
      });
  
      // Sort break points by position
      breakPoints.sort((a, b) => a.top - b.top);
  
      // Generate high-quality image
      const dataUrl = await toJpeg(cvElement, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        quality: 0.9,
        width: exportWidth,
        height: exportHeight,
      });
  
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
  
      // Smart pagination logic
      let currentPageTop = 0;
      let pageNumber = 1;
      const maxPages = 10;
      const epsilon = 1; // threshold in pts to consider we're at the end
  
      // Loop while there's content left to render and we haven't exceeded max pages.
      while (currentPageTop < scaledHeight - epsilon && pageNumber <= maxPages) { 
  
        // Fill page background
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
  
        // Calculate the ideal end position for this page
        const idealPageBottom = currentPageTop + contentHeight;
        let actualPageBottom = idealPageBottom;
  
        // Find the best break point for this page
        if (currentPageTop + contentHeight < scaledHeight) {
          let bestBreakPoint = idealPageBottom;
          let bestPriority = 999;
          let minDistance = Infinity;
  
          // Look for break points near the ideal position
          breakPoints.forEach(bp => {
            const isInRange = bp.bottom > currentPageTop + (contentHeight * 0.7) && 
                             bp.bottom <= idealPageBottom + (contentHeight * 0.15);
            
            if (isInRange) {
              const distance = Math.abs(bp.bottom - idealPageBottom);
              // Prioritize by type (sections > bullets) then by distance
              if (bp.priority < bestPriority || (bp.priority === bestPriority && distance < minDistance)) {
                bestBreakPoint = bp.bottom;
                bestPriority = bp.priority;
                minDistance = distance;
              }
            }
          });
  
          actualPageBottom = Math.min(bestBreakPoint, scaledHeight);
        } else {
          actualPageBottom = scaledHeight;
        }
  
        // Add proper spacing - create a clipping mask to ensure margins
        pdf.saveGraphicsState();
        pdf.rect(margin, margin, contentWidth, contentHeight);
        pdf.clip();
  
        // Draw the image portion for this page
        pdf.addImage(
          dataUrl,
          'JPEG',
          margin,
          margin - currentPageTop,
          contentWidth,
          scaledHeight
        );
  
        pdf.restoreGraphicsState();

        // Draw only the left vertical side guide line (no top/bottom/right lines)
        pdf.setDrawColor(156, 163, 175); // silky gray (tailwind gray-400)
        pdf.setLineWidth(0.75);
        pdf.line(margin, margin, margin, pdfHeight - margin);

        console.log(`Page ${pageNumber}: ${currentPageTop.toFixed(1)} to ${actualPageBottom.toFixed(1)}`);
  
        // Move to next page
        // No overlap to prevent content duplication
        currentPageTop = actualPageBottom;
        if (scaledHeight - currentPageTop > epsilon && pageNumber < maxPages) {
          pdf.addPage();
          pageNumber++;
        } else {
          break;
        }
      }
  
      // Save the PDF
      const fileName = `${cvData.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'CV'}_Resume.pdf`;
      pdf.save(fileName);
  
      cvElement.classList.remove('exporting');
      
      // Restore page guides visibility
      if (pageGuidesContainer) {
        pageGuidesContainer.style.display = '';
      }
      
      console.log(`PDF generated successfully with ${pageNumber - 1} pages`);
  
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      try { 
        cvRef.current?.classList.remove('exporting'); 
        
        // Restore page guides visibility in case of error
        const pageGuidesContainer = cvRef.current?.parentElement?.querySelector('.page-guides');
        if (pageGuidesContainer) {
          pageGuidesContainer.style.display = '';
        }
      } catch (e) {
        console.error('Error removing exporting class:', e);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 bg-gray-100 font-sans">
      <div className="w-full lg:w-1/2 p-4 lg:p-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">CV Builder</h1>
          <p className="text-gray-600 mb-6">Fill in the form to generate your CV. The preview will update automatically.</p>
          // Just replace your CVForm component call with this:

<CVForm
  cvData={cvData}
  handleDataChange={handleDataChange}
  handleAddResponsibility={handleAddResponsibility}
  handleRemoveResponsibility={handleRemoveResponsibility}
  handleAddExperience={handleAddExperience}
  handleRemoveExperience={handleRemoveExperience}
  handleAddEducation={handleAddEducation}        // ✅ Add this line
  handleRemoveEducation={handleRemoveEducation}  // ✅ Add this line
/>
          <div className="flex gap-3 flex-wrap">
            <SaveAsPdfButton onClick={handlePdfExport} />
            <ImportPdfButton onImport={(data) => setCvData((prev) => ({ ...prev, ...data }))} />
            <ExportJsonButton data={cvData} fileName={`${cvData.name.replace(/\s/g, '_') || 'cv'}_data.json`} />
            <ImportJsonButton onImport={(data) => setCvData((_) => ({
              name: data.name || 'Your Name',
              title: data.title || '',
              photoUrl: data.photoUrl || 'https://placehold.co/150x150/e2e8f0/64748b?text=Your+Photo',
              phone: data.phone || '[Phone Number]',
              email: data.email || '[Email Address]',
              summary: data.summary || '',
              experience: Array.isArray(data.experience) ? data.experience : [],
              education: Array.isArray(data.education) ? data.education : [],
              skills: data.skills || {},
            }))} />
          </div>
        </div>
      </div>
      <div ref={previewContainerRef} className="w-full lg:w-1/2 p-4 lg:p-8 flex justify-center overflow-y-auto">
        <div
          style={{
            transform: `scale(${previewScale})`,
            transformOrigin: 'top center',
            backgroundImage: 'none'
          }}
        >
        <CVPreview cvData={cvData} cvRef={cvRef} />
        </div>
      </div>
    </div>
  );
};

export default App;
