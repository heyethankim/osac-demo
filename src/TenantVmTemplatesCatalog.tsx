import { useEffect, useMemo, useState } from 'react'
import { RedhatIcon } from '@patternfly/react-icons/dist/esm/icons/redhat-icon'
import { WindowsIcon } from '@patternfly/react-icons/dist/esm/icons/windows-icon'
import { LinuxTuxIcon } from './LinuxTuxIcon'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  ExpandableSection,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerColorVariant,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Divider,
  FormGroup,
  Gallery,
  GalleryItem,
  SearchInput,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  Switch,
  Tab,
  TabContentBody,
  Tabs,
  TabTitleText,
  Title,
} from '@patternfly/react-core'
import {
  TEMPLATE_CATALOG_DETAIL_DEMO_HOSTNAME,
  TEMPLATE_REVIEW_DETAILS_SWITCH_DEFAULTS,
  TEMPLATE_REVIEW_INITIAL_RUN_CAPTION,
  TEMPLATE_REVIEW_METADATA_CAPTION,
  TEMPLATE_REVIEW_NETWORK_CAPTION,
  TEMPLATE_REVIEW_SCHEDULING_CAPTION,
  TEMPLATE_REVIEW_SSH_CAPTION,
  TEMPLATE_REVIEW_STORAGE_CAPTION,
} from './templateProvisionReviewCopy'

type CatalogCardIconProps = Pick<
  React.SVGProps<SVGSVGElement>,
  'aria-hidden' | 'style' | 'className'
>

type CatalogCardIcon = React.ComponentType<CatalogCardIconProps>

type TenantOs = 'rhel' | 'windows' | 'linux'
export type TenantWorkloadKey = 'desktop' | 'high-performance' | 'server'

/** Sidebar workload checkboxes; templates list every tag they match. */
export type TenantWorkloadFilterTag =
  | 'desktop'
  | 'high-performance'
  | 'server'
  | 'machine-learning'
  | 'data-processing'
  | 'analytics'

export type CatalogIconAccent = 'redhat' | 'windows' | 'linux'

export type TenantVmTemplate = {
  id: string
  Icon: CatalogCardIcon
  iconAccent: CatalogIconAccent
  title: string
  subtitle: string
  workspace: string
  bootSourcePvc: string
  workload: TenantWorkloadKey
  workloadFilterTags: TenantWorkloadFilterTag[]
  cpu: string
  memory: string
  os: TenantOs[]
  /** Root disk size for template detail (demo). */
  diskSize?: string
  /** Primary NIC model shown in template detail (demo). */
  networkType?: string
}

export const CATALOG_TEMPLATE_DETAIL_DEFAULTS = {
  diskSize: '80 GiB',
  networkType: 'Masquerade',
} as const

export const CATALOG_ICON_TILE_BG =
  'var(--pf-t--global--background--color--secondary--default)'

/** Icon fill for PatternFly single-color icons; Linux uses multi-color `LinuxTuxIcon` instead. */
export function catalogIconColor(accent: CatalogIconAccent): string | undefined {
  switch (accent) {
    case 'redhat':
      return '#ee0000'
    case 'windows':
      return '#0078d4'
    case 'linux':
      return undefined
  }
}

export const CATALOG_WORKLOAD_LABEL: Record<TenantWorkloadKey, string> = {
  desktop: 'Desktop',
  'high-performance': 'High performance',
  server: 'Server',
}

const CATALOG_OS_LABEL: Record<TenantOs, string> = {
  rhel: 'Red Hat Enterprise Linux',
  windows: 'Microsoft Windows',
  linux: 'Linux',
}

