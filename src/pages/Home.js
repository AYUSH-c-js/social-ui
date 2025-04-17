import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import "./Home.css"; // Import the new CSS file

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Connect & Share with Friends</h1>
            <p className="hero-subtitle">
              Join our social network to connect with friends, share moments, and discover new experiences
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                <FaUserPlus />
                <span>Create Account</span>
              </Link>
              <Link to="/login" className="btn btn-outline">
                <FaSignInAlt />
                <span>Sign In</span>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-container">
              <div className="image-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon connect-icon"></div>
              <h3>Connect Easily</h3>
              <p>Find and connect with friends and family members across the globe</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon share-icon"></div>
              <h3>Share Moments</h3>
              <p>Share your precious moments with photos, videos, and stories</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon chat-icon"></div>
              <h3>Real-time Chat</h3>
              <p>Enjoy seamless messaging with individuals and groups</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon privacy-icon"></div>
              <h3>Privacy Control</h3>
              <p>Control who sees your content with advanced privacy settings</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p>Join thousands of people who already trust our platform</p>
          <Link to="/register" className="btn btn-primary">
            <span>Join Now</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} SocialApp. All rights reserved.</p>
          <div className="footer-links">
            <Link href="#">Terms</Link>
            <Link href="#">Privacy</Link>
            <Link href="#">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
