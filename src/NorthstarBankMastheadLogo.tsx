/**
 * Northstar Bank masthead mark — same star-in-ring + wordmark language as the sign-in screen.
 */
export function NorthstarBankMastheadLogo() {
  return (
    <div className="northstar-masthead-brand" role="img" aria-label="Northstar Bank">
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
        <span className="northstar-masthead-brand__line1">Northstar</span>
        <span className="northstar-masthead-brand__line2">Bank</span>
      </span>
    </div>
  )
}
