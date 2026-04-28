import { useMemo } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Content } from '@patternfly/react-core'
import tableStyles from '@patternfly/react-styles/css/components/Table/table'
import {
  PROVIDER_TENANT_ORG_ROWS,
  type ProviderTenantOrgRow,
  type UsageMetric,
} from './ProviderTenantOrganizationsTable'

type AllocationMetric = {
  key: 'vcpu' | 'memory' | 'storage'
  title: string
  used: number
  allocated: number
  unit: string
}

function usagePercent(metric: UsageMetric): number {
  if (metric.allocated <= 0) return 0
  return Math.round((metric.used / metric.allocated) * 100)
}

function metricOverallPercent(metric: AllocationMetric): number {
  if (metric.allocated <= 0) return 0
  return Math.round((metric.used / metric.allocated) * 100)
}

function orgOverallPercent(row: ProviderTenantOrgRow): number {
  const sum = usagePercent(row.vcpu) + usagePercent(row.ram) + usagePercent(row.storage)
  return Math.round(sum / 3)
}

function formatWithUnit(value: number, unit: string): string {
  return `${value.toLocaleString('en-US')} ${unit}`
}

function AllocationUsageBar({ percent, ariaLabel }: { percent: number; ariaLabel: string }) {
  return (
    <div
      className="provider-resource-allocation-bar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={ariaLabel}
    >
      <div className="provider-resource-allocation-bar__fill" style={{ width: `${percent}%` }} />
    </div>
  )
}

/** Provider admin — cross-tenant capacity overview and top consumers (demo). */
export function ProviderAdminResourceAllocationPage() {
  const metrics = useMemo<AllocationMetric[]>(() => {
    const vcpuUsed = PROVIDER_TENANT_ORG_ROWS.reduce((sum, row) => sum + row.vcpu.used, 0)
    const vcpuAlloc = PROVIDER_TENANT_ORG_ROWS.reduce((sum, row) => sum + row.vcpu.allocated, 0)

    const memoryUsed = PROVIDER_TENANT_ORG_ROWS.reduce((sum, row) => sum + row.ram.used, 0)
    const memoryAlloc = PROVIDER_TENANT_ORG_ROWS.reduce((sum, row) => sum + row.ram.allocated, 0)

    const storageUsed = PROVIDER_TENANT_ORG_ROWS.reduce((sum, row) => sum + row.storage.used, 0)
    const storageAlloc = PROVIDER_TENANT_ORG_ROWS.reduce((sum, row) => sum + row.storage.allocated, 0)

    return [
      {
        key: 'vcpu',
        title: 'vCPU allocation',
        used: vcpuUsed,
        allocated: vcpuAlloc,
        unit: 'cores',
      },
      {
        key: 'memory',
        title: 'Memory allocation',
        used: memoryUsed,
        allocated: memoryAlloc,
        unit: 'GiB',
      },
      {
        key: 'storage',
        title: 'Storage allocation',
        used: storageUsed,
        allocated: storageAlloc,
        unit: 'TB',
      },
    ]
  }, [])

  const topConsumers = useMemo(
    () =>
      [...PROVIDER_TENANT_ORG_ROWS]
        .sort((a, b) => orgOverallPercent(b) - orgOverallPercent(a))
        .slice(0, 4),
    [],
  )

  return (
    <div className="osac-tenant-admin-page provider-resource-allocation-page">
      <div className="provider-resource-allocation-page__cards">
        {metrics.map((metric) => {
          const percent = metricOverallPercent(metric)
          return (
            <Card key={metric.key} component="section" className="provider-resource-allocation-card">
              <CardHeader>
                <CardTitle component="h2">{metric.title}</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="provider-resource-allocation-card__values">
                  <strong className="provider-resource-allocation-card__used">
                    {formatWithUnit(metric.used, metric.unit)}
                  </strong>
                  <span className="provider-resource-allocation-card__of">
                    / {formatWithUnit(metric.allocated, metric.unit)}
                  </span>
                  <span className="provider-resource-allocation-card__pct">{percent}%</span>
                </div>
                <AllocationUsageBar percent={percent} ariaLabel={`${metric.title} ${percent}% allocated`} />
              </CardBody>
            </Card>
          )
        })}
      </div>

      <Card component="section" className="provider-resource-allocation-consumers-card">
        <CardHeader>
          <CardTitle component="h2">Top resource consumers</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="provider-resource-allocation-consumers-table-wrap">
            <table
              className={`${tableStyles.table} ${tableStyles.modifiers.striped} provider-resource-allocation-consumers-table`}
              aria-label="Top resource consumers"
            >
              <thead className={tableStyles.tableThead}>
                <tr className={tableStyles.tableTr}>
                  <th className={tableStyles.tableTh} scope="col">
                    Organization
                  </th>
                  <th className={tableStyles.tableTh} scope="col">
                    vCPU
                  </th>
                  <th className={tableStyles.tableTh} scope="col">
                    Memory
                  </th>
                  <th className={tableStyles.tableTh} scope="col">
                    Storage
                  </th>
                  <th className={`${tableStyles.tableTh} ${tableStyles.modifiers.fitContent}`} scope="col">
                    Utilization
                  </th>
                </tr>
              </thead>
              <tbody className={tableStyles.tableTbody}>
                {topConsumers.map((row) => (
                  <tr key={row.id} className={tableStyles.tableTr}>
                    <td className={tableStyles.tableTd} data-label="Organization">
                      <strong>{row.organization}</strong>
                    </td>
                    <td className={tableStyles.tableTd} data-label="vCPU">
                      <Content component="p" className="provider-resource-allocation-consumers-table__metric">
                        {row.vcpu.used} / {row.vcpu.allocated}
                      </Content>
                    </td>
                    <td className={tableStyles.tableTd} data-label="Memory">
                      <Content component="p" className="provider-resource-allocation-consumers-table__metric">
                        {row.ram.used} / {row.ram.allocated} GiB
                      </Content>
                    </td>
                    <td className={tableStyles.tableTd} data-label="Storage">
                      <Content component="p" className="provider-resource-allocation-consumers-table__metric">
                        {row.storage.used} / {row.storage.allocated} TB
                      </Content>
                    </td>
                    <td className={tableStyles.tableTd} data-label="Utilization">
                      <Content component="p" className="provider-resource-allocation-consumers-table__utilization">
                        {orgOverallPercent(row)}%
                      </Content>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
