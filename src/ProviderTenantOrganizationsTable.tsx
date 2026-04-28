import { useMemo, useState, type ReactNode } from 'react'
import {
  Card,
  CardBody,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  Label,
  MenuToggle,
} from '@patternfly/react-core'
import { EllipsisVIcon } from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import tableStyles from '@patternfly/react-styles/css/components/Table/table'
import { DEMO_TENANT_LABEL } from './demoTenant'
import { NorthstarBankMastheadLogo } from './NorthstarBankMastheadLogo'
import { EvergreenFinancialGroupMastheadLogo } from './EvergreenFinancialGroupMastheadLogo'
import {
  LighthouseCapitalLogo,
  SummitPeakLogo,
  UnionHarborLogo,
} from './ProviderTenantOrgGeneratedLogos'

export type UsageMetric = {
  used: number
  allocated: number
  suffix?: string
}

export type ProviderTenantOrgRow = {
  id: string
  organization: string
  /** Shown on the full tenant organizations page only (not the dashboard preview). */
  users: number
  /** Shown on the full tenant organizations page only (not the dashboard preview). */
  vms: number
  vcpu: UsageMetric
  ram: UsageMetric
  gpu: UsageMetric
  storage: UsageMetric
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Suspended'
}

export const PROVIDER_TENANT_ORG_ROWS: ProviderTenantOrgRow[] = [
  {
    id: 'northstar',
    organization: DEMO_TENANT_LABEL.northstar,
    users: 48,
    vms: 142,
    vcpu: { used: 310, allocated: 500 },
    ram: { used: 2272, allocated: 3200, suffix: ' GiB' },
    gpu: { used: 3, allocated: 8, suffix: ' devices' },
    storage: { used: 108, allocated: 200, suffix: ' TB' },
    status: 'Active',
  },
  {
    id: 'bluestone',
    organization: DEMO_TENANT_LABEL.evergreen,
    users: 36,
    vms: 98,
    vcpu: { used: 220, allocated: 500 },
    ram: { used: 1856, allocated: 3200, suffix: ' GiB' },
    gpu: { used: 2, allocated: 8, suffix: ' devices' },
    storage: { used: 98, allocated: 200, suffix: ' TB' },
    status: 'Active',
  },
  {
    id: 'harborline',
    organization: 'Harborline Credit Union',
    users: 0,
    vms: 0,
    vcpu: { used: 0, allocated: 400 },
    ram: { used: 0, allocated: 2048, suffix: ' GiB' },
    gpu: { used: 0, allocated: 4, suffix: ' devices' },
    storage: { used: 0, allocated: 120, suffix: ' TB' },
    status: 'Inactive',
  },
  {
    id: 'summit-peak',
    organization: 'Summit Peak Bank',
    users: 29,
    vms: 76,
    vcpu: { used: 172, allocated: 380 },
    ram: { used: 1344, allocated: 2400, suffix: ' GiB' },
    gpu: { used: 1, allocated: 6, suffix: ' devices' },
    storage: { used: 74, allocated: 150, suffix: ' TB' },
    status: 'Active',
  },
  {
    id: 'lighthouse-capital',
    organization: 'Lighthouse Capital Group',
    users: 34,
    vms: 88,
    vcpu: { used: 201, allocated: 420 },
    ram: { used: 1508, allocated: 2600, suffix: ' GiB' },
    gpu: { used: 2, allocated: 6, suffix: ' devices' },
    storage: { used: 82, allocated: 160, suffix: ' TB' },
    status: 'Active',
  },
  {
    id: 'union-harbor',
    organization: 'Union Harbor Trust',
    users: 22,
    vms: 61,
    vcpu: { used: 144, allocated: 320 },
    ram: { used: 1120, allocated: 2100, suffix: ' GiB' },
    gpu: { used: 1, allocated: 4, suffix: ' devices' },
    storage: { used: 59, allocated: 130, suffix: ' TB' },
    status: 'Active',
  },
  {
    id: 'ridgeworth',
    organization: 'Ridgeworth Trust Company',
    users: 0,
    vms: 0,
    vcpu: { used: 0, allocated: 300 },
    ram: { used: 0, allocated: 1536, suffix: ' GiB' },
    gpu: { used: 0, allocated: 2, suffix: ' devices' },
    storage: { used: 0, allocated: 80, suffix: ' TB' },
    status: 'Inactive',
  },
]

function usagePercent(metric: UsageMetric) {
  if (metric.allocated <= 0) return 0
  return Math.round((metric.used / metric.allocated) * 100)
}

