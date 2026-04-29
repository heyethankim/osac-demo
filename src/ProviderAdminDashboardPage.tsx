import type { ComponentType, CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import { BoltIcon } from '@patternfly/react-icons/dist/esm/icons/bolt-icon'
import { CatalogIcon } from '@patternfly/react-icons/dist/esm/icons/catalog-icon'
import { ClusterIcon } from '@patternfly/react-icons/dist/esm/icons/cluster-icon'
import { InfrastructureIcon } from '@patternfly/react-icons/dist/esm/icons/infrastructure-icon'
import { ModuleIcon } from '@patternfly/react-icons/dist/esm/icons/module-icon'
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon'
import {
  Button,
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
import { buildProviderAdminRecentActivities } from './providerAdminRecentActivitiesDemo'
import {
  ProviderTenantOrganizationsCards,
  PROVIDER_TENANT_ORG_STATUS_FILTER_OPTIONS,
  PROVIDER_TENANT_ORG_ROWS,
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

type ProviderPlatformMetricCardConfig = {
  title: string
  Icon: QuickActionIcon
  iconClass: string
  primary: string
  hint: string
  percent: number
  aria: string
}

const PROVIDER_PLATFORM_METRIC_CARDS: ProviderPlatformMetricCardConfig[] = [
  {
    title: 'GPU Utilization',
    Icon: BoltIcon,
    iconClass: 'provider-admin-platform-kpi-card__icon--gpu',
    primary: '46.2%',
    hint: '24 / 52 GPUs',
    percent: 46.2,
    aria: 'Open Resource allocation, GPU utilization 46.2 percent, 24 of 52 GPUs in use',
  },
  {
    title: 'AI Instances',
    Icon: ModuleIcon,
    iconClass: 'provider-admin-platform-kpi-card__icon--ai',
    primary: '11 / 26',
    hint: '42% allocated',
    percent: 42,
    aria: 'Open Resource allocation, 11 of 26 AI instances, 42 percent allocated',
  },
  {
    title: 'NVLink Clusters',
    Icon: ClusterIcon,
    iconClass: 'provider-admin-platform-kpi-card__icon--nvlink',
    primary: '1 / 2',
    hint: '72 GPUs per cluster',
    percent: 50,
    aria: 'Open Resource allocation, 1 of 2 NVLink clusters, 72 GPUs per cluster',
  },
]

function ProviderPlatformMetricCard({
  title,
  Icon,
  iconClass,
  primary,
  hint,
  percent,
  aria,
  onOpen,
}: ProviderPlatformMetricCardConfig & { onOpen: () => void }) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <Card
      component="article"
      isFullHeight
      isClickable
      className="tenant-admin-dashboard-kpi-card provider-admin-platform-kpi-card"
    >
      <CardHeader
        selectableActions={{
          onClickAction: onOpen,
          selectableActionAriaLabel: aria,
        }}
      >
        <div className="provider-admin-platform-kpi-card__head">
          <span className={`provider-admin-platform-kpi-card__icon ${iconClass}`} aria-hidden>
            <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
          </span>
          <CardTitle component="h2" className="provider-admin-platform-kpi-card__title">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardBody className="provider-admin-platform-kpi-card__body">
        <Title
          headingLevel="h3"
          size="4xl"
          className="provider-admin-platform-kpi-card__primary"
          style={{
            margin: 0,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {primary}
        </Title>
        <Content component="p" style={KPI_CARD_HINT_STYLE}>
          {hint}
        </Content>
        <div className="provider-admin-platform-kpi-card__bar-track" aria-hidden>
          <div className="provider-admin-platform-kpi-card__bar-fill" style={{ width: `${clamped}%` }} />
        </div>
      </CardBody>
    </Card>
  )
}

type ProviderDashboardTenantOrgView = 'recent' | ProviderTenantOrgStatusFilter

/** Provider admin — platform overview (demo). */
export function ProviderAdminDashboardPage({ onNavigate }: ProviderAdminDashboardPageProps) {
  const [tenantOrgView, setTenantOrgView] = useState<ProviderDashboardTenantOrgView>('recent')
  const recentActivities = useMemo(() => buildProviderAdminRecentActivities().slice(0, 5), [])
  const activeOrganizations = useMemo(
    () => PROVIDER_TENANT_ORG_ROWS.filter((row) => row.status === 'Active').length,
    [],
  )

  const kpiCards: ProviderKpiCard[] = [
    {
      title: 'Active organization',
      value: activeOrganizations,
      hint: 'Tenants currently consuming capacity on this control plane.',
      nav: 'tenant-organizations' as const,
      aria: 'Open Tenant organizations',
    },
  ] as const

  const dashboardStatusFilter: ProviderTenantOrgStatusFilter =
    tenantOrgView === 'recent' ? 'all' : tenantOrgView
  const recentChangesTenantIds = ['northstar', 'bluestone', 'summit-peak', 'lighthouse-capital']

  const tenantOrgViewOptions: { value: ProviderDashboardTenantOrgView; label: string }[] = [
    { value: 'recent', label: 'Most recent changes' },
    ...PROVIDER_TENANT_ORG_STATUS_FILTER_OPTIONS.filter((opt) => opt.value !== 'all').map((opt) => ({
      value: opt.value,
      label: `Status: ${opt.label}`,
    })),
  ]

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
                      onClickAction: () => onNavigate(nav!),
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
        {PROVIDER_PLATFORM_METRIC_CARDS.map((cfg) => (
          <ProviderPlatformMetricCard
            key={cfg.title}
            {...cfg}
            onOpen={() => onNavigate('resource-allocation')}
          />
        ))}
      </div>

      <section
        className="osac-dashboard-utilization-section provider-admin-dashboard-utilization-section"
        aria-label="Tenant organizations, platform shortcuts, and recent activities"
      >
        <div className="osac-dashboard-utilization-layout">
          <div className="osac-dashboard-utilization-main">
            <Card
              className="provider-admin-tenant-orgs-card"
              component="section"
              aria-labelledby="provider-admin-dashboard-tenant-orgs-title"
            >
              <CardHeader className="provider-admin-tenant-orgs-card__header">
                <div className="provider-admin-tenant-orgs-card__header-row">
                  <Title headingLevel="h2" size="xl" id="provider-admin-dashboard-tenant-orgs-title" style={{ margin: 0 }}>
                    Tenant organizations
                  </Title>
                  <div className="provider-admin-tenant-orgs-card__filter">
                    <FormSelect
                      className="provider-admin-tenant-orgs-card__status-select"
                      id="provider-admin-tenant-orgs-view-filter"
                      value={tenantOrgView}
                      onChange={(_, value) =>
                        setTenantOrgView(value as ProviderDashboardTenantOrgView)
                      }
                      aria-label="Filter tenant organizations"
                    >
                      {tenantOrgViewOptions.map((opt) => (
                        <FormSelectOption key={opt.value} value={opt.value} label={opt.label} />
                      ))}
                    </FormSelect>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="provider-admin-tenant-orgs-card__body">
                <ProviderTenantOrganizationsCards
                  wrapClassName="provider-admin-tenant-orgs-card__cards-wrap"
                  statusFilter={dashboardStatusFilter}
                  includedOrgIds={tenantOrgView === 'recent' ? recentChangesTenantIds : undefined}
                  hiddenOrgIds={['union-harbor']}
                />
              </CardBody>
            </Card>

            <div
              className="provider-admin-dashboard-action-cards"
              role="group"
              aria-label="Platform shortcuts"
            >
              {QUICK_ACTIONS.map(({ title, nav, Icon, actionAria }) => (
                <div key={title} className="provider-admin-dashboard-action-item">
                  <Button
                    variant="secondary"
                    className="provider-admin-dashboard-action-pill"
                    onClick={() => onNavigate(nav)}
                    aria-label={actionAria}
                    icon={<Icon style={{ width: '1rem', height: '1rem' }} />}
                    iconPosition="start"
                  >
                    {title}
                  </Button>
                </div>
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
