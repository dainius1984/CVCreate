import { jsPDF } from 'jspdf';

export class CVPdfExporter {
  static async exportToPdf(cvElement, cvData) {
    try {
      console.log('PDF Export - Starting enhanced text-based PDF generation');

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
      const sectionSpacing = 24;
      const itemSpacing = 12;
      const bulletIndent = 20;

      // Helper function to add text with word wrapping
      const addText = (text, fontSize = 10, isBold = false, color = '#000000', xOffset = 0) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.setTextColor(color);
        
        const lines = pdf.splitTextToSize(text, contentWidth - xOffset);
        for (let i = 0; i < lines.length; i++) {
          if (currentY + lineHeight > pdfHeight - margin) {
            pdf.addPage();
            currentY = margin;
          }
          pdf.text(lines[i], margin + xOffset, currentY);
          currentY += lineHeight;
        }
        return currentY;
      };

      // Helper function to add a horizontal line
      const addHorizontalLine = (y, width = contentWidth, color = '#e5e7eb') => {
        pdf.setDrawColor(color);
        pdf.setLineWidth(0.5);
        pdf.line(margin, y, margin + width, y);
      };

      // Helper function to add section header with underline
      const addSectionHeader = (title) => {
        currentY += sectionSpacing;
        
        // Add a subtle line above the section
        if (currentY > margin + 20) {
          addHorizontalLine(currentY - 8, contentWidth * 0.3, '#d1d5db');
        }
        
        addText(title, 16, true, '#1f2937');
        currentY += 4;
        
        // Add underline
        addHorizontalLine(currentY, contentWidth * 0.4, '#3b82f6');
        currentY += 12;
      };

      // Helper function to add bullet points
      const addBulletPoint = (text, fontSize = 10, color = '#374151') => {
        // Add bullet symbol
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor('#3b82f6');
        pdf.text('•', margin, currentY);
        
        // Add text with proper indentation
        addText(text, fontSize, false, color, bulletIndent);
        currentY += 4; // Extra spacing after bullet points
      };

      // Header Section with enhanced styling
      addText(cvData.name || 'Your Name', 24, true, '#1f2937');
      currentY += 8;
      
      if (cvData.title) {
        addText(cvData.title, 16, true, '#374151');
        currentY += 12;
      }
      
      // Contact information with better formatting
      const contactInfo = [];
      if (cvData.phone) contactInfo.push(`📞 ${cvData.phone}`);
      if (cvData.email) contactInfo.push(`✉️ ${cvData.email}`);
      if (contactInfo.length > 0) {
        addText(contactInfo.join('  •  '), 11, false, '#6b7280');
        currentY += 16;
      }
      
      // Add a decorative line under header
      addHorizontalLine(currentY, contentWidth, '#e5e7eb');
      currentY += 16;

      // Summary Section
      if (cvData.summary) {
        addSectionHeader('📝 Summary');
        addText(cvData.summary, 11, false, '#374151');
        currentY += 8;
      }

      // Education Section
      if (cvData.education && cvData.education.length > 0) {
        addSectionHeader('🎓 Education');
        cvData.education.forEach((edu, index) => {
          if (edu.degree || edu.university) {
            // Degree and University
            const educationLine = `${edu.degree || '[Degree]'} | ${edu.university || '[University]'}`;
            addText(educationLine, 12, true, '#1f2937');
            currentY += 2;
            
            // Location and Year
            const locationYear = [];
            if (edu.cityState) locationYear.push(edu.cityState);
            if (edu.year) locationYear.push(edu.year);
            if (locationYear.length > 0) {
              addText(locationYear.join(' • '), 10, false, '#6b7280');
            }
            
            // Add spacing between education entries
            currentY += itemSpacing;
            
            // Add a subtle separator line between entries (except for the last one)
            if (index < cvData.education.length - 1) {
              addHorizontalLine(currentY - 4, contentWidth * 0.2, '#f3f4f6');
              currentY += 4;
            }
          }
        });
      }

      // Professional Experience Section
      if (cvData.experience && cvData.experience.length > 0) {
        addSectionHeader('💼 Professional Experience');
        cvData.experience.forEach((exp, index) => {
          if (exp.jobTitle || exp.company) {
            // Job Title and Company
            const jobLine = `${exp.jobTitle || '[Job Title]'} | ${exp.company || '[Company]'}`;
            addText(jobLine, 12, true, '#1f2937');
            currentY += 2;
            
            // Location and Dates
            const locationDates = [];
            if (exp.cityState) locationDates.push(exp.cityState);
            if (exp.dates) locationDates.push(exp.dates);
            if (locationDates.length > 0) {
              addText(locationDates.join(' • '), 10, false, '#6b7280');
            }
            currentY += 8;
            
            // Responsibilities with proper bullet points
            if (exp.responsibilities && exp.responsibilities.length > 0) {
              exp.responsibilities.forEach(resp => {
                if (resp.trim()) {
                  addBulletPoint(resp, 10, '#374151');
                }
              });
            }
            
            // Add spacing between experience entries
            currentY += itemSpacing;
            
            // Add a subtle separator line between entries (except for the last one)
            if (index < cvData.experience.length - 1) {
              addHorizontalLine(currentY - 4, contentWidth * 0.2, '#f3f4f6');
              currentY += 4;
            }
          }
        });
      }

      // Skills Section
      if (cvData.skills) {
        addSectionHeader('🛠️ Skills');
        
        if (cvData.skills.technical) {
          addText('Technical Skills:', 11, true, '#1f2937');
          currentY += 4;
          addText(cvData.skills.technical, 10, false, '#374151');
          currentY += itemSpacing;
        }
        
        if (cvData.skills.soft) {
          addText('Soft Skills:', 11, true, '#1f2937');
          currentY += 4;
          addText(cvData.skills.soft, 10, false, '#374151');
          currentY += itemSpacing;
        }
        
        if (cvData.skills.languages) {
          addText('Languages:', 11, true, '#1f2937');
          currentY += 4;
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
