import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { fetchcomments, getpost, likePost,postComment } from '../api/auth';
import './Displaypost.css';

const DisplayPost = () => {
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [newComment, setNewComment] = useState("");
    const [comments,setcomments] = useState([]);

    useEffect(() => {
        fetchData();
        console.log("Post ID:", postId);
    }, [postId]);

    const fetchData = async () => {
        
        const response = await getpost(postId)
            console.log("Post data:", response.data.post);
            setPost({ ...response.data.post });
            fetchcomment(postId);
        
    };

    const fetchcomment = async (postId) => {
        try {
            const response = await fetchcomments(postId);
            // console.log(post)
            setcomments([...response.data.comments]);
            console.log("Comments data:", response.data.comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }
        
const handleLike = async (postId) => {
    try {
      const response = await likePost(postId);

  
    //   setPosts(updatedPosts);
      fetchData(); // Refresh posts after liking
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
    const handleCommentSubmit = async () => {
        if (newComment.trim() !== "") {
            const response = await postComment(postId, { text: newComment });
            fetchcomment(postId);
            console.log("Comment response:", response.data);
            alert("Comment submitted: " + newComment);
            setNewComment("");
        }
    };

    return (
        <div className="display-post-container">
            {/* Left: Comments and New Comment */}
            <div className="left-comment-section">
                <h2>Comments</h2>
                <div className="comments-box">
                    {comments?.length > 0 ? (
                        comments.map((comment, idx) => (
                            <div key={idx} className="comment-card">
                                <strong>{comment.user.username}</strong>
                                <p>{comment.text}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-comments">No comments yet.</p>
                    )}
                </div>

                <div className="add-comment-box">
                    <textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleCommentSubmit}>Post Comment</button>
                </div>
            </div>

            {/* Right: Post */}
            <div className="right-post-section">
                <div className="post-card">
                    <img src={post.image || "https://via.placeholder.com/500"} alt="Post" />
                    <div className="post-info">
                        <h3>{post.username}</h3>
                        <p>{post.content}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayPost;
