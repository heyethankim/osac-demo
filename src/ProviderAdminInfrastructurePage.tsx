import { Button, Card, CardBody, Content, Gallery, GalleryItem, Label, Title } from '@patternfly/react-core'
import { ChartLineIcon } from '@patternfly/react-icons/dist/esm/icons/chart-line-icon'
import { BoltIcon } from '@patternfly/react-icons/dist/esm/icons/bolt-icon'
import { CheckIcon } from '@patternfly/react-icons/dist/esm/icons/check-icon'
import { GlobeIcon } from '@patternfly/react-icons/dist/esm/icons/globe-icon'
import { MicrochipIcon } from '@patternfly/react-icons/dist/esm/icons/microchip-icon'
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon'
import { ShieldAltIcon } from '@patternfly/react-icons/dist/esm/icons/shield-alt-icon'
import { InfraAiGpuAllocationDonut, InfraComputeUtilizationBarChart } from './ProviderAdminInfrastructureCharts'

const LONDON_AZS = [
  {
    id: 'az1',
    title: 'London AZ-1 (Docklands)',
    facility: 'Telehouse North',
    servers: 1620,
    utilizationPct: 76,
    gpuNodes: 94,
    latencyMs: '0.8',
  },
  {
    id: 'az2',
    title: 'London AZ-2 (Slough)',
    facility: 'Equinix LD8',
    servers: 1588,
    utilizationPct: 65,
    gpuNodes: 88,
    latencyMs: '1.1',
  },
  {
    id: 'az3',
    title: 'London AZ-3 (Hayes)',
    facility: 'Global Switch',
    servers: 1612,
    utilizationPct: 69,
    gpuNodes: 102,
    latencyMs: '0.9',
  },
] as const

export type ProviderAdminInfrastructurePageProps = {
  isDarkTheme: boolean
}

