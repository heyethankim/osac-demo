import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { EllipsisVIcon } from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import { ListIcon } from '@patternfly/react-icons/dist/esm/icons/list-icon'
import { ThIcon } from '@patternfly/react-icons/dist/esm/icons/th-icon'
import { RedhatIcon } from '@patternfly/react-icons/dist/esm/icons/redhat-icon'
import { WindowsIcon } from '@patternfly/react-icons/dist/esm/icons/windows-icon'
import { LinuxTuxIcon } from './LinuxTuxIcon'
import {
  guestOsTypeOptions,
  type GuestOsFamily,
} from './CreateVirtualMachineWizard'
import {
  CATALOG_TEMPLATE_DETAIL_DEFAULTS,
  type TenantVmTemplate,
} from './TenantVmTemplatesCatalog'
import {
  NORTHSTAR_DEMO_VM_COUNTS,
  NORTHSTAR_DEMO_VM_TOTAL,
} from './northstarVmDemoCounts'
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Gallery,
  GalleryItem,
  Label,
  MenuToggle,
  SearchInput,
  Tab,
  TabContentBody,
  Tabs,
  TabTitleText,
  Title,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core'
import tableStyles from '@patternfly/react-styles/css/components/Table/table'

type CatalogCardIconProps = Pick<
  React.SVGProps<SVGSVGElement>,
  'aria-hidden' | 'style' | 'className'
>
type CatalogCardIcon = React.ComponentType<CatalogCardIconProps>
type CatalogIconAccent = 'redhat' | 'windows' | 'linux'
type TenantOs = 'rhel' | 'windows' | 'linux'
export type VmPowerState = 'running' | 'stopped' | 'paused'

const CATALOG_ICON_TILE_BG =
  'var(--pf-t--global--background--color--secondary--default)'

function catalogIconColor(accent: CatalogIconAccent): string | undefined {
  switch (accent) {
    case 'redhat':
      return '#ee0000'
    case 'windows':
      return '#0078d4'
    case 'linux':
      return undefined
  }
}

export type TenantVirtualMachine = {
  id: string
  name: string
  description: string
  /** Tenant workspace / subscription scope for VM as a Service. */
  workspace: string
  status: VmPowerState
  os: TenantOs
  Icon: CatalogCardIcon
  iconAccent: CatalogIconAccent
  /** Display date for list cards (demo). */
  created: string
  /** UTC ms for ordering / “newest created” filter (demo). */
  createdAtMs: number
  /** Display owner (demo). */
  owner: string
  cpu: string
  memory: string
  /** Provisioned disk (demo display). */
  storage: string
  /** Primary network / NIC summary for detail overview (demo). */
  networkSummary: string
  /** Interconnect or management hub (demo). */
  hubName: string
}

/** Payload when completing the “Create new virtual machine” path in the create VM modal wizard. */
export type ProvisionNewVmFromModalPayload = {
  guestOsFamily: GuestOsFamily
  guestOsType: string
  bootSourceChoice: 'boot-volume' | 'no-boot-source'
  cpu: string
  memory: string
  hostname: string
  cloudInitUserData: string
}

export function buildTenantVmFromModalNewPayload(
  payload: ProvisionNewVmFromModalPayload,
): TenantVirtualMachine {
  const os: TenantOs =
    payload.guestOsFamily === 'rhel'
      ? 'rhel'
      : payload.guestOsFamily === 'windows'
        ? 'windows'
        : 'linux'
  const { Icon, iconAccent } =
    os === 'rhel'
      ? { Icon: RedhatIcon, iconAccent: 'redhat' as const }
      : os === 'windows'
        ? { Icon: WindowsIcon, iconAccent: 'windows' as const }
        : { Icon: LinuxTuxIcon, iconAccent: 'linux' as const }
  const typeLabel =
    guestOsTypeOptions[payload.guestOsFamily].find((o) => o.value === payload.guestOsType)
      ?.label ?? payload.guestOsType
  const now = Date.now()
  return {
    id: `vm-new-${now}`,
    name: payload.hostname.trim() || `new-vm-${now}`,
    description: 'Provisioned from the create virtual machine wizard.',
    workspace: 'tenant-prod',
    status: 'running',
    os,
    Icon,
    iconAccent,
    created: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    createdAtMs: now,
    owner: 'Chris Morgan',
    cpu: payload.cpu,
    memory: payload.memory,
    storage: '80 GiB',
    networkSummary: `${typeLabel} · primary NIC`,
    hubName: 'Tenant default hub',
  }
}

const STATUS_LABEL: Record<VmPowerState, string> = {
  running: 'Running',
  stopped: 'Stopped',
  paused: 'Paused',
}

const OS_DISPLAY: Record<TenantOs, string> = {
  rhel: 'Red Hat Enterprise Linux',
  linux: 'Linux',
  windows: 'Windows',
}

type VmCondition = {
  type: string
  status: 'True' | 'False' | 'Unknown'
  reason: string
  message: string
}

function demoConditionsForVm(vm: TenantVirtualMachine): VmCondition[] {
  const ready =
    vm.status === 'running'
      ? ('True' as const)
      : vm.status === 'paused'
        ? ('Unknown' as const)
        : ('False' as const)
  return [
    {
      type: 'Ready',
      status: ready,
      reason: ready === 'True' ? 'PodReady' : 'VMStopped',
      message:
        ready === 'True'
          ? 'Virtual machine is running and accepting workload traffic.'
          : ready === 'Unknown'
            ? 'Power state is paused; readiness cannot be asserted.'
            : 'Virtual machine is not running.',
    },
    {
      type: 'StorageReady',
      status: 'True',
      reason: 'VolumesAttached',
      message: 'All PVCs for this instance are bound and available.',
    },
    {
      type: 'GuestAgentConnected',
      status: vm.status === 'running' ? 'True' : 'False',
      reason: vm.status === 'running' ? 'QemuGuestAgentResponding' : 'AgentUnreachable',
      message:
        vm.status === 'running'
          ? 'QEMU guest agent is responding to status queries.'
          : 'Guest agent is not connected.',
    },
  ]
}

function conditionStatusColor(
  s: VmCondition['status'],
): React.ComponentProps<typeof Label>['color'] {
  switch (s) {
    case 'True':
      return 'green'
    case 'False':
      return 'red'
    default:
      return 'orange'
  }
}

type VmSeed = Omit<TenantVirtualMachine, 'status'>

