import { useMemo } from 'react'
import { Card, CardBody, Label } from '@patternfly/react-core'
import { BoltIcon } from '@patternfly/react-icons/dist/esm/icons/bolt-icon'
import { ClusterIcon } from '@patternfly/react-icons/dist/esm/icons/cluster-icon'
import { CubeIcon } from '@patternfly/react-icons/dist/esm/icons/cube-icon'
import { MemoryIcon } from '@patternfly/react-icons/dist/esm/icons/memory-icon'
import { MicrochipIcon } from '@patternfly/react-icons/dist/esm/icons/microchip-icon'
import { ModuleIcon } from '@patternfly/react-icons/dist/esm/icons/module-icon'
import { StorageDomainIcon } from '@patternfly/react-icons/dist/esm/icons/storage-domain-icon'
import tableStyles from '@patternfly/react-styles/css/components/Table/table'
import { PROVIDER_TENANT_ORG_ROWS, providerTenantOrgBrandMark } from './ProviderTenantOrganizationsTable'

type AllocationMetric = {
  key: 'vcpu' | 'memory' | 'gpu' | 'ai'
  title: string
  subtitle: string
  used: number
  allocated: number
  unit: string
  platformCapacityLabel: string
}

/** One decimal place, matches reference dashboard (e.g. 68.6%). */
function metricUtilizationPercentDisplay(metric: AllocationMetric): string {
  if (metric.allocated <= 0) return '0.0'
  const pct = (metric.used / metric.allocated) * 100
  return pct.toFixed(1)
}

function metricUtilizationPercentRaw(metric: AllocationMetric): number {
  if (metric.allocated <= 0) return 0
  return (metric.used / metric.allocated) * 100
}

function formatWithUnit(value: number, unit: string): string {
  return `${value.toLocaleString('en-US')} ${unit}`
}

function formatAllocationStatValue(metric: AllocationMetric, value: number): string {
  if (metric.key === 'vcpu') return value.toLocaleString('en-US')
  return formatWithUnit(value, metric.unit)
}

function AllocationUsageBar({
  percent,
  ariaLabel,
  className,
}: {
  percent: number
  ariaLabel: string
  className?: string
}) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div
      className={`provider-resource-allocation-bar ${className ?? ''}`.trim()}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={ariaLabel}
    >
      <div className="provider-resource-allocation-bar__fill" style={{ width: `${clamped}%` }} />
    </div>
  )
}

const ALLOCATION_METRIC_ICONS = {
  gpu: BoltIcon,
  ai: ModuleIcon,
  vcpu: ClusterIcon,
  memory: MemoryIcon,
} as const

type GpuInstanceTypeCard = {
  id: string
  title: string
  badgeTier: 'premium' | 'elite' | 'ultra' | 'inference'
  badgeLabel: string
  badgeBolt?: boolean
  totalLabel: string
  total: number
  inUse: number
  available: number
  /** L40S: accent green for both in-use and available per reference. */
  inUseMatchesAccentOnly: boolean
  extraRows?: { label: string; value: string }[]
  accent: 'a100' | 'h100' | 'nvlink' | 'l40s'
}

const GPU_INSTANCE_TYPE_CARDS: GpuInstanceTypeCard[] = [
  {
    id: 'a100',
    title: 'NVIDIA A100 80GB',
    badgeTier: 'premium',
    badgeLabel: 'premium',
    totalLabel: 'Total GPUs',
    total: 32,
    inUse: 14,
    available: 18,
    inUseMatchesAccentOnly: true,
    accent: 'a100',
  },
  {
    id: 'h100',
    title: 'NVIDIA H100 SXM5',
    badgeTier: 'elite',
    badgeLabel: 'elite',
    totalLabel: 'Total GPUs',
    total: 16,
    inUse: 6,
    available: 10,
    inUseMatchesAccentOnly: true,
    accent: 'h100',
  },
  {
    id: 'nvlink',
    title: 'NVLink 72-GPU Cluster',
    badgeTier: 'ultra',
    badgeLabel: 'ultra',
    badgeBolt: true,
    totalLabel: 'Total Clusters',
    total: 2,
    inUse: 1,
    available: 1,
    inUseMatchesAccentOnly: true,
    extraRows: [{ label: 'GPUs per cluster', value: '72' }],
    accent: 'nvlink',
  },
  {
    id: 'l40s',
    title: 'NVIDIA L40S',
    badgeTier: 'inference',
    badgeLabel: 'inference',
    totalLabel: 'Total GPUs',
    total: 48,
    inUse: 19,
    available: 29,
    inUseMatchesAccentOnly: false,
    accent: 'l40s',
  },
]

