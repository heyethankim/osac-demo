import type { DemoTenantId } from './demoTenant'
import { DEMO_TENANT_LABEL } from './demoTenant'

export type TenantAdminActivityLabelColor = 'blue' | 'teal' | 'green' | 'orange' | 'purple'

export type TenantAdminRecentActivity = {
  id: string
  area: string
  labelColor: TenantAdminActivityLabelColor
  timeLabel: string
  title: string
  detail: string
}

/** Demo audit-style events for tenant administration (Users, Quota, Templates, Networks, Storage). */
export function buildTenantAdminRecentActivities(tenantId: DemoTenantId): TenantAdminRecentActivity[] {
  const org = DEMO_TENANT_LABEL[tenantId]

  return [
    {
      id: 'ta-1',
      area: 'User management',
      labelColor: 'blue',
      timeLabel: '32 min ago',
      title: 'Role change approved',
      detail: `Elevated access for 2 operators in ${org} was approved through the standard change window.`,
    },
    {
      id: 'ta-2',
      area: 'Quota control',
      labelColor: 'orange',
      timeLabel: '1 hr ago',
      title: 'Memory pool threshold notice',
      detail: 'Organization memory allocation crossed 75% of the contracted limit; no workloads were throttled.',
    },
    {
      id: 'ta-3',
      area: 'VM templates',
      labelColor: 'purple',
      timeLabel: '3 hr ago',
      title: 'Gold image published',
      detail: 'RHEL 9 hardened baseline v2026.04.1 was published to the tenant catalog and marked default for new builds.',
    },
    {
      id: 'ta-4',
      area: 'Networks',
      labelColor: 'teal',
      timeLabel: '5 hr ago',
      title: 'Segment policy sync completed',
      detail: 'East-west isolation rules for the trading VLAN set were reconciled with the central policy bundle.',
    },
    {
      id: 'ta-5',
      area: 'Storage',
      labelColor: 'green',
      timeLabel: 'Yesterday',
      title: 'Snapshot retention updated',
      detail: 'Weekly snapshot policy for regulated volumes was extended from 4 to 6 restore points per volume.',
    },
    {
      id: 'ta-6',
      area: 'Quota control',
      labelColor: 'orange',
      timeLabel: 'Yesterday',
      title: 'GPU allocation request',
      detail: 'A request for 2 additional GPU devices is pending finance approval before quota can be raised.',
    },
    {
      id: 'ta-7',
      area: 'User management',
      labelColor: 'blue',
      timeLabel: '2 days ago',
      title: 'Bulk deprovisioning finished',
      detail: 'Six contractor accounts were offboarded; SSO sessions were revoked and home directories queued for purge.',
    },
    {
      id: 'ta-8',
      area: 'Networks',
      labelColor: 'teal',
      timeLabel: '2 days ago',
      title: 'Peering health check',
      detail: 'Redundant peering to the shared DR hub passed latency and packet-loss checks on both paths.',
    },
  ]
}
