import { Button, Card, CardBody, Content, Title } from '@patternfly/react-core'
import type { DemoTenantId } from './demoTenant'
import { DEMO_TENANT_LABEL } from './demoTenant'
import { OsacLightDarkToggle } from './OsacLightDarkToggle'

export type DemoTenantLandingPageProps = {
  onSelectProviderAdmin: () => void
  onSelectTenantUserBank: (tenantId: DemoTenantId) => void
  onSelectTenantAdminBank: (tenantId: DemoTenantId) => void
  isLandingDark: boolean
  onLandingThemeChange: (dark: boolean) => void
}

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

export function DemoTenantLandingPage({
  onSelectProviderAdmin,
  onSelectTenantUserBank,
  onSelectTenantAdminBank,
  isLandingDark,
  onLandingThemeChange,
}: DemoTenantLandingPageProps) {
  const rootClass = `osac-role-landing${isLandingDark ? ' osac-role-landing--dark' : ' osac-role-landing--light'}`

  return (
    <div className={rootClass}>
      <div className="osac-role-landing__wrap">
        <header className="osac-role-landing__header">
          <Title headingLevel="h1" size="4xl" className="osac-role-landing__title">
            Welcome to OSAC
          </Title>
          <Content component="p" className="osac-role-landing__lede">
            Select your role to access the customized interface.
          </Content>
        </header>

        <div className="osac-role-landing__grid">
          <Card className="osac-role-landing__card" component="article">
            <CardBody className="osac-role-landing__card-body">
              <div className="osac-role-landing__icon-wrap" aria-hidden>
                <OsacRoleIconCrown />
              </div>
              <Title headingLevel="h2" size="xl" className="osac-role-landing__card-title">
                Provider Admin
              </Title>
              <Content component="p" className="osac-role-landing__card-copy">
                Manage platform services, tenants, and global policies for the OSAC environment.
              </Content>
              <Button
                variant="primary"
                className="osac-role-landing__enter"
                onClick={onSelectProviderAdmin}
              >
                Enter
              </Button>
            </CardBody>
          </Card>

          <Card className="osac-role-landing__card" component="article">
            <CardBody className="osac-role-landing__card-body">
              <div className="osac-role-landing__icon-wrap" aria-hidden>
                <OsacRoleIconUsers />
              </div>
              <Title headingLevel="h2" size="xl" className="osac-role-landing__card-title">
                Tenant Admin
              </Title>
              <Content component="p" className="osac-role-landing__card-copy">
                Configure organization resources, users, quotas, and shared services.
              </Content>
              <div className="osac-role-landing__tenant-user-actions">
                <Button
                  variant="primary"
                  className="osac-role-landing__enter"
                  onClick={() => onSelectTenantAdminBank('northstar')}
                >
                  {DEMO_TENANT_LABEL.northstar}
                </Button>
                <Button
                  variant="primary"
                  className="osac-role-landing__enter"
                  onClick={() => onSelectTenantAdminBank('evergreen')}
                >
                  {DEMO_TENANT_LABEL.evergreen}
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="osac-role-landing__card" component="article">
            <CardBody className="osac-role-landing__card-body">
              <div className="osac-role-landing__icon-wrap" aria-hidden>
                <OsacRoleIconUser />
              </div>
              <Title headingLevel="h2" size="xl" className="osac-role-landing__card-title">
                Tenant User
              </Title>
              <Content component="p" className="osac-role-landing__card-copy">
                Access the VM-as-a-Service workspace to create and manage your virtual machines.
              </Content>
              <div className="osac-role-landing__tenant-user-actions">
                <Button
                  variant="primary"
                  className="osac-role-landing__enter"
                  onClick={() => onSelectTenantUserBank('northstar')}
                >
                  {DEMO_TENANT_LABEL.northstar}
                </Button>
                <Button
                  variant="primary"
                  className="osac-role-landing__enter"
                  onClick={() => onSelectTenantUserBank('evergreen')}
                >
                  {DEMO_TENANT_LABEL.evergreen}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <OsacLightDarkToggle
          variant="landing"
          isDark={isLandingDark}
          onChange={onLandingThemeChange}
          aria-label="Landing page theme"
        />
      </div>
    </div>
  )
}
