import { useMemo } from 'react'
import {
  Card,
  CardBody,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  Title,
} from '@patternfly/react-core'
import {
  buildDemoVmRecentActivities,
  type VmRecentActivitySeverity,
} from './dashboardVmRecentActivities'

const RECENT_ACTIVITY_STATUS_LABELS: Record<VmRecentActivitySeverity, string> = {
  success: 'Success',
  warning: 'Warning',
  danger: 'Critical',
}

function statusLabel(severity: VmRecentActivitySeverity): string {
  return RECENT_ACTIVITY_STATUS_LABELS[severity]
}

export function RecentActivitiesPage() {
  const activities = useMemo(() => buildDemoVmRecentActivities(), [])

  return (
    <div className="recent-activities-full">
      <div className="recent-activities-full__intro">
        <Title headingLevel="h1" size="2xl" style={{ margin: 0 }}>
          Recent activities
        </Title>
        <Content
          component="p"
          style={{
            margin: 'var(--pf-t--global--spacer--sm) 0 0',
            maxWidth: '52rem',
            color: 'var(--pf-t--global--text--color--subtle)',
            fontSize: 'var(--pf-t--global--font--size--body--default)',
          }}
        >
          Tenant-scoped events for compute, storage, and networking in this workspace (demo data).
          Use the masthead notifications control anytime to return here.
        </Content>
      </div>

      <div className="recent-activities-full__list" role="feed" aria-busy={false}>
        {activities.map((item) => (
          <Card key={item.id} isCompact component="article" className="recent-activities-full__card">
            <CardBody>
              <div className="recent-activities-full__card-top">
                <Label status={item.severity} variant="outline" className="recent-activities-full__status">
                  {statusLabel(item.severity)}
                </Label>
                <span className="recent-activities-full__relative-time">{item.timeLabel}</span>
              </div>
              <Title
                headingLevel="h2"
                size="md"
                style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}
              >
                {item.title}
              </Title>
              <Content
                component="p"
                style={{
                  margin: 'var(--pf-t--global--spacer--xs) 0 var(--pf-t--global--spacer--md)',
                  fontSize: 'var(--pf-t--global--font--size--body--default)',
                }}
              >
                {item.detail}
              </Content>
              <DescriptionList
                aria-label={`Details for ${item.title}`}
                columnModifier={{ default: '2Col' }}
                className="recent-activities-full__dl"
              >
                <DescriptionListGroup>
                  <DescriptionListTerm>Occurred</DescriptionListTerm>
                  <DescriptionListDescription>{item.occurredAt}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Resource</DescriptionListTerm>
                  <DescriptionListDescription>
                    <span className="recent-activities-full__resource-line">
                      <span className="recent-activities-full__resource-type">{item.resourceType}</span>
                      <span className="recent-activities-full__resource-name">{item.resource}</span>
                    </span>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Workspace</DescriptionListTerm>
                  <DescriptionListDescription>{item.workspace}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Initiated by</DescriptionListTerm>
                  <DescriptionListDescription>{item.initiatedBy}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Event ID</DescriptionListTerm>
                  <DescriptionListDescription>
                    <code className="recent-activities-full__event-id">{item.eventId}</code>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
