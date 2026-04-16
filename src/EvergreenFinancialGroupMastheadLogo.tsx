import { BluestoneMarkIcon } from './BluestoneMarkIcon'

/** Masthead mark + wordmark for the Bluestone Financial Group tenant shell (demo id: evergreen). */
export function EvergreenFinancialGroupMastheadLogo() {
  return (
    <div className="evergreen-masthead-brand" role="img" aria-label="Bluestone Financial Group">
      <span className="evergreen-masthead-brand__mark" aria-hidden>
        <BluestoneMarkIcon className="evergreen-masthead-brand__logo-img" />
      </span>
      <span className="evergreen-masthead-brand__text">
        <span className="evergreen-masthead-brand__line1">Bluestone</span>
        <span className="evergreen-masthead-brand__line2">Financial Group</span>
      </span>
    </div>
  )
}
