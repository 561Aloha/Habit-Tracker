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

// Function to get CSS class based on completion percentage
function getCompletionClass(percentage) {
  if (percentage === undefined || percentage === null) return "empty";
  if (percentage === 0) return "empty";
  if (percentage < 25) return "very-low";
  if (percentage < 50) return "low";
  if (percentage < 75) return "medium";
  if (percentage < 100) return "high";
  return "full";
}

// Function to get background color based on percentage
function getBackgroundColor(percentage) {
  if (percentage === undefined || percentage === null || percentage === 0) {
    return "#e5e7eb"; // Gray for no completion
  }
  
  // Green gradient based on percentage
  const opacity = percentage / 100;
  return `rgba(34, 197, 94, ${opacity})`; // Green with varying opacity
}

export default function CompleteGrid({
  year = new Date().getFullYear(),
  completedDays = {}, // Now { 'YYYY-MM-DD': percentage }
}) {
  console.log("CompleteGrid received completedDays:", completedDays);
  console.log("Number of days with data:", Object.keys(completedDays).length);

  return (
    <div className="completegrid-wrap">
      <div className="completegrid-header">
        <h2>{year}</h2>
        <div className="completegrid-legend">
          <div className="legend-item">
            <span className="legend-swatch" style={{ backgroundColor: "rgba(34, 197, 94, 1)" }} />
            <span>100% Complete</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch" style={{ backgroundColor: "rgba(34, 197, 94, 0.6)" }} />
            <span>75% Complete</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch" style={{ backgroundColor: "rgba(34, 197, 94, 0.3)" }} />
            <span>50% Complete</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch" style={{ backgroundColor: "#e5e7eb" }} />
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
                  const percentage = completedDays[dateKey];
                  const completionClass = getCompletionClass(percentage);
                  const backgroundColor = getBackgroundColor(percentage);

                  // Debug: Log a few date keys to verify format
                  if (m === 0 && i < 3) {
                    console.log(`Date key for ${label} ${i + 1}:`, dateKey, "Percentage:", percentage);
                  }

                  return (
                    <div
                      key={i}
                      className={`day-box ${completionClass}`}
                      style={{ backgroundColor }}
                      title={`${label} ${i + 1}, ${year}: ${
                        percentage !== undefined 
                          ? `${percentage}% completed` 
                          : "No habits scheduled"
                      }`}
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