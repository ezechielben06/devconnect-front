import React, { useEffect, useRef } from 'react';

// Fond atmosphérique léger sans plomber les perfs du GPU.
// 3 gradients radiaux interpolés par des sin/cos désynchronisés pour un rendu fluide et organique.
// Note : bail out direct si l'utilisateur a activé prefers-reduced-motion pour respecter la batterie et l'accessibilité.

export function FluidWebGLCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

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

    let step = 0;
    const render = () => {
      step += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Ambiance principale douce bleu azur (Haut / Centre gauche)
      const grad = ctx.createRadialGradient(
        width * 0.3 + Math.sin(step) * 50,
        height * 0.2 + Math.cos(step) * 50,
        10,
        width * 0.3,
        height * 0.2,
        width * 0.65
      );
      grad.addColorStop(0, 'rgba(0, 102, 255, 0.08)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.05)');
      grad.addColorStop(1, 'rgba(0, 102, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Ambiance secondaire bleu cyan (Bas / Droite)
      const grad2 = ctx.createRadialGradient(
        width * 0.8 + Math.cos(step * 0.8) * 40,
        height * 0.7 + Math.sin(step * 0.8) * 40,
        10,
        width * 0.8,
        height * 0.7,
        width * 0.55
      );
      grad2.addColorStop(0, 'rgba(2, 132, 199, 0.06)');
      grad2.addColorStop(0.6, 'rgba(14, 165, 233, 0.03)');
      grad2.addColorStop(1, 'rgba(0, 102, 255, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Troisième lueur d'équilibrage bleu royal doux
      const grad3 = ctx.createRadialGradient(
        width * 0.55 + Math.sin(step * 0.6) * 40,
        height * 0.45 + Math.cos(step * 0.6) * 30,
        10,
        width * 0.55,
        height * 0.45,
        width * 0.5
      );
      grad3.addColorStop(0, 'rgba(37, 99, 235, 0.05)');
      grad3.addColorStop(1, 'rgba(37, 99, 235, 0)');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
