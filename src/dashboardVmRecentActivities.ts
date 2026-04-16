import { DEMO_TENANT_DISPLAY_USER, type DemoTenantId } from './demoTenant'
import type { TenantVirtualMachine } from './TenantVirtualMachinesPage'

/** Outcome of the activity for UI treatment (maps to PatternFly status labels). */
export type VmRecentActivitySeverity = 'success' | 'warning' | 'danger'

export type VmRecentActivityItem = {
  id: string
  timeLabel: string
  title: string
  detail: string
  severity: VmRecentActivitySeverity
  /** Absolute timestamp for full-page view (demo). */
  occurredAt: string
  resource: string
  resourceType: string
  workspace: string
  initiatedBy: string
  /** Demo correlation / audit id. */
  eventId: string
}

/** Demo VM lifecycle and ops events aligned with names from the Virtual machines inventory. */
export function buildDemoVmRecentActivities(
  vms: readonly TenantVirtualMachine[],
  tenantId: DemoTenantId,
): VmRecentActivityItem[] {
  const v = vms
  const pick = (i: number) => v[i % v.length]?.name ?? 'vm-instance'
  const by = DEMO_TENANT_DISPLAY_USER[tenantId]
  const catalogDetail =
    tenantId === 'vertexa'
      ? 'Global template baseline pushed to all registered tenant organizations'
      : tenantId === 'northstar'
        ? 'Catalog refreshed from Northstar golden images (RHEL 9.4, Windows Server 2022)'
        : 'Catalog refreshed from Bluestone golden images (RHEL 9.4, Windows Server 2022)'
  const evt =
    tenantId === 'vertexa' ? 'evt-vtx' : tenantId === 'northstar' ? 'evt-ns' : 'evt-efg'

  return [
    {
      id: 'a1',
      timeLabel: '2 min ago',
      title: 'Virtual machine started',
      detail: `${pick(0)} completed power-on in tenant-prod`,
      severity: 'success',
      occurredAt: 'Apr 6, 2026 · 09:12 UTC',
      resource: pick(0),
      resourceType: 'Virtual machine',
      workspace: 'tenant-prod',
      initiatedBy: by,
      eventId: `${evt}-8f2a-01k9`,
    },
    {
      id: 'a2',
      timeLabel: '18 min ago',
      title: 'Snapshot completed with warnings',
      detail: `Quiesce timed out for ${pick(3)}; crash-consistent snapshot saved`,
      severity: 'warning',
      occurredAt: 'Apr 6, 2026 · 08:56 UTC',
      resource: pick(3),
      resourceType: 'Snapshot',
      workspace: 'tenant-prod',
      initiatedBy: by,
      eventId: `${evt}-7c11-01k8`,
    },
    {
      id: 'a3',
      timeLabel: '1 hr ago',
      title: 'Virtual machine paused',
      detail: `${pick(7)} suspended by automation policy`,
      severity: 'warning',
      occurredAt: 'Apr 6, 2026 · 08:14 UTC',
      resource: pick(7),
      resourceType: 'Virtual machine',
      workspace: 'tenant-prod',
      initiatedBy: by,
      eventId: `${evt}-6d03-01k7`,
    },
    {
      id: 'a4',
      timeLabel: '2 hr ago',
      title: 'Console session ended',
      detail: `Interactive session closed on ${pick(2)}`,
      severity: 'success',
      occurredAt: 'Apr 6, 2026 · 07:14 UTC',
      resource: pick(2),
      resourceType: 'Console session',
      workspace: 'tenant-prod',
      initiatedBy: by,
      eventId: `${evt}-5a90-01k6`,
    },
    {
      id: 'a5',
      timeLabel: '3 hr ago',
      title: 'Live migration failed',
      detail: `Could not complete migration for ${pick(11)} — target host unreachable`,
      severity: 'danger',
      occurredAt: 'Apr 6, 2026 · 06:14 UTC',
      resource: pick(11),
      resourceType: 'Virtual machine',
      workspace: 'tenant-prod',
      initiatedBy: by,
      eventId: `${evt}-4b22-01k5`,
    },
    {
      id: 'a6',
      timeLabel: '5 hr ago',
      title: 'Virtual machine created',
      detail: `${pick(5)} provisioned from template in ${v[5 % v.length]?.workspace ?? 'tenant-prod'}`,
      severity: 'success',
      occurredAt: 'Apr 6, 2026 · 04:14 UTC',
      resource: pick(5),
      resourceType: 'Virtual machine',
      workspace: v[5 % v.length]?.workspace ?? 'tenant-prod',
      initiatedBy: by,
      eventId: `${evt}-3c88-01k4`,
    },
    {
      id: 'a7',
      timeLabel: '6 hr ago',
      title: 'Disk resize completed',
      detail: `Data volume on ${pick(4)} expanded to 512 GiB`,
      severity: 'success',
      occurredAt: 'Apr 6, 2026 · 03:14 UTC',
      resource: pick(4),
      resourceType: 'Disk',
      workspace: 'tenant-prod',
      initiatedBy: by,
      eventId: `${evt}-2d44-01k3`,
    },
    {
      id: 'a8',
      timeLabel: '8 hr ago',
      title: 'Network security group updated',
      detail: 'Inbound rule added for HTTPS (443) on workload subnet',
      severity: 'success',
      occurredAt: 'Apr 6, 2026 · 01:14 UTC',
      resource: 'nsg-workload-01',
      resourceType: 'Security group',
      workspace: 'tenant-prod',
      initiatedBy: by,
      eventId: `${evt}-1e77-01k2`,
    },
    {
      id: 'a9',
      timeLabel: '1 day ago',
      title: 'Guest agent heartbeat degraded',
      detail: `${pick(8)} reported delayed metrics for 15 minutes`,
      severity: 'warning',
      occurredAt: 'Apr 5, 2026 · 14:22 UTC',
      resource: pick(8),
      resourceType: 'Virtual machine',
      workspace: 'tenant-prod',
      initiatedBy: by,
      eventId: `${evt}-0f91-01k1`,
    },
    {
      id: 'a10',
      timeLabel: '1 day ago',
      title: 'Template sync finished',
      detail: catalogDetail,
      severity: 'success',
      occurredAt: 'Apr 5, 2026 · 06:00 UTC',
      resource: 'tenant-image-catalog',
      resourceType: 'Catalog',
      workspace: 'platform-shared',
      initiatedBy: by,
      eventId: `${evt}-09aa-01k0`,
    },
  ]
}

/** First N events for the dashboard sidebar (same data as the full list). */
export function buildDashboardVmRecentActivitiesPreview(
  vms: readonly TenantVirtualMachine[],
  tenantId: DemoTenantId,
  limit = 6,
): VmRecentActivityItem[] {
  return buildDemoVmRecentActivities(vms, tenantId).slice(0, limit)
}
