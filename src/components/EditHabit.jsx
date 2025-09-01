import React, { useState, useEffect, useRef } from "react";
import "../css/edithabit.css";

function EditHabit({ habit, onClose, onSave, onDelete, days }) {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState([]);
  const [repetition, setRepetition] = useState("");
  const [errors, setErrors] = useState({ name: "", frequency: "" });
  const inputRef = useRef(null);

  useEffect(() => {
    if (!habit) return;
    setName(habit?.habit_name ?? "");
    setFrequency(habit?.frequency ?? []);
    setRepetition(habit?.repetition ?? "");
    setErrors({ name: "", frequency: "" });
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [habit]);

  if (!habit) return null;

  const toggleDay = (day) => {
    setFrequency((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const validate = () => {
    const next = { name: "", frequency: "" };
    if (!name.trim()) next.name = "Please enter a habit name.";
    if (!frequency.length) next.frequency = "Pick at least one day.";
    setErrors(next);
    return !next.name && !next.frequency;
  };
const handleSaveEdit = async (updated) => {
  console.log('Data being sent to Supabase:', updated);
  console.log('Current user:', user);
  
  if (!user || !updated) {
    console.log('Missing user or updated data');
    return;
  }
  
  try {
    const updateData = {
      habit_name: updated.habit_name,
      frequency: updated.frequency,
      repetition: updated.repetition ?? null,
    };
    console.log('Update payload:', updateData);
    
    const { data, error } = await supabase
      .from('Habits')
      .update(updateData)
      .eq('habit_id', updated.habit_id)
      .eq('user_id', user.id)
      .select(); // Add select to see what was updated
    
    console.log('Supabase result:', { data, error });
    
    if (error) throw error;
    // ... rest of function
  } catch (err) {
    console.error('Full error:', err);
  }
};
  const handleSave = () => {
    if (!validate()) return;
    
    // Pass the updated habit data to the parent component
    onSave({
      habit_id: habit.habit_id,
      habit_name: name.trim(),
      frequency,
      repetition: repetition.trim() || null,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div
      className="habit-editor"
      role="group"
      aria-label={`Edit ${habit.habit_name}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
    >
      <h3 className="editor-title">Edit Habit</h3>

      {/* Habit name */}
      <label className="editor-label" htmlFor="habit-name">
        Name
      </label>
      <input
        id="habit-name"
        className="editor-input"
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Habit name"
        aria-invalid={!!errors.name}
      />
      {errors.name && (
        <div className="error-text" role="alert">{errors.name}</div>
      )}

      {/* Frequency */}
      <label className="editor-label">Repeat on</label>
      <div className="days-grid">
        {days.map((day) => (
          <label key={day} className="day-item">
            <input
              type="checkbox"
              checked={frequency.includes(day)}
              onChange={() => toggleDay(day)}
              aria-describedby={errors.frequency ? "frequency-error" : undefined}
            />
            <span>{day.slice(0, 3).toUpperCase()}</span>
          </label>
        ))}
      </div>
      {errors.frequency && (
        <div id="frequency-error" className="error-text" role="alert">
          {errors.frequency}
        </div>
      )}

      {/* Repetition (optional field) */}
      <label className="editor-label" htmlFor="habit-repetition">
        Repetition (optional)
      </label>
      <input
        id="habit-repetition"
        className="editor-input"
        placeholder="e.g. Daily, Weekly, Monthly"
        value={repetition}
        onChange={(e) => setRepetition(e.target.value)}
      />

      {/* Actions */}
      <div className="editor-actions">
        <button 
          type="button" 
          className="save-btn"
          onClick={handleSave}
        >
          Save Changes
        </button>
        <button 
          type="button" 
          className="cancel-btn"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="delete-btn"
          onClick={() => onDelete(habit.habit_id)}
        >
          Delete Habit
        </button>
      </div>
    </div>
  );
}

export default EditHabit;