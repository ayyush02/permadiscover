import { useState, useEffect, useCallback } from 'react';
import { ExternalIntegrationsService, SocialPost } from '@/services/externalIntegrations';

let integrationsInstance: ExternalIntegrationsService | null = null;

export const useExternalIntegrations = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeIntegrations = async () => {
      if (!integrationsInstance) {
        integrationsInstance = new ExternalIntegrationsService();
      }

      try {
        // Wait for integrations to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (mounted) {
          setIsReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize external integrations'));
        }
      }
    };

    initializeIntegrations();

    return () => {
      mounted = false;
    };
  }, []);

  const searchX = useCallback(async (query: string, limit: number = 10): Promise<SocialPost[]> => {
    if (!isReady || !integrationsInstance) throw new Error('External integrations not ready');
    setIsLoading(true);
    try {
      const results = await integrationsInstance.searchX(query, limit);
      return results;
    } catch (err) {
      console.error('Failed to search X:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isReady]);

  const searchYouTube = useCallback(async (query: string, limit: number = 10): Promise<SocialPost[]> => {
    if (!isReady || !integrationsInstance) throw new Error('External integrations not ready');
    setIsLoading(true);
    try {
      const results = await integrationsInstance.searchYouTube(query, limit);
      return results;
    } catch (err) {
      console.error('Failed to search YouTube:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isReady]);

  const searchReddit = useCallback(async (query: string, limit: number = 10): Promise<SocialPost[]> => {
    if (!isReady || !integrationsInstance) throw new Error('External integrations not ready');
    setIsLoading(true);
    try {
      const results = await integrationsInstance.searchReddit(query, limit);
      return results;
    } catch (err) {
      console.error('Failed to search Reddit:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isReady]);

  const searchAll = useCallback(async (
    query: string,
    platforms: ('x' | 'youtube' | 'reddit')[] = ['x', 'youtube', 'reddit'],
    limit: number = 10
  ): Promise<SocialPost[]> => {
    if (!isReady || !integrationsInstance) throw new Error('External integrations not ready');
    setIsLoading(true);
    try {
      const results = await integrationsInstance.searchAll(query, platforms, limit);
      return results;
    } catch (err) {
      console.error('Failed to search all platforms:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isReady]);

  return {
    isReady,
    error,
    isLoading,
    searchX,
    searchYouTube,
    searchReddit,
    searchAll
  };
}; 