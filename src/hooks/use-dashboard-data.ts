import { useAppStore } from '@/store/use-app-store'

const MOCK_MATERIALS = [
  {
    id: 'm1',
    partNumber: 'PN-001',
    supplier: 'Marca A',
    name: 'Amortecedor Dianteiro',
    expectedKm: 10000,
  },
  {
    id: 'm2',
    partNumber: 'PN-002',
    supplier: 'Marca B',
    name: 'Pastilha de Freio',
    expectedKm: 15000,
  },
  { id: 'm3', partNumber: 'PN-003', supplier: 'Marca C', name: 'Filtro de Ar', expectedKm: 12000 },
]

const MOCK_TESTS = [
  {
    id: 't1',
    status: 'aprovado',
    branch: 'SP',
    materialId: 'm1',
    startKm: 0,
    finalKm: 10500,
    startDate: '2023-01-01',
    endDate: '2023-06-01',
    prefix: 'PR-1',
    position: 'Dianteira',
  },
  {
    id: 't2',
    status: 'aprovado',
    branch: 'RJ',
    materialId: 'm2',
    startKm: 0,
    finalKm: 15500,
    startDate: '2023-02-01',
    endDate: '2023-07-01',
    prefix: 'PR-2',
    position: 'Traseira',
  },
  {
    id: 't3',
    status: 'reprovado',
    branch: 'MG',
    materialId: 'm1',
    startKm: 0,
    finalKm: 8000,
    startDate: '2023-03-01',
    endDate: '2023-05-01',
    prefix: 'PR-3',
    position: 'Dianteira',
  },
  {
    id: 't4',
    status: 'reprovado',
    branch: 'RS',
    materialId: 'm3',
    startKm: 0,
    finalKm: 5000,
    startDate: '2023-04-01',
    endDate: '2023-06-01',
    prefix: 'PR-4',
    position: 'Traseira',
  },
  {
    id: 't5',
    status: 'ativo',
    branch: 'SP',
    materialId: 'm2',
    startKm: 0,
    currentKm: 5000,
    startDate: '2023-05-01',
    prefix: 'PR-5',
    position: 'Dianteira',
  },
  {
    id: 't6',
    status: 'ativo',
    branch: 'RJ',
    materialId: 'm3',
    startKm: 0,
    currentKm: 2000,
    startDate: '2023-06-01',
    prefix: 'PR-6',
    position: 'Traseira',
  },
]

export function useDashboardData() {
  const store = useAppStore()

  return {
    ...store,
    filteredTests: MOCK_TESTS,
    materials: MOCK_MATERIALS,
  }
}
