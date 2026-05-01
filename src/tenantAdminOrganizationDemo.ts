import type { DemoTenantId } from './demoTenant'
import { DEMO_TENANT_LABEL, DEMO_TENANT_LOGIN_EMAIL_ADMIN } from './demoTenant'

export type TenantAdminOrganizationProfile = {
  organizationName: string
  organizationId: string
  contactEmail: string
}

const ORGANIZATION_IDS: Record<DemoTenantId, string> = {
  northstar: 'org-northstar-7c4e91',
  evergreen: 'org-evergreen-2b8d3a',
  vertexa: 'org-vertexa-9f1c2d',
}

/** Demo org directory fields for Tenant admin → Organization settings. */
export function getTenantAdminOrganizationProfile(tenantId: DemoTenantId): TenantAdminOrganizationProfile {
  return {
    organizationName: DEMO_TENANT_LABEL[tenantId],
    organizationId: ORGANIZATION_IDS[tenantId],
    contactEmail: DEMO_TENANT_LOGIN_EMAIL_ADMIN[tenantId],
  }
}
