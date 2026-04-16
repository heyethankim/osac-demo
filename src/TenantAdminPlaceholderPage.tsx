import { Card, CardBody, Content, Title } from '@patternfly/react-core'
import type { DemoTenantId } from './demoTenant'
import { DEMO_TENANT_LABEL } from './demoTenant'

export type TenantAdminPlaceholderPageProps = {
  demoTenantId: DemoTenantId
  title: string
  lede: string
}

/** Tenant admin — placeholder route (Infrastructure / Organization demo). */
export function TenantAdminPlaceholderPage({
  demoTenantId,
  title,
  lede,
}: TenantAdminPlaceholderPageProps) {
  const tenantLabel = DEMO_TENANT_LABEL[demoTenantId]

  return (
    <div className="osac-tenant-admin-page">
      <Content
        component="p"
        style={{
          margin: 0,
          marginBottom: 'var(--pf-t--global--spacer--md)',
          maxWidth: '48rem',
          color: 'var(--pf-t--global--text--color--subtle)',
        }}
      >
        {lede} This screen is a static placeholder for <strong>{tenantLabel}</strong>.
      </Content>
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
    </div>
  )
}
