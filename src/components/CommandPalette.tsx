import { useEffect, useState, useRef } from 'react';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: 'page' | 'tool' | 'article';
  icon?: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(0);
  const [items, setItems] = useState<CommandItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CommandItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const staticItems: CommandItem[] = [
    { id: '1', title: 'Home', url: '/', type: 'page', icon: '🏠' },
    { id: '2', title: 'AI Tools', url: '/ai-tools', type: 'page', icon: '⚡' },
    { id: '3', title: 'Blog', url: '/blog', type: 'page', icon: '📝' },
    { id: '4', title: 'About', url: '/about', type: 'page', icon: 'ℹ️' },
    { id: '5', title: 'Contact', url: '/contact', type: 'page', icon: '📧' },
  ];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelected((s) => (s + 1) % filteredItems.length);
        }
        
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelected((s) => (s - 1 + filteredItems.length) % filteredItems.length);
        }
        
        if (e.key === 'Enter' && filteredItems[selected]) {
          e.preventDefault();
          window.location.href = filteredItems[selected].url;
        }
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, filteredItems, selected]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const loadDynamicItems = async () => {
      try {
        const [toolsRes, articlesRes] = await Promise.all([
          fetch('/api/ai-tools'),
          fetch('/api/articles')
        ]);
        
        const tools = await toolsRes.json();
        const articles = await articlesRes.json();
        
        const toolItems: CommandItem[] = tools.map((tool: any) => ({
          id: `tool-${tool.id}`,
          title: tool.name,
          description: tool.description,
          url: `/ai-tools/${tool.slug}`,
          type: 'tool' as const,
          icon: '🔧'
        }));
        
        const articleItems: CommandItem[] = articles.map((article: any) => ({
          id: `article-${article.id}`,
          title: article.title,
          description: article.excerpt,
          url: `/blog/${article.slug}`,
          type: 'article' as const,
          icon: '📄'
        }));
        
        setItems([...staticItems, ...toolItems, ...articleItems]);
      } catch (error) {
        setItems(staticItems);
      }
    };
    
    if (isOpen) {
      loadDynamicItems();
    }
  }, [isOpen]);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredItems(items.slice(0, 10));
    } else {
      const filtered = items.filter((item) => {
        const searchLower = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
        );
      }).slice(0, 10);
      setFilteredItems(filtered);
      setSelected(0);
    }
  }, [search, items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative w-full max-w-2xl glass-morphism rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, tools, and articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-base text-gray-900 dark:text-gray-100 placeholder-gray-500"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
            ESC
          </kbd>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No results found</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredItems.map((item, index) => (
                <a
                  key={item.id}
                  href={item.url}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                    index === selected
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  onMouseEnter={() => setSelected(index)}
                >
                  <span className="text-2xl mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.title}
                    </div>
                    {item.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize shrink-0">
                    {item.type}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-4 py-2 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">↵</kbd>
              <span>Select</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
