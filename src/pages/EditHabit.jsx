// src/components/EditHabit.jsx
import React, { useState, useEffect, useRef } from "react";
import "../css/edithabit.css";

const DEFAULT_CATEGORIES = ["Health", "Fitness", "Work", "Study", "Personal", "Other"];

function EditHabit({ habit, onClose, onSave, onDelete, days }) {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState([]);
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({ name: "", frequency: "" });
  const inputRef = useRef(null);

  useEffect(() => {
    if (!habit) return;
    setName(habit?.habit_name ?? "");
    setFrequency(habit?.frequency ?? []);
    setCategory(habit?.category ?? "");
    setErrors({ name: "", frequency: "" });
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [habit]);

  if (!habit) return null;

  const toggleDay = (day) => {
    setFrequency((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
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
      habit_name: name.trim(),
      frequency,
      category: category?.trim() || null,
    });
  };

  return (
    <div className="habit-editor" role="group" aria-label={`Edit ${habit.habit_name}`} onClick={(e) => e.stopPropagation()}>
      <h3 className="editor-title">Edit Habit</h3>

      <label className="editor-label" htmlFor="habit-name">Name</label>
      <input
        id="habit-name"
        className="editor-input"
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Habit name"
        aria-invalid={!!errors.name}
      />
      {errors.name ? <div className="error-text">{errors.name}</div> : null}

      <label className="editor-label">Frequency</label>
      <div className="days-grid">
        {days.map((d) => (
          <label key={d} className="day-item">
            <input type="checkbox" checked={frequency.includes(d)} onChange={() => toggleDay(d)} />
            <span>{d}</span>
          </label>
        ))}
      </div>
      {errors.frequency ? <div className="error-text">{errors.frequency}</div> : null}

      <label className="editor-label" htmlFor="habit-category">Category</label>
      <select
        id="habit-category"
        className="editor-input"
        value={category || ""}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">— Select a category —</option>
        {DEFAULT_CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label className="editor-label" htmlFor="habit-category-custom">Custom category (optional)</label>
      <input
        id="habit-category-custom"
        className="editor-input"
        placeholder="Or type your own"
        value={category || ""}
        onChange={(e) => setCategory(e.target.value)}
      />

      <div className="editor-actions">
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
        <button type="button" className="delete-btn" onClick={() => onDelete(habit.habit_id)}>Delete</button>
      </div>
    </div>
  );
}

export default EditHabit;
