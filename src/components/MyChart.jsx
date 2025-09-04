import React, { useEffect, useState } from "react";
import CompleteGrid from "./CompleteGrid";
import { supabase } from "../client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfYear, endOfYear, subDays } from 'date-fns';
import '../css/chart.css';
function yyyymmddLocal(dateLike) {
  const d = new Date(dateLike);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const MyChart = () => {
  const [completedDays, setCompletedDays] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [streakData, setStreakData] = useState([]);
  const [currentStreaks, setCurrentStreaks] = useState({});
  const [user, setUser] = useState(null);
  const [chartView, setChartView] = useState('grid');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Calculate streaks for each habit
  const calculateStreaks = (habitsData, completionData, dailyCompletions) => {
    const habitStreaks = {};
    const currentStreaksObj = {};
    
    habitsData.forEach(habit => {
      const streakHistory = [];
      const today = new Date();
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      // Check last 90 days for streak patterns
      for (let i = 89; i >= 0; i--) {
        const date = subDays(today, i);
        const dateKey = yyyymmddLocal(date);
        const dayName = format(date, 'EEEE');
        
        // Only count days this habit is scheduled
        if (habit.frequency && habit.frequency.includes(dayName)) {
          const completion = completionData?.find(c => 
            c.habit_id === habit.habit_id && 
            yyyymmddLocal(c.completion_date) === dateKey && 
            c.is_completed
          );
          
          if (completion) {
            tempStreak++;
            if (i === 0) currentStreak = tempStreak; // Current streak is the most recent
          } else {
            if (tempStreak > longestStreak) longestStreak = tempStreak;
            tempStreak = 0;
            if (i === 0) currentStreak = 0;
          }
          
          // Store daily streak value for chart
          if (i < 30) { // Last 30 days for chart
            streakHistory.push({
              date: format(date, 'MMM dd'),
              streak: tempStreak,
              completed: !!completion
            });
          }
        }
      }
      
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      
      habitStreaks[habit.habit_id] = {
        habitName: habit.habit_name,
        currentStreak,
        longestStreak,
        history: streakHistory
      };
      
      currentStreaksObj[habit.habit_id] = {
        name: habit.habit_name,
        current: currentStreak,
        longest: longestStreak
      };
    });
    
    return { habitStreaks, currentStreaksObj };
  };

  useEffect(() => {
    if (!user) return;

    const fetchCompletionData = async () => {
      try {
        const { data: habitsData, error: habitsError } = await supabase
          .from('Habits')
          .select('*')
          .eq('user_id', user.id);
        
        if (habitsError) throw habitsError;

        const { data: completionData, error: completionError } = await supabase
          .from('Habit_Completion')
          .select('*')
          .eq('user_id', user.id);
        
        if (completionError) throw completionError;

        const dailyCompletions = {};
        const allDates = new Set();
        
        completionData?.forEach(completion => {
          if (completion.completion_date) {
            allDates.add(yyyymmddLocal(completion.completion_date));
          }
        });

        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          allDates.add(yyyymmddLocal(date));
        }

        allDates.forEach(dateKey => {
          const date = new Date(dateKey);
          const dayName = format(date, 'EEEE');
          
          const scheduledHabits = habitsData?.filter(habit => 
            habit.frequency && habit.frequency.includes(dayName)
          ) || [];
          
          if (scheduledHabits.length === 0) return;

          const completedCount = scheduledHabits.filter(habit => {
            const completion = completionData?.find(c => 
              c.habit_id === habit.habit_id && 
              yyyymmddLocal(c.completion_date) === dateKey && 
              c.is_completed
            );
            return completion;
          }).length;

          const percentage = Math.round((completedCount / scheduledHabits.length) * 100);
          dailyCompletions[dateKey] = percentage;
        });

        setCompletedDays(dailyCompletions);

        // Calculate streaks
        const { habitStreaks, currentStreaksObj } = calculateStreaks(habitsData, completionData, dailyCompletions);
        setCurrentStreaks(currentStreaksObj);

        // Generate monthly data
        const currentYear = new Date().getFullYear();
        const monthlyStats = [];
        
        for (let month = 0; month < 12; month++) {
          const monthStart = new Date(currentYear, month, 1);
          const monthEnd = endOfMonth(monthStart);
          const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
          
          let totalPercentage = 0;
          let daysWithHabits = 0;
          
          daysInMonth.forEach(day => {
            const dateKey = yyyymmddLocal(day);
            if (dailyCompletions[dateKey] !== undefined) {
              totalPercentage += dailyCompletions[dateKey];
              daysWithHabits++;
            }
          });
          
          const avgPercentage = daysWithHabits > 0 ? Math.round(totalPercentage / daysWithHabits) : 0;
          
          monthlyStats.push({
            month: format(monthStart, 'MMM'),
            percentage: avgPercentage
          });
        }
        
        setMonthlyData(monthlyStats);

        // Generate yearly data
        const yearlyStats = [];
        for (let yearOffset = 2; yearOffset >= 0; yearOffset--) {
          const targetYear = currentYear - yearOffset;
          const yearStart = new Date(targetYear, 0, 1);
          const yearEnd = endOfYear(yearStart);
          const daysInYear = eachDayOfInterval({ start: yearStart, end: yearEnd });
          
          let totalPercentage = 0;
          let daysWithHabits = 0;
          
          daysInYear.forEach(day => {
            const dateKey = yyyymmddLocal(day);
            if (dailyCompletions[dateKey] !== undefined) {
              totalPercentage += dailyCompletions[dateKey];
              daysWithHabits++;
            }
          });
          
          const avgPercentage = daysWithHabits > 0 ? Math.round(totalPercentage / daysWithHabits) : 0;
          
          yearlyStats.push({
            year: targetYear,
            percentage: avgPercentage
          });
        }
        
        setYearlyData(yearlyStats);

        // Prepare streak chart data (top 5 habits by current streak)
        const sortedStreaks = Object.values(currentStreaksObj)
          .sort((a, b) => b.current - a.current)
          .slice(0, 5);
        
        setStreakData(sortedStreaks);

      } catch (error) {
        console.error("Error fetching completion data:", error);
      }
    };

    fetchCompletionData();
  }, [user]);

  const renderMonthlyChart = () => {
    return (
      <div className="custom-chart">
        <svg width="100%" height="300" viewBox="0 0 600 300">
          {monthlyData.map((data, index) => {
            const barHeight = (data.percentage / 100) * 250;
            const x = 50 + (index * 45);
            const y = 270 - barHeight;
            
            return (
              <g key={data.month}>
                <rect
                  x={x}
                  y={y}
                  width={35}
                  height={barHeight}
                  fill="#8b5cf6"
                  rx={2}
                />
                <text
                  x={x + 17.5}
                  y={285}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#666"
                >
                  {data.month}
                </text>
                <text
                  x={x + 17.5}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#333"
                >
                  {data.percentage}%
                </text>
              </g>
            );
          })}
          {[0, 25, 50, 75, 100].map(value => (
            <g key={value}>
              <text x="40" y={275 - (value * 2.5)} fontSize="10" fill="#666" textAnchor="end">
                {value}%
              </text>
              <line x1="45" y1={270 - (value * 2.5)} x2="580" y2={270 - (value * 2.5)} stroke="#eee" strokeWidth="1" />
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderStreakChart = () => {
    const maxStreak = Math.max(...streakData.map(d => d.current), 10);
    
    return (
      <div className="custom-chart">
        <h3 style={{textAlign: 'center', margin: '0 0 20px 0', color: '#442fe4'}}>Current Streaks</h3>
        <svg width="100%" height="300" viewBox="0 0 500 300">
          {streakData.map((data, index) => {
            const barWidth = (data.current / maxStreak) * 350;
            const y = 50 + (index * 45);
            
            return (
              <g key={data.name}>
                {/* Habit name */}
                <text
                  x="10"
                  y={y + 20}
                  fontSize="12"
                  fill="#333"
                  textAnchor="start"
                >
                  {data.name.length > 15 ? data.name.substring(0, 15) + '...' : data.name}
                </text>
                
                {/* Streak bar */}
                <rect
                  x="120"
                  y={y + 5}
                  width={barWidth}
                  height={25}
                  fill="#27a464"
                  rx={4}
                />
                
                {/* Streak number */}
                <text
                  x={125 + barWidth + 10}
                  y={y + 20}
                  fontSize="12"
                  fill="#333"
                  fontWeight="bold"
                >
                  {data.current} days
                </text>
                
                {/* Fire emoji for active streaks */}
                {data.current > 0 && (
                  <text
                    x="105"
                    y={y + 20}
                    fontSize="16"
                  >
                    🔥
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Chart title and grid lines */}
          {[0, Math.ceil(maxStreak/4), Math.ceil(maxStreak/2), Math.ceil(maxStreak*3/4), maxStreak].map(value => (
            <g key={value}>
              <line 
                x1={120 + (value / maxStreak) * 350} 
                y1="40" 
                x2={120 + (value / maxStreak) * 350} 
                y2="270" 
                stroke="#eee" 
                strokeWidth="1" 
              />
              <text 
                x={120 + (value / maxStreak) * 350} 
                y="35" 
                fontSize="10" 
                fill="#666" 
                textAnchor="middle"
              >
                {value}
              </text>
            </g>
          ))}
        </svg>
        
        {/* Streak summary */}
        <div style={{marginTop: '20px', textAlign: 'center'}}>
          <div style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '10px'}}>
            {Object.values(currentStreaks).map(streak => (
              <div key={streak.name} style={{
                background: '#f8fafc', 
                padding: '10px 15px', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                minWidth: '120px'
              }}>
                <div style={{fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px'}}>
                  {streak.name.length > 12 ? streak.name.substring(0, 12) + '...' : streak.name}
                </div>
                <div style={{fontSize: '12px', color: '#666'}}>
                  Current: <span style={{color: '#27a464', fontWeight: 'bold'}}>{streak.current}</span>
                </div>
                <div style={{fontSize: '12px', color: '#666'}}>
                  Best: <span style={{color: '#8b5cf6', fontWeight: 'bold'}}>{streak.longest}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderYearlyChart = () => {
    return (
      <div className="custom-chart">
        <svg width="100%" height="300" viewBox="0 0 400 300">
          {yearlyData.map((data, index) => {
            const x = 100 + (index * 100);
            const y = 270 - (data.percentage / 100) * 250;
            
            return (
              <g key={data.year}>
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="#8b5cf6"
                />
                <text
                  x={x}
                  y={285}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#666"
                >
                  {data.year}
                </text>
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#333"
                >
                  {data.percentage}%
                </text>
                {index > 0 && (
                  <line
                    x1={100 + ((index - 1) * 100)}
                    y1={270 - (yearlyData[index - 1].percentage / 100) * 250}
                    x2={x}
                    y2={y}
                    stroke="#8b5cf6"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}
          {[0, 25, 50, 75, 100].map(value => (
            <g key={value}>
              <text x="90" y={275 - (value * 2.5)} fontSize="10" fill="#666" textAnchor="end">
                {value}%
              </text>
              <line x1="95" y1={270 - (value * 2.5)} x2="350" y2={270 - (value * 2.5)} stroke="#eee" strokeWidth="1" />
            </g>
          ))}
        </svg>
      </div>
    );
  };

  useEffect(() => {
    if (!user) return;

    const fetchCompletionData = async () => {
      try {
        const { data: habitsData, error: habitsError } = await supabase
          .from('Habits')
          .select('*')
          .eq('user_id', user.id);
        
        if (habitsError) throw habitsError;

        const { data: completionData, error: completionError } = await supabase
          .from('Habit_Completion')
          .select('*')
          .eq('user_id', user.id);
        
        if (completionError) throw completionError;

        const dailyCompletions = {};
        const allDates = new Set();
        
        completionData?.forEach(completion => {
          if (completion.completion_date) {
            allDates.add(yyyymmddLocal(completion.completion_date));
          }
        });

        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          allDates.add(yyyymmddLocal(date));
        }

        allDates.forEach(dateKey => {
          const date = new Date(dateKey);
          const dayName = format(date, 'EEEE');
          
          const scheduledHabits = habitsData?.filter(habit => 
            habit.frequency && habit.frequency.includes(dayName)
          ) || [];
          
          if (scheduledHabits.length === 0) return;

          const completedCount = scheduledHabits.filter(habit => {
            const completion = completionData?.find(c => 
              c.habit_id === habit.habit_id && 
              yyyymmddLocal(c.completion_date) === dateKey && 
              c.is_completed
            );
            return completion;
          }).length;

          const percentage = Math.round((completedCount / scheduledHabits.length) * 100);
          dailyCompletions[dateKey] = percentage;
        });

        setCompletedDays(dailyCompletions);

        // Calculate streaks
        const { habitStreaks, currentStreaksObj } = calculateStreaks(habitsData, completionData, dailyCompletions);
        setCurrentStreaks(currentStreaksObj);

        // Generate monthly data
        const currentYear = new Date().getFullYear();
        const monthlyStats = [];
        
        for (let month = 0; month < 12; month++) {
          const monthStart = new Date(currentYear, month, 1);
          const monthEnd = endOfMonth(monthStart);
          const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
          
          let totalPercentage = 0;
          let daysWithHabits = 0;
          
          daysInMonth.forEach(day => {
            const dateKey = yyyymmddLocal(day);
            if (dailyCompletions[dateKey] !== undefined) {
              totalPercentage += dailyCompletions[dateKey];
              daysWithHabits++;
            }
          });
          
          const avgPercentage = daysWithHabits > 0 ? Math.round(totalPercentage / daysWithHabits) : 0;
          
          monthlyStats.push({
            month: format(monthStart, 'MMM'),
            percentage: avgPercentage
          });
        }
        
        setMonthlyData(monthlyStats);

        // Generate yearly data
        const yearlyStats = [];
        for (let yearOffset = 2; yearOffset >= 0; yearOffset--) {
          const targetYear = currentYear - yearOffset;
          const yearStart = new Date(targetYear, 0, 1);
          const yearEnd = endOfYear(yearStart);
          const daysInYear = eachDayOfInterval({ start: yearStart, end: yearEnd });
          
          let totalPercentage = 0;
          let daysWithHabits = 0;
          
          daysInYear.forEach(day => {
            const dateKey = yyyymmddLocal(day);
            if (dailyCompletions[dateKey] !== undefined) {
              totalPercentage += dailyCompletions[dateKey];
              daysWithHabits++;
            }
          });
          
          const avgPercentage = daysWithHabits > 0 ? Math.round(totalPercentage / daysWithHabits) : 0;
          
          yearlyStats.push({
            year: targetYear,
            percentage: avgPercentage
          });
        }
        
        setYearlyData(yearlyStats);

      } catch (error) {
        console.error("Error fetching completion data:", error);
      }
    };

    fetchCompletionData();
  }, [user]);

  const renderChart = () => {
    switch (chartView) {
      case 'monthly':
        return renderMonthlyChart();
      case 'yearly':
        return renderYearlyChart();
      case 'streaks':
        return renderStreakChart();
      default:
        return <CompleteGrid completedDays={completedDays} />;
    }
  };

  return (
    <div className="chart-container-wrapper">
      <div className="chart-header">
        <h2>Habit Completion Progress</h2>
        <div className="chart-nav">
          <button 
            className={`chart-nav-btn ${chartView === 'grid' ? 'active' : ''}`}
            onClick={() => setChartView('grid')}
          >
            Grid
          </button>
          <button 
            className={`chart-nav-btn ${chartView === 'monthly' ? 'active' : ''}`}
            onClick={() => setChartView('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`chart-nav-btn ${chartView === 'yearly' ? 'active' : ''}`}
            onClick={() => setChartView('yearly')}
          >
            Yearly
          </button>
          <button 
            className={`chart-nav-btn ${chartView === 'streaks' ? 'active' : ''}`}
            onClick={() => setChartView('streaks')}
          >
            Streaks
          </button>
        </div>
      </div>
      {renderChart()}
    </div>
  );
};

export default MyChart;