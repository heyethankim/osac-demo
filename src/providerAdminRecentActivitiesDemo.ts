import type { TenantAdminRecentActivity } from './tenantAdminRecentActivitiesDemo'

/** Demo platform audit events for provider administration (tenants, allocation, templates, infra). */
export function buildProviderAdminRecentActivities(): TenantAdminRecentActivity[] {
  return [
    {
      id: 'pa-1',
      area: 'Tenant organizations',
      labelColor: 'blue',
      timeLabel: '18 min ago',
      title: 'Northstar Bank workspace verified',
      detail:
        'Post-migration health checks completed for the tenant admin console; SSO metadata rollover is scheduled for tonight.',
    },
    {
      id: 'pa-2',
      area: 'Resource allocation',
      labelColor: 'orange',
      timeLabel: '52 min ago',
      title: 'Cross-tenant vCPU pool rebalanced',
      detail:
        'Burst headroom was shifted from the DR region into production after sustained demand from two active tenants.',
    },
    {
      id: 'pa-3',
      area: 'Global templates',
      labelColor: 'purple',
      timeLabel: '2 hr ago',
      title: 'Financial services gold image promoted',
      detail:
        'RHEL 9 CIS-hardened v2026.04.2 was promoted to global catalog; downstream tenant catalogs will sync on the next window.',
    },
    {
      id: 'pa-4',
      area: 'Infrastructure',
      labelColor: 'teal',
      timeLabel: '4 hr ago',
      title: 'East region hypervisor maintenance closed',
      detail:
        'Rolling kernel updates finished with zero customer-visible incidents; capacity tags were restored on affected clusters.',
    },
    {
      id: 'pa-5',
      area: 'Tenant organizations',
      labelColor: 'blue',
      timeLabel: '6 hr ago',
      title: 'Bluestone Financial Group onboarding checklist',
      detail:
        'Identity federation and quota baselines were signed off; the tenant admin workspace is ready for first operator logins.',
    },
    {
      id: 'pa-6',
      area: 'Infrastructure',
      labelColor: 'green',
      timeLabel: 'Yesterday',
      title: 'Backup vault replication lag cleared',
      detail:
        'Object storage replication for cross-region vaults returned under the 15 minute SLO after a transient WAN event.',
    },
    {
      id: 'pa-7',
      area: 'Global templates',
      labelColor: 'purple',
      timeLabel: 'Yesterday',
      title: 'GPU workload image deprecated',
      detail:
        'CUDA 11.8 training image reached end-of-support; remaining references were flagged in two tenant catalogs.',
    },
    {
      id: 'pa-8',
      area: 'Resource allocation',
      labelColor: 'orange',
      timeLabel: '2 days ago',
      title: 'Annual contract uplift applied',
      detail:
        'Northstar and Bluestone memory and storage entitlements were updated per renewed platform agreements.',
    },
  ]
}
