// src/components/EditHabitModal.jsx
import React, { useEffect, useState } from "react";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export default function EditHabitModal({ open, habit, onClose, onSave, onDelete }) {
  const [name, setName] = useState("");
  const [days, setDays] = useState(new Set());

  useEffect(() => {
    if (habit) {
      setName(habit.habit_name || "");
      setDays(new Set(habit.frequency || []));
    }
  }, [habit]);

  if (!open || !habit) return null;

  const toggleDay = (d) => {
    const next = new Set(days);
    next.has(d) ? next.delete(d) : next.add(d);
    setDays(next);
  };

  const overlay = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
  };
  const box = { background: "#fff", width: 460, maxWidth: "92vw", borderRadius: 10, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,.2)" };
  const row = { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 };
  const chip = (active) => ({
    padding: "6px 10px", borderRadius: 8, border: "1px solid",
    borderColor: active ? "#1d4ed8" : "#d1d5db",
    background: active ? "#dbeafe" : "#fff", cursor: "pointer", fontSize: 12
  });
  const actions = { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Edit Habit</h3>

        <label style={{ display: "block", fontSize: 12, marginTop: 14 }}>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
          placeholder="Habit name"
        />

        <label style={{ display: "block", fontSize: 12, marginTop: 14 }}>Repeat on</label>
        <div style={row}>
          {DAYS.map((d) => (
            <button key={d} type="button" style={chip(days.has(d))} onClick={() => toggleDay(d)}>
              {d.slice(0,3).toUpperCase()}
            </button>
          ))}
        </div>

        <div style={actions}>
          <button onClick={() => onDelete(habit.habit_id)} style={{ padding: "8px 12px", borderRadius: 8, background: "#fee2e2", border: "1px solid #fca5a5" }}>
            Delete
          </button>
          <button onClick={onClose} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff" }}>
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...habit, habit_name: name.trim(), frequency: Array.from(days) })}
            style={{ padding: "8px 12px", borderRadius: 8, background: "#1d4ed8", color: "#fff", border: "1px solid #1e40af" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
