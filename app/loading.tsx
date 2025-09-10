export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="relative">
          {/* Optimized loading spinner with GPU acceleration */}
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto gpu-accelerated"></div>
          
          {/* Pulsing background effect */}
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-100 rounded-full animate-pulse-slow mx-auto"></div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 animate-fade-in optimize-legibility">
            Loading AI Tools...
          </h2>
          <p className="text-gray-600 mt-2 animate-slide-up optimize-legibility">
            Preparing the best AI tools for you
          </p>
        </div>
        
        {/* Progress indicator with smooth animation */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse-slow gpu-accelerated"></div>
          </div>
        </div>
        
        {/* Loading dots animation */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}