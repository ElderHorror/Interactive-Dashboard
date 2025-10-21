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
    <div className={`w-full mt-4 p-4 sm:p-6 rounded-2xl border shadow-xl ${
      darkMode ? 'bg-primary-800/40 backdrop-blur-xl border-primary-700/50' : 'bg-white/90 backdrop-blur-xl border-primary-200'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <Newspaper className={`w-5 h-5 ${darkMode ? 'text-accent-400' : 'text-accent-600'}`} />
        <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-primary-900'}`}>
          Latest News {symbol && `for ${symbol}`}
        </h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`p-4 rounded-xl border animate-pulse ${
              darkMode ? 'bg-primary-700/30 border-primary-600' : 'bg-gray-100 border-primary-200'
            }`}>
              <div className={`h-4 rounded mb-2 ${darkMode ? 'bg-primary-600' : 'bg-gray-300'}`} style={{ width: '80%' }} />
              <div className={`h-3 rounded ${darkMode ? 'bg-primary-600' : 'bg-gray-300'}`} style={{ width: '40%' }} />
            </div>
          ))}
        </div>
      ) : news.length > 0 ? (
        <div className="space-y-3">
          {news.map((item, index) => (
            <a key={index} href={item.url} target="_blank" rel="noopener noreferrer"
              className={`block p-4 rounded-xl border smooth-transition animate-fade-in ${
                darkMode ? 'bg-primary-700/30 border-primary-600 hover:bg-primary-600/50' : 'bg-white border-primary-200 hover:bg-accent-50'
              }`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm sm:text-base mb-2 ${darkMode ? 'text-white' : 'text-primary-900'}`}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={darkMode ? 'text-primary-400' : 'text-primary-600'}>{item.source}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className={darkMode ? 'text-primary-500' : 'text-primary-500'}>{getTimeAgo(item.publishedAt)}</span>
                    </span>
                  </div>
                </div>
                <ExternalLink className={`w-4 h-4 flex-shrink-0 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className={`text-center py-8 text-sm ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
          {symbol ? 'No news available' : 'Select a stock to see related news'}
        </p>
      )}
    </div>
  );
}

export default NewsFeed;
