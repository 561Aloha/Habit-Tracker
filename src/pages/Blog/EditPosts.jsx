import React from "react";
import { supabase } from '../../client'

const EditPosts= ()=>{
    const updatePost = async (event) => {
        await supabase
        .from('Posts')
        .update({ title: post.title, author: post.author,  description: post.description})
        .eq('id', id);}
    return(
        <h6>not created yet</h6>
    )
}
export default EditPosts;