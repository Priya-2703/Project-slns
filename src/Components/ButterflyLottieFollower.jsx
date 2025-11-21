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
  hoverDistance = 50,
  idleWingSpeed = 0.4, // 🦋 Cursor நிற்கும்போது wing speed
  idleThreshold = 0.5, // Cursor எத்தனை நேரம் நின்னா idle ஆகும் (seconds)
}) {
  const [anim, setAnim] = useState(animationData ?? null);
  const [isMobile, setIsMobile] = useState(false);
  const lottieRef = useRef(null);

  const x = useMotionValue(
    typeof window !== "undefined" ? window.innerWidth / 2 : 0
  );
  const y = useMotionValue(
    typeof window !== "undefined" ? window.innerHeight / 2 : 0
  );
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

  // 🖱️ Cursor movement tracking
  const cursorPos = useRef({ x: 0, y: 0 });
  const lastCursorMoveTime = useRef(0);
  const orbitAngle = useRef(Math.random() * Math.PI * 2);

  // 📱 Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
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
      return () => {
        alive = false;
      };
    }
  }, [url, anim]);

  // Set initial wing speed
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

    // Desktop: follow mouse (but maintain distance)
    if (!isMobile) {
      onMove = (e) => {
        const prevX = cursorPos.current.x;
        const prevY = cursorPos.current.y;

        cursorPos.current.x = e.clientX;
        cursorPos.current.y = e.clientY;

        // Check if cursor actually moved
        const moved = Math.hypot(e.clientX - prevX, e.clientY - prevY) > 2;

        if (moved) {
          lastCursorMoveTime.current = Date.now();

          // 🦋 Cursor move ஆகுது - normal wing speed
          if (lottieRef.current) {
            lottieRef.current.setSpeed(wingSpeed);
          }
        }

        // 🎯 Calculate target position around cursor (orbit style)
        orbitAngle.current += 0.02;

        const offsetX = Math.cos(orbitAngle.current) * hoverDistance;
        const offsetY = Math.sin(orbitAngle.current) * hoverDistance;

        target.current.x = e.clientX + offsetX;
        target.current.y = e.clientY + offsetY;
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

      // 🖱️ DESKTOP: Check cursor idle time
      if (!isMobile) {
        const timeSinceLastMove =
          (Date.now() - lastCursorMoveTime.current) / 1000;

        // 🦋 Cursor idle ஆ இருக்கா? - slow wings
        if (lottieRef.current) {
          if (timeSinceLastMove > idleThreshold) {
            lottieRef.current.setSpeed(idleWingSpeed); // Slow
          } else {
            lottieRef.current.setSpeed(wingSpeed); // Normal
          }
        }

        // Continue gentle orbit
        orbitAngle.current += dt * 0.5;
        const offsetX = Math.cos(orbitAngle.current) * hoverDistance;
        const offsetY = Math.sin(orbitAngle.current) * hoverDistance;
        target.current.x = cursorPos.current.x + offsetX;
        target.current.y = cursorPos.current.y + offsetY;
      }

      // 🦋 MOBILE: Random flying with rest periods
      if (isMobile) {
        if (isResting.current) {
          restTimer.current += dt;

          if (lottieRef.current && restTimer.current < 0.5) {
            lottieRef.current.setSpeed(0.3);
          }

          const restDuration = 2 + Math.random();
          if (restTimer.current >= restDuration) {
            isResting.current = false;
            flyTimer.current = 0;
            target.current = generateRandomTarget();

            if (lottieRef.current) {
              lottieRef.current.setSpeed(wingSpeed);
            }
          }
        } else {
          flyTimer.current += dt;

          const dx = target.current.x - pos.current.x;
          const dy = target.current.y - pos.current.y;
          const dist = Math.hypot(dx, dy);

          const flyDuration = 10 + Math.random() * 5;
          if (dist < 50 || flyTimer.current >= flyDuration) {
            isResting.current = true;
            restTimer.current = 0;
            vel.current.x *= 0.1;
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
      pos.current.x = Math.max(
        m,
        Math.min(window.innerWidth - m, pos.current.x)
      );
      pos.current.y = Math.max(
        m,
        Math.min(window.innerHeight - m, pos.current.y)
      );

      // Face movement direction
      if (!isMobile || !isResting.current) {
        const angleDeg =
          (Math.atan2(vel.current.y, vel.current.x) * 180) / Math.PI;
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
  }, [
    x,
    y,
    rotate,
    faceOffsetDeg,
    seed,
    anim,
    isMobile,
    wingSpeed,
    hoverDistance,
    idleWingSpeed,
    idleThreshold,
  ]);

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
