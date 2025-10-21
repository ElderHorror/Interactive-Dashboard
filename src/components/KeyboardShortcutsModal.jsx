function KeyboardShortcutsModal({ isOpen, onClose, darkMode }) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Focus search input' },
    { keys: ['Ctrl', 'D'], description: 'Toggle dark mode' },
    { keys: ['Ctrl', 'C'], description: 'Toggle compare mode' },
    { keys: ['Esc'], description: 'Clear search / Close modals' },
    { keys: ['?'], description: 'Show keyboard shortcuts' },
    { keys: ['1-5'], description: 'Select time range (1=1d, 2=7d, etc.)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`max-w-md w-full rounded-xl shadow-2xl p-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-3 rounded-lg ${
                darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
              }`}
            >
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, i) => (
                  <kbd
                    key={i}
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      darkMode
                        ? 'bg-gray-600 text-gray-200 border border-gray-500'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Press <kbd className="px-1 py-0.5 text-xs font-semibold rounded bg-gray-600 text-gray-200">?</kbd> anytime to see this help
          </p>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsModal;
