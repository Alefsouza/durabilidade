import pb from '@/lib/pocketbase/client'
import { TestRecord, Status, Branch } from '@/types'

export interface PBDurabilityTest {
  id: string
  material_id: string
  prefix: string
  position: string
  start_date: string
  start_km: number
  current_km?: number
  final_km?: number
  end_date?: string
  status: Status
  branch: Branch
  created: string
  updated: string
}

const mapPBToTestRecord = (pbRecord: PBDurabilityTest): TestRecord => ({
  id: pbRecord.id,
  materialId: pbRecord.material_id,
  prefix: pbRecord.prefix,
  position: pbRecord.position,
  startDate: pbRecord.start_date,
  startKm: pbRecord.start_km,
  currentKm: pbRecord.current_km,
  endDate: pbRecord.end_date,
  finalKm: pbRecord.final_km,
  status: pbRecord.status,
  branch: pbRecord.branch,
})

const mapTestRecordToPB = (record: Partial<TestRecord>): Partial<PBDurabilityTest> => {
  const result: any = {}
  if (record.materialId !== undefined) result.material_id = record.materialId
  if (record.prefix !== undefined) result.prefix = record.prefix
  if (record.position !== undefined) result.position = record.position
  if (record.startDate !== undefined) result.start_date = record.startDate
  if (record.startKm !== undefined) result.start_km = record.startKm
  if (record.currentKm !== undefined) result.current_km = record.currentKm
  if (record.endDate !== undefined) result.end_date = record.endDate
  if (record.finalKm !== undefined) result.final_km = record.finalKm
  if (record.status !== undefined) result.status = record.status
  if (record.branch !== undefined) result.branch = record.branch
  return result
}

export const getTests = async (): Promise<TestRecord[]> => {
  const records = await pb
    .collection<PBDurabilityTest>('durability_tests')
    .getFullList({ sort: '-created' })
  return records.map(mapPBToTestRecord)
}

export const createTest = async (test: Omit<TestRecord, 'id'>): Promise<TestRecord> => {
  const record = await pb
    .collection<PBDurabilityTest>('durability_tests')
    .create(mapTestRecordToPB(test))
  return mapPBToTestRecord(record)
}

export const updateTest = async (id: string, test: Partial<TestRecord>): Promise<TestRecord> => {
  const record = await pb
    .collection<PBDurabilityTest>('durability_tests')
    .update(id, mapTestRecordToPB(test))
  return mapPBToTestRecord(record)
}
