function SkeletonLoader({ darkMode, type = 'dashboard' }) {
  const baseClass = `animate-pulse ${darkMode ? 'bg-gray-700/30' : 'bg-white/20'}`;

  if (type === 'dashboard') {
    return (
      <div className={`${darkMode ? 'bg-gray-800/20' : 'bg-white/20'} backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg w-full`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className={`h-8 w-32 rounded ${baseClass}`} />
          <div className="flex gap-2">
            <div className={`h-8 w-8 rounded-lg ${baseClass}`} />
            <div className={`h-8 w-8 rounded-lg ${baseClass}`} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`p-2 rounded-lg ${baseClass}`}>
              <div className={`h-4 w-24 rounded mb-2 ${baseClass}`} />
              <div className={`h-6 w-16 rounded ${baseClass}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="mt-6 h-[400px] w-full">
        <div className={`h-full w-full rounded-xl ${baseClass}`} />
      </div>
    );
  }

  // Default skeleton
  return <div className={`h-20 w-full rounded ${baseClass}`} />;
}

export default SkeletonLoader;
