import { Button, Card, CardBody, Content, Gallery, GalleryItem, Label, Title } from '@patternfly/react-core'
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon'
import { InfoCircleIcon } from '@patternfly/react-icons/dist/esm/icons/info-circle-icon'
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon'

type FrameworkStatusKind = 'certified' | 'compliant' | 'in-progress'

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, n))
}

const COMPLIANCE_FRAMEWORKS: {
  id: string
  name: string
  coveragePct: number
  status: FrameworkStatusKind
  lastAudit: string
  warning?: boolean
}[] = [
  { id: 'soc2', name: 'SOC 2 Type II', coveragePct: 100, status: 'certified', lastAudit: '2026-03-15' },
  { id: 'iso', name: 'ISO 27001', coveragePct: 100, status: 'certified', lastAudit: '2026-02-28' },
  { id: 'gdpr', name: 'GDPR', coveragePct: 100, status: 'compliant', lastAudit: '2026-01-10' },
  { id: 'hipaa', name: 'HIPAA', coveragePct: 100, status: 'certified', lastAudit: '2025-12-05' },
  { id: 'pci', name: 'PCI DSS', coveragePct: 100, status: 'certified', lastAudit: '2026-03-01' },
  { id: 'fedramp', name: 'FedRAMP', coveragePct: 87, status: 'in-progress', lastAudit: '2025-11-18', warning: true },
]

const SECURITY_EVENTS: {
  id: string
  tone: 'warning' | 'info'
  title: string
  description: string
  when: string
}[] = [
  {
    id: 'e1',
    tone: 'warning',
    title: 'Unusual API activity detected',
    description: "Tenant 'FinTech Solutions' — 500% increase in API calls.",
    when: '2 hours ago',
  },
  {
    id: 'e2',
    tone: 'info',
    title: 'Security patch applied',
    description: 'CVE-2026-12345 patched across all infrastructure.',
    when: '5 hours ago',
  },
  {
    id: 'e3',
    tone: 'warning',
    title: 'Multiple failed login attempts',
    description: 'IP 192.168.1.100 — 15 failed attempts in 10 minutes.',
    when: '8 hours ago',
  },
]

/** Same PatternFly `Label` patterns as provider infrastructure compliance cards. */
function frameworkStatusIndicator(status: FrameworkStatusKind) {
  switch (status) {
    case 'certified':
      return (
        <Label color="green" isCompact>
          certified
        </Label>
      )
    case 'compliant':
      return (
        <Label color="blue" isCompact>
          compliant
        </Label>
      )
    case 'in-progress':
      return (
        <Label color="grey" isCompact>
          in-progress
        </Label>
      )
  }
}

