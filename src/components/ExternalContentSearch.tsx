import React, { useState, useEffect } from 'react';
import { ExternalContentService, ExternalContent, ContentSource } from '../services/external-content';
import { useExternalIntegrations } from '@/hooks/useExternalIntegrations';
import { SocialPost } from '@/services/externalIntegrations';

interface ExternalContentSearchProps {
  onContentSelect?: (content: ExternalContent) => void;
}

const ExternalContentSearch: React.FC<ExternalContentSearchProps> = ({ onContentSelect }) => {
  const { isReady, error, isLoading, searchAll } = useExternalIntegrations();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SocialPost[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<('x' | 'youtube' | 'reddit')[]>(['x', 'youtube', 'reddit']);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchError('Please enter a search query');
      return;
    }

    setSearchError(null);
    try {
      const searchResults = await searchAll(query, selectedPlatforms);
      setResults(searchResults);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const togglePlatform = (platform: 'x' | 'youtube' | 'reddit') => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'x':
        return '𝕏';
      case 'youtube':
        return '▶️';
      case 'reddit':
        return '🤖';
      default:
        return '';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="external-content-search">
      <h2 className="text-xl font-bold mb-4">Search External Content</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error.message}
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={() => togglePlatform('x')}
            className={`px-3 py-1 rounded ${
              selectedPlatforms.includes('x')
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            X (Twitter)
          </button>
          <button
            onClick={() => togglePlatform('youtube')}
            className={`px-3 py-1 rounded ${
              selectedPlatforms.includes('youtube')
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => togglePlatform('reddit')}
            className={`px-3 py-1 rounded ${
              selectedPlatforms.includes('reddit')
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Reddit
          </button>
        </div>
      </div>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for content..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !isReady}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {searchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {searchError}
        </div>
      )}
      
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {post.mediaUrl && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">{getPlatformIcon(post.platform)}</span>
                  <h3 className="font-bold text-lg truncate">{post.title}</h3>
                </div>
                <p className="text-gray-700 mb-2 line-clamp-3">{post.content}</p>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>By {post.author}</span>
                  <span>{formatTimestamp(post.timestamp)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  {post.likes !== undefined && (
                    <span>❤️ {post.likes}</span>
                  )}
                  {post.comments !== undefined && (
                    <span>💬 {post.comments}</span>
                  )}
                </div>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                >
                  View Original
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="text-center py-8 text-gray-500">
            No results found. Try a different search query.
          </div>
        )
      )}
      
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Searching...</p>
        </div>
      )}
    </div>
  );
};

export default ExternalContentSearch; 