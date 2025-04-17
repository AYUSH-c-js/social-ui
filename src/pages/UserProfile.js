import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getUserDataById,
  getAllPostsById,
  likePostById,
  requestFollow,
  deleteRequestFollow,
  unfollowuser,
  followers,
  following,
} from "../api/auth";
import "./UserProfile.css"; // Add styling
import Navbar from "../components/Navbar"; // Import Navbar
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get profile user ID from URL
  const loggedInUserId = localStorage.getItem("token"); // Get logged-in user ID
  const [isprivate, setIsPrivate] = useState(false); // State to check if the profile is private
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequested, setIsRequested] = useState(false); // Separate state for follow requests
  const [userfolloers , setUserFollowers] = useState([]); // State to store followers
  const [userfollowing , setUserFollowing] = useState([]); // State to store following
  const [isclick1, setIsClick1] = useState(false); // State to track click on followers
  const [isclick2, setIsClick2] = useState(false); // State to track click on following

  useEffect(() => {
    fetchUserProfile();
  }, [userId, loggedInUserId]);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserDataById(userId);
      const response2 = await getAllPostsById(userId);
      const response3 = await followers(userId); // Fetch followers
      const response4 = await following(userId); // Fetch following
      setIsFollowing([...response4.data.following]); // Set followers
      setUserFollowers([...response3.data.followers]); // Set followers

      response.data.user.posts = response2.data.posts; // Add posts to user data
      console.log(response.data.user.accountType);
      if(response.data.user.accountType === "private") {
        setIsPrivate(true); // Set profile as private
      }
      setUser({ ...response.data.user });
      console.log("user", response.data.user);
      // **Follow Status Checks**
      setIsFollowing(response.data.user.followers?.includes(loggedInUserId)); // Check if already following
      // console.log("isFollowing", isFollowing);
      setIsRequested(response.data.user.followRequestsReceived?.includes(loggedInUserId)); // Check if request is sent
      console.log("isRequested", response.data.user.followRequestsReceived?.includes(loggedInUserId));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePostById(loggedInUserId, postId);
      fetchUserProfile(); // Refresh user profile after liking
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
const changepage = (postId)=>{
  navigate(`/post/${postId}`)
}
  const handleFollow = async () => {
    try {
      if(!isFollowing) {
        if (isRequested) {
          // **Cancel Follow Request**
          const response = await deleteRequestFollow(userId);
          if (response.status === 200) {
            setIsRequested(false);
          } else {
            console.error("Error canceling follow request:", response.data);
          }
        } else if (!isRequested) {
          // **Send Follow Request**
          const response = await requestFollow(userId);
          if (response.status === 200) {
            setIsRequested(true);
          } else {
            console.error("Error sending follow request:", response.data);
          }
        } else {
          console.log("Already following or request pending.");
        }
      }
      else{
        const response = await unfollowuser(userId);
        if (response.status === 200) {
          setIsFollowing(false);
        } else {
          console.error("Error unfollowing user:", response.data);
        }

      }
    } catch (error) {
      console.error("Error handling follow:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <>
      <Navbar />
      <div className="user-profile">
        <div className="profile-header">
          <img
            src={user.profilePicture || "https://via.placeholder.com/100"}
            alt={user.username}
            className="profile-pic"
          />
          <div className="profile-info">
            <h2>{user.username}</h2>
            <p>{user.bio || "No bio available"}</p>
            <div className="stats">
              <span>{user.posts?.length || 0} Posts</span>
              <span onClick={()=>{
                setIsClick1(true);
                setIsClick2(false);
              }}>{user.followers?.length || 0} Followers</span>
              <span onClick={()=>{
                setIsClick2(true);
                setIsClick1(false);
              }}
              >{user.following?.length || 0} Following</span>
            </div>

            {/* Follow Button */}
            {loggedInUserId !== userId && (
              <button
                className={`follow-btn ${isFollowing ? "unfollow" : isRequested ? "requested" : "follow"}`}
                onClick={handleFollow}
              >
                {isFollowing ? "Unfollow" : isRequested ? "Requested" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Display User Posts */}
        {isprivate && !isFollowing ? (
          <p>This account is private. Follow to see posts.</p>
        ) : (
          <div className="profile-posts">
          {user.posts?.length > 0 ? (
            user.posts.map((post) => (
              <div key={post._id} className="post-card">
                <img src={post.image || "https://via.placeholder.com/150"} alt="Post" />
                <div className="post-actions">
                  <button className="like-btn" onClick={() => handleLike(post._id)}>
                    ❤️ {post.likes.length}
                  </button>
                  <button className="comment-btn" onClick={()=>changepage(post._id)}>💬{post.comments.length} Comment</button>
                </div>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
