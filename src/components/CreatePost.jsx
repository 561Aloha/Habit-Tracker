import React, { useState } from 'react';
import { supabase } from './../client';



const CreatePost = () => {
    const [post, setPost] = useState({ title: '', author: '', description: '' });
    

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost(prev => ({ ...prev, [name]: value }));
    };

    const createPost = async (event) => {
        event.preventDefault();
        try {
            const { data, error } = await supabase
                .from('TrendingHabit') 
                .insert([{
                    title: post.title, 
                    author: post.author, 
                    description: post.description
                }]);
            if (error) throw error;
            window.location = "/blog"; 
        } catch (error) {
            console.error('Error creating post:', error.message);
        }
    };
    
    return (
        <div>
            <form onSubmit={createPost}>
                <label htmlFor="title">Title</label><br />
                <input type="text" id="title" name="title" onChange={handleChange} /><br /><br />

                <label htmlFor="author">Author</label><br />
                <input type="text" id="author" name="author" onChange={handleChange} /><br /><br />

                <label htmlFor="description">Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" onChange={handleChange}></textarea><br /><br />
                
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreatePost;
