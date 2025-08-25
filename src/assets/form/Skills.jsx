import React from 'react';

const Skills = ({ skills, onChange }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Skills</h2>
      <label className="block mb-2">
        <span className="text-gray-700">Technical Skills</span>
        <input
          type="text"
          name="technical"
          value={skills.technical}
          onChange={(e) => onChange('skills.technical', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Soft Skills</span>
        <input
          type="text"
          name="soft"
          value={skills.soft}
          onChange={(e) => onChange('skills.soft', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Languages</span>
        <input
          type="text"
          name="languages"
          value={skills.languages}
          onChange={(e) => onChange('skills.languages', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
      </label>
    </div>
  );
};

export default Skills;


