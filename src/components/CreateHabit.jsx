import React, { useState } from 'react';
import { supabase } from './../client';  // Ensure this points to your correct supabase client setup
import { Link } from 'react-router-dom';
//import './createhabit.css';

const CreateHabit = () => {
    const userId = 1; 
    const [newHabit, setNewHabit] = useState({ category: '', habit_name: '', frequency: [], repetition: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewHabit((prev) => ({ ...prev, [name]: value }));
    };

    const handleFrequencyChange = (event) => {
        const { value, checked } = event.target;
        setNewHabit((prev) => {
            const newFrequency = checked 
                ? [...prev.frequency, value] 
                : prev.frequency.filter(day => day !== value);
            return { ...prev, frequency: newFrequency };
        });
    };

    const createHabit = async (event) => {
        const userId = 1;
        event.preventDefault();
        console.log('Creating habit with data:', newHabit); // Debug log
        try {
            const { data, error } = await supabase
                .from('Habits')
                .insert([{
                    userid: userId,
                    category: newHabit.category,
                    habit_name: newHabit.habit_name,
                    frequency: newHabit.frequency,
                    repetition: newHabit.repetition,
                    
                }])
                .eq('userid', userId);
            if (error) throw error;
            console.log('Habit created:', data); // Debug log
            window.location = '/goal';
        } catch (error) {
            console.error('Error creating habit:', error.message);
            alert('Error creating habit. Please try again.');
        }
    };

    return (
        <div className="create-habit">
            <h2>Create Habit</h2>
            <form onSubmit={createHabit}>
                <div className="form-group">
                    <label htmlFor="habit_name">Habit Name</label>
                    <input type="text" id="habit_name" name="habit_name" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select id="category" name="category" onChange={handleChange}>
                        <option value="">Select a category</option>
                        <option value="health">Health</option>
                        <option value="nutrition">Nutrition</option>
                        <option value="artistic">Artistic</option>
                        <option value="educational">Educational</option>
                        <option value="skills">Skills Development</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="repetition">Repetition</label>
                    <select id="repetition" name="repetition" onChange={handleChange}>
                        <option value="">Select repetition pattern</option>
                        <option value="every week">Every week</option>
                        <option value="every other week">Every other week</option>
                    </select>
                </div>


                
                <div className="form-group">
                    <label>Frequency</label><br />
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <div key={day}>
                            <input 
                                className='check'
                                type="checkbox" 
                                id={day} 
                                name="frequency" 
                                value={day} 
                                onChange={handleFrequencyChange} 
                            />
                            <label htmlFor={day}>{day}</label>
                        </div>
                    ))}
                </div>


                <button type="submit">Create Habit</button>
                <Link to="/goals"><button type="button">Go back</button></Link>
            </form>
        </div>
    );
};

export default CreateHabit;
