import { useEffect } from 'react'
import { Button, Card, CardBody, Content, Title } from '@patternfly/react-core'

type VmConsoleDemoCardInnerProps = {
  vmId: string
  vmName: string
  /** When true, terminal shows a PowerShell-style prompt; otherwise Linux bash-style. */
  isWindows?: boolean
  onReturn: () => void
}

/** White card + terminal + actions for the full-screen console demo route. */
function VmConsoleDemoCardInner({
  vmId,
  vmName,
  isWindows = false,
  onReturn,
}: VmConsoleDemoCardInnerProps) {
  return (
    <Card className="northstar-login__card northstar-console-demo__card" isCompact={false}>
      <CardBody>
        <Title headingLevel="h1" size="2xl" className="northstar-login__card-title">
          Virtual machine console
        </Title>
        <p className="northstar-login__card-subtitle">
          <strong>{vmName}</strong>
          {vmId ? (
            <>
              {' '}
              <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>·</span>{' '}
              <code className="northstar-console-demo__id">{vmId}</code>
            </>
          ) : null}
        </p>

        <div className="northstar-console-demo__terminal" aria-label="Demo console output">
          {isWindows ? (
            <>
              <p className="northstar-console-demo__terminal-line northstar-console-demo__terminal-line--prompt">
                <span className="tenant-vm-detail-snapshot__ps-path">PS C:\Users\tenant&gt;</span>{' '}
                <span className="northstar-console-demo__cursor" aria-hidden>
                  ▋
                </span>
              </p>
              <p className="northstar-console-demo__terminal-line">
                Northstar Cloud - VM console (demo)
              </p>
              <p className="northstar-console-demo__terminal-line">
                Guest agent: simulated · Session encrypted (TLS)
              </p>
              <p className="northstar-console-demo__terminal-line northstar-console-demo__terminal-line--muted">
                Press Return to workspace when finished.
              </p>
            </>
          ) : (
            <>
              <p className="northstar-console-demo__terminal-line northstar-console-demo__terminal-line--prompt">
                <span className="northstar-console-demo__terminal-user">tenant@northstar</span>
                <span className="northstar-console-demo__terminal-at">:</span>
                <span className="northstar-console-demo__terminal-path">~</span>
                <span className="northstar-console-demo__terminal-dollar"> $ </span>
                <span className="northstar-console-demo__cursor" aria-hidden>
                  ▋
                </span>
              </p>
              <p className="northstar-console-demo__terminal-line">
                Northstar Cloud - VM console (demo)
              </p>
              <p className="northstar-console-demo__terminal-line">
                Guest agent: simulated · Session encrypted (TLS)
              </p>
              <p className="northstar-console-demo__terminal-line northstar-console-demo__terminal-line--muted">
                Press Return to workspace when finished.
              </p>
            </>
          )}
        </div>

        <Button
          type="button"
          variant="primary"
          isBlock
          className="northstar-login__submit"
          style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}
          onClick={onReturn}
        >
          Return to workspace
        </Button>

        <Content
          component="p"
          style={{
            margin: 'var(--pf-t--global--spacer--md) 0 0',
            fontSize: 'var(--pf-t--global--font--size--body--sm)',
            color: 'var(--pf-t--global--text--color--subtle)',
            textAlign: 'center',
          }}
        >
          Demo only — no data is sent to a real virtual machine.
        </Content>
      </CardBody>
    </Card>
  )
}

export type VmConsoleDemoPageProps = {
  vmId: string
  vmName: string
  onClose: () => void
}

export function VmConsoleDemoPage({ vmId, vmName, onClose }: VmConsoleDemoPageProps) {
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    const prev = document.title
    document.title = `Console — ${vmName} — Northstar Bank`
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.title = prev
    }
  }, [vmName])

  return (
    <div className="northstar-login">
      <div className="northstar-login__bokeh" aria-hidden>
        <span className="northstar-login__bokeh-dot northstar-login__bokeh-dot--a" />
        <span className="northstar-login__bokeh-dot northstar-login__bokeh-dot--b" />
        <span className="northstar-login__bokeh-dot northstar-login__bokeh-dot--c" />
        <span className="northstar-login__bokeh-dot northstar-login__bokeh-dot--d" />
        <span className="northstar-login__bokeh-dot northstar-login__bokeh-dot--e" />
      </div>

      <div className="northstar-login__shell">
        <aside className="northstar-login__brand">
          <div className="northstar-login__brand-top">
            <div className="northstar-login__logo" aria-label="Northstar Bank">
              <span className="northstar-login__logo-line1">Northstar</span>
              <span className="northstar-login__logo-line2">
                <span className="northstar-login__logo-ring" aria-hidden>
                  <svg viewBox="0 0 48 48" className="northstar-login__logo-star">
                    <path
                      fill="currentColor"
                      d="M24 4l4.2 12.9h13.6L32.3 25.8l4.2 12.9L24 33.7l-12.5 5 4.2-12.9L6.2 16.9h13.6L24 4z"
                    />
                  </svg>
                </span>
                <span className="northstar-login__logo-bank">Bank</span>
              </span>
            </div>
            <p className="northstar-login__tagline">
              Secure browser console for your cloud workspace. This is a demo session with no live
              guest connection.
            </p>
          </div>
          <div className="northstar-login__brand-bottom">
            <p className="northstar-login__support">
              Need help? Contact{' '}
              <a href="mailto:support@northstarbank.com">support@northstarbank.com</a>
            </p>
            <p className="northstar-login__copyright">© 2026 Northstar Bank. All rights reserved.</p>
          </div>
        </aside>

        <main className="northstar-login__panel">
          <VmConsoleDemoCardInner vmName={vmName} vmId={vmId} isWindows={false} onReturn={onClose} />
        </main>
      </div>
    </div>
  )
}
