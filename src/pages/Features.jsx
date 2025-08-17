import { motion } from "framer-motion";
import "../css/features.css";
import CheckVector from "../assets/check-square-broken.png";

const features = [
  {
    title: "Create habits specific to breaking bad ones or taking on new ones",
    icon: CheckVector,
    desc: "Build targeted routines with clear triggers and replacements so you can unlearn old patterns and cement new ones."
  },
  {
    title: "Completely free to use",
    icon: CheckVector,
    desc: "No paywalls. All core features are open so you can focus on showing up, not checking out."
  },
  {
    title: "Web and Mobile Friendly",
    icon: CheckVector,
    desc: "Use it anywhere. Responsive by default and works great across devices."
  },
  {
    title: "User Portal for Data Visualization",
    icon: CheckVector,
    desc: "Visual progress dashboards help you see streaks, trends, and long‑term growth."
  },
  {
    title: "Easy Customizations",
    icon: CheckVector,
    desc: "Tailor cues, reminders, and views to your flow. Your habits, your rules."
  },
  {
    title: "Complete transparency in habit completion",
    icon: CheckVector,
    desc: "Log evidence, not guesses—every check‑in is auditable for honest tracking."
  },
  {
    title: "Joining a community and providing a voice via blog writing",
    icon: CheckVector,
    desc: "Connect, learn, and contribute—share your journey and insights with others."
  },
  {
    title: "Journal your feelings",
    icon: CheckVector,
    desc: "Reflect in context. Attach notes and mood to each habit to learn what really works."
  }
];

export default function FeaturesPage() {
  return (
    <div className="features-container">
      <div className="features-header">
        <h1>Science-backed benefits. Simple to use.</h1>
        <p>
          All the tools you need to build better habits, stay mindful, and grow sustainably—backed by psychology and made to fit your life.
        </p>
      </div>

      <div className="features-grid">
        {features.map(({ title, icon, desc }, idx) => (
          <motion.div
            key={idx}
            className="feature-block"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: idx * 0.03 }}
          >
            <div className="feature-content">
              <img src={icon} alt="Feature Icon" />
              <h2>{title}</h2>
              <p>{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
