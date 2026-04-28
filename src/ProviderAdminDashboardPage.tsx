import type { ComponentType, CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import { CatalogIcon } from '@patternfly/react-icons/dist/esm/icons/catalog-icon'
import { InfrastructureIcon } from '@patternfly/react-icons/dist/esm/icons/infrastructure-icon'
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon'
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  FormSelect,
  FormSelectOption,
  Label,
  Title,
} from '@patternfly/react-core'
import { demoVmPowerTotal } from './demoTenant'
import { buildProviderAdminRecentActivities } from './providerAdminRecentActivitiesDemo'
import {
  ProviderTenantOrganizationsTable,
  PROVIDER_TENANT_ORG_STATUS_FILTER_OPTIONS,
  type ProviderTenantOrgStatusFilter,
} from './ProviderTenantOrganizationsTable'

export type ProviderAdminDashboardNavTarget =
  | 'tenant-organizations'
  | 'users'
  | 'global-templates'
  | 'resource-allocation'
  | 'system-infrastructure'

export type ProviderAdminDashboardPageProps = {
  onNavigate: (target: ProviderAdminDashboardNavTarget) => void
}

const KPI_CARD_BODY_STYLE = { paddingTop: 'var(--pf-t--global--spacer--sm)' } as const

/** Match tenant user dashboard VM stat card caption (`App.tsx` captionStyle). */
const KPI_CARD_HINT_STYLE = {
  margin: 'var(--pf-t--global--spacer--sm) 0 0',
  color: 'var(--pf-t--global--text--color--subtle)',
  fontSize: 'var(--pf-t--global--font--size--body--sm)',
  lineHeight: 'var(--pf-t--global--font--line-height--body)',
} as const

type QuickActionIcon = ComponentType<{ className?: string; style?: CSSProperties }>

const QUICK_ACTIONS: {
  title: string
  hint: string
  nav: ProviderAdminDashboardNavTarget
  Icon: QuickActionIcon
  actionAria: string
}[] = [
  {
    title: 'Onboard new tenant',
    hint: 'Register an institution and open their admin workspace.',
    nav: 'tenant-organizations',
    Icon: PlusCircleIcon,
    actionAria: 'Start onboarding a new tenant',
  },
  {
    title: 'Deploy global template',
    hint: 'Publish or refresh a platform-wide image or service definition.',
    nav: 'global-templates',
    Icon: CatalogIcon,
    actionAria: 'Open global templates',
  },
  {
    title: 'View system health',
    hint: 'Check infrastructure topology and cross-region signals.',
    nav: 'system-infrastructure',
    Icon: InfrastructureIcon,
    actionAria: 'Open system infrastructure',
  },
]

type ProviderKpiCard = {
  title: string
  value: number
  hint: string
  nav: ProviderAdminDashboardNavTarget | null
  aria?: string
}

