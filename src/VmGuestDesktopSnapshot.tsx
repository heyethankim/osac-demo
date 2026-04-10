import { useEffect, useState } from 'react'
import type { TenantOs } from './TenantVirtualMachinesPage'
import {
  DesktopWatermark,
  GnomeDesktopIconColumn,
  GnomeStatusIcons,
  WindowsDesktopIconColumn,
} from './VmGuestDesktopContent'
import { useWin11TaskbarClock, Windows11Taskbar } from './Windows11Taskbar'

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
  const { time, date } = useWin11TaskbarClock(60_000)
  return (
    <Windows11Taskbar
      compact
      className="tenant-vm-snapshot-desktop__win-taskbar"
      timeLabel={time}
      dateLabel={date}
    />
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
