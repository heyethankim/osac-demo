type ProviderTenantOrgGeneratedLogoProps = {
  className?: string
}

const summitPeakLogoSrc = `${import.meta.env.BASE_URL}summit-peak-logo.png`
const lighthouseCapitalLogoSrc = `${import.meta.env.BASE_URL}lighthouse-capital-logo.png`

function LogoShell({
  className,
  bg,
  stroke,
  children,
  ariaLabel,
}: {
  className?: string
  bg: string
  stroke: string
  children: React.ReactNode
  ariaLabel: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="60" height="60" rx="14" fill={bg} stroke={stroke} strokeWidth="2" />
      {children}
    </svg>
  )
}

/** Summit Peak Bank (SP) — mountain + monogram demo mark. */
export function SummitPeakLogo({ className }: ProviderTenantOrgGeneratedLogoProps) {
  return (
    <img
      className={className}
      src={summitPeakLogoSrc}
      alt="Summit Peak logo"
      decoding="async"
      loading="lazy"
    />
  )
}

/** Lighthouse Capital Group (LC) — beacon + monogram demo mark. */
export function LighthouseCapitalLogo({ className }: ProviderTenantOrgGeneratedLogoProps) {
  return (
    <img
      className={className}
      src={lighthouseCapitalLogoSrc}
      alt="Lighthouse Capital logo"
      decoding="async"
      loading="lazy"
    />
  )
}

/** Union Harbor Trust (UH) — harbor arc + monogram demo mark. */
export function UnionHarborLogo({ className }: ProviderTenantOrgGeneratedLogoProps) {
  return (
    <LogoShell className={className} bg="#ECFEFF" stroke="#67E8F9" ariaLabel="Union Harbor logo">
      <path d="M18 34c4-6 9-9 14-9s10 3 14 9" fill="none" stroke="#0E7490" strokeWidth="3" />
      <path d="M18 40h28" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
      <text
        x="32"
        y="52"
        textAnchor="middle"
        fill="#0F766E"
        style={{ fontWeight: 700, fontSize: 12, letterSpacing: 0.8 }}
      >
        UH
      </text>
    </LogoShell>
  )
}
