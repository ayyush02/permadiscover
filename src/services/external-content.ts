import axios from 'axios';

// Define types for the content sources
export type ContentSource = 'youtube' | 'twitter' | 'instagram' | 'reddit' | 'medium';

// Define the content type
export interface ExternalContent {
  id: string;
  source: ContentSource;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  author?: string;
  publishedAt?: string;
  content?: string;
}

export class ExternalContentService {
  // API keys would normally be stored in environment variables
  private apiKeys = {
    youtube: 'YOUR_YOUTUBE_API_KEY',
    twitter: 'YOUR_TWITTER_API_KEY',
    instagram: 'YOUR_INSTAGRAM_API_KEY',
    reddit: 'YOUR_REDDIT_API_KEY',
    medium: 'YOUR_MEDIUM_API_KEY'
  };

  /**
   * Search for content across multiple platforms
   * @param query - Search query
   * @param sources - Array of sources to search (defaults to all)
   * @returns Array of content items from various platforms
   */
  async searchContent(query: string, sources?: ContentSource[]): Promise<ExternalContent[]> {
    try {
      const searchPromises = [];
      
      // If no sources specified, search all
      const sourcesToSearch = sources || ['youtube', 'twitter', 'instagram', 'reddit', 'medium'];
      
      if (sourcesToSearch.includes('youtube')) {
        searchPromises.push(this.searchYouTube(query));
      }
      
      if (sourcesToSearch.includes('twitter')) {
        searchPromises.push(this.searchTwitter(query));
      }
      
      if (sourcesToSearch.includes('instagram')) {
        searchPromises.push(this.searchInstagram(query));
      }
      
      if (sourcesToSearch.includes('reddit')) {
        searchPromises.push(this.searchReddit(query));
      }
      
      if (sourcesToSearch.includes('medium')) {
        searchPromises.push(this.searchMedium(query));
      }
      
      // Wait for all search promises to resolve
      const results = await Promise.all(searchPromises);
      
      // Flatten the results array
      return results.flat();
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  }

  /**
   * Search YouTube for content
   * @param query - Search query
   * @returns Array of YouTube content items
   */
  private async searchYouTube(query: string): Promise<ExternalContent[]> {
    try {
      // This is a mock implementation - in a real app, you would use the YouTube Data API
      // const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      //   params: {
      //     part: 'snippet',
      //     q: query,
      //     key: this.apiKeys.youtube,
      //     maxResults: 10,
      //     type: 'video'
      //   }
      // });
      
      // Mock data for demonstration
      return [
        {
          id: 'yt-1',
          source: 'youtube',
          title: 'Introduction to IPFS',
          description: 'Learn how IPFS works and how to use it in your applications',
          url: 'https://www.youtube.com/watch?v=example1',
          thumbnailUrl: 'https://i.ytimg.com/vi/example1/maxresdefault.jpg',
          author: 'IPFS Channel',
          publishedAt: '2023-01-15T12:00:00Z'
        },
        {
          id: 'yt-2',
          source: 'youtube',
          title: 'Building Decentralized Applications',
          description: 'A comprehensive guide to building dApps with IPFS and Ethereum',
          url: 'https://www.youtube.com/watch?v=example2',
          thumbnailUrl: 'https://i.ytimg.com/vi/example2/maxresdefault.jpg',
          author: 'Web3 Developer',
          publishedAt: '2023-02-20T15:30:00Z'
        }
      ];
    } catch (error) {
      console.error('Error searching YouTube:', error);
      return [];
    }
  }

  /**
   * Search Twitter (X) for content
   * @param query - Search query
   * @returns Array of Twitter content items
   */
  private async searchTwitter(query: string): Promise<ExternalContent[]> {
    try {
      // This is a mock implementation - in a real app, you would use the Twitter API
      // const response = await axios.get(`https://api.twitter.com/2/tweets/search/recent`, {
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKeys.twitter}`
      //   },
      //   params: {
      //     query: query,
      //     max_results: 10
      //   }
      // });
      
      // Mock data for demonstration
      return [
        {
          id: 'tw-1',
          source: 'twitter',
          title: 'New IPFS release announced',
          description: 'Excited to announce the latest release of IPFS with improved performance and new features!',
          url: 'https://twitter.com/ipfs/status/123456789',
          author: '@ipfs',
          publishedAt: '2023-03-10T09:15:00Z'
        },
        {
          id: 'tw-2',
          source: 'twitter',
          title: 'IPFS Community Call',
          description: 'Join us for our monthly community call to discuss the future of IPFS and answer your questions',
          url: 'https://twitter.com/ipfs/status/987654321',
          author: '@ipfs',
          publishedAt: '2023-03-05T14:30:00Z'
        }
      ];
    } catch (error) {
      console.error('Error searching Twitter:', error);
      return [];
    }
  }

  /**
   * Search Instagram for content
   * @param query - Search query
   * @returns Array of Instagram content items
   */
  private async searchInstagram(query: string): Promise<ExternalContent[]> {
    try {
      // This is a mock implementation - in a real app, you would use the Instagram Graph API
      // const response = await axios.get(`https://graph.instagram.com/v12.0/me/media`, {
      //   params: {
      //     access_token: this.apiKeys.instagram,
      //     fields: 'id,caption,media_type,media_url,permalink,timestamp,username'
      //   }
      // });
      
      // Mock data for demonstration
      return [
        {
          id: 'ig-1',
          source: 'instagram',
          title: 'IPFS Workshop Highlights',
          description: 'Highlights from our recent IPFS workshop in San Francisco',
          url: 'https://www.instagram.com/p/example1',
          thumbnailUrl: 'https://scontent.cdninstagram.com/example1.jpg',
          author: '@ipfs',
          publishedAt: '2023-02-28T16:45:00Z'
        }
      ];
    } catch (error) {
      console.error('Error searching Instagram:', error);
      return [];
    }
  }

