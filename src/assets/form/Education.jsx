import React from 'react';

const Education = ({ education, onChange, onAddEducation, onRemoveEducation }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Education</h2>
      {education.map((ed, idx) => (
        <div key={idx} className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
          <div className="flex justify-end">
            <button onClick={() => onRemoveEducation(idx)} className="text-red-500 hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"/></svg>
            </button>
          </div>
          <label className="block mb-2">
            <span className="text-gray-700">Degree</span>
            <input type="text" value={ed.degree} onChange={(e)=>onChange(`education.${idx}.degree`, e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">University</span>
            <input type="text" value={ed.university} onChange={(e)=>onChange(`education.${idx}.university`, e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">City, State</span>
            <input type="text" value={ed.cityState} onChange={(e)=>onChange(`education.${idx}.cityState`, e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
          </label>
          <label className="block">
            <span className="text-gray-700">Graduation Year</span>
            <input type="text" value={ed.year} onChange={(e)=>onChange(`education.${idx}.year`, e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
          </label>
        </div>
      ))}
      <button onClick={onAddEducation} className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">+ Add Education</button>
    </div>
  );
};

export default Education;


