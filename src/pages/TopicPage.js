import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import data from "../data/data.json";
import { flattenTopics, searchTopics } from "../utils/topicSearch";
import "./Fundamentals.css";

function TopicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const allCards = useMemo(() => data.cards || [], []);
  const topicRefs = useRef({});

  const allTopics = useMemo(() => flattenTopics(allCards), [allCards]);

  const searchQuery = useMemo(() => {
    const queryFromUrl = (searchParams.get("search") || "").trim();
    const queryFromState = (location.state?.searchQuery || "").trim();
    return queryFromUrl || queryFromState;
  }, [searchParams, location.state]);

  const isSearchMode = Boolean(searchQuery);

  const filteredTopics = useMemo(() => {
    if (!isSearchMode) {
      return [];
    }
    return searchTopics(allTopics, searchQuery, allTopics.length);
  }, [allTopics, searchQuery, isSearchMode]);

  const stateSelectedTopicId = location.state?.selectedTopicId;

  const effectiveSlug = useMemo(() => {
    if (slug) {
      return slug;
    }

    if (stateSelectedTopicId) {
      const matchById = allTopics.find((topic) => topic.id === stateSelectedTopicId);
      if (matchById?.slug) {
        return matchById.slug;
      }

      const matchBySlug = allTopics.find((topic) => topic.slug === stateSelectedTopicId);
      if (matchBySlug?.slug) {
        return matchBySlug.slug;
      }
    }

    if (isSearchMode && filteredTopics.length > 0) {
      return filteredTopics[0].slug;
    }

    return allTopics[0]?.slug;
  }, [slug, stateSelectedTopicId, allTopics, isSearchMode, filteredTopics]);

  const topicIndex = useMemo(() => {
    if (!effectiveSlug) {
      return null;
    }

    for (let cardIndex = 0; cardIndex < allCards.length; cardIndex += 1) {
      const links = allCards[cardIndex]?.links || [];
      for (let linkIndex = 0; linkIndex < links.length; linkIndex += 1) {
        if (links[linkIndex]?.slug === effectiveSlug) {
          return { cardIndex, linkIndex };
        }
      }
    }

    return null;
  }, [allCards, effectiveSlug]);

  const [activeCard, setActiveCard] = useState(topicIndex?.cardIndex ?? 0);
  const [activeLink, setActiveLink] = useState(topicIndex?.linkIndex ?? 0);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!topicIndex) {
      return;
    }
    setActiveCard(topicIndex.cardIndex);
    setActiveLink(topicIndex.linkIndex);
  }, [topicIndex]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [effectiveSlug, searchQuery]);

  const sidebarTopics = useMemo(() => {
    if (isSearchMode) {
      return filteredTopics;
    }

    return (allCards[activeCard]?.links || []).map((link, linkIndex) => ({
      id: link?.id || link?.slug || `${activeCard}-${linkIndex}`,
      slug: link?.slug,
      title: link?.text,
      description: link?.pageContent?.description || "",
      cardIndex: activeCard,
      linkIndex,
    }));
  }, [isSearchMode, filteredTopics, allCards, activeCard]);

  const activeSlug = allCards[activeCard]?.links?.[activeLink]?.slug;

  useEffect(() => {
    if (!isSearchMode || !activeSlug) {
      return;
    }

    const activeTopicNode = topicRefs.current[activeSlug];
    if (activeTopicNode) {
      activeTopicNode.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeSlug, sidebarTopics, isSearchMode]);

  const copyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleSidebarTopicSelect = (topic) => {
    if (!topic) {
      return;
    }

    setActiveCard(topic.cardIndex);
    setActiveLink(topic.linkIndex);

    if (isMobile) {
      setSidebarOpen(false);
    }

    if (isSearchMode) {
      navigate(`/topic?search=${encodeURIComponent(searchQuery)}`, {
        replace: true,
        state: {
          selectedTopicId: topic.id,
          searchQuery,
        },
      });
      return;
    }

    if (topic.slug && topic.slug !== slug) {
      navigate(`/topic/${topic.slug}`);
    }
  };

  const selectedLink = allCards[activeCard]?.links?.[activeLink];
  const selectedContent = selectedLink?.pageContent;

  return (
    <div className="fundamentals-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: isMobile ? "0.5rem" : "1.5rem", marginTop: isMobile ? "0.5rem" : "1rem" }}>
        <h1 className="page-title" style={{ fontSize: isMobile ? "1.5rem" : "2rem", marginBottom: "1rem", color: "rgb(240, 82, 4)" }}>
          JavaScript Learning Hub
        </h1>

        {isSearchMode && (
          <div style={{ marginBottom: "1rem", color: "#4b5563", fontSize: "0.95rem" }}>
            Showing {filteredTopics.length} result{filteredTopics.length === 1 ? "" : "s"} for <strong>"{searchQuery}"</strong>
          </div>
        )}

        <div
          className="content-container"
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "0.5rem" : "1.5rem"
          }}
        >
          {isMobile && (
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
              style={{
                marginTop: "30px",
                padding: "0.5rem",
                marginBottom: "30px",
                background: "#A7C7E7",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            >
              {sidebarOpen ? "Close" : "Menu"}
            </button>
          )}

          <div
            className={`sidebar ${sidebarOpen ? "open" : ""}`}
            style={{
              width: isMobile ? "100%" : "300px",
              flexShrink: 0,
              display: isMobile ? (sidebarOpen ? "block" : "none") : "block",
              height: isMobile ? "auto" : "calc(100vh - 200px)",
              overflowY: "auto",
              marginBottom: isMobile ? "0.5rem" : "0"
            }}
          >
            <h2
              className="sidebar-title"
              style={{
                fontSize: "1.2rem",
                padding: "0.5rem",
                marginBottom: "0.5rem"
              }}
            >
              Topics
            </h2>

            <div className="sidebar-content" style={{ maxHeight: isMobile ? "60vh" : "none", overflowY: "auto" }}>
              {isSearchMode && filteredTopics.length === 0 ? (
                <div style={{ padding: "0.75rem", color: "#4b5563" }}>
                  <p style={{ marginBottom: "0.5rem" }}>No results found.</p>
                  <button
                    type="button"
                    className="copy-button"
                    onClick={() => navigate("/topic")}
                    style={{ marginLeft: 0, lineHeight: "34px" }}
                  >
                    Go to Learning Hub
                  </button>
                </div>
              ) : (
                <div className="sublinks-items">
                  {sidebarTopics.map((topic) => {
                    const isActive = topic.slug === activeSlug;
                    return (
                      <div
                        key={topic.id}
                        ref={(node) => {
                          if (node) {
                            topicRefs.current[topic.slug] = node;
                          }
                        }}
                        className={`sublink-item ${isActive ? "active" : ""}`}
                        onClick={() => handleSidebarTopicSelect(topic)}
                        style={{
                          padding: "0.75rem",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                          borderLeft: isActive ? "4px solid rgb(205, 98, 32)" : "4px solid transparent",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <div className="sublink-content" style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, fontSize: "1rem" }}>{topic.title}</h4>
                          <p
                            className="sublink-preview"
                            style={{
                              margin: "0.25rem 0 0",
                              fontSize: "0.8rem",
                              color: "#666"
                            }}
                          >
                            {topic.description?.substring(0, 60)}...
                          </p>
                        </div>
                        <div className="sublink-arrow" style={{ marginLeft: "0.5rem" }}>
                          {">"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div
            className="main-content"
            style={{
              flex: 1,
              minHeight: isMobile ? "auto" : "calc(100vh - 200px)",
              overflowY: "auto"
            }}
          >
            {selectedContent ? (
              <div
                className="content-card"
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  padding: "1rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                <div className="content-header" style={{ marginBottom: "1rem" }}>
                  <h2 style={{ margin: 0, fontSize: "1.25rem" }}>
                    <span style={{ color: "rgb(240, 82, 4)", textDecoration: "none", cursor: "pointer" }}>
                      {selectedLink?.text}
                    </span>
                  </h2>
                  <div
                    className="content-meta"
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginTop: "0.5rem",
                      fontSize: "0.85rem",
                      color: "#666"
                    }}
                  >
                    <span className="content-category">{allCards[activeCard]?.heading}</span>
                    <span className="content-difficulty">Beginner</span>
                  </div>
                </div>

                <div className="content-body">
                  <p className="content-description" style={{ marginBottom: "1rem" }}>
                    {selectedContent.description}
                  </p>

                  {selectedContent.title1 && (
                    <section className="content-section" style={{ marginBottom: "1.5rem" }}>
                      <div className="section-header" style={{ marginBottom: "0.75rem" }}>
                        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{selectedContent.title1}</h3>
                        <div
                          className="section-divider"
                          style={{
                            height: "1px",
                            background: "#eee",
                            margin: "0.5rem 0"
                          }}
                        ></div>
                      </div>
                      <p style={{ marginBottom: "1rem" }}>{selectedContent.para1}</p>
                      {selectedContent.code1 && (
                        <div
                          className="code-container"
                          style={{
                            background: "#f5f5f5",
                            borderRadius: "4px",
                            marginBottom: "1rem"
                          }}
                        >
                          <div
                            className="code-header"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "0.5rem",
                              background: "#e0e0e0",
                              borderTopLeftRadius: "4px",
                              borderTopRightRadius: "4px"
                            }}
                          >
                            <span className="code-language" style={{ fontSize: "0.8rem" }}>
                              JavaScript
                            </span>
                            <button
                              className={`copy-button ${copied ? "copied" : ""}`}
                              onClick={() => copyToClipboard(selectedContent.code1)}
                              style={{
                                padding: "0.25rem 0.5rem",
                                background: copied ? "#4caf50" : "#1976d2",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.8rem"
                              }}
                            >
                              {copied ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <pre
                            style={{
                              margin: 0,
                              padding: "1rem",
                              overflowX: "auto",
                              fontSize: "0.85rem"
                            }}
                          >
                            <code>{selectedContent.code1}</code>
                          </pre>
                        </div>
                      )}
                    </section>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="welcome-message"
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                <h2 style={{ marginBottom: "0.5rem" }}>Topic not found</h2>
                <p style={{ marginBottom: "1rem" }}>
                  No matching topic exists for slug: <strong>{slug || stateSelectedTopicId || "unknown"}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TopicPage;
