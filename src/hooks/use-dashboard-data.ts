import { useAppStore } from '@/store/use-app-store'

export function useDashboardData() {
  return useAppStore()
}
