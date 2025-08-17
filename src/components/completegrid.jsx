import React from "react";
import '../css/todo.css'; // assuming styles live here

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function buildDefaultData(year) {
  const data = {};
  for (let m = 0; m < 12; m++) {
    const d = daysInMonth(year, m);
    data[m] = Array.from({ length: d }, (_, i) => {
      const hash = ((year + m + 1) * (i + 3) * 97) % 101;
      return hash;
    });
  }
  return data;
}

export default function CompleteGrid({ year = new Date().getFullYear(), data }) {
  const dataset = data || buildDefaultData(year);

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
            <span className="legend-swatch faint" />
            <span>Over 50%</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch empty" />
            <span>Not complete</span>
          </div>
        </div>
      </div>

      <div className="months-grid">
        {monthNames.map((label, m) => {
          const days = daysInMonth(year, m);
          const arr = dataset[m] || Array.from({ length: days }, () => 0);

          return (
            <div key={m} className="month-row">
              <div className="month-label">{label.toUpperCase()}</div>
              <div className="day-wrap">
                {Array.from({ length: days }).map((_, i) => {
                  const pct = arr[i] ?? 0;
                  const state = pct >= 100 ? "full" : pct >= 50 ? "faint" : "empty";
                  return (
                    <div
                      key={i}
                      className={`day-box ${state}`}
                      title={`${label} ${i + 1}: ${pct}%`}
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
