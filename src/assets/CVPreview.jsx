// src/CVPreview.jsx
import React from 'react';

const CVPreview = ({ cvData, cvRef }) => {
  return (
    <div
      ref={cvRef}
      className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 w-full max-w-4xl"
      id="cv-preview"
      style={{ backgroundColor: '#ffffff', color: '#111827' }}
    >
      
      {/* Header */}
      <header
        className="flex flex-col md:flex-row items-center md:items-start justify-between pb-6 mb-6 border-b-2"
        style={{ borderBottomColor: '#e5e7eb' }}
      >
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight">{cvData.name}</h1>
          {cvData.title && (
            <p className="text-lg text-gray-600 mt-1">{cvData.title}</p>
          )}
          <p className="text-lg text-gray-600 mt-2">
            <span className="inline-block md:inline-block">Phone: {cvData.phone}</span>
            <span className="mx-2 hidden md:inline-block">|</span>
            <span className="inline-block md:inline-block">Email: {cvData.email}</span>
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <img
            src={cvData.photoUrl}
            alt="Your Photo"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full shadow-lg border-4 border-gray-100"
            style={{ borderColor: '#f3f4f6' }}
          />
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6 pb-6 border-b" style={{ borderBottomColor: '#e5e7eb' }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Summary</h2>
        <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
      </section>

      {/* Education */}
      <section className="mb-6 pb-6 border-b" style={{ borderBottomColor: '#e5e7eb' }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Education</h2>
        <h3 className="text-xl font-semibold text-gray-800">{cvData.education.degree} | {cvData.education.university}, {cvData.education.cityState}</h3>
        <p className="text-gray-500 text-sm italic">{cvData.education.year}</p>
      </section>

      {/* Professional Experience */}
      <section className="mb-6 pb-6 border-b" style={{ borderBottomColor: '#e5e7eb' }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Professional Experience</h2>
        {cvData.experience.map((exp, expIndex) => (
          <div key={expIndex} className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{exp.jobTitle} | {exp.company}, {exp.cityState}</h3>
            <p className="text-gray-500 text-sm italic">{exp.dates}</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              {exp.responsibilities.map((resp, respIndex) => (
                <li key={respIndex}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      
      {/* Skills */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Skills</h2>
        <div className="space-y-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Technical Skills:</h3>
            <p className="text-gray-600">{cvData.skills.technical}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Soft Skills:</h3>
            <p className="text-gray-600">{cvData.skills.soft}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Languages:</h3>
            <p className="text-gray-600">{cvData.skills.languages}</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CVPreview;
