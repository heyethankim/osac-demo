import { useEffect, useState } from 'react'
import type { TenantOs } from './TenantVirtualMachinesPage'
import {
  DesktopWatermark,
  GnomeDesktopIconColumn,
  GnomeStatusIcons,
  WindowsDesktopIconColumn,
} from './VmGuestDesktopContent'

function useSnapshotClock() {
  const format = () =>
    new Date().toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  const [label, setLabel] = useState(format)
  useEffect(() => {
    const id = window.setInterval(() => setLabel(format()), 60000)
    return () => clearInterval(id)
  }, [])
  return label
}

function GnomeSnapshotTopBar() {
  const clockLabel = useSnapshotClock()
  return (
    <header className="guest-console-desktop__topbar tenant-vm-snapshot-desktop__gnome-topbar">
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
      </div>
    </header>
  )
}

function WindowsSnapshotTaskbar() {
  const clockLabel = useSnapshotClock()
  return (
    <footer className="guest-console-desktop__taskbar tenant-vm-snapshot-desktop__win-taskbar">
      <div className="guest-console-desktop__taskbar-start" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 48 48" fill="currentColor" aria-hidden>
          <path d="M6 10h17v17H6V10zm19 0h17v17H25V10zM6 29h17v17H6V29zm19 0h17v17H25V29z" />
        </svg>
      </div>
      <div className="guest-console-desktop__taskbar-pins" aria-hidden>
        <span className="guest-console-desktop__taskbar-pin" />
        <span className="guest-console-desktop__taskbar-pin" />
        <span className="guest-console-desktop__taskbar-pin" />
      </div>
      <div className="guest-console-desktop__taskbar-right">
        <GnomeStatusIcons />
        <span className="guest-console-desktop__taskbar-clock">{clockLabel}</span>
      </div>
    </footer>
  )
}

export type VmGuestDesktopSnapshotProps = {
  guestOs: TenantOs
  vmName: string
  vmId: string
}

/**
 * Compact guest desktop preview for VM detail Console card — matches full Launch console layouts.
 */
export function VmGuestDesktopSnapshot({ guestOs, vmName, vmId }: VmGuestDesktopSnapshotProps) {
  if (guestOs === 'windows') {
    return (
      <div
        className="tenant-vm-snapshot-desktop tenant-vm-snapshot-desktop--windows"
        aria-label={`Guest desktop preview for ${vmName}`}
      >
        <div className="tenant-vm-snapshot-desktop__column">
          <div className="guest-console-desktop__workspace guest-console-desktop__workspace--icons tenant-vm-snapshot-desktop__workspace">
            <WindowsDesktopIconColumn />
            <DesktopWatermark vmName={vmName} vmId={vmId} />
          </div>
          <WindowsSnapshotTaskbar />
        </div>
      </div>
    )
  }

  const rootClass =
    guestOs === 'rhel'
      ? 'tenant-vm-snapshot-desktop tenant-vm-snapshot-desktop--rhel'
      : 'tenant-vm-snapshot-desktop tenant-vm-snapshot-desktop--linux'

  return (
    <div className={rootClass} aria-label={`Guest desktop preview for ${vmName}`}>
      <GnomeSnapshotTopBar />
      <div className="guest-console-desktop__workspace guest-console-desktop__workspace--icons tenant-vm-snapshot-desktop__workspace">
        <GnomeDesktopIconColumn />
        <DesktopWatermark vmName={vmName} vmId={vmId} />
      </div>
    </div>
  )
}
