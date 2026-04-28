import type { BankTenantUserEntry, DemoShellRole, DemoTenantId } from './demoTenant'

/** Deep-link from the role landing page (`?entry=…&tenant=…`) — each button opens a new window. */
export type OsacLandingEntry =
  | { kind: 'provider' }
  | { kind: 'tenant-admin'; tenant: 'northstar' | 'evergreen' }
  | { kind: 'tenant-user'; tenant: 'northstar' | 'evergreen' }

export function readOsacLandingEntryQuery(): OsacLandingEntry | null {
  if (typeof window === 'undefined') return null
  const p = new URLSearchParams(window.location.search)
  const entry = p.get('entry')
  if (entry === 'provider') return { kind: 'provider' }
  const tenant = p.get('tenant')
  if (tenant !== 'northstar' && tenant !== 'evergreen') return null
  if (entry === 'tenant-admin') return { kind: 'tenant-admin', tenant }
  if (entry === 'tenant-user') return { kind: 'tenant-user', tenant }
  return null
}

/** Build same-origin URL that bootstraps sign-in for one persona (new tab / window). */
export function buildOsacLandingEntryUrl(entry: OsacLandingEntry): string {
  const u = new URL(window.location.href)
  u.hash = ''
  const p = new URLSearchParams()
  if (entry.kind === 'provider') {
    p.set('entry', 'provider')
  } else {
    p.set('entry', entry.kind === 'tenant-admin' ? 'tenant-admin' : 'tenant-user')
    p.set('tenant', entry.tenant)
  }
  u.search = p.toString()
  return u.toString()
}

export function stripOsacLandingEntryParamsFromUrl(): void {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (!url.searchParams.has('entry')) return
  url.searchParams.delete('entry')
  url.searchParams.delete('tenant')
  const q = url.searchParams.toString()
  window.history.replaceState({}, '', `${url.pathname}${q ? `?${q}` : ''}${url.hash}`)
}

export type OsacInitialSessionFromLocation = {
  selectedDemoTenant: DemoTenantId | null
  demoShellRole: DemoShellRole
  bankTenantUserEntry: BankTenantUserEntry | null
  /** True when `readOsacLandingEntryQuery()` matched — strip params after first paint. */
  hadLandingEntryQuery: boolean
}

export function readInitialSessionFromLandingEntry(): OsacInitialSessionFromLocation {
  const empty: OsacInitialSessionFromLocation = {
    selectedDemoTenant: null,
    demoShellRole: 'tenantUser',
    bankTenantUserEntry: null,
    hadLandingEntryQuery: false,
  }
  if (typeof window === 'undefined') return empty
  const landing = readOsacLandingEntryQuery()
  if (!landing) return empty
  if (landing.kind === 'provider') {
    return {
      selectedDemoTenant: 'vertexa',
      demoShellRole: 'providerAdmin',
      bankTenantUserEntry: null,
      hadLandingEntryQuery: true,
    }
  }
  if (landing.kind === 'tenant-admin') {
    return {
      selectedDemoTenant: landing.tenant,
      demoShellRole: 'tenantAdmin',
      bankTenantUserEntry: null,
      hadLandingEntryQuery: true,
    }
  }
  return {
    selectedDemoTenant: landing.tenant,
    demoShellRole: 'tenantUser',
    bankTenantUserEntry: 'vmWorkspace',
    hadLandingEntryQuery: true,
  }
}
