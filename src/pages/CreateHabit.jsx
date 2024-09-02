import React, { useState } from 'react';
import { supabase } from '../client';

const CreateHabit = () => {
    const [newHabit, setNewHabit] = useState({ habit_name:'', frequency: ''});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewHabit((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const createHabit = async (event) => {
        event.preventDefault();
        try {
            const user = supabase.auth.user();
            if (!user) {
                throw new Error('User is not authenticated.');
            }
    
            // Input validation
            if (!newHabit.habit_name || !newHabit.frequency) {
                throw new Error('Habit name and frequency are required.');
            }
    
            const userId = user.id;
    
            // Insert habit with user ID
            await supabase
                .from('Habits')
                .insert([{ 
                    habit_name: newHabit.habit_name,
                    frequency: newHabit.frequency,
                    userid: userId // Associate habit with specific user
                }])
    
            // Reset newHabit state
            setNewHabit({ habit_name: '', frequency: '' });
    
            // Provide feedback to the user upon successful creation
            alert('Habit created successfully!');
        } catch (error) {
            console.error('Error Creating Habit', error.message);
            // Provide feedback to the user upon error
            alert('Error creating habit. Please try again.');
        }
    };
    

    return (
        <div className="create-habit">
            <h2>Create Habit</h2>
            <form onSubmit={createHabit}>
                <div className="form-group">
                    <label htmlFor="habit_name">Habit Name</label>
                    <input type="text" id="habit_name" name="habit_name" value={newHabit.habit_name} onChange={handleChange} />
                </div>
               
                <div className="form-group">
                    <label htmlFor="frequency">Frequency</label>
                    <input type="text" id="frequency" name="frequency" value={newHabit.frequency} onChange={handleChange} />
                </div>
                <button type="submit">Create Habit</button>
            </form>
        </div>
    );
};

export default CreateHabit;
