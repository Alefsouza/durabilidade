import pb from '@/lib/pocketbase/client'
import { Material } from '@/types'

export interface PBMaterial {
  id: string
  name: string
  supplier: string
  partNumber: string
  expectedKm: number
  quantity: number
  branch: string
}

export const getCustomMaterials = async (): Promise<Material[]> => {
  const records = await pb.collection<PBMaterial>('materials').getFullList({ sort: '-created' })
  return records.map((r) => ({
    id: r.id,
    name: r.name,
    supplier: r.supplier,
    partNumber: r.partNumber,
    expectedKm: r.expectedKm,
    quantity: r.quantity,
    branch: r.branch,
  }))
}

export const createCustomMaterial = async (material: Omit<Material, 'id'>): Promise<Material> => {
  const record = await pb.collection<PBMaterial>('materials').create(material)
  return {
    id: record.id,
    name: record.name,
    supplier: record.supplier,
    partNumber: record.partNumber,
    expectedKm: record.expectedKm,
    quantity: record.quantity,
    branch: record.branch,
  }
}
