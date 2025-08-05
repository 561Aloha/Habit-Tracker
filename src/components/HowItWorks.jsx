import React, { useState } from "react";
import "../css/HowItWorks.css";
import freq from "../assets/edit-screen.png";
const STEPS = [
  {
    image: "https://cdn.dribbble.com/userupload/43695725/file/original-fc462e88bdaff6875860c58f6d2ed660.jpg?resize=752x&vertical=center", // Replace as needed
    title: "Discovery",
    description: "Let us help you towards progress. Our daily routine app is a great way to stay on track and keep you motivated.",
  },
  {
    image: "https://cdn.dribbble.com/userupload/26008963/file/original-d166919e481535dc43cbcc0f5b8f4257.jpg?resize=752x&vertical=centere",
    title: "Goal Setting",
    description: "Define your personal goals and create clear, actionable steps.",
  },
  {
    image: freq,
    title: "Adjusting Frequency",
    description: "Change how often you want to work towards your goal to fit your lifestyle.",
  },
  {
    image: "https://cdn.dribbble.com/userupload/36693910/file/original-3e852b47d304ba820a0a626cf9a99020.png?resize=752x&vertical=center",
    title: "Daily Execution",
    description: "Take small actions each day. Build consistency and form lasting habits.",
  },
  {
    image: "https://cdn.dribbble.com/userupload/17529458/file/original-22c808e2cb9802ba0134cb1c1f74fdb6.png?resize=752x564&vertical=center",
    title: "Visualize Progress",
    description: "Track your achievements and see your journey unfold visually.",
  },
];

export default function HowItWorks() {
  const [selected, setSelected] = useState(0);

  return (
<div className="hiw-main">
  <h2 className="hiw-title">How it works</h2>
  <div className="hiw-row">

    <div className="hiw-steps-col">
      {STEPS.map((step, idx) => (
        <div
          key={step.title}
          className={`hiw-step-nav${selected === idx ? " active" : ""}`}
          onClick={() => setSelected(idx)}
        >
          {step.title}
        </div>
      ))}
    </div>

    <div className="hiw-body-row">
      <div className="hiw-image-col">
        <img
          src={STEPS[selected].image}
          alt={STEPS[selected].title}
          className="hiw-image"
        />
      </div>

      <div className="hiw-details-col">
        <div className="hiw-step-title">{STEPS[selected].title}</div>
        <div className="hiw-step-desc">{STEPS[selected].description}</div>
      </div>
    </div>

  </div>
</div>


  );
}
