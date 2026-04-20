export type DemoTenantId = 'northstar' | 'evergreen' | 'vertexa'

/** OSAC demo shell: VMaaS workspace, tenant admin, or provider platform console. */
export type DemoShellRole = 'tenantUser' | 'tenantAdmin' | 'providerAdmin'

export const DEMO_VM_POWER_COUNTS: Record<
  DemoTenantId,
  { running: number; paused: number; stopped: number }
> = {
  northstar: { running: 7, paused: 1, stopped: 3 },
  evergreen: { running: 5, paused: 2, stopped: 5 },
  /** Provider console id — aggregate stats use bank tenants; this row is unused for inventory. */
  vertexa: { running: 0, paused: 0, stopped: 0 },
}

export function demoVmPowerTotal(tenantId: DemoTenantId): number {
  const c = DEMO_VM_POWER_COUNTS[tenantId]
  return c.running + c.paused + c.stopped
}

export const DEMO_TENANT_LABEL: Record<DemoTenantId, string> = {
  northstar: 'Northstar Bank',
  evergreen: 'Bluestone Financial Group',
  vertexa: 'Vertexa Cloud Solutions',
}

/** Signed-in display name for tenant user: masthead, VM workspace dashboard, VM ownership, activities (demo). */
export const DEMO_TENANT_DISPLAY_USER: Record<DemoTenantId, string> = {
  northstar: 'Chris Morgan',
  evergreen: 'Emerson Cruz',
  vertexa: 'Alex Johnson',
}

/** Signed-in display name for tenant admin console (masthead and admin pages only; demo). */
export const DEMO_TENANT_DISPLAY_ADMIN: Record<DemoTenantId, string> = {
  northstar: 'Jordan Lee',
  evergreen: 'Marcus Chen',
  vertexa: 'Alex Johnson',
}

/** Provider admin sign-in (Vertexa platform console). */
export const DEMO_VERTEXA_PROVIDER_LOGIN_EMAIL = 'alex.johnson@vertexacloud.com'

/** Masthead display name for provider admin (Vertexa). */
export const DEMO_PROVIDER_ADMIN_DISPLAY_NAME = 'Alex Johnson'

/** Pre-filled login identifier on institution sign-in pages for tenant user (demo). */
export const DEMO_TENANT_LOGIN_EMAIL_USER: Record<DemoTenantId, string> = {
  northstar: 'cmorgan@northstarbank.com',
  evergreen: 'ecruz@bluestonefinancial.com',
  vertexa: DEMO_VERTEXA_PROVIDER_LOGIN_EMAIL,
}

/** Pre-filled login identifier on institution sign-in pages for tenant admin (demo). */
export const DEMO_TENANT_LOGIN_EMAIL_ADMIN: Record<DemoTenantId, string> = {
  northstar: 'jlee@northstarbank.com',
  evergreen: 'marcus.chen@bluestonefinancial.com',
  vertexa: DEMO_VERTEXA_PROVIDER_LOGIN_EMAIL,
}

export function demoLoginEmailForRole(
  tenantId: DemoTenantId,
  role: DemoShellRole,
): string {
  if (role === 'providerAdmin') {
    return DEMO_VERTEXA_PROVIDER_LOGIN_EMAIL
  }
  return role === 'tenantAdmin'
    ? DEMO_TENANT_LOGIN_EMAIL_ADMIN[tenantId]
    : DEMO_TENANT_LOGIN_EMAIL_USER[tenantId]
}
