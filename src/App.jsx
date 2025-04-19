import React, { useState } from 'react';
import { Search, BarChart3, MessageSquare, Lightbulb, Loader2 } from 'lucide-react';
import { mockSearchReddit, mockAnalyzeData } from './services/api';

const RedditInsightsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setError('');
    setIsSearching(true);
    
    try {
      // Search Reddit for posts related to the search term
      const redditData = await mockSearchReddit(searchTerm);
      setIsSearching(false);
      setIsAnalyzing(true);
      
      // Analyze the Reddit posts
      const insights = await mockAnalyzeData(redditData.posts, searchTerm);
      
      setResults({
        redditData: insights.redditData,
        insights: {
          sentimentBreakdown: insights.sentimentBreakdown,
          topThemes: insights.topThemes,
          featureSuggestions: insights.featureSuggestions,
          summary: insights.summary
        }
      });
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-700">Pendo Listen AI Simulator</h1>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">MVP Demo</span>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search form */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Search for Reddit Discussions</h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter product or feature name (e.g., 'Pendo Listen')"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || isAnalyzing}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSearching || isAnalyzing ? 'Processing...' : 'Analyze'}
              </button>
            </form>
            
            {/* Status indicators */}
            {isSearching && (
              <div className="mt-4 flex items-center text-sm text-indigo-600">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching Reddit for discussions about "{searchTerm}"...
              </div>
            )}
            
            {isAnalyzing && (
              <div className="mt-4 flex items-center text-sm text-indigo-600">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing data with AI to generate insights...
              </div>
            )}
            
            {error && (
              <div className="mt-4 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
          
          {/* Results dashboard */}
          {results && (
            <div className="space-y-6">
              {/* Summary card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Summary of Insights</h2>
                <p className="text-gray-700">{results.insights.summary}</p>
              </div>
              
              {/* Metrics grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sentiment chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-md font-medium mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                    Sentiment Analysis
                  </h3>
                  <div className="flex items-end h-40 mt-4">
                    <div className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-12 bg-green-500 rounded-t" 
                        style={{height: `${(results.insights.sentimentBreakdown.positive / 100) * 100}%`}}
                      ></div>
                      <span className="text-xs mt-2">Positive</span>
                      <span className="font-bold">{results.insights.sentimentBreakdown.positive}%</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-12 bg-gray-400 rounded-t" 
                        style={{height: `${(results.insights.sentimentBreakdown.neutral / 100) * 100}%`}}
                      ></div>
                      <span className="text-xs mt-2">Neutral</span>
                      <span className="font-bold">{results.insights.sentimentBreakdown.neutral}%</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-12 bg-red-500 rounded-t" 
                        style={{height: `${(results.insights.sentimentBreakdown.negative / 100) * 100}%`}}
                      ></div>
                      <span className="text-xs mt-2">Negative</span>
                      <span className="font-bold">{results.insights.sentimentBreakdown.negative}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Top themes */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-md font-medium mb-4 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
                    Top Discussion Themes
                  </h3>
                  <ul className="space-y-3">
                    {results.insights.topThemes.map((theme, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="text-sm">{theme.theme}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          theme.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          theme.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {theme.count} mentions
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Feature suggestions */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-md font-medium mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-indigo-600" />
                    Feature Suggestions
                  </h3>
                  <ul className="space-y-3">
                    {results.insights.featureSuggestions.map((feature, index) => (
                      <li key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{feature.feature}</span>
                          <div className="flex items-center">
                            <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                              feature.impact === 'high' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {feature.impact} impact
                            </span>
                            <span className="text-xs font-medium">{feature.votes} votes</span>
                          </div>
                        </div>
                        {feature.rationale && (
                          <p className="text-xs text-gray-600 mt-1">{feature.rationale}</p>
                        )}
                        {feature.implementationComplexity && (
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 mr-1">Complexity:</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              feature.implementationComplexity === 'low' ? 'bg-green-100 text-green-800' :
                              feature.implementationComplexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {feature.implementationComplexity}
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Recent discussions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Recent Reddit Discussions</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upvotes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.redditData.map((post, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-900">
                            <a href={post.url}>{post.title}</a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.comments}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.upvotes}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              post.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                              post.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {post.sentiment}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Initial state */}
          {!results && !isSearching && !isAnalyzing && (
            <div className="bg-white rounded-lg shadow p-10 text-center">
              <div className="flex justify-center">
                <Search className="h-12 w-12 text-indigo-200" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Start by searching for a product</h3>
              <p className="mt-2 text-sm text-gray-500">
                Enter a product name above to analyze Reddit discussions and generate insights
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
        Pendo Listen AI Simulator MVP &copy; 2025
      </footer>
    </div>
  );
};

export default RedditInsightsDashboard;
