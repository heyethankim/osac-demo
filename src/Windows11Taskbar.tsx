import { useEffect, useState } from 'react'

export function useWin11TaskbarClock(intervalMs: number) {
  const format = () => {
    const d = new Date()
    return {
      time: d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
      date: d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' }),
    }
  }
  const [labels, setLabels] = useState(format)
  useEffect(() => {
    const tick = () => setLabels(format())
    const id = window.setInterval(tick, intervalMs)
    tick()
    return () => clearInterval(id)
  }, [intervalMs])
  return labels
}

function Win11FluentStartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="#60cdff"
        d="M2.25 3.25h9.1v9.1h-9.1v-9.1zm10.4 0h9.1v9.1h-9.1v-9.1zm-10.4 10.4h9.1v9.1h-9.1v-9.1zm10.4 0h9.1v9.1h-9.1v-9.1z"
      />
    </svg>
  )
}

function Win11SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.35" />
      <path d="M10.2 10.2 13.5 13.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  )
}

function Win11TaskViewIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden>
      <rect x="1.5" y="2.5" width="5.5" height="11" rx="0.5" opacity="0.85" />
      <rect x="9" y="2.5" width="5.5" height="11" rx="0.5" />
    </svg>
  )
}

function Win11TrayChevron() {
  return (
    <svg viewBox="0 0 12 8" width="11" height="8" fill="none" aria-hidden>
      <path
        d="M1.25 1.75 6 6.25 10.75 1.75"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Win11NetworkIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden>
      <path d="M8 2.5 14 7v1H2V7l6-4.5zm-4.2 5.2h8.4L14 9.5v1H2v-1l1.8-1.8zm1.6 3.3h5.2l1.3 1.3V13H2v-.7l1.8-1.8z" opacity="0.92" />
    </svg>
  )
}

function Win11VolumeIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden>
      <path d="M3 5.5h2.5L8 3v10l-2.5-2.5H3V5.5zm8.2 1.3a3 3 0 0 1 0 2.4l-.9-.5a2 2 0 0 0 0-1.4l.9-.5z" />
    </svg>
  )
}

function Win11BatteryIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden>
      <path d="M4 3.5h7.5a1 1 0 0 1 1 1v1H14v3h-1.5v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1zm0 1v5h7.5v-5H4zm2 1.25h3.5v2.5H6v-2.5z" />
    </svg>
  )
}

function PinnedEdge() {
  return (
    <span className="win11-taskbar__pin" aria-hidden>
      <span className="win11-taskbar__pin-inner win11-taskbar__pin-inner--edge" />
    </span>
  )
}

function PinnedFolder() {
  return (
    <span className="win11-taskbar__pin" aria-hidden>
      <span className="win11-taskbar__pin-inner win11-taskbar__pin-inner--folder" />
    </span>
  )
}

function PinnedStore() {
  return (
    <span className="win11-taskbar__pin" aria-hidden>
      <span className="win11-taskbar__pin-inner win11-taskbar__pin-inner--store" />
    </span>
  )
}

function PinnedMail() {
  return (
    <span className="win11-taskbar__pin" aria-hidden>
      <span className="win11-taskbar__pin-inner win11-taskbar__pin-inner--mail" />
    </span>
  )
}

function PinnedTeams() {
  return (
    <span className="win11-taskbar__pin" aria-hidden>
      <span className="win11-taskbar__pin-inner win11-taskbar__pin-inner--teams" />
    </span>
  )
}

export type Windows11TaskbarProps = {
  /** Smaller density for VM detail snapshot */
  compact?: boolean
  onLeaveConsole?: () => void
  timeLabel: string
  dateLabel: string
  className?: string
}

/**
 * Windows 11–style taskbar (Start, Search, Task view, centered pins, tray, clock).
 * Decorative only — simulates guest OS chrome for the demo console.
 */
export function Windows11Taskbar({
  compact,
  onLeaveConsole,
  timeLabel,
  dateLabel,
  className,
}: Windows11TaskbarProps) {
  const rootClass = ['win11-taskbar', compact && 'win11-taskbar--compact', className].filter(Boolean).join(' ')

  return (
    <footer className={rootClass}>
      <div className="win11-taskbar__left">
        <button type="button" className="win11-taskbar__start" aria-label="Start (simulated)">
          <Win11FluentStartIcon />
        </button>
        <button type="button" className="win11-taskbar__search" aria-label="Search (simulated)">
          <Win11SearchIcon />
          <span className="win11-taskbar__search-label">Search</span>
        </button>
        <button type="button" className="win11-taskbar__taskview" aria-label="Task View (simulated)">
          <Win11TaskViewIcon />
        </button>
      </div>

      <div className="win11-taskbar__center-wrap">
        <div className="win11-taskbar__center" aria-hidden>
          <PinnedEdge />
          <PinnedFolder />
          <PinnedStore />
          <PinnedMail />
          <PinnedTeams />
        </div>
      </div>

      <div className="win11-taskbar__right">
        {onLeaveConsole ? (
          <button type="button" className="guest-console-desktop__leave--windows win11-taskbar__leave" onClick={onLeaveConsole}>
            Leave console
          </button>
        ) : null}
        <span className="win11-taskbar__tray-chevron" aria-hidden>
          <Win11TrayChevron />
        </span>
        <span className="win11-taskbar__tray-icon" aria-hidden>
          <Win11NetworkIcon />
        </span>
        <span className="win11-taskbar__tray-icon" aria-hidden>
          <Win11VolumeIcon />
        </span>
        <span className="win11-taskbar__tray-icon win11-taskbar__tray-icon--battery" aria-hidden>
          <Win11BatteryIcon />
        </span>
        <div className="win11-taskbar__clock" aria-live="polite">
          <div className="win11-taskbar__clock-time">{timeLabel}</div>
          <div className="win11-taskbar__clock-date">{dateLabel}</div>
        </div>
        <div className="win11-taskbar__show-desktop" aria-hidden />
      </div>
    </footer>
  )
}