const TENANT_VM_SEEDS: VmSeed[] = [
  {
    id: 'vm-web-tier-01',
    name: 'web-tier-01',
    description: 'Customer portal front end; autoscaled pool member',
    workspace: 'tenant-prod',
    os: 'rhel',
    Icon: RedhatIcon,
    iconAccent: 'redhat',
    created: 'Dec 3, 2025',
    owner: 'Chris Morgan',
    cpu: '4 vCPU',
    memory: '16 GiB',
    storage: '120 GiB',
    networkSummary: 'Default pod network · 10.128.4.12',
    hubName: 'Northstar interconnect · east-01',
    createdAtMs: Date.UTC(2025, 11, 3),
  },
  {
    id: 'vm-ml-infer-a',
    name: 'ml-inference-a',
    description: 'GPU-backed vLLM endpoint for internal copilot traffic',
    workspace: 'model-serving',
    os: 'linux',
    Icon: LinuxTuxIcon,
    iconAccent: 'linux',
    created: 'Jan 18, 2026',
    owner: 'Chris Morgan',
    cpu: '8 vCPU',
    memory: '64 GiB',
    storage: '512 GiB',
    networkSummary: 'GPU fabric + default · 2 NICs · 192.168.40.8',
    hubName: 'Model-serving hub · us-west',
    createdAtMs: Date.UTC(2026, 0, 18),
  },
  {
    id: 'vm-vdi-14',
    name: 'vdi-pool-14',
    description: 'Persistent desktop for risk analytics workstation',
    workspace: 'vdi-pool-a',
    os: 'windows',
    Icon: WindowsIcon,
    iconAccent: 'windows',
    created: 'Nov 21, 2025',
    owner: 'Chris Morgan',
    cpu: '4 vCPU',
    memory: '16 GiB',
    storage: '256 GiB',
    networkSummary: 'VDI VLAN 412 · isolated desktop segment',
    hubName: 'VDI edge hub · corp',
    createdAtMs: Date.UTC(2025, 10, 21),
  },
  {
    id: 'vm-batch-etl',
    name: 'batch-etl-worker',
    description: 'Nightly ETL job runner; scale to zero when idle',
    workspace: 'data-platform',
    os: 'linux',
    Icon: LinuxTuxIcon,
    iconAccent: 'linux',
    created: 'Feb 2, 2026',
    owner: 'Chris Morgan',
    cpu: '16 vCPU',
    memory: '64 GiB',
    storage: '2 TiB',
    networkSummary: 'Data subnet only · 172.30.12.44',
    hubName: 'Platform services hub',
    createdAtMs: Date.UTC(2026, 1, 2),
  },
  {
    id: 'vm-hpc-node-3',
    name: 'hpc-sim-node-03',
    description: 'MPI worker for Monte Carlo stress simulations',
    workspace: 'research-hpc',
    os: 'rhel',
    Icon: RedhatIcon,
    iconAccent: 'redhat',
    created: 'Oct 7, 2025',
    owner: 'Chris Morgan',
    cpu: '32 vCPU',
    memory: '128 GiB',
    storage: '1 TiB',
    networkSummary: 'RoCE data + IPMI · 10.20.88.3',
    hubName: 'Research HPC hub',
    createdAtMs: Date.UTC(2025, 9, 7),
  },
  {
    id: 'vm-api-gw',
    name: 'api-gateway-west',
    description: 'Regional API gateway; paired with service mesh sidecar',
    workspace: 'shared-services',
    os: 'linux',
    Icon: LinuxTuxIcon,
    iconAccent: 'linux',
    created: 'Jan 4, 2026',
    owner: 'Chris Morgan',
    cpu: '2 vCPU',
    memory: '8 GiB',
    storage: '40 GiB',
    networkSummary: 'Mesh sidecar + edge · 2 NICs',
    hubName: 'Shared services hub · west',
    createdAtMs: Date.UTC(2026, 0, 4),
  },
  {
    id: 'vm-win-sql',
    name: 'sql-reporting-01',
    description: 'Reporting instance; maintenance window Sundays 02:00 UTC',
    workspace: 'tenant-prod',
    os: 'windows',
    Icon: WindowsIcon,
    iconAccent: 'windows',
    created: 'Sep 15, 2025',
    owner: 'Chris Morgan',
    cpu: '8 vCPU',
    memory: '32 GiB',
    storage: '500 GiB',
    networkSummary: 'DB tier network · 10.131.2.19',
    hubName: 'Tenant production hub',
    createdAtMs: Date.UTC(2025, 8, 15),
  },
  {
    id: 'vm-jupyter-sandbox',
    name: 'jupyter-sandbox-chris',
    description: 'Personal notebook VM for ad hoc analysis',
    workspace: 'data-science',
    os: 'linux',
    Icon: LinuxTuxIcon,
    iconAccent: 'linux',
    created: 'Mar 22, 2026',
    owner: 'Chris Morgan',
    cpu: '8 vCPU',
    memory: '32 GiB',
    storage: '200 GiB',
    networkSummary: 'Sandbox bridge · single NIC · 10.99.1.7',
    hubName: 'Data science sandbox hub',
    createdAtMs: Date.UTC(2026, 2, 22),
  },
]

const GEN_OS_CYCLE: TenantOs[] = ['linux', 'rhel', 'windows']
const GEN_ICON_FOR_OS: Record<
  TenantOs,
  { Icon: CatalogCardIcon; iconAccent: CatalogIconAccent }
> = {
  linux: { Icon: LinuxTuxIcon, iconAccent: 'linux' },
  rhel: { Icon: RedhatIcon, iconAccent: 'redhat' },
  windows: { Icon: WindowsIcon, iconAccent: 'windows' },
}

const GEN_WORKSPACES = [
  'tenant-prod',
  'model-serving',
  'vdi-pool-a',
  'data-platform',
  'research-hpc',
  'shared-services',
  'data-science',
  'edge-ingress',
  'payments-sandbox',
] as const

const GEN_DESCRIPTIONS = [
  'General-purpose workload instance with standard monitoring hooks.',
  'Batch or scheduled job runner attached to tenant automation.',
  'Internal service endpoint behind the regional load balancer.',
  'Development and test harness for integration pipelines.',
  'Replica or standby node for high-availability tiers.',
  'Jump or bastion-style access host for restricted subnets.',
  'Cache or session tier backing customer-facing APIs.',
  'Build agent pool member for CI artifact promotion.',
  'Observability sidecar host collecting metrics and traces.',
  'Compliance-scoped VM with hardened baseline image.',
] as const

const GEN_SPECS = [
  { cpu: '2 vCPU', memory: '8 GiB', storage: '60 GiB' },
  { cpu: '4 vCPU', memory: '16 GiB', storage: '100 GiB' },
  { cpu: '8 vCPU', memory: '32 GiB', storage: '200 GiB' },
  { cpu: '8 vCPU', memory: '64 GiB', storage: '400 GiB' },
  { cpu: '16 vCPU', memory: '64 GiB', storage: '800 GiB' },
  { cpu: '16 vCPU', memory: '128 GiB', storage: '1.5 TiB' },
] as const

const GEN_CREATED = [
  'Jan 12, 2026',
  'Feb 28, 2026',
  'Mar 5, 2026',
  'Dec 19, 2025',
  'Nov 2, 2025',
  'Jan 30, 2026',
] as const

const GEN_NETWORK_SUMMARY = [
  'Default pod network · DHCP',
  'Secondary virtual NIC · static 10.50.x.x',
  'Private VLAN · no egress',
  'Edge + internal · dual stack',
  'Service mesh · sidecar attached',
  'Bridge · 1 NIC',
] as const

