// src/pages/Onboarding/onboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../client"; // ADDED: Import supabase
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
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // ADDED: Loading state

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

  const completeOnboarding = async (finalAnswers = answers) => {
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update UserData table
        const { error: dbError } = await supabase
          .from("UserData")
          .upsert({
            user_id: user.id,
            email: user.email,
            onboarding_completed: true,
            authen_seen: true,
            onboarding_answers: finalAnswers, // Store answers if needed
            updated_at: new Date().toISOString()
          });

        // Update user metadata for fast future lookups
        const { error: metaError } = await supabase.auth.updateUser({
          data: { 
            onboarding_completed: true 
          }
        });

        if (dbError) {
          console.error('Database update error:', dbError);
        }
        if (metaError) {
          console.error('Metadata update error:', metaError);
        }

        localStorage.setItem("zeno_onboarding_done", "true");
        
        onComplete?.(finalAnswers);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsUpdating(false);
      setFinished(true);
    }
  };

  const goNext = (nextAnswers = answers) => {
    if (current < total - 1) {
      setCurrent(c => c + 1);
    } else {
      completeOnboarding(nextAnswers);
    }
  };

  const goBack = () => { if (current > 0) setCurrent(c => c - 1); };

  // UPDATED: Handle skip with proper Supabase updates
  const handleSkip = async () => {
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Still mark as completed even if skipped
        await supabase
          .from("UserData")
          .upsert({
            user_id: user.id,
            email: user.email,
            onboarding_completed: true,
            authen_seen: true,
            skipped_onboarding: true, // Optional: track that it was skipped
            updated_at: new Date().toISOString()
          });

        await supabase.auth.updateUser({
          data: { 
            onboarding_completed: true 
          }
        });
      }

      localStorage.setItem("zeno_onboarding_done", "true");
      navigate('/goal', { replace: true });
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      // Navigate anyway to prevent user from getting stuck
      navigate('/goal', { replace: true });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = async () => {
    // Same as skip - mark as completed
    await handleSkip();
  };

  if (finished) {
    return (
      <div className="screen">
        <div className="brand-left" style={{ marginBottom: 8 }}>
          <img src={logoImg} alt="Zeno Logo" className="logo-zeno" />
          <span className="brand-name">Zeno</span>
        </div>
        <h2 className="question" style={{ textAlign: 'center' }}>You're all set</h2>
        <p className="hint">Thanks for completing onboarding.</p>
        <button
          type="button"
          className="next-btn"
          onClick={() => navigate('/walkthrough', { replace: true })}
          disabled={isUpdating}
        >
          {isUpdating ? 'Setting up...' : "Let's walk you through the platform"}
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="onboarding-close">
        <button type="button" onClick={handleClose} disabled={isUpdating}>
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
                    disabled={isUpdating}
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
                disabled={current === 0 || isUpdating}
              >
                <img src={arrowIcon} alt="Back" className="back-icon" />
                Go back
              </button>

              {q.multi ? (
                <button 
                  type="button" 
                  className="next-btn" 
                  onClick={() => goNext()}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Next'}
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
            onClick={handleSkip}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Skip Onboarding'}
          </button>
        </div>
      </div>
    </div>
  );
}