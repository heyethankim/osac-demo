import { useMemo } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  Label,
  Title,
} from '@patternfly/react-core'
import { DashboardVmQuotaSection } from './DashboardVmQuotaSection'
import type { DemoTenantId } from './demoTenant'
import type { TenantVirtualMachine } from './TenantVirtualMachinesPage'
import { buildTenantAdminRecentActivities } from './tenantAdminRecentActivitiesDemo'
import { getTenantAdminProjectRows } from './tenantAdminProjectsDemo'

export type TenantAdminDashboardNavTarget = 'projects' | 'users' | 'networks' | 'storage' | 'templates'

export type TenantAdminDashboardPageProps = {
  demoTenantId: DemoTenantId
  fleetVirtualMachines: readonly TenantVirtualMachine[]
  isDarkTheme: boolean
  onNavigateToTenantAdmin: (target: TenantAdminDashboardNavTarget) => void
}

/** Illustrative KPIs for tenant admin overview (demo only). */
const TENANT_DASHBOARD_METRICS: Record<
  DemoTenantId,
  { activeUsers: number; networkSegments: number; storagePools: number; activeTemplates: number }
> = {
  northstar: { activeUsers: 48, networkSegments: 14, storagePools: 8, activeTemplates: 24 },
  evergreen: { activeUsers: 36, networkSegments: 11, storagePools: 6, activeTemplates: 18 },
  vertexa: { activeUsers: 12, networkSegments: 5, storagePools: 3, activeTemplates: 9 },
}

const KPI_CARD_BODY_STYLE = { paddingTop: 'var(--pf-t--global--spacer--sm)' } as const

/** Match tenant user dashboard VM stat card caption (`App.tsx` captionStyle). */
const KPI_CARD_HINT_STYLE = {
  margin: 'var(--pf-t--global--spacer--sm) 0 0',
  color: 'var(--pf-t--global--text--color--subtle)',
  fontSize: 'var(--pf-t--global--font--size--body--sm)',
  lineHeight: 'var(--pf-t--global--font--line-height--body)',
} as const

/** Tenant admin — organization overview (demo metrics). */
export function TenantAdminDashboardPage({
  demoTenantId,
  fleetVirtualMachines,
  isDarkTheme,
  onNavigateToTenantAdmin,
}: TenantAdminDashboardPageProps) {
  const m = TENANT_DASHBOARD_METRICS[demoTenantId]
  const activeProjectsCount = useMemo(
    () => getTenantAdminProjectRows(demoTenantId).filter((p) => p.status === 'Active').length,
    [demoTenantId],
  )
  const recentActivities = useMemo(
    () => buildTenantAdminRecentActivities(demoTenantId).slice(0, 7),
    [demoTenantId],
  )

  const cards = [
    {
      title: 'Active projects',
      value: activeProjectsCount,
      hint: 'Projects in Active health state',
      nav: 'projects' as const,
      navLabel: 'Projects',
    },
    {
      title: 'Network segments',
      value: m.networkSegments,
      hint: 'Logical segments available for workload placement',
      nav: 'networks' as const,
      navLabel: 'Networks',
    },
    {
      title: 'Storage pools',
      value: m.storagePools,
      hint: 'Aggregated capacity pools attached to the tenant',
      nav: 'storage' as const,
      navLabel: 'Storage',
    },
    {
      title: 'Active templates',
      value: m.activeTemplates,
      hint: 'Published images and service definitions',
      nav: 'templates' as const,
      navLabel: 'VM templates',
    },
    {
      title: 'Active users',
      value: m.activeUsers,
      hint: 'Accounts with sign-in access this period',
      nav: 'users' as const,
      navLabel: 'Users',
    },
  ] as const

  return (
    <div className="osac-tenant-admin-page">
      <div className="osac-dashboard-vm-stats-grid osac-dashboard-vm-stats-grid--five-cols">
        {cards.map(({ title, value, hint, nav, navLabel }) => (
          <Card
            key={title}
            component="article"
            isFullHeight
            isClickable
            className="tenant-admin-dashboard-kpi-card"
          >
            <CardHeader
              selectableActions={{
                onClickAction: () => onNavigateToTenantAdmin(nav),
                selectableActionAriaLabel: `${title}, ${value}. Open ${navLabel}`,
              }}
            >
              <CardTitle component="h2">{title}</CardTitle>
            </CardHeader>
            <CardBody style={KPI_CARD_BODY_STYLE}>
              <Title
                headingLevel="h3"
                size="4xl"
                className="osac-dashboard-clickable-kpi-value"
                style={{
                  margin: 0,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {value}
              </Title>
              <Content component="p" style={KPI_CARD_HINT_STYLE}>
                {hint}
              </Content>
            </CardBody>
          </Card>
        ))}
      </div>

      <section
        className="osac-dashboard-utilization-section"
        aria-label="Resource quota usage and recent activities"
      >
        <div className="osac-dashboard-utilization-layout">
          <div className="osac-dashboard-utilization-main">
            <div className="tenant-admin-dashboard-quota">
              <DashboardVmQuotaSection
                isDarkTheme={isDarkTheme}
                fleetVirtualMachines={fleetVirtualMachines}
                title="Resource quota usage"
                resourceBlockLayout
                compactTopSpacing
              />
            </div>
          </div>

          <aside
            className="osac-dashboard-utilization-sidebar"
            aria-labelledby="tenant-admin-recent-activities-heading"
          >
            <Card
              className="tenant-admin-recent-activities osac-dashboard-recent-activity-card"
              component="section"
              aria-labelledby="tenant-admin-recent-activities-heading"
              isFullHeight
            >
              <CardHeader>
                <CardTitle component="h2" id="tenant-admin-recent-activities-heading">
                  Recent activities
                </CardTitle>
              </CardHeader>
              <CardBody className="osac-dashboard-recent-activity-body">
                <ul className="osac-dashboard-recent-activity-list">
                  {recentActivities.map((item) => (
                    <li key={item.id} className="osac-dashboard-recent-activity-item">
                      <div className="osac-dashboard-recent-activity-item__meta">
                        <Label
                          isCompact
                          color={item.labelColor}
                          className="osac-dashboard-recent-activity-item__status"
                        >
                          {item.area}
                        </Label>
                        <span className="osac-dashboard-recent-activity-item__time">{item.timeLabel}</span>
                      </div>
                      <Content
                        component="p"
                        style={{
                          margin: 'var(--pf-t--global--spacer--xs) 0 0',
                          fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                          fontSize: 'var(--pf-t--global--font--size--body--default)',
                        }}
                      >
                        {item.title}
                      </Content>
                      <Content
                        component="p"
                        style={{
                          margin: 'var(--pf-t--global--spacer--xs) 0 0',
                          fontSize: 'var(--pf-t--global--font--size--body--sm)',
                          color: 'var(--pf-t--global--text--color--subtle)',
                        }}
                      >
                        {item.detail}
                      </Content>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  )
}