/** Provider admin — security & compliance overview (demo). */
export function ProviderAdminSecurityCompliancePage() {
  return (
    <div className="provider-admin-security-compliance-page">
      <div
        className="osac-page-toolbar-sticky provider-admin-security-compliance-page__toolbar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--pf-t--global--spacer--md)',
        }}
      >
        <div className="osac-page-toolbar-sticky__lead">
          <Title headingLevel="h1" size="2xl" style={{ margin: 0 }}>
            Security & compliance
          </Title>
          <Content
            component="p"
            style={{
              margin: 0,
              maxWidth: '52rem',
              color: 'var(--pf-t--global--text--color--subtle)',
              fontSize: 'var(--pf-t--global--font--size--body--default)',
            }}
          >
            Platform-wide security policies, compliance frameworks, and audit logs.
          </Content>
        </div>
        <div className="osac-page-toolbar-sticky__actions">
          <Button variant="primary" type="button" icon={<PlusCircleIcon />} onClick={() => {}}>
            Create policy
          </Button>
        </div>
      </div>

      <Gallery hasGutter className="provider-admin-security-compliance-page__summary">
        <GalleryItem>
          <Card component="article" isFullHeight className="provider-admin-security-stat-card">
            <CardBody>
              <Title headingLevel="h2" size="md" style={{ margin: 0, fontWeight: 600 }}>
                Security score
              </Title>
              <Title
                headingLevel="h3"
                size="4xl"
                className="provider-admin-security-stat-card__value provider-admin-security-stat-card__value--success"
                style={{ margin: 0 }}
              >
                98/100
              </Title>
              <Content component="p" className="provider-admin-security-stat-card__hint">
                Excellent
              </Content>
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card component="article" isFullHeight className="provider-admin-security-stat-card">
            <CardBody>
              <Title headingLevel="h2" size="md" style={{ margin: 0, fontWeight: 600 }}>
                Active policies
              </Title>
              <Title headingLevel="h3" size="4xl" className="provider-admin-security-stat-card__value" style={{ margin: 0 }}>
                47
              </Title>
              <Content component="p" className="provider-admin-security-stat-card__hint">
                All enforced
              </Content>
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card component="article" isFullHeight className="provider-admin-security-stat-card">
            <CardBody>
              <Title headingLevel="h2" size="md" style={{ margin: 0, fontWeight: 600 }}>
                Compliance frameworks
              </Title>
              <Title headingLevel="h3" size="4xl" className="provider-admin-security-stat-card__value" style={{ margin: 0 }}>
                8
              </Title>
              <Content component="p" className="provider-admin-security-stat-card__hint">
                Certified
              </Content>
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card component="article" isFullHeight className="provider-admin-security-stat-card provider-admin-security-stat-card--warning">
            <CardBody>
              <Title headingLevel="h2" size="md" style={{ margin: 0, fontWeight: 600 }}>
                Security alerts
              </Title>
              <Title
                headingLevel="h3"
                size="4xl"
                className="provider-admin-security-stat-card__value provider-admin-security-stat-card__value--warning"
                style={{ margin: 0 }}
              >
                3
              </Title>
              <Content component="p" className="provider-admin-security-stat-card__hint provider-admin-security-stat-card__hint--warning">
                Requires attention
              </Content>
            </CardBody>
          </Card>
        </GalleryItem>
      </Gallery>

      <div className="provider-admin-security-compliance-page__section">
        <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>
          Compliance frameworks
        </Title>
        <Content component="p" className="provider-admin-security-compliance-page__section-lede">
          Active certifications and compliance status.
        </Content>
        <div className="provider-admin-security-compliance-page__frameworks-grid">
          {COMPLIANCE_FRAMEWORKS.map((fw) => (
            <Card
              key={fw.id}
              component="article"
              className={
                fw.warning
                  ? 'provider-admin-security-framework-card provider-admin-security-framework-card--warning'
                  : 'provider-admin-security-framework-card'
              }
            >
              <CardBody>
                <div className="provider-admin-infra-compliance-list__row provider-admin-security-framework-card__head">
                  <div className="provider-admin-infra-compliance-list__text">
                    <Title headingLevel="h3" size="md" style={{ margin: 0, fontWeight: 600 }}>
                      {fw.name}
                    </Title>
                  </div>
                  {frameworkStatusIndicator(fw.status)}
                </div>
                <div className="provider-admin-infra-progress-row">
                  <div className="provider-admin-infra-progress-row__head">
                    <span className="provider-admin-infra-progress-row__label">Coverage</span>
                    <span className="provider-admin-infra-progress-row__value">{fw.coveragePct}%</span>
                  </div>
                  <div
                    className="provider-admin-infra-progress-bar"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={fw.coveragePct}
                    aria-label={`${fw.name} coverage ${fw.coveragePct} percent`}
                  >
                    <div
                      className="provider-admin-infra-progress-bar__fill"
                      style={{ width: `${clampPct(fw.coveragePct)}%` }}
                    />
                  </div>
                </div>
                <Content component="p" className="provider-admin-security-framework-card__audit">
                  Last audit: {fw.lastAudit}
                </Content>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div className="provider-admin-security-compliance-page__section">
        <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>
          Recent security events
        </Title>
        <Content component="p" className="provider-admin-security-compliance-page__section-lede">
          Latest security events and alerts.
        </Content>
        <ul className="provider-admin-security-events-list">
          {SECURITY_EVENTS.map((ev) => (
            <li key={ev.id}>
              <Card component="article" className="provider-admin-security-event-card">
                <CardBody>
                  <div className="provider-admin-security-event-card__layout">
                    <span
                      className={
                        ev.tone === 'warning'
                          ? 'provider-admin-security-event-card__icon provider-admin-security-event-card__icon--warning'
                          : 'provider-admin-security-event-card__icon provider-admin-security-event-card__icon--info'
                      }
                      aria-hidden
                    >
                      {ev.tone === 'warning' ? <ExclamationTriangleIcon /> : <InfoCircleIcon />}
                    </span>
                    <div className="provider-admin-security-event-card__body">
                      <Content component="p" className="provider-admin-security-event-card__title">
                        {ev.title}
                      </Content>
                      <Content component="p" className="provider-admin-security-event-card__desc">
                        {ev.description}
                      </Content>
                      <Content component="p" className="provider-admin-security-event-card__time">
                        {ev.when}
                      </Content>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
