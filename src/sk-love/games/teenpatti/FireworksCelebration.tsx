import React, { useEffect, useRef } from "react";
import { teenPattiAudio } from "./TeenPattiSoundEngine";

interface Props {
  active: boolean;
  duration?: number;
}

export default function FireworksCelebration({ active, duration = 4000 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const particles: Particle[] = [];
    const fireworks: Firework[] = [];
    let animationFrameId: number;
    const startTime = Date.now();

    const colors = [
      "#ff0055",
      "#ff5500",
      "#ffcc00",
      "#33ff00",
      "#00ffff",
      "#0066ff",
      "#cc00ff",
      "#ffffff",
      "#ff99bb",
      "#facc15",
    ];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      decay: number;
      size: number;
      trail: { x: number; y: number }[];

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6.5 + 2.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
        this.alpha = 1;
        this.decay = Math.random() * 0.016 + 0.014;
        this.size = Math.random() * 2.8 + 1.2;
        this.trail = [];
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) this.trail.shift();

        this.vx *= 0.96;
        this.vy *= 0.96;
        this.vy += 0.07; // Gravity
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        // Draw tail
        if (this.trail.length > 1) {
          c.save();
          c.beginPath();
          c.moveTo(this.trail[0].x, this.trail[0].y);
          for (let i = 1; i < this.trail.length; i++) {
            c.lineTo(this.trail[i].x, this.trail[i].y);
          }
          c.strokeStyle = this.color;
          c.lineWidth = this.size * 0.7;
          c.globalAlpha = Math.max(this.alpha * 0.45, 0);
          c.stroke();
          c.restore();
        }

        // Draw particle head
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.shadowColor = this.color;
        c.shadowBlur = 8;
        c.globalAlpha = Math.max(this.alpha, 0);
        c.fill();
        c.restore();
      }
    }

    class Firework {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      color: string;
      exploded: boolean;

      constructor(startX: number, startY: number, targetX: number, targetY: number) {
        this.x = startX;
        this.y = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        const angle = Math.atan2(targetY - startY, targetX - startX);
        const dist = Math.hypot(targetX - startX, targetY - startY);
        const speed = Math.min(dist / 22, 14);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.exploded = false;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (Math.hypot(this.targetX - this.x, this.targetY - this.y) < 12 || this.vy >= 0) {
          this.exploded = true;
          this.explode();
        }
      }

      explode() {
        const particleCount = 70 + Math.floor(Math.random() * 40);
        const explosionColor = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < particleCount; i++) {
          const pColor = Math.random() > 0.3 ? explosionColor : colors[Math.floor(Math.random() * colors.length)];
          particles.push(new Particle(this.x, this.y, pColor));
        }
        try {
          teenPattiAudio.playFireworksBurst();
        } catch (e) {}
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        c.fillStyle = "#ffffff";
        c.shadowColor = this.color;
        c.shadowBlur = 10;
        c.fill();
        c.restore();
      }
    }

    // Launch multiple bursts
    let lastLaunch = 0;
    const launchInterval = 380;

    const loop = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, width, height);

      if (elapsed < duration) {
        if (now - lastLaunch > launchInterval) {
          lastLaunch = now;
          const startX = width * (0.2 + Math.random() * 0.6);
          const startY = height;
          const targetX = width * (0.15 + Math.random() * 0.7);
          const targetY = height * (0.15 + Math.random() * 0.45);
          fireworks.push(new Firework(startX, startY, targetX, targetY));
        }
      }

      // Update & draw fireworks rockets
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        fw.update();
        fw.draw(ctx);
        if (fw.exploded) {
          fireworks.splice(i, 1);
        }
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      if (elapsed < duration + 1500 || particles.length > 0) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    // Trigger initial instant bursts
    fireworks.push(new Firework(width * 0.3, height, width * 0.3, height * 0.28));
    fireworks.push(new Firework(width * 0.7, height, width * 0.7, height * 0.25));
    fireworks.push(new Firework(width * 0.5, height, width * 0.5, height * 0.2));

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, duration]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-hidden"
    />
  );
}
