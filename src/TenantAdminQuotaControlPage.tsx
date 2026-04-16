import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  AlertVariant,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  TextInput,
  Title,
} from '@patternfly/react-core'
import tableStyles from '@patternfly/react-styles/css/components/Table/table'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
import type { DemoTenantId } from './demoTenant'
import {
  buildOrgQuotaBarsFromUsers,
  buildUserQuotaDistributionRows,
  formatStorTb,
  type OrgQuotaBarRow,
  type UserQuotaDistributionRow,
} from './tenantAdminQuotaDemo'
import { getTenantAdminUserRowsForTenant } from './TenantAdminUserManagementPage'
import type { TenantVirtualMachine } from './TenantVirtualMachinesPage'

export type TenantAdminQuotaControlPageProps = {
  demoTenantId: DemoTenantId
  isDarkTheme: boolean
  fleetVirtualMachines: readonly TenantVirtualMachine[]
}

type OrgQuotaPctRow = OrgQuotaBarRow & { usedPct: number; headroomPct: number }

type QuotaLimitDraft = { vcpu: string; memGiB: string; gpu: string; storTb: string }

const ORG_USED_FILL = VM_UTILIZATION_CHART_STROKES.cpu
const ORG_HEADROOM_FILL_LIGHT = '#c7c7c7'

function formatOrgNumber(row: OrgQuotaBarRow, value: number): string {
  if (row.name.startsWith('Storage')) return formatStorTb(value)
  if (row.name.startsWith('Memory')) return String(Math.round(value))
  return String(Math.round(value))
}

function OrgQuotaTooltip({ active, payload }: { active?: boolean; payload?: { payload?: OrgQuotaPctRow }[] }) {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload
  if (!row) return null
  return (
    <div
      className="tenant-admin-quota-chart-tooltip"
      style={{
        padding: 'var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)',
        background: 'var(--pf-t--global--background--color--primary--default)',
        border: '1px solid var(--pf-t--global--border--color--default)',
        borderRadius: 'var(--pf-t--global--border--radius--medium)',
        fontSize: 'var(--pf-t--global--font--size--body--sm)',
      }}
    >
      <strong>{row.name}</strong>
      <div style={{ marginTop: '0.25rem' }}>
        {formatOrgNumber(row, row.used)} used · {formatOrgNumber(row, row.limit)} limit ({row.unit})
      </div>
      <div style={{ marginTop: '0.25rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
        Bar length is normalized to 100% of the summed per-user allocation for this resource.
      </div>
    </div>
  )
}

function UserQuotaTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload?: UserQuotaDistributionRow }[]
}) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div
      className="tenant-admin-quota-chart-tooltip"
      style={{
        padding: 'var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)',
        background: 'var(--pf-t--global--background--color--primary--default)',
        border: '1px solid var(--pf-t--global--border--color--default)',
        borderRadius: 'var(--pf-t--global--border--radius--medium)',
        fontSize: 'var(--pf-t--global--font--size--body--sm)',
      }}
    >
      <strong>{d.displayName}</strong>
      <div style={{ marginTop: '0.35rem' }}>
        vCPU {d.vcpuUsed}/{d.vcpuAlloc} ({d.vcpuPct}% of personal cap)
      </div>
      <div>
        Memory {d.memUsedGiB}/{d.memAllocGiB} GiB ({d.memPct}%)
      </div>
      <div>
        GPU {d.gpuUsed}/{d.gpuAlloc} ({d.gpuPct}%)
      </div>
      <div>
        Storage {formatStorTb(d.storUsedTb)}/{formatStorTb(d.storAllocTb)} TB ({d.storPct}%)
      </div>
    </div>
  )
}

