function OsacSunIcon() {
  return (
    <svg className="osac-theme-toggle__icon" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2v-2H2v2zm18 0h2v-2h-2v2zM11 2v2h2V2h-2zm0 18v2h2v-2h-2zM4.93 4.93l1.41 1.41 1.41-1.41-1.41-1.41-1.41 1.41zm12.73 12.73 1.41 1.41 1.41-1.41-1.41-1.41-1.41 1.41zm1.41-14.14-1.41 1.41 1.41 1.41 1.41-1.41-1.41-1.41zM4.93 19.07l1.41-1.41-1.41-1.41-1.41 1.41 1.41 1.41z"
      />
    </svg>
  )
}

function OsacMoonIcon() {
  return (
    <svg className="osac-theme-toggle__icon" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"
      />
    </svg>
  )
}

/** Horizontal ellipsis — same visual weight as sun/moon in the shell toggle. */
function OsacEllipsisHIcon() {
  return (
    <svg className="osac-theme-toggle__icon" viewBox="0 0 24 24" aria-hidden>
      <circle cx="5" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="19" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

export type OsacLightDarkToggleProps = {
  isDark: boolean
  onChange: (nextDark: boolean) => void
  /** First segment (⋯) opens role / institution landing; same segment styling as theme controls. */
  landingOnSelect?: () => void
  /** Accessible name for the ellipsis segment when `landingOnSelect` is set. */
  landingAriaLabel?: string
  'aria-label'?: string
}

export function OsacLightDarkToggle({
  isDark,
  onChange,
  landingOnSelect,
  landingAriaLabel = 'Choose institution and role',
  'aria-label': ariaLabel = 'Theme',
}: OsacLightDarkToggleProps) {
  const rootClass = `osac-theme-toggle osac-theme-toggle--shell${landingOnSelect ? ' osac-theme-toggle--shell-with-landing' : ''}`

  const groupLabel = landingOnSelect ? 'Workspace appearance and start' : ariaLabel

  return (
    <div className={rootClass} role="group" aria-label={groupLabel}>
      {landingOnSelect ? (
        <button
          type="button"
          className="osac-theme-toggle__seg osac-theme-toggle__seg--landing"
          onClick={landingOnSelect}
          aria-label={landingAriaLabel}
        >
          <OsacEllipsisHIcon />
        </button>
      ) : null}
      <button
        type="button"
        className={`osac-theme-toggle__seg${!isDark ? ' osac-theme-toggle__seg--active' : ''}`}
        onClick={() => onChange(false)}
        aria-pressed={!isDark}
        aria-label="Light theme"
      >
        <OsacSunIcon />
      </button>
      <button
        type="button"
        className={`osac-theme-toggle__seg${isDark ? ' osac-theme-toggle__seg--active' : ''}`}
        onClick={() => onChange(true)}
        aria-pressed={isDark}
        aria-label="Dark theme"
      >
        <OsacMoonIcon />
      </button>
    </div>
  )
}
