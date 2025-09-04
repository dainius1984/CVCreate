import { useState } from 'react';

const initialCVData = {
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
};

export const useCVData = () => {
  const [cvData, setCvData] = useState(initialCVData);

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

  const handleDataChange = (path, value) => {
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

  const importCVData = (data) => {
    setCvData({
      name: data.name || 'Your Name',
      title: data.title || '',
      photoUrl: data.photoUrl || 'https://placehold.co/150x150/e2e8f0/64748b?text=Your+Photo',
      phone: data.phone || '[Phone Number]',
      email: data.email || '[Email Address]',
      summary: data.summary || '',
      experience: Array.isArray(data.experience) ? data.experience : [],
      education: Array.isArray(data.education) ? data.education : [],
      skills: data.skills || {},
    });
  };

  const mergeCVData = (data) => {
    setCvData(prev => ({ ...prev, ...data }));
  };

  return {
    cvData,
    handleDataChange,
    handleAddResponsibility,
    handleRemoveResponsibility,
    handleAddExperience,
    handleRemoveExperience,
    handleAddEducation,
    handleRemoveEducation,
    importCVData,
    mergeCVData,
  };
};
