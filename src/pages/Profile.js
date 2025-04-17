import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfilePost from "../components/ProfilePost";
import "./Profile.css";
import { getUserData, updateUserData, userfollowers, userfollowing } from "../api/auth";
import uploadfile from "../functions/uploadfile";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isFollowers, setIsFollowers] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerslist, setFollowerslist] = useState([]);
  const [followinglist, setFollowinglist] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profilePicture: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        const response1 = await userfollowers();
        const response2 = await userfollowing();
        setFollowerslist([...response1.data.followers]);
        setFollowinglist([...response2.data.following]);
        setUserData(response.data.user);
        setFormData({
          username: response.data.user.username,
          bio: response.data.user.bio || "",
          profilePicture: response.data.user.profilePicture || ""
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadfile(file);
        setFormData({ ...formData, profilePicture: imageUrl });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserData(formData);
      setUserData(formData);
      setIsEdit(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        {/* Left Side */}
        <div className="profile-left">
          <ul>
            <h3 onClick={() => {
              setIsFollowers(true)
              setIsFollowing(false)
              setIsEdit(false)
            
            }}>Followers</h3>
            <p>{followerslist.length}</p>
            <h3 onClick={() => {
              setIsFollowing(true)
              setIsEdit(false)
              setIsFollowers(false)
              }}>Following</h3>
            <p>{followinglist.length}</p>
          </ul>
          <ul>
            <button onClick={() => {
              setIsEdit(true)
              setIsFollowers(false)
              setIsFollowing(false)
              }
            }>Edit Profile</button>
          </ul>
          <ul>
            <button onClick={onLogout}>Logout</button>
          </ul>

          {/* Edit Form */}
          {isEdit && (
            <div className="edit-form">
              <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />

                <label>Bio:</label>
                <input
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />

                <label>Profile Picture:</label>
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {formData.profilePicture && (
                  <img src={formData.profilePicture} alt="Profile Preview" width="100" />
                )}

                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setIsEdit(false)}>
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Followers List */}
          {isFollowers && (
            <div className="followers-list">
              <h2>Followers</h2>
              {followerslist.map((follower, index) => (
                <div key={index} className="follower-item">
                  <img src={follower.profilePicture} alt="Follower" width="50" />
                  <p>{follower.username}</p>
                </div>
              ))}
              <button onClick={() => setIsFollowers(false)}>Close</button>
            </div>
          )}

          {/* Following List */}
          {isFollowing && (
            <div className="following-list">
              <h2>Following</h2>
              {followinglist.map((following, index) => (
                <div key={index} className="following-item">
                  <img src={following.profilePicture} alt="Following" width="50" />
                  <p>{following.username}</p>
                </div>
              ))}
              <button onClick={() => setIsFollowing(false)}>Close</button>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="profile-right">
          <div className="profile-photo">
            <img
              src={userData?.profilePicture || "https://preview.redd.it/first-of-my-ghibli-profile-pictures-v0-9vprd2affsia1.jpg?width=640&crop=smart&auto=webp&s=565061775a3c37e3b7a854c2d441411337da92f3"}
              alt="Profile"
              height={100}
              width={100}
            />
          </div>
          <h2>{userData?.username || "User Name"}</h2>
          <p>{userData?.bio || ""}</p>
          <ProfilePost />
        </div>
      </div>
    </div>
  );
};

export default Profile;
