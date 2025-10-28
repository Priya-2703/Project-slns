// YellowCursor.jsx
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useAnimate } from "framer-motion";

export default function YellowCursor({ size = 12, hideNative = true }) {
  const [isMobile, setIsMobile] = useState(false);
  const x = useMotionValue(
    typeof window !== "undefined" ? window.innerWidth / 2 : 0
  );
  const y = useMotionValue(
    typeof window !== "undefined" ? window.innerHeight / 2 : 0
  );
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState([]);

  const scale = useSpring(1, { stiffness: 300, damping: 20 });
  const [scope, animate] = useAnimate();

  // 📱 MOBILE/TABLET DETECTION
  useEffect(() => {
    const checkDevice = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) ||
        window.innerWidth < 1024 || // Tablet width
        "ontouchstart" in window || // Touch support
        navigator.maxTouchPoints > 0; // Touch points

      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    // 🚫 Don't run cursor logic on mobile/tablet
    if (isMobile) return;

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const target = e.target;

      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "IMG" ||
        target.tagName === "LINK" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.onclick ||
        target.parentElement?.onclick ||
        target.hasAttribute("data-cursor-scale") ||
        !!target.closest("[data-cursor-scale]") ||
        target.style.cursor === "pointer" ||
        window.getComputedStyle(target).cursor === "pointer" ||
        target.classList.contains("cursor-pointer") ||
        target.classList.contains("hoverable") ||
        target.classList.contains("interactive") ||
        target.classList.contains("clickable") ||
        target.classList.contains("card") ||
        target.classList.contains("product-card") ||
        target.classList.contains("nav-item") ||
        target.classList.contains("menu-item") ||
        target.parentElement?.classList.contains("cursor-pointer") ||
        !!target.closest(".cursor-pointer");

      setIsHovering(isClickable);
    };

    const onMouseDown = (e) => {
      setIsClicking(true);
      animate(
        scope.current,
        { scale: 0.7 },
        { duration: 0.15, ease: "easeOut" }
      );

      const ripple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    };

    const onMouseUp = () => {
      setIsClicking(false);
      animate(scope.current, { scale: 1 }, { duration: 0.3, ease: "easeOut" });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    const prev = document.body.style.cursor;
    if (hideNative) {
      document.body.style.cursor = "none";
      const style = document.createElement("style");
      style.id = "custom-cursor-style";
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = prev;
      const style = document.getElementById("custom-cursor-style");
      if (style) style.remove();
    };
  }, [x, y, hideNative, animate, scope, isMobile]);

  useEffect(() => {
    if (!isClicking) {
      scale.set(isHovering ? 1.6 : 1);
    }
  }, [isHovering, scale, isClicking]);

  // 🚫 MOBILE/TABLET LA RENDER PANNAMA IRUKKUM
  if (isMobile) return null;

  return (
    <>
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "fixed",
            left: ripple.x,
            top: ripple.y,
            translateX: "-50%",
            translateY: "-50%",
            width: size,
            height: size,
            borderRadius: "50%",
            border: "2px solid white",
            pointerEvents: "none",
            zIndex: 9997,
          }}
        />
      ))}

      <motion.div
        ref={scope}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          x,
          y,
          scale,
          translateX: "-50%",
          translateY: "-50%",
          width: size,
          height: size,
          borderRadius: "50%",
          background: "white",
          boxShadow: isHovering
            ? "0 0 20px rgb(255, 255, 255,1)"
            : "0 0 10px rgb(255, 255, 255, .9)",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
        }}
      />
    </>
  );
}
