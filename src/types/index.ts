export type Status = 'ativo' | 'aprovado' | 'reprovado'

export interface Material {
  id: string
  name: string
  supplier: string
  partNumber: string
  expectedKm: number
  quantity: number
  branch: string
}

export interface TestRecord {
  id: string
  materialId: string
  prefix: string
  position: string
  startDate: string
  startKm: number
  currentKm?: number // Allows progress tracking if updated
  endDate?: string
  finalKm?: number
  status: Status
  branch: string
}

export type Branch = 'Todas' | 'SP' | 'RJ' | 'MG' | 'RS'