function TenantOrgUsageBar({ metric }: { metric: UsageMetric }) {
  const pct = usagePercent(metric)
  const suffix = metric.suffix ?? ''
  const fractionLabel = `${metric.used}/${metric.allocated}${suffix}`

  return (
    <div className="provider-tenant-orgs-usage">
      <div className="provider-tenant-orgs-usage__labels">
        <span className="provider-tenant-orgs-usage__fraction">{fractionLabel}</span>
        <span className="provider-tenant-orgs-usage__pct">{pct}%</span>
      </div>
      <div
        className="provider-tenant-orgs-usage__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`${fractionLabel}, ${pct} percent used`}
      >
        <div className="provider-tenant-orgs-usage__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function statusLabelColor(status: ProviderTenantOrgRow['status']) {
  switch (status) {
    case 'Active':
      return 'green'
    case 'Inactive':
      return 'grey'
    case 'Maintenance':
      return 'orange'
    case 'Suspended':
      return 'red'
    default:
      return 'grey'
  }
}

function overallUtilizationPercent(row: ProviderTenantOrgRow) {
  const metrics = [row.vcpu, row.ram, row.storage]
  const sum = metrics.reduce((acc, metric) => acc + usagePercent(metric), 0)
  return Math.round(sum / metrics.length)
}

function tenantSequenceLabel(rowId: string) {
  const index = PROVIDER_TENANT_ORG_ROWS.findIndex((row) => row.id === rowId)
  return `tenant-${String(index + 1).padStart(3, '0')}`
}

function orgLogoText(organization: string) {
  const parts = organization.split(/\s+/).filter(Boolean)
  return (parts[0]?.[0] ?? 'T') + (parts[1]?.[0] ?? parts[0]?.[1] ?? 'O')
}

function orgBrandLogo(row: ProviderTenantOrgRow): ReactNode {
  if (row.id === 'northstar') return <NorthstarBankMastheadLogo />
  if (row.id === 'bluestone') return <EvergreenFinancialGroupMastheadLogo />
  if (row.id === 'summit-peak')
    return (
      <SummitPeakLogo className="provider-tenant-org-generated-mark provider-tenant-org-generated-mark--summit" />
    )
  if (row.id === 'lighthouse-capital')
    return (
      <LighthouseCapitalLogo className="provider-tenant-org-generated-mark provider-tenant-org-generated-mark--lighthouse" />
    )
  if (row.id === 'union-harbor') return <UnionHarborLogo className="provider-tenant-org-generated-mark" />
  return orgLogoText(row.organization)
}

export type ProviderTenantOrgStatusFilter = 'all' | ProviderTenantOrgRow['status']

export type ProviderTenantOrganizationsTableProps = {
  /** Extra class on the scroll wrapper (e.g. dashboard vs full page). */
  wrapClassName?: string
  /** When set (e.g. from the dashboard card header), filter rows by organization status. */
  statusFilter?: ProviderTenantOrgStatusFilter
  /** Row actions column (ellipsis menu). Default true; dashboard preview omits it. */
  showActions?: boolean
  /** Users and VMs columns after Organization. Default true; dashboard preview omits them. */
  showUsersAndVmsColumns?: boolean
}

export type ProviderTenantOrganizationsCardsProps = {
  /** Extra class on the wrapper (e.g. dashboard card body). */
  wrapClassName?: string
  /** When set (e.g. dashboard filter), filter card list by tenant status. */
  statusFilter?: ProviderTenantOrgStatusFilter
  /** Optional tenant ids to include in the dashboard card list. */
  includedOrgIds?: string[]
  /** Optional tenant ids to hide from the dashboard card list. */
  hiddenOrgIds?: string[]
}

export const PROVIDER_TENANT_ORG_STATUS_FILTER_OPTIONS: {
  value: ProviderTenantOrgStatusFilter
  label: string
}[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Suspended', label: 'Suspended' },
]

/** Provider dashboard preview: tenant organizations as cards with usage bars (demo). */
export function ProviderTenantOrganizationsCards({
  wrapClassName,
  statusFilter,
  includedOrgIds = [],
  hiddenOrgIds = [],
}: ProviderTenantOrganizationsCardsProps) {
  const rowsToShow = useMemo(() => {
    let rows =
      statusFilter === undefined || statusFilter === 'all'
        ? PROVIDER_TENANT_ORG_ROWS
        : PROVIDER_TENANT_ORG_ROWS.filter((r) => r.status === statusFilter)
    if (includedOrgIds.length > 0) {
      rows = rows.filter((r) => includedOrgIds.includes(r.id))
    }
    if (hiddenOrgIds.length === 0) return rows
    return rows.filter((r) => !hiddenOrgIds.includes(r.id))
  }, [statusFilter, includedOrgIds, hiddenOrgIds])

  const wrapClass = ['provider-tenant-org-cards-wrap', wrapClassName].filter(Boolean).join(' ')

  if (rowsToShow.length === 0) {
    return (
      <div className={wrapClass}>
        <Content component="p" className="provider-tenant-org-cards__empty">
          No organizations match the selected status.
        </Content>
      </div>
    )
  }

  return (
    <div className={wrapClass}>
      <div className="provider-tenant-org-cards-grid" role="list" aria-label="Tenant organizations">
        {rowsToShow.map((row) => {
          const utilization = overallUtilizationPercent(row)
          return (
            <Card
              key={row.id}
              component="article"
              className="provider-tenant-org-preview-card"
              role="listitem"
              isFullHeight
            >
              <CardBody className="provider-tenant-org-preview-card__body">
                <div className="provider-tenant-org-preview-card__top">
                  <div className="provider-tenant-org-preview-card__brand">
                    <span className="provider-tenant-org-preview-card__logo" aria-hidden>
                      {orgBrandLogo(row)}
                    </span>
                    <div className="provider-tenant-org-preview-card__title-wrap">
                      <strong className="provider-tenant-org-preview-card__title">{row.organization}</strong>
                      <span className="provider-tenant-org-preview-card__subtitle">
                        {tenantSequenceLabel(row.id)}
                      </span>
                    </div>
                  </div>
                  <Label color={statusLabelColor(row.status)} isCompact>
                    {row.status}
                  </Label>
                </div>

                <div className="provider-tenant-org-preview-card__stats">
                  <div className="provider-tenant-org-preview-card__stat">
                    <span className="provider-tenant-org-preview-card__stat-label">Used VMs</span>
                    <span className="provider-tenant-org-preview-card__stat-value">
                      {row.vms.toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="provider-tenant-org-preview-card__stat">
                    <span className="provider-tenant-org-preview-card__stat-label">Users</span>
                    <span className="provider-tenant-org-preview-card__stat-value">
                      {row.users.toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="provider-tenant-org-preview-card__stat">
                    <span className="provider-tenant-org-preview-card__stat-label">Utilization</span>
                    <span className="provider-tenant-org-preview-card__stat-value">{utilization}%</span>
                  </div>
                </div>

                <div className="provider-tenant-org-preview-card__bars">
                  <div className="provider-tenant-org-preview-card__bar-row">
                    <span className="provider-tenant-org-preview-card__bar-label">vCPU</span>
                    <TenantOrgUsageBar metric={row.vcpu} />
                  </div>
                  <div className="provider-tenant-org-preview-card__bar-row">
                    <span className="provider-tenant-org-preview-card__bar-label">Memory</span>
                    <TenantOrgUsageBar metric={row.ram} />
                  </div>
                  <div className="provider-tenant-org-preview-card__bar-row">
                    <span className="provider-tenant-org-preview-card__bar-label">Storage</span>
                    <TenantOrgUsageBar metric={row.storage} />
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/** PatternFly table: tenant orgs with usage bars and optional row actions (demo). */
export function ProviderTenantOrganizationsTable({
  wrapClassName,
  statusFilter,
  showActions = true,
  showUsersAndVmsColumns = true,
}: ProviderTenantOrganizationsTableProps) {
  const [actionsMenuOpenId, setActionsMenuOpenId] = useState<string | null>(null)
  const wrapClass = ['provider-tenant-orgs-table-wrap', wrapClassName].filter(Boolean).join(' ')

  const rowsToShow = useMemo(() => {
    if (statusFilter === undefined || statusFilter === 'all') return PROVIDER_TENANT_ORG_ROWS
    return PROVIDER_TENANT_ORG_ROWS.filter((r) => r.status === statusFilter)
  }, [statusFilter])

  const columnCount =
    1 +
    (showUsersAndVmsColumns ? 2 : 0) +
    4 +
    1 +
    (showActions ? 1 : 0)

  return (
    <div className={wrapClass}>
      <table
        className={`${tableStyles.table} ${tableStyles.modifiers.striped} provider-tenant-orgs-table`}
        aria-label="Tenant organizations"
      >
        <thead className={tableStyles.tableThead}>
          <tr className={tableStyles.tableTr}>
            <th className={tableStyles.tableTh} scope="col">
              Organization
            </th>
            {showUsersAndVmsColumns ? (
              <th
                className={`${tableStyles.tableTh} ${tableStyles.modifiers.fitContent} provider-tenant-orgs-table__th--count`}
                scope="col"
              >
                Users
              </th>
            ) : null}
            {showUsersAndVmsColumns ? (
              <th
                className={`${tableStyles.tableTh} ${tableStyles.modifiers.fitContent} provider-tenant-orgs-table__th--count`}
                scope="col"
              >
                VMs
              </th>
            ) : null}
            <th className={`${tableStyles.tableTh} provider-tenant-orgs-table__th--usage`} scope="col">
              vCPU
            </th>
            <th className={`${tableStyles.tableTh} provider-tenant-orgs-table__th--usage`} scope="col">
              Memory
            </th>
            <th className={`${tableStyles.tableTh} provider-tenant-orgs-table__th--usage`} scope="col">
              GPU
            </th>
            <th className={`${tableStyles.tableTh} provider-tenant-orgs-table__th--usage`} scope="col">
              Storage
            </th>
            <th className={`${tableStyles.tableTh} ${tableStyles.modifiers.fitContent}`} scope="col">
              Status
            </th>
            {showActions ? (
              <th
                className={`${tableStyles.tableTh} ${tableStyles.tableAction} ${tableStyles.modifiers.fitContent}`}
                aria-label="Actions"
                scope="col"
              >
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className={tableStyles.tableTbody}>
          {rowsToShow.length === 0 ? (
            <tr className={tableStyles.tableTr}>
              <td className={tableStyles.tableTd} colSpan={columnCount}>
                No organizations match the selected status.
              </td>
            </tr>
          ) : (
            rowsToShow.map((row) => (
              <tr key={row.id} className={tableStyles.tableTr}>
                <td className={tableStyles.tableTd} data-label="Organization">
                  <strong>{row.organization}</strong>
                </td>
                {showUsersAndVmsColumns ? (
                  <td
                    className={`${tableStyles.tableTd} provider-tenant-orgs-table__td--count`}
                    data-label="Users"
                  >
                    {row.users}
                  </td>
                ) : null}
                {showUsersAndVmsColumns ? (
                  <td
                    className={`${tableStyles.tableTd} provider-tenant-orgs-table__td--count`}
                    data-label="VMs"
                  >
                    {row.vms}
                  </td>
                ) : null}
                <td className={`${tableStyles.tableTd} provider-tenant-orgs-table__td--usage`} data-label="vCPU">
                  <TenantOrgUsageBar metric={row.vcpu} />
                </td>
                <td className={`${tableStyles.tableTd} provider-tenant-orgs-table__td--usage`} data-label="Memory">
                  <TenantOrgUsageBar metric={row.ram} />
                </td>
                <td className={`${tableStyles.tableTd} provider-tenant-orgs-table__td--usage`} data-label="GPU">
                  <TenantOrgUsageBar metric={row.gpu} />
                </td>
                <td className={`${tableStyles.tableTd} provider-tenant-orgs-table__td--usage`} data-label="Storage">
                  <TenantOrgUsageBar metric={row.storage} />
                </td>
                <td className={tableStyles.tableTd} data-label="Status">
                  <Label color={statusLabelColor(row.status)}>{row.status}</Label>
                </td>
                {showActions ? (
                  <td
                    className={`${tableStyles.tableTd} ${tableStyles.tableAction} ${tableStyles.modifiers.action} ${tableStyles.modifiers.fitContent}`}
                    data-label="Actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Dropdown
                      isOpen={actionsMenuOpenId === row.id}
                      onOpenChange={(open) => setActionsMenuOpenId(open ? row.id : null)}
                      onSelect={() => setActionsMenuOpenId(null)}
                      popperProps={{ placement: 'bottom-end' }}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          variant="plain"
                          size="sm"
                          isExpanded={actionsMenuOpenId === row.id}
                          onClick={() => setActionsMenuOpenId((cur) => (cur === row.id ? null : row.id))}
                          aria-label={`Actions for ${row.organization}`}
                          icon={<EllipsisVIcon />}
                        />
                      )}
                    >
                      <DropdownList>
                        <DropdownItem
                          key="view"
                          onClick={(e) => {
                            e.preventDefault()
                            setActionsMenuOpenId(null)
                          }}
                        >
                          View details
                        </DropdownItem>
                        <DropdownItem
                          key="allocation"
                          onClick={(e) => {
                            e.preventDefault()
                            setActionsMenuOpenId(null)
                          }}
                        >
                          Edit allocation
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
