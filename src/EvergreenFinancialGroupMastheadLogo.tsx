import { BluestoneMarkIcon } from './BluestoneMarkIcon'

export type EvergreenFinancialGroupMastheadLogoProps = {
  /** Tenant shell uses the in-app demo name; provider org cards keep the platform directory label. */
  brandPresentation?: 'tenantShell' | 'providerOrg'
}

/** Masthead mark + wordmark (tenant shell: BlueSolace; provider directory: Bluestone). Demo id: `evergreen`. */
export function EvergreenFinancialGroupMastheadLogo({
  brandPresentation = 'tenantShell',
}: EvergreenFinancialGroupMastheadLogoProps) {
  const line1 = brandPresentation === 'providerOrg' ? 'Bluestone' : 'BlueSolace'
  const ariaLabel =
    brandPresentation === 'providerOrg' ? 'Bluestone Financial Group' : 'BlueSolace Financial Group'
  return (
    <div className="evergreen-masthead-brand" role="img" aria-label={ariaLabel}>
      <span className="evergreen-masthead-brand__mark" aria-hidden>
        <BluestoneMarkIcon className="evergreen-masthead-brand__logo-img" />
      </span>
      <span className="evergreen-masthead-brand__text">
        <span className="evergreen-masthead-brand__line1">{line1}</span>
        <span className="evergreen-masthead-brand__line2">Financial Group</span>
      </span>
    </div>
  )
}
