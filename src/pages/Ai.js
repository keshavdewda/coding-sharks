import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Ai() {
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const typingIntervalRef = useRef(null);

  // Typing effect (unchanged)
  useEffect(() => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    if (!aiResponse) {
      setDisplayedResponse("");
      return;
    }
    let index = 0;
    setDisplayedResponse("");
    typingIntervalRef.current = setInterval(() => {
      index++;
      setDisplayedResponse(aiResponse.slice(0, index));
      if (index >= aiResponse.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }, 24);
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [aiResponse]);

  // Response generator (unchanged)
  const generateResponse = (query) => {
    void query;
    return `Hi 🤖  
I’m Coding Sharks AI Mentor.

Our team is currently working on this feature to provide you with the best experience.  
It will be available very soon 🚀

Thank you for your patience!`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = userInput.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setAiResponse("");
    setDisplayedResponse("");
    setUserInput("");
    setTimeout(() => {
      try {
        const response = generateResponse(trimmed);
        setAiResponse(response);
      } catch (err) {
        setError("Failed to generate response. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const suggestionClick = (text) => {
    setUserInput(text);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleSubmit(fakeEvent);
    }, 50);
  };

  return (
    <>
      <div
        className="Home"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#f9fafb",
        }}
      >
        <Navbar />

        {/* Subtle gradient background - moved to separate div without affecting footer */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 40%, rgba(249,115,22,0.04) 0%, rgba(249,115,22,0) 70%), linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ flex: 1, padding: "32px 20px 48px", position: "relative", zIndex: 1 }}>
          {/* Hero Section – fixed text cut issue */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(249,115,22,0.08)",
                padding: "4px 14px",
                borderRadius: "40px",
                marginBottom: "16px",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(249,115,22,0.15)",
              }}
            >
              <i className="fas fa-microchip" style={{ color: "#f97316", fontSize: "12px" }} />
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#f97316", letterSpacing: "0.3px" }}>
                NEXT-GEN AI ASSISTANT
              </span>
            </div>
            <h1
              style={{
                margin: "0 0 8px",
                fontSize: "2.8rem",
                fontWeight: "700",
                letterSpacing: "-0.02em",
                lineHeight: "1.2",
                padding: "0 0 2px",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Coding Shark AI
            </h1>
            <p style={{ color: "#6b7280", maxWidth: "480px", margin: "0 auto", fontSize: "1rem", fontWeight: "400" }}>
              Your intelligent pair programmer for production-grade solutions
            </p>
          </div>

          {/* Main container */}
          <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0" }}>
            {/* Input Card */}
            <div
              style={{
                background: "white",
                borderRadius: "24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
                marginBottom: "20px",
                overflow: "hidden",
                transition: "box-shadow 0.2s, transform 0.2s",
                border: "1px solid #f0f2f5",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 24px -12px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <form onSubmit={handleSubmit}>
                <div style={{ padding: "24px 28px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      fontWeight: "600",
                      color: "#1e293b",
                      fontSize: "14px",
                    }}
                  >
                    <i className="fas fa-comment-dots" style={{ color: "#f97316", fontSize: "15px" }} />
                    Ask Coding Shark AI
                    <span
                      style={{
                        background: "#f1f5f9",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        fontSize: "10px",
                        fontWeight: "500",
                        color: "#f97316",
                      }}
                    >
                      BETA
                    </span>
                  </label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask anything about JavaScript, React, Node.js, TypeScript, algorithms..."
                    style={{
                      width: "100%",
                      minHeight: "100px",
                      padding: "12px 18px",
                      borderRadius: "20px",
                      border: "1.5px solid #e9edf2",
                      fontSize: "14px",
                      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                      resize: "vertical",
                      transition: "all 0.2s",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#ffffff",
                      lineHeight: "1.5",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#f97316";
                      e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.12)";
                      e.target.style.background = "#ffffff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e9edf2";
                      e.target.style.boxShadow = "none";
                      e.target.style.background = "#ffffff";
                    }}
                    required
                  />
                  <div
                    style={{
                      marginTop: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    {/* Improved Enter key visibility */}
                    <div style={{ color: "#5b6e8c", fontSize: "11px", fontWeight: "500", display: "flex", gap: "16px" }}>
                      <span>
                        <i className="far fa-keyboard" style={{ fontSize: "11px", marginRight: "4px" }} />
                        Press{" "}
                        <kbd
                          style={{
                            background: "#eef2ff",
                            padding: "2px 6px",
                            borderRadius: "6px",
                            fontFamily: "monospace",
                            fontSize: "10px",
                            fontWeight: "600",
                            color: "#f97316",
                          }}
                        >
                          ↵ Enter
                        </kbd>{" "}
                        to submit
                      </span>
                      <span>
                        <i className="fas fa-magic" style={{ fontSize: "11px", marginRight: "4px" }} />
                        SharkMind™
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: "8px 24px",
                        background: loading ? "#cbd5e1" : "linear-gradient(105deg, #f97316, #ea580c)",
                        color: "white",
                        border: "none",
                        borderRadius: "40px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        transition: "all 0.25s cubic-bezier(0.2, 0, 0, 1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: loading ? "none" : "0 2px 6px rgba(249,115,22,0.3)",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 16px -4px rgba(249,115,22,0.4)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 6px rgba(249,115,22,0.3)";
                        }
                      }}
                    >
                      {loading ? (
                        <>
                          <span>Processing</span>
                          <div
                            style={{
                              width: "14px",
                              height: "14px",
                              border: "2px solid white",
                              borderTop: "2px solid transparent",
                              borderRadius: "50%",
                              animation: "spin 0.8s linear infinite",
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <span>Ask AI</span>
                          <i className="fas fa-arrow-right" style={{ fontSize: "11px" }} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  marginBottom: "20px",
                  padding: "12px 18px",
                  borderRadius: "16px",
                  borderLeft: "3px solid #dc2626",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }} /> {error}
              </div>
            )}

            {/* Response Card */}
            <div
              style={{
                background: "white",
                borderRadius: "24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
                overflow: "hidden",
                border: "1px solid #f0f2f5",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  padding: "16px 28px",
                  borderBottom: "1px solid #f0f2f5",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                    borderRadius: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(249,115,22,0.15)",
                  }}
                >
                  <i className="fas fa-robot" style={{ color: "white", fontSize: "16px" }} />
                </div>
                <div>
                  <h3 style={{ margin: "0", fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>AI Response</h3>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#f97316", fontWeight: "500" }}>
                    real-time intelligence
                  </p>
                </div>
                {loading && (
                  <div style={{ marginLeft: "auto" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        background: "#fff0e6",
                        padding: "4px 12px",
                        borderRadius: "30px",
                        color: "#f97316",
                      }}
                    >
                      <i className="fas fa-spinner fa-pulse" /> generating
                    </span>
                  </div>
                )}
              </div>

              <div style={{ padding: "28px" }}>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "32px 20px" }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        margin: "0 auto 16px",
                        border: "3px solid #f1f5f9",
                        borderTop: "3px solid #f97316",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    <p style={{ color: "#f97316", fontWeight: "500", margin: 0, fontSize: "14px" }}>
                      Analyzing your query...
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "6px" }}>
                      Generating production-grade response
                    </p>
                  </div>
                ) : aiResponse ? (
                  <div
                    className="ai-response"
                    style={{
                      whiteSpace: "pre-wrap",
                      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                      lineHeight: "1.6",
                      color: "#1e293b",
                      fontSize: "14px",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: displayedResponse
                          .replace(/\*\*(.*?)\*\*/g, "<strong style='color:#f97316; font-weight:600;'>$1</strong>")
                          .replace(/`([^`]+)`/g, "<code style='background:#f1f5f9; padding:2px 6px; border-radius:6px; font-family:monospace; font-size:13px;'>$1</code>")
                          .replace(/```(\w+)?\n([\s\S]*?)```/g, "<pre style='background:#1e1e2a; color:#e2e8f0; padding:14px; border-radius:14px; overflow-x:auto; margin:14px 0; font-size:13px;'><code style='background:none; padding:0;'>$2</code></pre>")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                    <div
                      style={{
                        marginTop: "20px",
                        paddingTop: "14px",
                        borderTop: "1px solid #eef2f6",
                        fontSize: "12px",
                        color: "#64748b",
                        display: "flex",
                        gap: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(aiResponse);
                        alert("Response copied to clipboard!");
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <i className="far fa-copy" style={{ fontSize: "12px" }} /> Copy response
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "32px 20px", color: "#94a3b8" }}>
                    <i className="fas fa-comment-dots" style={{ fontSize: "42px", marginBottom: "12px", opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: "14px" }}>Your AI response will appear here</p>
                    <p style={{ fontSize: "12px", marginTop: "6px" }}>Ask a technical question to get started</p>
                  </div>
                )}
              </div>
            </div>

            {/* Suggestion chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
                marginTop: "28px",
              }}
            >
              {[
                { icon: "🎯", text: "React useEffect cleanup" },
                { icon: "⚡", text: "Node.js performance tips" },
                { icon: "📦", text: "Custom React hooks" },
                { icon: "🛡️", text: "Error handling patterns" },
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => suggestionClick(suggestion.text)}
                  style={{
                    background: "white",
                    border: "1px solid #eef2f6",
                    borderRadius: "100px",
                    padding: "6px 16px",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#334155",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#f97316";
                    e.currentTarget.style.background = "#fff7ed";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#eef2f6";
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span style={{ fontSize: "13px" }}>{suggestion.icon}</span>
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - now properly visible with background and spacing */}
        <Footer />
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          kbd {
            font-family: 'SF Mono', 'Fira Code', monospace;
          }
          .ai-response pre {
            margin: 12px 0;
          }
          .ai-response code {
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 12px;
          }
          /* Ensure no text clipping */
          h1, .heading {
            overflow: visible;
          }
          /* Make sure footer has proper background and is above any overlays */
          footer, .Footer {
            position: relative;
            z-index: 2;
            background: #ffffff;
            border-top: 1px solid #eef2f6;
          }
        `}
      </style>
    </>
  );
}

export default Ai;
