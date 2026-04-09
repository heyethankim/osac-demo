import type { SVGProps } from 'react'
import tuxSvgUrl from './assets/Tux.svg?url'

export type LinuxTuxIconProps = Pick<
  SVGProps<SVGSVGElement>,
  'aria-hidden' | 'style' | 'className'
>

/** Larry Ewing–style Tux SVG for Linux template cards. */
export function LinuxTuxIcon({
  style,
  className,
  'aria-hidden': ariaHidden,
}: LinuxTuxIconProps) {
  const w = style?.width
  const h = style?.height
  const width = typeof w === 'number' ? w : 28
  const height = typeof h === 'number' ? h : 28

  return (
    <img
      src={tuxSvgUrl}
      alt=""
      decoding="async"
      draggable={false}
      aria-hidden={ariaHidden}
      className={className}
      style={{
        display: 'block',
        width,
        height,
        objectFit: 'contain',
        flexShrink: 0,
      }}
    />
  )
}
