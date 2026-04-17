import type { DemoTenantId } from './demoTenant'

export type TenantAdminProjectQuotaRow = {
  id: string
  project: string
  vcpuQuota: string
  memoryQuota: string
  gpuQuota: string
  storageQuota: string
  utilization: string
}

const NORTHSTAR_ROWS: TenantAdminProjectQuotaRow[] = [
  {
    id: 'ns-pq-1',
    project: 'wire-core-platform',
    vcpuQuota: '512',
    memoryQuota: '2.0 TiB',
    gpuQuota: '12',
    storageQuota: '256 TiB',
    utilization: '61%',
  },
  {
    id: 'ns-pq-2',
    project: 'fraud-analytics-lab',
    vcpuQuota: '192',
    memoryQuota: '768 GiB',
    gpuQuota: '8',
    storageQuota: '64 TiB',
    utilization: '46%',
  },
  {
    id: 'ns-pq-3',
    project: 'branch-sdwan-pilot',
    vcpuQuota: '64',
    memoryQuota: '256 GiB',
    gpuQuota: '2',
    storageQuota: '16 TiB',
    utilization: '38%',
  },
]

const EVERGREEN_ROWS: TenantAdminProjectQuotaRow[] = [
  {
    id: 'efg-pq-1',
    project: 'payments-modernization',
    vcpuQuota: '256',
    memoryQuota: '1.0 TiB',
    gpuQuota: '8',
    storageQuota: '128 TiB',
    utilization: '59%',
  },
  {
    id: 'efg-pq-2',
    project: 'risk-data-mesh',
    vcpuQuota: '128',
    memoryQuota: '512 GiB',
    gpuQuota: '4',
    storageQuota: '48 TiB',
    utilization: '31%',
  },
  {
    id: 'efg-pq-3',
    project: 'mobile-api-next',
    vcpuQuota: '96',
    memoryQuota: '384 GiB',
    gpuQuota: '4',
    storageQuota: '32 TiB',
    utilization: '74%',
  },
]

const VERTEXA_ROWS: TenantAdminProjectQuotaRow[] = [
  {
    id: 'vx-pq-1',
    project: 'partner-integration-hub',
    vcpuQuota: '64',
    memoryQuota: '256 GiB',
    gpuQuota: '2',
    storageQuota: '16 TiB',
    utilization: '25%',
  },
  {
    id: 'vx-pq-2',
    project: 'observability-sandbox',
    vcpuQuota: '48',
    memoryQuota: '192 GiB',
    gpuQuota: '0',
    storageQuota: '8 TiB',
    utilization: '22%',
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
