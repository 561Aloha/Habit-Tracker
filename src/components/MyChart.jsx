// MyChart.jsx
import React, { useEffect, useState } from "react";
import CompleteGrid from "./CompleteGrid";
import { supabase } from "../client";

function yyyymmddLocal(dateLike) {
  const d = new Date(dateLike);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const MyChart = () => {
  const [completedDays, setCompletedDays] = useState({});

  useEffect(() => {
    const fetchCompletions = async () => {
      const { data, error } = await supabase
        .from("Habit_completion")
        .select("completion_date")
        .eq("is_completed", true);

      if (error) {
        console.error("Error fetching completions:", error);
        return;
      }

      const map = {};
      (data || []).forEach((row) => {
        if (!row.completion_date) return;
        const key = yyyymmddLocal(row.completion_date);
        map[key] = true; // shade this day
      });

      setCompletedDays(map);
    };

    fetchCompletions();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Habit Completion Chart</h2>
      <CompleteGrid completedDays={completedDays} />
    </div>
  );
};

export default MyChart;
