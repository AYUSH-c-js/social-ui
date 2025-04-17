import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getFollowRequests, acceptFollowRequest, rejectFollowRequest } from "../api/auth";

const Notifications = () => {
  const [followRequests, setFollowRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getFollowRequests();
        console.log("Follow requests:", response.data); // Debugging log
        setFollowRequests([...response.data]);
      } catch (error) {
        console.error("Error fetching follow requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (userId) => {
    try {
      await acceptFollowRequest(userId);
      setFollowRequests(followRequests.filter((req) => req._id !== userId));
    } catch (error) {
      console.error("Error accepting follow request:", error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectFollowRequest(userId);
      setFollowRequests(followRequests.filter((req) => req._id !== userId));
    } catch (error) {
      console.error("Error rejecting follow request:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Notifications</h2>
      {followRequests.length > 0 ? (
        <ul>
          {followRequests.map((user) => (
            <li key={user._id}>
              <span>{user.username} sent you a follow request.</span>
              <button onClick={() => handleAccept(user._id)}>Accept</button>
              <button onClick={() => handleReject(user._id)}>Reject</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No new follow requests.</p>
      )}
    </div>
  );
};

export default Notifications;
