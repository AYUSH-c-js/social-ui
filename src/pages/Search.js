import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Search.css";
import { searchUser, getRandomPosts } from "../api/auth"; // Import getRandomPosts

const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [randomPosts, setRandomPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch 10 random posts when the component mounts
    const fetchRandomPosts = async () => {
      try {
        const response = await getRandomPosts();
        console.log("Random posts:", response.data.posts); // Debugging log
        setRandomPosts([...response.data.posts]);
      } catch (error) {
        console.error("Error fetching random posts", error);
      }
    };

    fetchRandomPosts();
  }, []);

  const handleSearch = async (e) => {
    console.log(randomPosts);
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.trim() === "") {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await searchUser(searchQuery);
      if (response.status !== 200) throw new Error("No users found");

      setUsers(response.data.users);
    } catch (error) {
      setError("No users found");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const changepage = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="search-container">
      <Navbar />
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for users..."
          value={query}
          onChange={handleSearch}
        />
      </div>

      {loading && <p className="loading">Searching...</p>}
      {error && <p className="error">{error}</p>}

      <div className="content">
        {query === "" ? (
          // Show random photos when no search is happening
          // <div className="random-posts">
          //   {randomPosts.map((post, index) => (
          //     <img
          //       key={index}
          //       src={post.image}
          //       alt={post.content}
          //       className="random-photo"
          //     />
          //   ))}
          // </div>
          <></>
        ) : (
          // Show search results when searching
          <div className="search-results">
            {users.map((user) => (
              <div key={user._id} className="user-card" onClick={() => changepage(user._id)}>
                <img
                  src={user.profilePicture || "https://via.placeholder.com/50"}
                  alt={user.username}
                  className="user-avatar"
                />
                <p className="username">{user.username}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
