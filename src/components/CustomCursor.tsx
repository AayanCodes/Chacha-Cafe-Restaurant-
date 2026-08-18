import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
      {/* Outer Glowing Ring */}
      <div
        className={`fixed pointer-events-none z-50 rounded-full transition-transform duration-100 ease-out hidden md:block border border-[#D4AF37]/60 ${
          isHovered ? 'scale-150 bg-[#D4AF37]/15 border-[#D4AF37]' : 'scale-100'
        } ${isClicked ? 'scale-75' : ''}`}
        style={{
          width: '36px',
          height: '36px',
          left: `${position.x - 18}px`,
          top: `${position.y - 18}px`,
          boxShadow: isHovered ? '0 0 20px rgba(212, 175, 55, 0.4)' : '0 0 10px rgba(212, 175, 55, 0.2)'
        }}
      />
      {/* Center Solid Dot */}
      <div
        className="fixed pointer-events-none z-50 rounded-full bg-[#D4AF37] hidden md:block transition-transform duration-75"
        style={{
          width: '6px',
          height: '6px',
          left: `${position.x - 3}px`,
          top: `${position.y - 3}px`
        }}
      />
    </>
  );
};
