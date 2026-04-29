import type { ComponentType, CSSProperties } from 'react'
import { useId, useMemo } from 'react'
import { BoltIcon } from '@patternfly/react-icons/dist/esm/icons/bolt-icon'
import { ClusterIcon } from '@patternfly/react-icons/dist/esm/icons/cluster-icon'
import { MemoryIcon } from '@patternfly/react-icons/dist/esm/icons/memory-icon'
import { ModuleIcon } from '@patternfly/react-icons/dist/esm/icons/module-icon'
import { StorageDomainIcon } from '@patternfly/react-icons/dist/esm/icons/storage-domain-icon'
import { Card, CardBody, CardHeader, CardTitle, Content, Title } from '@patternfly/react-core'
import type { DemoTenantId } from './demoTenant'
import { buildDashboardVmQuotaMetrics, type VmQuotaMetric, type VmQuotaMetricKey } from './dashboardVmQuotaDemo'
import type { TenantVirtualMachine } from './TenantVirtualMachinesPage'
import { VmQuotaDonut } from './VmQuotaDonut'

export type DashboardVmQuotaSectionProps = {
  isDarkTheme: boolean
  fleetVirtualMachines: readonly TenantVirtualMachine[]
  /** Visible section title (default matches the user VM dashboard). */
  title?: string
  /** When set, shows utilization % above the donut and availability below it (classic layout). */
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
   * (Chris Morgan / Emerson Cruz).
   */
  tenantUserPersona?: Extract<DemoTenantId, 'northstar' | 'evergreen'>
  /**
   * Tenant admin: rich “resource” cards (icon + headline, %, donut, available strip, allocated / in use / available / utilization).
   * Uses the same VM utilization stroke palette; adds an AI instances card (accent = memory stroke).
   */
  resourceBlockLayout?: boolean
}

type QuotaIcon = ComponentType<{ className?: string; style?: CSSProperties }>

const RESOURCE_BLOCK_COPY: Record<
  VmQuotaMetricKey,
  {
    headline: string
    subtitle: string
  }
> = {
  cpu: { headline: 'vCPU Resources', subtitle: 'vCPU Cores' },
  memory: { headline: 'Memory Resources', subtitle: 'RAM Memory' },
  storage: { headline: 'Storage Resources', subtitle: 'Disk Storage' },
  gpu: { headline: 'GPU Resources', subtitle: 'GPU Units' },
  ai: { headline: 'AI Instance Resources', subtitle: 'AI Instances' },
}

const RESOURCE_BLOCK_ICONS: Record<VmQuotaMetricKey, QuotaIcon> = {
  cpu: ClusterIcon,
  memory: MemoryIcon,
  storage: StorageDomainIcon,
  gpu: BoltIcon,
  ai: ModuleIcon,
}

function quotaUtilizationPctOneDecimal(used: number, limit: number): string {
  if (limit <= 0) return '0.0'
  return ((used / limit) * 100).toFixed(1)
}

function ResourceQuotaBlockCard({
  m,
  isDarkTheme,
}: {
  m: VmQuotaMetric
  isDarkTheme: boolean
}) {
  const copy = RESOURCE_BLOCK_COPY[m.key]
  const Icon = RESOURCE_BLOCK_ICONS[m.key]
  const pctStr = quotaUtilizationPctOneDecimal(m.used, m.limit)
  const available = Math.max(0, m.limit - m.used)
  const availStr = m.formatUsed(available)
  const usedStr = m.formatUsed(m.used)
  const limitStr = m.formatLimit(m.limit)
  const over = m.used > m.limit

  return (
    <Card className="osac-dashboard-quota-card osac-dashboard-quota-card--resource-block" component="article">
      <CardBody className="osac-dashboard-quota-resource-block">
        <div className="osac-dashboard-quota-resource-block__header">
          <span
            className="osac-dashboard-quota-resource-block__icon-wrap"
            style={{
              color: m.stroke,
              background: `color-mix(in srgb, ${m.stroke} 14%, transparent)`,
            }}
            aria-hidden
          >
            <Icon className="osac-dashboard-quota-resource-block__icon" />
          </span>
          <h3 className="osac-dashboard-quota-resource-block__resource-title">{copy.headline}</h3>
        </div>
        <div className="osac-dashboard-quota-resource-block__pct" aria-label={`${pctStr} percent utilized`}>
          {pctStr}%
        </div>
        <div className="osac-dashboard-quota-resource-block__subtitle">{copy.subtitle}</div>
        <VmQuotaDonut metric={m} isDarkTheme={isDarkTheme} variant="resource-block" />
        <div className="osac-dashboard-quota-resource-block__available-row">
          <span className="osac-dashboard-quota-resource-block__available-label">Available</span>
          <span className="osac-dashboard-quota-resource-block__available-value">
            {availStr} {m.unit}
          </span>
        </div>
        <hr className="osac-dashboard-quota-resource-block__divider" />
        <dl className="osac-dashboard-quota-resource-block__stats">
          <div className="osac-dashboard-quota-resource-block__stat">
            <dt>Allocated</dt>
            <dd>
              {limitStr} {m.unit}
            </dd>
          </div>
          <div className="osac-dashboard-quota-resource-block__stat">
            <dt>In use</dt>
            <dd
              className={
                over
                  ? 'osac-dashboard-quota-resource-block__stat-value osac-dashboard-quota-resource-block__stat-value--danger'
                  : 'osac-dashboard-quota-resource-block__stat-value osac-dashboard-quota-resource-block__stat-value--accent'
              }
              style={!over ? { color: m.stroke } : undefined}
            >
              {usedStr} {m.unit}
            </dd>
          </div>
          <div className="osac-dashboard-quota-resource-block__stat">
            <dt>Available</dt>
            <dd className="osac-dashboard-quota-resource-block__stat-value osac-dashboard-quota-resource-block__stat-value--success">
              {availStr} {m.unit}
            </dd>
          </div>
          <div className="osac-dashboard-quota-resource-block__stat">
            <dt>Utilization</dt>
            <dd
              className={
                over
                  ? 'osac-dashboard-quota-resource-block__stat-value osac-dashboard-quota-resource-block__stat-value--danger'
                  : 'osac-dashboard-quota-resource-block__stat-value'
              }
              style={!over ? { color: m.stroke } : undefined}
            >
              {pctStr}%
            </dd>
          </div>
        </dl>
      </CardBody>
    </Card>
  )
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
  resourceBlockLayout = false,
}: DashboardVmQuotaSectionProps) {
  const headingId = useId()
  const metrics = useMemo(
    () =>
      buildDashboardVmQuotaMetrics(fleetVirtualMachines, {
        ...(tenantUserPersona ? { tenantUserPersona } : {}),
        ...(resourceBlockLayout ? { includeAiInstances: true } : {}),
      }),
    [fleetVirtualMachines, tenantUserPersona, resourceBlockLayout],
  )

  const sectionClass =
    'osac-dashboard-quota-section' +
    (compactTopSpacing ? ' osac-dashboard-quota-section--compact-top' : '')
  const gridClass = resourceBlockLayout
    ? 'osac-dashboard-quota-grid osac-dashboard-quota-grid--resource-blocks'
    : 'osac-dashboard-quota-grid' +
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
        {resourceBlockLayout
          ? metrics.map((m) => (
              <ResourceQuotaBlockCard key={m.key} m={m} isDarkTheme={isDarkTheme} />
            ))
          : metrics.map((m) => {
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
