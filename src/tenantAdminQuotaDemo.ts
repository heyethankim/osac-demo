import type { TenantAdminUserRow } from './TenantAdminUserManagementPage'

export type OrgQuotaBarRow = {
  name: string
  used: number
  remaining: number
  limit: number
  unit: string
}

export function formatStorTb(n: number): string {
  return Number.isInteger(n) ? `${n}` : n.toFixed(1)
}

function shortUserName(full: string): string {
  const parts = full.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return full
  if (parts.length === 1) return parts[0]!
  return `${parts[0]!} ${parts[parts.length - 1]!.charAt(0)}.`
}

function pctOfAlloc(used: number, alloc: number): number {
  if (alloc <= 0) return 0
  return Math.min(100, Math.round((used / alloc) * 100))
}

/** Aggregate per-user caps and usage into organization-level rows for the org quota chart. */
export function buildOrgQuotaBarsFromUsers(rows: readonly TenantAdminUserRow[]): OrgQuotaBarRow[] {
  let vUsed = 0
  let vAlloc = 0
  let mUsed = 0
  let mAlloc = 0
  let gUsed = 0
  let gAlloc = 0
  let sUsed = 0
  let sAlloc = 0
  for (const r of rows) {
    const x = r.resource
    vUsed += x.vcpuUsed
    vAlloc += x.vcpuAlloc
    mUsed += x.memUsedGiB
    mAlloc += x.memAllocGiB
    gUsed += x.gpuUsed
    gAlloc += x.gpuAlloc
    sUsed += x.storUsedTb
    sAlloc += x.storAllocTb
  }
  return [
    {
      name: 'vCPU',
      used: vUsed,
      remaining: Math.max(0, vAlloc - vUsed),
      limit: vAlloc,
      unit: 'vCPUs',
    },
    {
      name: 'Memory (GiB)',
      used: mUsed,
      remaining: Math.max(0, mAlloc - mUsed),
      limit: mAlloc,
      unit: 'GiB',
    },
    {
      name: 'GPU',
      used: gUsed,
      remaining: Math.max(0, gAlloc - gUsed),
      limit: gAlloc,
      unit: 'devices',
    },
    {
      name: 'Storage (TB)',
      used: sUsed,
      remaining: Math.max(0, sAlloc - sUsed),
      limit: sAlloc,
      unit: 'TB',
    },
  ]
}

export type UserQuotaDistributionRow = {
  displayName: string
  vcpuPct: number
  memPct: number
  gpuPct: number
  storPct: number
  vcpuUsed: number
  vcpuAlloc: number
  memUsedGiB: number
  memAllocGiB: number
  gpuUsed: number
  gpuAlloc: number
  storUsedTb: number
  storAllocTb: number
}

/** Per-person utilization as % of that person's assigned quota (demo chart). */
export function buildUserQuotaDistributionRows(
  rows: readonly TenantAdminUserRow[],
  maxUsers = 8,
): UserQuotaDistributionRow[] {
  return rows.slice(0, maxUsers).map((r) => {
    const x = r.resource
    return {
      displayName: shortUserName(r.name),
      vcpuPct: pctOfAlloc(x.vcpuUsed, x.vcpuAlloc),
      memPct: pctOfAlloc(x.memUsedGiB, x.memAllocGiB),
      gpuPct: pctOfAlloc(x.gpuUsed, x.gpuAlloc),
      storPct: pctOfAlloc(x.storUsedTb, x.storAllocTb),
      vcpuUsed: x.vcpuUsed,
      vcpuAlloc: x.vcpuAlloc,
      memUsedGiB: x.memUsedGiB,
      memAllocGiB: x.memAllocGiB,
      gpuUsed: x.gpuUsed,
      gpuAlloc: x.gpuAlloc,
      storUsedTb: x.storUsedTb,
      storAllocTb: x.storAllocTb,
    }
  })
}
