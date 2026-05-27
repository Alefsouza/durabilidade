import pb from '@/lib/pocketbase/client'
import type { Material } from '@/types'

export const getOracleInventory = async (): Promise<Material[]> => {
  return await pb.send('/backend/v1/inventory-proxy', { method: 'GET' })
}
