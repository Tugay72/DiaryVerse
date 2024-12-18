import "./homepage.css";
import React from "react";
import Navbar from "../../components/navbar/homepage_navbar/homepage_navbar";
import Footer from "../../components/footer/footer";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

  return (
    <div className="homepage">
      <Navbar />
      
    {/* Hero Section */}
    <section className="hero-section">
    <div className="hero-content">
        <h1>Capture Your Thoughts with DiaryVerse</h1>
        <p>Write, reflect, and remember your moments every day. Start journaling now!</p>
        <button style={{
        width: '160px',
        height: '32px',
        fontSize: '16px',
        border: '2px solid white'
        }}
        onClick={() =>navigate('/login_page')}
        >Start Writing</button>
    </div>
    </section>

    {/* Features Section */}
    <section className="features-section">
    <h2>Why Choose DiaryVerse?</h2>
    <div className="features">
        <div className="feature-card">
        <h3>Simple and Intuitive</h3>
        <p>Our app is designed to be easy to use, so you can start writing right away!</p>
        </div>
        <div className="feature-card">
        <h3>Privacy First</h3>
        <p>Your thoughts are yours alone. Keep your entries private and secure.</p>
        </div>
        <div className="feature-card">
        <h3>Track Your Progress</h3>
        <p>See your writing journey evolve over time with built-in streaks and stats.</p>
        </div>
    </div>
    </section>

    {/* Explore Section */}
    <section className="features-section" style={{
        backgroundColor: 'white', padding: ' 96px 320px 240px 320px',
        }}>

        <h2 className="features-header">What You Can Do</h2>
        <div className="features" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
        }}>
            <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Keep It Private</h3>
                <p>Your diary is just for you. Secure your entries with a password and enjoy complete privacy!</p>
            </div>

            <div className="feature-card">
                <div className="feature-icon">🌙</div>
                <h3>Night Mode</h3>
                <p>Switch to night mode to protect your eyes during late-night writing sessions. Your diary, your rules!</p>
            </div>

            <div className="feature-card">
                <div className="feature-icon">🕰️</div>
                <h3>Time Travel</h3>
                <p>Revisit entries by date, or read your past thoughts on a specific day. Time travel through your own life!</p>
            </div>

            <div className="feature-card">
                <div className="feature-icon">🙃</div>
                <h3>Add Emojis</h3>
                <p>Enhance your entries with emojis to make your stories even more vivid and personal!</p>
            </div>

            <div className="feature-card">
                <div className="feature-icon">⏳</div>
                <h3>Writing Timer</h3>
                <p>Set a timer to encourage focused writing sessions. Challenge yourself to write without distractions!</p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h3>Rich Text Editing</h3>
                <p>Enhance your writing with bold, italics, underlining, and more! Our editor, powered by Draft.js, allows you to format your text and express creativity with ease.</p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">😊</div>
                <h3>Mood Tracker</h3>
                <p>Track your daily mood and see how your emotions evolve over time. It's a great way to reflect on your mental well-being!</p>
            </div>

            <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3>Random Inspiration</h3>
                <p>Need a spark of motivation? Get a random quote every time you click the button on the random quotes page!</p>
            </div>



            </div>
        </section>



      {/* Sign Up Section */}
      <section id="signup" className="signup-section">
        <h2>Get Started Now</h2>
        <p>Sign up today and start your journaling journey.</p>
        <button style={{
            width: '120px',
            height: '32px'
          }}>Sign Up</button>
      </section>

      <Footer />
    </div>
  );
}
