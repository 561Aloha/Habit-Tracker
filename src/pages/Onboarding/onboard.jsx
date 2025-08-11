// src/pages/Onboarding/onboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import arrowIcon from "/src/assets/arrow.svg";
import logoImg from "/src/assets/icon.png";
import closeIcon from "/src/assets/close.svg";

import './onboarding.css';

const QUESTIONS = [
  { id: "q1", prompt: "How often do you feel mentally or physically drained?", options: ["Always", "Often", "Sometimes", "Rarely"] },
  { id: "q2", prompt: "Do you overthink?", options: ["Always", "Often", "Sometimes", "Rarely"] },
  { id: "q3", prompt: "Do you sleep poorly?", options: ["Always", "Often", "Sometimes", "Rarely"] },
  { id: "q4", prompt: "Do you skip self-care?", options: ["Always", "Often", "Sometimes", "Rarely"] },
  { id: "q5", prompt: "Do you feel like you spend too much time on your phone?", options: ["Always", "Often", "Sometimes", "Rarely"] },
  { id: "q6", prompt: "What are you looking to achieve?", options: ["Build awareness of my habits", "Break out of bad habits", "Visualize Daily Progress", "Maintain Healthy Habits"] },
  { id: "q7", prompt: "What do you struggle with the most (Select all that apply)", options: ["Anxiety", "Self-Doubt", "Burnout", "Loneliness"], multi: true }
];

export default function ZenoOnboarding({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[current];
  const total = QUESTIONS.length;
  const progress = useMemo(() => Math.round(((current + 1) / total) * 100), [current, total]);

  const handleSelect = (value) => {
    if (q.multi) {
      const prev = answers[q.id] || [];
      const next = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value];
      setAnswers({ ...answers, [q.id]: next });
    } else {
      const nextAnswers = { ...answers, [q.id]: value };
      setAnswers(nextAnswers);
      goNext(nextAnswers);
    }
  };

  const goNext = (nextAnswers = answers) => {
    if (current < total - 1) {
      setCurrent(c => c + 1);
    } else {
      localStorage.setItem("zeno_onboarding_done", "true");
      onComplete?.(nextAnswers);
      setFinished(true);
    }
  };

  const goBack = () => { if (current > 0) setCurrent(c => c - 1); };

  if (finished) {
    return (
      <div className="screen" style={{ placeItems: 'center' }}>
        <div className="brand-left" style={{ marginBottom: 8 }}>
          <img src={logoImg} alt="Zeno Logo" className="logo-zeno" />
          <span className="brand-name">Zeno</span>
        </div>
        <h2 className="question" style={{ textAlign: 'center' }}>You’re all set</h2>
        <p className="hint">Thanks for completing onboarding.</p>
          <button
              type="button"
              className="next-btn"
              onClick={() => window.location.href = '/walkthrough'}
          >
            Let’s walk you through the platform
      </button>
      </div>
    );
  }

  return (
    <div className="screen">
            <div className="onboarding-close">
  <button type="button" onClick={() => window.location.href = '/goal'}>
    <img src={closeIcon} alt="Close Onboarding" className="close-icon" />
  </button>
</div>
       <header className="header-row">

      <div className="brand-left">
        <img src={logoImg} alt="Zeno Logo" className="logo-zeno" />
        <span className="brand-name">Zeno</span>
      </div>

      <div className="progress-wrap">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </header>


      <div className="qa-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <h2 className="question">{q.prompt}</h2>

            <div className="options">
              {q.options.map(opt => {
                const selected = q.multi ? (answers[q.id] || []).includes(opt) : answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`option-tile ${selected ? 'selected' : ''}`}
                    onClick={() => handleSelect(opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="footer">
              <button
                type="button"
                className="back-btn"
                onClick={goBack}
                disabled={current === 0}
              >
                <img src={arrowIcon} alt="Back" className="back-icon" />
                Go back
              </button>

              {q.multi ? (
                <button type="button" className="next-btn" onClick={() => goNext()}>
                  Next
                </button>
              ) : (
                <span className="hint">Tap an option to continue</span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="skip-wrap">
  <button 
    type="button" 
    className="skip-btn" 
    onClick={() => {
      localStorage.setItem("zeno_onboarding_done", "true");
      window.location.href = '/goal';
    }}
  >
    Skip Onboarding
  </button>
</div>

      </div>
    </div>
  );
}
