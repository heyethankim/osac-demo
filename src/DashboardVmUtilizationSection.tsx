import { useMemo, useState } from 'react'
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  Label,
  MenuToggle,
  Title,
} from '@patternfly/react-core'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  buildDashboardVmRecentActivitiesPreview,
  type VmRecentActivitySeverity,
} from './dashboardVmRecentActivities'
import {
  buildVmUtilizationDemoData,
  periodLabel,
  VM_UTILIZATION_CHART_AXIS_TICK,
  VM_UTILIZATION_CHART_AXIS_TICK_ON_LIGHT,
  VM_UTILIZATION_CHART_GRID_STROKE,
  VM_UTILIZATION_CHART_GRID_STROKE_ON_LIGHT,
  VM_UTILIZATION_CHART_STROKES,
  VM_UTILIZATION_PERIOD_OPTIONS,
  type VmUtilizationPeriod,
} from './dashboardVmUtilizationDemo'

const RECENT_ACTIVITY_STATUS_LABELS: Record<VmRecentActivitySeverity, string> = {
  success: 'Success',
  warning: 'Warning',
  danger: 'Critical',
}

function recentActivityStatusLabel(severity: VmRecentActivitySeverity): string {
  return RECENT_ACTIVITY_STATUS_LABELS[severity]
}

const METRICS = [
  {
    key: 'cpu',
    title: 'CPU usage',
    subtitle: 'vCPU-weighted utilization across running VMs from your fleet',
    dataKey: 'cpu' as const,
    stroke: VM_UTILIZATION_CHART_STROKES.cpu,
  },
  {
    key: 'memory',
    title: 'Memory usage',
    subtitle: 'GiB-weighted memory pressure for running VMs',
    dataKey: 'memory' as const,
    stroke: VM_UTILIZATION_CHART_STROKES.memory,
  },
  {
    key: 'gpu',
    title: 'GPU usage',
    subtitle: 'Accelerator load for GPU-style workloads (e.g. ML / HPC VMs)',
    dataKey: 'gpu' as const,
    stroke: VM_UTILIZATION_CHART_STROKES.gpu,
  },
  {
    key: 'storage',
    title: 'Storage usage',
    subtitle: 'Pool utilization derived from all VMs’ disk footprint',
    dataKey: 'storage' as const,
    stroke: VM_UTILIZATION_CHART_STROKES.storage,
  },
] as const

function UtilizationTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean
  payload?: { value: number; name?: string }[]
  label?: string
  unit: string
}) {
  if (!active || !payload?.length) return null
  const v = payload[0]?.value
  return (
    <div
      style={{
        padding: 'var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)',
        background: 'var(--pf-t--global--background--color--primary--default)',
        border: `1px solid var(--pf-t--global--border--color--default)`,
        borderRadius: 'var(--pf-t--global--border--radius--medium)',
        fontSize: 'var(--pf-t--global--font--size--body--sm)',
        boxShadow: 'var(--pf-t--global--box-shadow--md)',
      }}
    >
      <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{label}</div>
      <div style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>
        {v}
        {unit}
      </div>
    </div>
  )
}

