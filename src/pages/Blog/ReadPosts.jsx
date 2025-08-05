import React, { useState, useEffect } from 'react';
import Card from './BlogCard';
import { supabase } from './../../client';

const ReadPosts = (props) => {
    const [posts,setPosts] =useState([]);
    
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('Blog')
                    .select('*');

                if (error) {
                    throw error;
                }

                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error.message);
            }
        };

        fetchPosts();
    }, []); 

    return (
        <div className="ReadPosts">
            {posts && posts.length > 0 ? (
                posts.map((post, index) => (
                    <Card key={post.id} id={post.id} title={post.title} author={post.author} description={post.description} />
                ))
            ) : (
                <h2>{'No Challenges Yet 😞'}</h2>
            )}
        </div>
    );
};

export default ReadPosts;