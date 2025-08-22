// CompleteGrid.jsx
import React from "react";
import "../css/todo.css";

const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export default function CompleteGrid({
  year = new Date().getFullYear(),
  completedDays = {}, // { 'YYYY-MM-DD': true }
}) {
  return (
    <div className="completegrid-wrap">
      <div className="completegrid-header">
        <h2>{year}</h2>
        <div className="completegrid-legend">
          <div className="legend-item">
            <span className="legend-swatch full" />
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch empty" />
            <span>Not completed</span>
          </div>
        </div>
      </div>

      <div className="months-grid">
        {monthNames.map((label, m) => {
          const days = daysInMonth(year, m);

          return (
            <div key={m} className="month-row">
              <div className="month-label">{label.toUpperCase()}</div>
              <div className="day-wrap">
                {Array.from({ length: days }).map((_, i) => {
                  const dateKey = `${year}-${String(m + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                  const state = completedDays[dateKey] ? "full" : "empty";

                  return (
                    <div
                      key={i}
                      className={`day-box ${state}`}
                      title={`${label} ${i + 1}: ${completedDays[dateKey] ? "Completed" : "Not completed"}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