const GEN_HUB_NAME = [
  'Northstar interconnect · central',
  'Regional hub · us-east',
  'Edge aggregation hub',
  'Tenant default hub',
  'Compliance-scoped hub',
  'Dev/test hub',
] as const

const GEN_NAME_PREFIXES = [
  'api',
  'web',
  'worker',
  'batch',
  'edge',
  'db',
  'cache',
  'queue',
  'jump',
  'svc',
] as const

function shuffleVmPowerStates(): VmPowerState[] {
  const { running, paused, stopped } = NORTHSTAR_DEMO_VM_COUNTS
  const pool: VmPowerState[] = [
    ...Array.from({ length: running }, () => 'running' as const),
    ...Array.from({ length: paused }, () => 'paused' as const),
    ...Array.from({ length: stopped }, () => 'stopped' as const),
  ]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

const SHUFFLED_DEMO_VM_STATUSES = shuffleVmPowerStates()

/** Synthetic VMs use older timestamps so user-provisioned rows stay “newest” with Date.now(). */
const DEMO_SYNTHETIC_CREATED_MS_BASE = Date.UTC(2024, 0, 1)

function buildSyntheticVm(index: number, status: VmPowerState): TenantVirtualMachine {
  const n = index - TENANT_VM_SEEDS.length + 1
  const os = GEN_OS_CYCLE[index % GEN_OS_CYCLE.length]
  const { Icon, iconAccent } = GEN_ICON_FOR_OS[os]
  const prefix = GEN_NAME_PREFIXES[index % GEN_NAME_PREFIXES.length]
  const spec = GEN_SPECS[index % GEN_SPECS.length]
  return {
    id: `vm-synth-${String(n).padStart(3, '0')}`,
    name: `${prefix}-${String(n).padStart(2, '0')}`,
    description: GEN_DESCRIPTIONS[index % GEN_DESCRIPTIONS.length],
    workspace: GEN_WORKSPACES[index % GEN_WORKSPACES.length],
    status,
    os,
    Icon,
    iconAccent,
    created: GEN_CREATED[index % GEN_CREATED.length],
    owner: 'Chris Morgan',
    networkSummary: GEN_NETWORK_SUMMARY[index % GEN_NETWORK_SUMMARY.length],
    hubName: GEN_HUB_NAME[index % GEN_HUB_NAME.length],
    cpu: spec.cpu,
    memory: spec.memory,
    storage: spec.storage,
    createdAtMs: DEMO_SYNTHETIC_CREATED_MS_BASE + index * 60_000,
  }
}

/** Demo: build a list VM row from a catalog template (provisioned immediately from template detail). */
export function buildTenantVirtualMachineFromCatalogTemplate(
  template: TenantVmTemplate,
  vmName: string,
  vmDescription?: string,
): TenantVirtualMachine {
  const os = (template.os[0] ?? 'linux') as TenantOs
  const disk = template.diskSize ?? CATALOG_TEMPLATE_DETAIL_DEFAULTS.diskSize
  const net = template.networkType ?? CATALOG_TEMPLATE_DETAIL_DEFAULTS.networkType
  const name = vmName.trim() || `${template.id}-vm`
  const description =
    vmDescription !== undefined && vmDescription.trim()
      ? vmDescription.trim()
      : template.subtitle
  return {
    id: `vm-from-${template.id}-${Date.now()}`,
    name,
    description,
    workspace: template.workspace,
    status: 'running',
    os,
    Icon: template.Icon,
    iconAccent: template.iconAccent,
    created: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    createdAtMs: Date.now(),
    owner: 'Chris Morgan',
    cpu: template.cpu,
    memory: template.memory,
    storage: disk,
    networkSummary: `${net} · attached`,
    hubName: 'Tenant default hub',
  }
}

export const TENANT_VIRTUAL_MACHINES: TenantVirtualMachine[] = (() => {
  if (SHUFFLED_DEMO_VM_STATUSES.length !== NORTHSTAR_DEMO_VM_TOTAL) {
    throw new Error('Demo VM status pool length must match total VM count')
  }
  if (TENANT_VM_SEEDS.length > NORTHSTAR_DEMO_VM_TOTAL) {
    throw new Error('Too many VM seeds for demo total')
  }
  const fromSeeds = TENANT_VM_SEEDS.map((seed, i) => ({
    ...seed,
    status: SHUFFLED_DEMO_VM_STATUSES[i],
  }))
  const synthetic: TenantVirtualMachine[] = []
  for (let i = TENANT_VM_SEEDS.length; i < NORTHSTAR_DEMO_VM_TOTAL; i++) {
    synthetic.push(buildSyntheticVm(i, SHUFFLED_DEMO_VM_STATUSES[i]))
  }
  return [...fromSeeds, ...synthetic]
})()

type PowerFilterValue = 'all' | VmPowerState
type OsFilterValue = 'all' | TenantOs
type CreatedFilterValue = 'all' | 'newest'

const POWER_FILTER_OPTIONS: { value: PowerFilterValue; label: string }[] = [
  { value: 'all', label: 'All power states' },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'paused', label: 'Paused' },
]

const OS_FILTER_OPTIONS: { value: OsFilterValue; label: string }[] = [
  { value: 'all', label: 'All operating systems' },
  { value: 'linux', label: 'Linux' },
  { value: 'rhel', label: 'RHEL' },
  { value: 'windows', label: 'Windows' },
]

const CREATED_FILTER_OPTIONS: { value: CreatedFilterValue; label: string }[] = [
  { value: 'all', label: 'All creation dates' },
  {
    value: 'newest',
    label: 'Newest created',
  },
]

function powerFilterLabel(value: PowerFilterValue): string {
  return POWER_FILTER_OPTIONS.find((o) => o.value === value)?.label ?? ''
}

function osFilterLabel(value: OsFilterValue): string {
  return OS_FILTER_OPTIONS.find((o) => o.value === value)?.label ?? ''
}

function createdFilterLabel(value: CreatedFilterValue): string {
  return CREATED_FILTER_OPTIONS.find((o) => o.value === value)?.label ?? ''
}

function vmMatchesPower(vm: TenantVirtualMachine, filter: PowerFilterValue): boolean {
  if (filter === 'all') return true
  return vm.status === filter
}

function vmMatchesOsFilter(vm: TenantVirtualMachine, filter: OsFilterValue): boolean {
  if (filter === 'all') return true
  return vm.os === filter
}

/** Keep only VM(s) with the latest createdAtMs among the given candidates (after other filters). */
function filterToNewestCreated(vms: TenantVirtualMachine[]): TenantVirtualMachine[] {
  if (vms.length === 0) return vms
  const maxMs = Math.max(...vms.map((v) => v.createdAtMs))
  return vms.filter((v) => v.createdAtMs === maxMs)
}

