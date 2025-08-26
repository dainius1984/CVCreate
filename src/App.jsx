import React, { useState, useRef, useEffect } from 'react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import CVForm from './assets/CVForm.jsx';
import CVPreview from './assets/CVPreview.jsx';
import SaveAsPdfButton from './assets/SaveAsPdfButton.jsx';

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
    
      const exportWidth = cvElement.scrollWidth;
      const exportHeight = cvElement.scrollHeight;
      // Temporarily add class to remove shadows during capture
      cvElement.classList.add('exporting');
      const dataUrl = await toJpeg(cvElement, {
        cacheBust: true,
        pixelRatio: 1.5,
        backgroundColor: '#ffffff',
        quality: 0.75,
        width: exportWidth,
        height: exportHeight,
        style: { width: `${exportWidth}px`, height: `${exportHeight}px` },
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const margin = 24; // 24pt (~8.5mm)
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Simpler, stable pagination: draw the full tall image each page with an upward offset.
      const imgNaturalWidth = img.width;
      const imgNaturalHeight = img.height;
      const contentWidth = pdfWidth - margin * 2;
      const scaledHeight = (contentWidth / imgNaturalWidth) * imgNaturalHeight;

      let yOffset = 0;
      const step = (pdfHeight - margin * 2); // no overlap to avoid divider artifacts
      while (yOffset < scaledHeight) {
        // Paint solid white page background
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
        pdf.addImage(dataUrl, 'JPEG', margin, margin - yOffset, contentWidth, scaledHeight);
        yOffset += step;
        if (yOffset < scaledHeight) pdf.addPage();
      }

      pdf.save(`${cvData.name.replace(/\s/g, '_')}_CV.pdf`);
      cvElement.classList.remove('exporting');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      try { cvRef.current?.classList.remove('exporting'); } catch (e) {}
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
          <SaveAsPdfButton onClick={handlePdfExport} />
        </div>
      </div>
      <div ref={previewContainerRef} className="w-full lg:w-1/2 p-4 lg:p-8 flex justify-center overflow-y-auto">
        <div
          style={{
            transform: `scale(${previewScale})`,
            transformOrigin: 'top center',
            backgroundImage: guideHeightPx > 0 ? `repeating-linear-gradient(to bottom, rgba(59,130,246,0.2) 0, rgba(59,130,246,0.2) 1px, transparent 1px, transparent ${guideHeightPx}px)` : undefined,
          }}
        >
        <CVPreview cvData={cvData} cvRef={cvRef} />
        </div>
      </div>
    </div>
  );
};

export default App;
