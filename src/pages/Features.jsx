import { motion } from "framer-motion";


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
    title: "Journal your feelings,",
    icon: CheckVector,
    desc: "Reflect in context. Attach notes and mood to each habit to learn what really works."
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <img src={CheckVector} alt="Decorative vector" className="w-full h-full object-cover" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
              The best habit tracker out there for individuals looking for life improvements
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-700">
              Break old patterns and form new habits.
            </p>
            <p className="mt-3 text-base leading-relaxed text-neutral-700">
              We're providing a new way using study evidence-based solutions in the field of mindfulness and positive psychology to bring a application that will be effective for users to become more proactive with their life.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <section>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ title, icon, desc }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
                className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl p-3 border border-neutral-200 bg-neutral-50">
                    <img src={icon} alt="Check icon" className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium leading-snug">{title}</h3>
                    <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold">Why it works</h2>
              <p className="mt-2 text-neutral-700">
                Grounded in mindfulness and positive psychology, habits are shaped through evidence‑based strategies: clear intentions, small wins, and reflective feedback.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-700">

              <span>Accessible everywhere</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-12 text-sm text-neutral-500">
        <p>
          © {new Date().getFullYear()} Habit Tracker. Built for clarity, accountability, and growth.
        </p>
      </footer>
    </div>
  );
}
