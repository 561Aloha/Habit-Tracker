// src/pages/Walkthrough.jsx
import '../../css/goals.css'
import React, { useState } from 'react'
import MyChart from '../../components/MyChart.jsx'
import Planner from '../../components/planner.jsx'
import { format } from 'date-fns'
import arrow from '../../assets/arrow.svg'
import './walkthrough.css'

const fakeHabits = [
  { habit_id: 'h1', habit_name: 'Morning stretch', frequency: ['Monday','Tuesday','Wednesday','Thursday','Friday'] },
  { habit_id: 'h2', habit_name: 'Read 10 min',     frequency: ['Monday','Wednesday','Friday'] },
  { habit_id: 'h3', habit_name: 'No phone 10pm',   frequency: ['Sunday','Tuesday','Thursday','Saturday'] },
]

const fakeCompletionData = [
  { habit_id: 'h1', completion_date: format(new Date(), 'yyyy-MM-dd'), is_completed: true }
]

const fakeChartData = {
  labels: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  datasets: [
    {
      label: 'Habits Completed (%)',
      data: [40, 75, 55, 35, 90, 25, 60],
      backgroundColor: '#8884d8',
      borderWidth: 1
    }
  ]
}

const steps = [
  { key: 'habits',  title: 'Track habits here', text: 'This is where your habits appear each day.' },
  { key: 'planner', title: 'Plan your day',     text: 'Use the planner to schedule reminders and tasks.' },
  { key: 'chart',   title: 'See your progress', text: 'Your weekly chart shows your habit completion trends.' }
]
function getCurrentWeek() {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  const week = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    week.push({ dayOfWeek: day.toLocaleDateString('en-US', { weekday: 'long' }), date: day.getDate(), fullDate: new Date(day) })
  }
  return week
}

export default function Walkthrough() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentWeek] = useState(getCurrentWeek())
  const [stepIndex, setStepIndex] = useState(0)
  const [done, setDone] = useState(false)

  const step = steps[stepIndex]
  const at = step?.key

  const filteredHabits = fakeHabits.filter(h => h.frequency.includes(format(selectedDate, 'EEEE')))

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex(i => i + 1)
    else setDone(true)
  }
return (
  <div className="goals-page walkthrough-mode">
    {!done && (
      <button className="wt-skip" onClick={() => setDone(true)}>
        Skip Tutorial
      </button>
    )}

    <div className="goals-container">
      {/* HABITS */}
      <div className={`habits-container ${at === 'habits' ? 'focus' : 'dim'}`}>
        <h2>Habits for Monday, Aug 10</h2>

        <div className="calendar">
          <div className="calendar-header">
            <img className="arrow left-arrow" src={arrow} style={{ transform: 'rotate(180deg)' }} alt="Prev" />
            {currentWeek.map((item, index) => (
              <div key={index} className="day-label">
                <div className="selected-d">{item.dayOfWeek.slice(0, 3).toUpperCase()}</div>
                <div>{item.date}</div>
              </div>
            ))}
            <img className="arrow right-arrow" src={arrow} alt="Next" />
          </div>
        </div>

        <div className="list">
          {fakeHabits.map(habit => (
            <div key={habit.id} className="habit">
              <p>{habit.name}</p>
              <button className="habit-toggle">○</button>
            </div>
          ))}
        </div>

        {at === 'habits' && !done && (
          <div className="wt-pop">
            <h4>{step.title}</h4>
            <p>{step.text}</p>
            <button onClick={handleNext}>Next</button>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className={`right-container ${at === 'planner' ? 'focus' : 'dim-parent'}`}>
        
        {/* PLANNER */}
        <div className={`planner-wrap ${at === 'planner' ? 'focus' : 'dim'}`}>
          <Planner
            habits={fakeHabits}
            completionData={fakeCompletionData}
            currentWeek={currentWeek}
          />
          {at === 'planner' && !done && (
            <div className="wt-pop">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
              <button onClick={handleNext}>Next</button>
            </div>
          )}
        </div>

        {/* CHART */}
        <div className={`chart-container ${at === 'chart' ? 'focus elevate' : 'dim'}`}>
          <MyChart
            chartData={fakeChartData}
            currentWeek={currentWeek}
            onWeekChange={() => {}}
            onViewChange={() => {}}
            habits={fakeHabits}
            completionData={fakeCompletionData}
            onPrevWeek={() => {}}
            onNextWeek={() => {}}
          />
          {at === 'chart' && !done && (
            <div className="wt-pop">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
              <button onClick={handleNext}>Finish</button>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* COMPLETE */}
    {done && (
      <div className="wt-complete">
        <div className="wt-complete-card">
          <h3>Tutorial complete</h3>
          <p>You’re ready to use Zeno. Explore your goals and start tracking.</p>
          <a className="wt-primary" href="/goal">Go to my Goals</a>
        </div>
      </div>
    )}
  </div>
);

}
