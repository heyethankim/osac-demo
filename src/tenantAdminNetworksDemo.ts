import type { DemoTenantId } from './demoTenant'

export type TenantAdminNetworkStatus = 'Active' | 'Provisioning' | 'Maintenance' | 'Degraded'

export type TenantAdminNetworkRow = {
  id: string
  name: string
  cidr: string
  vlanId: number
  connectedVms: number
  gateway: string
  status: TenantAdminNetworkStatus
}

const NORTHSTAR_NETWORKS: TenantAdminNetworkRow[] = [
  {
    id: 'ns-1',
    name: 'prod-service-mesh',
    cidr: '10.128.0.0/16',
    vlanId: 210,
    connectedVms: 38,
    gateway: '10.128.0.1',
    status: 'Active',
  },
  {
    id: 'ns-2',
    name: 'wire-transfer-vlan',
    cidr: '172.22.48.0/22',
    vlanId: 1847,
    connectedVms: 11,
    gateway: '172.22.48.1',
    status: 'Active',
  },
  {
    id: 'ns-3',
    name: 'gpu-inference-fabric',
    cidr: '192.168.40.0/24',
    vlanId: 92,
    connectedVms: 6,
    gateway: '192.168.40.1',
    status: 'Active',
  },
  {
    id: 'ns-4',
    name: 'partner-extranet',
    cidr: '10.200.8.0/21',
    vlanId: 3312,
    connectedVms: 3,
    gateway: '10.200.8.1',
    status: 'Maintenance',
  },
  {
    id: 'ns-5',
    name: 'sandbox-npd',
    cidr: '10.99.0.0/18',
    vlanId: 105,
    connectedVms: 19,
    gateway: '10.99.0.1',
    status: 'Active',
  },
  {
    id: 'ns-6',
    name: 'branch-sdwan-overlay',
    cidr: '10.44.128.0/20',
    vlanId: 4401,
    connectedVms: 7,
    gateway: '10.44.128.1',
    status: 'Degraded',
  },
]

const EVERGREEN_NETWORKS: TenantAdminNetworkRow[] = [
  {
    id: 'efg-1',
    name: 'core-banking-vrf',
    cidr: '10.77.0.0/16',
    vlanId: 1204,
    connectedVms: 29,
    gateway: '10.77.0.1',
    status: 'Active',
  },
  {
    id: 'efg-2',
    name: 'pci-scoped-clients',
    cidr: '172.31.12.0/23',
    vlanId: 2901,
    connectedVms: 14,
    gateway: '172.31.12.1',
    status: 'Active',
  },
  {
    id: 'efg-3',
    name: 'quant-research-sandbox',
    cidr: '192.168.210.0/24',
    vlanId: 77,
    connectedVms: 4,
    gateway: '192.168.210.1',
    status: 'Provisioning',
  },
  {
    id: 'efg-4',
    name: 'wealth-advisor-vdi',
    cidr: '10.15.64.0/19',
    vlanId: 608,
    connectedVms: 22,
    gateway: '10.15.64.1',
    status: 'Active',
  },
  {
    id: 'efg-5',
    name: 'integration-staging',
    cidr: '10.240.0.0/17',
    vlanId: 2400,
    connectedVms: 9,
    gateway: '10.240.0.1',
    status: 'Active',
  },
]

const VERTEXA_NETWORKS: TenantAdminNetworkRow[] = [
  {
    id: 'vx-1',
    name: 'shared-dev-plane',
    cidr: '10.60.0.0/20',
    vlanId: 601,
    connectedVms: 5,
    gateway: '10.60.0.1',
    status: 'Active',
  },
  {
    id: 'vx-2',
    name: 'edge-ingress-pool',
    cidr: '172.18.0.0/22',
    vlanId: 1802,
    connectedVms: 2,
    gateway: '172.18.0.1',
    status: 'Provisioning',
  },
  {
    id: 'vx-3',
    name: 'telemetry-backhaul',
    cidr: '10.8.192.0/26',
    vlanId: 88,
    connectedVms: 3,
    gateway: '10.8.192.1',
    status: 'Active',
  },
]

/** Demo network segments for the tenant admin Networks directory. */
export function getTenantAdminNetworkRows(tenantId: DemoTenantId): TenantAdminNetworkRow[] {
  switch (tenantId) {
    case 'northstar':
      return NORTHSTAR_NETWORKS
    case 'evergreen':
      return EVERGREEN_NETWORKS
    case 'vertexa':
      return VERTEXA_NETWORKS
    default:
      return NORTHSTAR_NETWORKS
  }
}
