'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ExternalContentSearch from '@/components/ExternalContentSearch';
import { SocialPost } from '@/services/externalIntegrations';

export default function DiscoverPage() {
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);

  const handlePostSelect = (post: SocialPost) => {
    setSelectedPost(post);
  };

  return (
    <Layout>
      <div className="discover-page">
        <h1 className="text-3xl font-bold mb-6">Discover Content</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExternalContentSearch />
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h2 className="text-xl font-bold mb-4">About Discovery</h2>
              <p className="mb-4">
                Search for content across X (Twitter), YouTube, and Reddit. 
                Discover interesting content from these platforms and save it to your collection.
              </p>
              
              <h3 className="font-bold mb-2">How it works:</h3>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Enter your search query</li>
                <li>Select which platforms to search</li>
                <li>Browse the results</li>
                <li>Click on a result to view details</li>
                <li>Save interesting content to your collection</li>
              </ol>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-bold mb-2">Pro Tip</h3>
                <p>
                  Use specific keywords to find more relevant content. 
                  You can also filter by platform to focus on specific types of content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 