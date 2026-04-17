import type { DemoTenantId } from './demoTenant'

export type TenantAdminStoragePoolRow = {
  id: string
  name: string
  type: string
  capacity: string
  used: string
  available: string
  iops: string
  /** Whole-number percent for display (e.g. 56 → "56%"). */
  utilizationPct: number
}

const NORTHSTAR_POOLS: TenantAdminStoragePoolRow[] = [
  {
    id: 'ns-stor-1',
    name: 'prod-vm-data-tier1',
    type: 'NVMe SSD',
    capacity: '256 TiB',
    used: '142.4 TiB',
    available: '113.6 TiB',
    iops: '120k provisioned',
    utilizationPct: 56,
  },
  {
    id: 'ns-stor-2',
    name: 'core-banking-archive',
    type: 'SATA SSD',
    capacity: '512 TiB',
    used: '318.0 TiB',
    available: '194.0 TiB',
    iops: '18k sustained',
    utilizationPct: 62,
  },
  {
    id: 'ns-stor-3',
    name: 'backup-dedupe-vault',
    type: 'Hybrid (flash + HDD)',
    capacity: '1.0 PiB',
    used: '412 TiB',
    available: '612 TiB',
    iops: '8k (metadata tier)',
    utilizationPct: 40,
  },
  {
    id: 'ns-stor-4',
    name: 'dev-test-scratch',
    type: 'NVMe SSD',
    capacity: '64 TiB',
    used: '51.2 TiB',
    available: '12.8 TiB',
    iops: '45k burst',
    utilizationPct: 80,
  },
]

const EVERGREEN_POOLS: TenantAdminStoragePoolRow[] = [
  {
    id: 'efg-stor-1',
    name: 'payments-oltp-pool',
    type: 'NVMe SSD',
    capacity: '96 TiB',
    used: '58.1 TiB',
    available: '37.9 TiB',
    iops: '95k provisioned',
    utilizationPct: 61,
  },
  {
    id: 'efg-stor-2',
    name: 'analytics-warehouse',
    type: 'SATA SSD',
    capacity: '384 TiB',
    used: '201.5 TiB',
    available: '182.5 TiB',
    iops: '12k sustained',
    utilizationPct: 52,
  },
  {
    id: 'efg-stor-3',
    name: 'object-compliance-store',
    type: 'Object (S3 API)',
    capacity: '2.0 PiB',
    used: '780 TiB',
    available: '1.24 PiB',
    iops: 'N/A',
    utilizationPct: 38,
  },
]

const VERTEXA_POOLS: TenantAdminStoragePoolRow[] = [
  {
    id: 'vx-stor-1',
    name: 'shared-sandbox-pool',
    type: 'NVMe SSD',
    capacity: '32 TiB',
    used: '14.6 TiB',
    available: '17.4 TiB',
    iops: '30k provisioned',
    utilizationPct: 46,
  },
  {
    id: 'vx-stor-2',
    name: 'lab-images-cache',
    type: 'SATA SSD',
    capacity: '48 TiB',
    used: '9.8 TiB',
    available: '38.2 TiB',
    iops: '9k sustained',
    utilizationPct: 20,
  },
]

/** Demo storage pools for the tenant admin Storage directory. */
export function getTenantAdminStoragePoolRows(tenantId: DemoTenantId): TenantAdminStoragePoolRow[] {
  switch (tenantId) {
    case 'northstar':
      return NORTHSTAR_POOLS
    case 'evergreen':
      return EVERGREEN_POOLS
    case 'vertexa':
      return VERTEXA_POOLS
    default:
      return NORTHSTAR_POOLS
  }
}
