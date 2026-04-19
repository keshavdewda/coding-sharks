import React from 'react';
import './Hero.css';

const Hero = ({ heading, subheading, ctaText, imageSrc, onCtaClick }) => {
  const highlightPhrase = "JavaScript, React & Node";
  const parts = heading.split(highlightPhrase);
  const before = parts[0] || "Master ";
  const after = parts[1] || " with Coding Sharks";

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 hero-content">
            <h1 className="hero-heading">
              {before}
              <span className="highlight-text">{highlightPhrase}</span>
              {after}
            </h1>
            <p className="hero-subheading">{subheading}</p>
            <div className="hero-cta-wrapper">
              <button
                type="button"
                className="btn btn-primary cta-button"
                onClick={onCtaClick}
              >
                {ctaText}
              </button>
              <div className="trust-line">
                <span>✓ Beginner to Advanced</span>
                <span>✓ Real Projects</span>
                <span>✓ Industry-Focused Learning</span>
              </div>
            </div>
          </div>
          <div className="col-lg-6 hero-image-container">
            <img
              src={imageSrc}
              alt="Coding Institute"
              className="img-fluid hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