/** Provider admin — London region infrastructure overview (demo). */
export function ProviderAdminInfrastructurePage({ isDarkTheme }: ProviderAdminInfrastructurePageProps) {
  return (
    <div className="provider-admin-infrastructure-page">
      <div
        className="osac-page-toolbar-sticky provider-admin-infrastructure-page__toolbar"
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
            Infrastructure management
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
            London region infrastructure health, capacity planning, and availability zone management.
          </Content>
        </div>
        <div className="osac-page-toolbar-sticky__actions">
          <Button variant="primary" type="button" icon={<PlusCircleIcon />} onClick={() => {}}>
            Add availability zone
          </Button>
        </div>
      </div>

      <Gallery hasGutter className="provider-admin-infrastructure-page__summary">
        <GalleryItem>
          <Card component="article" isFullHeight className="provider-admin-infra-stat-card">
            <CardBody>
              <Title headingLevel="h2" size="md" style={{ margin: 0, fontWeight: 600 }}>
                Availability zones
              </Title>
              <Title headingLevel="h3" size="4xl" className="provider-admin-infra-stat-card__value" style={{ margin: 0 }}>
                3
              </Title>
              <Content component="p" className="provider-admin-infra-stat-card__hint">
                London region
              </Content>
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card component="article" isFullHeight className="provider-admin-infra-stat-card">
            <CardBody>
              <Title headingLevel="h2" size="md" style={{ margin: 0, fontWeight: 600 }}>
                Total capacity
              </Title>
              <Title headingLevel="h3" size="4xl" className="provider-admin-infra-stat-card__value" style={{ margin: 0 }}>
                4,820
              </Title>
              <Content component="p" className="provider-admin-infra-stat-card__hint">
                Physical servers
              </Content>
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card component="article" isFullHeight className="provider-admin-infra-stat-card">
            <CardBody>
              <Title headingLevel="h2" size="md" style={{ margin: 0, fontWeight: 600 }}>
                Utilization
              </Title>
              <Title headingLevel="h3" size="4xl" className="provider-admin-infra-stat-card__value" style={{ margin: 0 }}>
                72%
              </Title>
              <Content component="p" className="provider-admin-infra-stat-card__hint provider-admin-infra-stat-card__hint--positive">
                +3% from last month
              </Content>
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card component="article" isFullHeight className="provider-admin-infra-stat-card provider-admin-infra-stat-card--gpu">
            <CardBody>
              <Title headingLevel="h2" size="md" style={{ margin: 0, fontWeight: 600 }}>
                GPU nodes
              </Title>
              <Title headingLevel="h3" size="4xl" className="provider-admin-infra-stat-card__value" style={{ margin: 0 }}>
                284
              </Title>
              <Content component="p" className="provider-admin-infra-stat-card__hint provider-admin-infra-stat-card__hint--accent">
                AI/ML infrastructure
              </Content>
            </CardBody>
          </Card>
        </GalleryItem>
      </Gallery>

      <Gallery hasGutter className="provider-admin-infrastructure-page__detail-cards">
        <GalleryItem>
          <Card component="section" className="provider-admin-infra-detail-card provider-admin-infra-detail-card--compute">
            <CardBody className="provider-admin-infra-detail-card__body--fill">
              <Title headingLevel="h2" size="lg" style={{ margin: 0 }}>
                Compute resources
              </Title>
              <Content component="p" className="provider-admin-infra-detail-card__subtitle">
                Utilization as a percent of allocated London region capacity (hover bars for raw totals).
              </Content>
              <InfraComputeUtilizationBarChart isDarkTheme={isDarkTheme} />
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card component="section" className="provider-admin-infra-detail-card provider-admin-infra-detail-card--aiml">
            <CardBody className="provider-admin-infra-detail-card__body--fill">
              <div className="provider-admin-infra-detail-card__aiml-head">
                <span className="provider-admin-infra-detail-card__aiml-icon" aria-hidden>
                  <MicrochipIcon />
                </span>
                <div>
                  <Title headingLevel="h2" size="lg" style={{ margin: 0 }}>
                    AI/ML infrastructure
                  </Title>
                  <Content component="p" className="provider-admin-infra-detail-card__subtitle">
                    Fleet mix by accelerator category (donut proportional to in-use units; hover for limits).
                  </Content>
                </div>
              </div>
              <InfraAiGpuAllocationDonut isDarkTheme={isDarkTheme} />
            </CardBody>
          </Card>
        </GalleryItem>
      </Gallery>

      <Card component="section" className="provider-admin-infra-az-card">
        <CardBody>
          <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>
            Availability zone status
          </Title>
          <Content component="p" className="provider-admin-infra-az-card__lede">
            Real-time status and capacity across London availability zones.
          </Content>
          <ul className="provider-admin-infra-az-list" aria-label="London availability zones">
            {LONDON_AZS.map((az) => (
              <li key={az.id} className="provider-admin-infra-az-row">
                <div className="provider-admin-infra-az-row__top">
                  <div className="provider-admin-infra-az-row__titles">
                    <span className="provider-admin-infra-az-row__name">{az.title}</span>
                    <span className="provider-admin-infra-az-row__facility">{az.facility}</span>
                  </div>
                  <div className="provider-admin-infra-az-row__metrics">
                    <span>
                      <strong>{az.servers.toLocaleString('en-US')}</strong> servers
                    </span>
                    <span>
                      <strong>{az.utilizationPct}%</strong> utilization
                    </span>
                    <span className="provider-admin-infra-az-row__gpu">
                      <BoltIcon aria-hidden />
                      <strong>{az.gpuNodes}</strong> GPU nodes
                    </span>
                  </div>
                  <div className="provider-admin-infra-az-row__status">
                    <Label color="green" isCompact>
                      Healthy
                    </Label>
                    <span className="provider-admin-infra-az-row__latency">
                      <ChartLineIcon aria-hidden />
                      {az.latencyMs}ms
                    </span>
                  </div>
                </div>
                <div
                  className="provider-admin-infra-progress-bar provider-admin-infra-progress-bar--az"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={az.utilizationPct}
                  aria-label={`${az.title} utilization ${az.utilizationPct} percent`}
                >
                  <div
                    className="provider-admin-infra-progress-bar__fill"
                    style={{ width: `${az.utilizationPct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Gallery hasGutter className="provider-admin-infrastructure-page__footer-cards">
        <GalleryItem>
          <Card component="section" className="provider-admin-infra-compliance-card">
            <CardBody>
              <div className="provider-admin-infra-compliance-card__head">
                <span className="provider-admin-infra-compliance-card__icon provider-admin-infra-compliance-card__icon--globe" aria-hidden>
                  <GlobeIcon />
                </span>
                <div>
                  <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>
                    Data sovereignty
                  </Title>
                  <Content component="p" className="provider-admin-infra-compliance-card__lede">
                    All infrastructure located in the United Kingdom
                  </Content>
                </div>
              </div>
              <ul className="provider-admin-infra-compliance-list">
                <li className="provider-admin-infra-compliance-list__item">
                  <div className="provider-admin-infra-compliance-list__row">
                    <div className="provider-admin-infra-compliance-list__text">
                      <span className="provider-admin-infra-compliance-list__label">Geographic region</span>
                      <span className="provider-admin-infra-compliance-list__value">London, United Kingdom</span>
                    </div>
                    <Label color="blue">UK GDPR compliant</Label>
                  </div>
                </li>
                <li className="provider-admin-infra-compliance-list__item">
                  <div className="provider-admin-infra-compliance-list__row provider-admin-infra-compliance-list__row--check">
                    <div className="provider-admin-infra-compliance-list__text">
                      <span className="provider-admin-infra-compliance-list__label">Data residency</span>
                      <span className="provider-admin-infra-compliance-list__value">All data stays within UK borders</span>
                    </div>
                    <CheckIcon className="provider-admin-infra-compliance-list__check" aria-hidden />
                  </div>
                </li>
                <li className="provider-admin-infra-compliance-list__item">
                  <div className="provider-admin-infra-compliance-list__row provider-admin-infra-compliance-list__row--check">
                    <div className="provider-admin-infra-compliance-list__text">
                      <span className="provider-admin-infra-compliance-list__label">Jurisdiction</span>
                      <span className="provider-admin-infra-compliance-list__value">UK law and regulations apply</span>
                    </div>
                    <CheckIcon className="provider-admin-infra-compliance-list__check" aria-hidden />
                  </div>
                </li>
              </ul>
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card component="section" className="provider-admin-infra-compliance-card">
            <CardBody>
              <div className="provider-admin-infra-compliance-card__head">
                <span className="provider-admin-infra-compliance-card__icon provider-admin-infra-compliance-card__icon--shield" aria-hidden>
                  <ShieldAltIcon />
                </span>
                <div>
                  <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>
                    High availability
                  </Title>
                  <Content component="p" className="provider-admin-infra-compliance-card__lede">
                    Multi-AZ redundancy configuration
                  </Content>
                </div>
              </div>
              <ul className="provider-admin-infra-compliance-list">
                <li className="provider-admin-infra-compliance-list__item">
                  <div className="provider-admin-infra-compliance-list__row">
                    <div className="provider-admin-infra-compliance-list__text">
                      <span className="provider-admin-infra-compliance-list__label">Cross-AZ replication</span>
                      <span className="provider-admin-infra-compliance-list__value">3 availability zones active</span>
                    </div>
                    <Label color="green">Active</Label>
                  </div>
                </li>
                <li className="provider-admin-infra-compliance-list__item">
                  <div className="provider-admin-infra-compliance-list__row provider-admin-infra-compliance-list__row--check">
                    <div className="provider-admin-infra-compliance-list__text">
                      <span className="provider-admin-infra-compliance-list__label">Network latency</span>
                      <span className="provider-admin-infra-compliance-list__value">&lt;2ms between all AZs</span>
                    </div>
                    <CheckIcon className="provider-admin-infra-compliance-list__check" aria-hidden />
                  </div>
                </li>
                <li className="provider-admin-infra-compliance-list__item">
                  <div className="provider-admin-infra-compliance-list__row">
                    <div className="provider-admin-infra-compliance-list__text">
                      <span className="provider-admin-infra-compliance-list__label">Uptime SLA</span>
                      <span className="provider-admin-infra-compliance-list__value">99.99% availability guarantee</span>
                    </div>
                    <Label color="purple">Four nines</Label>
                  </div>
                </li>
              </ul>
            </CardBody>
          </Card>
        </GalleryItem>
      </Gallery>
    </div>
  )
}
