import React, { useState } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';
import './createhabit.css';
import Select from 'react-select';

const CreateHabit = () => {
    const userId = 1; 
    const [newHabit, setNewHabit] = useState({ category: '', habit_name: '', frequency: [], repetition: '' });
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showModal, setShowModal] = useState(false);

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
    const customStyles = {
        control: (base) => ({
            ...base,
            width: '70vw',
            maxWidth: '625px',
            minHeight: 40,
            margin: '0 auto', 
            fontSize: 16,
            borderColor: '#ccc',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#aaa'
            }
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: 4
        }),
        clearIndicator: (base) => ({
            ...base,
            padding: 4
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '0 8px'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#ccc' : '#fff',
            '&:hover': {
                backgroundColor: '#eee'
            }
        })
    };

    const displayedCategories = categories.slice(0, 6); // Initially display only 6 categories

    const toggleModal = () => setShowModal(!showModal);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewHabit(prev => ({ ...prev, [name]: value }));
    };
    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setNewHabit(prev => ({ ...prev, category: selectedOption.value }));
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
            userid: userId,
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

    return (
        <div className="create-habit">
            <h2>Create Habit</h2>
            <form onSubmit={createHabit}>
                <div className="form-group">
                    <label htmlFor="habit_name"></label>
                    <input className='habitname' placeholder='Habit Name' type="text" id="habit_name" name="habit_name" onChange={handleChange} />
                </div>
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
                    <Select
                        className="select-menu" // You can use the same className if you've styled it globally
                        value={newHabit.repetition ? repetitionOptions.find(option => option.value === newHabit.repetition) : null}
                        onChange={handleRepetitionChange}
                        options={repetitionOptions}
                        styles={customStyles} // Assuming you have defined styles as per previous discussions
                        placeholder="Select repetition pattern"
                    />


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
    );
};

export default CreateHabit;
