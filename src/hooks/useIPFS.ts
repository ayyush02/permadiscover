import { useState, useEffect, useCallback } from 'react'
import { IPFSService } from '@/services/ipfs'
import type { CID } from 'multiformats/cid'
import { CID as CIDConstructor } from 'multiformats/cid'

let ipfsInstance: IPFSService | null = null

export const useIPFS = () => {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    const initializeIPFS = async () => {
      if (!ipfsInstance) {
        ipfsInstance = new IPFSService()
      }

      try {
        // Wait for IPFS to be ready
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (mounted) {
          setIsReady(true)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize IPFS'))
        }
      }
    }

    initializeIPFS()

    return () => {
      mounted = false
    }
  }, [])

  const store = useCallback(async (content: string | Buffer | Uint8Array) => {
    if (!isReady || !ipfsInstance) throw new Error('IPFS not ready')
    return await ipfsInstance.store(content)
  }, [isReady])

  const retrieve = useCallback(async (cid: CID | string) => {
    if (!isReady || !ipfsInstance) throw new Error('IPFS not ready')
    return await ipfsInstance.retrieve(cid)
  }, [isReady])

  const findProviders = useCallback(async (cid: CID | string) => {
    if (!isReady || !ipfsInstance) throw new Error('IPFS not ready')
    return await ipfsInstance.findProviders(cid)
  }, [isReady])

  const getPeerId = useCallback(() => {
    if (!isReady || !ipfsInstance) throw new Error('IPFS not ready')
    return ipfsInstance.getPeerId()
  }, [isReady])

  const getConnectedPeers = useCallback(async () => {
    if (!isReady || !ipfsInstance) throw new Error('IPFS not ready')
    return await ipfsInstance.getConnectedPeers()
  }, [isReady])

  const parseCID = useCallback((cidString: string): CID => {
    try {
      return CIDConstructor.parse(cidString)
    } catch (err) {
      console.error('Failed to parse CID:', err)
      throw new Error(`Invalid CID: ${cidString}`)
    }
  }, [])

  return {
    isReady,
    error,
    store,
    retrieve,
    findProviders,
    getPeerId,
    getConnectedPeers,
    parseCID
  }
} 