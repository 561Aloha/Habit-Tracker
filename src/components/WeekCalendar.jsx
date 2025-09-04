import React, { useMemo, useState } from 'react';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isSameWeek,
  format,
  addMonths,
  subMonths,
} from 'date-fns';

export default function WeekCalendar({ value, onChange, weekStartsOn = 0 }) {
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(value || new Date()));

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn });
    const end = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn });
    return eachDayOfInterval({ start, end });
  }, [visibleMonth, weekStartsOn]);

  const weekHeader = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn });
    return Array.from({ length: 7 }, (_, i) =>
      format(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i), 'EEE')
    );
  }, [weekStartsOn]);

  return (
    <div className="week-calendar" style={{ width: '100%', maxWidth: 520 }}>
      <div className="wc-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button onClick={() => setVisibleMonth(subMonths(visibleMonth, 1))} aria-label="Previous month">‹</button>
        <div style={{ fontWeight: 600 }}>{format(visibleMonth, 'MMMM yyyy')}</div>
        <button onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))} aria-label="Next month">›</button>
      </div>

      <div className="wc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {weekHeader.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: 12, opacity: 0.7 }}>{d.toUpperCase()}</div>
        ))}
        {monthDays.map((day) => {
          const inMonth = isSameMonth(day, visibleMonth);
          const inSelectedWeek = isSameWeek(day, value || new Date(), { weekStartsOn });
          const selected = isSameDay(day, value || new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => onChange?.(day)}
              className="wc-day"
              style={{
                padding: '10px 0',
                borderRadius: 8,
                border: selected ? '2px solid #4f46e5' : '1px solid rgba(0,0,0,0.1)',
                background: inSelectedWeek ? 'rgba(79,70,229,0.08)' : 'transparent',
                opacity: inMonth ? 1 : 0.45,
              }}
            >
              <div style={{ textAlign: 'center', fontWeight: selected ? 700 : 500 }}>{format(day, 'd')}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
