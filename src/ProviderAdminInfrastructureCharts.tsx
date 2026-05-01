import type { CSSProperties } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  VM_UTILIZATION_CHART_AXIS_TICK,
  VM_UTILIZATION_CHART_AXIS_TICK_ON_LIGHT,
  VM_UTILIZATION_CHART_GRID_STROKE,
  VM_UTILIZATION_CHART_GRID_STROKE_ON_LIGHT,
  VM_UTILIZATION_CHART_STROKES,
} from './dashboardVmUtilizationDemo'

const BRAND_BAR = VM_UTILIZATION_CHART_STROKES.cpu
const PIE_COLORS = [VM_UTILIZATION_CHART_STROKES.cpu, VM_UTILIZATION_CHART_STROKES.memory, '#a654c9'] as const

function chartTooltipStyle(_isDarkTheme: boolean): CSSProperties {
  return {
    padding: 'var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)',
    background: 'var(--pf-t--global--background--color--primary--default)',
    border: '1px solid var(--pf-t--global--border--color--default)',
    borderRadius: 'var(--pf-t--global--border--radius--medium)',
    fontSize: 'var(--pf-t--global--font--size--body--sm)',
    boxShadow: 'var(--pf-t--global--box-shadow--md)',
    color: 'var(--pf-t--global--text--color--regular)',
  }
}

export function InfraComputeUtilizationBarChart({
  isDarkTheme,
}: {
  isDarkTheme: boolean
}) {
  const data = [
    {
      label: 'vCPU',
      pct: Math.round((28560 / 40000) * 1000) / 10,
      detail: '28,560 / 40,000 cores',
    },
    {
      label: 'RAM',
      pct: Math.round((142 / 200) * 1000) / 10,
      detail: '142 / 200 TB',
    },
    {
      label: 'Storage',
      pct: Math.round((3.2 / 4.5) * 1000) / 10,
      detail: '3.2 / 4.5 PB',
    },
  ]

  const tickFill = isDarkTheme ? VM_UTILIZATION_CHART_AXIS_TICK : VM_UTILIZATION_CHART_AXIS_TICK_ON_LIGHT
  const gridStroke = isDarkTheme ? VM_UTILIZATION_CHART_GRID_STROKE : VM_UTILIZATION_CHART_GRID_STROKE_ON_LIGHT
  const axisTick = { fill: tickFill, fontSize: 11 }

  return (
    <div
      className="provider-admin-infra-chart provider-admin-infra-chart--compute"
      role="img"
      aria-label="Compute quota utilization by resource type, percent of allocated capacity"
    >
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 400, height: 260 }}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="18%">
          <CartesianGrid stroke={gridStroke} strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="label"
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: gridStroke }}
            tickMargin={4}
            height={28}
          />
          <YAxis
            domain={[0, 100]}
            width={36}
            tickFormatter={(v) => `${v}%`}
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: gridStroke }}
          />
          <Tooltip
            cursor={false}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const row = payload[0].payload as (typeof data)[0]
              return (
                <div style={chartTooltipStyle(isDarkTheme)}>
                  <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{row.label}</div>
                  <div style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>{row.pct}% utilized</div>
                  <div style={{ marginTop: 4, fontSize: 'var(--pf-t--global--font--size--body--sm)' }}>{row.detail}</div>
                </div>
              )
            }}
          />
          <Bar dataKey="pct" name="Utilization" radius={[6, 6, 0, 0]} isAnimationActive={false}>
            {data.map((_, i) => (
              <Cell key={i} fill={BRAND_BAR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function InfraAiGpuAllocationDonut({ isDarkTheme }: { isDarkTheme: boolean }) {
  const data = [
    { name: 'NVIDIA A100', value: 132, detail: '132 / 180 provisioned' },
    { name: 'NVIDIA H100', value: 68, detail: '68 / 100 provisioned' },
    { name: 'NVLink clusters', value: 12, detail: '12 / 16 active' },
  ]

  return (
    <div
      className="provider-admin-infra-chart provider-admin-infra-chart--aiml"
      role="group"
      aria-label="AI and ML accelerator allocation mix across fleet categories"
    >
      {/*
        Recharts <Legend align="right"> pins to the far edge of the *full* chart width, while the pie uses cx as a
        fraction of that width — on wide cards the gap looks broken. Use a narrow SVG + HTML legend in a flex row.
      */}
      <div className="provider-admin-infra-aiml-donut-row">
        <div className="provider-admin-infra-aiml-donut-chart-wrap">
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 240, height: 260 }}>
            <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="72%"
                outerRadius="86%"
                paddingAngle={2}
                isAnimationActive={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const row = payload[0].payload as (typeof data)[0]
                  return (
                    <div style={chartTooltipStyle(isDarkTheme)}>
                      <div style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>{row.name}</div>
                      <div>{row.value} units</div>
                      <div style={{ marginTop: 4, color: 'var(--pf-t--global--text--color--subtle)', fontSize: 12 }}>
                        {row.detail}
                      </div>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="provider-admin-infra-aiml-legend" aria-label="Accelerator categories">
          {data.map((d, i) => (
            <li key={d.name} className="provider-admin-infra-aiml-legend__item">
              <span
                className="provider-admin-infra-aiml-legend__swatch"
                style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                aria-hidden
              />
              <span>{d.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
