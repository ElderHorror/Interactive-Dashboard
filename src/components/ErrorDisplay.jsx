function ErrorDisplay({ error, onRetry, darkMode }) {
  if (!error) return null;

  return (
    <div className={`${darkMode ? 'bg-red-900/20' : 'bg-red-500/20'} backdrop-blur-md p-6 rounded-xl border ${darkMode ? 'border-red-500/30' : 'border-red-400/30'} w-full`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
            Error Loading Data
          </h3>
          <p className={`text-sm mb-4 ${darkMode ? 'text-red-200' : 'text-red-600'}`}>
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.status && (
            <p className={`text-xs mb-4 ${darkMode ? 'text-red-300/70' : 'text-red-500/70'}`}>
              Status Code: {error.status}
            </p>
          )}
          {error.canRetry && onRetry && (
            <button
              onClick={onRetry}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorDisplay;
