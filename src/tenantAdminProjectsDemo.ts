import type { DemoTenantId } from './demoTenant'

export type TenantAdminProjectStatus = 'Active' | 'Provisioning' | 'Maintenance' | 'Degraded'

export type TenantAdminProjectRow = {
  id: string
  name: string
  environment: string
  owner: string
  members: number
  vms: number
  vcpuUsed: number
  vcpuAlloc: number
  memUsedGiB: number
  memAllocGiB: number
  gpuUsed: number
  gpuAlloc: number
  storUsedTb: number
  storAllocTb: number
  status: TenantAdminProjectStatus
}

const NORTHSTAR_PROJECTS: TenantAdminProjectRow[] = [
  {
    id: 'ns-proj-1',
    name: 'wire-core-platform',
    environment: 'Production',
    owner: 'Jordan Lee',
    members: 14,
    vms: 38,
    vcpuUsed: 312,
    vcpuAlloc: 512,
    memUsedGiB: 1126,
    memAllocGiB: 2048,
    gpuUsed: 6,
    gpuAlloc: 12,
    storUsedTb: 142,
    storAllocTb: 256,
    status: 'Active',
  },
  {
    id: 'ns-proj-2',
    name: 'fraud-analytics-lab',
    environment: 'Staging',
    owner: 'Chris Morgan',
    members: 7,
    vms: 12,
    vcpuUsed: 88,
    vcpuAlloc: 192,
    memUsedGiB: 256,
    memAllocGiB: 768,
    gpuUsed: 2,
    gpuAlloc: 8,
    storUsedTb: 22,
    storAllocTb: 64,
    status: 'Active',
  },
  {
    id: 'ns-proj-3',
    name: 'branch-sdwan-pilot',
    environment: 'Development',
    owner: 'Sam Rivera',
    members: 5,
    vms: 6,
    vcpuUsed: 24,
    vcpuAlloc: 64,
    memUsedGiB: 96,
    memAllocGiB: 256,
    gpuUsed: 0,
    gpuAlloc: 2,
    storUsedTb: 5,
    storAllocTb: 16,
    status: 'Provisioning',
  },
  {
    id: 'ns-proj-4',
    name: 'legacy-core-readonly',
    environment: 'Production',
    owner: 'Avery Brooks',
    members: 9,
    vms: 22,
    vcpuUsed: 410,
    vcpuAlloc: 448,
    memUsedGiB: 1843,
    memAllocGiB: 2048,
    gpuUsed: 0,
    gpuAlloc: 0,
    storUsedTb: 198,
    storAllocTb: 220,
    status: 'Maintenance',
  },
]

const EVERGREEN_PROJECTS: TenantAdminProjectRow[] = [
  {
    id: 'efg-proj-1',
    name: 'payments-modernization',
    environment: 'Production',
    owner: 'Marcus Chen',
    members: 11,
    vms: 27,
    vcpuUsed: 156,
    vcpuAlloc: 256,
    memUsedGiB: 512,
    memAllocGiB: 1024,
    gpuUsed: 4,
    gpuAlloc: 8,
    storUsedTb: 68,
    storAllocTb: 128,
    status: 'Active',
  },
  {
    id: 'efg-proj-2',
    name: 'risk-data-mesh',
    environment: 'Sandbox',
    owner: 'Priya Nair',
    members: 6,
    vms: 9,
    vcpuUsed: 40,
    vcpuAlloc: 128,
    memUsedGiB: 128,
    memAllocGiB: 512,
    gpuUsed: 1,
    gpuAlloc: 4,
    storUsedTb: 12,
    storAllocTb: 48,
    status: 'Active',
  },
  {
    id: 'efg-proj-3',
    name: 'mobile-api-next',
    environment: 'Staging',
    owner: 'Elena Park',
    members: 8,
    vms: 15,
    vcpuUsed: 72,
    vcpuAlloc: 96,
    memUsedGiB: 192,
    memAllocGiB: 384,
    gpuUsed: 0,
    gpuAlloc: 4,
    storUsedTb: 21,
    storAllocTb: 32,
    status: 'Degraded',
  },
]

const VERTEXA_PROJECTS: TenantAdminProjectRow[] = [
  {
    id: 'vx-proj-1',
    name: 'partner-integration-hub',
    environment: 'Development',
    owner: 'Alex Johnson',
    members: 4,
    vms: 5,
    vcpuUsed: 16,
    vcpuAlloc: 64,
    memUsedGiB: 64,
    memAllocGiB: 256,
    gpuUsed: 0,
    gpuAlloc: 2,
    storUsedTb: 3,
    storAllocTb: 16,
    status: 'Active',
  },
  {
    id: 'vx-proj-2',
    name: 'observability-sandbox',
    environment: 'Sandbox',
    owner: 'Riley Ortiz',
    members: 3,
    vms: 4,
    vcpuUsed: 12,
    vcpuAlloc: 48,
    memUsedGiB: 48,
    memAllocGiB: 192,
    gpuUsed: 0,
    gpuAlloc: 0,
    storUsedTb: 1.4,
    storAllocTb: 8,
    status: 'Provisioning',
  },
]

export function getTenantAdminProjectRows(tenantId: DemoTenantId): TenantAdminProjectRow[] {
  switch (tenantId) {
    case 'northstar':
      return NORTHSTAR_PROJECTS
    case 'evergreen':
      return EVERGREEN_PROJECTS
    case 'vertexa':
      return VERTEXA_PROJECTS
    default:
      return NORTHSTAR_PROJECTS
  }
}
