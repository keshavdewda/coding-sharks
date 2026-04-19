export const flattenTopics = (cards = []) => {
  return cards.flatMap((card, cardIndex) =>
    (card?.links || []).map((link, linkIndex) => {
      const title = link?.text || "";
      const description = link?.pageContent?.description || "";
      const keywords = Array.isArray(link?.keywords) ? link.keywords : [];
      const category = card?.heading || "";

      return {
        id: link?.id || link?.slug || `${cardIndex}-${linkIndex}`,
        slug: link?.slug,
        title,
        description,
        category,
        keywords,
        cardIndex,
        linkIndex,
      };
    })
  );
};

export const searchTopics = (topics = [], query = "", maxResults = 5) => {
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) {
    return [];
  }

  const scored = topics
    .map((topic) => {
      const title = (topic?.title || "").toLowerCase();
      const description = (topic?.description || "").toLowerCase();
      const category = (topic?.category || "").toLowerCase();
      const keywords = Array.isArray(topic?.keywords)
        ? topic.keywords.map((keyword) => String(keyword).toLowerCase())
        : [];

      const titleMatch = title.includes(trimmedQuery);
      const descriptionMatch = description.includes(trimmedQuery);
      const categoryMatch = category.includes(trimmedQuery);
      const keywordMatch = keywords.some((keyword) => keyword.includes(trimmedQuery));
      const isMatch = titleMatch || descriptionMatch || categoryMatch || keywordMatch;

      if (!isMatch) {
        return null;
      }

      let score = 0;
      if (titleMatch) score += 3;
      if (keywordMatch) score += 2;
      if (descriptionMatch) score += 1;
      if (categoryMatch) score += 1;

      return { topic, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.topic.title.localeCompare(b.topic.title))
    .map((entry) => entry.topic);

  return scored.slice(0, maxResults);
};
