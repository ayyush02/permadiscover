'use client'

import { useState, useEffect } from 'react'
import { useIPFS } from '@/hooks/useIPFS'

// Define content types
type ContentType = 'text' | 'image' | 'video' | 'audio' | 'document'

// Define content item interface
interface ContentItem {
  id: string
  title: string
  description: string
  type: ContentType
  cid: string
  creator: string
  timestamp: number
  tags: string[]
  remixes: string[]
  likes: number
  comments: number
}

export default function Home() {
  // IPFS hooks
  const { isReady, error, store, retrieve, getPeerId, getConnectedPeers, parseCID } = useIPFS()
  
  // State for content management
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [contentType, setContentType] = useState<ContentType>('text')
  const [tags, setTags] = useState('')
  const [storedCID, setStoredCID] = useState('')
  const [retrievedContent, setRetrievedContent] = useState('')
  
  // State for node info
  const [peerId, setPeerId] = useState('')
  const [connectedPeers, setConnectedPeers] = useState<string[]>([])
  
  // State for content discovery
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [timeTravelDate, setTimeTravelDate] = useState<string>('')
  
  // State for UI
  const [activeTab, setActiveTab] = useState<'discover' | 'create' | 'vault' | 'profile'>('discover')
  const [isOffline, setIsOffline] = useState(false)
  const [isTimeTravelMode, setIsTimeTravelMode] = useState(false)

  // Initialize node info
  useEffect(() => {
    if (isReady) {
      setPeerId(getPeerId())
      getConnectedPeers().then(setConnectedPeers)
    }
  }, [isReady, getPeerId, getConnectedPeers])

  // Mock content for demonstration
  useEffect(() => {
    if (isReady) {
      // Generate mock content items
      const mockItems: ContentItem[] = [
        {
          id: '1',
          title: 'Introduction to Decentralized Content',
          description: 'A comprehensive guide to understanding decentralized content platforms.',
          type: 'text',
          cid: 'QmExample1',
          creator: '0x1234...5678',
          timestamp: Date.now() - 86400000,
          tags: ['education', 'decentralization', 'guide'],
          remixes: [],
          likes: 42,
          comments: 7
        },
        {
          id: '2',
          title: 'Digital Art Collection',
          description: 'A collection of digital art pieces created using generative algorithms.',
          type: 'image',
          cid: 'QmExample2',
          creator: '0x8765...4321',
          timestamp: Date.now() - 172800000,
          tags: ['art', 'digital', 'generative'],
          remixes: ['1'],
          likes: 128,
          comments: 23
        },
        {
          id: '3',
          title: 'Decentralized Music Track',
          description: 'A collaborative music track created by multiple artists.',
          type: 'audio',
          cid: 'QmExample3',
          creator: '0xabcd...efgh',
          timestamp: Date.now() - 259200000,
          tags: ['music', 'collaboration', 'audio'],
          remixes: [],
          likes: 89,
          comments: 15
        }
      ]
      setContentItems(mockItems)
    }
  }, [isReady])

  // Handle content storage
  const handleStore = async () => {
    try {
      const contentData = {
        title,
        description,
        content,
        type: contentType,
        tags: tags.split(',').map(tag => tag.trim()),
        timestamp: Date.now()
      }
      
      const cid = await store(JSON.stringify(contentData))
      setStoredCID(cid.toString())
      
      // Add to content items
      const newItem: ContentItem = {
        id: Date.now().toString(),
        title,
        description,
        type: contentType,
        cid: cid.toString(),
        creator: peerId,
        timestamp: Date.now(),
        tags: tags.split(',').map(tag => tag.trim()),
        remixes: [],
        likes: 0,
        comments: 0
      }
      
      setContentItems([newItem, ...contentItems])
      
      // Reset form
      setTitle('')
      setDescription('')
      setContent('')
      setTags('')
    } catch (err) {
      console.error('Failed to store content:', err)
    }
  }

  // Handle content retrieval
  const handleRetrieve = async (cid: string) => {
    try {
      if (!cid || cid.trim() === '') {
        console.error('Invalid CID: empty string')
        return
      }

      // Use the parseCID function from the hook to validate the CID
      try {
        parseCID(cid)
      } catch (err) {
        console.error('Invalid CID format:', err)
        return
      }

      const data = await retrieve(cid)
      const contentData = JSON.parse(new TextDecoder().decode(data))
      setRetrievedContent(JSON.stringify(contentData, null, 2))
    } catch (err) {
      console.error('Failed to retrieve content:', err)
      setRetrievedContent(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  // Filter content based on search and tags
  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTags = selectedTags.length === 0 || 
                        selectedTags.some(tag => item.tags.includes(tag))
    
    return matchesSearch && matchesTags
  })

  // Get all unique tags
  const allTags = Array.from(new Set(contentItems.flatMap(item => item.tags)))

  // Toggle offline mode
  const toggleOfflineMode = () => {
    setIsOffline(!isOffline)
  }

  // Toggle time travel mode
  const toggleTimeTravelMode = () => {
    setIsTimeTravelMode(!isTimeTravelMode)
  }

  if (!isReady) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center card p-8 moonlight-glow">
        <h1 className="text-2xl font-bold mb-4 text-blue-300">Initializing PermaDiscover</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mx-auto"></div>
        <p className="mt-4 text-blue-200">Connecting to the decentralized network...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8 card moonlight-glow">
        <h1 className="text-2xl font-bold mb-4 text-red-400">Error</h1>
        <p className="text-red-300">{error.message}</p>
        <button 
          className="mt-4 px-4 py-2 btn-primary text-white rounded hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-opacity-80 backdrop-blur-md border-b border-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-300 moonlight-glow">PermaDiscover</h1>
            <div className="ml-4 flex space-x-2">
              <button 
                className={`px-3 py-1 rounded-full text-sm ${isOffline ? 'bg-green-900/50 text-green-300' : 'bg-blue-900/30 text-blue-300'}`}
                onClick={toggleOfflineMode}
              >
                {isOffline ? 'Offline Mode' : 'Online Mode'}
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${isTimeTravelMode ? 'bg-purple-900/50 text-purple-300' : 'bg-blue-900/30 text-blue-300'}`}
                onClick={toggleTimeTravelMode}
              >
                {isTimeTravelMode ? 'Time Travel Mode' : 'Current Time'}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-blue-300">
              Peer ID: {peerId.substring(0, 10)}...
            </div>
            <div className="text-sm text-blue-300">
              Connected Peers: {connectedPeers.length}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-blue-900/30 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'discover'
                  ? 'border-blue-400 text-blue-300'
                  : 'border-transparent text-blue-200 hover:text-blue-300 hover:border-blue-700'
              }`}
              onClick={() => setActiveTab('discover')}
            >
              Discover
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-400 text-blue-300'
                  : 'border-transparent text-blue-200 hover:text-blue-300 hover:border-blue-700'
              }`}
              onClick={() => setActiveTab('create')}
            >
              Create
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vault'
                  ? 'border-blue-400 text-blue-300'
                  : 'border-transparent text-blue-200 hover:text-blue-300 hover:border-blue-700'
              }`}
              onClick={() => setActiveTab('vault')}
            >
              Legacy Vault
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-400 text-blue-300'
                  : 'border-transparent text-blue-200 hover:text-blue-300 hover:border-blue-700'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
          </nav>
        </div>

        {/* Time Travel Mode */}
        {isTimeTravelMode && (
          <div className="mb-8 p-4 card moonlight-glow">
            <h2 className="text-lg font-medium text-purple-300 mb-2">Time Travel Mode</h2>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                className="px-3 py-2 input-field rounded-md"
                value={timeTravelDate}
                onChange={(e) => setTimeTravelDate(e.target.value)}
              />
              <button className="px-4 py-2 btn-primary text-white rounded-md">
                View Historical State
              </button>
            </div>
          </div>
        )}

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div>
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search content..."
                    className="w-full px-4 py-2 input-field rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <select
                    className="w-full px-4 py-2 input-field rounded-md"
                    value={selectedTags.length > 0 ? selectedTags[0] : ''}
                    onChange={(e) => setSelectedTags(e.target.value ? [e.target.value] : [])}
                  >
                    <option value="">All Tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button 
                      className="ml-1 text-blue-400 hover:text-blue-200"
                      onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => (
                <div key={item.id} className="card overflow-hidden moonlight-glow">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-blue-200">{item.title}</h3>
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs">
                        {item.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-blue-300/80">{item.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-blue-900/20 text-blue-300 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center text-sm text-blue-300/70">
                      <span>By {item.creator.substring(0, 8)}...</span>
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button 
                        className="px-3 py-1 btn-primary text-white rounded text-sm"
                        onClick={() => handleRetrieve(item.cid)}
                      >
                        View Content
                      </button>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded hover:bg-blue-900/50 text-sm">
                          Like ({item.likes})
                        </button>
                        <button className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded hover:bg-blue-900/50 text-sm">
                          Comment ({item.comments})
                        </button>
                        <button className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded hover:bg-blue-900/50 text-sm">
                          Remix
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="card p-6 moonlight-glow">
            <h2 className="text-xl font-medium text-blue-200 mb-4">Create New Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-300">Title</label>
                <input
                  type="text"
                  className="mt-1 w-full px-3 py-2 input-field rounded-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-300">Description</label>
                <input
                  type="text"
                  className="mt-1 w-full px-3 py-2 input-field rounded-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-300">Content Type</label>
                <select
                  className="mt-1 w-full px-3 py-2 input-field rounded-md"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="document">Document</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-300">Content</label>
                <textarea
                  className="mt-1 w-full px-3 py-2 input-field rounded-md"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-300">Tags (comma separated)</label>
                <input
                  type="text"
                  className="mt-1 w-full px-3 py-2 input-field rounded-md"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 btn-primary text-white rounded-md"
                  onClick={handleStore}
                >
                  Publish Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vault Tab */}
        {activeTab === 'vault' && (
          <div className="card p-6 moonlight-glow">
            <h2 className="text-xl font-medium text-blue-200 mb-4">Legacy Vault</h2>
            <p className="text-blue-300/80 mb-4">
              Your private, encrypted storage for sensitive content. Only you can access this content.
            </p>
            <div className="border border-dashed border-blue-900/50 rounded-lg p-8 text-center">
              <p className="text-blue-300/70">No content in your vault yet.</p>
              <button className="mt-4 px-4 py-2 btn-primary text-white rounded-md">
                Add Content to Vault
              </button>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card p-6 moonlight-glow">
            <h2 className="text-xl font-medium text-blue-200 mb-4">Your Profile</h2>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-300">
                  {peerId.substring(0, 1).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-200">Anonymous User</h3>
                <p className="text-sm text-blue-300/80">Peer ID: {peerId}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-900/30 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-300">0</p>
                <p className="text-sm text-blue-300/80">Content Created</p>
              </div>
              <div className="bg-blue-900/30 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-300">0</p>
                <p className="text-sm text-blue-300/80">Content Remixed</p>
              </div>
              <div className="bg-blue-900/30 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-300">0</p>
                <p className="text-sm text-blue-300/80">Engagement Points</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-blue-200">Your Content</h3>
              <p className="text-blue-300/80">You haven't created any content yet.</p>
            </div>
          </div>
        )}

        {/* Retrieved Content Modal */}
        {retrievedContent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card max-w-2xl w-full max-h-[80vh] overflow-auto moonlight-glow">
              <div className="p-4 border-b border-blue-900/30 flex justify-between items-center">
                <h3 className="text-lg font-medium text-blue-200">Content Details</h3>
                <button 
                  className="text-blue-300 hover:text-blue-100"
                  onClick={() => setRetrievedContent('')}
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                <pre className="bg-blue-900/20 p-4 rounded overflow-auto text-sm text-blue-300/90">
                  {retrievedContent}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-900/30 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-blue-300/70">
                PermaDiscover - A decentralized content discovery platform
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-blue-300/70 hover:text-blue-200">About</a>
              <a href="#" className="text-sm text-blue-300/70 hover:text-blue-200">Privacy</a>
              <a href="#" className="text-sm text-blue-300/70 hover:text-blue-200">Terms</a>
              <a href="#" className="text-sm text-blue-300/70 hover:text-blue-200">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
