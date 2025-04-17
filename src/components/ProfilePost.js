import React, { useEffect, useState, useRef } from "react";
import "./ProfilePost.css";
import { getAllPosts, createPost, likePost, deletePost } from "../api/auth";
import uploadfile from "../functions/uploadfile";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaComment, FaTrash, FaImage, FaPaperPlane, FaRegClock } from "react-icons/fa";

const ProfilePost = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle image preview
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const fetchPosts = async () => {
    try {
      const response = await getAllPosts();

      if (response.data && response.data.posts) {
        setPosts(response.data.posts);
      } else {
        console.error("Unexpected response format:", response.data);
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() && !imageFile) {
      alert("Please add text or an image!");
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = null;

      if (imageFile) {
        uploadedImageUrl = await uploadfile(imageFile);
      }

      await createPost({
        content: newPost,
        image: uploadedImageUrl
      });

      setNewPost("");
      setImageFile(null);
      setPreviewUrl(null);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await likePost(postId);
      const updatedPosts = posts.map(post =>
        post._id === postId
          ? { ...post, likes: response.data.liked ? [...post.likes, "userId"] : post.likes.filter(id => id !== "userId") }
          : post
      );

      setPosts(updatedPosts);
      fetchPosts();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const navigateToPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="profile-posts-container">
      {/* Create New Post */}
      <div className="create-post-card">
        <h2>Share a New Post</h2>
        <div className="create-post-content">
          <textarea
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />

          {previewUrl && (
            <div className="image-preview-container">
              <img src={previewUrl} alt="Preview" className="image-preview" />
              <button className="remove-image-btn" onClick={handleRemoveImage}>×</button>
            </div>
          )}

          <div className="create-post-actions">
            <div className="file-input-wrapper">
              <button
                type="button"
                className="file-input-btn"
                onClick={triggerFileInput}
              >
                <FaImage /> Add Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden-file-input"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            <button
              className="create-post-btn"
              onClick={handleCreatePost}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Post</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="posts-feed">
        <h2>Recent Posts</h2>

        {posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post) => (
              <div className="post-card" key={post.id || post._id}>
                {post.image && (
                  <div className="post-image-container">
                    <img src={post.image || "https://via.placeholder.com/300"} alt="Post" />
                  </div>
                )}
                <div className="post-content">
                  <div className="post-meta">
                    <div className="post-user">
                      <div className="post-avatar">
                        {post.user?.username?.charAt(0) || "U"}
                      </div>
                      <div className="post-user-info">
                        <div className="post-username">{post.user?.username || "User"}</div>
                        <div className="post-date">
                          <FaRegClock /> {formatDate(post.createdAt || new Date())}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="post-text">{post.content}</p>

                  <div className="post-actions">
                    <button
                      className={`action-btn like-btn ${post.likes?.includes("userId") ? "liked" : ""}`}
                      onClick={() => handleLike(post._id)}
                    >
                      <FaHeart /> <span>{post.likes?.length || 0}</span>
                    </button>

                    <button
                      className="action-btn comment-btn"
                      onClick={() => navigateToPost(post._id)}
                    >
                      <FaComment /> <span>{post.comments?.length || 0}</span>
                    </button>

                    <button
                      className="action-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post._id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-posts">
            <p>No posts yet. Create your first post!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePost;
