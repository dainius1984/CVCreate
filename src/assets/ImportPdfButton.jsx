import React, { useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { translations } from '../utils/translations.js';

const ImportPdfButton = ({ onImport }) => {
  const { t, language } = useLanguage();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClick = () => inputRef.current?.click();

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const extractTextWithPdfJs = async (arrayBuffer) => {
    // Use explicit entry points compatible with Vite and bundle the worker
    const pdfjsLib = await import('pdfjs-dist/build/pdf');
    const pdfjsWorkerUrl = (await import('pdfjs-dist/build/pdf.worker.min?url')).default;
    const { getDocument, GlobalWorkerOptions } = pdfjsLib;
    try {
      // Point worker to the bundled asset URL so it loads reliably in Vite
      // eslint-disable-next-line
      GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;
    } catch (_) {}

    const loadingTask = getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const texts = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((i) => (i.str ?? '')).join('\n');
      texts.push(pageText);
    }
    return texts.join('\n\n');
  };

  const parseStructuredCv = (rawText) => {
    // Expect headings like: Summary, Professional Experience, Education, Skills
    const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    const sectionIndices = {};
    const findIndex = (label) => lines.findIndex((l) => l.toLowerCase() === label);
    sectionIndices.summary = findIndex('summary');
    sectionIndices.experience = findIndex('professional experience');
    sectionIndices.education = findIndex('education');
    sectionIndices.skills = findIndex('skills');

    const ordered = Object.entries(sectionIndices)
      .filter(([, idx]) => idx >= 0)
      .sort((a, b) => a[1] - b[1]);

    const sliceSection = (name) => {
      const start = sectionIndices[name];
      if (start < 0) return [];
      const pos = ordered.findIndex(([n]) => n === name);
      const end = pos >= 0 && pos + 1 < ordered.length ? ordered[pos + 1][1] : lines.length;
      return lines.slice(start + 1, end);
    };

    // Header: assume first non-empty line is name; second maybe title; then contact line
    const name = lines[0] || 'Your Name';
    const title = lines[1] && !/phone:|email:/i.test(lines[1]) ? lines[1] : '';
    const contactLine = lines.find((l) => /phone:|email:/i.test(l)) || '';
    const phoneMatch = contactLine.match(/phone:\s*([^|]+)/i);
    const emailMatch = contactLine.match(/email:\s*([^|]+)/i);

    const summaryLines = sliceSection('summary');
    const summary = summaryLines.join(' ');

    // Experience: heuristic parsing expecting pattern:
    // Job Title | Company, City
    // Dates line (italic in UI)
    // Bullets prefixed by • or -
    const expLines = sliceSection('professional experience');
    const experiences = [];
    let i = 0;
    while (i < expLines.length) {
      const header = expLines[i];
      const next = expLines[i + 1] || '';
      const bulletRegex = /^[•\-\u2022]/;
      if (header && header.includes('|')) {
        const [jobTitlePart, right] = header.split('|').map((s) => s.trim());
        const [companyPart, cityPart = ''] = (right || '').split(',').map((s) => s.trim());
        let dates = '';
        const responsibilities = [];
        if (next && !bulletRegex.test(next) && !next.includes('|')) {
          dates = next.trim();
          i += 2;
        } else {
          i += 1;
        }
        while (i < expLines.length && bulletRegex.test(expLines[i])) {
          responsibilities.push(expLines[i].replace(bulletRegex, '').trim());
          i += 1;
        }
        experiences.push({
          jobTitle: jobTitlePart || '',
          company: companyPart || '',
          cityState: cityPart || '',
          dates: dates || '',
          responsibilities,
        });
        // skip possible divider
        if (expLines[i] && expLines[i].startsWith('—')) i += 1;
      } else {
        i += 1;
      }
    }

    // Education: lines in triplets or similar; keep heuristic simple
    const eduLines = sliceSection('education');
    const education = [];
    for (let j = 0; j < eduLines.length; j++) {
      const line = eduLines[j];
      if (!line) continue;
      const parts = line.split('|');
      if (parts.length >= 2) {
        const degree = parts[0].trim();
        const rest = parts[1].split(',');
        const university = (rest[0] || '').trim();
        const cityState = (rest[1] || '').trim();
        const year = (eduLines[j + 1] && !eduLines[j + 1].includes('|')) ? eduLines[++j].trim() : '';
        education.push({ degree, university, cityState, year });
      }
    }

    // Competencies: parse categories and items
    const competenciesLines = sliceSection('skills');
    const competenciesText = competenciesLines.join(' ');
    const competencies = [];
    
    // Try to parse competencies from text (look for category: item patterns)
    const categoryPattern = /([^:]+):\s*([^\n]+(?:\n(?!\w+:|$)[^\n]+)*)/g;
    let match;
    while ((match = categoryPattern.exec(competenciesText)) !== null) {
      const category = match[1].trim();
      const itemsText = match[2].trim();
      // Split items by bullet points or new lines
      const items = itemsText
        .split(/[•\-\u2022\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
      if (items.length > 0) {
        competencies.push({ category, items });
      }
    }
    
    // Fallback: if no structured format found, try legacy skills format
    if (competencies.length === 0) {
      const technicalMatch = competenciesText.match(new RegExp('technical skills:?\\s*([\\s\\S]+?)(?:soft skills:|languages:|$)', 'i'));
      const technical = technicalMatch ? (technicalMatch[1] || '').trim() : '';
      
      const softMatch = competenciesText.match(new RegExp('soft skills:?\\s*([\\s\\S]+?)(?:languages:|$)', 'i'));
      const soft = softMatch ? (softMatch[1] || '').trim() : '';
      
      const languagesMatch = competenciesText.match(new RegExp('languages:?\\s*([\\s\\S]+)$', 'i'));
      const languages = languagesMatch ? (languagesMatch[1] || '').trim() : '';
      
      if (technical) {
        competencies.push({
          category: translations[language]?.technicalSkills || 'Technical Skills',
          items: technical.split(',').map(s => s.trim()).filter(Boolean)
        });
      }
      if (soft) {
        competencies.push({
          category: translations[language]?.softSkills || 'Soft Skills',
          items: soft.split(',').map(s => s.trim()).filter(Boolean)
        });
      }
      if (languages) {
        competencies.push({
          category: translations[language]?.languages || 'Languages',
          items: languages.split(',').map(s => s.trim()).filter(Boolean)
        });
      }
    }

    return {
      name,
      title,
      phone: phoneMatch ? phoneMatch[1].trim() : '',
      email: emailMatch ? emailMatch[1].trim() : '',
      photoUrl: '',
      summary,
      experience: experiences,
      education,
      competencies,
    };
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setLoading(true);
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const rawText = await extractTextWithPdfJs(arrayBuffer);
      const parsed = parseStructuredCv(rawText);
      onImport?.(parsed);
    } catch (err) {
      console.error('PDF import failed', err);
      setError('Failed to read PDF. Please ensure it follows the provided format.');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="mt-2">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none"
        disabled={loading}
      >
        {loading ? (language === 'pl' ? 'Importowanie…' : 'Importing…') : t('importFromPdf')}
      </button>
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
};

export default ImportPdfButton;


