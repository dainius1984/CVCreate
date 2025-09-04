import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

export class CVPdfExporter {
  static async exportToPdf(cvElement, cvData) {
    try {
      if (!cvElement) {
        console.error('CV element not found.');
        return;
      }

      // Temporarily add class to remove shadows and guides during capture
      cvElement.classList.add('exporting');
      
      // Hide page break indicators and page numbers during export
      const pageBreakIndicators = cvElement.parentElement?.querySelectorAll('[style*="borderTop"][style*="dashed"]');
      const pageNumbers = cvElement.parentElement?.querySelectorAll('[style*="backgroundColor"][style*="#3b82f6"]');
      const leftGuideLine = cvElement.parentElement?.querySelector('[style*="backgroundColor"][style*="rgba(34, 197, 94"]');
      
      // Store original display values to restore later
      const originalDisplays = [];
      
      if (pageBreakIndicators) {
        pageBreakIndicators.forEach(el => {
          originalDisplays.push({ element: el, display: el.style.display });
          el.style.display = 'none';
        });
      }
      if (pageNumbers) {
        pageNumbers.forEach(el => {
          originalDisplays.push({ element: el, display: el.style.display });
          el.style.display = 'none';
        });
      }
      if (leftGuideLine) {
        originalDisplays.push({ element: leftGuideLine, display: leftGuideLine.style.display });
        leftGuideLine.style.display = 'none';
      }
      
      // Wait a moment for CSS changes to take effect
      await new Promise(resolve => setTimeout(resolve, 100));

      const exportWidth = cvElement.scrollWidth;
      const exportHeight = cvElement.scrollHeight;
      
      console.log('PDF Export - Element dimensions:', { exportWidth, exportHeight });
      console.log('PDF Export - Element content:', cvElement.innerHTML.substring(0, 200));

      // PDF setup - A4 dimensions in points
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 595.28 pts
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 841.89 pts
      
      // Margins in points (1 inch = 72 pts, so ~0.75 inch margins)
      const margin = 54; // 54pts = 0.75 inches
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);

      // Calculate how the CV scales to fit PDF width
      const scaleRatio = contentWidth / exportWidth;
      const scaledHeight = exportHeight * scaleRatio;

      // Find all sections AND bullet points for smart page breaks
      const sections = cvElement.querySelectorAll('[data-section]');
      const bulletPoints = cvElement.querySelectorAll('li[data-break], li');
      const breakPoints = [];
      
      console.log('PDF Export - Sections found:', sections.length);
      console.log('PDF Export - Bullet points found:', bulletPoints.length);
      
      // Add section boundaries
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const cvRect = cvElement.getBoundingClientRect();
        const relativeTop = rect.top - cvRect.top + cvElement.scrollTop;
        const relativeBottom = relativeTop + section.offsetHeight;
        
        breakPoints.push({
          element: section,
          top: relativeTop * scaleRatio,
          bottom: relativeBottom * scaleRatio,
          type: 'section',
          priority: 1, // High priority
          name: section.getAttribute('data-section') || `section-${index}`
        });
      });

      // Add bullet point boundaries
      bulletPoints.forEach((bullet, index) => {
        const rect = bullet.getBoundingClientRect();
        const cvRect = cvElement.getBoundingClientRect();
        const relativeTop = rect.top - cvRect.top + cvElement.scrollTop;
        const relativeBottom = relativeTop + bullet.offsetHeight;
        
        breakPoints.push({
          element: bullet,
          top: relativeTop * scaleRatio,
          bottom: relativeBottom * scaleRatio,
          type: 'bullet',
          priority: 2, // Medium priority
          name: `bullet-${index}`
        });
      });

      // Sort break points by position
      breakPoints.sort((a, b) => a.top - b.top);
      console.log('PDF Export - Break points found:', breakPoints);

      // Generate high-quality image
      const dataUrl = await toJpeg(cvElement, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        quality: 0.9,
        width: exportWidth,
        height: exportHeight,
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Smart pagination logic
      let currentPageTop = 0;
      let pageNumber = 1;
      const maxPages = 10;
      const epsilon = 1; // threshold in pts to consider we're at the end

      // Loop while there's content left to render and we haven't exceeded max pages.
      while (currentPageTop < scaledHeight - epsilon && pageNumber <= maxPages) { 

        // Fill page background
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

        // Calculate the ideal end position for this page
        const idealPageBottom = currentPageTop + contentHeight;
        let actualPageBottom = idealPageBottom;

        // Find the best break point for this page
        if (currentPageTop + contentHeight < scaledHeight) {
          let bestBreakPoint = idealPageBottom;
          let bestPriority = 999;
          let minDistance = Infinity;

          // Look for break points near the ideal position
          breakPoints.forEach(bp => {
            const isInRange = bp.bottom > currentPageTop + (contentHeight * 0.7) && 
                             bp.bottom <= idealPageBottom + (contentHeight * 0.15);
            
            if (isInRange) {
              const distance = Math.abs(bp.bottom - idealPageBottom);
              // Prioritize by type (sections > bullets) then by distance
              if (bp.priority < bestPriority || (bp.priority === bestPriority && distance < minDistance)) {
                bestBreakPoint = bp.bottom;
                bestPriority = bp.priority;
                minDistance = distance;
              }
            }
          });

          actualPageBottom = Math.min(bestBreakPoint, scaledHeight);
        } else {
          actualPageBottom = scaledHeight;
        }

        // Add proper spacing - create a clipping mask to ensure margins
        pdf.saveGraphicsState();
        pdf.rect(margin, margin, contentWidth, contentHeight);
        pdf.clip();

        // Draw the image portion for this page
        const pageContentHeight = actualPageBottom - currentPageTop;
        pdf.addImage(
          dataUrl,
          'JPEG',
          margin,
          margin - currentPageTop,
          contentWidth,
          pageContentHeight
        );

        pdf.restoreGraphicsState();

        // No guide lines in PDF export - clean output only

        console.log(`Page ${pageNumber}: ${currentPageTop.toFixed(1)} to ${actualPageBottom.toFixed(1)}`);

        // Move to next page
        // No overlap to prevent content duplication
        currentPageTop = actualPageBottom;
        if (scaledHeight - currentPageTop > epsilon && pageNumber < maxPages) {
          pdf.addPage();
          pageNumber++;
        } else {
          break;
        }
      }

      // Save the PDF
      const fileName = `${cvData.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'CV'}_Resume.pdf`;
      pdf.save(fileName);

      cvElement.classList.remove('exporting');
      
      // Restore page break indicators and page numbers visibility
      originalDisplays.forEach(({ element, display }) => {
        element.style.display = display;
      });
      
      console.log(`PDF generated successfully with ${pageNumber - 1} pages`);

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      try { 
        cvElement?.classList.remove('exporting'); 
        
        // Restore page break indicators and page numbers visibility in case of error
        if (typeof originalDisplays !== 'undefined') {
          originalDisplays.forEach(({ element, display }) => {
            element.style.display = display;
          });
        }
      } catch (e) {
        console.error('Error removing exporting class:', e);
      }
    }
  }
}