export function DashboardVmUtilizationSection({
  isDarkTheme,
  onOpenRecentActivities,
}: {
  isDarkTheme: boolean
  onOpenRecentActivities: () => void
}) {
  const [period, setPeriod] = useState<VmUtilizationPeriod>('7d')
  const [periodMenuOpen, setPeriodMenuOpen] = useState(false)

  const data = useMemo(() => buildVmUtilizationDemoData(period), [period])
  const activities = useMemo(() => buildDashboardVmRecentActivitiesPreview(6), [])

  const tickFill = isDarkTheme
    ? VM_UTILIZATION_CHART_AXIS_TICK
    : VM_UTILIZATION_CHART_AXIS_TICK_ON_LIGHT
  const gridStroke = isDarkTheme
    ? VM_UTILIZATION_CHART_GRID_STROKE
    : VM_UTILIZATION_CHART_GRID_STROKE_ON_LIGHT

  const axisTick = {
    fill: tickFill,
    fontSize: 11,
  }

  return (
    <section
      className="osac-dashboard-utilization-section"
      aria-label="VM utilization trends and recent activities"
    >
      <div className="osac-dashboard-utilization-layout">
        <div className="osac-dashboard-utilization-main">
          <div className="osac-dashboard-utilization-charts-header">
            <Title
              headingLevel="h2"
              size="xl"
              id="osac-dashboard-utilization-heading"
              style={{ margin: 0 }}
            >
              VM utilization trends
            </Title>
            <Dropdown
              isOpen={periodMenuOpen}
              onOpenChange={setPeriodMenuOpen}
              onSelect={() => setPeriodMenuOpen(false)}
              popperProps={{ placement: 'bottom-end' }}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  className="osac-dashboard-utilization-period-toggle"
                  icon={<FilterIcon />}
                  isExpanded={periodMenuOpen}
                  onClick={() => setPeriodMenuOpen((o) => !o)}
                  aria-label="Time period for utilization charts"
                >
                  {periodLabel(period)}
                </MenuToggle>
              )}
            >
              <DropdownList>
                {VM_UTILIZATION_PERIOD_OPTIONS.map((opt) => (
                  <DropdownItem
                    key={opt.value}
                    isSelected={period === opt.value}
                    onClick={() => {
                      setPeriod(opt.value)
                      setPeriodMenuOpen(false)
                    }}
                  >
                    {opt.label}
                  </DropdownItem>
                ))}
              </DropdownList>
            </Dropdown>
          </div>

          <div className="osac-dashboard-utilization-grid">
            {METRICS.map((m) => (
              <Card key={m.key} className="osac-dashboard-utilization-card" component="article">
                <CardHeader>
                  <CardTitle component="h3">{m.title}</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: 0 }}>
                  <Content
                    component="p"
                    style={{
                      margin: '0 0 var(--pf-t--global--spacer--sm)',
                      fontSize: 'var(--pf-t--global--font--size--body--sm)',
                      color: 'var(--pf-t--global--text--color--subtle)',
                    }}
                  >
                    {m.subtitle}
                  </Content>
                  <div
                    className="osac-dashboard-utilization-chart"
                    style={{ width: '100%', height: 220 }}
                    role="img"
                    aria-label={`${m.title} line chart for ${periodLabel(period)}, percent over time`}
                  >
                    <ResponsiveContainer
                      width="100%"
                      height={220}
                      initialDimension={{ width: 800, height: 220 }}
                    >
                      <LineChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 10 }}>
                        <CartesianGrid stroke={gridStroke} strokeDasharray="4 4" vertical={false} />
                        <XAxis
                          dataKey="label"
                          stroke={tickFill}
                          tick={axisTick}
                          tickLine={false}
                          axisLine={{ stroke: gridStroke }}
                          interval="preserveStartEnd"
                          minTickGap={8}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tickFormatter={(v) => `${v}%`}
                          width={44}
                          stroke={tickFill}
                          tick={axisTick}
                          tickLine={false}
                          axisLine={{ stroke: gridStroke }}
                        />
                        <Tooltip content={<UtilizationTooltip unit="%" />} />
                        <Line
                          type="monotone"
                          dataKey={m.dataKey}
                          name={m.title}
                          stroke={m.stroke}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        <aside
          className="osac-dashboard-utilization-sidebar"
          aria-labelledby="osac-dashboard-recent-activity-heading"
        >
          <Card
            isFullHeight
            isClickable
            className="osac-dashboard-recent-activity-card"
            component="aside"
          >
            <CardHeader
              selectableActions={{
                onClickAction: onOpenRecentActivities,
                selectableActionAriaLabel:
                  'Open recent activities — full page with detailed event information',
              }}
            >
              <CardTitle component="h2" id="osac-dashboard-recent-activity-heading">
                Recent activities
              </CardTitle>
            </CardHeader>
            <CardBody className="osac-dashboard-recent-activity-body">
              <ul className="osac-dashboard-recent-activity-list">
                {activities.map((item) => (
                  <li
                    key={item.id}
                    className="osac-dashboard-recent-activity-item"
                    aria-label={`${recentActivityStatusLabel(item.severity)}: ${item.title}`}
                  >
                    <div className="osac-dashboard-recent-activity-item__meta">
                      <Label
                        status={item.severity}
                        variant="outline"
                        isCompact
                        className="osac-dashboard-recent-activity-item__status"
                      >
                        {recentActivityStatusLabel(item.severity)}
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
  )
}
