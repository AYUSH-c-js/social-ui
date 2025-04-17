import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaSearch, FaBell, FaComments, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css"; // Add CSS for styling

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          SocialApp
        </Link>

        {/* Mobile menu button */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation links */}
        <div className={`navbar-menu ${isOpen ? "active" : ""}`}>
          <Link to="/profile" className={`navbar-link ${isActive("/profile")}`}>
            <FaUser className="navbar-icon" />
            <span className="navbar-text">Profile</span>
          </Link>

          <Link to="/search" className={`navbar-link ${isActive("/search")}`}>
            <FaSearch className="navbar-icon" />
            <span className="navbar-text">Search</span>
          </Link>

          <Link to="/notifications" className={`navbar-link ${isActive("/notifications")}`}>
            <FaBell className="navbar-icon" />
            <span className="navbar-text">Notifications</span>
          </Link>

          <Link to="/chat" className={`navbar-link ${isActive("/chat")}`}>
            <FaComments className="navbar-icon" />
            <span className="navbar-text">Chat</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