/** Tenant admin — quota overview, distribution, and per-user caps (demo). */
export function TenantAdminQuotaControlPage({
  demoTenantId,
  isDarkTheme,
  fleetVirtualMachines: _fleetVirtualMachines,
}: TenantAdminQuotaControlPageProps) {
  const rows = useMemo(() => getTenantAdminUserRowsForTenant(demoTenantId), [demoTenantId])
  const orgRows = useMemo(() => buildOrgQuotaBarsFromUsers(rows), [rows])
  const orgPctRows = useMemo<OrgQuotaPctRow[]>(() => {
    return orgRows.map((r) => {
      if (r.limit <= 0) {
        return { ...r, usedPct: 0, headroomPct: 0 }
      }
      const usedPct = (r.used / r.limit) * 100
      const headroomPct = (r.remaining / r.limit) * 100
      return { ...r, usedPct, headroomPct }
    })
  }, [orgRows])
  const userDistRows = useMemo(() => buildUserQuotaDistributionRows(rows, 8), [rows])

  const [limitsByUserId, setLimitsByUserId] = useState<Record<string, QuotaLimitDraft>>({})
  useEffect(() => {
    const next: Record<string, QuotaLimitDraft> = {}
    for (const r of rows) {
      const x = r.resource
      next[r.id] = {
        vcpu: String(x.vcpuAlloc),
        memGiB: String(x.memAllocGiB),
        gpu: String(x.gpuAlloc),
        storTb: String(x.storAllocTb),
      }
    }
    setLimitsByUserId(next)
  }, [rows])

  const [requestNotice, setRequestNotice] = useState(false)
  const [applyNotice, setApplyNotice] = useState(false)

  useEffect(() => {
    if (!requestNotice) return
    const t = window.setTimeout(() => setRequestNotice(false), 7000)
    return () => window.clearTimeout(t)
  }, [requestNotice])

  useEffect(() => {
    if (!applyNotice) return
    const t = window.setTimeout(() => setApplyNotice(false), 7000)
    return () => window.clearTimeout(t)
  }, [applyNotice])

  const gridStroke = isDarkTheme ? VM_UTILIZATION_CHART_GRID_STROKE : VM_UTILIZATION_CHART_GRID_STROKE_ON_LIGHT
  const tickFill = isDarkTheme ? VM_UTILIZATION_CHART_AXIS_TICK : VM_UTILIZATION_CHART_AXIS_TICK_ON_LIGHT
  const headroomFill = isDarkTheme ? VM_UTILIZATION_CHART_GRID_STROKE : ORG_HEADROOM_FILL_LIGHT

  return (
    <div className="osac-tenant-admin-page tenant-admin-quota-page">
      <section className="tenant-admin-quota-section" aria-labelledby="tenant-admin-quota-org-heading">
        <div className="tenant-admin-quota-section-head">
          <Title headingLevel="h2" size="xl" id="tenant-admin-quota-org-heading">
            Organization quotas
          </Title>
          <Button variant="secondary" onClick={() => setRequestNotice(true)}>
            Request quota increase
          </Button>
        </div>
        {requestNotice ? (
          <Alert
            isInline
            variant={AlertVariant.info}
            title="Quota increase request recorded (demo)"
            className="tenant-admin-quota-alert"
          >
            In a full deployment this would open a provider workflow or ticket. Nothing is sent from this
            demo.
          </Alert>
        ) : null}
        <Card component="article">
          <CardHeader>
            <CardTitle>Pooled usage vs summed per-user allocation</CardTitle>
          </CardHeader>
          <CardBody>
            <Content
              component="p"
              style={{
                marginTop: 0,
                marginBottom: 'var(--pf-t--global--spacer--md)',
                color: 'var(--pf-t--global--text--color--subtle)',
                maxWidth: '52rem',
              }}
            >
              Totals roll up the user directory: each bar shows how much of the organization’s combined
              allocation is in use versus still available, on a comparable 0–100% scale.
            </Content>
            <div
              className="tenant-admin-quota-chart"
              role="img"
              aria-label="Horizontal stacked bars for vCPU, memory, GPU, and storage as percent of combined user allocation"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  layout="vertical"
                  data={orgPctRows}
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid stroke={gridStroke} horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: tickFill, fontSize: 12 }}
                    tickFormatter={(v) => `${Math.round(v)}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={112}
                    tick={{ fill: tickFill, fontSize: 12 }}
                  />
                  <Tooltip content={<OrgQuotaTooltip />} cursor={{ fill: 'rgba(128,128,128,0.08)' }} />
                  <Legend wrapperStyle={{ fontSize: 12, color: tickFill }} />
                  <Bar dataKey="usedPct" name="In use" stackId="org" fill={ORG_USED_FILL} />
                  <Bar dataKey="headroomPct" name="Headroom" stackId="org" fill={headroomFill} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="tenant-admin-quota-org-summary" aria-label="Organization quota figures">
              {orgRows.map((r) => (
                <li key={r.name}>
                  <span className="tenant-admin-quota-org-summary__label">{r.name}</span>
                  <span className="tenant-admin-quota-org-summary__value">
                    {formatOrgNumber(r, r.used)} used · {formatOrgNumber(r, r.limit)} limit ({r.unit})
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>

      <section className="tenant-admin-quota-section" aria-labelledby="tenant-admin-quota-users-heading">
        <Title headingLevel="h2" size="xl" id="tenant-admin-quota-users-heading">
          User quota distribution
        </Title>
        <Card component="article">
          <CardHeader>
            <CardTitle>Per-person utilization</CardTitle>
          </CardHeader>
          <CardBody>
            <Content
              component="p"
              style={{
                marginTop: 0,
                marginBottom: 'var(--pf-t--global--spacer--md)',
                color: 'var(--pf-t--global--text--color--subtle)',
                maxWidth: '52rem',
              }}
            >
              Grouped bars show each person’s consumption as a percentage of their own assigned quota. Hover
              a column for exact used and limit values.
            </Content>
            <div
              className="tenant-admin-quota-chart tenant-admin-quota-chart--user-dist"
              role="img"
              aria-label="Grouped vertical bars comparing users on vCPU, memory, GPU, and storage utilization percent"
            >
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={userDistRows} margin={{ top: 8, right: 8, left: 8, bottom: 48 }}>
                  <CartesianGrid stroke={gridStroke} vertical={false} />
                  <XAxis
                    dataKey="displayName"
                    tick={{ fill: tickFill, fontSize: 11 }}
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: tickFill, fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: '% of personal quota',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: tickFill, fontSize: 12 },
                    }}
                  />
                  <Tooltip content={<UserQuotaTooltip />} cursor={{ fill: 'rgba(128,128,128,0.08)' }} />
                  <Legend wrapperStyle={{ fontSize: 12, color: tickFill }} />
                  <Bar dataKey="vcpuPct" name="vCPU" fill={VM_UTILIZATION_CHART_STROKES.cpu} />
                  <Bar dataKey="memPct" name="Memory" fill={VM_UTILIZATION_CHART_STROKES.memory} />
                  <Bar dataKey="gpuPct" name="GPU" fill={VM_UTILIZATION_CHART_STROKES.gpu} />
                  <Bar dataKey="storPct" name="Storage" fill={VM_UTILIZATION_CHART_STROKES.storage} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="tenant-admin-quota-section" aria-labelledby="tenant-admin-quota-set-heading">
        <Title headingLevel="h2" size="xl" id="tenant-admin-quota-set-heading">
          Set user quotas
        </Title>
        {applyNotice ? (
          <Alert
            isInline
            variant={AlertVariant.success}
            title="Assignments saved locally (demo)"
            className="tenant-admin-quota-alert"
          >
            Limits below update only this browser session. Wire to your control plane to enforce them in
            production.
          </Alert>
        ) : null}
        <Card component="article">
          <CardHeader>
            <CardTitle>Per-user limits</CardTitle>
          </CardHeader>
          <CardBody>
            <Content
              component="p"
              style={{
                marginTop: 0,
                marginBottom: 'var(--pf-t--global--spacer--md)',
                color: 'var(--pf-t--global--text--color--subtle)',
                maxWidth: '52rem',
              }}
            >
              Adjust caps for vCPU, memory, GPU devices, and storage. Values seed from the demo user
              directory and can be edited independently for each account.
            </Content>
            <div className="tenant-admin-quota-limits-table-wrap">
              <table
                className={`${tableStyles.table} ${tableStyles.modifiers.striped} tenant-admin-quota-limits-table`}
                aria-label="Per-user quota limits"
              >
                <thead className={tableStyles.tableThead}>
                  <tr className={tableStyles.tableTr}>
                    <th className={tableStyles.tableTh} scope="col">
                      Name
                    </th>
                    <th className={`${tableStyles.tableTh} tenant-admin-quota-limits-table__th--num`} scope="col">
                      vCPU limit
                    </th>
                    <th className={`${tableStyles.tableTh} tenant-admin-quota-limits-table__th--num`} scope="col">
                      Memory (GiB)
                    </th>
                    <th className={`${tableStyles.tableTh} tenant-admin-quota-limits-table__th--num`} scope="col">
                      GPU devices
                    </th>
                    <th className={`${tableStyles.tableTh} tenant-admin-quota-limits-table__th--num`} scope="col">
                      Storage (TB)
                    </th>
                  </tr>
                </thead>
                <tbody className={tableStyles.tableTbody}>
                  {rows.map((row) => {
                    const draft = limitsByUserId[row.id]
                    if (!draft) return null
                    return (
                      <tr key={row.id} className={tableStyles.tableTr}>
                        <td className={tableStyles.tableTd} data-label="Name">
                          <strong>{row.name}</strong>
                        </td>
                        <td className={`${tableStyles.tableTd} tenant-admin-quota-limits-table__td--input`} data-label="vCPU limit">
                          <TextInput
                            type="number"
                            aria-label={`vCPU limit for ${row.name}`}
                            value={draft.vcpu}
                            onChange={(_e, v) =>
                              setLimitsByUserId((prev) => ({
                                ...prev,
                                [row.id]: { ...prev[row.id]!, vcpu: v },
                              }))
                            }
                          />
                        </td>
                        <td className={`${tableStyles.tableTd} tenant-admin-quota-limits-table__td--input`} data-label="Memory GiB">
                          <TextInput
                            type="number"
                            aria-label={`Memory GiB limit for ${row.name}`}
                            value={draft.memGiB}
                            onChange={(_e, v) =>
                              setLimitsByUserId((prev) => ({
                                ...prev,
                                [row.id]: { ...prev[row.id]!, memGiB: v },
                              }))
                            }
                          />
                        </td>
                        <td className={`${tableStyles.tableTd} tenant-admin-quota-limits-table__td--input`} data-label="GPU devices">
                          <TextInput
                            type="number"
                            aria-label={`GPU device limit for ${row.name}`}
                            value={draft.gpu}
                            onChange={(_e, v) =>
                              setLimitsByUserId((prev) => ({
                                ...prev,
                                [row.id]: { ...prev[row.id]!, gpu: v },
                              }))
                            }
                          />
                        </td>
                        <td className={`${tableStyles.tableTd} tenant-admin-quota-limits-table__td--input`} data-label="Storage TB">
                          <TextInput
                            type="number"
                            aria-label={`Storage TB limit for ${row.name}`}
                            value={draft.storTb}
                            onChange={(_e, v) =>
                              setLimitsByUserId((prev) => ({
                                ...prev,
                                [row.id]: { ...prev[row.id]!, storTb: v },
                              }))
                            }
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="tenant-admin-quota-actions">
              <Button variant="primary" onClick={() => setApplyNotice(true)}>
                Apply assignments (demo)
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  )
}
