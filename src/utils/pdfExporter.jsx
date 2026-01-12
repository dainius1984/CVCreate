import { jsPDF } from 'jspdf';
import { translations } from './translations.js';
import html2canvas from 'html2canvas';

export class CVPdfExporter {
  static async exportToPdf(cvElement, cvData, language = 'pl') {
    const t = (key) => translations[language]?.[key] || key;
    try {
      console.log('PDF Export - Starting PDF generation with html2canvas for Unicode support');
      
      // Use html2canvas to capture CV preview - this ensures Polish characters work correctly
      const previewElement = document.getElementById('cv-preview');
      
      if (previewElement) {
        try {
          console.log('Capturing CV preview with html2canvas');
          
          // Add exporting class to hide guides
          previewElement.classList.add('exporting');
          
          // Wait for styles to apply
          await new Promise(resolve => setTimeout(resolve, 150));
          
          const canvas = await html2canvas(previewElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            allowTaint: false,
          });
          
          // Remove exporting class
          previewElement.classList.remove('exporting');
          
          if (canvas && canvas.width > 0 && canvas.height > 0) {
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            if (imgData && imgData.length > 100) {
              const imgWidth = 595.28; // A4 width in points
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4',
                compress: true
              });
              
              const pageHeight = pdf.internal.pageSize.getHeight();
              let heightLeft = imgHeight;
              let position = 0;
              
              // Add first page
              pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
              
              // Add additional pages if needed
              while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
              }
              
              const fileName = `${cvData.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'CV'}_Resume.pdf`;
              pdf.save(fileName);
              
              console.log('PDF generated successfully with html2canvas (Polish characters supported)');
              return;
            }
          }
        } catch (error) {
          console.error('html2canvas error:', error);
          if (previewElement) {
            previewElement.classList.remove('exporting');
          }
        }
      }
      
      // Fallback to text-based export if html2canvas fails
      console.log('Falling back to text-based PDF generation (Polish characters may not display correctly)');

      // PDF setup - A4 dimensions in points
      // Use compress option to ensure proper Unicode support
      const pdf = new jsPDF({ 
        orientation: 'portrait', 
        unit: 'pt', 
        format: 'a4',
        compress: true
      });
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

      // Helper function to add text with word wrapping and Unicode support
      // In jsPDF 3.x, we need to use a font that supports Unicode/Polish characters
      // Standard fonts (helvetica, times, courier) don't fully support Polish chars
      // We'll use the internal encoding to ensure proper character rendering
      const addText = (text, fontSize = 10, isBold = false, color = '#000000', xOffset = 0) => {
        pdf.setFontSize(fontSize);
        // Use 'times' font - it has better Unicode support than helvetica
        pdf.setFont('times', isBold ? 'bold' : 'normal');
        // Handle both hex strings and RGB arrays
        if (Array.isArray(color)) {
          pdf.setTextColor(color[0], color[1], color[2]);
        } else {
          pdf.setTextColor(color);
        }
        
        // Ensure text is a string and handle Unicode properly
        const textStr = typeof text === 'string' ? text : String(text);
        
        // In jsPDF 3.x, we need to use the internal API for better Unicode support
        // Try using the internal encoding method
        try {
          const lines = pdf.splitTextToSize(textStr, contentWidth - xOffset);
          for (let i = 0; i < lines.length; i++) {
            ensureSpaceFor(1);
            // Use the internal text method with proper encoding
            // In jsPDF 3.x, text() should handle Unicode, but we'll ensure it
            const line = lines[i];
            // Use text() method - in jsPDF 3.x it should handle Unicode
            pdf.text(line, margin + xOffset, currentY);
            currentY += lineHeight;
          }
        } catch (e) {
          // Fallback: try without splitTextToSize
          console.warn('Error rendering text with Unicode:', e);
          ensureSpaceFor(1);
          pdf.text(textStr, margin + xOffset, currentY);
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
        pdf.setFont('times', 'bold');
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

        // Calculate total height needed for this bullet point
        const totalHeight = lines.length * lineHeight + 4; // +4 for spacing after
        
        // Check if we have enough space for the ENTIRE bullet point
        const bottom = pdfHeight - margin;
        if (currentY + totalHeight > bottom) {
          // Not enough space - move to next page
          pdf.addPage();
          currentY = margin;
          drawLeftGuide();
        }

        // Draw bullet and first line
        pdf.setFontSize(fontSize);
        pdf.setFont('times', 'normal');
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
          // Double check space for each line (shouldn't be needed, but safety check)
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
      pdf.setFont('times', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor(THEME_TEXT[0], THEME_TEXT[1], THEME_TEXT[2]);
      let textY = firstBaselineY;
      pdf.text(cvData.name || 'Your Name', margin, textY);

      // Draw title
      if (titleExists) {
        textY += 8 + titleLineHeight;
        pdf.setFont('times', 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(55, 65, 81); // #374151
        pdf.text(cvData.title, margin, textY);
      }

      // Draw contact
      if (contactExists) {
        textY += 14 + contactLineHeight;
        pdf.setFont('times', 'normal');
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
        addSectionHeader(t('summary'));
        addText(cvData.summary, 11, false, [55, 65, 81]);
        currentY += 8;
      }

      // Education Section
      if (cvData.education && cvData.education.length > 0) {
        addSectionHeader(t('education'));
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

      // Helper function to estimate height needed for an experience entry
      const estimateExperienceHeight = (exp) => {
        let estimatedHeight = 0;
        
        const jobTitle = exp.jobTitle && !exp.jobTitle.includes('[Job Title]') ? exp.jobTitle : '';
        const company = exp.company && !exp.company.includes('[Company') ? exp.company : '';
        const cityState = exp.cityState && !exp.cityState.includes('[City') ? exp.cityState : '';
        const dates = exp.dates && !exp.dates.includes('[Start Date]') ? exp.dates : '';
        
        if (jobTitle || company) {
          // Job title line (may wrap)
          const jobParts = [];
          if (jobTitle) jobParts.push(jobTitle);
          if (company) jobParts.push(company);
          if (jobParts.length > 0) {
            pdf.setFont('times', 'bold');
            pdf.setFontSize(12);
            const jobLines = pdf.splitTextToSize(jobParts.join(' | '), contentWidth);
            estimatedHeight += jobLines.length * lineHeight;
            estimatedHeight += 2; // spacing after title (2pt)
          }
          
          // Location and dates line (may wrap)
          const locationDates = [];
          if (cityState) locationDates.push(cityState);
          if (dates) locationDates.push(dates);
          if (locationDates.length > 0) {
            pdf.setFont('times', 'normal');
            pdf.setFontSize(10);
            const locationLines = pdf.splitTextToSize(locationDates.join(' • '), contentWidth);
            estimatedHeight += locationLines.length * lineHeight;
            estimatedHeight += 8; // spacing after location (8pt)
          }
          
          // Responsibilities - each responsibility may wrap, include spacing
          if (exp.responsibilities && exp.responsibilities.length > 0) {
            pdf.setFont('times', 'normal');
            pdf.setFontSize(10);
            exp.responsibilities.forEach(resp => {
              const clean = resp.replace(/\s+/g, ' ').trim();
              if (clean) {
                const respLines = pdf.splitTextToSize(clean, contentWidth - bulletIndent);
                estimatedHeight += Math.max(1, respLines.length) * lineHeight + 4; // +4 for spacing after each bullet
              }
            });
          }
          
          estimatedHeight += itemSpacing / 2; // spacing after entry
        }
        
        return estimatedHeight;
      };

      // Professional Experience Section
      if (cvData.experience && cvData.experience.length > 0) {
        // Filter out empty experiences or those with only placeholder values
        const validExperiences = cvData.experience.filter(exp => {
          const hasJobTitle = exp.jobTitle && exp.jobTitle.trim() && !exp.jobTitle.includes('[Job Title]');
          const hasCompany = exp.company && exp.company.trim() && !exp.company.includes('[Company');
          return hasJobTitle || hasCompany;
        });
        
        if (validExperiences.length > 0) {
          addSectionHeader(t('experience'));
          validExperiences.forEach((exp, index) => {
            const jobTitle = exp.jobTitle && !exp.jobTitle.includes('[Job Title]') ? exp.jobTitle : '';
            const company = exp.company && !exp.company.includes('[Company') ? exp.company : '';
            const cityState = exp.cityState && !exp.cityState.includes('[City') ? exp.cityState : '';
            const dates = exp.dates && !exp.dates.includes('[Start Date]') ? exp.dates : '';
            
            // Only show if we have at least jobTitle or company
            if (jobTitle || company) {
              // Check if we have enough space for this experience entry
              // If not, move to next page
              const estimatedHeight = estimateExperienceHeight(exp);
              const bottom = pdfHeight - margin;
              const availableSpace = bottom - currentY;
              const pageHeight = pdfHeight - (margin * 2);
              
              // Add larger buffer: at least 6 lines or 25% of estimated height, whichever is larger
              // This ensures we have plenty of space and prevents awkward breaks
              const buffer = Math.max(lineHeight * 6, estimatedHeight * 0.25);
              const minSpaceNeeded = estimatedHeight + buffer;
              
              // Also check if we're too close to the bottom (less than 20% of page height remaining)
              // If so, move to next page to avoid starting entries too close to page end
              const minRemainingSpace = pageHeight * 0.2;
              
              // Move to next page if:
              // 1. Not enough space for entry + buffer, OR
              // 2. Less than 20% of page height remaining (too close to bottom)
              if (currentY + minSpaceNeeded > bottom || availableSpace < minRemainingSpace) {
                // Not enough space - move to next page
                pdf.addPage();
                currentY = margin;
                drawLeftGuide();
              }
              
              // Job Title and Company
              const jobParts = [];
              if (jobTitle) jobParts.push(jobTitle);
              if (company) jobParts.push(company);
              if (jobParts.length > 0) {
                // Check space for job title before adding
                pdf.setFont('times', 'bold');
                pdf.setFontSize(12);
                const jobLines = pdf.splitTextToSize(jobParts.join(' | '), contentWidth);
                const jobHeight = jobLines.length * lineHeight + 2; // +2 for spacing
                const bottom = pdfHeight - margin;
                if (currentY + jobHeight > bottom) {
                  pdf.addPage();
                  currentY = margin;
                  drawLeftGuide();
                }
                addText(jobParts.join(' | '), 12, true, THEME_TEXT);
                currentY += 2;
              }
              
              // Location and Dates
              const locationDates = [];
              if (cityState) locationDates.push(cityState);
              if (dates) locationDates.push(dates);
              if (locationDates.length > 0) {
                // Check space for location/dates before adding
                pdf.setFont('times', 'normal');
                pdf.setFontSize(10);
                const locationLines = pdf.splitTextToSize(locationDates.join(' • '), contentWidth);
                const locationHeight = locationLines.length * lineHeight + 8; // +8 for spacing
                const bottom = pdfHeight - margin;
                if (currentY + locationHeight > bottom) {
                  pdf.addPage();
                  currentY = margin;
                  drawLeftGuide();
                }
                addText(locationDates.join(' • '), 10, false, THEME_MUTED);
              }
              currentY += 8;
              
              // Responsibilities with proper bullet points
              if (exp.responsibilities && exp.responsibilities.length > 0) {
                // Before starting responsibilities, check if we have space for ALL of them
                // Estimate total height needed for all responsibilities
                pdf.setFont('times', 'normal');
                pdf.setFontSize(10);
                let totalRespHeight = 0;
                exp.responsibilities.forEach(resp => {
                  const clean = resp.replace(/\s+/g, ' ').trim();
                  if (clean) {
                    const respLines = pdf.splitTextToSize(clean, contentWidth - bulletIndent);
                    totalRespHeight += Math.max(1, respLines.length) * lineHeight + 4; // +4 for spacing
                  }
                });
                
                const bottom = pdfHeight - margin;
                // If we don't have space for all responsibilities, move to next page
                if (currentY + totalRespHeight > bottom - (lineHeight * 2)) {
                  pdf.addPage();
                  currentY = margin;
                  drawLeftGuide();
                }
                
                // Now add each bullet point (addBulletParagraph will check space for each)
                exp.responsibilities.forEach(resp => {
                  const clean = resp.replace(/\s+/g, ' ').trim();
                  if (clean) {
                    addBulletParagraph(clean, 10, [55, 65, 81]);
                  }
                });
              }
              
              // Add spacing between experience entries (reduced)
              currentY += itemSpacing / 2;
            }
          });
        }
      }

      // Skills Section
      if (cvData.skills) {
        const hasSection = (sectionId) => {
          if (sectionId === 'technical') return cvData.skills.technical && cvData.skills.technical !== null;
          if (sectionId === 'soft') return cvData.skills.soft && cvData.skills.soft !== null;
          if (sectionId === 'languages') return cvData.skills.languages && cvData.skills.languages !== null;
          if (sectionId.startsWith('custom-')) {
            const idx = parseInt(sectionId.split('-')[1]);
            return cvData.skills.custom?.[idx]?.title && cvData.skills.custom[idx].content;
          }
          return false;
        };

        const getSectionTitle = (sectionId) => {
          if (sectionId === 'technical') return t('technicalSkills');
          if (sectionId === 'soft') return t('softSkills');
          if (sectionId === 'languages') return t('languages');
          if (sectionId.startsWith('custom-')) {
            const idx = parseInt(sectionId.split('-')[1]);
            return cvData.skills.custom?.[idx]?.title || '';
          }
          return '';
        };

        const getSectionContent = (sectionId) => {
          if (sectionId === 'technical') return cvData.skills.technical;
          if (sectionId === 'soft') return cvData.skills.soft;
          if (sectionId === 'languages') return cvData.skills.languages;
          if (sectionId.startsWith('custom-')) {
            const idx = parseInt(sectionId.split('-')[1]);
            return cvData.skills.custom?.[idx]?.content || '';
          }
          return '';
        };

        const order = cvData.skills.order || ['technical', 'soft', 'languages'];
        const visibleSections = order.filter(hasSection);
        
        if (visibleSections.length > 0) {
          const sectionTitle = cvData.skills.title || t('competencies');
          addSectionHeader(sectionTitle);
          
          visibleSections.forEach((sectionId) => {
            const title = getSectionTitle(sectionId);
            const content = getSectionContent(sectionId);
            if (title && content) {
              addText(`${title}:`, 11, true, THEME_TEXT);
              currentY += 4;
              addText(content, 10, false, [55, 65, 81]);
              currentY += itemSpacing;
            }
          });
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
