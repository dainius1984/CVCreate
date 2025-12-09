# CVCreate - CV Builder Application

A modern, interactive CV (Resume) builder application built with React and Vite. Create professional CVs with a user-friendly interface, live preview, and export capabilities.

## Features

- 📝 **Form-based CV Creation**: Easy-to-use forms for all CV sections
  - Personal Information (Name, Title, Email, Phone)
  - Photo upload with cropping functionality
  - Professional Summary
  - Work Experience (with multiple entries and responsibilities)
  - Education (with multiple entries)
  - Skills (Technical, Soft Skills, Languages)

- 👁️ **Live Preview**: See your CV update in real-time as you type

- 📄 **PDF Export**: Export your CV as a professional PDF document

- 💾 **JSON Import/Export**: Save and load your CV data as JSON files

- 📥 **PDF Import**: Import data from existing PDF files

- 🎨 **Modern UI**: Built with Tailwind CSS for a clean, responsive design

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **jsPDF** - PDF generation
- **html2canvas** - Canvas rendering for PDF export
- **pdfjs-dist** - PDF parsing for import
- **react-easy-crop** - Image cropping functionality

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dainius1984/CVCreate.git
cd CVCreate
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. Fill in your personal information in the form on the left side
2. Upload a photo (optional) and crop it as needed
3. Add your work experience, education, and skills
4. Watch the live preview update on the right side
5. Export your CV as PDF or save it as JSON for later editing

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── main.jsx                # Application entry point
├── assets/                # Form components and buttons
│   ├── CVForm.jsx
│   ├── CVPreview.jsx
│   ├── form/              # Individual form sections
│   └── [Button components]
├── components/            # Layout components
├── hooks/                # Custom React hooks
│   └── useCVData.jsx     # CV data management hook
└── utils/                # Utility functions
    └── pdfExporter.jsx   # PDF export functionality
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Live Demo

Visit the live application at: [cv-create-wheat.vercel.app](https://cv-create-wheat.vercel.app)

## License

This project is open source and available under the MIT License.
