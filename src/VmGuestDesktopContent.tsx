import type { ReactNode } from 'react'

export function GnomeStatusIcons() {
  return (
    <>
      <span className="guest-console-desktop__icon" title="Wi‑Fi (simulated)" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M8.53 16.11a7 7 0 0 1 6.94 0" />
          <path d="M12 20h.01" />
        </svg>
      </span>
      <span className="guest-console-desktop__icon" title="Volume (simulated)" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        </svg>
      </span>
      <span className="guest-console-desktop__icon" title="Power (simulated)" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.35 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.65-1.17-5.03-3.17-6.83z" />
        </svg>
      </span>
    </>
  )
}

type DeskIconProps = {
  label: string
  tileClass: string
  children: ReactNode
  labelClass?: string
}

export function DeskIcon({ label, tileClass, children, labelClass = '' }: DeskIconProps) {
  return (
    <button
      type="button"
      className="guest-console-desktop__desk-icon"
      aria-label={`${label} (simulated)`}
    >
      <span className={`guest-console-desktop__desk-icon-tile ${tileClass}`}>{children}</span>
      <span className={`guest-console-desktop__desk-icon-label ${labelClass}`.trim()}>{label}</span>
    </button>
  )
}

function IconComputer() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function IconHome() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
    </svg>
  )
}

function IconFolder() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  )
}

function IconTerminal() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7 9l3 3-3 3M12 15h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function IconEdge() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.82 0 3.53-.5 5-1.35-2.99-1.73-5-4.95-5-8.65 0-3.7 2.01-6.92 5-8.65C15.53 2.5 13.82 2 12 2z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M12 4c4.08 0 7.45 3.05 7.93 7-1.55-2.84-4.58-4.8-8.13-4.8-4.97 0-9 4.03-9 9 0 1.95.62 3.76 1.68 5.24C3.86 16.5 3 14.33 3 12c0-4.97 4.03-9 9-9z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  )
}

function IconExplorer() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
    </svg>
  )
}

export function GnomeDesktopIconColumn() {
  return (
    <div
      className="guest-console-desktop__icon-column"
      role="toolbar"
      aria-label="Desktop shortcuts (simulated)"
    >
      <DeskIcon label="Computer" tileClass="guest-console-desktop__desk-icon-tile--computer">
        <IconComputer />
      </DeskIcon>
      <DeskIcon label="Home" tileClass="guest-console-desktop__desk-icon-tile--home">
        <IconHome />
      </DeskIcon>
      <DeskIcon label="Files" tileClass="guest-console-desktop__desk-icon-tile--files">
        <IconFolder />
      </DeskIcon>
      <DeskIcon label="Trash" tileClass="guest-console-desktop__desk-icon-tile--trash">
        <IconTrash />
      </DeskIcon>
      <DeskIcon label="Settings" tileClass="guest-console-desktop__desk-icon-tile--settings">
        <IconSettings />
      </DeskIcon>
      <DeskIcon label="Terminal" tileClass="guest-console-desktop__desk-icon-tile--terminal">
        <IconTerminal />
      </DeskIcon>
    </div>
  )
}

export function WindowsDesktopIconColumn() {
  return (
    <div
      className="guest-console-desktop__icon-column guest-console-desktop__icon-column--windows"
      role="toolbar"
      aria-label="Desktop shortcuts (simulated)"
    >
      <DeskIcon
        label="This PC"
        tileClass="guest-console-desktop__desk-icon-tile--win-pc"
        labelClass="guest-console-desktop__desk-icon-label--windows"
      >
        <IconComputer />
      </DeskIcon>
      <DeskIcon
        label="Recycle Bin"
        tileClass="guest-console-desktop__desk-icon-tile--win-trash"
        labelClass="guest-console-desktop__desk-icon-label--windows"
      >
        <IconTrash />
      </DeskIcon>
      <DeskIcon
        label="File Explorer"
        tileClass="guest-console-desktop__desk-icon-tile--win-files"
        labelClass="guest-console-desktop__desk-icon-label--windows"
      >
        <IconExplorer />
      </DeskIcon>
      <DeskIcon
        label="Settings"
        tileClass="guest-console-desktop__desk-icon-tile--win-settings"
        labelClass="guest-console-desktop__desk-icon-label--windows"
      >
        <IconSettings />
      </DeskIcon>
      <DeskIcon
        label="Microsoft Edge"
        tileClass="guest-console-desktop__desk-icon-tile--edge"
        labelClass="guest-console-desktop__desk-icon-label--windows"
      >
        <IconEdge />
      </DeskIcon>
    </div>
  )
}

export function DesktopWatermark({ vmName, vmId }: { vmName: string; vmId: string }) {
  return (
    <div className="guest-console-desktop__desktop-meta" aria-hidden>
      <div className="guest-console-desktop__desktop-meta-name">{vmName}</div>
      {vmId ? <div className="guest-console-desktop__desktop-meta-id">{vmId}</div> : null}
      <div className="guest-console-desktop__desktop-meta-hint">Simulated guest desktop</div>
    </div>
  )
}
