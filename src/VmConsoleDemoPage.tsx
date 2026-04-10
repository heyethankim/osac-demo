import { useEffect, useState } from 'react'
import type { TenantOs } from './TenantVirtualMachinesPage'
import {
  DesktopWatermark,
  GnomeDesktopIconColumn,
  GnomeStatusIcons,
  WindowsDesktopIconColumn,
} from './VmGuestDesktopContent'

function useGuestDesktopClock() {
  const format = () =>
    new Date().toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  const [clockLabel, setClockLabel] = useState(format)
  useEffect(() => {
    const tick = () => setClockLabel(format())
    const id = window.setInterval(tick, 30000)
    tick()
    return () => clearInterval(id)
  }, [])
  return clockLabel
}

function GnomeTopBar({
  clockLabel,
  onClose,
}: {
  clockLabel: string
  onClose: () => void
}) {
  return (
    <header className="guest-console-desktop__topbar">
      <div className="guest-console-desktop__topbar-left">
        <span className="guest-console-desktop__activities" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="3" cy="3" r="1.5" />
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="13" cy="3" r="1.5" />
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="13" cy="8" r="1.5" />
            <circle cx="3" cy="13" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
            <circle cx="13" cy="13" r="1.5" />
          </svg>
        </span>
        <span className="guest-console-desktop__activities-label">Activities</span>
      </div>
      <div className="guest-console-desktop__clock" aria-live="polite">
        {clockLabel}
      </div>
      <div className="guest-console-desktop__topbar-right">
        <GnomeStatusIcons />
        <button type="button" className="guest-console-desktop__leave" onClick={onClose}>
          Leave console
        </button>
      </div>
    </header>
  )
}

/** GNOME-style full desktop with icons (RHEL & generic Linux). */
function GnomeGuestDesktop({
  variant,
  vmName,
  vmId,
  onClose,
}: {
  variant: 'rhel' | 'linux'
  vmName: string
  vmId: string
  onClose: () => void
}) {
  const clockLabel = useGuestDesktopClock()
  const rootClass =
    variant === 'rhel'
      ? 'guest-console-desktop guest-console-desktop--rhel'
      : 'guest-console-desktop guest-console-desktop--linux'

  return (
    <div className={rootClass}>
      <GnomeTopBar clockLabel={clockLabel} onClose={onClose} />
      <div className="guest-console-desktop__workspace guest-console-desktop__workspace--icons">
        <GnomeDesktopIconColumn />
        <DesktopWatermark vmName={vmName} vmId={vmId} />
      </div>
    </div>
  )
}

/** Windows-style desktop with icons + taskbar (no PowerShell window). */
function WindowsGuestDesktop({
  vmName,
  vmId,
  onClose,
}: {
  vmName: string
  vmId: string
  onClose: () => void
}) {
  const clockLabel = useGuestDesktopClock()

  return (
    <div className="guest-console-desktop guest-console-desktop--windows">
      <div className="guest-console-desktop__workspace guest-console-desktop__workspace--icons">
        <WindowsDesktopIconColumn />
        <DesktopWatermark vmName={vmName} vmId={vmId} />
      </div>

      <footer className="guest-console-desktop__taskbar">
        <button type="button" className="guest-console-desktop__taskbar-start" aria-label="Start (simulated)">
          <svg width="18" height="18" viewBox="0 0 48 48" fill="currentColor" aria-hidden>
            <path d="M6 10h17v17H6V10zm19 0h17v17H25V10zM6 29h17v17H6V29zm19 0h17v17H25V29z" />
          </svg>
        </button>
        <div className="guest-console-desktop__taskbar-pins" aria-hidden>
          <span className="guest-console-desktop__taskbar-pin" />
          <span className="guest-console-desktop__taskbar-pin" />
          <span className="guest-console-desktop__taskbar-pin" />
        </div>
        <div className="guest-console-desktop__taskbar-right">
          <GnomeStatusIcons />
          <span className="guest-console-desktop__taskbar-clock">{clockLabel}</span>
          <button type="button" className="guest-console-desktop__leave--windows" onClick={onClose}>
            Leave console
          </button>
        </div>
      </footer>
    </div>
  )
}

function GuestDesktopConsole({
  guestOs,
  vmName,
  vmId,
  onClose,
}: {
  guestOs: TenantOs
  vmName: string
  vmId: string
  onClose: () => void
}) {
  if (guestOs === 'windows') {
    return <WindowsGuestDesktop vmName={vmName} vmId={vmId} onClose={onClose} />
  }
  if (guestOs === 'linux') {
    return <GnomeGuestDesktop variant="linux" vmName={vmName} vmId={vmId} onClose={onClose} />
  }
  return <GnomeGuestDesktop variant="rhel" vmName={vmName} vmId={vmId} onClose={onClose} />
}

export type VmConsoleDemoPageProps = {
  vmId: string
  vmName: string
  guestOs: TenantOs
  onClose: () => void
}

export function VmConsoleDemoPage({ vmId, vmName, guestOs, onClose }: VmConsoleDemoPageProps) {
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    const prev = document.title
    document.title = `${vmName} — Guest desktop (demo)`
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.title = prev
    }
  }, [vmName])

  return <GuestDesktopConsole guestOs={guestOs} vmName={vmName} vmId={vmId} onClose={onClose} />
}
