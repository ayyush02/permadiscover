import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { webSockets } from '@libp2p/websockets'
import { bootstrap } from '@libp2p/bootstrap'
import { kadDHT } from '@libp2p/kad-dht'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { createLibp2p } from 'libp2p'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { identify } from '@libp2p/identify'
import type { CID } from 'multiformats/cid'
import { CID as CIDConstructor } from 'multiformats/cid'

export class IPFSService {
  private helia: any
  private fs: any
  private node: any
  private isInitialized: boolean = false
  
  constructor() {
    this.initialize().catch(error => {
      console.error('Failed to initialize IPFS:', error)
    })
  }

  private async initialize() {
    try {
      const node = await createLibp2p({
        transports: [webSockets()],
        connectionEncrypters: [noise()],
        streamMuxers: [yamux()],
        services: {
          identify: identify(),
          pubsub: gossipsub()
        },
        peerDiscovery: [
          bootstrap({
            list: [
              '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
              '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa'
            ]
          })
        ]
      })

      this.node = node
      this.helia = await createHelia({
        libp2p: node
      })

      this.fs = unixfs(this.helia)
      this.isInitialized = true
      
      console.log('IPFS node initialized successfully')
    } catch (error) {
      console.error('Failed to initialize IPFS node:', error)
      throw error
    }
  }

  /**
   * Check if IPFS is initialized
   * @returns True if IPFS is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.helia !== null
  }

  /**
   * Store content on IPFS
   * @param content - Content to store (can be string, Buffer, or Uint8Array)
   * @returns CID of the stored content
   */
  async store(content: string | Buffer | Uint8Array): Promise<CID> {
    if (!this.isReady()) {
      throw new Error('IPFS not initialized')
    }

    try {
      // Convert string to Uint8Array if needed
      const contentBytes = typeof content === 'string' 
        ? new TextEncoder().encode(content) 
        : content
      
      // Use the helia API directly to add content
      const cid = await this.helia.blockstore.put(contentBytes)
      console.log('Content stored with CID:', cid.toString())
      return cid
    } catch (error) {
      console.error('Failed to store content:', error)
      throw error
    }
  }

  /**
   * Retrieve content from IPFS by CID
   * @param cid - Content identifier
   * @returns Retrieved content as Uint8Array
   */
  async retrieve(cid: CID | string): Promise<Uint8Array> {
    if (!this.isReady()) {
      throw new Error('IPFS not initialized')
    }

    try {
      // Ensure we have a proper CID object
      let cidObj: CID
      if (typeof cid === 'string') {
        try {
          cidObj = CIDConstructor.parse(cid)
        } catch (err) {
          console.error('Invalid CID string:', err)
          throw new Error(`Invalid CID: ${cid}`)
        }
      } else {
        cidObj = cid
      }

      // Check if the block exists in the blockstore
      const exists = await this.helia.blockstore.has(cidObj)
      if (!exists) {
        throw new Error(`Content with CID ${cidObj.toString()} not found in local blockstore`)
      }

      // Retrieve the content
      const bytes = await this.helia.blockstore.get(cidObj)
      return bytes
    } catch (error) {
      console.error('Failed to retrieve content:', error)
      throw error
    }
  }

  /**
   * Find peers that have a specific piece of content
   * @param cid - Content identifier to look for
   * @returns Array of peer IDs that have the content
   */
  async findProviders(cid: CID | string): Promise<string[]> {
    if (!this.isReady()) {
      throw new Error('IPFS not initialized')
    }

    try {
      // Ensure we have a proper CID object
      let cidObj: CID
      if (typeof cid === 'string') {
        try {
          cidObj = CIDConstructor.parse(cid)
        } catch (err) {
          console.error('Invalid CID string:', err)
          throw new Error(`Invalid CID: ${cid}`)
        }
      } else {
        cidObj = cid
      }

      const providers = []
      for await (const provider of this.node.dht.findProviders(cidObj)) {
        providers.push(provider.id.toString())
      }
      return providers
    } catch (error) {
      console.error('Failed to find providers:', error)
      throw error
    }
  }

  /**
   * Get the peer ID of this node
   * @returns Peer ID as string
   */
  getPeerId(): string {
    if (!this.isReady()) {
      throw new Error('IPFS not initialized')
    }
    return this.node.peerId.toString()
  }

  /**
   * Get all connected peers
   * @returns Array of connected peer IDs
   */
  async getConnectedPeers(): Promise<string[]> {
    if (!this.isReady()) {
      throw new Error('IPFS not initialized')
    }
    const peers = []
    for (const [peerId] of this.node.getConnections()) {
      peers.push(peerId.toString())
    }
    return peers
  }
} 