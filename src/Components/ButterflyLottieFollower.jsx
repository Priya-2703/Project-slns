// ButterflyLottieFollower.jsx
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import Lottie from "lottie-react";

export default function ButterflyLottieFollower({
  animationData,
  url,
  size = 50,
  faceOffsetDeg = 90,
  zIndex = 9999,
  wingSpeed = 2,
}) {
  const [anim, setAnim] = useState(animationData ?? null);
  const [isMobile, setIsMobile] = useState(false);
  const lottieRef = useRef(null);

  const x = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const y = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const rotate = useMotionValue(0);

  const target = useRef({ x: x.get(), y: y.get() });
  const pos = useRef({ x: x.get(), y: y.get() });
  const vel = useRef({ x: 0, y: 0 });
  const last = useRef(0);
  const seed = useRef(Math.random() * 1000).current;

  // 🦋 Mobile behavior states
  const isResting = useRef(false);
  const restTimer = useRef(0);
  const flyTimer = useRef(0);

  // 📱 Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load from URL
  useEffect(() => {
    if (!anim && url) {
      let alive = true;
      (async () => {
        const res = await fetch(url);
        const json = await res.json();
        if (alive) setAnim(json);
      })();
      return () => { alive = false; };
    }
  }, [url, anim]);

  // Set wing speed
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(wingSpeed);
    }
  }, [anim, wingSpeed]);

  // 🎯 Generate random target position
  const generateRandomTarget = () => {
    const margin = 50;
    return {
      x: margin + Math.random() * (window.innerWidth - margin * 2),
      y: margin + Math.random() * (window.innerHeight - margin * 2),
    };
  };

  useEffect(() => {
    let onMove;
    
    // Desktop: follow mouse
    if (!isMobile) {
      onMove = (e) => {
        target.current.x = e.clientX;
        target.current.y = e.clientY;
      };
      window.addEventListener("mousemove", onMove);
    } else {
      // Mobile: set initial random target
      target.current = generateRandomTarget();
    }

    let raf;
    const loop = (now) => {
      if (!last.current) last.current = now;
      const dt = Math.min((now - last.current) / 1000, 1 / 30);
      last.current = now;

      // 🦋 MOBILE: Random flying with rest periods
      if (isMobile) {
        if (isResting.current) {
          // 😴 Resting/Sitting
          restTimer.current += dt;
          
          // Slow down wings when resting
          if (lottieRef.current && restTimer.current < 0.5) {
            lottieRef.current.setSpeed(0.3);
          }

          // Rest for 2-3 seconds
          const restDuration = 2 + Math.random(); 
          if (restTimer.current >= restDuration) {
            isResting.current = false;
            flyTimer.current = 0;
            target.current = generateRandomTarget(); // New random destination
            
            // Resume normal wing speed
            if (lottieRef.current) {
              lottieRef.current.setSpeed(wingSpeed);
            }
          }
        } else {
          // 🦋 Flying
          flyTimer.current += dt;

          const dx = target.current.x - pos.current.x;
          const dy = target.current.y - pos.current.y;
          const dist = Math.hypot(dx, dy);

          // Check if reached destination or flew too long
          const flyDuration = 10 + Math.random() * 5; // 3-5 seconds
          if (dist < 50 || flyTimer.current >= flyDuration) {
            isResting.current = true;
            restTimer.current = 0;
            vel.current.x *= 0.1; // Slow down
            vel.current.y *= 0.1;
          }
        }
      }

      // Skip movement if resting (mobile only)
      if (isMobile && isResting.current) {
        raf = requestAnimationFrame(loop);
        return;
      }

      // ✈️ Movement physics
      const MAX_SPEED = isMobile ? 600 : 1500;
      const MAX_FORCE = isMobile ? 1000 : 2400;
      const ARRIVE_RADIUS = 140;

      const dx = target.current.x - pos.current.x;
      const dy = target.current.y - pos.current.y;
      const dist = Math.hypot(dx, dy) || 1;

      let desiredSpeed = MAX_SPEED;
      if (dist < ARRIVE_RADIUS) {
        desiredSpeed = MAX_SPEED * (dist / ARRIVE_RADIUS);
      }

      const desiredVelX = (dx / dist) * desiredSpeed;
      const desiredVelY = (dy / dist) * desiredSpeed;

      let steerX = desiredVelX - vel.current.x;
      let steerY = desiredVelY - vel.current.y;

      const steerMag = Math.hypot(steerX, steerY) || 1;
      if (steerMag > MAX_FORCE) {
        steerX = (steerX / steerMag) * MAX_FORCE;
        steerY = (steerY / steerMag) * MAX_FORCE;
      }

      // Add wobble for mobile (natural movement)
      if (isMobile) {
        const t = now * 0.001;
        const wobbleX = Math.sin(t * 2.3 + seed) * 100;
        const wobbleY = Math.cos(t * 2.1 + seed) * 100;
        steerX += wobbleX;
        steerY += wobbleY;
      }

      // Drag
      const drag = 0.88;
      vel.current.x *= drag;
      vel.current.y *= drag;

      vel.current.x += steerX * dt;
      vel.current.y += steerY * dt;

      const spd = Math.hypot(vel.current.x, vel.current.y) || 1;
      if (spd > MAX_SPEED) {
        vel.current.x = (vel.current.x / spd) * MAX_SPEED;
        vel.current.y = (vel.current.y / spd) * MAX_SPEED;
      }

      pos.current.x += vel.current.x * dt;
      pos.current.y += vel.current.y * dt;

      // Keep within bounds
      const m = 10;
      pos.current.x = Math.max(m, Math.min(window.innerWidth - m, pos.current.x));
      pos.current.y = Math.max(m, Math.min(window.innerHeight - m, pos.current.y));

      // Face movement direction
      if (!isMobile || !isResting.current) {
        const angleDeg = (Math.atan2(vel.current.y, vel.current.x) * 180) / Math.PI;
        rotate.set(angleDeg + faceOffsetDeg);
      }

      x.set(pos.current.x);
      y.set(pos.current.y);

      raf = requestAnimationFrame(loop);
    };
    
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      if (onMove) window.removeEventListener("mousemove", onMove);
    };
  }, [x, y, rotate, faceOffsetDeg, seed, anim, isMobile, wingSpeed]);

  if (!anim) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x,
        y,
        rotate,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
        zIndex,
        willChange: "transform",
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={anim}
        loop
        autoplay
        style={{ width: size, height: size }}
      />
    </motion.div>
  );
}