const TENANT_VM_TEMPLATES_SOURCE: TenantVmTemplate[] = [
  {
    id: 'rhel-ai-runtime',
    Icon: RedhatIcon,
    iconAccent: 'redhat',
    title: 'RHEL AI inference runtime',
    subtitle:
      'Enterprise-supported image for serving open models in regulated environments',
    workspace: 'tenant-prod',
    bootSourcePvc: 'rhel9-ai-runtime',
    workload: 'server',
    workloadFilterTags: ['server', 'machine-learning'],
    cpu: '16 vCPU',
    memory: '64 GiB',
    os: ['rhel'],
  },
  {
    id: 'vllm-serve',
    Icon: LinuxTuxIcon,
    iconAccent: 'linux',
    title: 'LLM inference (vLLM)',
    subtitle:
      'OpenAI-compatible API server for served checkpoints and LoRA adapters',
    workspace: 'model-serving',
    bootSourcePvc: 'cuda-vllm-base',
    workload: 'server',
    workloadFilterTags: ['server', 'machine-learning'],
    cpu: '8 vCPU',
    memory: '64 GiB',
    os: ['linux'],
  },
  {
    id: 'jupyter-ml-suite',
    Icon: LinuxTuxIcon,
    iconAccent: 'linux',
    title: 'JupyterLab ML workbench',
    subtitle:
      'Notebooks with scikit-learn, pandas, and optional GPU-backed kernels',
    workspace: 'data-science',
    bootSourcePvc: 'jupyter-ml-cpu-gpu',
    workload: 'desktop',
    workloadFilterTags: ['desktop', 'machine-learning', 'analytics'],
    cpu: '8 vCPU',
    memory: '32 GiB',
    os: ['linux'],
  },
  {
    id: 'rhel-server-std',
    Icon: RedhatIcon,
    iconAccent: 'redhat',
    title: 'RHEL 9 server',
    subtitle: 'Standard enterprise Linux VM with registration helpers',
    workspace: 'tenant-prod',
    bootSourcePvc: 'rhel9-boot-qcow2',
    workload: 'server',
    workloadFilterTags: ['server'],
    cpu: '4 vCPU',
    memory: '16 GiB',
    os: ['rhel'],
  },
  {
    id: 'rhel-hpc',
    Icon: RedhatIcon,
    iconAccent: 'redhat',
    title: 'RHEL 9 HPC base',
    subtitle: 'MPI-friendly image with tuned profiles for compute nodes',
    workspace: 'research-hpc',
    bootSourcePvc: 'rhel9-hpc-boot',
    workload: 'high-performance',
    workloadFilterTags: ['high-performance', 'data-processing'],
    cpu: '16 vCPU',
    memory: '64 GiB',
    os: ['rhel'],
  },
  {
    id: 'win-desktop',
    Icon: WindowsIcon,
    iconAccent: 'windows',
    title: 'Windows 11 desktop',
    subtitle: 'GPU-ready desktop pool image with domain join hooks',
    workspace: 'vdi-pool-a',
    bootSourcePvc: 'win11-golden-v1',
    workload: 'desktop',
    workloadFilterTags: ['desktop'],
    cpu: '2 vCPU',
    memory: '8 GiB',
    os: ['windows'],
  },
  {
    id: 'win-server',
    Icon: WindowsIcon,
    iconAccent: 'windows',
    title: 'Windows Server 2022',
    subtitle: 'General-purpose server roles and high-availability pairs',
    workspace: 'tenant-prod',
    bootSourcePvc: 'ws2022-boot',
    workload: 'server',
    workloadFilterTags: ['server'],
    cpu: '8 vCPU',
    memory: '32 GiB',
    os: ['windows'],
  },
  {
    id: 'ubuntu-desktop',
    Icon: LinuxTuxIcon,
    iconAccent: 'linux',
    title: 'Ubuntu 24.04 desktop',
    subtitle: 'Developer workstation with cloud-init and user-data examples',
    workspace: 'dev-sandbox',
    bootSourcePvc: 'ubuntu2404-desktop',
    workload: 'desktop',
    workloadFilterTags: ['desktop', 'analytics'],
    cpu: '4 vCPU',
    memory: '16 GiB',
    os: ['linux'],
  },
]

