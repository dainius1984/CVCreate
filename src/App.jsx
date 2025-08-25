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
    education: {
      degree: '[Degree Name]',
      university: '[University Name]',
      cityState: '[City, State]',
      year: '[Graduation Year]',
    },
    skills: {
      technical: '[List specific software, programming languages, or tools, e.g., JavaScript, Python, Salesforce]',
      soft: '[List key interpersonal and communication skills, e.g., Communication, Problem-solving, Teamwork]',
      languages: '[List any languages you speak and your level of proficiency]',
    },
  });

  const handleDataChange = (path, value) => {
    setCvData(prevData => {
        let newData = { ...prevData };
        let current = newData;
        const keys = path.split('.');
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            const nextKey = keys[i+1];
            if (!isNaN(parseInt(nextKey))) {
                current = current[key][parseInt(nextKey)];
                i++;
            } else {
                current = current[key];
            }
        }
        current[keys[keys.length - 1]] = value;
        return newData;
    });
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
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handlePdfExport = async () => {
    try {
    const cvElement = cvRef.current;
    if (!cvElement) {
      console.error('CV element not found.');
      return;
    }
    
      const exportWidth = cvElement.scrollWidth;
      const exportHeight = cvElement.scrollHeight;
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

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = img.height / img.width;
      const imgHeight = pdfWidth * imgRatio;

      let position = 0;
      let leftHeight = imgHeight;
      
      while (leftHeight > 0) {
        pdf.addImage(dataUrl, 'JPEG', 0, position, pdfWidth, imgHeight);
        leftHeight -= pdfHeight;
        position -= pdfHeight;
        if (leftHeight > 0) pdf.addPage();
      }

      pdf.save(`${cvData.name.replace(/\s/g, '_')}_CV.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 bg-gray-100 font-sans">
      <div className="w-full lg:w-1/2 p-4 lg:p-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">CV Builder</h1>
          <p className="text-gray-600 mb-6">Fill in the form to generate your CV. The preview will update automatically.</p>
          <CVForm
            cvData={cvData}
            handleDataChange={handleDataChange}
            handleAddResponsibility={handleAddResponsibility}
            handleRemoveResponsibility={handleRemoveResponsibility}
            handleAddExperience={handleAddExperience}
            handleRemoveExperience={handleRemoveExperience}
          />
          <SaveAsPdfButton onClick={handlePdfExport} />
        </div>
      </div>
      <div ref={previewContainerRef} className="w-full lg:w-1/2 p-4 lg:p-8 flex justify-center overflow-y-auto">
        <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top center' }}>
          <CVPreview cvData={cvData} cvRef={cvRef} />
        </div>
      </div>
    </div>
  );
};

export default App;
