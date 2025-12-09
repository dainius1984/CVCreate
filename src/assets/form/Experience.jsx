import React, { useRef, useEffect } from 'react';

// Utility function to clean pasted text
const cleanPastedText = (text) => {
  if (!text) return [];
  
  // Remove common bullet point characters and markers
  const bulletPatterns = [
    /^[\u2022\u2023\u25E6\u2043\u2219\u00B7\u25AA\u25AB\u25CF\u25CB\u25A1\u25A0\u25B6\u25C0\u25B8\u25C2\u25BA\u25BC\u25C4\u25CA\u25D8\u25D9\u25FE\u25FF]\s*/gm, // Various bullet symbols
    /^[-*+]\s+/gm, // Dash, asterisk, plus
    /^\d+[.)]\s+/gm, // Numbered lists (1. 2. etc.)
    /^[a-zA-Z][.)]\s+/gm, // Lettered lists (a. b. etc.)
    /^\s*[-*•]\s*/gm, // Bullets with extra spaces
  ];
  
  let cleaned = text;
  bulletPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Split by newlines and process each line
  const lines = cleaned.split(/\r?\n/);
  
  // Filter out empty lines, trim whitespace, and remove any remaining empty strings
  const cleanedLines = lines
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  return cleanedLines;
};

const Experience = ({ experience, onChange, onAddExperience, onRemoveExperience }) => {
  const textareaRefs = useRef({});

  // Auto-resize textarea based on content
  const adjustTextareaHeight = (expIndex) => {
    const textarea = textareaRefs.current[expIndex];
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`;
    }
  };

  useEffect(() => {
    // Adjust heights when experience data changes
    experience.forEach((_, index) => {
      adjustTextareaHeight(index);
    });
  }, [experience]);

  const handlePaste = (e, expIndex) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const cleanedLines = cleanPastedText(pastedText);
    
    if (cleanedLines.length > 0) {
      const currentValue = (experience[expIndex].responsibilities || []).join('\n');
      const cursorPosition = e.target.selectionStart;
      const textBefore = currentValue.substring(0, cursorPosition);
      const textAfter = currentValue.substring(e.target.selectionEnd);
      
      // Insert cleaned text at cursor position
      const newText = textBefore + cleanedLines.join('\n') + textAfter;
      const newLines = newText.split(/\r?\n/);
      
      onChange(`experience.${expIndex}.responsibilities`, newLines);
      
      // Adjust height after paste
      setTimeout(() => adjustTextareaHeight(expIndex), 0);
    }
  };

  const handleChange = (e, expIndex) => {
    const lines = e.target.value.split(/\r?\n/);
    onChange(`experience.${expIndex}.responsibilities`, lines);
    adjustTextareaHeight(expIndex);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Professional Experience</h2>
      {experience.map((exp, expIndex) => {
        const responsibilities = exp.responsibilities || [];
        const lineCount = responsibilities.filter(r => r.trim()).length;
        
        return (
          <div key={expIndex} className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Experience #{expIndex + 1}</h3>
              <button 
                onClick={() => onRemoveExperience(expIndex)} 
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Remove this experience"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <label className="block mb-2">
              <span className="text-gray-700 font-medium">Job Title</span>
              <input
                type="text"
                name="jobTitle"
                value={exp.jobTitle}
                onChange={(e) => onChange(`experience.${expIndex}.jobTitle`, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Software Engineer"
              />
            </label>
            <label className="block mb-2">
              <span className="text-gray-700 font-medium">Company</span>
              <input
                type="text"
                name="company"
                value={exp.company}
                onChange={(e) => onChange(`experience.${expIndex}.company`, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Tech Company Inc."
              />
            </label>
            <label className="block mb-2">
              <span className="text-gray-700 font-medium">City, State</span>
              <input
                type="text"
                name="cityState"
                value={exp.cityState}
                onChange={(e) => onChange(`experience.${expIndex}.cityState`, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., New York, NY"
              />
            </label>
            <label className="block mb-2">
              <span className="text-gray-700 font-medium">Dates</span>
              <input
                type="text"
                name="dates"
                value={exp.dates}
                onChange={(e) => onChange(`experience.${expIndex}.dates`, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Jan 2020 - Present"
              />
            </label>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-medium text-gray-700">Responsibilities</h4>
                {lineCount > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {lineCount} {lineCount === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-2">
                💡 Tip: Paste text with bullet points - they'll be automatically removed and formatted. Empty lines are cleaned automatically.
              </p>
              <textarea
                ref={(el) => (textareaRefs.current[expIndex] = el)}
                rows={5}
                value={responsibilities.join('\n')}
                onChange={(e) => handleChange(e, expIndex)}
                onPaste={(e) => handlePaste(e, expIndex)}
                className="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[120px]"
                placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality software&#10;• Implemented automated testing reducing bugs by 30%"
                style={{ minHeight: '120px' }}
              />
            </div>
          </div>
        );
      })}
      <button 
        onClick={onAddExperience} 
        className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 font-medium"
      >
        + Add Experience
      </button>
    </div>
  );
};

export default Experience;


