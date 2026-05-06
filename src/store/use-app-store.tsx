import React, { createContext, useContext, useState, useMemo } from 'react'
import { Material, TestRecord, Branch, Status } from '@/types'

interface AppContextType {
  currentBranch: Branch
  setCurrentBranch: (branch: Branch) => void
  materials: Material[]
  addMaterial: (material: Omit<Material, 'id'>) => void
  tests: TestRecord[]
  startTest: (test: Omit<TestRecord, 'id' | 'status'>) => void
  endTest: (id: string, finalKm: number, endDate: string) => void
  updateTestKm: (id: string, currentKm: number) => void
  filteredMaterials: Material[]
  filteredTests: TestRecord[]
}

const mockMaterials: Material[] = [
  {
    id: 'm1',
    name: 'Pastilha de Freio Dianteira',
    supplier: 'BrakeTech',
    partNumber: 'PN-1001',
    expectedKm: 40000,
    quantity: 50,
    branch: 'SP',
  },
  {
    id: 'm2',
    name: 'Filtro de Ar Motor',
    supplier: 'AirPure',
    partNumber: 'PN-2022',
    expectedKm: 20000,
    quantity: 120,
    branch: 'RJ',
  },
  {
    id: 'm3',
    name: 'Pneu Liso 295/80',
    supplier: 'TireMax',
    partNumber: 'PN-3033',
    expectedKm: 120000,
    quantity: 30,
    branch: 'MG',
  },
]

const mockTests: TestRecord[] = [
  {
    id: 't1',
    materialId: 'm1',
    prefix: 'V-101',
    position: 'Roda DE',
    startDate: '2025-01-10',
    startKm: 150000,
    currentKm: 185000,
    status: 'ativo',
    branch: 'SP',
  },
  {
    id: 't2',
    materialId: 'm2',
    prefix: 'V-205',
    position: 'Motor',
    startDate: '2024-11-01',
    startKm: 200000,
    finalKm: 221000,
    endDate: '2025-02-15',
    status: 'aprovado',
    branch: 'RJ',
  },
  {
    id: 't3',
    materialId: 'm3',
    prefix: 'V-303',
    position: 'Eixo Traseiro',
    startDate: '2024-05-20',
    startKm: 50000,
    finalKm: 150000,
    endDate: '2025-01-20',
    status: 'reprovado',
    branch: 'MG',
  },
  {
    id: 't4',
    materialId: 'm1',
    prefix: 'V-102',
    position: 'Roda DE',
    startDate: '2024-12-01',
    startKm: 100000,
    finalKm: 145000,
    endDate: '2025-03-01',
    status: 'aprovado',
    branch: 'SP',
  },
  {
    id: 't5',
    materialId: 'm2',
    prefix: 'V-210',
    position: 'Motor',
    startDate: '2025-02-01',
    startKm: 80000,
    currentKm: 85000,
    status: 'ativo',
    branch: 'RJ',
  },
]

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentBranch, setCurrentBranch] = useState<Branch>('Todas')
  const [materials, setMaterials] = useState<Material[]>(mockMaterials)
  const [tests, setTests] = useState<TestRecord[]>(mockTests)

  const addMaterial = (mat: Omit<Material, 'id'>) => {
    const newMaterial = { ...mat, id: Math.random().toString(36).substr(2, 9) }
    setMaterials((prev) => [...prev, newMaterial])
  }

  const startTest = (test: Omit<TestRecord, 'id' | 'status'>) => {
    const newTest: TestRecord = {
      ...test,
      id: Math.random().toString(36).substr(2, 9),
      status: 'ativo',
      currentKm: test.startKm,
    }
    setTests((prev) => [...prev, newTest])
  }

  const endTest = (id: string, finalKm: number, endDate: string) => {
    setTests((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const material = materials.find((m) => m.id === t.materialId)
          const expected = material?.expectedKm || 0
          const achieved = finalKm - t.startKm
          const status: Status = achieved >= expected ? 'aprovado' : 'reprovado'
          return { ...t, finalKm, endDate, status }
        }
        return t
      }),
    )
  }

  const updateTestKm = (id: string, currentKm: number) => {
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, currentKm } : t)))
  }

  const filteredMaterials = useMemo(() => {
    return currentBranch === 'Todas'
      ? materials
      : materials.filter((m) => m.branch === currentBranch)
  }, [materials, currentBranch])

  const filteredTests = useMemo(() => {
    return currentBranch === 'Todas' ? tests : tests.filter((t) => t.branch === currentBranch)
  }, [tests, currentBranch])

  const value = {
    currentBranch,
    setCurrentBranch,
    materials,
    addMaterial,
    tests,
    startTest,
    endTest,
    updateTestKm,
    filteredMaterials,
    filteredTests,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
