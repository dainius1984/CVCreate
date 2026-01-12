import React, { useCallback, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import Cropper from 'react-easy-crop';

const Photo = ({ photoUrl, onChange, onCroppedChange }) => {
  const { t, language } = useLanguage();
  const [imageSrc, setImageSrc] = useState(photoUrl || '');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || '';
      setImageSrc(result);
      onChange('photoUrl', result);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const onFileSelect = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || '';
      setImageSrc(result);
      onChange('photoUrl', result);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixelsVal) => {
    setCroppedAreaPixels(croppedAreaPixelsVal);
  }, []);

  const createCircularCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });

    const size = Math.max(croppedAreaPixels.width, croppedAreaPixels.height);
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    const radius = size / 2;
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      size,
      size
    );
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCroppedChange?.(dataUrl);
  }, [imageSrc, croppedAreaPixels, onCroppedChange]);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">{t('photo')}</h2>

      <div
        className="w-full border-2 border-dashed rounded-lg p-4 text-center text-gray-600 hover:border-gray-400 transition cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {language === 'pl' ? 'Przeciągnij i upuść zdjęcie tutaj lub kliknij, aby wybrać' : 'Drag & drop an image here, or click to select'}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileSelect} />
      </div>

      {imageSrc && (
        <div className="relative mt-4 h-64 bg-black/5 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {imageSrc && (
        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm text-gray-700">Zoom</label>
          <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
          <button
            type="button"
            onClick={createCircularCroppedImage}
            className="ml-auto bg-emerald-600 text-white px-3 py-2 rounded-md text-sm hover:bg-emerald-700"
          >
            {language === 'pl' ? 'Zastosuj przycięcie' : 'Apply Crop'}
          </button>
        </div>
      )}

      <div className="mt-4">
        <label className="block">
          <span className="text-gray-700">{language === 'pl' ? 'Lub użyj URL zdjęcia' : 'Or use Photo URL'}</span>
          <input
            type="text"
            name="photoUrl"
            value={photoUrl}
            onChange={(e) => onChange('photoUrl', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </label>
      </div>
    </div>
  );
};

export default Photo;