/** Provider admin — platform overview (demo). */
export function ProviderAdminDashboardPage({ onNavigate }: ProviderAdminDashboardPageProps) {
  const [tenantOrgStatusFilter, setTenantOrgStatusFilter] =
    useState<ProviderTenantOrgStatusFilter>('all')
  const recentActivities = useMemo(() => buildProviderAdminRecentActivities().slice(0, 5), [])
  const activeOrganizations = 2
  const totalVms = demoVmPowerTotal('northstar') + demoVmPowerTotal('evergreen')
  const totalUsers = 84
  const globalTemplates = 22

  const kpiCards: ProviderKpiCard[] = [
    {
      title: 'Active organization',
      value: activeOrganizations,
      hint: 'Tenants currently consuming capacity on this control plane.',
      nav: 'tenant-organizations' as const,
      aria: 'Open Tenant organizations',
    },
    {
      title: 'Total VMs',
      value: totalVms,
      hint: 'Aggregate powered fleet across registered tenant workspaces.',
      nav: null,
    },
    {
      title: 'Total users',
      value: totalUsers,
      hint: 'Unique identities with access across all tenants (demo aggregate).',
      nav: 'users' as const,
      aria: 'Open Users',
    },
    {
      title: 'Global templates',
      value: globalTemplates,
      hint: 'Published platform-wide images and service definitions.',
      nav: 'global-templates' as const,
      aria: 'Open Global templates',
    },
  ] as const

  return (
    <div className="osac-tenant-admin-page">
      <div className="osac-dashboard-vm-stats-grid">
        {kpiCards.map(({ title, value, hint, nav, aria }) => (
          <Card
            key={title}
            component="article"
            isFullHeight
            isClickable={nav !== null}
            className="tenant-admin-dashboard-kpi-card"
          >
            <CardHeader
              selectableActions={
                nav
                  ? {
                      onClickAction: () => onNavigate(nav),
                      selectableActionAriaLabel: `${title}, ${value}. ${aria}`,
                    }
                  : undefined
              }
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
        aria-label="Tenant organizations, platform shortcuts, and recent activities"
      >
        <div className="osac-dashboard-utilization-layout">
          <div className="osac-dashboard-utilization-main">
            <Card
              className="provider-admin-tenant-orgs-card"
              component="section"
              aria-labelledby="provider-admin-dashboard-tenant-orgs-title"
              isClickable
            >
              <CardHeader
                className="provider-admin-tenant-orgs-card__header"
                selectableActions={{
                  onClickAction: () => onNavigate('tenant-organizations'),
                  selectableActionAriaLabel:
                    'Tenant organizations preview. Open full tenant organizations directory',
                }}
              >
                <div className="provider-admin-tenant-orgs-card__header-row">
                  <CardTitle component="h2" id="provider-admin-dashboard-tenant-orgs-title">
                    Tenant organizations
                  </CardTitle>
                  <div
                    className="provider-admin-tenant-orgs-card__filter"
                    role="presentation"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <FormSelect
                      className="provider-admin-tenant-orgs-card__status-select"
                      id="provider-admin-tenant-orgs-status-filter"
                      value={tenantOrgStatusFilter}
                      onChange={(_, value) => setTenantOrgStatusFilter(value as ProviderTenantOrgStatusFilter)}
                      aria-label="Filter tenant organizations by status"
                    >
                      {PROVIDER_TENANT_ORG_STATUS_FILTER_OPTIONS.map((opt) => (
                        <FormSelectOption key={opt.value} value={opt.value} label={opt.label} />
                      ))}
                    </FormSelect>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="provider-admin-tenant-orgs-card__body">
                <ProviderTenantOrganizationsTable
                  wrapClassName="provider-admin-tenant-orgs-card__table-wrap"
                  statusFilter={tenantOrgStatusFilter}
                  showActions={false}
                  showUsersAndVmsColumns={false}
                />
              </CardBody>
            </Card>

            <div
              className="provider-admin-dashboard-action-cards"
              role="group"
              aria-label="Platform shortcuts"
            >
              {QUICK_ACTIONS.map(({ title, hint, nav, Icon, actionAria }) => (
                <Card
                  key={title}
                  component="article"
                  isFullHeight
                  isClickable
                  className="tenant-admin-dashboard-kpi-card"
                >
                  <CardHeader
                    selectableActions={{
                      onClickAction: () => onNavigate(nav),
                      selectableActionAriaLabel: `${title}. ${actionAria}`,
                    }}
                  >
                    <CardTitle component="h2" className="osac-dashboard-clickable-kpi-value">
                      {title}
                    </CardTitle>
                  </CardHeader>
                  <CardBody style={KPI_CARD_BODY_STYLE}>
                    <div className="provider-admin-dashboard-action-card__icon" aria-hidden>
                      <Icon style={{ width: '2rem', height: '2rem' }} />
                    </div>
                    <Content
                      component="p"
                      style={{
                        margin: 'var(--pf-t--global--spacer--sm) 0 0',
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {hint}
                    </Content>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          <aside
            className="osac-dashboard-utilization-sidebar"
            aria-labelledby="provider-admin-recent-activities-heading"
          >
            <Card
              className="tenant-admin-recent-activities osac-dashboard-recent-activity-card"
              component="section"
              aria-labelledby="provider-admin-recent-activities-heading"
            >
              <CardHeader>
                <CardTitle component="h2" id="provider-admin-recent-activities-heading">
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
