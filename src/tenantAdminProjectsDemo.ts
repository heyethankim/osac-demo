import type { DemoTenantId } from './demoTenant'

export type TenantAdminProjectStatus = 'Active' | 'Provisioning' | 'Maintenance' | 'Degraded'

export type TenantAdminProjectRow = {
  id: string
  name: string
  environment: string
  owner: string
  members: number
  vms: number
  vcpuUsage: string
  memoryUsage: string
  gpuUsage: string
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
    vcpuUsage: '312 / 512',
    memoryUsage: '1.1 TiB / 2.0 TiB',
    gpuUsage: '6 / 12',
    status: 'Active',
  },
  {
    id: 'ns-proj-2',
    name: 'fraud-analytics-lab',
    environment: 'Staging',
    owner: 'Chris Morgan',
    members: 7,
    vms: 12,
    vcpuUsage: '88 / 192',
    memoryUsage: '256 GiB / 768 GiB',
    gpuUsage: '2 / 8',
    status: 'Active',
  },
  {
    id: 'ns-proj-3',
    name: 'branch-sdwan-pilot',
    environment: 'Development',
    owner: 'Sam Rivera',
    members: 5,
    vms: 6,
    vcpuUsage: '24 / 64',
    memoryUsage: '96 GiB / 256 GiB',
    gpuUsage: '0 / 2',
    status: 'Provisioning',
  },
  {
    id: 'ns-proj-4',
    name: 'legacy-core-readonly',
    environment: 'Production',
    owner: 'Avery Brooks',
    members: 9,
    vms: 22,
    vcpuUsage: '410 / 448',
    memoryUsage: '1.8 TiB / 2.0 TiB',
    gpuUsage: '0 / 0',
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
    vcpuUsage: '156 / 256',
    memoryUsage: '512 GiB / 1.0 TiB',
    gpuUsage: '4 / 8',
    status: 'Active',
  },
  {
    id: 'efg-proj-2',
    name: 'risk-data-mesh',
    environment: 'Sandbox',
    owner: 'Priya Nair',
    members: 6,
    vms: 9,
    vcpuUsage: '40 / 128',
    memoryUsage: '128 GiB / 512 GiB',
    gpuUsage: '1 / 4',
    status: 'Active',
  },
  {
    id: 'efg-proj-3',
    name: 'mobile-api-next',
    environment: 'Staging',
    owner: 'Elena Park',
    members: 8,
    vms: 15,
    vcpuUsage: '72 / 96',
    memoryUsage: '192 GiB / 384 GiB',
    gpuUsage: '0 / 4',
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
    vcpuUsage: '16 / 64',
    memoryUsage: '64 GiB / 256 GiB',
    gpuUsage: '0 / 2',
    status: 'Active',
  },
  {
    id: 'vx-proj-2',
    name: 'observability-sandbox',
    environment: 'Sandbox',
    owner: 'Riley Ortiz',
    members: 3,
    vms: 4,
    vcpuUsage: '12 / 48',
    memoryUsage: '48 GiB / 192 GiB',
    gpuUsage: '0 / 0',
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
