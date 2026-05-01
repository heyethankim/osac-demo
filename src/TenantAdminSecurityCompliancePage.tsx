import { useState } from 'react'
import { Content, Form, PageSection, Switch } from '@patternfly/react-core'
import type { DemoTenantId } from './demoTenant'

export type TenantAdminSecurityCompliancePageProps = {
  demoTenantId: DemoTenantId
}

type ToggleRowProps = {
  id: string
  title: string
  description: string
  isChecked: boolean
  onChange: (checked: boolean) => void
}

function SecurityToggleRow({ id, title, description, isChecked, onChange }: ToggleRowProps) {
  return (
    <div className="tenant-admin-security-toggle-row">
      <div className="tenant-admin-security-toggle-row__text">
        <div className="tenant-admin-security-toggle-row__title" id={`${id}-label`}>
          {title}
        </div>
        <Content component="p" className="tenant-admin-security-toggle-row__description">
          {description}
        </Content>
      </div>
      <Switch
        id={id}
        aria-labelledby={`${id}-label`}
        isChecked={isChecked}
        onChange={(_e, checked) => onChange(checked)}
      />
    </div>
  )
}

/** Tenant admin — security & compliance toggles (demo; not persisted). */
export function TenantAdminSecurityCompliancePage(_props: TenantAdminSecurityCompliancePageProps) {
  const [requireMfa, setRequireMfa] = useState(true)
  const [projectIsolation, setProjectIsolation] = useState(true)
  const [apiAccess, setApiAccess] = useState(true)
  const [auditLogging, setAuditLogging] = useState(true)

  return (
    <div className="osac-tenant-admin-page">
      <PageSection aria-label="Security and compliance" className="tenant-admin-settings-page-section">
        <Form className="tenant-admin-settings-form tenant-admin-security-form">
          <SecurityToggleRow
            id="tenant-admin-sec-mfa"
            title="Require multi-factor authentication"
            description="Force all users to enable MFA"
            isChecked={requireMfa}
            onChange={setRequireMfa}
          />
          <SecurityToggleRow
            id="tenant-admin-sec-project-isolation"
            title="Project isolation"
            description="Prevent resource sharing between projects"
            isChecked={projectIsolation}
            onChange={setProjectIsolation}
          />
          <SecurityToggleRow
            id="tenant-admin-sec-api-access"
            title="API access"
            description="Allow users to generate API tokens"
            isChecked={apiAccess}
            onChange={setApiAccess}
          />
          <SecurityToggleRow
            id="tenant-admin-sec-audit-logging"
            title="Audit logging"
            description="Log all administrative actions"
            isChecked={auditLogging}
            onChange={setAuditLogging}
          />
        </Form>
      </PageSection>
    </div>
  )
}