  /**
   * Search Reddit for content
   * @param query - Search query
   * @returns Array of Reddit content items
   */
  private async searchReddit(query: string): Promise<ExternalContent[]> {
    try {
      // This is a mock implementation - in a real app, you would use the Reddit API
      // const response = await axios.get(`https://oauth.reddit.com/search`, {
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKeys.reddit}`
      //   },
      //   params: {
      //     q: query,
      //     limit: 10
      //   }
      // });
      
      // Mock data for demonstration
      return [
        {
          id: 'rd-1',
          source: 'reddit',
          title: 'How I built a decentralized blog with IPFS',
          description: 'A step-by-step guide to building a decentralized blog using IPFS and React',
          url: 'https://www.reddit.com/r/ipfs/comments/example1',
          author: 'u/ipfsdeveloper',
          publishedAt: '2023-01-25T11:20:00Z'
        },
        {
          id: 'rd-2',
          source: 'reddit',
          title: 'IPFS vs Traditional CDNs',
          description: 'A comparison of IPFS and traditional CDNs for content delivery',
          url: 'https://www.reddit.com/r/ipfs/comments/example2',
          author: 'u/web3enthusiast',
          publishedAt: '2023-02-15T09:10:00Z'
        }
      ];
    } catch (error) {
      console.error('Error searching Reddit:', error);
      return [];
    }
  }

  /**
   * Search Medium for content
   * @param query - Search query
   * @returns Array of Medium content items
   */
  private async searchMedium(query: string): Promise<ExternalContent[]> {
    try {
      // This is a mock implementation - in a real app, you would use the Medium API
      // const response = await axios.get(`https://api.medium.com/v1/search`, {
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKeys.medium}`
      //   },
      //   params: {
      //     q: query,
      //     limit: 10
      //   }
      // });
      
      // Mock data for demonstration
      return [
        {
          id: 'md-1',
          source: 'medium',
          title: 'The Future of Decentralized Storage',
          description: 'Exploring the potential of IPFS and other decentralized storage solutions',
          url: 'https://medium.com/@ipfs/future-of-decentralized-storage-example1',
          author: 'IPFS Team',
          publishedAt: '2023-03-01T13:45:00Z'
        }
      ];
    } catch (error) {
      console.error('Error searching Medium:', error);
      return [];
    }
  }

  /**
   * Get detailed content from a specific platform
   * @param source - Content source
   * @param id - Content ID
   * @returns Detailed content item
   */
  async getContentDetails(source: ContentSource, id: string): Promise<ExternalContent | null> {
    try {
      // This would normally fetch detailed content from the respective platform
      // For now, we'll return mock data
      
      // Mock data for demonstration
      const mockContent: Record<string, ExternalContent> = {
        'yt-1': {
          id: 'yt-1',
          source: 'youtube',
          title: 'Introduction to IPFS',
          description: 'Learn how IPFS works and how to use it in your applications',
          url: 'https://www.youtube.com/watch?v=example1',
          thumbnailUrl: 'https://i.ytimg.com/vi/example1/maxresdefault.jpg',
          author: 'IPFS Channel',
          publishedAt: '2023-01-15T12:00:00Z',
          content: 'This is a comprehensive introduction to IPFS, covering the basics of how it works, its architecture, and how to use it in your applications. The video includes demonstrations and code examples.'
        },
        'tw-1': {
          id: 'tw-1',
          source: 'twitter',
          title: 'New IPFS release announced',
          description: 'Excited to announce the latest release of IPFS with improved performance and new features!',
          url: 'https://twitter.com/ipfs/status/123456789',
          author: '@ipfs',
          publishedAt: '2023-03-10T09:15:00Z',
          content: 'We are excited to announce the latest release of IPFS with improved performance and new features! Check out the release notes for more details. #IPFS #Web3'
        }
      };
      
      return mockContent[id] || null;
    } catch (error) {
      console.error(`Error getting content details for ${source} ${id}:`, error);
      return null;
    }
  }
} 