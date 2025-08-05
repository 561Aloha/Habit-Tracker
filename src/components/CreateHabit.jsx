import React, { useState, useEffect} from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';
import './createhabit.css';
import closeIcon from '../assets/close_l.svg';

import Select from 'react-select';

const CreateHabit = () => {
    const [newHabit, setNewHabit] = useState({ category: '', habit_name: '', frequency: [], repetition: '' });
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const categories = [
        { key: 'health', label: 'Health', imgSrc: './src/assets/health.png' },
        { key: 'nutrition', label: 'Nutrition', imgSrc: './src/assets/nutrition.png' },
        { key: 'artistic', label: 'Artistic', imgSrc: './src/assets/artist.png' },
        { key: 'academics', label: 'Academics', imgSrc: './src/assets/academics.png' },
        { key: 'skills', label: 'Skills Development', imgSrc: './src/assets/skiils.png' },
        { key: 'fitness', label: 'Fitness', imgSrc: './src/assets/25.png' },
        { key: 'spiritual', label: 'Spiritual', imgSrc: './src/assets/pray.png' },
        { key: 'financial', label: 'Financial', imgSrc: './src/assets/26.png' },
    ];
    const repetitionOptions = [
        { value: 'every week', label: 'Every week' },
        { value: 'every other week', label: 'Every other week' }
    ];

    const displayedCategories = categories.slice(0, 6); // Initially display only 6 categories

    const toggleModal = () => setShowModal(!showModal);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewHabit(prev => ({ ...prev, [name]: value }));
    };


    const handleRepetitionChange = (selectedOption) => {
        setNewHabit(prev => ({ ...prev, repetition: selectedOption ? selectedOption.value : '' }));
    };
    
    const handleFrequencyChange = (event) => {
        const { value, checked } = event.target;
        setNewHabit(prev => {
            const newFrequency = checked ? [...prev.frequency, value] : prev.frequency.filter(day => day !== value);
            return { ...prev, frequency: newFrequency };
        });
    };

    const createHabit = async (event) => {
        event.preventDefault();
        const habitData = {
            user_id: user.id,
            category: selectedCategory,
            habit_name: newHabit.habit_name,
            frequency: newHabit.frequency,
            repetition: newHabit.repetition,
        };
        console.log('Creating habit with data:', habitData); // Debug log
        try {
            const { data, error } = await supabase.from('Habits').insert([habitData]);
            if (error) throw error;
            console.log('Habit created:', data);
            window.location = '/goal';
        } catch (error) {
            console.error('Error creating habit:', error.message);
            alert('Error creating habit. Please try again.');
        }
    };
const customStyles = {
  placeholder: (provided) => ({
    ...provided,
    color: 'black',
    borderRadius: 12,
    fontSize: '14px',
  })
};
    return (
        <div className='background-habit'>
            <div className="habit-form-wrapper"> {/* Add this wrapper */}
            <div className="create-habit">
                <Link to="/goals" className="close-link" src={closeIcon}></Link>
                <h2>Create Habit</h2>
                                                <span className="close" onClick={toggleModal}></span>
                <form onSubmit={createHabit}>
                    <div className="header-habit">
                        <input className='habitname' placeholder='Habit Name' type="text" id="habit_name" name="habit_name" onChange={handleChange} />
                        <Select
                            className="select-menu"
                            options={repetitionOptions}
                            placeholder="Select Repetition"
                            onChange={handleRepetitionChange}
                            isClearable
                            styles={customStyles}
                            isSearchable={false}
                            value={repetitionOptions.find(option => option.value === newHabit.repetition) || null}
                        />
                    </div>
                    <h3>Select Category</h3>
                    <div className="form-group categories">
                        {displayedCategories.map(category => (
                            <button
                                key={category.key}
                                type="button"
                                className={`category-button ${selectedCategory === category.key ? 'selected' : ''}`}
                                onClick={() => setSelectedCategory(category.key)}
                            >
                                <img src={category.imgSrc} alt={category.label} />
                                <span>{category.label}</span>
                            </button>
                        ))}
                        <button type="button" onClick={toggleModal} className="more-button">More...</button>
                    </div>
                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={toggleModal}>&times;</span>
                                {categories.map(category => (
                                    <button
                                        key={category.key}
                                        type="button"
                                        className={`category-button ${selectedCategory === category.key ? 'selected' : ''}`}
                                        onClick={() => { setSelectedCategory(category.key); toggleModal(); }}
                                    >
                                        <img src={category.imgSrc} alt={category.label} />
                                        <span>{category.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="form-group">

                    </div>
                    <div className="form-group-freq">
                        <label>Frequency</label><br />
                        <div className='wrap'>
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
                    </div>
                    <div className='nav-btns'>
                        <button type="submit" className='createhabit-btn'>Create Habit</button>
                        <Link to="/goals"><button type="button">Go back</button></Link>
                    </div>
                </form>
            </div>
                 </div> 
        </div>
    );
};

export default CreateHabit;
