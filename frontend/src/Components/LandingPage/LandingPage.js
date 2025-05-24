import React, { useState, useEffect, useRef } from "react";
import "./LandingPage.css"; // Import your CSS styles
import '@fortawesome/fontawesome-free/css/all.min.css';


import dashboard from "../../images/dashboard.png";
import expense from "../../images/expense.png";
import income from "../../images/income.png";
import transaction from "../../images/transaction.png";

const ModernVaultAILanding = () => {
  const [notification, setNotification] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const particlesRef = useRef(null);
  const observerRef = useRef(null);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Create animated particles
  useEffect(() => {
    const createParticles = () => {
      if (!particlesRef.current) return;

      const particleCount = 50;
      particlesRef.current.innerHTML = "";

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 6 + "s";
        particle.style.animationDuration = Math.random() * 3 + 3 + "s";
        particlesRef.current.appendChild(particle);
      }
    };

    createParticles();
  }, []);

  // Show notification and setup intersection observer
  useEffect(() => {
    // Show notification after 1 second
    const notificationTimer = setTimeout(() => {
      setNotification(true);
      setTimeout(() => setNotification(false), 4000);
    }, 1000);

    // Setup intersection observer for animations
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Observe animated elements
    const animatedElements = document.querySelectorAll(
      ".feature-card, .faq-item"
    );
    animatedElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observerRef.current.observe(el);
    });

    return () => {
      clearTimeout(notificationTimer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Smooth scroll function
  const smoothScrollTo = (targetId) => {
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // FAQ item click handler
  const handleFAQClick = (e) => {
    const item = e.currentTarget;
    item.style.transform = "scale(0.98)";
    setTimeout(() => {
      item.style.transform = "translateY(-5px)";
    }, 150);
  };

  return (
    <>
      <div className="particles" ref={particlesRef}></div>

      {notification && (
        <div className="notification">
          <i
            className="fas fa-check-circle"
            style={{ marginRight: "0.5rem" }}
          ></i>
          Backend server is ready!
        </div>
      )}

      <div className={`header ${headerScrolled ? "scrolled" : ""}`}>
        <div className="logo">
          <h1>VaultAI</h1>
        </div>
        <ul className="nav-head">
          <li>
            <a onClick={() => smoothScrollTo("#features")}>Features</a>
          </li>
          <li>
            <a onClick={() => smoothScrollTo("#faq-section")}>FAQ</a>
          </li>
          <li>
            <a onClick={() => smoothScrollTo("#contact")}>Contact Us</a>
          </li>
          <a href="/login" className="btn btn-login">
            Login
          </a>
          <a href="/signup" className="btn btn-signup">
            Sign Up
          </a>
        </ul>
      </div>

      <div className="hero-section">
        <div className="texts">
          <h2>Welcome to</h2>
          <h1>VaultAI</h1>
          <p>
            Track expenses, manage budgets, and achieve your financial goals
            with AI-powered insights.
          </p>
          <a href="/signup" className="cta-button">
            Get Started
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>

      <div id="features" className="features">
        <h2 className="section-title">What do we do?</h2>
        <div className="feature-cards">
          <div className="feature-card odd">
            <div className="ftext">
              <h1>Track Your Expenses</h1>
              <p>
                Effortlessly log and categorize your daily expenses with
                intelligent automation to stay on top of your finances.
              </p>
            </div>
            <div className="feature-image">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
          <div className="feature-card even">
            <div className="feature-image">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            <div className="ftext">
              <h1>Manage Your Budget</h1>
              <p>
                Set smart budget limits and get real-time notifications when
                you're nearing them to avoid overspending.
              </p>
            </div>
          </div>
          <div className="feature-card odd">
            <div className="ftext">
              <h1>Visualize Your Data</h1>
              <p>
                Use interactive charts and AI-powered insights to understand
                your spending patterns and make informed decisions.
              </p>
            </div>
            <div className="feature-image">
              <i className="fas fa-chart-pie"></i>
            </div>
          </div>
        </div>
      </div>

      <div id="faq-section" className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item" onClick={handleFAQClick}>
          <h3>What is VaultAI?</h3>
          <p>
            VaultAI is a comprehensive AI-powered tool to help you track your
            expenses, manage your budgets, and achieve your financial goals with
            intelligent insights.
          </p>
        </div>
        <div className="faq-item" onClick={handleFAQClick}>
          <h3>How do I sign up?</h3>
          <p>
            You can sign up by clicking the 'Sign Up' button on the top right
            corner and filling out the registration form with your details.
          </p>
        </div>
        <div className="faq-item" onClick={handleFAQClick}>
          <h3>Is my data secure?</h3>
          <p>
            Yes, we prioritize your data security. All your data is encrypted
            end-to-end and stored securely on our servers with enterprise-grade
            protection.
          </p>
        </div>
        <div className="faq-item" onClick={handleFAQClick}>
          <h3>What features does VaultAI offer?</h3>
          <p>
            VaultAI offers AI-powered expense tracking, smart budget management,
            financial goal setting, and detailed analytics to help you manage
            your finances effectively.
          </p>
        </div>
      </div>

      <div id="contact" className="contact">
        <h2 className="section-title">Contact Us</h2>
        <div className="social-media-links">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </>
  );
};

export default ModernVaultAILanding;
