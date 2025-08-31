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
    setName(habit?.habit_name ?? ""); // 
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

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      habit_id: habit.habit_id,
      habit_name: name.trim(),   // 👈 match schema
      frequency,
      repetition: repetition.trim() || null,
      user_id: habit.user_id,         // 👈 ensure user is preserved
    });
  };

  return (
    <div
      className="habit-editor"
      role="group"
      aria-label={`Edit ${habit.habit_name}`}
      onClick={(e) => e.stopPropagation()}
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
      {errors.name ? (
        <div className="error-text">{errors.name}</div>
      ) : null}

      {/* Frequency */}
      <label className="editor-label">Frequency</label>
      <div className="days-grid">
        {days.map((d) => (
          <label key={d} className="day-item">
            <input
              type="checkbox"
              checked={frequency.includes(d)}
              onChange={() => toggleDay(d)}
            />
            <span>{d}</span>
          </label>
        ))}
      </div>
      {errors.frequency ? (
        <div className="error-text">{errors.frequency}</div>
      ) : null}
      <label className="editor-label" htmlFor="habit-repetition">
        Repetition
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
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="delete-btn"
          onClick={() => onDelete(habit.habit_id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default EditHabit;
