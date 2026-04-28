import { Card, CardBody, Content, Title } from '@patternfly/react-core'
import type { DemoTenantId } from './demoTenant'
import { DEMO_TENANT_LABEL } from './demoTenant'

export type TenantAdminPlaceholderPageProps = {
  demoTenantId: DemoTenantId
  title: string
  /** Shown above the optional card; ignored when `omitIntro` is true. */
  lede?: string
  /** When true, only the intro line is shown (no inset feature card). */
  omitFeatureCard?: boolean
  /** When true, no intro paragraph (lede / placeholder copy) is rendered. */
  omitIntro?: boolean
}

/** Tenant admin — placeholder route (Infrastructure / Organization demo). */
export function TenantAdminPlaceholderPage({
  demoTenantId,
  title,
  lede = '',
  omitFeatureCard = false,
  omitIntro = false,
}: TenantAdminPlaceholderPageProps) {
  const tenantLabel = DEMO_TENANT_LABEL[demoTenantId]

  return (
    <div
      className="osac-tenant-admin-page"
      {...(omitFeatureCard ? { 'aria-label': title } : {})}
    >
      {omitIntro ? null : (
        <Content
          component="p"
          style={{
            margin: 0,
            marginBottom: omitFeatureCard ? 0 : 'var(--pf-t--global--spacer--md)',
            maxWidth: '48rem',
            color: 'var(--pf-t--global--text--color--subtle)',
          }}
        >
          {lede}
          {lede ? ' ' : null}
          This screen is a static placeholder for <strong>{tenantLabel}</strong>.
        </Content>
      )}
      {omitFeatureCard ? null : (
        <Card component="article">
          <CardBody>
            <Title headingLevel="h2" size="xl" style={{ marginTop: 0 }}>
              {title}
            </Title>
            <Content component="p" style={{ margin: 0, color: 'var(--pf-t--global--text--color--subtle)' }}>
              Configure policies, integrations, and reporting here in a full product build.
            </Content>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
