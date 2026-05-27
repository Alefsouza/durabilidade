import { Material } from '@/types'

export interface ORDSItem {
  cod_mat_teste?: string
  desc_mat_teste?: string
  marca_teste?: string
  km_esperado?: number
  codigo?: string
  descricao?: string
  tipo?: string
}

export interface ORDSResponse {
  items: ORDSItem[]
  hasMore?: boolean
  limit?: number
  offset?: number
}

const mapOrdsToMaterial = (item: ORDSItem): Material => {
  const id = item.cod_mat_teste?.toString() || item.codigo?.toString() || Math.random().toString()
  return {
    id,
    partNumber: id,
    name: item.desc_mat_teste || item.descricao || 'Desconhecido',
    supplier: item.marca_teste || item.tipo || 'N/A',
    expectedKm: item.km_esperado ? Number(item.km_esperado) : 80000,
    quantity: 0,
    branch: 'Todas',
  }
}

export const fetchAllMaterials = async (): Promise<Material[]> => {
  const baseUrl = import.meta.env.VITE_ORDS_API_URL
  if (!baseUrl) {
    console.warn('VITE_ORDS_API_URL not set. Working in offline mode.')
    return []
  }

  try {
    const response = await fetch(baseUrl)
    if (!response.ok) {
      throw new Error('connection unavailable')
    }

    const data = await response.json()
    const items = data.items || data || []
    return (Array.isArray(items) ? items : []).map(mapOrdsToMaterial)
  } catch (error) {
    console.warn('ORDS API fetch failed:', error)
    throw new Error('Sistema em modo offline. Conexão indisponível com a API de peças.')
  }
}

export const fetchMaterialByCode = async (code: string): Promise<Material> => {
  const materials = await fetchAllMaterials()
  const found = materials.find((m) => m.id === code || m.partNumber === code)
  if (found) return found
  return {
    id: code,
    partNumber: code,
    name: 'Desconhecido (Offline)',
    supplier: 'N/A',
    expectedKm: 80000,
    quantity: 0,
    branch: 'Todas',
  }
}

export const searchMaterialsByDescription = async (term: string): Promise<Material[]> => {
  const materials = await fetchAllMaterials()
  return materials.filter((m) => m.name.toLowerCase().includes(term.toLowerCase()))
}
