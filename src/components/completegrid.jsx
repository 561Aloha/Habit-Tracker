// completegrid.jsx
import React from "react";

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function buildDefaultData(year) {
  const data = {};
  for (let m = 0; m < 12; m++) {
    const d = daysInMonth(year, m);
    data[m] = Array.from({ length: d }, (_, i) => {
      const hash = ((year + m + 1) * (i + 3) * 97) % 101; // 0..100
      return hash;
    });
  }
  return data;
}

export default function CompleteGrid({ year = new Date().getFullYear(), data }) {
  const dataset = data || buildDefaultData(year);

  const styles = {
    wrap: { width: "100%", maxWidth: 1100, margin: "0 auto", padding: 24 },
    header: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 },
    h2: { fontSize: 28, fontWeight: 700, margin: 0 },
    legend: { display: "flex", alignItems: "center", gap: 12, color: "#555", fontSize: 12 },
    legendItem: { display: "flex", alignItems: "center", gap: 6 },
    legendSwatch: (bg, border) => ({ width: 16, height: 16, borderRadius: 4, background: bg, border: `1px solid ${border}` }),
    months: { display: "grid", rowGap: 18 },
    monthRow: { display: "grid", gridTemplateColumns: "3rem 1fr", gap: 12, alignItems: "start" },
    monthLabel: { fontSize: 12, color: "#6b7280", fontWeight: 600, paddingTop: 4, letterSpacing: 1 },
    dayWrap: { display: "flex", flexWrap: "wrap", gap: 4 },
    day: (bg, border) => ({
      width: 18, height: 18, borderRadius: 3, border: `1px solid ${border}`,
      background: bg, display: "inline-block"
    })
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.h2}>{year}</h2>
        <div style={styles.legend}>
          <div style={styles.legendItem}><span style={styles.legendSwatch("#2563eb","#1d4ed8")} /> <span>Completed</span></div>
          <div style={styles.legendItem}><span style={styles.legendSwatch("#93c5fd","#93c5fd")} /> <span>Over 50%</span></div>
          <div style={styles.legendItem}><span style={styles.legendSwatch("#e5e7eb","#9ca3af")} /> <span>Not complete</span></div>
        </div>
      </div>

      <div style={styles.months}>
        {monthNames.map((label, m) => {
          const days = daysInMonth(year, m);
          const arr = (dataset && dataset[m]) || Array.from({ length: days }, () => 0);
          return (
            <div key={m} style={styles.monthRow}>
              <div style={styles.monthLabel}>{label.toUpperCase()}</div>
              <div style={styles.dayWrap}>
                {Array.from({ length: days }).map((_, i) => {
                  const pct = arr[i] ?? 0;
                  const state = pct >= 100 ? "full" : pct >= 50 ? "faint" : "empty";
                  const style =
                    state === "full"  ? styles.day("#2563eb","#1d4ed8") :
                    state === "faint" ? styles.day("#93c5fd","#93c5fd") :
                                        styles.day("#e5e7eb","#9ca3af");
                  return <div key={i} title={`${label} ${i + 1}: ${pct}%`} style={style} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
