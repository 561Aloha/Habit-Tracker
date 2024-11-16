import React, { useState } from 'react';
import { supabase } from '../../client';
import './blog-card.css';

const CreatePosts = () => {
    const [post, setPost] = useState({ title: '', author: '', description: '', image:'' });
    

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost(prev => ({ ...prev, [name]: value }));
    };

    const createPost = async (event) => {
        event.preventDefault();
        try {
            const { data, error } = await supabase
                .from('Blog') 
                .insert([{
                    title: post.title, 
                    author: post.author, 
                    description: post.description,
                    image: post.image
                }]);
            if (error) throw error;
            window.location = "/blog"; 
        } catch (error) {
            console.error('Error creating post:', error.message);
        }
    };
    
    return (
        <div className='create-container'>
            <h1>Create a Post</h1>
            <form onSubmit={createPost} className='createpost'>
                <div>
                <label htmlFor="title">Title</label><br />
                <input type="text" id="title" name="title" onChange={handleChange} /><br /><br />
                </div>
                <div>
                <label htmlFor="author">Author</label><br />
                <input type="text" id="author" name="author" onChange={handleChange} /><br /><br />
                </div>
                <div>
                <label htmlFor="description">Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" onChange={handleChange}></textarea><br /><br />
                </div>
                <div>
                <label htmlFor="image">Image</label><br />
                <textarea rows="5" cols="50" id="image" name="image" onChange={handleChange}></textarea><br /><br />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreatePosts;
