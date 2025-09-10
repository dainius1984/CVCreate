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
      const sectionSpacing = 16;
      const itemSpacing = 12;
      const bulletIndent = 20;

      // Theme colors (match app preview) - converted to RGB for jsPDF
      const THEME_PRIMARY = [37, 99, 235]; // #2563eb blue-600
      const THEME_TEXT = [31, 41, 55]; // #1f2937
      const THEME_MUTED = [107, 114, 128]; // #6b7280

      // Draw a subtle left vertical guide for current page
      const drawLeftGuide = () => {
        pdf.setDrawColor('#e5e7eb');
        pdf.setLineWidth(0.8);
        pdf.line(margin, margin, margin, pdfHeight - margin);
      };

      // Draw guide on the first page
      drawLeftGuide();

      // Internal: ensure there is enough space for next line, otherwise add a page
      const ensureSpaceFor = (linesNeeded = 1) => {
        const bottom = pdfHeight - margin;
        if (currentY + (lineHeight * linesNeeded) > bottom) {
          pdf.addPage();
          currentY = margin;
          drawLeftGuide();
        }
      };

      // Helper function to add text with word wrapping
      const addText = (text, fontSize = 10, isBold = false, color = '#000000', xOffset = 0) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        // Handle both hex strings and RGB arrays
        if (Array.isArray(color)) {
          pdf.setTextColor(color[0], color[1], color[2]);
        } else {
          pdf.setTextColor(color);
        }
        
        const lines = pdf.splitTextToSize(text, contentWidth - xOffset);
        for (let i = 0; i < lines.length; i++) {
          ensureSpaceFor(1);
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

      // Helper: Section header with nice underline and space before body
      const addSectionHeader = (title) => {
        currentY += sectionSpacing;
        ensureSpaceFor(1);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(THEME_TEXT[0], THEME_TEXT[1], THEME_TEXT[2]);
        pdf.text(title, margin, currentY);
        currentY += 6;
        // Short accent underline
        pdf.setDrawColor(THEME_PRIMARY[0], THEME_PRIMARY[1], THEME_PRIMARY[2]);
        pdf.setLineWidth(1.5);
        const uw = Math.min(180, contentWidth * 0.35);
        pdf.line(margin, currentY, margin + uw, currentY);
        currentY += 12; // gap after underline before content
      };

      // Helper function to add bullet paragraph that never splits bullet from first line
      const addBulletParagraph = (text, fontSize = 10, color = '#374151') => {
        const lines = pdf.splitTextToSize(text, contentWidth - bulletIndent);
        if (lines.length === 0) return;

        // Ensure at least one line fits with the bullet
        ensureSpaceFor(1);

        // Draw bullet and first line
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(THEME_PRIMARY[0], THEME_PRIMARY[1], THEME_PRIMARY[2]);
        pdf.text('•', margin, currentY);

        // Handle both hex strings and RGB arrays for text color
        if (Array.isArray(color)) {
          pdf.setTextColor(color[0], color[1], color[2]);
        } else {
          pdf.setTextColor(color);
        }
        pdf.text(lines[0], margin + bulletIndent, currentY);
        currentY += lineHeight;

        // Remaining wrapped lines (indented, no bullet)
        for (let i = 1; i < lines.length; i++) {
          ensureSpaceFor(1);
          // Use same color handling for wrapped lines
          if (Array.isArray(color)) {
            pdf.setTextColor(color[0], color[1], color[2]);
          } else {
            pdf.setTextColor(color);
          }
          pdf.text(lines[i], margin + bulletIndent, currentY);
          currentY += lineHeight;
        }

        currentY += 4; // Extra spacing after bullet blocks
      };

      // Helper to draw a profile photo if provided (top-right)
      const addProfilePhoto = async () => {
        try {
          const src = cvData.photoUrl;
          if (!src) return 0;

          // If it's not a data URL, try to fetch and convert to data URL
          let dataUrl = src;
          if (!/^data:image\//i.test(src)) {
            const res = await fetch(src, { mode: 'cors' }).catch(() => null);
            if (res && res.ok) {
              const blob = await res.blob();
              dataUrl = await new Promise((resolve) => {
                const fr = new FileReader();
                fr.onloadend = () => resolve(fr.result?.toString() || '');
                fr.readAsDataURL(blob);
              });
            }
          }

          if (!dataUrl) return 0;

          // Convert to circular image via canvas for better UX
          const toCircularDataUrl = async (url, sizePx) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = url;
            await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });
            // render at 2x for sharpness
            const scale = 2;
            const canvas = document.createElement('canvas');
            canvas.width = sizePx * scale; canvas.height = sizePx * scale;
            const ctx = canvas.getContext('2d');
            if (!ctx) return url;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.save();
            ctx.beginPath();
            ctx.arc((sizePx*scale)/2, (sizePx*scale)/2, (sizePx*scale)/2, 0, Math.PI*2);
            ctx.closePath();
            ctx.clip();
            // cover image
            const ratio = Math.max((sizePx*scale) / img.width, (sizePx*scale) / img.height);
            const w = img.width * ratio;
            const h = img.height * ratio;
            ctx.drawImage(img, ((sizePx*scale) - w)/2, ((sizePx*scale) - h)/2, w, h);
            ctx.restore();
            return canvas.toDataURL('image/png');
          };

          const size = 104; // slightly larger photo
          const x = pdfWidth - margin - size;
          const y = margin;

          const circularUrl = await toCircularDataUrl(dataUrl, size);
          // draw image first, then a subtle border ring
          pdf.addImage(circularUrl, 'PNG', x, y, size, size, undefined, 'FAST');
          pdf.setDrawColor('#d1d5db');
          pdf.setLineWidth(1.2);
          pdf.circle(x + size/2, y + size/2, size/2, 'S');
          return size;
        } catch (_e) {
          return 0;
        }
      };

      // Header Section with aligned layout (text block vertically centered to photo)
      const photoSize = await addProfilePhoto();
      const headerStartY = margin;
      const photoCenterY = headerStartY + (photoSize > 0 ? photoSize / 2 : 0);

      // Compute text block height
      const nameLineHeight = 26;
      const titleExists = Boolean(cvData.title);
      const titleLineHeight = 18;
      const contactExists = Boolean(cvData.phone || cvData.email);
      const contactLineHeight = 14;
      let textBlockHeight = nameLineHeight;
      if (titleExists) textBlockHeight += 8 + titleLineHeight; // spacing + line
      if (contactExists) textBlockHeight += 14 + contactLineHeight; // spacing + line

      // Determine first baseline so the block is vertically centered relative to photo
      let firstBaselineY = headerStartY + nameLineHeight; // default when no photo
      if (photoSize > 0) {
        const topY = photoCenterY - (textBlockHeight / 2);
        firstBaselineY = topY + nameLineHeight;
      }

      // Draw name
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor(THEME_TEXT[0], THEME_TEXT[1], THEME_TEXT[2]);
      let textY = firstBaselineY;
      pdf.text(cvData.name || 'Your Name', margin, textY);

      // Draw title
      if (titleExists) {
        textY += 8 + titleLineHeight;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(55, 65, 81); // #374151
        pdf.text(cvData.title, margin, textY);
      }

      // Draw contact
      if (contactExists) {
        textY += 14 + contactLineHeight;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.setTextColor(THEME_MUTED[0], THEME_MUTED[1], THEME_MUTED[2]);
        const contactInfo = [];
        if (cvData.phone) contactInfo.push(`Phone: ${cvData.phone}`);
        if (cvData.email) contactInfo.push(`Email: ${cvData.email}`);
        pdf.text(contactInfo.join('  |  '), margin, textY);
      }

      const headerBottom = Math.max(textY, headerStartY + photoSize);
      currentY = headerBottom + 18; // a bit more room before first section

      // Subtle divider under header
      addHorizontalLine(currentY, contentWidth, '#e5e7eb');
      currentY += 12;

      // Summary Section
      if (cvData.summary) {
        addSectionHeader('Summary');
        addText(cvData.summary, 11, false, [55, 65, 81]);
        currentY += 8;
      }

      // Education Section
      if (cvData.education && cvData.education.length > 0) {
        addSectionHeader('Education');
        cvData.education.forEach((edu, index) => {
          if (edu.degree || edu.university) {
            // Degree and University
            const educationLine = `${edu.degree || '[Degree]'} | ${edu.university || '[University]'}`;
            addText(educationLine, 12, true, THEME_TEXT);
            currentY += 2;
            
            // Location and Year
            const locationYear = [];
            if (edu.cityState) locationYear.push(edu.cityState);
            if (edu.year) locationYear.push(edu.year);
            if (locationYear.length > 0) {
              addText(locationYear.join(' • '), 10, false, THEME_MUTED);
            }
            
            // Add spacing between education entries
            currentY += itemSpacing;
          }
        });
      }

      // Professional Experience Section
      if (cvData.experience && cvData.experience.length > 0) {
        addSectionHeader('Professional Experience');
        cvData.experience.forEach((exp, index) => {
          if (exp.jobTitle || exp.company) {
            // Job Title and Company
            const jobLine = `${exp.jobTitle || '[Job Title]'} | ${exp.company || '[Company]'}`;
            addText(jobLine, 12, true, THEME_TEXT);
            currentY += 2;
            
            // Location and Dates
            const locationDates = [];
            if (exp.cityState) locationDates.push(exp.cityState);
            if (exp.dates) locationDates.push(exp.dates);
            if (locationDates.length > 0) {
              addText(locationDates.join(' • '), 10, false, THEME_MUTED);
            }
            currentY += 8;
            
            // Responsibilities with proper bullet points
            if (exp.responsibilities && exp.responsibilities.length > 0) {
              exp.responsibilities.forEach(resp => {
                const clean = resp.replace(/\s+/g, ' ').trim();
                if (clean) {
                  addBulletParagraph(clean, 10, [55, 65, 81]);
                }
              });
            }
            
            // Add spacing between experience entries
            currentY += itemSpacing;
          }
        });
      }

      // Skills Section
      if (cvData.skills) {
        addSectionHeader('Skills');
        
        if (cvData.skills.technical) {
          addText('Technical Skills:', 11, true, THEME_TEXT);
          currentY += 4;
          addText(cvData.skills.technical, 10, false, [55, 65, 81]);
          currentY += itemSpacing;
        }
        
        if (cvData.skills.soft) {
          addText('Soft Skills:', 11, true, THEME_TEXT);
          currentY += 4;
          addText(cvData.skills.soft, 10, false, [55, 65, 81]);
          currentY += itemSpacing;
        }
        
        if (cvData.skills.languages) {
          addText('Languages:', 11, true, THEME_TEXT);
          currentY += 4;
          addText(cvData.skills.languages, 10, false, [55, 65, 81]);
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
