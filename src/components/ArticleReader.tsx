import { useEffect, useState, useRef } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function ArticleReader() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const article = document.querySelector('article') || document.querySelector('.article-content');
    articleRef.current = article as HTMLElement;

    if (!article) return;

    const headingElements = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingsData: Heading[] = Array.from(headingElements).map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }
      
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1])
      };
    });

    setHeadings(headingsData);

    const wordCount = article.textContent?.trim().split(/\s+/).length || 0;
    const minutes = Math.ceil(wordCount / 200);
    setReadingTime(minutes);

    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    headingElements.forEach((heading) => {
      observer.observe(heading);
    });

    const handleScroll = () => {
      if (!article) return;
      
      const articleTop = article.getBoundingClientRect().top;
      const articleHeight = article.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrolled = window.scrollY - (article.offsetTop - windowHeight);
      
      const progress = Math.min(Math.max((scrolled / (articleHeight - windowHeight)) * 100, 0), 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setShowToc(false);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40 w-56">
        <div className="glass-morphism rounded-2xl p-4 shadow-2xl max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Table of Contents
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {readingTime} min read
            </div>
          </div>
          
          <div className="mb-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {Math.round(readingProgress)}% completed
            </div>
          </div>

          <nav className="space-y-1">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                  activeId === heading.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <button
        onClick={() => setShowToc(!showToc)}
        className="lg:hidden fixed bottom-24 left-4 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/50 z-40"
        aria-label="Toggle table of contents"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      {showToc && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowToc(false)}
          />
          
          <div className="relative w-full max-w-md glass-morphism rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Table of Contents</h3>
              <button
                onClick={() => setShowToc(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Reading Progress</span>
                <span>{readingTime} min read</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                {Math.round(readingProgress)}% completed
              </div>
            </div>

            <nav className="space-y-1">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                    activeId === heading.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-[45]">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
    </>
  );
}
