import { useState } from 'react';

const initialCVData = {
  name: 'Marcin Chmielnicki',
  title: '',
  photoUrl: 'https://placehold.co/150x150/e2e8f0/64748b?text=Your+Photo',
  phone: '+ 48 532 690 876',
  email: 'marcinarturchmielnicki@gmail.com',
  summary: '',
  experience: [],
  education: [
    {
      degree: 'Engineering',
      university: 'University of Edinburgh',
      cityState: 'Edinburgh, UK',
      year: '2012',
      description: [
        'Strong foundation in core programming concepts including data structures, algorithms, and object-oriented design principles.',
        'Proficient in fundamental software engineering practices with emphasis on clean code architecture and system design.',
        'Solid understanding of computational thinking and problem-solving methodologies applied to engineering challenges.',
        'Well-versed in foundational programming languages and development tools essential for software engineering.',
      ],
    },
  ],
  skills: {
    technical: '',
    soft: '',
    languages: '',
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
        { degree: '', university: '', cityState: '', year: '', description: [] },
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
      name: data.name || 'Marcin Chmielnicki',
      title: data.title || '',
      photoUrl: data.photoUrl || 'https://placehold.co/150x150/e2e8f0/64748b?text=Your+Photo',
      phone: data.phone || '+ 48 532 690 876',
      email: data.email || 'marcinarturchmielnicki@gmail.com',
      summary: data.summary || '',
      experience: Array.isArray(data.experience) ? data.experience : [],
      education: Array.isArray(data.education) 
        ? data.education.map(ed => ({
            degree: ed.degree || '',
            university: ed.university || '',
            cityState: ed.cityState || '',
            year: ed.year || '',
            description: Array.isArray(ed.description) ? ed.description : []
          }))
        : [],
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
