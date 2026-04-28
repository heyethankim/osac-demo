export type NorthstarBankMastheadLogoProps = {
  /**
   * Tenant shell uses the in-app demo institution name; provider org cards keep the platform directory label.
   */
  brandPresentation?: 'tenantShell' | 'providerOrg'
}

/**
 * Bank masthead mark — star-in-ring + wordmark (tenant shell: North Summit; provider directory: Northstar).
 */
export function NorthstarBankMastheadLogo({
  brandPresentation = 'tenantShell',
}: NorthstarBankMastheadLogoProps) {
  const line1 = brandPresentation === 'providerOrg' ? 'Northstar' : 'North Summit'
  const ariaLabel = brandPresentation === 'providerOrg' ? 'Northstar Bank' : 'North Summit Bank'
  return (
    <div className="northstar-masthead-brand" role="img" aria-label={ariaLabel}>
      <span className="northstar-masthead-brand__mark" aria-hidden>
        <span className="northstar-masthead-brand__ring">
          <svg viewBox="0 0 48 48" className="northstar-masthead-brand__star">
            <path
              fill="currentColor"
              d="M24 4l4.2 12.9h13.6L32.3 25.8l4.2 12.9L24 33.7l-12.5 5 4.2-12.9L6.2 16.9h13.6L24 4z"
            />
          </svg>
        </span>
      </span>
      <span className="northstar-masthead-brand__text">
        <span className="northstar-masthead-brand__line1">{line1}</span>
        <span className="northstar-masthead-brand__line2">Bank</span>
      </span>
    </div>
  )
}
