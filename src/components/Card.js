import { useNavigate } from 'react-router-dom';
import './Card.css';

const Card = ({ heading, links }) => {
  const navigate = useNavigate();

  if (!links || !Array.isArray(links)) {
    return <div className="card">Error: Invalid links data</div>;
  }

  const currentPath = window.location.pathname;
  const firstLinkPath = links[0]?.slug ? `/topic/${links[0].slug}` : null;

  const handleCardClick = (event) => {
    if (event.target.closest('a') || event.target.closest('button') || !firstLinkPath) return;
    navigate(firstLinkPath);
  };

  const handleCardKeyDown = (event) => {
    if (!firstLinkPath) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate(firstLinkPath);
    }
  };

  return (
    <div
      className="card"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role={firstLinkPath ? "link" : undefined}
      tabIndex={firstLinkPath ? 0 : undefined}
      aria-label={firstLinkPath ? `${heading || 'Card'} card` : undefined}
    >
      {heading && <h3 className="card-heading">{heading}</h3>}
      <div className="card-links">
        {links.map((topic, index) => (
          <button
            key={index}
            type="button"
            onClick={() => topic?.slug && navigate(`/topic/${topic.slug}`)}
            className={`card-link${currentPath === `/topic/${topic.slug}` ? ' is-selected' : ''}`}
            aria-current={currentPath === `/topic/${topic.slug}` ? "page" : undefined}
          >
            {topic.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Card;


