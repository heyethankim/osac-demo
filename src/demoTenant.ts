export type DemoTenantId = 'northstar' | 'evergreen' | 'vertexa'

/** OSAC demo shell: VMaaS workspace, tenant admin, or provider platform console. */
export type DemoShellRole = 'tenantUser' | 'tenantAdmin' | 'providerAdmin'

/**
 * When shell is tenant user for a bank: `vmWorkspace` = line-of-business user (Chris / Emerson) from the
 * landing “Tenant user” path; `adminPortal` = same operator as admin (Priya / Marcus) after “Switch to user”.
 */
export type BankTenantUserEntry = 'vmWorkspace' | 'adminPortal'

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

/** Tenant admin / user shell, landing CTAs, and in-tenant copy (demo). */
export const DEMO_TENANT_LABEL: Record<DemoTenantId, string> = {
  northstar: 'North Summit Bank',
  evergreen: 'BlueSolace Financial Group',
  vertexa: 'Vertexa Cloud Solutions',
}

/**
 * Provider-console org directory: legacy contracted customer names where the tenant shell uses a demo rebrand.
 */
export const DEMO_TENANT_PROVIDER_ORG_LABEL: Record<DemoTenantId, string> = {
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
  northstar: 'Priya Nair',
  evergreen: 'Marcus Chen',
  vertexa: 'Alex Johnson',
}

/** Provider admin sign-in (Vertexa platform console). */
export const DEMO_VERTEXA_PROVIDER_LOGIN_EMAIL = 'alex.johnson@vertexacloud.com'

/** Masthead display name for provider admin (Vertexa). */
export const DEMO_PROVIDER_ADMIN_DISPLAY_NAME = 'Alex Johnson'

/** Pre-filled login identifier on institution sign-in pages for tenant user (demo). */
export const DEMO_TENANT_LOGIN_EMAIL_USER: Record<DemoTenantId, string> = {
  northstar: 'cmorgan@northsummitbank.com',
  evergreen: 'ecruz@bluesolacefinancial.com',
  vertexa: DEMO_VERTEXA_PROVIDER_LOGIN_EMAIL,
}

/** Pre-filled login identifier on institution sign-in pages for tenant admin (demo). */
export const DEMO_TENANT_LOGIN_EMAIL_ADMIN: Record<DemoTenantId, string> = {
  northstar: 'pnair@northsummitbank.com',
  evergreen: 'marcus.chen@bluesolacefinancial.com',
  vertexa: DEMO_VERTEXA_PROVIDER_LOGIN_EMAIL,
}

/** Operator “user” account (Priya / Marcus) — tenant admin directory + switch-to-user from admin shell. */
export const DEMO_TENANT_LOGIN_EMAIL_OPERATOR_USER: Record<DemoTenantId, string> = {
  northstar: 'priya.nair.user@northsummitbank.com',
  evergreen: 'marcus.chen.user@bluesolacefinancial.com',
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

/** Masthead, welcome line, and account menu: display name for the active demo shell role. */
export function demoAccountDisplayName(
  tenantId: DemoTenantId,
  role: DemoShellRole,
  bankTenantUserEntry: BankTenantUserEntry | null = null,
): string {
  if (role === 'providerAdmin') {
    return DEMO_PROVIDER_ADMIN_DISPLAY_NAME
  }
  if (role === 'tenantAdmin') {
    return DEMO_TENANT_DISPLAY_ADMIN[tenantId]
  }
  if (role === 'tenantUser') {
    if (tenantId === 'northstar' || tenantId === 'evergreen') {
      if (bankTenantUserEntry === 'adminPortal') {
        return DEMO_TENANT_DISPLAY_ADMIN[tenantId]
      }
      return DEMO_TENANT_DISPLAY_USER[tenantId]
    }
  }
  return DEMO_TENANT_DISPLAY_USER[tenantId]
}

/**
 * Demo sign-in does not validate password — keep the field empty on every host (e.g. GitHub Pages)
 * so viewers do not see a fake masked “password” blob. Click **Login** to continue.
 */
export const DEMO_LOGIN_PREFILLED_PASSWORD = ''

/** Stable key so the masthead account control remounts when persona or demo names change (avoids stale PF toggle text). */
export function demoMastheadAccountControlKey(
  tenantId: DemoTenantId,
  role: DemoShellRole,
  bankTenantUserEntry: BankTenantUserEntry | null = null,
): string {
  return `${role}:${tenantId}:${bankTenantUserEntry ?? 'na'}:${demoAccountDisplayName(tenantId, role, bankTenantUserEntry)}`
}
