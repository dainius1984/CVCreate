import React from 'react';

const Education = ({ education, onChange }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Education</h2>
      <label className="block mb-2">
        <span className="text-gray-700">Degree</span>
        <input
          type="text"
          name="degree"
          value={education.degree}
          onChange={(e) => onChange('education.degree', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">University</span>
        <input
          type="text"
          name="university"
          value={education.university}
          onChange={(e) => onChange('education.university', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">City, State</span>
        <input
          type="text"
          name="cityState"
          value={education.cityState}
          onChange={(e) => onChange('education.cityState', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Graduation Year</span>
        <input
          type="text"
          name="year"
          value={education.year}
          onChange={(e) => onChange('education.year', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
      </label>
    </div>
  );
};

export default Education;


