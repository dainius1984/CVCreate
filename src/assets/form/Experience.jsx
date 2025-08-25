import React from 'react';

const Experience = ({ experience, onChange, onAddExperience, onRemoveExperience }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Professional Experience</h2>
      {experience.map((exp, expIndex) => (
        <div key={expIndex} className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
          <div className="flex justify-end">
            <button onClick={() => onRemoveExperience(expIndex)} className="text-red-500 hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <label className="block mb-2">
            <span className="text-gray-700">Job Title</span>
            <input
              type="text"
              name="jobTitle"
              value={exp.jobTitle}
              onChange={(e) => onChange(`experience.${expIndex}.jobTitle`, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Company</span>
            <input
              type="text"
              name="company"
              value={exp.company}
              onChange={(e) => onChange(`experience.${expIndex}.company`, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">City, State</span>
            <input
              type="text"
              name="cityState"
              value={exp.cityState}
              onChange={(e) => onChange(`experience.${expIndex}.cityState`, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Dates</span>
            <input
              type="text"
              name="dates"
              value={exp.dates}
              onChange={(e) => onChange(`experience.${expIndex}.dates`, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </label>
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">Responsibilities</h4>
            <p className="text-sm text-gray-500 mb-1">One per line. Use Shift+Enter for new line.</p>
            <textarea
              rows={5}
              value={(exp.responsibilities || []).join('\n')}
              onChange={(e) => onChange(`experience.${expIndex}.responsibilities`, e.target.value.split(/\r?\n/))}
              className="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm"
              placeholder="Used [Action Verb] to achieve [Result]...\nCollaborated with ..."
            />
          </div>
        </div>
      ))}
      <button onClick={onAddExperience} className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
        + Add Experience
      </button>
    </div>
  );
};

export default Experience;


