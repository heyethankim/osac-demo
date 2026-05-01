import { useState } from 'react'
import { Button, Content, Form, FormGroup, TextInput, Title } from '@patternfly/react-core'

/** Provider admin — platform-wide settings (demo; values are not persisted). */
export function ProviderAdminPlatformSettingsPage() {
  const [platformName, setPlatformName] = useState('VMaaS Cloud Platform')
  const [platformVersion] = useState('v4.2.1')
  const [supportEmail, setSupportEmail] = useState('support@vmaas.cloud')
  const [adminEmail, setAdminEmail] = useState('admin@vmaas.cloud')

  const [quotaVcpu, setQuotaVcpu] = useState('100')
  const [quotaRamGb, setQuotaRamGb] = useState('512')
  const [quotaStorageGb, setQuotaStorageGb] = useState('2048')
  const [quotaGpu, setQuotaGpu] = useState('0')

  const [priceVcpu, setPriceVcpu] = useState('0.045')
  const [priceRam, setPriceRam] = useState('0.012')
  const [priceStorage, setPriceStorage] = useState('0.10')
  const [priceGpu, setPriceGpu] = useState('2.50')

  const [apiEndpoint, setApiEndpoint] = useState('https://api.vmaas.cloud/v1')
  const [apiRateLimit, setApiRateLimit] = useState('1000')
  const [apiTokenExpiry, setApiTokenExpiry] = useState('3600')

  return (
    <div className="provider-admin-platform-settings-page">
      <div
        className="osac-page-toolbar-sticky provider-admin-platform-settings-page__toolbar"
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
            Platform settings
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
            Global platform configuration and operational settings.
          </Content>
        </div>
      </div>

      <section className="provider-admin-platform-settings-page__block" aria-labelledby="provider-platform-general-heading">
        <div className="provider-admin-platform-settings-block__intro">
          <Title id="provider-platform-general-heading" headingLevel="h2" size="lg" style={{ margin: 0 }}>
            General
          </Title>
          <Content component="p" className="provider-admin-platform-settings-block__subtitle">
            Core platform configuration
          </Content>
        </div>
        <Form
          id="provider-platform-settings-general-form"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="provider-admin-platform-settings__form-grid provider-admin-platform-settings__form-grid--2">
            <FormGroup label="Platform name" fieldId="provider-platform-name">
              <TextInput
                id="provider-platform-name"
                name="platformName"
                type="text"
                value={platformName}
                onChange={(_e, v) => setPlatformName(v)}
                aria-label="Platform name"
              />
            </FormGroup>
            <FormGroup label="Platform version" fieldId="provider-platform-version">
              <TextInput
                id="provider-platform-version"
                name="platformVersion"
                type="text"
                value={platformVersion}
                isDisabled
                aria-label="Platform version"
              />
            </FormGroup>
            <FormGroup label="Support email" fieldId="provider-platform-support-email">
              <TextInput
                id="provider-platform-support-email"
                name="supportEmail"
                type="email"
                value={supportEmail}
                onChange={(_e, v) => setSupportEmail(v)}
                aria-label="Support email"
              />
            </FormGroup>
            <FormGroup label="Admin email" fieldId="provider-platform-admin-email">
              <TextInput
                id="provider-platform-admin-email"
                name="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(_e, v) => setAdminEmail(v)}
                aria-label="Admin email"
              />
            </FormGroup>
          </div>
          <div className="provider-admin-platform-settings__actions">
            <Button variant="primary" type="submit">
              Save changes
            </Button>
          </div>
        </Form>
      </section>

      <hr className="provider-admin-platform-settings__divider" aria-hidden />

      <section className="provider-admin-platform-settings-page__block" aria-labelledby="provider-platform-quotas-heading">
        <div className="provider-admin-platform-settings-block__intro">
          <Title id="provider-platform-quotas-heading" headingLevel="h2" size="lg" style={{ margin: 0 }}>
            Default tenant quotas
          </Title>
          <Content component="p" className="provider-admin-platform-settings-block__subtitle">
            Default resource quotas for new tenants
          </Content>
        </div>
        <Form
          id="provider-platform-settings-quotas-form"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="provider-admin-platform-settings__form-grid provider-admin-platform-settings__form-grid--2">
            <FormGroup label="Default vCPU quota" fieldId="provider-quota-vcpu">
              <TextInput
                id="provider-quota-vcpu"
                name="quotaVcpu"
                type="number"
                value={quotaVcpu}
                onChange={(_e, v) => setQuotaVcpu(v)}
                aria-label="Default vCPU quota"
              />
            </FormGroup>
            <FormGroup label="Default RAM quota (GB)" fieldId="provider-quota-ram">
              <TextInput
                id="provider-quota-ram"
                name="quotaRamGb"
                type="number"
                value={quotaRamGb}
                onChange={(_e, v) => setQuotaRamGb(v)}
                aria-label="Default RAM quota in gigabytes"
              />
            </FormGroup>
            <FormGroup label="Default storage (GB)" fieldId="provider-quota-storage">
              <TextInput
                id="provider-quota-storage"
                name="quotaStorageGb"
                type="number"
                value={quotaStorageGb}
                onChange={(_e, v) => setQuotaStorageGb(v)}
                aria-label="Default storage in gigabytes"
              />
            </FormGroup>
            <FormGroup label="Default GPU quota" fieldId="provider-quota-gpu">
              <TextInput
                id="provider-quota-gpu"
                name="quotaGpu"
                type="number"
                value={quotaGpu}
                onChange={(_e, v) => setQuotaGpu(v)}
                aria-label="Default GPU quota"
              />
            </FormGroup>
          </div>
          <div className="provider-admin-platform-settings__actions">
            <Button variant="primary" type="submit">
              Save quota defaults
            </Button>
          </div>
        </Form>
      </section>

      <hr className="provider-admin-platform-settings__divider" aria-hidden />

      <section className="provider-admin-platform-settings-page__block" aria-labelledby="provider-platform-billing-heading">
        <div className="provider-admin-platform-settings-block__intro">
          <Title id="provider-platform-billing-heading" headingLevel="h2" size="lg" style={{ margin: 0 }}>
            Billing configuration
          </Title>
          <Content component="p" className="provider-admin-platform-settings-block__subtitle">
            Platform billing and pricing settings
          </Content>
        </div>
        <Form
          id="provider-platform-settings-billing-form"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="provider-admin-platform-settings__form-grid provider-admin-platform-settings__form-grid--2">
            <FormGroup label="vCPU price (per core/hour USD)" fieldId="provider-billing-vcpu">
              <TextInput
                id="provider-billing-vcpu"
                name="priceVcpu"
                type="text"
                value={priceVcpu}
                onChange={(_e, v) => setPriceVcpu(v)}
                aria-label="vCPU price per core per hour in USD"
              />
            </FormGroup>
            <FormGroup label="RAM price (per GB/hour USD)" fieldId="provider-billing-ram">
              <TextInput
                id="provider-billing-ram"
                name="priceRam"
                type="text"
                value={priceRam}
                onChange={(_e, v) => setPriceRam(v)}
                aria-label="RAM price per GB per hour in USD"
              />
            </FormGroup>
            <FormGroup label="Storage (per GB/month USD)" fieldId="provider-billing-storage">
              <TextInput
                id="provider-billing-storage"
                name="priceStorage"
                type="text"
                value={priceStorage}
                onChange={(_e, v) => setPriceStorage(v)}
                aria-label="Storage price per GB per month in USD"
              />
            </FormGroup>
            <FormGroup label="GPU price (per unit/hour USD)" fieldId="provider-billing-gpu">
              <TextInput
                id="provider-billing-gpu"
                name="priceGpu"
                type="text"
                value={priceGpu}
                onChange={(_e, v) => setPriceGpu(v)}
                aria-label="GPU price per unit per hour in USD"
              />
            </FormGroup>
          </div>
          <div className="provider-admin-platform-settings__actions">
            <Button variant="primary" type="submit">
              Update pricing
            </Button>
          </div>
        </Form>
      </section>

      <hr className="provider-admin-platform-settings__divider" aria-hidden />

      <section className="provider-admin-platform-settings-page__block" aria-labelledby="provider-platform-api-heading">
        <div className="provider-admin-platform-settings-block__intro">
          <Title id="provider-platform-api-heading" headingLevel="h2" size="lg" style={{ margin: 0 }}>
            API configuration
          </Title>
          <Content component="p" className="provider-admin-platform-settings-block__subtitle">
            REST API and programmatic access settings
          </Content>
        </div>
        <Form
          id="provider-platform-settings-api-form"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="provider-admin-platform-settings__form-grid provider-admin-platform-settings__form-grid--2">
            <FormGroup label="API endpoint" fieldId="provider-api-endpoint" className="provider-admin-platform-settings__span-2">
              <TextInput
                id="provider-api-endpoint"
                name="apiEndpoint"
                type="url"
                value={apiEndpoint}
                onChange={(_e, v) => setApiEndpoint(v)}
                aria-label="API endpoint"
              />
            </FormGroup>
            <FormGroup label="Rate limit (req/min)" fieldId="provider-api-rate-limit">
              <TextInput
                id="provider-api-rate-limit"
                name="apiRateLimit"
                type="number"
                value={apiRateLimit}
                onChange={(_e, v) => setApiRateLimit(v)}
                aria-label="API rate limit requests per minute"
              />
            </FormGroup>
            <FormGroup label="Token expiry (seconds)" fieldId="provider-api-token-expiry">
              <TextInput
                id="provider-api-token-expiry"
                name="apiTokenExpiry"
                type="number"
                value={apiTokenExpiry}
                onChange={(_e, v) => setApiTokenExpiry(v)}
                aria-label="Token expiry in seconds"
              />
            </FormGroup>
          </div>
          <div className="provider-admin-platform-settings__actions">
            <Button variant="primary" type="submit">
              Save API settings
            </Button>
          </div>
        </Form>
      </section>
    </div>
  )
}
