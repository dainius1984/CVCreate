import React, { useRef, useEffect, useState } from 'react';
import CVPreview from '../assets/CVPreview.jsx';

const PreviewContainer = ({ cvData, cvRef }) => {
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [guideHeightPx, setGuideHeightPx] = useState(0);
  const [contentHeightPx, setContentHeightPx] = useState(0);

  useEffect(() => {
    const updateScale = () => {
      const cvEl = cvRef.current;
      const container = previewContainerRef.current;
      if (!cvEl || !container) return;
      const cvHeight = cvEl.scrollHeight;
      const containerHeight = container.clientHeight;
      if (!cvHeight || !containerHeight) return;
      const scale = Math.min(1, (containerHeight - 24) / cvHeight);
      setPreviewScale(scale > 0 && isFinite(scale) ? scale : 1);

      // Update page guide metrics (A4 ratio ≈ 1.414)
      const a4Ratio = 1.41421356237;
      const pageHeight = Math.round(cvEl.clientWidth * a4Ratio);
      setGuideHeightPx(pageHeight);
      setContentHeightPx(cvHeight);
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    const cvEl = cvRef.current;
    let ro;
    if (cvEl && 'ResizeObserver' in window) {
      ro = new ResizeObserver(updateScale);
      ro.observe(cvEl);
    }
    return () => {
      window.removeEventListener('resize', updateScale);
      if (ro) ro.disconnect();
    };
  }, [cvRef]);

  return (
    <div ref={previewContainerRef} className="w-full lg:w-1/2 p-4 lg:p-8 flex justify-center overflow-y-auto">
      <div
        style={{
          transform: `scale(${previewScale})`,
          transformOrigin: 'top center',
          backgroundImage: 'none'
        }}
      >
        <CVPreview cvData={cvData} cvRef={cvRef} />
      </div>
    </div>
  );
};

export default PreviewContainer;
