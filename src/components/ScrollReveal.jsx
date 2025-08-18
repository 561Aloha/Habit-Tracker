// src/components/ScrollRevealBackdrop.jsx
import React, { useEffect, useRef } from "react";
import "./ScrollRevealBackdrop.css";
import HeroImage from "../assets/hero-image.jpeg";

export default function ScrollRevealBackdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight || 1;
      const p = Math.min(window.scrollY / h, 1);
      ref.current?.style.setProperty("--p", p.toString());
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="sr-wrap" ref={ref}>
      <div className="sr-stage">
        {[...Array(9)].map((_, i) => (
          <div key={i} className={`sr-layer l${i + 1}`} />
        ))}

        {/* l10 holds the hero */}
        <div className="sr-layer l10">
          <div className="sr-hero">
            <img src={HeroImage} alt="Hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
