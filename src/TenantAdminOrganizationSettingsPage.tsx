import { useEffect, useMemo, useState } from 'react'
import { Form, FormGroup, PageSection, TextInput } from '@patternfly/react-core'
import type { DemoTenantId } from './demoTenant'
import { getTenantAdminOrganizationProfile } from './tenantAdminOrganizationDemo'

export type TenantAdminOrganizationSettingsPageProps = {
  demoTenantId: DemoTenantId
}

/** Tenant admin — organization profile (demo; values are not persisted). */
export function TenantAdminOrganizationSettingsPage({ demoTenantId }: TenantAdminOrganizationSettingsPageProps) {
  const profile = useMemo(() => getTenantAdminOrganizationProfile(demoTenantId), [demoTenantId])
  const [organizationName, setOrganizationName] = useState(profile.organizationName)
  const [organizationId, setOrganizationId] = useState(profile.organizationId)
  const [contactEmail, setContactEmail] = useState(profile.contactEmail)

  useEffect(() => {
    setOrganizationName(profile.organizationName)
    setOrganizationId(profile.organizationId)
    setContactEmail(profile.contactEmail)
  }, [profile])

  return (
    <div className="osac-tenant-admin-page">
      <PageSection aria-label="Organization settings" className="tenant-admin-settings-page-section">
        <Form id="tenant-admin-organization-settings-form" className="tenant-admin-settings-form">
          <FormGroup label="Organization name" fieldId="tenant-admin-org-name">
            <TextInput
              id="tenant-admin-org-name"
              name="organizationName"
              type="text"
              value={organizationName}
              onChange={(_e, v) => setOrganizationName(v)}
              aria-label="Organization name"
            />
          </FormGroup>
          <FormGroup label="Organization ID" fieldId="tenant-admin-org-id">
            <TextInput
              id="tenant-admin-org-id"
              name="organizationId"
              type="text"
              value={organizationId}
              aria-label="Organization ID"
              isDisabled
            />
          </FormGroup>
          <FormGroup label="Contact email" fieldId="tenant-admin-org-contact-email">
            <TextInput
              id="tenant-admin-org-contact-email"
              name="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(_e, v) => setContactEmail(v)}
              aria-label="Contact email"
            />
          </FormGroup>
        </Form>
      </PageSection>
    </div>
  )
}
