// src/pages/Onboarding/onboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../client";
import arrowIcon from "/src/assets/arrow.svg";
import logoImg from "/src/assets/icon.png";
import closeIcon from "/src/assets/close.svg";
import shuffleIcon from "/src/assets/shuffle.svg";
import trashIcon from "/src/assets/trash.svg";

import './onboarding.css';

const CATEGORIES = {
  'health': { label: 'Health', imgSrc: './src/assets/health.png' },
  'nutrition': { label: 'Nutrition', imgSrc: './src/assets/nutrition.png' },
  'artistic': { label: 'Artistic', imgSrc: './src/assets/artist.png' },
  'academics': { label: 'Academics', imgSrc: './src/assets/academics.png' },
  'skills': { label: 'Skills Development', imgSrc: './src/assets/skiils.png' },
  'fitness': { label: 'Fitness', imgSrc: './src/assets/25.png' },
  'spiritual': { label: 'Spiritual', imgSrc: './src/assets/pray.png' },
  'financial': { label: 'Financial', imgSrc: './src/assets/26.png' },
  'beauty': { label: 'Beauty', imgSrc: './src/assets/beauty.png' },
  'Career': { label: 'Career', imgSrc: './src/assets/career.png' }
};

const GOAL_OPTIONS = [
  {
    id: "creative",
    label: "Being more creative",
    category: "artistic",
    habits: [
      { name: "Practice drawing/sketching", frequency: ["Monday", "Wednesday", "Friday"] },
      { name: "Write in a creative journal", frequency: ["Daily"] },
      { name: "Try a new art technique", frequency: ["Saturday"] },
      { name: "Take artistic photos", frequency: ["Tuesday", "Thursday"] },
      { name: "Listen to inspiring music", frequency: ["Daily"] },
      { name: "Visit art galleries or museums", frequency: ["Sunday"] }
    ]
  },
  {
    id: "career",
    label: "Excelling in my career",
    category: "Career",
    habits: [
      { name: "Learn a new professional skill", frequency: ["Monday", "Wednesday", "Friday"] },
      { name: "Network with colleagues", frequency: ["Tuesday", "Thursday"] },
      { name: "Read industry articles", frequency: ["Daily"] },
      { name: "Update my resume/portfolio", frequency: ["Sunday"] },
      { name: "Practice presentation skills", frequency: ["Wednesday"] },
      { name: "Seek feedback from mentors", frequency: ["Friday"] }
    ]
  },
  {
    id: "selfcare",
    label: "Prioritizing self care",
    category: "health",
    habits: [
      { name: "Practice meditation", frequency: ["Daily"] },
      { name: "Take a relaxing bath", frequency: ["Sunday", "Wednesday"] },
      { name: "Go for a mindful walk", frequency: ["Saturday", "Sunday"] },
      { name: "Practice deep breathing", frequency: ["Daily"] },
      { name: "Write in a gratitude journal", frequency: ["Daily"] },
      { name: "Stretch before bed", frequency: ["Daily"] }
    ]
  },
  {
    id: "studying",
    label: "Dedicating time to studying",
    category: "academics",
    habits: [
      { name: "Study for 30 minutes", frequency: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
      { name: "Review notes from today", frequency: ["Daily"] },
      { name: "Practice problems", frequency: ["Tuesday", "Thursday", "Saturday"] },
      { name: "Create study flashcards", frequency: ["Sunday"] },
      { name: "Join a study group", frequency: ["Wednesday"] },
      { name: "Take practice quizzes", frequency: ["Friday"] }
    ]
  },
  {
    id: "fitness",
    label: "Getting physically fit",
    category: "fitness",
    habits: [
      { name: "Go to the gym", frequency: ["Monday", "Wednesday", "Friday"] },
      { name: "Take a 20-minute walk", frequency: ["Daily"] },
      { name: "Do yoga", frequency: ["Tuesday", "Thursday", "Sunday"] },
      { name: "Try a fitness class", frequency: ["Saturday"] },
      { name: "Do bodyweight exercises", frequency: ["Monday", "Wednesday", "Friday"] },
      { name: "Go for a run", frequency: ["Tuesday", "Thursday"] }
    ]
  },
  {
    id: "nutrition",
    label: "Eating healthier",
    category: "nutrition",
    habits: [
      { name: "Eat 5 servings of fruits/vegetables", frequency: ["Daily"] },
      { name: "Meal prep for the week", frequency: ["Sunday"] },
      { name: "Drink 8 glasses of water", frequency: ["Daily"] },
      { name: "Cook a healthy meal at home", frequency: ["Tuesday", "Thursday", "Saturday"] },
      { name: "Pack healthy snacks", frequency: ["Monday", "Wednesday", "Friday"] },
      { name: "Try a new healthy recipe", frequency: ["Saturday"] }
    ]
  }
];

const FREQUENCY_OPTIONS = [
  "Daily",
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function ZenoOnboarding({ onComplete }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0: goals, 1: habits
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [habits, setHabits] = useState([]); // Array of habit objects with current suggestion
  const [isCreating, setIsCreating] = useState(false);
  const [finished, setFinished] = useState(false);

  const totalSteps = 2;
  const progress = useMemo(() => Math.round(((currentStep + 1) / totalSteps) * 100), [currentStep]);

  // Initialize habits when goals are selected
  useEffect(() => {
    if (selectedGoals.length > 0) {
      const initialHabits = selectedGoals.map(goalId => {
        const goal = GOAL_OPTIONS.find(g => g.id === goalId);
        const randomHabit = goal.habits[Math.floor(Math.random() * goal.habits.length)];
        return {
          goalId: goalId,
          category: goal.category,
          currentSuggestion: { ...randomHabit },
          availableHabits: goal.habits,
          customName: randomHabit.name,
          customFrequency: [...randomHabit.frequency]
        };
      });
      setHabits(initialHabits);
    }
  }, [selectedGoals]);

  const handleGoalSelect = (goalId) => {
    const isSelected = selectedGoals.includes(goalId);
    if (isSelected) {
      setSelectedGoals(prev => prev.filter(id => id !== goalId));
    } else {
      setSelectedGoals(prev => [...prev, goalId]);
    }
  };

  const shuffleHabit = (habitIndex) => {
    setHabits(prev => {
      const newHabits = [...prev];
      const habit = newHabits[habitIndex];
      const availableOptions = habit.availableHabits.filter(h => h.name !== habit.currentSuggestion.name);
      
      if (availableOptions.length > 0) {
        const randomHabit = availableOptions[Math.floor(Math.random() * availableOptions.length)];
        newHabits[habitIndex] = {
          ...habit,
          currentSuggestion: { ...randomHabit },
          customName: randomHabit.name,
          customFrequency: [...randomHabit.frequency]
        };
      }
      
      return newHabits;
    });
  };

  const deleteHabit = (habitIndex) => {
    setHabits(prev => prev.filter((_, index) => index !== habitIndex));
  };

  const updateHabitName = (habitIndex, name) => {
    setHabits(prev => {
      const newHabits = [...prev];
      newHabits[habitIndex].customName = name;
      return newHabits;
    });
  };

  const updateHabitFrequency = (habitIndex, frequency) => {
    setHabits(prev => {
      const newHabits = [...prev];
      newHabits[habitIndex].customFrequency = frequency;
      return newHabits;
    });
  };

  const handleFrequencyToggle = (habitIndex, day) => {
    const currentFrequency = habits[habitIndex]?.customFrequency || [];
    const newFrequency = currentFrequency.includes(day) 
      ? currentFrequency.filter(d => d !== day)
      : [...currentFrequency, day];
    
    updateHabitFrequency(habitIndex, newFrequency);
  };

  const createHabitsInDatabase = async () => {
    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare habits data for insertion
      const habitsToCreate = habits.map(habit => ({
        user_id: user.id,
        category: habit.category,
        habit_name: habit.customName,
        frequency: habit.customFrequency,
        repetition: 'every week' // Default repetition
      }));

      // Insert habits into database
      const { data: habitsData, error: habitsError } = await supabase
        .from('Habits')
        .insert(habitsToCreate);

      if (habitsError) {
        console.error('Error creating habits:', habitsError);
        throw habitsError;
      }

      // Update user data to mark onboarding as completed
      const { error: dbError } = await supabase
        .from("UserData")
        .upsert({
          user_id: user.id,
          email: user.email,
          onboarding_completed: true,
          authen_seen: true,
          selected_goals: selectedGoals,
          updated_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Database update error:', dbError);
      }

      // Update user metadata
      const { error: metaError } = await supabase.auth.updateUser({
        data: { 
          onboarding_completed: true 
        }
      });

      if (metaError) {
        console.error('Metadata update error:', metaError);
      }

      localStorage.setItem("zeno_onboarding_done", "true");
      
      setFinished(true);
      onComplete?.({
        goals: selectedGoals,
        habits: habitsToCreate
      });

    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Error creating your habits. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const goNext = () => {
    if (currentStep === 0 && selectedGoals.length === 0) {
      alert('Please select at least one goal to continue.');
      return;
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      createHabitsInDatabase();
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = async () => {
    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from("UserData")
          .upsert({
            user_id: user.id,
            email: user.email,
            onboarding_completed: true,
            authen_seen: true,
            skipped_onboarding: true,
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
      navigate('/goal', { replace: true });
    } finally {
      setIsCreating(false);
    }
  };

  if (finished) {
    return (
      <div className="screen">
        <div className="brand-left" style={{ marginBottom: 8 }}>
          <img src={logoImg} alt="Zeno Logo" className="logo-zeno" />
          <span className="brand-name">Zeno</span>
        </div>
        <h2 className="question" style={{ textAlign: 'center' }}>You're all set!</h2>
        <p className="hint">We've created {habits.length} personalized habits based on your goals.</p>
        <button
          type="button"
          className="next-btn"
          onClick={() => navigate('/goal', { replace: true })}
        >
          View your habits
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="onboarding-close">
        <button type="button" onClick={handleSkip} disabled={isCreating}>
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
          {currentStep === 0 && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <h2 className="question">What do you want to get better at?</h2>
              <p className="hint">Select all that apply</p>

              <div className="options">
                {GOAL_OPTIONS.map(goal => {
                  const selected = selectedGoals.includes(goal.id);
                  const category = CATEGORIES[goal.category];
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      className={`option-tile ${selected ? 'selected' : ''}`}
                      onClick={() => handleGoalSelect(goal.id)}
                      disabled={isCreating}
                    >
                      <div className="goal-content">
                        <span className="goal-label">{goal.label}</span>
                        <div className="goal-category">
                          <img src={category.imgSrc} alt={category.label} className="category-icon" />
                          <span className="category-label">{category.label}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="footer">
                <button
                  type="button"
                  className="back-btn"
                  onClick={goBack}
                  disabled={true}
                  style={{ opacity: 0.3 }}
                >
                  <img src={arrowIcon} alt="Back" className="back-icon" />
                  Go back
                </button>

                <button 
                  type="button" 
                  className="next-btn" 
                  onClick={goNext}
                  disabled={selectedGoals.length === 0 || isCreating}
                >
                  Continue with {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="habits"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <h2 className="question">Here are your suggested habits</h2>
              <p className="hint">Customize each habit or shuffle for new suggestions</p>

              <div className="habits-list">
                {habits.map((habit, index) => {
                  const category = CATEGORIES[habit.category];
                  return (
                    <div key={`${habit.goalId}-${index}`} className="habit-card">
                      <div className="habit-header">
                        <div className="habit-category">
                          <img src={category.imgSrc} alt={category.label} className="category-icon-small" />
                          <span className="category-name">{category.label}</span>
                        </div>
                        <div className="habit-actions">
                          <button 
                            type="h-button"
                            className="action-btn shuffle-btn"
                            onClick={() => shuffleHabit(index)}
                            title="Get new suggestion"
                          >
                            <img src={shuffleIcon} alt="Shuffle" />
                          </button>
                          <button 
                            type="h-button"
                            className="action-btn delete-btn"
                            onClick={() => deleteHabit(index)}
                            title="Delete habit"
                          >
                            <img src={trashIcon} alt="Delete" />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        className="habit-name-input"
                        value={habit.customName}
                        onChange={(e) => updateHabitName(index, e.target.value)}
                        placeholder="Habit name"
                      />
                      
                      <div className="frequency-selector">
                        <label>Frequency:</label>
                        <div className="frequency-options">
                          {FREQUENCY_OPTIONS.map(day => (
                            <button
                              key={day}
                              type="button"
                              className={`frequency-btn ${habit.customFrequency.includes(day) ? 'selected' : ''}`}
                              onClick={() => handleFrequencyToggle(index, day)}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="footer">
                <button
                  type="button"
                  className="back-btn"
                  onClick={goBack}
                  disabled={isCreating}
                >
                  <img src={arrowIcon} alt="Back" className="back-icon" />
                  Go back
                </button>

                <button 
                  type="button" 
                  className="next-btn" 
                  onClick={goNext}
                  disabled={isCreating || habits.length === 0}
                >
                  {isCreating ? 'Creating habits...' : `Create ${habits.length} habits`}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="skip-wrap">
          <button 
            type="button" 
            className="skip-btn" 
            onClick={handleSkip}
            disabled={isCreating}
          >
            {isCreating ? 'Updating...' : 'Skip for now'}
          </button>
        </div>
      </div>
    </div>
  );
}