function statusLabelColor(
  status: VmPowerState,
): React.ComponentProps<typeof Label>['color'] {
  switch (status) {
    case 'running':
      return 'green'
    case 'paused':
      return 'orange'
    case 'stopped':
      return 'grey'
    default:
      return 'grey'
  }
}

function openSampleVmConsole(vm: TenantVirtualMachine) {
  const base = `${window.location.origin}${window.location.pathname}`
  const q = new URLSearchParams({
    demo: 'vm-console',
    vm: vm.id,
    name: vm.name,
  })
  window.open(`${base}?${q.toString()}`, '_blank', 'noopener,noreferrer')
}

function vmCardActionsMenuItems(
  vm: TenantVirtualMachine,
  onOpenCloneVirtualMachine: (sourceVmId: string) => void,
) {
  return (
    <>
      <DropdownItem key="start" onClick={(e) => e.preventDefault()}>
        Start
      </DropdownItem>
      <DropdownItem key="stop" onClick={(e) => e.preventDefault()}>
        Stop
      </DropdownItem>
      <DropdownItem key="restart" onClick={(e) => e.preventDefault()}>
        Restart
      </DropdownItem>
      <DropdownItem
        key="clone"
        onClick={(e) => {
          e.preventDefault()
          onOpenCloneVirtualMachine(vm.id)
        }}
      >
        Clone
      </DropdownItem>
      <DropdownItem key="migrate" onClick={(e) => e.preventDefault()}>
        Migrate
      </DropdownItem>
      <DropdownItem key="delete" onClick={(e) => e.preventDefault()}>
        Delete
      </DropdownItem>
    </>
  )
}

function vmDetailKebabMenuItems(
  vm: TenantVirtualMachine,
  onOpenCloneVirtualMachine: (sourceVmId: string) => void,
) {
  const running = vm.status === 'running'
  const stopped = vm.status === 'stopped'
  const noop = (e: React.MouseEvent) => {
    e.preventDefault()
  }
  return (
    <>
      <DropdownItem key="start" isDisabled={running} onClick={noop}>
        Start
      </DropdownItem>
      <DropdownItem key="pause" isDisabled={!running} onClick={noop}>
        Pause
      </DropdownItem>
      <DropdownItem key="stop" isDisabled={stopped} onClick={noop}>
        Stop
      </DropdownItem>
      <DropdownItem key="restart" isDisabled={stopped} onClick={noop}>
        Restart
      </DropdownItem>
      <DropdownItem
        key="clone"
        onClick={(e) => {
          e.preventDefault()
          onOpenCloneVirtualMachine(vm.id)
        }}
      >
        Clone
      </DropdownItem>
      <DropdownItem key="migrate" onClick={noop}>
        Migrate
      </DropdownItem>
      <DropdownItem
        key="console"
        onClick={(e) => {
          e.preventDefault()
          openSampleVmConsole(vm)
        }}
      >
        Open console
      </DropdownItem>
      <DropdownItem key="delete" onClick={noop}>
        Delete
      </DropdownItem>
    </>
  )
}

