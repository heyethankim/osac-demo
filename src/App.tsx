import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { BarsIcon } from '@patternfly/react-icons/dist/esm/icons/bars-icon'
import { BellIcon } from '@patternfly/react-icons/dist/esm/icons/bell-icon'
import { CogIcon } from '@patternfly/react-icons/dist/esm/icons/cog-icon'
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon'
import { UserIcon } from '@patternfly/react-icons/dist/esm/icons/user-icon'
import { NorthstarBankMastheadLogo } from './NorthstarBankMastheadLogo'
import {
  NORTHSTAR_DEMO_VM_COUNTS,
  NORTHSTAR_DEMO_VM_TOTAL,
} from './northstarVmDemoCounts'
import {
  CreateVirtualMachineLaunchButton,
  type CreateVirtualMachineLaunchHandle,
} from './CreateVirtualMachineLaunchModal'
import { TenantVmTemplatesCatalog, getTenantVmTemplateById } from './TenantVmTemplatesCatalog'
import {
  TenantVirtualMachinesPage,
  TENANT_VIRTUAL_MACHINES,
  buildTenantVirtualMachineFromCatalogTemplate,
  buildTenantVmFromModalNewPayload,
  type ProvisionNewVmFromModalPayload,
  type TenantVirtualMachine,
  type VmPowerState,
} from './TenantVirtualMachinesPage'
import { NetworkTopologyPage } from './NetworkTopologyPage'
import { NorthstarBankLoginPage } from './NorthstarBankLoginPage'
import { VmConsoleDemoPage } from './VmConsoleDemoPage'
import { DashboardVmUtilizationSection } from './DashboardVmUtilizationSection'
import { RecentActivitiesPage } from './RecentActivitiesPage'
import { DashboardVmQuotaSection } from './DashboardVmQuotaSection'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  Breadcrumb,
  BreadcrumbItem,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  MenuToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
  SearchInput,
  Switch,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core'

type ShellNavRow =
  | { kind: 'link'; id: string; label: string }
  | {
      kind: 'expand'
      label: string
      groupId: string
      children: { id: string; label: string }[]
    }

const shellNavRows: ShellNavRow[] = [
  { kind: 'link', id: 'dashboard', label: 'Dashboard' },
  {
    kind: 'expand',
    label: 'Compute',
    groupId: 'nav-tenant-user-compute',
    children: [
      { id: 'compute-vms', label: 'Virtual machines' },
      { id: 'catalog', label: 'Templates' },
    ],
  },
  {
    kind: 'expand',
    label: 'Networking',
    groupId: 'nav-tenant-user-networking',
    children: [
      { id: 'network-topology', label: 'Topology' },
      { id: 'network-virtual-networks', label: 'Virtual networks' },
      { id: 'network-ip-management', label: 'IP management' },
      { id: 'network-firewall', label: 'Firewall' },
    ],
  },
  {
    kind: 'expand',
    label: 'Storage',
    groupId: 'nav-tenant-user-storage',
    children: [
      { id: 'storage-disks', label: 'Disks' },
      { id: 'storage-policies', label: 'Storage policies' },
      { id: 'storage-backups', label: 'Backups' },
    ],
  },
]

const catalogNavItemId = 'catalog'
const dashboardNavItemId = 'dashboard'
const topologyNavItemId = 'network-topology'
const virtualMachinesNavItemId = 'compute-vms'

const dashboardPageTitle = 'Welcome Chris Morgan'
const dashboardPageSubtitle =
  'This workspace is for VM as a Service — create, run, and manage virtual machines for your tenant.'

const dashboardVmStatusStats = [
  {
    key: 'all-vms',
    label: 'All VMs',
    value: NORTHSTAR_DEMO_VM_TOTAL,
    valueColor: 'var(--pf-t--global--text--color--regular)',
    caption: 'Total VMs across your workspaces',
  },
  {
    key: 'running',
    label: 'Running',
    value: NORTHSTAR_DEMO_VM_COUNTS.running,
    valueColor: 'var(--pf-t--global--color--status--success--default)',
    caption: 'On and ready for workloads',
  },
  {
    key: 'paused',
    label: 'Paused',
    value: NORTHSTAR_DEMO_VM_COUNTS.paused,
    valueColor: 'var(--pf-t--global--color--status--warning--default)',
    caption: 'Suspended with memory and disks retained',
  },
  {
    key: 'stopped',
    label: 'Stopped',
    value: NORTHSTAR_DEMO_VM_COUNTS.stopped,
    valueColor: 'var(--pf-t--global--color--status--danger--default)',
    caption: 'Powered off storage may still incur cost',
  },
] as const

