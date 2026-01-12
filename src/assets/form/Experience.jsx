import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const Experience = ({ experience, onChange, onAddExperience, onRemoveExperience }) => {
  const { t, language } = useLanguage();
  const [datePickerOpen, setDatePickerOpen] = useState(null); // Store index of open date picker
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">{t('experience')}</h2>
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
            <span className="text-gray-700">{t('jobTitle')}</span>
            <input
              type="text"
              name="jobTitle"
              value={exp.jobTitle}
              onChange={(e) => onChange(`experience.${expIndex}.jobTitle`, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">{t('company')}</span>
            <input
              type="text"
              name="company"
              value={exp.company}
              onChange={(e) => onChange(`experience.${expIndex}.company`, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">{t('cityState')}</span>
            <input
              type="text"
              name="cityState"
              value={exp.cityState}
              onChange={(e) => onChange(`experience.${expIndex}.cityState`, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">{t('dates')}</span>
            <div className="relative" id={`date-picker-container-${expIndex}`}>
              <input
                type="text"
                name="dates"
                value={exp.dates}
                readOnly
                onClick={(e) => {
                  e.stopPropagation();
                  setDatePickerOpen(expIndex);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 cursor-pointer bg-white"
                placeholder={language === 'pl' ? 'Kliknij, aby wybrać datę' : 'Click to select date'}
              />
              {datePickerOpen === expIndex && (
                <DatePickerPopup
                  key={`datepicker-${expIndex}`}
                  expIndex={expIndex}
                  currentDates={exp.dates || ''}
                  onChange={(dates) => {
                    if (dates && dates.trim()) {
                      onChange(`experience.${expIndex}.dates`, dates);
                    }
                    setDatePickerOpen(null);
                  }}
                  onClose={() => {
                    setDatePickerOpen(null);
                  }}
                  language={language}
                />
              )}
            </div>
          </label>
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">{t('responsibilities')}</h4>
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
        + {t('addExperience')}
      </button>
    </div>
  );
};

// Date Picker Popup Component
const DatePickerPopup = ({ expIndex, currentDates, onChange, onClose, language }) => {
  const [startMonth, setStartMonth] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endYear, setEndYear] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const modalRef = useRef(null);

  // Parse current dates if they exist - reset and parse when popup opens
  useEffect(() => {
    // Reset state
    setStartMonth('');
    setStartYear('');
    setEndMonth('');
    setEndYear('');
    setIsCurrent(false);

    if (currentDates && currentDates.trim()) {
      const parts = currentDates.split(' - ');
      if (parts.length >= 2) {
        const startPart = parts[0].trim();
        const endPart = parts[1].trim();
        
        const isPresent = endPart.toLowerCase() === (language === 'pl' ? 'obecnie' : 'present') || 
                         endPart.toLowerCase() === 'present';
        
        if (isPresent) {
          setIsCurrent(true);
        }
        
        // Parse start date - try different formats
        const startMatch = startPart.match(/(\w+)\s+(\d{4})/);
        if (startMatch) {
          setStartMonth(startMatch[1]);
          setStartYear(startMatch[2]);
        } else {
          // Try just year
          const yearMatch = startPart.match(/(\d{4})/);
          if (yearMatch) {
            setStartYear(yearMatch[1]);
          }
        }
        
        // Parse end date
        if (!isPresent) {
          const endMatch = endPart.match(/(\w+)\s+(\d{4})/);
          if (endMatch) {
            setEndMonth(endMatch[1]);
            setEndYear(endMatch[2]);
          } else {
            // Try just year
            const yearMatch = endPart.match(/(\d{4})/);
            if (yearMatch) {
              setEndYear(yearMatch[1]);
            }
          }
        }
      } else if (parts.length === 1) {
        // Only start date
        const startMatch = parts[0].trim().match(/(\w+)\s+(\d{4})/);
        if (startMatch) {
          setStartMonth(startMatch[1]);
          setStartYear(startMatch[2]);
        }
      }
    }
  }, [currentDates, language]); // Re-parse when dates or language change

  // Handle escape key and clicks outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        // Check if click is within the date picker container (includes the input)
        const container = document.getElementById(`date-picker-container-${expIndex}`);
        if (container && !container.contains(e.target)) {
          onClose();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    // Use setTimeout to avoid immediate closure when opening
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, expIndex]);

  const months = language === 'pl' 
    ? ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!startYear) {
      // At least year is required
      alert(language === 'pl' ? 'Proszę wybrać przynajmniej rok rozpoczęcia' : 'Please select at least a start year');
      return;
    }

    let dateString = '';
    
    if (startMonth && startYear) {
      dateString = `${startMonth} ${startYear}`;
    } else if (startYear) {
      dateString = startYear;
    }
    
    if (isCurrent) {
      dateString += ` - ${language === 'pl' ? 'obecnie' : 'Present'}`;
    } else if (endMonth && endYear) {
      dateString += ` - ${endMonth} ${endYear}`;
    } else if (endYear) {
      dateString += ` - ${endYear}`;
    }

    if (dateString) {
      onChange(dateString);
    }
    // Always close after save attempt
    onClose();
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
  };

  return (
    <div 
      ref={modalRef}
      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50 border border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {language === 'pl' ? 'Wybierz okres' : 'Select Period'}
          </h3>
          <button 
            type="button"
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label={language === 'pl' ? 'Zamknij' : 'Close'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'pl' ? 'Data rozpoczęcia' : 'Start Date'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm p-2"
              >
                <option value="">{language === 'pl' ? 'Miesiąc' : 'Month'}</option>
                {months.map((month, idx) => (
                  <option key={idx} value={month}>{month}</option>
                ))}
              </select>
              <select
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm p-2"
              >
                <option value="">{language === 'pl' ? 'Rok' : 'Year'}</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'pl' ? 'Data zakończenia' : 'End Date'}
            </label>
            <div className="mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'pl' ? 'Obecnie pracuję tutaj' : 'I currently work here'}
                </span>
              </label>
            </div>
            {!isCurrent && (
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm p-2"
                >
                  <option value="">{language === 'pl' ? 'Miesiąc' : 'Month'}</option>
                  {months.map((month, idx) => (
                    <option key={idx} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm p-2"
                >
                  <option value="">{language === 'pl' ? 'Rok' : 'Year'}</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            {language === 'pl' ? 'Anuluj' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            {language === 'pl' ? 'Zapisz' : 'Save'}
          </button>
        </div>
    </div>
  );
};

export default Experience;


