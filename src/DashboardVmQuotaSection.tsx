import { useMemo } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Title } from '@patternfly/react-core'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { buildDashboardVmQuotaMetrics, type VmQuotaMetric } from './dashboardVmQuotaDemo'
import { VM_UTILIZATION_CHART_GRID_STROKE } from './dashboardVmUtilizationDemo'

/** Hex for SVG fills (Recharts); matches PF danger tone on dark dashboards. */
const OVER_QUOTA_FILL = '#fa4616'

/** Visible “remaining quota” ring on light cards (matches html[data-osac-theme=light] CSS). */
const QUOTA_UNUSED_FILL_LIGHT = '#c7c7c7'

function QuotaDonut({
  metric,
  isDarkTheme,
}: {
  metric: VmQuotaMetric
  isDarkTheme: boolean
}) {
  const { used, limit, stroke } = metric
  const over = used > limit
  const filled = Math.min(used, limit)
  const remainder = Math.max(0, limit - filled)
  const data = [
    { name: 'used', value: filled },
    { name: 'available', value: remainder },
  ]
  const fillUsed = over ? OVER_QUOTA_FILL : stroke
  const fillAvail = isDarkTheme ? VM_UTILIZATION_CHART_GRID_STROKE : QUOTA_UNUSED_FILL_LIGHT

  const usedStr = metric.formatUsed(used)
  const limitStr = metric.formatLimit(limit)

  return (
    <div
      className="osac-dashboard-quota-donut"
      role="img"
      aria-label={`${metric.title}: ${usedStr} out of ${limitStr} ${metric.unit} allocated`}
    >
      <div className="osac-dashboard-quota-donut__chart">
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 224, height: 224 }}
        >
          <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="88%"
              outerRadius="96%"
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill={fillUsed} />
              <Cell fill={fillAvail} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="osac-dashboard-quota-donut__center">
        <span className="osac-dashboard-quota-donut__fraction">
          <span className={over ? 'osac-dashboard-quota-donut__used--over' : undefined}>{usedStr}</span>
          <span className="osac-dashboard-quota-donut__sep"> / </span>
          <span>{limitStr}</span>
        </span>
        <span className="osac-dashboard-quota-donut__unit">{metric.unit}</span>
      </div>
    </div>
  )
}

export function DashboardVmQuotaSection({ isDarkTheme }: { isDarkTheme: boolean }) {
  const metrics = useMemo(() => buildDashboardVmQuotaMetrics(), [])

  return (
    <section className="osac-dashboard-quota-section" aria-labelledby="osac-dashboard-quota-heading">
      <div className="osac-dashboard-quota-intro">
        <Title headingLevel="h2" size="xl" id="osac-dashboard-quota-heading" style={{ margin: 0 }}>
          Resource quota
        </Title>
      </div>
      <div className="osac-dashboard-quota-grid">
        {metrics.map((m) => (
          <Card key={m.key} className="osac-dashboard-quota-card" component="article">
            <CardHeader>
              <CardTitle component="h3">{m.title}</CardTitle>
            </CardHeader>
            <CardBody className="osac-dashboard-quota-card__body">
              <QuotaDonut metric={m} isDarkTheme={isDarkTheme} />
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  )
}
