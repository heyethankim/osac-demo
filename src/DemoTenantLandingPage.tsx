import { Button, Card, CardBody, Content, Title } from '@patternfly/react-core'
import { CogIcon } from '@patternfly/react-icons/dist/esm/icons/cog-icon'
import { DEMO_TENANT_LABEL } from './demoTenant'
import { OSAC_LANDING_LAST_UPDATED } from './osacLastUpdated'
import { buildOsacLandingEntryUrl } from './osacLandingEntry'
import redHatHatLogoUrl from './assets/Logo-RedHat-Hat-Color-RGB.svg?url'

const ENCLAVE_INFRA_DEMO_URL = 'https://heyethankim.github.io/enclave-demo/'

function OsacRoleIconCrown() {
  return (
    <svg className="osac-role-landing__icon-svg" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M5 16L3 7l5 3 4-6 4 6 5-3-2 9H5zm2 2h10v2H7v-2z"
      />
    </svg>
  )
}

function OsacRoleIconUsers() {
  return (
    <svg className="osac-role-landing__icon-svg" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      />
    </svg>
  )
}

function OsacRoleIconUser() {
  return (
    <svg className="osac-role-landing__icon-svg" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      />
    </svg>
  )
}

export function DemoTenantLandingPage() {
  const rootClass = 'osac-role-landing osac-role-landing--light'

  return (
    <div className={rootClass}>
      <div className="osac-role-landing__wrap">
        <header className="osac-role-landing__header">
          <img
            src={redHatHatLogoUrl}
            alt="Red Hat"
            width={192}
            height={145}
            className="osac-role-landing__brand-logo"
          />
          <Title headingLevel="h1" size="4xl" className="osac-role-landing__title">
            Red Hat OSAC Prototypes
          </Title>
          <Content component="p" className="osac-role-landing__lede">
            Select a role to access the customized interface.
          </Content>
        </header>

        <Card className="osac-role-landing__combined-card" component="article">
          <CardBody className="osac-role-landing__combined-card-body">
            <div className="osac-role-landing__roles">
              <section
                className="osac-role-landing__role-block"
                aria-labelledby="osac-landing-role-infra-admin-title"
              >
                <div className="osac-role-landing__icon-wrap" aria-hidden>
                  <CogIcon className="osac-role-landing__icon-svg" />
                </div>
                <Title
                  id="osac-landing-role-infra-admin-title"
                  headingLevel="h2"
                  size="lg"
                  className="osac-role-landing__card-title"
                >
                  Infra Admin
                </Title>
                <Content component="p" className="osac-role-landing__card-copy">
                  Bootstrap the environment, manage bare metal, and make Red Hat cloud-ready.
                </Content>
                <div className="osac-role-landing__tenant-user-actions">
                  <Button
                    variant="primary"
                    component="a"
                    href={ENCLAVE_INFRA_DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="osac-role-landing__action"
                    aria-label="Enter Infra Admin demo — opens Open Sovereign AI Cloud setup wizard in a new tab"
                  >
                    Enter
                  </Button>
                  <div className="osac-role-landing__action-spacer-slot" aria-hidden>
                    <Button variant="secondary" className="osac-role-landing__action" isDisabled>
                      {DEMO_TENANT_LABEL.evergreen}
                    </Button>
                  </div>
                </div>
              </section>

              <section
                className="osac-role-landing__role-block"
                aria-labelledby="osac-landing-role-provider-title"
              >
                <div className="osac-role-landing__icon-wrap" aria-hidden>
                  <OsacRoleIconCrown />
                </div>
                <Title
                  id="osac-landing-role-provider-title"
                  headingLevel="h2"
                  size="lg"
                  className="osac-role-landing__card-title"
                >
                  Provider Admin
                </Title>
                <Content component="p" className="osac-role-landing__card-copy">
                  Manage platform services, tenants, and global policies for the OSAC environment.
                </Content>
                <div className="osac-role-landing__tenant-user-actions">
                  <Button
                    variant="primary"
                    component="a"
                    href={buildOsacLandingEntryUrl({ kind: 'provider' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="osac-role-landing__action"
                    aria-label="Enter Provider Admin demo — opens sign-in in a new tab"
                  >
                    Enter
                  </Button>
                  <div className="osac-role-landing__action-spacer-slot" aria-hidden>
                    <Button variant="secondary" className="osac-role-landing__action" isDisabled>
                      {DEMO_TENANT_LABEL.evergreen}
                    </Button>
                  </div>
                </div>
              </section>

              <section
                className="osac-role-landing__role-block"
                aria-labelledby="osac-landing-role-tenant-admin-title"
              >
                <div className="osac-role-landing__icon-wrap" aria-hidden>
                  <OsacRoleIconUsers />
                </div>
                <Title
                  id="osac-landing-role-tenant-admin-title"
                  headingLevel="h2"
                  size="lg"
                  className="osac-role-landing__card-title"
                >
                  Tenant Admin
                </Title>
                <Content component="p" className="osac-role-landing__card-copy">
                  Configure organization resources, users, quotas, and shared services.
                </Content>
                <div className="osac-role-landing__tenant-user-actions">
                  <Button
                    variant="primary"
                    component="a"
                    href={buildOsacLandingEntryUrl({ kind: 'tenant-admin', tenant: 'northstar' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="osac-role-landing__action"
                    aria-label={`Enter Tenant Admin for ${DEMO_TENANT_LABEL.northstar} — opens sign-in in a new tab`}
                  >
                    {DEMO_TENANT_LABEL.northstar}
                  </Button>
                  <Button
                    variant="secondary"
                    component="a"
                    href={buildOsacLandingEntryUrl({ kind: 'tenant-admin', tenant: 'evergreen' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="osac-role-landing__action"
                    aria-label={`Enter Tenant Admin for ${DEMO_TENANT_LABEL.evergreen} — opens sign-in in a new tab`}
                  >
                    {DEMO_TENANT_LABEL.evergreen}
                  </Button>
                </div>
              </section>

              <section
                className="osac-role-landing__role-block"
                aria-labelledby="osac-landing-role-tenant-user-title"
              >
                <div className="osac-role-landing__icon-wrap" aria-hidden>
                  <OsacRoleIconUser />
                </div>
                <Title
                  id="osac-landing-role-tenant-user-title"
                  headingLevel="h2"
                  size="lg"
                  className="osac-role-landing__card-title"
                >
                  Tenant User
                </Title>
                <Content component="p" className="osac-role-landing__card-copy">
                  Access the VM-as-a-Service workspace to create and manage your virtual machines.
                </Content>
                <div className="osac-role-landing__tenant-user-actions">
                  <Button
                    variant="primary"
                    component="a"
                    href={buildOsacLandingEntryUrl({ kind: 'tenant-user', tenant: 'northstar' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="osac-role-landing__action"
                    aria-label={`Enter Tenant User workspace for ${DEMO_TENANT_LABEL.northstar} — opens sign-in in a new tab`}
                  >
                    {DEMO_TENANT_LABEL.northstar}
                  </Button>
                  <Button
                    variant="secondary"
                    component="a"
                    href={buildOsacLandingEntryUrl({ kind: 'tenant-user', tenant: 'evergreen' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="osac-role-landing__action"
                    aria-label={`Enter Tenant User workspace for ${DEMO_TENANT_LABEL.evergreen} — opens sign-in in a new tab`}
                  >
                    {DEMO_TENANT_LABEL.evergreen}
                  </Button>
                </div>
              </section>
            </div>
          </CardBody>
        </Card>

        <footer className="osac-role-landing__footer">
          <div className="osac-role-landing__footer-issues">
            <Button
              variant="link"
              component="a"
              isInline
              href="https://redhat.atlassian.net/browse/HPUX-1516"
              target="_blank"
              rel="noopener noreferrer"
            >
              HPUX-1516
            </Button>
            <span className="osac-role-landing__footer-issues-sep" aria-hidden>
              ,
            </span>
            <Button
              variant="link"
              component="a"
              isInline
              className="osac-role-landing__footer-issue-link-after-comma"
              href="https://redhat.atlassian.net/browse/HPUX-1517"
              target="_blank"
              rel="noopener noreferrer"
            >
              HPUX-1517
            </Button>
          </div>
          <Content component="p" className="osac-role-landing__footer-meta">
            Created by{' '}
            <Button
              variant="link"
              component="a"
              isInline
              href="https://redhat.enterprise.slack.com/archives/D021Q4YKTBR"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ethan Kim
            </Button>
            {' & '}
            <Button
              variant="link"
              component="a"
              isInline
              href="https://redhat.enterprise.slack.com/archives/D06FNMKMQCQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kyle Baker
            </Button>
            {' - OpenShift UXD'}
          </Content>
          <Content component="p" className="osac-role-landing__footer-updated">
            Last updated: {OSAC_LANDING_LAST_UPDATED}
          </Content>
        </footer>
      </div>
    </div>
  )
}