/** Gallery order: shuffled each load so RHEL, Windows, and Linux cards appear in a random mix. */
function shuffleCatalogTemplates(templates: TenantVmTemplate[]): TenantVmTemplate[] {
  const out = [...templates]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const TENANT_VM_TEMPLATES = shuffleCatalogTemplates(TENANT_VM_TEMPLATES_SOURCE)

export function getTenantVmTemplateById(id: string): TenantVmTemplate | undefined {
  return TENANT_VM_TEMPLATES_SOURCE.find((t) => t.id === id)
}

type OsFilters = { rhel: boolean; windows: boolean; linux: boolean }
type WorkloadFilters = {
  desktop: boolean
  highPerformance: boolean
  server: boolean
  machineLearning: boolean
  dataProcessing: boolean
  analytics: boolean
}

const initialOs: OsFilters = { rhel: false, windows: false, linux: false }
const initialWl: WorkloadFilters = {
  desktop: false,
  highPerformance: false,
  server: false,
  machineLearning: false,
  dataProcessing: false,
  analytics: false,
}

function osGroupActive(f: OsFilters): boolean {
  return f.rhel || f.windows || f.linux
}

function workloadGroupActive(f: WorkloadFilters): boolean {
  return (
    f.desktop ||
    f.highPerformance ||
    f.server ||
    f.machineLearning ||
    f.dataProcessing ||
    f.analytics
  )
}

function templateMatchesOs(t: TenantVmTemplate, f: OsFilters): boolean {
  if (!osGroupActive(f)) return true
  return t.os.some((o) => (o === 'rhel' && f.rhel) || (o === 'windows' && f.windows) || (o === 'linux' && f.linux))
}

function templateMatchesWorkload(t: TenantVmTemplate, f: WorkloadFilters): boolean {
  if (!workloadGroupActive(f)) return true
  const tags = t.workloadFilterTags
  return (
    (f.desktop && tags.includes('desktop')) ||
    (f.highPerformance && tags.includes('high-performance')) ||
    (f.server && tags.includes('server')) ||
    (f.machineLearning && tags.includes('machine-learning')) ||
    (f.dataProcessing && tags.includes('data-processing')) ||
    (f.analytics && tags.includes('analytics'))
  )
}

export function specRow(label: string, value: string) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 42%) minmax(0, 1fr)',
        gap: 'var(--pf-t--global--spacer--sm)',
        fontSize: 'var(--pf-t--global--font--size--body--sm)',
        alignItems: 'baseline',
      }}
    >
      <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{label}</span>
      <span style={{ wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}

/** Same shuffled gallery order as the template cards (for pickers). */
export function listOrderedCatalogTemplates(): TenantVmTemplate[] {
  return TENANT_VM_TEMPLATES
}

/** One cell in the template card resource row — matches Virtual machines gallery cards. */
function catalogTemplateCardResourceCell(label: string, value: string) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pf-t--global--spacer--xs)',
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontSize: 'var(--pf-t--global--font--size--body--sm)',
          color: 'var(--pf-t--global--text--color--subtle)',
          fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 'var(--pf-t--global--font--size--body--default)',
          color: 'var(--pf-t--global--text--color--regular)',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </span>
    </div>
  )
}

/** Icon, title, and subtitle for a catalog template card (use inside `CardHeader`). */
export function CatalogTemplateCardHeaderContent({
  template,
}: {
  template: TenantVmTemplate
}) {
  const Icon = template.Icon
  const iconColor = catalogIconColor(template.iconAccent)
  const isLinuxTux = template.iconAccent === 'linux'
  const iconPx = isLinuxTux ? 28 : 24
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pf-t--global--spacer--sm)',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--pf-t--global--spacer--md)',
          width: '100%',
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 44,
            height: 44,
            borderRadius: 'var(--pf-t--global--border--radius--medium)',
            backgroundColor: CATALOG_ICON_TILE_BG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            aria-hidden
            style={{
              width: iconPx,
              height: iconPx,
              flexShrink: 0,
              ...(iconColor ? { color: iconColor } : {}),
            }}
          />
        </div>
      </div>
      <div style={{ minWidth: 0, width: '100%', textAlign: 'start' }}>
        <span
          id={`catalog-template-card-title-${template.id}`}
          style={{
            display: 'block',
            fontSize: 'var(--pf-t--global--font--size--body--lg)',
            fontWeight: 'var(--pf-t--global--font--weight--heading--default)',
            color: 'var(--pf-t--global--text--color--regular)',
            wordBreak: 'break-word',
          }}
        >
          {template.title}
        </span>
      </div>
      <Content
        component="p"
        style={{
          margin: 0,
          color: 'var(--pf-t--global--text--color--subtle)',
          fontSize: 'var(--pf-t--global--font--size--body--sm)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}
      >
        {template.subtitle}
      </Content>
    </div>
  )
}

