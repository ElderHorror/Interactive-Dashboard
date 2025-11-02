import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';
import axios from 'axios';

function NewsFeed({ symbol, darkMode }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!symbol) {
      setNews([]);
      return;
    }

    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/news/${symbol}`);
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now - date) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return days === 1 ? '1 day ago' : `${days} days ago`;
  };

  return (
    <div className="card-elevated p-6 w-full">
      <div className="flex items-center gap-3 mb-6">
        <Newspaper className="w-5 h-5 text-accent-primary" />
        <h3 className="text-lg font-semibold text-text-primary">
          Latest News {symbol && `· ${symbol}`}
        </h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg border border-border bg-background-surface animate-pulse">
              <div className="h-4 rounded mb-2 bg-background-hover" style={{ width: '80%' }} />
              <div className="h-3 rounded bg-background-hover" style={{ width: '40%' }} />
            </div>
          ))}
        </div>
      ) : news.length > 0 ? (
        <div className="space-y-3">
          {news.map((item, index) => (
            <a key={index} href={item.url} target="_blank" rel="noopener noreferrer"
              className="block p-4 rounded-lg border border-border bg-background-surface hover:bg-background-hover hover:border-border-light transition-all duration-150 animate-fade-in group"
              style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-text-primary mb-2 group-hover:text-accent-primary transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-text-tertiary">
                    <span className="font-medium text-text-secondary">{item.source}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(item.publishedAt)}</span>
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 flex-shrink-0 text-text-tertiary group-hover:text-accent-primary transition-colors" />
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Newspaper className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary">
            {symbol ? 'No news available' : 'Select a stock to see related news'}
          </p>
        </div>
      )}
    </div>
  );
}

export default NewsFeed;
