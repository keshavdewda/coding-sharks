import React from 'react';
import './AIInterface.css';

const AIInterface = () => {
  return (
    <div className="saas-container">
      <div className="saas-card">
        <header className="saas-header">
          <h1 className="saas-title">Coding Sharks AI</h1>
          <p className="saas-subtitle">Enter your prompt below to generate magic.</p>
        </header>

        <div className="saas-content">
          <div className="input-wrapper">
            <span className="input-icon">✦</span>
            <input 
              type="text" 
              className="premium-input" 
              placeholder="Ask me anything..."
              aria-label="AI Prompt"
            />
          </div>

          <button className="premium-button">
            Generate Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInterface;
