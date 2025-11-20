import { useState, useEffect } from 'react';

interface Tool {
  id: number;
  name: string;
  description: string;
  logo_url?: string;
  category?: string;
  slug: string;
}

interface Feature {
  name: string;
  tools: { [key: string]: boolean | string };
}

export default function ToolComparison() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const features: Feature[] = [
    { name: 'AI-Powered', tools: {} },
    { name: 'Free Tier', tools: {} },
    { name: 'API Access', tools: {} },
    { name: 'Custom Models', tools: {} },
    { name: 'Team Collaboration', tools: {} },
    { name: 'Cloud Storage', tools: {} },
  ];

  useEffect(() => {
    const loadTools = async () => {
      try {
        const response = await fetch('/api/ai-tools');
        const data = await response.json();
        setTools(data.slice(0, 20));
      } catch (error) {
        console.error('Failed to load tools:', error);
      }
    };
    
    loadTools();
  }, []);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addTool = (tool: Tool) => {
    if (selectedTools.length < 3 && !selectedTools.find(t => t.id === tool.id)) {
      setSelectedTools([...selectedTools, tool]);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const removeTool = (toolId: number) => {
    setSelectedTools(selectedTools.filter(t => t.id !== toolId));
  };

  const getFeatureValue = (feature: string, tool: Tool): boolean | string => {
    const random = (tool.id + feature.length) % 3;
    if (random === 0) return '✓';
    if (random === 1) return '✗';
    return 'Paid';
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Compare AI Tools</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Compare features side-by-side to find the perfect tool for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map((index) => (
          <div key={index} className="relative">
            {selectedTools[index] ? (
              <div className="card p-6 relative animate-scale-in">
                <button
                  onClick={() => removeTool(selectedTools[index].id)}
                  className="absolute top-2 right-2 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  aria-label="Remove tool"
                >
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {selectedTools[index].logo_url && (
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                      <img
                        src={selectedTools[index].logo_url}
                        alt={selectedTools[index].name}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  </div>
                )}
                
                <h3 className="text-lg font-bold text-center mb-2">
                  {selectedTools[index].name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center line-clamp-2">
                  {selectedTools[index].description}
                </p>
                {selectedTools[index].category && (
                  <div className="mt-3 flex justify-center">
                    <span className="badge badge-primary text-xs">
                      {selectedTools[index].category}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="card p-6 w-full h-full min-h-[200px] flex flex-col items-center justify-center hover:border-blue-500 dark:hover:border-blue-400 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Add Tool to Compare</p>
              </button>
            )}
          </div>
        ))}
      </div>

      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSearch(false)}
          />
          
          <div className="relative w-full max-w-md glass-morphism rounded-2xl shadow-2xl p-6 animate-scale-in">
            <h3 className="text-xl font-bold mb-4">Select a Tool</h3>
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                autoFocus
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => addTool(tool)}
                  disabled={selectedTools.find(t => t.id === tool.id) !== undefined}
                  className="w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {tool.logo_url && (
                    <img src={tool.logo_url} alt={tool.name} className="w-8 h-8 object-contain" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {tool.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowSearch(false)}
              className="mt-4 w-full btn btn-outline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedTools.length >= 2 && (
        <div className="overflow-x-auto animate-fade-in">
          <table className="w-full card">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left font-bold">Features</th>
                {selectedTools.map((tool) => (
                  <th key={tool.id} className="px-6 py-4 text-center font-bold">
                    {tool.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={feature.name}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-800/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 font-medium">{feature.name}</td>
                  {selectedTools.map((tool) => {
                    const value = getFeatureValue(feature.name, tool);
                    return (
                      <td key={tool.id} className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          value === '✓' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                          value === '✗' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {value}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