function navLabelForItemId(
  rows: ShellNavRow[],
  itemId: string | number,
): string {
  const id = String(itemId)
  for (const row of rows) {
    if (row.kind === 'link' && row.id === id) return row.label
    if (row.kind === 'expand') {
      const child = row.children.find((c) => c.id === id)
      if (child) return child.label
    }
  }
  return 'Workspace'
}

function readVmConsoleDemoQuery(): { vmId: string; vmName: string } | null {
  if (typeof window === 'undefined') return null
  const p = new URLSearchParams(window.location.search)
  if (p.get('demo') !== 'vm-console') return null
  const rawName = p.get('name')
  let vmName = 'Virtual machine'
  if (rawName) {
    try {
      vmName = decodeURIComponent(rawName)
    } catch {
      vmName = rawName
    }
  }
  return { vmId: p.get('vm') ?? '', vmName }
}

function App() {
  const [vmConsoleDemo, setVmConsoleDemo] = useState(readVmConsoleDemoQuery)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeItem, setActiveItem] = useState<string | number>('dashboard')
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [computeNavExpanded, setComputeNavExpanded] = useState(true)
  const [networkingNavExpanded, setNetworkingNavExpanded] = useState(true)
  const [storageNavExpanded, setStorageNavExpanded] = useState(true)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [vmListPowerFilterIntent, setVmListPowerFilterIntent] =
    useState<VmPowerState | null>(null)
  const [vmsCreatedFromTemplate, setVmsCreatedFromTemplate] = useState<
    TenantVirtualMachine[]
  >([])
  const [vmListCreatedFilterNavigateSeq, setVmListCreatedFilterNavigateSeq] = useState(0)
  const [recentActivitiesPageOpen, setRecentActivitiesPageOpen] = useState(false)
  const [globalSearchQuery, setGlobalSearchQuery] = useState('')
  const [topologyVmDetailOpenRequest, setTopologyVmDetailOpenRequest] = useState<{
    vmId: string
    seq: number
  } | null>(null)

  const createVmLaunchRef = useRef<CreateVirtualMachineLaunchHandle>(null)
  const openCreateVirtualMachineModal = useCallback(() => {
    createVmLaunchRef.current?.open()
  }, [])

  const openCreateVirtualMachineWizardFromCatalogTemplate = useCallback(
    (templateId: string, initialVmName: string) => {
      createVmLaunchRef.current?.openFromCatalogTemplate(templateId, initialVmName)
    },
    [],
  )

  const allTenantVirtualMachines = useMemo(
    () => [...vmsCreatedFromTemplate, ...TENANT_VIRTUAL_MACHINES],
    [vmsCreatedFromTemplate],
  )

  const openVirtualMachineDetailFromTopology = useCallback((vmId: string) => {
    setComputeNavExpanded(true)
    setActiveItem(virtualMachinesNavItemId)
    setTopologyVmDetailOpenRequest((prev) => ({
      vmId,
      seq: (prev?.seq ?? 0) + 1,
    }))
  }, [])

  const clearTopologyVmDetailOpenRequest = useCallback(() => {
    setTopologyVmDetailOpenRequest(null)
  }, [])

  const createVirtualMachineFromCatalogTemplate = useCallback(
    (templateId: string, vmName: string, vmDescription?: string) => {
      const tpl = getTenantVmTemplateById(templateId)
      if (!tpl) return
      const vm = buildTenantVirtualMachineFromCatalogTemplate(tpl, vmName, vmDescription)
      setVmsCreatedFromTemplate((prev) => [vm, ...prev])
      setVmListCreatedFilterNavigateSeq((s) => s + 1)
      setComputeNavExpanded(true)
      setActiveItem(virtualMachinesNavItemId)
    },
    [],
  )

  const provisionNewVmFromModal = useCallback((payload: ProvisionNewVmFromModalPayload) => {
    const vm = buildTenantVmFromModalNewPayload(payload)
    setVmsCreatedFromTemplate((prev) => [vm, ...prev])
    setVmListCreatedFilterNavigateSeq((s) => s + 1)
  }, [])

  const provisionVmCloneFromModal = useCallback(
    (sourceVmId: string, newName: string) => {
      const src = allTenantVirtualMachines.find((v) => v.id === sourceVmId)
      if (!src) return
      const now = Date.now()
      const cloned: TenantVirtualMachine = {
        ...src,
        id: `vm-clone-${now}`,
        name: newName.trim() || `${src.name}-clone`,
        description: `Cloned from ${src.name}.`,
        created: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        createdAtMs: now,
      }
      setVmsCreatedFromTemplate((prev) => [cloned, ...prev])
      setVmListCreatedFilterNavigateSeq((s) => s + 1)
    },
    [allTenantVirtualMachines],
  )

  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.toggle('pf-v6-theme-dark', isDarkTheme)
    root.dataset.osacTheme = isDarkTheme ? 'dark' : 'light'
  }, [isDarkTheme])

  useEffect(() => {
    document.title = 'Northstar Bank - Smart banking starts here.'
  }, [])

  useEffect(() => {
    if (activeItem !== virtualMachinesNavItemId) {
      setVmListPowerFilterIntent(null)
      setVmListCreatedFilterNavigateSeq(0)
    }
  }, [activeItem])

  useEffect(() => {
    setRecentActivitiesPageOpen(false)
  }, [activeItem])

  if (vmConsoleDemo) {
    return (
      <VmConsoleDemoPage
        vmId={vmConsoleDemo.vmId}
        vmName={vmConsoleDemo.vmName}
        onClose={() => {
          setVmConsoleDemo(null)
          window.history.replaceState({}, '', window.location.pathname)
        }}
      />
    )
  }

  if (!isLoggedIn) {
    return (
      <NorthstarBankLoginPage
        onLoginSuccess={() => {
          setActiveItem('dashboard')
          setIsLoggedIn(true)
        }}
      />
    )
  }

  const showCatalogPage = activeItem === catalogNavItemId
  const showVirtualMachinesPage = activeItem === virtualMachinesNavItemId
  const showTopologyPage = activeItem === topologyNavItemId

  const recentActivitiesBreadcrumb = recentActivitiesPageOpen ? (
    <Breadcrumb>
      <BreadcrumbItem>
        <Button
          variant="link"
          isInline
          onClick={() => {
            setRecentActivitiesPageOpen(false)
            setActiveItem(dashboardNavItemId)
          }}
        >
          Dashboard
        </Button>
      </BreadcrumbItem>
      <BreadcrumbItem isActive>Recent activities</BreadcrumbItem>
    </Breadcrumb>
  ) : undefined

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton variant="plain" aria-label="Global navigation">
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadLogo className="northstar-masthead-logo">
          <MastheadBrand>
            <NorthstarBankMastheadLogo />
          </MastheadBrand>
        </MastheadLogo>
      </MastheadMain>
      <MastheadContent className="northstar-masthead-content">
        <div className="northstar-masthead-search">
          <SearchInput
            placeholder="Search"
            value={globalSearchQuery}
            onChange={(_e, value) => setGlobalSearchQuery(value)}
            onClear={() => setGlobalSearchQuery('')}
            aria-label="Global search"
          />
        </div>
        <span className="northstar-masthead-content__spacer" aria-hidden />
        <Toolbar
          ouiaId="masthead-utilities-toolbar"
          className="northstar-masthead-utilities-toolbar"
        >
          <ToolbarContent alignItems="center">
            <ToolbarGroup
              align={{ default: 'alignEnd' }}
              variant="action-group-plain"
              gap={{ default: 'gapSm' }}
            >
              <ToolbarItem>
                <Button
                  variant="plain"
                  aria-label="Recent activities"
                  onClick={() => setRecentActivitiesPageOpen(true)}
                >
                  <BellIcon />
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  variant="plain"
                  aria-label="Help"
                  onClick={(e) => e.preventDefault()}
                >
                  <OutlinedQuestionCircleIcon />
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  variant="plain"
                  aria-label="Settings"
                  onClick={(e) => e.preventDefault()}
                >
                  <CogIcon />
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  isOpen={isUserMenuOpen}
                  onSelect={() => setIsUserMenuOpen(false)}
                  onOpenChange={setIsUserMenuOpen}
                  popperProps={{ position: 'right' }}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      isExpanded={isUserMenuOpen}
                      onClick={() => setIsUserMenuOpen((o) => !o)}
                      icon={<UserIcon />}
                      aria-label="Account menu"
                    >
                      Chris Morgan
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem value="profile" onClick={(e) => e.preventDefault()}>
                      Account settings
                    </DropdownItem>
                    <DropdownItem
                      value="logout"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        setGlobalSearchQuery('')
                        setIsLoggedIn(false)
                      }}
                    >
                      Log out
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  )

  const sidebar = (
    <PageSidebar>
      <PageSidebarBody isFilled>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            gap: 'var(--pf-t--global--spacer--md)',
          }}
        >
          <Nav
            className="osac-app-shell-nav"
            aria-label="Primary"
            onSelect={(_e, item) => setActiveItem(item.itemId)}
          >
            <NavList>
              {shellNavRows.map((row) =>
                row.kind === 'link' ? (
                  <NavItem
                    key={row.id}
                    itemId={row.id}
                    isActive={activeItem === row.id}
                    to="#"
                    preventDefault
                  >
                    {row.label}
                  </NavItem>
                ) : (
                  <NavExpandable
                    key={row.groupId}
                    title={row.label}
                    groupId={row.groupId}
                    isExpanded={
                      row.groupId === 'nav-tenant-user-compute'
                        ? computeNavExpanded
                        : row.groupId === 'nav-tenant-user-networking'
                          ? networkingNavExpanded
                          : storageNavExpanded
                    }
                    onExpand={(_event, expanded) => {
                      if (row.groupId === 'nav-tenant-user-compute') {
                        setComputeNavExpanded(expanded)
                      } else if (row.groupId === 'nav-tenant-user-networking') {
                        setNetworkingNavExpanded(expanded)
                      } else {
                        setStorageNavExpanded(expanded)
                      }
                    }}
                    isActive={row.children.some((c) => c.id === String(activeItem))}
                  >
                    {row.children.map((child) => (
                      <NavItem
                        key={child.id}
                        itemId={child.id}
                        groupId={row.groupId}
                        isActive={activeItem === child.id}
                        to="#"
                        preventDefault
                      >
                        {child.label}
                      </NavItem>
                    ))}
                  </NavExpandable>
                ),
              )}
            </NavList>
          </Nav>
          <div
            style={{
              marginTop: 'auto',
              alignSelf: 'stretch',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'var(--pf-t--global--spacer--md)',
            }}
          >
            <Switch
              id="northstar-tenant-dark-theme"
              label="Dark theme"
              isChecked={isDarkTheme}
              onChange={(_event, checked) => setIsDarkTheme(checked)}
            />
          </div>
        </div>
      </PageSidebarBody>
    </PageSidebar>
  )

  const isSparseShellPage =
    !recentActivitiesPageOpen &&
    !showCatalogPage &&
    !showVirtualMachinesPage &&
    !showTopologyPage &&
    activeItem !== dashboardNavItemId

  return (
    <Page
      className="northstar-tenant-app"
      masthead={masthead}
      sidebar={sidebar}
      breadcrumb={recentActivitiesBreadcrumb}
      isManagedSidebar
      isContentFilled={!isSparseShellPage}
      mainAriaLabel="Northstar Bank cloud workspace"
    >
      <PageSection
        isFilled={!isSparseShellPage}
        className={`osac-page-main-section${showTopologyPage ? ' osac-page-main-section--topology' : ''}`}
      >
        <CreateVirtualMachineLaunchButton
          ref={createVmLaunchRef}
          hideTriggerButton
          existingVirtualMachines={allTenantVirtualMachines}
          onProvisionNewVm={provisionNewVmFromModal}
          onProvisionFromTemplate={createVirtualMachineFromCatalogTemplate}
          onProvisionClone={provisionVmCloneFromModal}
        />
        {recentActivitiesPageOpen ? (
          <div className="osac-non-catalog-main">
            <RecentActivitiesPage />
          </div>
        ) : showCatalogPage ? (
          <TenantVmTemplatesCatalog
            onOpenCreateVirtualMachineWizardFromTemplate={
              openCreateVirtualMachineWizardFromCatalogTemplate
            }
          />
        ) : showTopologyPage ? (
          <div className="osac-non-catalog-main osac-non-catalog-main--topology">
            <NetworkTopologyPage
              vms={allTenantVirtualMachines}
              onOpenVirtualMachineDetail={openVirtualMachineDetailFromTopology}
            />
          </div>
        ) : showVirtualMachinesPage ? (
          <TenantVirtualMachinesPage
            onOpenCreateVirtualMachineModal={openCreateVirtualMachineModal}
            powerFilterIntent={vmListPowerFilterIntent}
            vmsCreatedFromTemplate={vmsCreatedFromTemplate}
            createdFilterNavigateSeq={vmListCreatedFilterNavigateSeq}
            detailOpenRequest={topologyVmDetailOpenRequest}
            onDetailOpenRequestConsumed={clearTopologyVmDetailOpenRequest}
          />
        ) : (
          <div
            className={
              activeItem === dashboardNavItemId
                ? 'osac-non-catalog-main'
                : 'osac-non-catalog-main osac-non-catalog-main--sparse'
            }
          >
            <div
              className="osac-page-toolbar-sticky"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 'var(--pf-t--global--spacer--md)',
              }}
            >
              {activeItem === dashboardNavItemId ? (
                <div className="osac-page-toolbar-sticky__lead">
                  <Title headingLevel="h1" size="2xl" style={{ margin: 0 }}>
                    {dashboardPageTitle}
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
                    {dashboardPageSubtitle}
                  </Content>
                </div>
              ) : (
                <div className="osac-page-toolbar-sticky__lead">
                  <Title headingLevel="h1" size="2xl" style={{ margin: 0 }}>
                    {navLabelForItemId(shellNavRows, activeItem)}
                  </Title>
                </div>
              )}
              {activeItem === dashboardNavItemId ? (
                <div style={{ flexShrink: 0 }}>
                  <Button
                    variant="primary"
                    onClick={openCreateVirtualMachineModal}
                    aria-label="Create virtual machine"
                  >
                    Create virtual machine
                  </Button>
                </div>
              ) : null}
            </div>
            {activeItem === dashboardNavItemId && (
              <>
              <div className="osac-dashboard-vm-stats-grid">
                {dashboardVmStatusStats.map((stat) => {
                  const statCardBodyStyle = {
                    display: 'flex' as const,
                    flexDirection: 'column' as const,
                    gap: 'var(--pf-t--global--spacer--xs)',
                    height: '100%',
                  }
                  const labelTextStyle = {
                    margin: 0,
                    color: 'var(--pf-t--global--text--color--regular)',
                    fontSize: 'var(--pf-t--global--font--size--heading--xs)',
                    fontWeight: 'var(--pf-t--global--font--weight--heading--bold)',
                    lineHeight: 'var(--pf-t--global--font--line-height--heading)',
                    whiteSpace: 'nowrap' as const,
                    overflow: 'hidden' as const,
                    textOverflow: 'ellipsis' as const,
                    minWidth: 0,
                  }
                  const valueTitleStyle = {
                    margin: 0,
                    color: stat.valueColor,
                    fontWeight: 'var(--pf-t--global--font--weight--heading--bold)',
                    whiteSpace: 'nowrap' as const,
                    overflow: 'hidden' as const,
                    textOverflow: 'ellipsis' as const,
                    minWidth: 0,
                  }
                  const captionStyle = {
                    margin: 0,
                    marginTop: 'auto',
                    paddingTop: 'var(--pf-t--global--spacer--xs)',
                    color: 'var(--pf-t--global--text--color--subtle)',
                    fontSize: 'var(--pf-t--global--font--size--body--sm)',
                    lineHeight: 'var(--pf-t--global--font--line-height--body)',
                    whiteSpace: 'nowrap' as const,
                    overflow: 'hidden' as const,
                    textOverflow: 'ellipsis' as const,
                    minWidth: 0,
                  }

                  if (stat.key === 'all-vms') {
                    return (
                      <Card
                        key={stat.key}
                        id="osac-dashboard-all-vms-card"
                        isClickable
                        isFullHeight
                        component="article"
                        className="osac-dashboard-vm-stat-card osac-dashboard-vm-stat-card--link"
                      >
                        <CardHeader
                          selectableActions={{
                            onClickAction: () => {
                              setVmListPowerFilterIntent(null)
                              setComputeNavExpanded(true)
                              setActiveItem(virtualMachinesNavItemId)
                            },
                            selectableActionAriaLabel: `${stat.label}, ${stat.value}, ${stat.caption}. Open Virtual machines`,
                          }}
                        >
                          <CardTitle component="h2" style={labelTextStyle}>
                            {stat.label}
                          </CardTitle>
                        </CardHeader>
                        <CardBody style={statCardBodyStyle}>
                          <Title headingLevel="h3" size="4xl" style={valueTitleStyle}>
                            {stat.value}
                          </Title>
                          <Content component="p" title={stat.caption} style={captionStyle}>
                            {stat.caption}
                          </Content>
                        </CardBody>
                      </Card>
                    )
                  }

                  if (stat.key === 'running') {
                    return (
                      <Card
                        key={stat.key}
                        id="osac-dashboard-running-vms-card"
                        isClickable
                        isFullHeight
                        component="article"
                        className="osac-dashboard-vm-stat-card osac-dashboard-vm-stat-card--link"
                      >
                        <CardHeader
                          selectableActions={{
                            onClickAction: () => {
                              setVmListPowerFilterIntent('running')
                              setComputeNavExpanded(true)
                              setActiveItem(virtualMachinesNavItemId)
                            },
                            selectableActionAriaLabel: `${stat.label}, ${stat.value}, ${stat.caption}. Open Virtual machines filtered to running`,
                          }}
                        >
                          <CardTitle component="h2" style={labelTextStyle}>
                            {stat.label}
                          </CardTitle>
                        </CardHeader>
                        <CardBody style={statCardBodyStyle}>
                          <Title headingLevel="h3" size="4xl" style={valueTitleStyle}>
                            {stat.value}
                          </Title>
                          <Content component="p" title={stat.caption} style={captionStyle}>
                            {stat.caption}
                          </Content>
                        </CardBody>
                      </Card>
                    )
                  }

                  if (stat.key === 'paused') {
                    return (
                      <Card
                        key={stat.key}
                        id="osac-dashboard-paused-vms-card"
                        isClickable
                        isFullHeight
                        component="article"
                        className="osac-dashboard-vm-stat-card osac-dashboard-vm-stat-card--link"
                      >
                        <CardHeader
                          selectableActions={{
                            onClickAction: () => {
                              setVmListPowerFilterIntent('paused')
                              setComputeNavExpanded(true)
                              setActiveItem(virtualMachinesNavItemId)
                            },
                            selectableActionAriaLabel: `${stat.label}, ${stat.value}, ${stat.caption}. Open Virtual machines filtered to paused`,
                          }}
                        >
                          <CardTitle component="h2" style={labelTextStyle}>
                            {stat.label}
                          </CardTitle>
                        </CardHeader>
                        <CardBody style={statCardBodyStyle}>
                          <Title headingLevel="h3" size="4xl" style={valueTitleStyle}>
                            {stat.value}
                          </Title>
                          <Content component="p" title={stat.caption} style={captionStyle}>
                            {stat.caption}
                          </Content>
                        </CardBody>
                      </Card>
                    )
                  }

                  if (stat.key === 'stopped') {
                    return (
                      <Card
                        key={stat.key}
                        id="osac-dashboard-stopped-vms-card"
                        isClickable
                        isFullHeight
                        component="article"
                        className="osac-dashboard-vm-stat-card osac-dashboard-vm-stat-card--link"
                      >
                        <CardHeader
                          selectableActions={{
                            onClickAction: () => {
                              setVmListPowerFilterIntent('stopped')
                              setComputeNavExpanded(true)
                              setActiveItem(virtualMachinesNavItemId)
                            },
                            selectableActionAriaLabel: `${stat.label}, ${stat.value}, ${stat.caption}. Open Virtual machines filtered to stopped`,
                          }}
                        >
                          <CardTitle component="h2" style={labelTextStyle}>
                            {stat.label}
                          </CardTitle>
                        </CardHeader>
                        <CardBody style={statCardBodyStyle}>
                          <Title headingLevel="h3" size="4xl" style={valueTitleStyle}>
                            {stat.value}
                          </Title>
                          <Content component="p" title={stat.caption} style={captionStyle}>
                            {stat.caption}
                          </Content>
                        </CardBody>
                      </Card>
                    )
                  }

                  return null
                })}
              </div>
              <DashboardVmUtilizationSection
                isDarkTheme={isDarkTheme}
                onOpenRecentActivities={() => setRecentActivitiesPageOpen(true)}
              />
              <DashboardVmQuotaSection isDarkTheme={isDarkTheme} />
              </>
            )}
          </div>
        )}
      </PageSection>
    </Page>
  )
}

export default App
