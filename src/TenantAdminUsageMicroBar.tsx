/** Used / total + percent + bar — same structure and styles as Provider admin tenant org usage (`.provider-tenant-orgs-usage`). */

export type TenantAdminUsageMicroBarProps = {
  used: number
  total: number
  /** Left side of the top row, e.g. "120 / 150" or "48 / 96 GiB". */
  valueLabel: string
  /** Accessible description of what is being measured. */
  ariaLabel: string
  /** When false, omit the right-hand percentage (e.g. duplicate with label). */
  showRightPercent?: boolean
}

export function usageMicroBarPercent(used: number, total: number): number {
  if (!Number.isFinite(used) || !Number.isFinite(total)) return 0
  if (total <= 0) return used > 0 ? 100 : 0
  return Math.min(100, Math.max(0, Math.round((used / total) * 100)))
}

export function formatStorageTbPair(usedTb: number, allocTb: number): string {
  const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1))
  return `${fmt(usedTb)} / ${fmt(allocTb)} TB`
}

/** Human-readable GiB pair; uses TiB when both sides are large. */
export function formatMemoryGiBPair(usedGiB: number, allocGiB: number): string {
  const useTiB = usedGiB >= 512 || allocGiB >= 512
  if (useTiB) {
    const u = usedGiB / 1024
    const a = allocGiB / 1024
    const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1))
    return `${fmt(u)} TiB / ${fmt(a)} TiB`
  }
  return `${usedGiB} / ${allocGiB} GiB`
}

export function TenantAdminUsageMicroBar({
  used,
  total,
  valueLabel,
  ariaLabel,
  showRightPercent = true,
}: TenantAdminUsageMicroBarProps) {
  const pct = usageMicroBarPercent(used, total)
  const trackAriaLabel = valueLabel
    ? `${ariaLabel}: ${valueLabel}, ${pct} percent used`
    : `${ariaLabel}: no usage data`

  return (
    <div className="provider-tenant-orgs-usage">
      <div className="provider-tenant-orgs-usage__labels">
        {valueLabel ? (
          <span className="provider-tenant-orgs-usage__fraction">{valueLabel}</span>
        ) : (
          <span className="provider-tenant-orgs-usage__fraction provider-tenant-orgs-usage__fraction--muted">
            —
          </span>
        )}
        {showRightPercent ? <span className="provider-tenant-orgs-usage__pct">{pct}%</span> : null}
      </div>
      <div
        className="provider-tenant-orgs-usage__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={trackAriaLabel}
      >
        <div className="provider-tenant-orgs-usage__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
