import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'leaf' | 'sparkle';
  color: string;
}

export const FloatingLeavesCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor(width / 35), 45);

    const colors = [
      'rgba(239, 68, 68, ',  // Bright Crimson Red
      'rgba(212, 175, 55, ',  // Gold
      'rgba(185, 28, 28, ',   // Deep Flame Red
      'rgba(245, 158, 11, '   // Ember Gold
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 6,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: Math.random() * 0.7 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.4 + 0.15,
        type: Math.random() > 0.4 ? 'leaf' : 'sparkle',
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const drawLeaf = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.type === 'leaf') {
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.6, -p.size * 0.5, 0, -p.size);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();

        // Stem line
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.8);
        ctx.lineTo(0, p.size * 1.1);
        ctx.strokeStyle = `rgba(212, 175, 55, ${p.opacity * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // Glowing gold dust particle
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 0.8);
        gradient.addColorStop(0, `${p.color}${p.opacity * 1.5})`);
        gradient.addColorStop(1, `${p.color}0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Parallax slight drift towards mouse
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.x -= (dx / dist) * 0.4;
          p.y -= (dy / dist) * 0.4;
        }

        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.3;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawLeaf(ctx, p);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-70"
      aria-hidden="true"
    />
  );
};