/** CPU / memory / storage grid, divider, and workload row (use inside `CardBody`). */
export function CatalogTemplateCardBodyContent({
  template,
}: {
  template: TenantVmTemplate
}) {
  const storage = template.diskSize ?? CATALOG_TEMPLATE_DETAIL_DEFAULTS.diskSize
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 'var(--pf-t--global--spacer--sm)',
          alignItems: 'start',
        }}
      >
        {catalogTemplateCardResourceCell('CPU', template.cpu)}
        {catalogTemplateCardResourceCell('Memory', template.memory)}
        {catalogTemplateCardResourceCell('Storage', storage)}
      </div>
      <Divider
        component="div"
        role="separator"
        style={{
          marginBlock: 0,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pf-t--global--spacer--sm)',
        }}
      >
        {specRow('Workload', CATALOG_WORKLOAD_LABEL[template.workload])}
      </div>
    </>
  )
}

/** Catalog card face — layout aligned with Virtual machines cards (no console, status, or actions). */
export function CatalogTemplateCardPresentation({
  template,
  cardId,
}: {
  template: TenantVmTemplate
  /** Optional stable id for card root (gallery uses catalog-{id}). */
  cardId?: string
}) {
  return (
    <Card isFullHeight id={cardId ?? `catalog-${template.id}`} component="article">
      <CardHeader>
        <CatalogTemplateCardHeaderContent template={template} />
      </CardHeader>
      <CardBody
        style={{
          paddingTop: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pf-t--global--spacer--md)',
        }}
      >
        <CatalogTemplateCardBodyContent template={template} />
      </CardBody>
    </Card>
  )
}

export type TenantVmTemplatesCatalogProps = {
  /** Open the full Create virtual machine wizard with template path and defaults applied. */
  onOpenCreateVirtualMachineWizardFromTemplate: (
    templateId: string,
    initialVmName: string,
  ) => void
  /**
   * Incremented in the app shell when the user chooses Templates in the sidebar while that
   * section is already active (e.g. close the detail drawer and show the catalog grid).
   */
  navReselectSeq?: number
}

