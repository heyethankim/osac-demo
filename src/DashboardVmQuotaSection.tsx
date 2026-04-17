import { useId, useMemo } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Content, Title } from '@patternfly/react-core'
import type { DemoTenantId } from './demoTenant'
import { buildDashboardVmQuotaMetrics } from './dashboardVmQuotaDemo'
import type { TenantVirtualMachine } from './TenantVirtualMachinesPage'
import { VmQuotaDonut } from './VmQuotaDonut'

export type DashboardVmQuotaSectionProps = {
  isDarkTheme: boolean
  fleetVirtualMachines: readonly TenantVirtualMachine[]
  /** Visible section title (default matches the user VM dashboard). */
  title?: string
  /** When set, shows utilization % above the donut and availability below it. */
  showUsageBreakdown?: boolean
  /** Optional lede under the title (e.g. tenant admin context). */
  description?: string
  /**
   * `two-by-two`: CPU and Memory on the first row, GPU and Storage on the second (metrics stay in that order).
   * `default`: responsive row of up to four columns.
   */
  quotaGridLayout?: 'default' | 'two-by-two'
  /** Use when the section sits directly under other content (drops extra top margin). */
  compactTopSpacing?: boolean
  /**
   * Tenant user dashboard only: scope quota to that persona’s VMs and apply per-bank utilization shaping
   * (Jordan Lee / Marcus Chen).
   */
  tenantUserPersona?: Extract<DemoTenantId, 'northstar' | 'evergreen'>
}

export function DashboardVmQuotaSection({
  isDarkTheme,
  fleetVirtualMachines,
  title = 'Resource quota',
  showUsageBreakdown = false,
  description,
  quotaGridLayout = 'default',
  compactTopSpacing = false,
  tenantUserPersona,
}: DashboardVmQuotaSectionProps) {
  const headingId = useId()
  const metrics = useMemo(
    () =>
      buildDashboardVmQuotaMetrics(
        fleetVirtualMachines,
        tenantUserPersona ? { tenantUserPersona } : undefined,
      ),
    [fleetVirtualMachines, tenantUserPersona],
  )

  const sectionClass =
    'osac-dashboard-quota-section' +
    (compactTopSpacing ? ' osac-dashboard-quota-section--compact-top' : '')
  const gridClass =
    'osac-dashboard-quota-grid' +
    (quotaGridLayout === 'two-by-two' ? ' osac-dashboard-quota-grid--two-by-two' : '')

  return (
    <section className={sectionClass} aria-labelledby={headingId}>
      <div className="osac-dashboard-quota-intro">
        <Title headingLevel="h2" size="xl" id={headingId} style={{ margin: 0 }}>
          {title}
        </Title>
        {description ? (
          <Content
            component="p"
            style={{
              margin: 'var(--pf-t--global--spacer--sm) 0 0',
              maxWidth: '48rem',
              color: 'var(--pf-t--global--text--color--subtle)',
            }}
          >
            {description}
          </Content>
        ) : null}
      </div>
      <div className={gridClass}>
        {metrics.map((m) => {
          const pctRounded = m.limit > 0 ? Math.round((m.used / m.limit) * 100) : 0
          const available = Math.max(0, m.limit - m.used)
          const availStr = m.formatUsed(available)
          return (
            <Card key={m.key} className="osac-dashboard-quota-card" component="article">
              <CardHeader>
                <CardTitle component="h3">{m.title}</CardTitle>
              </CardHeader>
              <CardBody
                className={
                  showUsageBreakdown
                    ? 'osac-dashboard-quota-card__body osac-dashboard-quota-card__body--usage'
                    : 'osac-dashboard-quota-card__body'
                }
              >
                {showUsageBreakdown ? (
                  <div
                    className="osac-dashboard-quota-card__allocation-pct"
                    aria-label={`${pctRounded} percent in use`}
                  >
                    <span className="osac-dashboard-quota-card__allocation-pct-value">{pctRounded}%</span>
                  </div>
                ) : null}
                <VmQuotaDonut metric={m} isDarkTheme={isDarkTheme} />
                {showUsageBreakdown ? (
                  <div className="osac-dashboard-quota-card__availability">
                    {availStr} {m.unit} available
                  </div>
                ) : null}
              </CardBody>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