function specRow(label: string, value: string) {
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

function VirtualMachineDetailSnapshot({ vm }: { vm: TenantVirtualMachine }) {
  const isWindows = vm.os === 'windows'
  return (
    <div className="tenant-vm-detail-snapshot">
      <div className="tenant-vm-detail-snapshot__frame">
        <div
          className="northstar-console-demo__terminal tenant-vm-detail-snapshot__terminal-mock"
          aria-label={`Console preview for ${vm.name}`}
        >
          {isWindows ? (
            <>
              <p className="northstar-console-demo__terminal-line northstar-console-demo__terminal-line--prompt">
                <span className="tenant-vm-detail-snapshot__ps-path">PS C:\Users\tenant&gt;</span>{' '}
                <span className="northstar-console-demo__cursor" aria-hidden>
                  ▋
                </span>
              </p>
              <p className="northstar-console-demo__terminal-line">
                Northstar Cloud — VM console (demo)
              </p>
              <p className="northstar-console-demo__terminal-line">
                <span className="tenant-vm-detail-snapshot__terminal-em">{vm.name}</span>
                <span className="northstar-console-demo__terminal-line--muted">
                  {' '}
                  · Guest agent: simulated
                </span>
              </p>
              <p className="northstar-console-demo__terminal-line northstar-console-demo__terminal-line--muted">
                Still snapshot — open console for a live session.
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
                Northstar Cloud — VM console (demo)
              </p>
              <p className="northstar-console-demo__terminal-line">
                <span className="tenant-vm-detail-snapshot__terminal-em">{vm.name}</span>
                <span className="northstar-console-demo__terminal-line--muted">
                  {' '}
                  · Guest agent: simulated · TLS
                </span>
              </p>
              <p className="northstar-console-demo__terminal-line northstar-console-demo__terminal-line--muted">
                Still snapshot — open console for a live session.
              </p>
            </>
          )}
        </div>
      </div>
      <div className="tenant-vm-detail-console-launch">
        <Button variant="secondary" size="sm" onClick={() => openSampleVmConsole(vm)}>
          Launch console
        </Button>
      </div>
      <Content
        component="p"
        className="tenant-vm-detail-snapshot__caption"
        style={{
          margin: 'var(--pf-t--global--spacer--sm) 0 0',
          fontSize: 'var(--pf-t--global--font--size--body--sm)',
          color: 'var(--pf-t--global--text--color--subtle)',
        }}
      >
        Captured view of the guest console (demo). Use Launch console for an interactive session.
      </Content>
    </div>
  )
}

/** Label above value — one cell in the VM card resource row. */
function vmCardResourceCell(label: string, value: string) {
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

export type TenantVirtualMachinesPageProps = {
  /** Opens the shared Create virtual machine wizard (modal is mounted at app shell level). */
  onOpenCreateVirtualMachineModal: () => void
  /** Opens the create VM wizard on the clone path with this VM pre-selected as the source. */
  onOpenCloneVirtualMachine: (sourceVmId: string) => void
  /** When opening this page from the dashboard, seed the power filter (e.g. running). */
  powerFilterIntent?: VmPowerState | null
  /** VMs created from the catalog, shown first (newest at index 0). */
  vmsCreatedFromTemplate?: TenantVirtualMachine[]
  /**
   * Increment when the user provisions from a template so we can turn on “Newest created”
   * reliably (same primitive intent would not retrigger useEffect).
   */
  createdFilterNavigateSeq?: number
  /** When set (e.g. from Topology), open this VM’s detail if it exists in inventory. */
  detailOpenRequest?: { vmId: string; seq: number } | null
  /** Called after a non-null detailOpenRequest is applied so the shell can clear it. */
  onDetailOpenRequestConsumed?: () => void
}

function isDashboardPowerFilterIntent(
  v: VmPowerState | null | undefined,
): v is VmPowerState {
  return v === 'running' || v === 'paused' || v === 'stopped'
}

export function TenantVirtualMachinesPage({
  onOpenCreateVirtualMachineModal,
  onOpenCloneVirtualMachine,
  powerFilterIntent = null,
  vmsCreatedFromTemplate = [],
  createdFilterNavigateSeq = 0,
  detailOpenRequest = null,
  onDetailOpenRequestConsumed,
}: TenantVirtualMachinesPageProps) {
  const [powerFilter, setPowerFilter] = useState<PowerFilterValue>(
    () => powerFilterIntent ?? 'all',
  )
  /** While set, power filter toggle keeps hover-like styling until the user changes the filter. */
  const [dashboardPowerFilterHint, setDashboardPowerFilterHint] = useState<VmPowerState | null>(
    () => (isDashboardPowerFilterIntent(powerFilterIntent) ? powerFilterIntent : null),
  )
  const [osFilter, setOsFilter] = useState<OsFilterValue>('all')
  const [createdFilter, setCreatedFilter] = useState<CreatedFilterValue>('all')
  const [search, setSearch] = useState('')
  const [listDisplayMode, setListDisplayMode] = useState<'grid' | 'table'>('grid')
  const [powerMenuOpen, setPowerMenuOpen] = useState(false)
  const [osMenuOpen, setOsMenuOpen] = useState(false)
  const [createdMenuOpen, setCreatedMenuOpen] = useState(false)
  const [actionsMenuOpenId, setActionsMenuOpenId] = useState<string | null>(null)
  const [detailVmActionsMenuOpen, setDetailVmActionsMenuOpen] = useState(false)
  const [detailConsoleMenuOpen, setDetailConsoleMenuOpen] = useState(false)
  const [detailVmId, setDetailVmId] = useState<string | null>(null)
  const [detailActiveTab, setDetailActiveTab] = useState<string | number>('overview')

  const allVirtualMachines = useMemo(
    () => [...vmsCreatedFromTemplate, ...TENANT_VIRTUAL_MACHINES],
    [vmsCreatedFromTemplate],
  )

  const detailVm = useMemo(
    () => allVirtualMachines.find((v) => v.id === detailVmId),
    [allVirtualMachines, detailVmId],
  )

  useEffect(() => {
    if (detailVmId) setDetailActiveTab('overview')
  }, [detailVmId])

  useEffect(() => {
    setDetailVmActionsMenuOpen(false)
    setDetailConsoleMenuOpen(false)
  }, [detailVmId])

  useEffect(() => {
    if (detailVmId && !allVirtualMachines.some((v) => v.id === detailVmId)) {
      setDetailVmId(null)
    }
  }, [detailVmId, allVirtualMachines])

  useEffect(() => {
    if (!detailOpenRequest) return
    const { vmId } = detailOpenRequest
    if (allVirtualMachines.some((v) => v.id === vmId)) {
      setDetailVmId(vmId)
      onDetailOpenRequestConsumed?.()
    }
  }, [detailOpenRequest, allVirtualMachines, onDetailOpenRequestConsumed])

  useEffect(() => {
    if (isDashboardPowerFilterIntent(powerFilterIntent)) {
      setPowerFilter(powerFilterIntent)
      setDashboardPowerFilterHint(powerFilterIntent)
    }
  }, [powerFilterIntent])

  /*
   * Ref must start below any incoming seq. If we used useRef(createdFilterNavigateSeq), a fresh
   * mount after “create from template” (seq already 1) would compare 1 > 1 and never select
   * “Newest created”, so the new VM would not be the only visible row.
   */
  const prevCreatedSeqRef = useRef(0)
  useLayoutEffect(() => {
    if (createdFilterNavigateSeq > prevCreatedSeqRef.current) {
      setCreatedFilter('newest')
    }
    prevCreatedSeqRef.current = createdFilterNavigateSeq
  }, [createdFilterNavigateSeq])

  const showPowerFilterDashboardHint =
    dashboardPowerFilterHint !== null && powerFilter === dashboardPowerFilterHint

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const base = allVirtualMachines.filter((vm) => {
      if (!vmMatchesPower(vm, powerFilter) || !vmMatchesOsFilter(vm, osFilter)) {
        return false
      }
      if (!q) return true
      return vm.name.toLowerCase().includes(q)
    })
    if (createdFilter === 'all') return base
    return filterToNewestCreated(base)
  }, [allVirtualMachines, powerFilter, osFilter, createdFilter, search])

  const pageShellStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--pf-t--global--spacer--lg)',
    height: '100%',
    minHeight: 0,
  }

  if (detailVm) {
    const conditions = demoConditionsForVm(detailVm)
    const DetailOsIcon = detailVm.Icon
    const detailOsIconColor = catalogIconColor(detailVm.iconAccent)
    const detailOsIconPx = detailVm.iconAccent === 'linux' ? 24 : 20
    return (
      <div className="tenant-vm-page-root" style={pageShellStyle}>
        <div className="tenant-vm-page-sticky-heading tenant-vm-page-sticky-heading--detail">
          <Breadcrumb aria-label="Virtual machine">
            <BreadcrumbItem>
              <Button variant="link" isInline onClick={() => setDetailVmId(null)}>
                Virtual machines
              </Button>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{detailVm.name}</BreadcrumbItem>
          </Breadcrumb>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--pf-t--global--spacer--md)',
            }}
          >
            <Title headingLevel="h1" size="2xl" style={{ margin: 0, minWidth: 0, flex: '1 1 auto' }}>
              {detailVm.name}
            </Title>
            <Dropdown
              isOpen={detailVmActionsMenuOpen}
              onOpenChange={setDetailVmActionsMenuOpen}
              onSelect={() => setDetailVmActionsMenuOpen(false)}
              popperProps={{ placement: 'bottom-end' }}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  variant="plain"
                  isExpanded={detailVmActionsMenuOpen}
                  onClick={() => setDetailVmActionsMenuOpen((o) => !o)}
                  aria-label={`Actions for ${detailVm.name}`}
                  icon={<EllipsisVIcon />}
                />
              )}
            >
              <DropdownList>
                {vmDetailKebabMenuItems(detailVm, onOpenCloneVirtualMachine)}
              </DropdownList>
            </Dropdown>
          </div>
        </div>
        <Tabs
          activeKey={detailActiveTab}
          onSelect={(_e, key) => setDetailActiveTab(key)}
          aria-label="Virtual machine detail sections"
          mountOnEnter
        >
          <Tab eventKey="overview" title={<TabTitleText>Overview</TabTitleText>}>
            <TabContentBody>
              <div className="tenant-vm-detail-overview-layout">
                <Card isFullHeight className="tenant-vm-detail-overview-card">
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <DescriptionList>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Name</DescriptionListTerm>
                        <DescriptionListDescription>{detailVm.name}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Description</DescriptionListTerm>
                        <DescriptionListDescription>{detailVm.description}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Operating system</DescriptionListTerm>
                        <DescriptionListDescription>
                          <div className="tenant-vm-detail-overview-os">
                            <div
                              className="tenant-vm-detail-overview-os__icon-tile"
                              aria-hidden
                            >
                              <DetailOsIcon
                                aria-hidden
                                style={{
                                  width: detailOsIconPx,
                                  height: detailOsIconPx,
                                  flexShrink: 0,
                                  ...(detailOsIconColor ? { color: detailOsIconColor } : {}),
                                }}
                              />
                            </div>
                            <span>{OS_DISPLAY[detailVm.os]}</span>
                          </div>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>CPU</DescriptionListTerm>
                        <DescriptionListDescription>{detailVm.cpu}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Memory</DescriptionListTerm>
                        <DescriptionListDescription>{detailVm.memory}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Storage</DescriptionListTerm>
                        <DescriptionListDescription>{detailVm.storage}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Network</DescriptionListTerm>
                        <DescriptionListDescription>
                          {detailVm.networkSummary}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Hub</DescriptionListTerm>
                        <DescriptionListDescription>{detailVm.hubName}</DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </CardBody>
                </Card>
                <Card isFullHeight className="tenant-vm-detail-overview-card">
                  <CardHeader className="tenant-vm-detail-console-card-header">
                    <div className="tenant-vm-detail-console-card-header__row">
                      <CardTitle>Console</CardTitle>
                      <Label
                        color={statusLabelColor(detailVm.status)}
                        aria-label={`Power state: ${STATUS_LABEL[detailVm.status]}`}
                      >
                        {STATUS_LABEL[detailVm.status]}
                      </Label>
                      <div className="tenant-vm-detail-console-card-header__menu">
                        <Dropdown
                          isOpen={detailConsoleMenuOpen}
                          onOpenChange={setDetailConsoleMenuOpen}
                          onSelect={() => setDetailConsoleMenuOpen(false)}
                          popperProps={{ placement: 'bottom-end' }}
                          toggle={(toggleRef) => (
                            <MenuToggle
                              ref={toggleRef}
                              variant="plain"
                              isExpanded={detailConsoleMenuOpen}
                              onClick={() => setDetailConsoleMenuOpen((o) => !o)}
                              aria-label={`Console actions for ${detailVm.name}`}
                              icon={<EllipsisVIcon />}
                            />
                          )}
                        >
                          <DropdownList>
                            {vmCardActionsMenuItems(detailVm, onOpenCloneVirtualMachine)}
                          </DropdownList>
                        </Dropdown>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <VirtualMachineDetailSnapshot vm={detailVm} />
                  </CardBody>
                </Card>
              </div>
            </TabContentBody>
          </Tab>
          <Tab eventKey="spec" title={<TabTitleText>Spec</TabTitleText>}>
            <TabContentBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>CPU</DescriptionListTerm>
                  <DescriptionListDescription>{detailVm.cpu}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Memory</DescriptionListTerm>
                  <DescriptionListDescription>{detailVm.memory}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Guest OS</DescriptionListTerm>
                  <DescriptionListDescription>
                    {OS_DISPLAY[detailVm.os]}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </TabContentBody>
          </Tab>
          <Tab eventKey="conditions" title={<TabTitleText>Conditions</TabTitleText>}>
            <TabContentBody>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--pf-t--global--spacer--lg)',
                }}
              >
                {conditions.map((c, i) => (
                  <div
                    key={c.type}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--pf-t--global--spacer--xs)',
                      paddingBottom:
                        i < conditions.length - 1
                          ? 'var(--pf-t--global--spacer--md)'
                          : 0,
                      borderBottom:
                        i < conditions.length - 1
                          ? '1px solid var(--pf-t--global--border--color--default)'
                          : 'none',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 'var(--pf-t--global--spacer--sm)',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                        }}
                      >
                        {c.type}
                      </span>
                      <Label color={conditionStatusColor(c.status)}>{c.status}</Label>
                    </div>
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        fontSize: 'var(--pf-t--global--font--size--body--sm)',
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      Reason: {c.reason}
                    </Content>
                    <Content component="p" style={{ margin: 0 }}>
                      {c.message}
                    </Content>
                  </div>
                ))}
              </div>
            </TabContentBody>
          </Tab>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="tenant-vm-page-root" style={pageShellStyle}>
      <div className="tenant-vm-page-sticky-heading">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--pf-t--global--spacer--md)',
            marginBottom: 'var(--pf-t--global--spacer--xs)',
          }}
        >
          <Title headingLevel="h1" size="2xl" style={{ margin: 0, minWidth: 0, flex: '1 1 auto' }}>
            Virtual machines
          </Title>
          <div style={{ flexShrink: 0 }}>
            <Button
              variant="primary"
              onClick={onOpenCreateVirtualMachineModal}
              aria-label="Create virtual machine"
            >
              Create virtual machine
            </Button>
          </div>
        </div>
        <Content
          component="p"
          style={{
            margin: 0,
            maxWidth: '48rem',
            color: 'var(--pf-t--global--text--color--subtle)',
          }}
        >
          View and filter instances. Use the layout toggle for grid cards (same
          style as templates) or a compact table.
        </Content>
      </div>

      <div
        className="tenant-vm-page-filters tenant-vm-page-filters__toolbar"
        role="search"
        aria-label="Virtual machine filters"
      >
        <div className="tenant-vm-page-filters__controls">
          <div className="tenant-vm-page-filters__search-wrap">
            <SearchInput
              className="tenant-vm-page-filters__search"
              placeholder="Filter by VM name"
              value={search}
              onChange={(_e, v) => setSearch(v)}
              onClear={() => setSearch('')}
              aria-label="Filter by VM name"
            />
          </div>
          <Dropdown
            className="tenant-vm-page-filters__dropdown"
            isOpen={powerMenuOpen}
            onOpenChange={setPowerMenuOpen}
            onSelect={() => setPowerMenuOpen(false)}
            popperProps={{ placement: 'bottom-start' }}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                className={
                  showPowerFilterDashboardHint
                    ? 'tenant-vm-filter-dropdown tenant-vm-filter-dropdown--power tenant-vm-power-filter--dashboard-hint'
                    : 'tenant-vm-filter-dropdown tenant-vm-filter-dropdown--power'
                }
              icon={<FilterIcon />}
              isExpanded={powerMenuOpen}
              onClick={() => setPowerMenuOpen((o) => !o)}
              aria-label={
                showPowerFilterDashboardHint
                  ? `Power state filter, ${powerFilterLabel(powerFilter)} selected. Filter applied from dashboard.`
                  : `Power state filter, ${powerFilterLabel(powerFilter)} selected`
              }
            >
              {powerFilterLabel(powerFilter)}
            </MenuToggle>
          )}
        >
          <DropdownList>
            {POWER_FILTER_OPTIONS.map((opt) => (
              <DropdownItem
                key={opt.value}
                isSelected={powerFilter === opt.value}
                onClick={() => {
                  setPowerFilter(opt.value)
                  setDashboardPowerFilterHint(null)
                  setPowerMenuOpen(false)
                }}
              >
                {opt.label}
              </DropdownItem>
            ))}
          </DropdownList>
        </Dropdown>
        <Dropdown
          className="tenant-vm-page-filters__dropdown"
          isOpen={osMenuOpen}
          onOpenChange={setOsMenuOpen}
          onSelect={() => setOsMenuOpen(false)}
          popperProps={{ placement: 'bottom-start' }}
          toggle={(toggleRef) => (
            <MenuToggle
              ref={toggleRef}
              className="tenant-vm-filter-dropdown tenant-vm-filter-dropdown--os"
              icon={<FilterIcon />}
              isExpanded={osMenuOpen}
              onClick={() => setOsMenuOpen((o) => !o)}
              aria-label={`Operating system filter, ${osFilterLabel(osFilter)} selected`}
            >
              {osFilterLabel(osFilter)}
            </MenuToggle>
          )}
        >
          <DropdownList>
            {OS_FILTER_OPTIONS.map((opt) => (
              <DropdownItem
                key={opt.value}
                isSelected={osFilter === opt.value}
                onClick={() => {
                  setOsFilter(opt.value)
                  setOsMenuOpen(false)
                }}
              >
                {opt.label}
              </DropdownItem>
            ))}
          </DropdownList>
        </Dropdown>
        <Dropdown
          className="tenant-vm-page-filters__dropdown"
          isOpen={createdMenuOpen}
          onOpenChange={setCreatedMenuOpen}
          onSelect={() => setCreatedMenuOpen(false)}
          popperProps={{ placement: 'bottom-start' }}
          toggle={(toggleRef) => (
            <MenuToggle
              ref={toggleRef}
              className="tenant-vm-filter-dropdown tenant-vm-filter-dropdown--created"
              icon={<FilterIcon />}
              isExpanded={createdMenuOpen}
              onClick={() => setCreatedMenuOpen((o) => !o)}
              aria-label={`Created date filter, ${createdFilterLabel(createdFilter)} selected`}
            >
              {createdFilterLabel(createdFilter)}
            </MenuToggle>
          )}
        >
          <DropdownList>
            {CREATED_FILTER_OPTIONS.map((opt) => (
              <DropdownItem
                key={opt.value}
                isSelected={createdFilter === opt.value}
                onClick={() => {
                  setCreatedFilter(opt.value)
                  setCreatedMenuOpen(false)
                }}
              >
                {opt.label}
              </DropdownItem>
            ))}
          </DropdownList>
        </Dropdown>
        </div>
        <div className="tenant-vm-page-filters__view-toggle">
          <ToggleGroup
            isCompact
            role="group"
            aria-label="Virtual machine list layout"
            className="tenant-vm-page-filters__toggle-group"
          >
            <ToggleGroupItem
              icon={<ThIcon />}
              aria-label="Grid view"
              isSelected={listDisplayMode === 'grid'}
              onChange={(_event, selected) => {
                if (selected) setListDisplayMode('grid')
              }}
            />
            <ToggleGroupItem
              icon={<ListIcon />}
              aria-label="Table view"
              isSelected={listDisplayMode === 'table'}
              onChange={(_event, selected) => {
                if (selected) setListDisplayMode('table')
              }}
            />
          </ToggleGroup>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pf-t--global--spacer--md)',
          minHeight: 0,
          flex: '1 1 auto',
        }}
      >
        <Content
          component="p"
          style={{
            margin: 0,
            color: 'var(--pf-t--global--text--color--subtle)',
            fontSize: 'var(--pf-t--global--font--size--body--sm)',
          }}
        >
          {filtered.length} virtual machine{filtered.length === 1 ? '' : 's'}
          {createdFilter === 'newest' && filtered.length > 0 ? ' (newest created)' : ''}
        </Content>
        {filtered.length === 0 ? (
          <Content
            component="p"
            style={{
              textAlign: 'center',
              padding: 'var(--pf-t--global--spacer--2xl)',
            }}
          >
            No virtual machines match your filters. Try adjusting power state, operating system,
            or the name search.
          </Content>
        ) : listDisplayMode === 'grid' ? (
        <Gallery hasGutter minWidths={{ default: '260px', md: '280px', lg: '300px' }}>
          {filtered.map((vm) => {
            const Icon = vm.Icon
            const iconColor = catalogIconColor(vm.iconAccent)
            const isLinuxTux = vm.iconAccent === 'linux'
            const iconPx = isLinuxTux ? 28 : 24
            return (
              <GalleryItem key={vm.id}>
                <Card
                  isFullHeight
                  id={`tenant-vm-${vm.id}`}
                  className="tenant-vm-instance-card"
                  tabIndex={0}
                  aria-labelledby={`tenant-vm-card-title-${vm.id}`}
                  onClick={() => setDetailVmId(vm.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setDetailVmId(vm.id)
                    }
                  }}
                >
                  <CardHeader>
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
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 'var(--pf-t--global--spacer--xs)',
                            marginLeft: 'auto',
                          }}
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              openSampleVmConsole(vm)
                            }}
                          >
                            Console
                          </Button>
                          <Label color={statusLabelColor(vm.status)}>
                            {STATUS_LABEL[vm.status]}
                          </Label>
                          <div
                            role="presentation"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Dropdown
                              isOpen={actionsMenuOpenId === vm.id}
                              onOpenChange={(open) =>
                                setActionsMenuOpenId(open ? vm.id : null)
                              }
                              onSelect={() => setActionsMenuOpenId(null)}
                              popperProps={{ placement: 'bottom-end' }}
                              toggle={(toggleRef) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  variant="plain"
                                  size="sm"
                                  isExpanded={actionsMenuOpenId === vm.id}
                                  onClick={() =>
                                    setActionsMenuOpenId((cur) =>
                                      cur === vm.id ? null : vm.id,
                                    )
                                  }
                                  aria-label={`Actions for ${vm.name}`}
                                  icon={<EllipsisVIcon />}
                                />
                              )}
                            >
                              <DropdownList>
                                {vmCardActionsMenuItems(vm, onOpenCloneVirtualMachine)}
                              </DropdownList>
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                      <div style={{ minWidth: 0, width: '100%', textAlign: 'start' }}>
                        <span
                          id={`tenant-vm-card-title-${vm.id}`}
                          style={{
                            display: 'block',
                            fontSize: 'var(--pf-t--global--font--size--body--lg)',
                            fontWeight: 'var(--pf-t--global--font--weight--heading--default)',
                            color: 'var(--pf-t--global--text--color--regular)',
                            wordBreak: 'break-word',
                          }}
                        >
                          {vm.name}
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
                        {vm.description}
                      </Content>
                    </div>
                  </CardHeader>
                  <CardBody
                    style={{
                      paddingTop: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--pf-t--global--spacer--md)',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: 'var(--pf-t--global--spacer--sm)',
                        alignItems: 'start',
                      }}
                    >
                      {vmCardResourceCell('CPU', vm.cpu)}
                      {vmCardResourceCell('Memory', vm.memory)}
                      {vmCardResourceCell('Storage', vm.storage)}
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
                      {specRow('Created', vm.created)}
                      {specRow('Owner', vm.owner)}
                    </div>
                  </CardBody>
                </Card>
              </GalleryItem>
            )
          })}
        </Gallery>
        ) : (
          <div className="tenant-vm-page-table-wrap">
            <table
              className={`${tableStyles.table} ${tableStyles.modifiers.compact} ${tableStyles.modifiers.striped} ${tableStyles.modifiers.truncate} tenant-vm-table`}
              aria-label="Virtual machines"
            >
              <thead className={tableStyles.tableThead}>
                <tr className={tableStyles.tableTr}>
                  <th className={`${tableStyles.tableTh} tenant-vm-table__th--name`} scope="col">
                    Name
                  </th>
                  <th className={`${tableStyles.tableTh} tenant-vm-table__th--status`} scope="col">
                    Status
                  </th>
                  <th
                    className={`${tableStyles.tableTh} ${tableStyles.modifiers.fitContent}`}
                    scope="col"
                  >
                    Console
                  </th>
                  <th className={`${tableStyles.tableTh} tenant-vm-table__th--workspace`} scope="col">
                    Workspace
                  </th>
                  <th className={`${tableStyles.tableTh} tenant-vm-table__th--metric`} scope="col">
                    CPU
                  </th>
                  <th className={`${tableStyles.tableTh} tenant-vm-table__th--metric`} scope="col">
                    Memory
                  </th>
                  <th className={`${tableStyles.tableTh} tenant-vm-table__th--storage`} scope="col">
                    Storage
                  </th>
                  <th className={`${tableStyles.tableTh} tenant-vm-table__th--os`} scope="col">
                    Operating system
                  </th>
                  <th className={`${tableStyles.tableTh} tenant-vm-table__th--created`} scope="col">
                    Created
                  </th>
                  <th
                    className={`${tableStyles.tableTh} ${tableStyles.tableAction} ${tableStyles.modifiers.fitContent}`}
                    aria-label="Row actions"
                    scope="col"
                  />
                </tr>
              </thead>
              <tbody className={tableStyles.tableTbody}>
                {filtered.map((vm) => {
                  const Icon = vm.Icon
                  const iconColor = catalogIconColor(vm.iconAccent)
                  const isLinuxTux = vm.iconAccent === 'linux'
                  const iconPx = isLinuxTux ? 20 : 18
                  return (
                    <tr
                      key={vm.id}
                      className={`${tableStyles.tableTr} ${tableStyles.modifiers.clickable}`}
                      tabIndex={0}
                      onClick={() => setDetailVmId(vm.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setDetailVmId(vm.id)
                        }
                      }}
                    >
                      <td className={`${tableStyles.tableTd} tenant-vm-table__td--name`} data-label="Name">
                        <span
                          className={`${tableStyles.tableText} ${tableStyles.modifiers.truncate}`}
                        >
                          <Button
                            variant="link"
                            isInline
                            className="tenant-vm-table__name-link"
                            title={vm.name}
                            onClick={(e) => {
                              e.stopPropagation()
                              setDetailVmId(vm.id)
                            }}
                          >
                            {vm.name}
                          </Button>
                        </span>
                      </td>
                      <td
                        className={`${tableStyles.tableTd} tenant-vm-table__td--status`}
                        data-label="Status"
                      >
                        <Label color={statusLabelColor(vm.status)} isCompact>
                          {STATUS_LABEL[vm.status]}
                        </Label>
                      </td>
                      <td
                        className={`${tableStyles.tableTd} ${tableStyles.modifiers.fitContent}`}
                        data-label="Console"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openSampleVmConsole(vm)}
                        >
                          Console
                        </Button>
                      </td>
                      <td className={`${tableStyles.tableTd} tenant-vm-table__td--workspace`} data-label="Workspace">
                        <span
                          className={`${tableStyles.tableText} ${tableStyles.modifiers.truncate}`}
                          title={vm.workspace}
                        >
                          {vm.workspace}
                        </span>
                      </td>
                      <td className={`${tableStyles.tableTd} tenant-vm-table__td--metric`} data-label="CPU">
                        <span
                          className={`${tableStyles.tableText} ${tableStyles.modifiers.truncate}`}
                          title={vm.cpu}
                        >
                          {vm.cpu}
                        </span>
                      </td>
                      <td className={`${tableStyles.tableTd} tenant-vm-table__td--metric`} data-label="Memory">
                        <span
                          className={`${tableStyles.tableText} ${tableStyles.modifiers.truncate}`}
                          title={vm.memory}
                        >
                          {vm.memory}
                        </span>
                      </td>
                      <td className={`${tableStyles.tableTd} tenant-vm-table__td--storage`} data-label="Storage">
                        <span
                          className={`${tableStyles.tableText} ${tableStyles.modifiers.truncate}`}
                          title={vm.storage}
                        >
                          {vm.storage}
                        </span>
                      </td>
                      <td
                        className={`${tableStyles.tableTd} tenant-vm-table__td--os`}
                        data-label="Operating system"
                      >
                        <span className="tenant-vm-table__os-cell">
                          <Icon
                            aria-hidden
                            className="tenant-vm-table__os-icon"
                            style={{
                              width: iconPx,
                              height: iconPx,
                              flexShrink: 0,
                              ...(iconColor ? { color: iconColor } : {}),
                            }}
                          />
                          <span className="tenant-vm-table__os-text" title={OS_DISPLAY[vm.os]}>
                            {OS_DISPLAY[vm.os]}
                          </span>
                        </span>
                      </td>
                      <td className={`${tableStyles.tableTd} tenant-vm-table__td--created`} data-label="Created">
                        <span
                          className={`${tableStyles.tableText} ${tableStyles.modifiers.truncate}`}
                          title={vm.created}
                        >
                          {vm.created}
                        </span>
                      </td>
                      <td
                        className={`${tableStyles.tableTd} ${tableStyles.tableAction} ${tableStyles.modifiers.action} ${tableStyles.modifiers.fitContent}`}
                        data-label="Row actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Dropdown
                          isOpen={actionsMenuOpenId === vm.id}
                          onOpenChange={(open) =>
                            setActionsMenuOpenId(open ? vm.id : null)
                          }
                          onSelect={() => setActionsMenuOpenId(null)}
                          popperProps={{ placement: 'bottom-end' }}
                          toggle={(toggleRef) => (
                            <MenuToggle
                              ref={toggleRef}
                              variant="plain"
                              size="sm"
                              isExpanded={actionsMenuOpenId === vm.id}
                              onClick={() =>
                                setActionsMenuOpenId((cur) =>
                                  cur === vm.id ? null : vm.id,
                                )
                              }
                              aria-label={`Actions for ${vm.name}`}
                              icon={<EllipsisVIcon />}
                            />
                          )}
                        >
                          <DropdownList>
                            {vmCardActionsMenuItems(vm, onOpenCloneVirtualMachine)}
                          </DropdownList>
                        </Dropdown>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
