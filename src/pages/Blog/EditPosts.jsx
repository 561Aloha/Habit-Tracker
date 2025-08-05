import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../client';

const EditBlogPost = ({ data }) => {
    const { id } = useParams();
    const [post, setPost] = useState({ id: null, title: '', authorr: '', description: '',image:'' });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data: postData, error } = await supabase.from('Blog').select().eq('id', id).single();
                if (error) {
                    throw error;
                }
                setPost(postData);
            } catch (error) {
                console.error('Error fetching post:', error.message);
            }
        };

        fetchPost();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updatePost = async (event) => {
        event.preventDefault();
    
        try {
            await supabase
                .from('Blog')
                .update({ title: post.title, authorr: post.authorr, description: post.description, image:post.image })
                .eq('id', id);
    
            console.log('Post updated successfully');
            window.location = '/';
        } catch (error) {
            console.error('Error updating post:', error.message);
        }
    };
    
    const deletePost = async (event) => {
        event.preventDefault();
        await supabase
            .from('Blog')
            .delete()
            .eq('id', id);
        window.location = '/blog';
    };

    return (
        <div>
            <form onSubmit={updatePost}>
                <label htmlFor="title">Title</label> <br />
                <input type="text" id="title" name="title" value={post.title} onChange={handleChange} />
                <br />
                <br />

                <label htmlFor="author">Author</label><br />
                <input type="text" id="author" name="authorr" value={post.authorr} onChange={handleChange} />
                <br /><br />

                <label htmlFor="description">Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" value={post.description} onChange={handleChange}></textarea>
                <br /><br />

                <label htmlFor="image">Image Link</label><br />
                <textarea rows="5" cols="50" id="image" name="image" value={post.image} onChange={handleChange}></textarea>
                <br /><br />
                <button type="button" className="deleteButton" onClick={deletePost}>
                    Delete
                </button>
            </form>
        </div>
    );
};

export default EditBlogPost;