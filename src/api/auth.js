import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Update if needed

export const register = async (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

export const login = async (userData) => {
  return axios.post(`${API_URL}/auth/login`, userData);
};

export const profile = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserData = async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/users/${token}`);
  };

export const getUserDataById = async (userId) => {
    // const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/users/${userId}`);
  }
export const updateUserData = async (userData) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/users/${token}`, userData);
  }
  
export const getAllPosts = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/posts/user/${token}` );
}
export const requestFollow = async (userId) => {
  const token = localStorage.getItem("token");
  console.log("userId",userId);
  console.log("token",token);
  return axios.post(`${API_URL}/follow/${userId}/follow/${token}`);
}

export const deleteRequestFollow = async (userId) => {
  // console.log("dcall");
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/follow/${userId}/cancel-follow-request/${token}`);
}

export const getAllPostsById = async (userId) => {
  // const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/posts/user/${userId}` );
}

export const createPost = async (postData) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/posts/${token}`, postData);
}

export const likePost = async (postId) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/likes/${token}/${postId}`);
}

export const likePostById = async (userId,postId) => {
  // const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/likes/${userId}/${postId}`);
}
export const deletePost = async (postId) => {
  const token = localStorage.getItem("token");
  return axios.delete(`${API_URL}/posts/${postId}/${token}`);
}

export const searchUser = async (username) => {
  return axios.get(`${API_URL}/users/search/${username}`);
}

export const getRandomPosts = async () => {
  return await axios.get(`${API_URL}/posts/random`);
};

export const getFollowRequests = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/users/get-requests/${token}`);
}

export const acceptFollowRequest = async (userId) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/follow//${token}/approve-follow/${userId}`);
}

export const rejectFollowRequest = async (userId) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/follow/${token}/reject-follow/${userId}`);
}

export const unfollowuser = async (userId) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/follow/${userId}/unfollow/${token}`);
}


export const userfollowers = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/follow/${token}/followers`);
}
export const followers = async (userId) => {
  return axios.get(`${API_URL}/follow/${userId}/followers`);
}

export const userfollowing = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/follow/${token}/following`);
}

export const following = async (userId) => {
  return axios.get(`${API_URL}/follow/${userId}/following`);
}

export const getpost = async (postId) => {
  return axios.get(`${API_URL}/posts/${postId}`);
}

export const postComment = async (postId, commentData) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/comments/${postId}/${token}`, commentData);
}

export const fetchcomments = async (postId) => {
  return axios.get(`${API_URL}/comments/post/${postId}`);
}

export const sendMessage = async ({ senderId, receiverId, text }) => {
  return axios.post(`${API_URL}/messages`, { senderId, receiverId, text });
};

export const getMessages = async (user1Id, user2Id) => {
  return axios.get(`${API_URL}/messages/${user1Id}/m/${user2Id}`);
};

export const deleteMessage = async (messageId, senderId) => {
  return axios.delete(`${API_URL}/messages/${messageId}`, { senderId : senderId  });
};


export const forgotpassword = async (email) => {
  return axios.post(`${API_URL}/auth/forgot-password`, email);
}