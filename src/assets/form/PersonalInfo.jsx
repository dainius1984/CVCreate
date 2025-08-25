import React from 'react';

const PersonalInfo = ({ name, title, email, phone, onChange }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-700">Personal Information</h2>
        <span className="text-xs text-gray-500">Shown at the top of your CV</span>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Full Name</span>
          <input
            type="text"
            name="name"
            value={name}
            placeholder="e.g., Marcin Chmielnicki"
            onChange={(e) => onChange('name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Title</span>
          <input
            type="text"
            name="title"
            value={title}
            placeholder="e.g., Data Engineer"
            onChange={(e) => onChange('title', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
          <span className="text-xs text-gray-500">Appears under your name (optional)</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="name@example.com"
              onChange={(e) => onChange('email', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Phone Number</span>
            <input
              type="tel"
              name="phone"
              value={phone}
              placeholder="e.g., +48 532 690 876"
              onChange={(e) => onChange('phone', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </label>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-200" />
    </div>
  );
};

export default PersonalInfo;


