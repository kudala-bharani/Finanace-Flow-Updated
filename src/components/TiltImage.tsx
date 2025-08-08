import React, { useRef } from 'react';

interface TiltImageProps {
  src: string;
  alt: string;
  width?: number;
}

const TiltImage: React.FC<TiltImageProps> = ({ src, alt, width = 320 }) => {
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10; // max 10deg
    const rotateY = ((x - centerX) / centerX) * 10;
    el.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  };

  const handleMouseLeave = () => {
    const el = imgRef.current;
    if (el) {
      el.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    }
  };

  return (
    <div style={{ perspective: '1000px', display: 'inline-block' }}>
      <div
        ref={imgRef}
        style={{ width, transition: 'transform 0.3s cubic-bezier(.03,.98,.52,.99)' }}
        className="rounded-xl shadow-xl will-change-transform"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', display: 'block', objectFit: 'cover', borderRadius: 'inherit' }}
        />
      </div>
    </div>
  );
};

export default TiltImage; 