function gpuInstanceUtilizationPercentRaw(inUse: number, total: number): number {
  if (total <= 0) return 0
  return (inUse / total) * 100
}

/** e.g. 43.8% utilized, 50% utilized (no unnecessary .0 for whole numbers). */
function formatGpuInstanceUtilizedLabel(inUse: number, total: number): string {
  if (total <= 0) return '0% utilized'
  const pct = (inUse / total) * 100
  const roundedTenth = Math.round(pct * 10) / 10
  const shown =
    Math.abs(roundedTenth - Math.round(roundedTenth)) < 1e-9
      ? String(Math.round(roundedTenth))
      : roundedTenth.toFixed(1)
  return `${shown}% utilized`
}

type UtilizationPair = { used: number; allocated: number }

type AiMlTopConsumerRow = {
  id: string
  organization: string
  gpu: UtilizationPair | null
  aiInstances: UtilizationPair | null
  vcpu: UtilizationPair
  ramGb: UtilizationPair
  storageGb: UtilizationPair
}

function utilizationRatioPercent(m: UtilizationPair): number {
  if (m.allocated <= 0) return 0
  return (m.used / m.allocated) * 100
}

/** Blend GPU+AI when present; otherwise average of vCPU, RAM, and storage (demo AI/ML score). */
function aiMlUtilizationPercent(row: AiMlTopConsumerRow): number {
  const gpuPct = row.gpu ? utilizationRatioPercent(row.gpu) : null
  const aiPct = row.aiInstances ? utilizationRatioPercent(row.aiInstances) : null
  const primary: number[] = []
  if (gpuPct !== null) primary.push(gpuPct)
  if (aiPct !== null) primary.push(aiPct)
  if (primary.length > 0) {
    return primary.reduce((a, b) => a + b, 0) / primary.length
  }
  return (
    (utilizationRatioPercent(row.vcpu) +
      utilizationRatioPercent(row.ramGb) +
      utilizationRatioPercent(row.storageGb)) /
    3
  )
}

function formatUsagePairCell(m: UtilizationPair | null): string {
  if (!m) return ' / '
  return `${m.used.toLocaleString('en-US')} / ${m.allocated.toLocaleString('en-US')}`
}

/** Seeded “random” pairs per org (stable across renders). */
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return h
}

function demoUtilPair(seed: number, allocMin: number, allocSpan: number, ratioSpread: number): UtilizationPair {
  const allocated = allocMin + (Math.abs(seed) % allocSpan)
  const ratio = (12 + (Math.abs(seed >> 7) % ratioSpread)) / 100
  const used = Math.min(allocated, Math.max(0, Math.round(allocated * ratio)))
  return { used, allocated }
}

function gpuPairForOrg(id: string): UtilizationPair {
  return demoUtilPair(hashString(`${id}:gpu`), 4, 44, 58)
}

function aiPairForOrg(id: string): UtilizationPair {
  return demoUtilPair(hashString(`${id}:ai`), 2, 30, 62)
}

function gpuTierLabelColor(tier: GpuInstanceTypeCard['badgeTier']): 'green' | 'grey' | 'orange' {
  switch (tier) {
    case 'premium':
      return 'green'
    case 'elite':
      return 'grey'
    case 'ultra':
      return 'orange'
    case 'inference':
      return 'green'
    default:
      return 'grey'
  }
}

