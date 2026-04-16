const BLUESTONE_LOGO_SRC = `${import.meta.env.BASE_URL}bluestone-logo.png`

/** Bluestone “bs” mark image (served from /public/bluestone-logo.png). */
export function BluestoneMarkIcon({ className }: { className?: string }) {
  return (
    <img
      src={BLUESTONE_LOGO_SRC}
      alt=""
      className={className}
      width={32}
      height={32}
      draggable={false}
    />
  )
}
