import type { DemoTenantId } from './demoTenant'

export type TenantAdminProjectQuotaRow = {
  id: string
  project: string
  vcpuUsed: number
  vcpuAlloc: number
  memUsedGiB: number
  memAllocGiB: number
  gpuUsed: number
  gpuAlloc: number
  storUsedTb: number
  storAllocTb: number
  /** Aggregate utilization for the summary column (0–100). */
  utilizationPct: number
}

const NORTHSTAR_ROWS: TenantAdminProjectQuotaRow[] = [
  {
    id: 'ns-pq-1',
    project: 'wire-core-platform',
    vcpuUsed: 312,
    vcpuAlloc: 512,
    memUsedGiB: 1250,
    memAllocGiB: 2048,
    gpuUsed: 7,
    gpuAlloc: 12,
    storUsedTb: 156,
    storAllocTb: 256,
    utilizationPct: 61,
  },
  {
    id: 'ns-pq-2',
    project: 'fraud-analytics-lab',
    vcpuUsed: 88,
    vcpuAlloc: 192,
    memUsedGiB: 236,
    memAllocGiB: 768,
    gpuUsed: 2,
    gpuAlloc: 8,
    storUsedTb: 29,
    storAllocTb: 64,
    utilizationPct: 46,
  },
  {
    id: 'ns-pq-3',
    project: 'branch-sdwan-pilot',
    vcpuUsed: 24,
    vcpuAlloc: 64,
    memUsedGiB: 97,
    memAllocGiB: 256,
    gpuUsed: 0,
    gpuAlloc: 2,
    storUsedTb: 6,
    storAllocTb: 16,
    utilizationPct: 38,
  },
]

const EVERGREEN_ROWS: TenantAdminProjectQuotaRow[] = [
  {
    id: 'efg-pq-1',
    project: 'payments-modernization',
    vcpuUsed: 151,
    vcpuAlloc: 256,
    memUsedGiB: 604,
    memAllocGiB: 1024,
    gpuUsed: 5,
    gpuAlloc: 8,
    storUsedTb: 76,
    storAllocTb: 128,
    utilizationPct: 59,
  },
  {
    id: 'efg-pq-2',
    project: 'risk-data-mesh',
    vcpuUsed: 40,
    vcpuAlloc: 128,
    memUsedGiB: 159,
    memAllocGiB: 512,
    gpuUsed: 1,
    gpuAlloc: 4,
    storUsedTb: 15,
    storAllocTb: 48,
    utilizationPct: 31,
  },
  {
    id: 'efg-pq-3',
    project: 'mobile-api-next',
    vcpuUsed: 71,
    vcpuAlloc: 96,
    memUsedGiB: 284,
    memAllocGiB: 384,
    gpuUsed: 3,
    gpuAlloc: 4,
    storUsedTb: 24,
    storAllocTb: 32,
    utilizationPct: 74,
  },
]

const VERTEXA_ROWS: TenantAdminProjectQuotaRow[] = [
  {
    id: 'vx-pq-1',
    project: 'partner-integration-hub',
    vcpuUsed: 16,
    vcpuAlloc: 64,
    memUsedGiB: 64,
    memAllocGiB: 256,
    gpuUsed: 0,
    gpuAlloc: 2,
    storUsedTb: 4,
    storAllocTb: 16,
    utilizationPct: 25,
  },
  {
    id: 'vx-pq-2',
    project: 'observability-sandbox',
    vcpuUsed: 11,
    vcpuAlloc: 48,
    memUsedGiB: 42,
    memAllocGiB: 192,
    gpuUsed: 0,
    gpuAlloc: 0,
    storUsedTb: 1.8,
    storAllocTb: 8,
    utilizationPct: 22,
  },
]

export function getTenantAdminProjectQuotaRows(tenantId: DemoTenantId): TenantAdminProjectQuotaRow[] {
  switch (tenantId) {
    case 'northstar':
      return NORTHSTAR_ROWS
    case 'evergreen':
      return EVERGREEN_ROWS
    case 'vertexa':
      return VERTEXA_ROWS
    default:
      return NORTHSTAR_ROWS
  }
}