function capitalizeTierLabel(s: string): string {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

const TENSOR_CORE_TOTAL = 18432
const TENSOR_CORE_ACTIVE = 8192
const NVME_TOTAL_TB = 500
const NVME_USED_TB = 187

function infraUtilPercent(used: number, total: number): number {
  if (total <= 0) return 0
  return (used / total) * 100
}

/** Provider admin — cross-tenant capacity overview (demo). */
export function ProviderAdminResourceAllocationPage() {
  const metrics = useMemo<AllocationMetric[]>(() => {
    const vcpuUsed = PROVIDER_TENANT_ORG_ROWS.reduce((sum, row) => sum + row.vcpu.used, 0)
    const vcpuAlloc = PROVIDER_TENANT_ORG_ROWS.reduce((sum, row) => sum + row.vcpu.allocated, 0)

    const memoryUsed = PROVIDER_TENANT_ORG_ROWS.reduce((sum, row) => sum + row.ram.used, 0)
    const memoryAlloc = PROVIDER_TENANT_ORG_ROWS.reduce((sum, row) => sum + row.ram.allocated, 0)

    return [
      {
        key: 'gpu',
        title: 'GPU allocation',
        subtitle: 'NVIDIA GPU resources',
        used: 118,
        allocated: 160,
        unit: 'GPUs',
        platformCapacityLabel: '128 GPUs',
      },
      {
        key: 'ai',
        title: 'AI instances',
        subtitle: 'Specialized ML workloads',
        used: 86,
        allocated: 120,
        unit: 'instances',
        platformCapacityLabel: '64 instances',
      },
      {
        key: 'vcpu',
        title: 'vCPU allocation',
        subtitle: 'General compute',
        used: vcpuUsed,
        allocated: vcpuAlloc,
        unit: 'vCPU',
        platformCapacityLabel: '3000 vCPU',
      },
      {
        key: 'memory',
        title: 'RAM allocation',
        subtitle: 'Memory resources',
        used: memoryUsed,
        allocated: memoryAlloc,
        unit: 'GB',
        platformCapacityLabel: '12 TB',
      },
    ]
  }, [])

  const aiMlConsumerRows = useMemo<AiMlTopConsumerRow[]>(
    () =>
      PROVIDER_TENANT_ORG_ROWS.map((org) => ({
        id: org.id,
        organization: org.organization,
        gpu: gpuPairForOrg(org.id),
        aiInstances: aiPairForOrg(org.id),
        vcpu: { used: org.vcpu.used, allocated: org.vcpu.allocated },
        ramGb: { used: org.ram.used, allocated: org.ram.allocated },
        storageGb: {
          used: org.storage.used * 1024,
          allocated: org.storage.allocated * 1024,
        },
      })),
    [],
  )

  return (
    <div className="osac-tenant-admin-page provider-resource-allocation-page">
      <section
        className="provider-resource-allocation-overview"
        aria-labelledby="aiml-infrastructure-capacity-heading"
      >
        <div className="provider-gpu-instance-capacity__intro">
          <span className="provider-gpu-instance-capacity__intro-icon" aria-hidden>
            <CubeIcon />
          </span>
          <div className="provider-gpu-instance-capacity__intro-text">
            <h2
              id="aiml-infrastructure-capacity-heading"
              className="provider-gpu-instance-capacity__heading"
            >
              AI/ML infrastructure capacity
            </h2>
            <p className="provider-gpu-instance-capacity__lede">
              GPU clusters, specialized AI instances, and accelerated compute resources
            </p>
          </div>
        </div>
        <div className="provider-resource-allocation-page__cards">
        {metrics.map((metric) => {
          const percentForBar = metricUtilizationPercentRaw(metric)
          const utilizationDisplay = metricUtilizationPercentDisplay(metric)
          const Icon = ALLOCATION_METRIC_ICONS[metric.key]
          return (
            <Card
              key={metric.key}
              component="section"
              className={`provider-resource-allocation-metric-card provider-resource-allocation-metric-card--${metric.key}`}
            >
              <CardBody className="provider-resource-allocation-metric-card__body">
                <div className="provider-resource-allocation-metric-card__header">
                  <span className="provider-resource-allocation-metric-card__icon-wrap" aria-hidden>
                    <Icon className="provider-resource-allocation-metric-card__icon" />
                  </span>
                  <div className="provider-resource-allocation-metric-card__titles">
                    <h2 className="provider-resource-allocation-metric-card__title">{metric.title}</h2>
                    <p className="provider-resource-allocation-metric-card__subtitle">{metric.subtitle}</p>
                  </div>
                </div>
                <dl className="provider-resource-allocation-metric-card__stats">
                  <div className="provider-resource-allocation-metric-card__stat-row">
                    <dt className="provider-resource-allocation-metric-card__stat-label">Total allocated</dt>
                    <dd className="provider-resource-allocation-metric-card__stat-value">
                      {formatAllocationStatValue(metric, metric.allocated)}
                    </dd>
                  </div>
                  <div className="provider-resource-allocation-metric-card__stat-row">
                    <dt className="provider-resource-allocation-metric-card__stat-label">Total used</dt>
                    <dd className="provider-resource-allocation-metric-card__stat-value">
                      {formatAllocationStatValue(metric, metric.used)}
                    </dd>
                  </div>
                </dl>
                <AllocationUsageBar
                  className="provider-resource-allocation-metric-card__bar"
                  percent={percentForBar}
                  ariaLabel={`${metric.title} utilization ${utilizationDisplay}%`}
                />
                <p className="provider-resource-allocation-metric-card__capacity">
                  Platform capacity: {metric.platformCapacityLabel}
                </p>
                <div className="provider-resource-allocation-metric-card__footer">
                  <span className="provider-resource-allocation-metric-card__footer-label">Utilization</span>
                  <span className="provider-resource-allocation-metric-card__footer-pct">
                    {utilizationDisplay}%
                  </span>
                </div>
              </CardBody>
            </Card>
          )
        })}
        </div>
      </section>

      <section className="provider-gpu-instance-capacity" aria-labelledby="gpu-instance-capacity-heading">
        <div className="provider-gpu-instance-capacity__intro">
          <span className="provider-gpu-instance-capacity__intro-icon" aria-hidden>
            <CubeIcon />
          </span>
          <div className="provider-gpu-instance-capacity__intro-text">
            <h2 id="gpu-instance-capacity-heading" className="provider-gpu-instance-capacity__heading">
              GPU instance type capacity
            </h2>
            <p className="provider-gpu-instance-capacity__lede">
              Available AI/ML instance configurations across the platform
            </p>
          </div>
        </div>
        <div className="provider-gpu-instance-capacity__grid">
          {GPU_INSTANCE_TYPE_CARDS.map((item) => {
            const pctBar = gpuInstanceUtilizationPercentRaw(item.inUse, item.total)
            const utilLabel = formatGpuInstanceUtilizedLabel(item.inUse, item.total)
            const inUseClass = item.inUseMatchesAccentOnly
              ? 'provider-gpu-type-card__value provider-gpu-type-card__value--accent'
              : 'provider-gpu-type-card__value provider-gpu-type-card__value--available'
            return (
              <Card
                key={item.id}
                component="article"
                className={`provider-gpu-type-card provider-gpu-type-card--${item.accent}`}
              >
                <CardBody className="provider-gpu-type-card__body">
                  <div className="provider-gpu-type-card__top">
                    <h3 className="provider-gpu-type-card__title">{item.title}</h3>
                    <Label
                      color={gpuTierLabelColor(item.badgeTier)}
                      isCompact
                      className="provider-gpu-type-card__tier-label"
                    >
                      <span className="provider-gpu-type-card__tier-label-inner">
                        {item.badgeBolt ? (
                          <BoltIcon className="provider-gpu-type-card__tier-label-icon" aria-hidden />
                        ) : null}
                        <span className="provider-gpu-type-card__tier-label-text">
                          {capitalizeTierLabel(item.badgeLabel)}
                        </span>
                      </span>
                    </Label>
                  </div>
                  <dl className="provider-gpu-type-card__stats">
                    <div className="provider-gpu-type-card__row">
                      <dt className="provider-gpu-type-card__label">{item.totalLabel}</dt>
                      <dd className="provider-gpu-type-card__value provider-gpu-type-card__value--neutral">
                        {item.total.toLocaleString('en-US')}
                      </dd>
                    </div>
                    <div className="provider-gpu-type-card__row">
                      <dt className="provider-gpu-type-card__label">In use</dt>
                      <dd className={inUseClass}>{item.inUse.toLocaleString('en-US')}</dd>
                    </div>
                    <div className="provider-gpu-type-card__row">
                      <dt className="provider-gpu-type-card__label">Available</dt>
                      <dd className="provider-gpu-type-card__value provider-gpu-type-card__value--available">
                        {item.available.toLocaleString('en-US')}
                      </dd>
                    </div>
                    {item.extraRows?.map((row) => (
                      <div key={row.label} className="provider-gpu-type-card__row">
                        <dt className="provider-gpu-type-card__label">{row.label}</dt>
                        <dd className="provider-gpu-type-card__value provider-gpu-type-card__value--neutral">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <AllocationUsageBar
                    className="provider-gpu-type-card__bar"
                    percent={pctBar}
                    ariaLabel={`${item.title} ${utilLabel}`}
                  />
                  <p className="provider-gpu-type-card__util">{utilLabel}</p>
                </CardBody>
              </Card>
            )
          })}
        </div>
      </section>

      <Card component="section" className="provider-ai-ml-consumers-card">
        <CardBody className="provider-ai-ml-consumers-card__body">
          <div className="provider-ai-ml-consumers-card__intro">
            <h2 className="provider-ai-ml-consumers-card__heading" id="ai-ml-top-consumers-heading">
              Top AI/ML resource consumers
            </h2>
            <p className="provider-ai-ml-consumers-card__lede">
              Tenants with highest GPU and AI instance utilization
            </p>
          </div>
          <div className="provider-ai-ml-consumers-table-wrap">
            <table
              className={`${tableStyles.table} ${tableStyles.modifiers.striped} provider-ai-ml-consumers-table`}
              aria-labelledby="ai-ml-top-consumers-heading"
            >
              <colgroup>
                <col className="provider-ai-ml-consumers-table__col--org" />
                <col className="provider-ai-ml-consumers-table__col--compact" />
                <col className="provider-ai-ml-consumers-table__col--compact" />
                <col className="provider-ai-ml-consumers-table__col--compact" />
                <col className="provider-ai-ml-consumers-table__col--wide" />
                <col className="provider-ai-ml-consumers-table__col--wide" />
                <col className="provider-ai-ml-consumers-table__col--util" />
              </colgroup>
              <thead className={tableStyles.tableThead}>
                <tr className={tableStyles.tableTr}>
                  <th className={tableStyles.tableTh} scope="col">
                    Organization
                  </th>
                  <th
                    className={`${tableStyles.tableTh} provider-ai-ml-consumers-table__th--num`}
                    scope="col"
                  >
                    GPUs
                  </th>
                  <th
                    className={`${tableStyles.tableTh} provider-ai-ml-consumers-table__th--num`}
                    scope="col"
                  >
                    AI instances
                  </th>
                  <th
                    className={`${tableStyles.tableTh} provider-ai-ml-consumers-table__th--num`}
                    scope="col"
                  >
                    vCPU
                  </th>
                  <th
                    className={`${tableStyles.tableTh} provider-ai-ml-consumers-table__th--num`}
                    scope="col"
                  >
                    RAM
                  </th>
                  <th
                    className={`${tableStyles.tableTh} provider-ai-ml-consumers-table__th--num`}
                    scope="col"
                  >
                    Storage
                  </th>
                  <th className={`${tableStyles.tableTh} provider-ai-ml-consumers-table__th--util`} scope="col">
                    AI utilization
                  </th>
                </tr>
              </thead>
              <tbody className={tableStyles.tableTbody}>
                {aiMlConsumerRows.map((row) => {
                  const aiPct = aiMlUtilizationPercent(row)
                  const aiPctRounded = Math.round(aiPct)
                  const tenantOrgRow = PROVIDER_TENANT_ORG_ROWS.find((o) => o.id === row.id)
                  return (
                    <tr key={row.id} className={tableStyles.tableTr}>
                      <td className={tableStyles.tableTd} data-label="Organization">
                        <span className="provider-ai-ml-consumers-table__org">
                          {tenantOrgRow ? (
                            <span className="provider-tenant-org-brand-mark" aria-hidden>
                              {providerTenantOrgBrandMark(tenantOrgRow)}
                            </span>
                          ) : null}
                          <strong>{row.organization}</strong>
                        </span>
                      </td>
                      <td
                        className={`${tableStyles.tableTd} provider-ai-ml-consumers-table__td--num`}
                        data-label="GPUs"
                      >
                        <p className="provider-ai-ml-consumers-table__metric">{formatUsagePairCell(row.gpu)}</p>
                      </td>
                      <td
                        className={`${tableStyles.tableTd} provider-ai-ml-consumers-table__td--num`}
                        data-label="AI instances"
                      >
                        <p className="provider-ai-ml-consumers-table__metric">
                          {formatUsagePairCell(row.aiInstances)}
                        </p>
                      </td>
                      <td
                        className={`${tableStyles.tableTd} provider-ai-ml-consumers-table__td--num`}
                        data-label="vCPU"
                      >
                        <p className="provider-ai-ml-consumers-table__metric">{formatUsagePairCell(row.vcpu)}</p>
                      </td>
                      <td
                        className={`${tableStyles.tableTd} provider-ai-ml-consumers-table__td--num`}
                        data-label="RAM"
                      >
                        <p className="provider-ai-ml-consumers-table__metric">
                          {formatUsagePairCell(row.ramGb)} GB
                        </p>
                      </td>
                      <td
                        className={`${tableStyles.tableTd} provider-ai-ml-consumers-table__td--num`}
                        data-label="Storage"
                      >
                        <p className="provider-ai-ml-consumers-table__metric">
                          {formatUsagePairCell(row.storageGb)} GB
                        </p>
                      </td>
                      <td
                        className={`${tableStyles.tableTd} provider-ai-ml-consumers-table__td--util`}
                        data-label="AI utilization"
                      >
                        <div className="provider-ai-ml-consumers-table__util-wrap">
                          <AllocationUsageBar
                            className="provider-ai-ml-consumers-table__util-bar"
                            percent={aiPct}
                            ariaLabel={`${row.organization} AI utilization ${aiPctRounded}%`}
                          />
                          <span className="provider-ai-ml-consumers-table__util-pct">{aiPctRounded}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <div className="provider-resource-allocation-page__footer-cards">
        <Card component="section" className="provider-infra-extra-card provider-infra-extra-card--tensor">
          <CardBody className="provider-infra-extra-card__body">
            <div className="provider-infra-extra-card__header">
              <span className="provider-infra-extra-card__icon-wrap" aria-hidden>
                <MicrochipIcon className="provider-infra-extra-card__icon" />
              </span>
              <div className="provider-infra-extra-card__titles">
                <h2 className="provider-infra-extra-card__title">Tensor core availability</h2>
                <p className="provider-infra-extra-card__subtitle">
                  AI-optimized compute units across GPU fleet
                </p>
              </div>
            </div>
            <dl className="provider-infra-extra-card__stats">
              <div className="provider-infra-extra-card__stat-row">
                <dt className="provider-infra-extra-card__stat-label">Total tensor cores:</dt>
                <dd className="provider-infra-extra-card__stat-value provider-infra-extra-card__stat-value--primary">
                  {TENSOR_CORE_TOTAL.toLocaleString('en-US')}
                </dd>
              </div>
              <div className="provider-infra-extra-card__stat-row">
                <dt className="provider-infra-extra-card__stat-label">Active workloads:</dt>
                <dd className="provider-infra-extra-card__stat-value provider-infra-extra-card__stat-value--accent">
                  {TENSOR_CORE_ACTIVE.toLocaleString('en-US')}
                </dd>
              </div>
            </dl>
            <AllocationUsageBar
              className="provider-infra-extra-card__bar"
              percent={infraUtilPercent(TENSOR_CORE_ACTIVE, TENSOR_CORE_TOTAL)}
              ariaLabel={`Tensor core utilization ${infraUtilPercent(TENSOR_CORE_ACTIVE, TENSOR_CORE_TOTAL).toFixed(1)}%`}
            />
            <p className="provider-infra-extra-card__footer-line">
              {infraUtilPercent(TENSOR_CORE_ACTIVE, TENSOR_CORE_TOTAL).toFixed(1)}% tensor core utilization
            </p>
          </CardBody>
        </Card>
        <Card component="section" className="provider-infra-extra-card provider-infra-extra-card--nvme">
          <CardBody className="provider-infra-extra-card__body">
            <div className="provider-infra-extra-card__header">
              <span className="provider-infra-extra-card__icon-wrap" aria-hidden>
                <StorageDomainIcon className="provider-infra-extra-card__icon" />
              </span>
              <div className="provider-infra-extra-card__titles">
                <h2 className="provider-infra-extra-card__title">High-speed NVMe storage</h2>
                <p className="provider-infra-extra-card__subtitle">AI/ML optimized storage tier</p>
              </div>
            </div>
            <dl className="provider-infra-extra-card__stats">
              <div className="provider-infra-extra-card__stat-row">
                <dt className="provider-infra-extra-card__stat-label">Total NVMe capacity:</dt>
                <dd className="provider-infra-extra-card__stat-value provider-infra-extra-card__stat-value--primary">
                  {NVME_TOTAL_TB.toLocaleString('en-US')} TB
                </dd>
              </div>
              <div className="provider-infra-extra-card__stat-row">
                <dt className="provider-infra-extra-card__stat-label">Used by AI workloads:</dt>
                <dd className="provider-infra-extra-card__stat-value provider-infra-extra-card__stat-value--accent">
                  {NVME_USED_TB.toLocaleString('en-US')} TB
                </dd>
              </div>
            </dl>
            <AllocationUsageBar
              className="provider-infra-extra-card__bar"
              percent={infraUtilPercent(NVME_USED_TB, NVME_TOTAL_TB)}
              ariaLabel={`NVMe utilization ${infraUtilPercent(NVME_USED_TB, NVME_TOTAL_TB).toFixed(1)}%`}
            />
            <p className="provider-infra-extra-card__footer-line">
              {infraUtilPercent(NVME_USED_TB, NVME_TOTAL_TB).toFixed(1)}% NVMe utilization • 6.5 GB/s avg throughput
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
