import { jsPDF } from 'jspdf';

export class CVPdfExporter {
  static async exportToPdf(cvElement, cvData) {
    try {
      console.log('PDF Export - Starting text-based PDF generation');

      // PDF setup - A4 dimensions in points
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 595.28 pts
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 841.89 pts
      
      // Margins in points (1 inch = 72 pts, so ~0.75 inch margins)
      const margin = 54; // 54pts = 0.75 inches
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);

      let currentY = margin;
      const lineHeight = 14;
      const sectionSpacing = 20;
      const itemSpacing = 8;

      // Helper function to add text with word wrapping
      const addText = (text, fontSize = 10, isBold = false, color = '#000000') => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.setTextColor(color);
        
        const lines = pdf.splitTextToSize(text, contentWidth);
        for (let i = 0; i < lines.length; i++) {
          if (currentY + lineHeight > pdfHeight - margin) {
            pdf.addPage();
            currentY = margin;
          }
          pdf.text(lines[i], margin, currentY);
          currentY += lineHeight;
        }
        return currentY;
      };

      // Helper function to add section header
      const addSectionHeader = (title) => {
        currentY += sectionSpacing;
        addText(title, 14, true, '#1f2937');
        currentY += 8;
      };

      // Header Section
      addText(cvData.name || 'Your Name', 20, true, '#1f2937');
      currentY += 5;
      
      if (cvData.title) {
        addText(cvData.title, 14, true, '#374151');
        currentY += 5;
      }
      
      const contactInfo = [];
      if (cvData.phone) contactInfo.push(`Phone: ${cvData.phone}`);
      if (cvData.email) contactInfo.push(`Email: ${cvData.email}`);
      if (contactInfo.length > 0) {
        addText(contactInfo.join(' | '), 10, false, '#6b7280');
      }
      
      currentY += sectionSpacing;

      // Summary Section
      if (cvData.summary) {
        addSectionHeader('Summary');
        addText(cvData.summary, 10, false, '#374151');
      }

      // Education Section
      if (cvData.education && cvData.education.length > 0) {
        addSectionHeader('Education');
        cvData.education.forEach(edu => {
          if (edu.degree || edu.university) {
            const educationLine = `${edu.degree || '[Degree]'} | ${edu.university || '[University]'}, ${edu.cityState || '[Location]'}`;
            addText(educationLine, 11, true, '#1f2937');
            if (edu.year) {
              addText(edu.year, 10, false, '#6b7280');
            }
            currentY += itemSpacing;
          }
        });
      }

      // Professional Experience Section
      if (cvData.experience && cvData.experience.length > 0) {
        addSectionHeader('Professional Experience');
        cvData.experience.forEach(exp => {
          if (exp.jobTitle || exp.company) {
            const jobLine = `${exp.jobTitle || '[Job Title]'} | ${exp.company || '[Company]'}, ${exp.cityState || '[Location]'}`;
            addText(jobLine, 11, true, '#1f2937');
            if (exp.dates) {
              addText(exp.dates, 10, false, '#6b7280');
            }
            currentY += 5;
            
            if (exp.responsibilities && exp.responsibilities.length > 0) {
              exp.responsibilities.forEach(resp => {
                if (resp.trim()) {
                  addText(`• ${resp}`, 10, false, '#374151');
                }
              });
            }
            currentY += itemSpacing;
          }
        });
      }

      // Skills Section
      if (cvData.skills) {
        addSectionHeader('Skills');
        
        if (cvData.skills.technical) {
          addText('Technical Skills:', 10, true, '#1f2937');
          addText(cvData.skills.technical, 10, false, '#374151');
          currentY += itemSpacing;
        }
        
        if (cvData.skills.soft) {
          addText('Soft Skills:', 10, true, '#1f2937');
          addText(cvData.skills.soft, 10, false, '#374151');
          currentY += itemSpacing;
        }
        
        if (cvData.skills.languages) {
          addText('Languages:', 10, true, '#1f2937');
          addText(cvData.skills.languages, 10, false, '#374151');
        }
      }

      // Save the PDF
      const fileName = `${cvData.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'CV'}_Resume.pdf`;
      pdf.save(fileName);
      
      console.log('PDF generated successfully with text content');

    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  }
}