export function TenantVmTemplatesCatalog({
  onOpenCreateVirtualMachineWizardFromTemplate,
  navReselectSeq = 0,
}: TenantVmTemplatesCatalogProps) {
  const [os, setOs] = useState<OsFilters>(initialOs)
  const [wl, setWl] = useState<WorkloadFilters>(initialWl)
  const [osExpanded, setOsExpanded] = useState(true)
  const [wlExpanded, setWlExpanded] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [templateDetailTab, setTemplateDetailTab] = useState<string | number>('overview')

  const selectedTemplate = useMemo(
    () => (selectedTemplateId ? getTenantVmTemplateById(selectedTemplateId) : null),
    [selectedTemplateId],
  )

  const closeTemplateDrawer = () => {
    setSelectedTemplateId(null)
  }

  useEffect(() => {
    setTemplateDetailTab('overview')
  }, [selectedTemplateId])

  useEffect(() => {
    if (navReselectSeq === 0) return
    setSelectedTemplateId(null)
  }, [navReselectSeq])

  const openCreateVirtualMachineWizard = () => {
    if (!selectedTemplate) return
    onOpenCreateVirtualMachineWizardFromTemplate(
      selectedTemplate.id,
      `${selectedTemplate.id}-vm`,
    )
    closeTemplateDrawer()
  }

  const filtersActive = osGroupActive(os) || workloadGroupActive(wl)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return TENANT_VM_TEMPLATES.filter((item) => {
      if (!templateMatchesOs(item, os) || !templateMatchesWorkload(item, wl)) {
        return false
      }
      if (!q) return true
      const hay = [
        item.title,
        item.subtitle,
        item.bootSourcePvc,
        CATALOG_WORKLOAD_LABEL[item.workload],
        item.cpu,
        item.memory,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [os, wl, search])

  const clearFilters = () => {
    setOs(initialOs)
    setWl(initialWl)
  }

  const drawerPanel = (
    <DrawerPanelContent
      className="tenant-vm-template-drawer-panel"
      colorVariant={DrawerColorVariant.default}
      widths={{
        default: 'width_100',
        lg: 'width_66',
        xl: 'width_66',
        '2xl': 'width_66',
      }}
      focusTrap={
        selectedTemplate
          ? {
              enabled: true,
              'aria-labelledby': 'tenant-vm-template-drawer-title',
              elementToFocusOnExpand: '#tenant-vm-template-drawer-title',
            }
          : { enabled: false }
      }
    >
      {selectedTemplate ? (
        <>
          <DrawerHead className="tenant-vm-template-drawer-head">
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--pf-t--global--spacer--md)',
                minWidth: 0,
                flex: '1 1 auto',
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--pf-t--global--border--radius--medium)',
                  backgroundColor: CATALOG_ICON_TILE_BG,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {(() => {
                  const Icon = selectedTemplate.Icon
                  const iconColor = catalogIconColor(selectedTemplate.iconAccent)
                  const isLinuxTux = selectedTemplate.iconAccent === 'linux'
                  const iconPx = isLinuxTux ? 28 : 24
                  return (
                    <Icon
                      aria-hidden
                      style={{
                        width: iconPx,
                        height: iconPx,
                        flexShrink: 0,
                        ...(iconColor ? { color: iconColor } : {}),
                      }}
                    />
                  )
                })()}
              </div>
              <div style={{ minWidth: 0, flex: '1 1 auto' }}>
                <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>
                  <span id="tenant-vm-template-drawer-title" tabIndex={-1}>
                    {selectedTemplate.title}
                  </span>
                </Title>
              </div>
            </div>
            <DrawerActions>
              <DrawerCloseButton onClick={closeTemplateDrawer} />
            </DrawerActions>
            <div className="tenant-vm-template-drawer-head-create">
              <Button variant="primary" onClick={openCreateVirtualMachineWizard}>
                Create virtual machine
              </Button>
            </div>
          </DrawerHead>
          <DrawerPanelBody className="tenant-vm-template-drawer-body">
            <div className="tenant-vm-template-drawer-scroll">
              <Content
                component="p"
                style={{
                  margin: '0 0 var(--pf-t--global--spacer--md)',
                  color: 'var(--pf-t--global--text--color--subtle)',
                  fontSize: 'var(--pf-t--global--font--size--body--default)',
                }}
              >
                {selectedTemplate.subtitle}
              </Content>

              <Tabs
                activeKey={templateDetailTab}
                onSelect={(_e, key) => setTemplateDetailTab(key)}
                aria-label="Template detail sections"
                mountOnEnter
                className="tenant-vm-template-drawer-tabs"
              >
                <Tab eventKey="overview" title={<TabTitleText>Overview</TabTitleText>}>
                  <TabContentBody>
                    <div className="tenant-vm-template-detail-stack">
                      <DescriptionList
                        isCompact
                        aria-label="Template instance overview"
                      >
                        <DescriptionListGroup>
                          <DescriptionListTerm>Guest operating system</DescriptionListTerm>
                          <DescriptionListDescription>
                            {selectedTemplate.os.map((o) => CATALOG_OS_LABEL[o]).join(', ')}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>CPU</DescriptionListTerm>
                          <DescriptionListDescription>
                            {selectedTemplate.cpu}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Memory</DescriptionListTerm>
                          <DescriptionListDescription>
                            {selectedTemplate.memory}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Storage</DescriptionListTerm>
                          <DescriptionListDescription>
                            {selectedTemplate.diskSize ??
                              CATALOG_TEMPLATE_DETAIL_DEFAULTS.diskSize}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Workload</DescriptionListTerm>
                          <DescriptionListDescription>
                            {CATALOG_WORKLOAD_LABEL[selectedTemplate.workload]}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Hostname</DescriptionListTerm>
                          <DescriptionListDescription>
                            {TEMPLATE_CATALOG_DETAIL_DEMO_HOSTNAME}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                      <div className="tenant-vm-template-detail-stack__switches">
                        <FormGroup label="Headless mode" fieldId="template-drawer-headless">
                          <Switch
                            id="template-drawer-headless"
                            aria-label="Headless mode"
                            isChecked={TEMPLATE_REVIEW_DETAILS_SWITCH_DEFAULTS.headlessMode}
                            isDisabled
                          />
                        </FormGroup>
                        <FormGroup
                          label="Guest system log access"
                          fieldId="template-drawer-guest-log"
                        >
                          <Switch
                            id="template-drawer-guest-log"
                            aria-label="Guest system log access"
                            isChecked={TEMPLATE_REVIEW_DETAILS_SWITCH_DEFAULTS.guestLogAccess}
                            isDisabled
                          />
                        </FormGroup>
                        <FormGroup
                          label="Deletion protection"
                          fieldId="template-drawer-deletion-protection"
                        >
                          <Switch
                            id="template-drawer-deletion-protection"
                            aria-label="Deletion protection"
                            isChecked={
                              TEMPLATE_REVIEW_DETAILS_SWITCH_DEFAULTS.deletionProtection
                            }
                            isDisabled
                          />
                        </FormGroup>
                      </div>
                    </div>
                  </TabContentBody>
                </Tab>
                <Tab eventKey="storage" title={<TabTitleText>Storage</TabTitleText>}>
                  <TabContentBody>
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {TEMPLATE_REVIEW_STORAGE_CAPTION}
                    </Content>
                  </TabContentBody>
                </Tab>
                <Tab eventKey="network" title={<TabTitleText>Network</TabTitleText>}>
                  <TabContentBody>
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {TEMPLATE_REVIEW_NETWORK_CAPTION}
                    </Content>
                  </TabContentBody>
                </Tab>
                <Tab eventKey="ssh" title={<TabTitleText>SSH</TabTitleText>}>
                  <TabContentBody>
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {TEMPLATE_REVIEW_SSH_CAPTION}
                    </Content>
                  </TabContentBody>
                </Tab>
                <Tab eventKey="scheduling" title={<TabTitleText>Scheduling</TabTitleText>}>
                  <TabContentBody>
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {TEMPLATE_REVIEW_SCHEDULING_CAPTION}
                    </Content>
                  </TabContentBody>
                </Tab>
                <Tab eventKey="initial-run" title={<TabTitleText>Initial run</TabTitleText>}>
                  <TabContentBody>
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {TEMPLATE_REVIEW_INITIAL_RUN_CAPTION}
                    </Content>
                  </TabContentBody>
                </Tab>
                <Tab eventKey="metadata" title={<TabTitleText>Metadata</TabTitleText>}>
                  <TabContentBody>
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {TEMPLATE_REVIEW_METADATA_CAPTION}
                    </Content>
                  </TabContentBody>
                </Tab>
              </Tabs>
            </div>
          </DrawerPanelBody>
        </>
      ) : null}
    </DrawerPanelContent>
  )

  return (
    <div
      className="tenant-vm-templates-catalog-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        minHeight: 0,
        width: '100%',
        minWidth: 0,
      }}
    >
      <div className="osac-page-toolbar-sticky">
        <div className="osac-page-toolbar-sticky__lead">
          <Title headingLevel="h1" size="2xl" style={{ margin: 0, minWidth: 0 }}>
            VM templates
          </Title>
          <Content
            component="p"
            style={{
              margin: 0,
              maxWidth: '48rem',
              color: 'var(--pf-t--global--text--color--subtle)',
              fontSize: 'var(--pf-t--global--font--size--body--default)',
            }}
          >
            Browse templates by operating system and workload.
          </Content>
        </div>
      </div>

      <div className="tenant-vm-templates-drawer-host">
        <Drawer
          isExpanded={selectedTemplate !== null}
          position="end"
          className="tenant-vm-templates-drawer"
        >
          <DrawerContent panelContent={drawerPanel}>
            <DrawerContentBody className="tenant-vm-templates-drawer__main">
            <Sidebar
              className="catalog-vm-templates-sidebar"
              hasGutter
              hasBorder
              style={{ flex: '1 1 auto', minHeight: 0 }}
            >
        <SidebarPanel hasPadding variant="static">
          <Title
            headingLevel="h2"
            size="md"
            style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
          >
            Categories
          </Title>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--pf-t--global--spacer--md)',
            }}
          >
            <Button
              variant={!filtersActive ? 'secondary' : 'plain'}
              isBlock
              onClick={clearFilters}
            >
              All items
            </Button>

            <ExpandableSection
              toggleText="Operating system"
              isExpanded={osExpanded}
              onToggle={(_e, expanded) => setOsExpanded(expanded)}
              isIndented
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--pf-t--global--spacer--sm)',
                }}
              >
                <Checkbox
                  id="tenant-cat-os-linux"
                  label="Linux"
                  isChecked={os.linux}
                  onChange={(_e, checked) => setOs((s) => ({ ...s, linux: checked }))}
                />
                <Checkbox
                  id="tenant-cat-os-rhel"
                  label="RHEL"
                  isChecked={os.rhel}
                  onChange={(_e, checked) => setOs((s) => ({ ...s, rhel: checked }))}
                />
                <Checkbox
                  id="tenant-cat-os-windows"
                  label="Windows"
                  isChecked={os.windows}
                  onChange={(_e, checked) => setOs((s) => ({ ...s, windows: checked }))}
                />
              </div>
            </ExpandableSection>

            <ExpandableSection
              toggleText="Workload"
              isExpanded={wlExpanded}
              onToggle={(_e, expanded) => setWlExpanded(expanded)}
              isIndented
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--pf-t--global--spacer--sm)',
                }}
              >
                <Checkbox
                  id="tenant-cat-wl-analytics"
                  label="Analytics"
                  isChecked={wl.analytics}
                  onChange={(_e, checked) =>
                    setWl((s) => ({ ...s, analytics: checked }))
                  }
                />
                <Checkbox
                  id="tenant-cat-wl-data"
                  label="Data processing"
                  isChecked={wl.dataProcessing}
                  onChange={(_e, checked) =>
                    setWl((s) => ({ ...s, dataProcessing: checked }))
                  }
                />
                <Checkbox
                  id="tenant-cat-wl-desktop"
                  label="Desktop"
                  isChecked={wl.desktop}
                  onChange={(_e, checked) => setWl((s) => ({ ...s, desktop: checked }))}
                />
                <Checkbox
                  id="tenant-cat-wl-hpc"
                  label="High performance"
                  isChecked={wl.highPerformance}
                  onChange={(_e, checked) =>
                    setWl((s) => ({ ...s, highPerformance: checked }))
                  }
                />
                <Checkbox
                  id="tenant-cat-wl-ml"
                  label="Machine learning"
                  isChecked={wl.machineLearning}
                  onChange={(_e, checked) =>
                    setWl((s) => ({ ...s, machineLearning: checked }))
                  }
                />
                <Checkbox
                  id="tenant-cat-wl-server"
                  label="Server"
                  isChecked={wl.server}
                  onChange={(_e, checked) => setWl((s) => ({ ...s, server: checked }))}
                />
              </div>
            </ExpandableSection>
          </div>
        </SidebarPanel>

        <SidebarContent hasPadding>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--pf-t--global--spacer--md)',
              minHeight: 0,
            }}
          >
            <SearchInput
              placeholder="Filter by keyword..."
              value={search}
              onChange={(_e, v) => setSearch(v)}
              onClear={() => setSearch('')}
              aria-label="Filter catalog by keyword"
            />
            <Content
              component="p"
              style={{
                margin: 0,
                color: 'var(--pf-t--global--text--color--subtle)',
                fontSize: 'var(--pf-t--global--font--size--body--sm)',
              }}
            >
              {filtered.length} item{filtered.length === 1 ? '' : 's'}
            </Content>
            <Gallery
              hasGutter
              minWidths={{ default: '260px', md: '280px', lg: '300px' }}
            >
              {filtered.map((item) => (
                <GalleryItem key={item.id}>
                  <div
                    className="tenant-vm-catalog-template-card-wrap"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTemplateId(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedTemplateId(item.id)
                      }
                    }}
                    aria-labelledby={`catalog-template-card-title-${item.id}`}
                    aria-label={`View details for template ${item.title}`}
                  >
                    <CatalogTemplateCardPresentation template={item} />
                  </div>
                </GalleryItem>
              ))}
            </Gallery>
            {filtered.length === 0 && (
              <Content
                component="p"
                style={{
                  textAlign: 'center',
                  padding: 'var(--pf-t--global--spacer--2xl)',
                }}
              >
                No VM templates match your filters. Try clearing categories or
                adjusting your keyword.
              </Content>
            )}
          </div>
        </SidebarContent>
            </Sidebar>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}
