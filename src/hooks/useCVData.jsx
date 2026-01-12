import { useState } from 'react';

const initialCVData = {
  name: 'Your Name',
  title: '',
  photoUrl: 'https://placehold.co/150x150/e2e8f0/64748b?text=Your+Photo',
  phone: '[Phone Number]',
  email: '[Email Address]',
  summary: 'A highly motivated and results-driven professional with a passion for [Your Industry]. Adept at [Key Skill 1] and [Key Skill 2], with a proven track record of [Specific Achievement]. Seeking to leverage my expertise to contribute to the success of a dynamic team.',
  experience: [],
  education: [
    {
      degree: '[Degree Name]',
      university: '[University Name]',
      cityState: '[City, State]',
      year: '[Graduation Year]',
    },
  ],
  skills: {
    title: '', // Custom title for the skills section
    order: ['technical', 'soft', 'languages'], // Order of sections
    technical: '',
    soft: '',
    languages: '',
    custom: [],
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

  const handleRemoveEducationSection = () => {
    setCvData(prev => ({
      ...prev,
      education: []
    }));
  };

  const handleAddCustomSkill = () => {
    setCvData(prev => {
      const customIndex = (prev.skills?.custom || []).length;
      const customId = `custom-${customIndex}`;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          order: [...(prev.skills?.order || ['technical', 'soft', 'languages']), customId],
          custom: [
            ...(prev.skills?.custom || []),
            { title: '', content: '' }
          ],
        },
      };
    });
  };

  const handleRemoveCustomSkill = (idx) => {
    setCvData(prev => {
      const newSkills = { ...prev.skills };
      const customId = `custom-${idx}`;
      newSkills.custom = (newSkills.custom || []).filter((_, i) => i !== idx);
      newSkills.order = (newSkills.order || []).filter(id => id !== customId);
      // Reindex custom IDs
      newSkills.order = newSkills.order.map(id => {
        if (id.startsWith('custom-')) {
          const oldIdx = parseInt(id.split('-')[1]);
          if (oldIdx > idx) {
            return `custom-${oldIdx - 1}`;
          }
        }
        return id;
      });
      return { ...prev, skills: newSkills };
    });
  };

  const handleRemoveSkillSection = (sectionName) => {
    setCvData(prev => {
      const newSkills = { ...prev.skills };
      if (sectionName.startsWith('custom-')) {
        const idx = parseInt(sectionName.split('-')[1]);
        newSkills.custom = (newSkills.custom || []).filter((_, i) => i !== idx);
        newSkills.order = (newSkills.order || []).filter(id => id !== sectionName);
        // Reindex remaining custom sections
        newSkills.order = newSkills.order.map(id => {
          if (id.startsWith('custom-')) {
            const oldIdx = parseInt(id.split('-')[1]);
            if (oldIdx > idx) {
              return `custom-${oldIdx - 1}`;
            }
          }
          return id;
        });
      } else {
        newSkills[sectionName] = null; // Mark as removed
        newSkills.order = (newSkills.order || []).filter(id => id !== sectionName);
      }
      return { ...prev, skills: newSkills };
    });
  };

  const handleMoveSkillSection = (sectionId, direction) => {
    setCvData(prev => {
      const order = [...(prev.skills?.order || [])];
      const currentIndex = order.indexOf(sectionId);
      if (currentIndex === -1) return prev;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= order.length) return prev;
      
      [order[currentIndex], order[newIndex]] = [order[newIndex], order[currentIndex]];
      
      return {
        ...prev,
        skills: {
          ...prev.skills,
          order,
        },
      };
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
      skills: data.skills || {
        title: '',
        order: ['technical', 'soft', 'languages'],
        technical: '',
        soft: '',
        languages: '',
        custom: [],
      },
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
    handleRemoveEducationSection,
    handleAddCustomSkill,
    handleRemoveCustomSkill,
    handleRemoveSkillSection,
    handleMoveSkillSection,
    importCVData,
    mergeCVData,
  };
};
