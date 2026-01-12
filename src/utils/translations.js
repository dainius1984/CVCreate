// Translation system for CV Builder
export const translations = {
  pl: {
    // Section headers
    summary: 'O mnie',
    education: 'Edukacja',
    experience: 'Doświadczenie zawodowe',
    competencies: 'Kompetencje',
    
    // Form labels
    personalInfo: 'Informacje osobiste',
    name: 'Imię i nazwisko',
    title: 'Tytuł zawodowy',
    phone: 'Telefon',
    email: 'Email',
    photo: 'Zdjęcie',
    addPhoto: 'Dodaj zdjęcie',
    
    // Experience
    jobTitle: 'Stanowisko',
    company: 'Firma',
    cityState: 'Miasto, Województwo',
    dates: 'Okres',
    responsibilities: 'Obowiązki',
    addExperience: 'Dodaj doświadczenie',
    
    // Education
    degree: 'Kierunek',
    university: 'Uczelnia',
    year: 'Rok ukończenia',
    addEducation: 'Dodaj edukację',
    
    // Competencies
    competenciesTitle: 'Kompetencje / Kluczowe Umiejętności',
    category: 'Kategoria',
    categoryPlaceholder: 'np. Uprawnienia',
    items: 'Elementy',
    addItem: 'Dodaj element',
    addCategory: 'Dodaj kategorię kompetencji',
    categoryLabel: 'Kategoria',
    technicalSkills: 'Umiejętności techniczne',
    softSkills: 'Umiejętności miękkie',
    languages: 'Języki',
    
    // Buttons
    saveAsPdf: 'Zapisz jako PDF',
    importFromPdf: 'Importuj z PDF',
    exportJson: 'Eksportuj JSON',
    importJson: 'Importuj JSON',
    
    // App
    cvBuilder: 'Kreator CV',
    fillForm: 'Wypełnij formularz, aby wygenerować CV. Podgląd zaktualizuje się automatycznie.',
  },
  en: {
    // Section headers
    summary: 'Summary',
    education: 'Education',
    experience: 'Professional Experience',
    competencies: 'Skills',
    
    // Form labels
    personalInfo: 'Personal Information',
    name: 'Full Name',
    title: 'Job Title',
    phone: 'Phone',
    email: 'Email',
    photo: 'Photo',
    addPhoto: 'Add Photo',
    
    // Experience
    jobTitle: 'Job Title',
    company: 'Company',
    cityState: 'City, State',
    dates: 'Dates',
    responsibilities: 'Responsibilities',
    addExperience: 'Add Experience',
    
    // Education
    degree: 'Degree',
    university: 'University',
    year: 'Year',
    addEducation: 'Add Education',
    
    // Competencies
    competenciesTitle: 'Skills / Key Competencies',
    category: 'Category',
    categoryPlaceholder: 'e.g. Certifications',
    items: 'Items',
    addItem: 'Add Item',
    addCategory: 'Add Competency Category',
    categoryLabel: 'Category',
    technicalSkills: 'Technical Skills',
    softSkills: 'Soft Skills',
    languages: 'Languages',
    
    // Buttons
    saveAsPdf: 'Save as PDF',
    importFromPdf: 'Import from PDF',
    exportJson: 'Export JSON',
    importJson: 'Import JSON',
    
    // App
    cvBuilder: 'CV Builder',
    fillForm: 'Fill in the form to generate your CV. The preview will update automatically.',
  },
};

export const getTranslation = (lang, key) => {
  return translations[lang]?.[key] || key;
};

