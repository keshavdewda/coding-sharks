import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchTopics } from "../utils/topicSearch";

const SearchBar = ({ topics }) => {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const suggestions = useMemo(
    () => searchTopics(topics, debouncedQuery, 4),
    [topics, debouncedQuery]
  );

  const hasResults = suggestions.length > 0;

  useEffect(() => {
    setActiveIndex(hasResults ? 0 : -1);
  }, [hasResults, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeDropdown = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const executeItem = (index) => {
    const selectedTopic = suggestions[index];
    if (!selectedTopic) return;

    navigate("/topic", {
      state: {
        selectedTopicId: selectedTopic.id,
        searchQuery: debouncedQuery,
      },
    });

    closeDropdown();
  };

  const handleKeyDown = (event) => {
    if (!isOpen || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const safeIndex = activeIndex >= 0 ? activeIndex : 0;
      executeItem(safeIndex);
      return;
    }

    if (event.key === "Escape") {
      closeDropdown();
    }
  };

  return (
    <div className="navbar-search" ref={rootRef}>
      <svg
        className="search-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21 21L16.65 16.65M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        className="navbar-search-input"
        placeholder="Search topics, examples..."
        aria-label="Search topics, examples"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (query.trim()) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
      />

      {isOpen && query.trim() && (
        <div className="search-dropdown" role="listbox" aria-label="Topic suggestions">
          {hasResults && <div className="search-dropdown-label">Suggestions</div>}

          {!hasResults && (
            <div className="search-empty">
              <div className="search-empty-title">No results found</div>
            </div>
          )}

          {suggestions.map((topic, index) => (
            <button
              key={topic.id}
              type="button"
              className={`search-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => executeItem(index)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="search-item-title">
                <strong>{topic.title}</strong>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
