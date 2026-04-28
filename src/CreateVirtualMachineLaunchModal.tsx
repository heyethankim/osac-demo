import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ComponentProps,
  type ComponentType,
  type SVGProps,
} from 'react'
import { CatalogIcon } from '@patternfly/react-icons/dist/esm/icons/catalog-icon'
import { CloneIcon } from '@patternfly/react-icons/dist/esm/icons/clone-icon'
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon'
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import { RedhatIcon } from '@patternfly/react-icons/dist/esm/icons/redhat-icon'
import { WindowsIcon } from '@patternfly/react-icons/dist/esm/icons/windows-icon'
import { LinuxTuxIcon } from './LinuxTuxIcon'
import {
  CatalogTemplateCardBodyContent,
  CatalogTemplateCardHeaderContent,
  CATALOG_ICON_TILE_BG,
  CATALOG_OS_LABEL,
  CATALOG_TEMPLATE_CARD_NETWORK_DEFAULT,
  CATALOG_TEMPLATE_DETAIL_DEFAULTS,
  CATALOG_WORKLOAD_LABEL,
  catalogIconColor,
  listOrderedCatalogTemplates,
  type TenantVmTemplate,
  type TenantWorkloadFilterTag,
} from './TenantVmTemplatesCatalog'
import {
  guestOsFamilyCards,
  guestOsFamilyCatalogAccent,
  guestOsTypeOptions,
  type GuestOsFamily,
} from './CreateVirtualMachineWizard'
import type {
  ProvisionNewVmFromModalPayload,
  TenantVirtualMachine,
  VmPowerState,
} from './TenantVirtualMachinesPage'
import {
  TEMPLATE_REVIEW_DETAILS_SWITCH_DEFAULTS,
  TEMPLATE_REVIEW_INITIAL_RUN_CAPTION,
  TEMPLATE_REVIEW_METADATA_CAPTION,
  TEMPLATE_REVIEW_NETWORK_CAPTION,
  TEMPLATE_REVIEW_SCHEDULING_CAPTION,
  TEMPLATE_REVIEW_SSH_CAPTION,
  TEMPLATE_REVIEW_STORAGE_CAPTION,
} from './templateProvisionReviewCopy'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Checkbox,
  Content,
  Divider,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Dropdown,
  DropdownItem,
  DropdownList,
  ExpandableSection,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Gallery,
  GalleryItem,
  Label,
  MenuToggle,
  Modal,
  ModalVariant,
  Radio,
  SearchInput,
  Switch,
  Tab,
  TabContentBody,
  Tabs,
  TabTitleText,
  TextArea,
  TextInput,
  Title,
  Wizard,
  WizardFooter,
  WizardHeader,
  WizardStep,
} from '@patternfly/react-core'

export type DeploymentMethod = 'new' | 'template' | 'clone'

/**
 * 1-based Wizard `startIndex` when opening from the catalog’s “Create virtual machine”.
 * Counts every `WizardStep` child in order (including hidden steps): deployment-details (1),
 * guest-os (2), boot-source (3), compute (4), template (5), source-clone (6), customization (7).
 */
const WIZARD_STEP_INDEX_TEMPLATE_FROM_CATALOG = 5
/** 1-based Wizard `startIndex` for the clone Source step when opening “Clone” from a VM action. */
const WIZARD_STEP_INDEX_CLONE_SOURCE = 6

const TEMPLATE_REVIEW_SECTIONS_INITIAL: Record<
  | 'details'
  | 'parameters'
  | 'storage'
  | 'network'
  | 'ssh'
  | 'scheduling'
  | 'initialRun'
  | 'metadata',
  boolean
> = {
  details: true,
  parameters: true,
  storage: true,
  network: true,
  ssh: true,
  scheduling: true,
  initialRun: true,
  metadata: true,
}

type CloneWizardPowerFilter = 'all' | VmPowerState
type CloneWizardOsFilter = 'all' | TenantVirtualMachine['os']

const CLONE_WIZARD_STATUS_LABEL: Record<VmPowerState, string> = {
  running: 'Running',
  stopped: 'Stopped',
  paused: 'Paused',
}

const CLONE_WIZARD_POWER_OPTIONS: { value: CloneWizardPowerFilter; label: string }[] = [
  { value: 'all', label: 'All power states' },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'paused', label: 'Paused' },
]

const CLONE_WIZARD_OS_OPTIONS: { value: CloneWizardOsFilter; label: string }[] = [
  { value: 'all', label: 'All operating systems' },
  { value: 'linux', label: 'Linux' },
  { value: 'rhel', label: 'RHEL' },
  { value: 'windows', label: 'Windows' },
]

function cloneWizardPowerFilterLabel(value: CloneWizardPowerFilter): string {
  return CLONE_WIZARD_POWER_OPTIONS.find((o) => o.value === value)?.label ?? ''
}

function cloneWizardOsFilterLabel(value: CloneWizardOsFilter): string {
  return CLONE_WIZARD_OS_OPTIONS.find((o) => o.value === value)?.label ?? ''
}

function filterCloneWizardVirtualMachines(
  vms: readonly TenantVirtualMachine[],
  search: string,
  powerFilter: CloneWizardPowerFilter,
  osFilter: CloneWizardOsFilter,
): TenantVirtualMachine[] {
  const q = search.trim().toLowerCase()
  return vms.filter((vm) => {
    if (powerFilter !== 'all' && vm.status !== powerFilter) return false
    if (osFilter !== 'all' && vm.os !== osFilter) return false
    if (!q) return true
    return vm.name.toLowerCase().includes(q)
  })
}

function cloneWizardStatusLabelColor(
  status: VmPowerState,
): ComponentProps<typeof Label>['color'] {
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

function templateReviewNetworkCaption(templateId: string): string {
  if (templateId === 'vllm-serve') {
    return 'Primary NIC is placed on the pre-provisioned frontend public subnet with the tenant HTTP/HTTPS security group — the rails platform engineering prepared for inference workloads.'
  }
  return TEMPLATE_REVIEW_NETWORK_CAPTION
}

function cloneWizardVmResourceCell(label: string, value: string) {
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
      <span style={{ fontSize: 'var(--pf-t--global--font--size--body--sm)', wordBreak: 'break-word' }}>
        {value}
      </span>
    </div>
  )
}

function cloneWizardVmSpecRow(label: string, value: string) {
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

type TemplateWizardFilterValue =
  | 'all'
  | 'os-rhel'
  | 'os-windows'
  | 'os-linux'
  | 'wl-high-performance'
  | 'wl-machine-learning'
  | 'wl-data-processing'
  | 'wl-analytics'

/** Dropdown items only — `all` is the default / reset state and is not listed in the menu. */
const TEMPLATE_WIZARD_FILTER_OPTIONS: {
  value: Exclude<TemplateWizardFilterValue, 'all'>
  label: string
}[] = [
  { value: 'os-rhel', label: 'Operating system: RHEL' },
  { value: 'os-windows', label: 'Operating system: Windows' },
  { value: 'os-linux', label: 'Operating system: Linux' },
  { value: 'wl-high-performance', label: 'Workload: High performance' },
  { value: 'wl-machine-learning', label: 'Workload: Machine learning' },
  { value: 'wl-data-processing', label: 'Workload: Data processing' },
  { value: 'wl-analytics', label: 'Workload: Analytics' },
]

function templateWizardFilterOptionLabel(value: TemplateWizardFilterValue): string {
  if (value === 'all') return ''
  return TEMPLATE_WIZARD_FILTER_OPTIONS.find((o) => o.value === value)?.label ?? ''
}

function templateWizardFilterAriaLabel(value: TemplateWizardFilterValue): string {
  if (value === 'all') return 'Filter templates, no category filter'
  const label = templateWizardFilterOptionLabel(value)
  return label ? `Filter templates, ${label} selected` : 'Filter templates'
}

const TEMPLATE_WIZARD_WL_TAG: Partial<
  Record<TemplateWizardFilterValue, TenantWorkloadFilterTag>
> = {
  'wl-high-performance': 'high-performance',
  'wl-machine-learning': 'machine-learning',
  'wl-data-processing': 'data-processing',
  'wl-analytics': 'analytics',
}

function templateMatchesWizardFilter(
  t: TenantVmTemplate,
  f: TemplateWizardFilterValue,
): boolean {
  if (f === 'all') return true
  if (f === 'os-rhel') return t.os.includes('rhel')
  if (f === 'os-windows') return t.os.includes('windows')
  if (f === 'os-linux') return t.os.includes('linux')
  const tag = TEMPLATE_WIZARD_WL_TAG[f]
  return tag ? t.workloadFilterTags.includes(tag) : true
}

function templateMatchesWizardSearch(t: TenantVmTemplate, q: string): boolean {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  const hay = [
    t.title,
    t.subtitle,
    t.bootSourcePvc,
    t.cardWorkloadDisplay ?? CATALOG_WORKLOAD_LABEL[t.workload],
    CATALOG_WORKLOAD_LABEL[t.workload],
    t.cpu,
    t.memory,
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(needle)
}

type DeploymentIconTileProps = Pick<
  SVGProps<SVGSVGElement>,
  'aria-hidden' | 'style' | 'className'
>
type DeploymentIconComponent = ComponentType<DeploymentIconTileProps>

const DEPLOYMENT_STEP_ICON: Record<
  DeploymentMethod,
  { Icon: DeploymentIconComponent; color: string }
> = {
  new: {
    Icon: PlusCircleIcon,
    color: 'var(--pf-t--global--palette--blue--400)',
  },
  template: {
    Icon: CatalogIcon,
    color: 'var(--pf-t--global--palette--purple--400)',
  },
  clone: {
    Icon: CloneIcon,
    color: 'var(--pf-t--global--palette--cyan--400)',
  },
}

const DEPLOYMENT_OPTIONS: {
  method: DeploymentMethod
  title: string
  description: string
  cardId: string
  inputId: string
  ariaLabel: string
  recommended?: boolean
}[] = [
  {
    method: 'new',
    cardId: 'create-vm-deploy-new-card',
    inputId: 'create-vm-deploy-new',
    title: 'Create new virtual machine',
    description:
      'Define a new instance from scratch, then configure OS, storage, and networking.',
    ariaLabel: 'Select create new virtual machine',
  },
  {
    method: 'template',
    cardId: 'create-vm-deploy-template-card',
    inputId: 'create-vm-deploy-template',
    title: 'Create from template',
    description:
      'Provision from a catalog template with recommended CPU, memory, and disk.',
    ariaLabel: 'Select create from template, recommended',
    recommended: true,
  },
  {
    method: 'clone',
    cardId: 'create-vm-deploy-clone-card',
    inputId: 'create-vm-deploy-clone',
    title: 'Clone existing virtual machine',
    description:
      "Duplicate an existing virtual machine's configuration as a starting point.",
    ariaLabel: 'Select clone existing virtual machine',
  },
]

export type CreateVirtualMachineLaunchHandle = {
  open: () => void
  openFromCatalogTemplate: (templateId: string, initialVmName: string) => void
  openFromCloneSource: (sourceVmId: string) => void
}

export type CreateVirtualMachineLaunchButtonProps = {
  existingVirtualMachines: TenantVirtualMachine[]
  onProvisionNewVm: (payload: ProvisionNewVmFromModalPayload) => void
  onProvisionFromTemplate: (
    templateId: string,
    vmName: string,
    vmDescription?: string,
  ) => void
  onProvisionClone: (sourceVmId: string, newName: string) => void
  /** When true, only the modal is rendered (triggers use ref / parent callbacks). */
  hideTriggerButton?: boolean
}

export const CreateVirtualMachineLaunchButton = forwardRef<
  CreateVirtualMachineLaunchHandle,
  CreateVirtualMachineLaunchButtonProps
>(function CreateVirtualMachineLaunchButton(
  {
    existingVirtualMachines,
    onProvisionNewVm,
    onProvisionFromTemplate,
    onProvisionClone,
    hideTriggerButton = false,
  },
  ref,
) {
  const [open, setOpen] = useState(false)
  const [wizardKey, setWizardKey] = useState(0)
  const [wizardStartIndex, setWizardStartIndex] = useState(1)
  const [startVmAfterCreation, setStartVmAfterCreation] = useState(true)
  const [deployment, setDeployment] = useState<DeploymentMethod>('template')
  const [guestOsFamily, setGuestOsFamily] = useState<GuestOsFamily | null>(null)
  const [guestOsType, setGuestOsType] = useState('')
  const [bootSourceChoice, setBootSourceChoice] = useState<
    'boot-volume' | 'no-boot-source' | null
  >(null)
  const [cpu, setCpu] = useState('2 vCPU')
  const [memory, setMemory] = useState('4 GiB')
  const [hostname, setHostname] = useState('')
  const [cloudInitUserData, setCloudInitUserData] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [templateVmName, setTemplateVmName] = useState('')
  const [templateCustomizationActiveTab, setTemplateCustomizationActiveTab] = useState<
    string | number
  >('details')
  const [cloneSourceVmId, setCloneSourceVmId] = useState('')
  const [cloneNewName, setCloneNewName] = useState('')
  const [templateStepSearch, setTemplateStepSearch] = useState('')
  const [templateStepFilter, setTemplateStepFilter] =
    useState<TemplateWizardFilterValue>('all')
  const [templateFilterMenuOpen, setTemplateFilterMenuOpen] = useState(false)
  const [templateReviewSectionsExpanded, setTemplateReviewSectionsExpanded] = useState({
    ...TEMPLATE_REVIEW_SECTIONS_INITIAL,
  })
  const [cloneStepSearch, setCloneStepSearch] = useState('')
  const [cloneStepPowerFilter, setCloneStepPowerFilter] = useState<CloneWizardPowerFilter>('all')
  const [cloneStepOsFilter, setCloneStepOsFilter] = useState<CloneWizardOsFilter>('all')
  const [clonePowerMenuOpen, setClonePowerMenuOpen] = useState(false)
  const [cloneOsMenuOpen, setCloneOsMenuOpen] = useState(false)
  /** True only after VM templates page → Create VM; keeps selection first until user picks another template. */
  const [pinSelectedTemplateFirst, setPinSelectedTemplateFirst] = useState(false)
  /** True only after Virtual machines → Clone; keeps source first until user picks another VM. */
  const [pinSelectedCloneFirst, setPinSelectedCloneFirst] = useState(false)

  const orderedTemplates = useMemo(() => listOrderedCatalogTemplates(), [])

  const filteredWizardTemplates = useMemo(
    () =>
      orderedTemplates.filter(
        (t) =>
          templateMatchesWizardFilter(t, templateStepFilter) &&
          templateMatchesWizardSearch(t, templateStepSearch),
      ),
    [orderedTemplates, templateStepFilter, templateStepSearch],
  )

  /** Catalog entry only; dashboard / in-wizard picks keep catalog order (see pinSelectedTemplateFirst). */
  const wizardTemplateGalleryOrder = useMemo(() => {
    const list = filteredWizardTemplates
    if (!pinSelectedTemplateFirst) return list
    const sel = selectedTemplateId
    if (!sel) return list
    const i = list.findIndex((t) => t.id === sel)
    if (i <= 0) return list
    const rest = [...list]
    const [picked] = rest.splice(i, 1)
    return [picked, ...rest]
  }, [filteredWizardTemplates, selectedTemplateId, pinSelectedTemplateFirst])

  const selectedCatalogTemplate = useMemo(
    () => orderedTemplates.find((t) => t.id === selectedTemplateId),
    [orderedTemplates, selectedTemplateId],
  )

  const cloneSourceVmForReview = useMemo(
    () => existingVirtualMachines.find((v) => v.id === cloneSourceVmId) ?? null,
    [existingVirtualMachines, cloneSourceVmId],
  )

  const filteredCloneWizardVms = useMemo(
    () =>
      filterCloneWizardVirtualMachines(
        existingVirtualMachines,
        cloneStepSearch,
        cloneStepPowerFilter,
        cloneStepOsFilter,
      ),
    [
      existingVirtualMachines,
      cloneStepSearch,
      cloneStepPowerFilter,
      cloneStepOsFilter,
    ],
  )

  /** Clone-from-VM entry only; otherwise keep VM list order (see pinSelectedCloneFirst). */
  const cloneWizardGalleryOrder = useMemo(() => {
    const list = filteredCloneWizardVms
    if (!pinSelectedCloneFirst) return list
    const sel = cloneSourceVmId
    if (!sel) return list
    const i = list.findIndex((v) => v.id === sel)
    if (i <= 0) return list
    const rest = [...list]
    const [picked] = rest.splice(i, 1)
    return [picked, ...rest]
  }, [filteredCloneWizardVms, cloneSourceVmId, pinSelectedCloneFirst])

  const selectCloneSourceVm = useCallback((vm: TenantVirtualMachine) => {
    setCloneSourceVmId((prev) => {
      if (prev !== '' && prev !== vm.id) {
        setPinSelectedCloneFirst(false)
      }
      return vm.id
    })
    setCloneNewName(`${vm.name}-clone`)
  }, [])

  useEffect(() => {
    if (!cloneSourceVmId) return
    if (!filteredCloneWizardVms.some((v) => v.id === cloneSourceVmId)) {
      setCloneSourceVmId('')
    }
  }, [filteredCloneWizardVms, cloneSourceVmId])

  useEffect(() => {
    if (!selectedTemplateId) return
    if (!filteredWizardTemplates.some((t) => t.id === selectedTemplateId)) {
      setSelectedTemplateId('')
      setTemplateVmName('')
      setTemplateCustomizationActiveTab('details')
      setTemplateReviewSectionsExpanded({ ...TEMPLATE_REVIEW_SECTIONS_INITIAL })
    }
  }, [filteredWizardTemplates, selectedTemplateId])

  const selectWizardTemplate = useCallback((t: TenantVmTemplate) => {
    setSelectedTemplateId((prev) => {
      if (prev !== '' && prev !== t.id) {
        setPinSelectedTemplateFirst(false)
      }
      return t.id
    })
    setTemplateVmName((n) => n.trim() || t.title.toLowerCase().replace(/\s+/g, '-'))
  }, [])

  const resetBranchFields = useCallback(() => {
    setGuestOsFamily(null)
    setGuestOsType('')
    setBootSourceChoice(null)
    setCpu('2 vCPU')
    setMemory('4 GiB')
    setHostname('')
    setCloudInitUserData('')
    setSelectedTemplateId('')
    setTemplateVmName('')
    setTemplateCustomizationActiveTab('details')
    setTemplateReviewSectionsExpanded({ ...TEMPLATE_REVIEW_SECTIONS_INITIAL })
    setCloneSourceVmId('')
    setCloneNewName('')
    setTemplateStepSearch('')
    setTemplateStepFilter('all')
    setTemplateFilterMenuOpen(false)
    setStartVmAfterCreation(true)
    setCloneStepSearch('')
    setCloneStepPowerFilter('all')
    setCloneStepOsFilter('all')
    setClonePowerMenuOpen(false)
    setCloneOsMenuOpen(false)
    setPinSelectedTemplateFirst(false)
    setPinSelectedCloneFirst(false)
  }, [])

  const setDeploymentMethod = useCallback(
    (method: DeploymentMethod) => {
      setDeployment(method)
      resetBranchFields()
    },
    [resetBranchFields],
  )

  const reset = useCallback(() => {
    setDeployment('template')
    resetBranchFields()
  }, [resetBranchFields])

  const handleClose = useCallback(() => {
    setOpen(false)
    reset()
    setWizardStartIndex(1)
  }, [reset])

  const handleOpen = useCallback(() => {
    setWizardKey((k) => k + 1)
    setWizardStartIndex(1)
    reset()
    setOpen(true)
  }, [reset])

  const openFromCatalogTemplate = useCallback(
    (templateId: string, initialVmName: string) => {
      setWizardKey((k) => k + 1)
      setWizardStartIndex(WIZARD_STEP_INDEX_TEMPLATE_FROM_CATALOG)
      reset()
      const name = initialVmName.trim() || templateId
      setPinSelectedTemplateFirst(true)
      setSelectedTemplateId(templateId)
      setTemplateVmName(name)
      setOpen(true)
    },
    [reset],
  )

  const openFromCloneSource = useCallback(
    (sourceVmId: string) => {
      setWizardKey((k) => k + 1)
      setWizardStartIndex(WIZARD_STEP_INDEX_CLONE_SOURCE)
      reset()
      setDeployment('clone')
      setPinSelectedCloneFirst(true)
      const src = existingVirtualMachines.find((v) => v.id === sourceVmId)
      setCloneSourceVmId(sourceVmId)
      setCloneNewName(src ? `${src.name}-clone` : `${sourceVmId}-clone`)
      setOpen(true)
    },
    [reset, existingVirtualMachines],
  )

  useImperativeHandle(
    ref,
    () => ({
      open: handleOpen,
      openFromCatalogTemplate,
      openFromCloneSource,
    }),
    [handleOpen, openFromCatalogTemplate, openFromCloneSource],
  )

  const handleProvision = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      if (deployment === 'new') {
        if (!guestOsFamily || !guestOsType || !bootSourceChoice) return
        const payload: ProvisionNewVmFromModalPayload = {
          guestOsFamily,
          guestOsType,
          bootSourceChoice,
          cpu: cpu.trim() || '2 vCPU',
          memory: memory.trim() || '4 GiB',
          hostname: hostname.trim(),
          cloudInitUserData,
        }
        onProvisionNewVm(payload)
      } else if (deployment === 'template') {
        if (!selectedTemplateId || !templateVmName.trim()) return
        onProvisionFromTemplate(selectedTemplateId, templateVmName.trim())
      } else {
        if (!cloneSourceVmId || !cloneNewName.trim()) return
        onProvisionClone(cloneSourceVmId, cloneNewName.trim())
      }
      handleClose()
    },
    [
      deployment,
      guestOsFamily,
      guestOsType,
      bootSourceChoice,
      cpu,
      memory,
      hostname,
      cloudInitUserData,
      selectedTemplateId,
      templateVmName,
      cloneSourceVmId,
      cloneNewName,
      onProvisionNewVm,
      onProvisionFromTemplate,
      onProvisionClone,
      handleClose,
    ],
  )

  const titleId = 'create-vm-launch-wizard-title'

  return (
    <>
      {hideTriggerButton ? null : (
        <Button variant="primary" onClick={handleOpen} aria-label="Create virtual machine">
          Create virtual machine
        </Button>
      )}
      <Modal
        className="osac-create-vm-launch-modal"
        variant={ModalVariant.large}
        isOpen={open}
        onClose={handleClose}
        aria-labelledby={titleId}
        ouiaId="create-vm-launch-modal"
      >
        <Wizard
          key={wizardKey}
          startIndex={wizardStartIndex}
          className="osac-create-vm-modal-wizard"
          height="min(46rem, calc(100dvh - 6rem))"
          width="100%"
          onClose={handleClose}
          onSave={handleProvision}
          header={
            <WizardHeader
              title="Create virtual machine"
              titleId={titleId}
              onClose={handleClose}
              closeButtonAriaLabel="Close"
            />
          }
          footer={(activeStep, onNext, onBack, onCloseFooter) => {
            const id = activeStep?.id
            const nextDisabled =
              (id === 'guest-os' && (!guestOsFamily || !guestOsType)) ||
              (id === 'boot-source' && bootSourceChoice === null) ||
              (id === 'compute' && (!cpu.trim() || !memory.trim())) ||
              (id === 'template' && !selectedTemplateId) ||
              (id === 'source-clone' &&
                (!cloneSourceVmId ||
                  !cloneNewName.trim() ||
                  existingVirtualMachines.length === 0)) ||
              (id === 'customization' &&
                deployment === 'template' &&
                !templateVmName.trim())

            return (
              <WizardFooter
                activeStep={activeStep}
                onNext={onNext}
                onBack={onBack}
                onClose={onCloseFooter}
                nextButtonText={
                  id === 'review-create' ? 'Create virtual machine' : 'Next'
                }
                isBackDisabled={id === 'deployment-details'}
                isNextDisabled={nextDisabled}
              />
            )
          }}
        >
          <WizardStep id="deployment-details" name="Select a creation method">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--pf-t--global--spacer--lg)',
              }}
            >
              <div>
                <Title headingLevel="h3">Select a creation method</Title>
                <Content
                  component="p"
                  style={{
                    marginTop: 'var(--pf-t--global--spacer--xs)',
                    marginBottom: 0,
                    color: 'var(--pf-t--global--text--color--subtle)',
                  }}
                >
                  Choose your preferred path to begin. We recommend creating from a template.
                </Content>
              </div>
              <div
                className="osac-create-vm-launch-modal__option-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  columnGap: 'var(--pf-t--global--spacer--md)',
                  rowGap: 'var(--pf-t--global--spacer--md)',
                  width: '100%',
                }}
              >
                {DEPLOYMENT_OPTIONS.map(
                  ({
                    method,
                    cardId,
                    inputId,
                    title,
                    description,
                    ariaLabel,
                    recommended,
                  }) => {
                    const { Icon: DeployIcon, color: deployIconColor } =
                      DEPLOYMENT_STEP_ICON[method]
                    const iconPx = 26
                    return (
                      <div key={method} style={{ minWidth: 0 }}>
                        <Card
                          id={cardId}
                          isFullHeight
                          isSelectable
                          isSelected={deployment === method}
                        >
                          <CardHeader
                            selectableActions={{
                              variant: 'single',
                              name: 'deployment-method',
                              selectableActionId: inputId,
                              selectableActionAriaLabel: ariaLabel,
                              onChange: (_, checked) => {
                                if (checked) setDeploymentMethod(method)
                              },
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 'var(--pf-t--global--spacer--md)',
                                width: '100%',
                                minWidth: 0,
                              }}
                            >
                              <div
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius:
                                    'var(--pf-t--global--border--radius--medium)',
                                  backgroundColor: CATALOG_ICON_TILE_BG,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <DeployIcon
                                  aria-hidden
                                  style={{
                                    width: iconPx,
                                    height: iconPx,
                                    flexShrink: 0,
                                    color: deployIconColor,
                                  }}
                                />
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  alignItems: 'center',
                                  gap: 'var(--pf-t--global--spacer--sm)',
                                  width: '100%',
                                  minWidth: 0,
                                }}
                              >
                                <CardTitle
                                  style={{
                                    fontSize:
                                      'var(--pf-t--global--font--size--body--lg)',
                                    margin: 0,
                                    flex: '1 1 auto',
                                    minWidth: 0,
                                  }}
                                >
                                  {title}
                                </CardTitle>
                                {recommended ? (
                                  <Label color="blue" isCompact>
                                    Recommended
                                  </Label>
                                ) : null}
                              </div>
                              <Content
                                component="p"
                                style={{
                                  margin: 0,
                                  color:
                                    'var(--pf-t--global--text--color--subtle)',
                                  fontSize:
                                    'var(--pf-t--global--font--size--body--sm)',
                                }}
                              >
                                {description}
                              </Content>
                            </div>
                          </CardHeader>
                        </Card>
                      </div>
                    )
                  },
                )}
              </div>
            </div>
          </WizardStep>

          <WizardStep
            id="guest-os"
            name="Guest operating system"
            isHidden={deployment !== 'new'}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--pf-t--global--spacer--lg)',
              }}
            >
              <div>
                <Title headingLevel="h3">Guest operating system</Title>
                <Content
                  component="p"
                  style={{
                    marginTop: 'var(--pf-t--global--spacer--xs)',
                    color: 'var(--pf-t--global--text--color--subtle)',
                  }}
                >
                  Select the guest OS family and a specific version for this new virtual
                  machine.
                </Content>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  columnGap: 'var(--pf-t--global--spacer--md)',
                  rowGap: 'var(--pf-t--global--spacer--md)',
                  width: '100%',
                }}
              >
                {guestOsFamilyCards.map(
                  ({
                    family,
                    cardId,
                    inputId,
                    title,
                    description,
                    ariaLabel,
                  }) => {
                    const accent = guestOsFamilyCatalogAccent(family)
                    const iconColor = catalogIconColor(accent)
                    const isLinuxTux = accent === 'linux'
                    const iconPx = isLinuxTux ? 28 : 24
                    return (
                      <div key={family} style={{ minWidth: 0 }}>
                        <Card
                          id={`${cardId}-modal`}
                          isFullHeight
                          isSelectable
                          isSelected={guestOsFamily === family}
                        >
                          <CardHeader
                            selectableActions={{
                              variant: 'single',
                              name: 'guest-os-family-modal',
                              selectableActionId: `${inputId}-modal`,
                              selectableActionAriaLabel: ariaLabel,
                              onChange: (_, checked) => {
                                if (checked) {
                                  setGuestOsFamily(family)
                                  setGuestOsType('')
                                }
                              },
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 'var(--pf-t--global--spacer--md)',
                                width: '100%',
                                minWidth: 0,
                              }}
                            >
                              <div
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius:
                                    'var(--pf-t--global--border--radius--medium)',
                                  backgroundColor: CATALOG_ICON_TILE_BG,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {family === 'rhel' && (
                                  <RedhatIcon
                                    aria-hidden
                                    style={{
                                      width: iconPx,
                                      height: iconPx,
                                      flexShrink: 0,
                                      ...(iconColor ? { color: iconColor } : {}),
                                    }}
                                  />
                                )}
                                {family === 'windows' && (
                                  <WindowsIcon
                                    aria-hidden
                                    style={{
                                      width: iconPx,
                                      height: iconPx,
                                      flexShrink: 0,
                                      ...(iconColor ? { color: iconColor } : {}),
                                    }}
                                  />
                                )}
                                {family === 'other-linux' && (
                                  <LinuxTuxIcon
                                    aria-hidden
                                    style={{
                                      width: iconPx,
                                      height: iconPx,
                                      flexShrink: 0,
                                    }}
                                  />
                                )}
                              </div>
                              <CardTitle
                                style={{
                                  fontSize:
                                    'var(--pf-t--global--font--size--body--lg)',
                                  margin: 0,
                                }}
                              >
                                {title}
                              </CardTitle>
                              <Content
                                component="p"
                                style={{
                                  margin: 0,
                                  color:
                                    'var(--pf-t--global--text--color--subtle)',
                                  fontSize:
                                    'var(--pf-t--global--font--size--body--sm)',
                                }}
                              >
                                {description}
                              </Content>
                            </div>
                          </CardHeader>
                        </Card>
                      </div>
                    )
                  },
                )}
              </div>
              <Form>
                <FormGroup
                  label="Guest operating system type"
                  fieldId="create-vm-modal-guest-os-type"
                >
                  <FormSelect
                    id="create-vm-modal-guest-os-type"
                    value={guestOsType}
                    isDisabled={guestOsFamily === null}
                    onChange={(_, value) => setGuestOsType(value)}
                    aria-label="Guest operating system type"
                  >
                    <FormSelectOption
                      value=""
                      label={
                        guestOsFamily === null
                          ? 'Select a guest operating system first'
                          : 'Select a type'
                      }
                      isPlaceholder
                    />
                    {guestOsFamily !== null &&
                      guestOsTypeOptions[guestOsFamily].map((opt) => (
                        <FormSelectOption
                          key={opt.value}
                          value={opt.value}
                          label={opt.label}
                        />
                      ))}
                  </FormSelect>
                </FormGroup>
              </Form>
            </div>
          </WizardStep>

          <WizardStep
            id="boot-source"
            name="Boot source"
            isHidden={deployment !== 'new'}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--pf-t--global--spacer--lg)',
              }}
            >
              <div>
                <Title headingLevel="h3" id="create-vm-modal-boot-source-title">
                  Boot source
                </Title>
                <Content
                  component="p"
                  style={{
                    marginTop: 'var(--pf-t--global--spacer--xs)',
                    color: 'var(--pf-t--global--text--color--subtle)',
                  }}
                >
                  Choose how the virtual machine will start. You can attach storage later
                  if needed.
                </Content>
              </div>
              <Form>
                <div
                  role="radiogroup"
                  aria-labelledby="create-vm-modal-boot-source-title"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--pf-t--global--spacer--md)',
                  }}
                >
                  <Radio
                    id="create-vm-modal-boot-volume"
                    name="create-vm-modal-boot-source"
                    isLabelWrapped
                    label="Boot volume"
                    description={
                      <Content component="p">
                        Start the VM with an existing disk image or volume from your
                        workspace.
                      </Content>
                    }
                    isChecked={bootSourceChoice === 'boot-volume'}
                    onChange={(_, checked) =>
                      checked && setBootSourceChoice('boot-volume')
                    }
                  />
                  <Radio
                    id="create-vm-modal-boot-none"
                    name="create-vm-modal-boot-source"
                    isLabelWrapped
                    label="No boot source"
                    description={
                      <Content component="p">
                        Create an empty virtual machine and attach an ISO or volume
                        later.
                      </Content>
                    }
                    isChecked={bootSourceChoice === 'no-boot-source'}
                    onChange={(_, checked) =>
                      checked && setBootSourceChoice('no-boot-source')
                    }
                  />
                </div>
              </Form>
            </div>
          </WizardStep>

          <WizardStep
            id="compute"
            name="Compute resources"
            isHidden={deployment !== 'new'}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--pf-t--global--spacer--md)',
              }}
            >
              <Title headingLevel="h3">Compute resources</Title>
              <Content
                component="p"
                style={{ margin: 0, color: 'var(--pf-t--global--text--color--subtle)' }}
              >
                Set vCPU and memory for this instance. Adjust to match your workload.
              </Content>
              <Form>
                <FormGroup label="vCPU" fieldId="create-vm-modal-cpu">
                  <TextInput
                    id="create-vm-modal-cpu"
                    value={cpu}
                    onChange={(_e, v) => setCpu(v)}
                    aria-label="vCPU"
                  />
                </FormGroup>
                <FormGroup label="Memory" fieldId="create-vm-modal-memory">
                  <TextInput
                    id="create-vm-modal-memory"
                    value={memory}
                    onChange={(_e, v) => setMemory(v)}
                    aria-label="Memory"
                  />
                </FormGroup>
              </Form>
            </div>
          </WizardStep>

          <WizardStep id="template" name="Templates" isHidden={deployment !== 'template'}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--pf-t--global--spacer--md)',
                minHeight: 0,
              }}
            >
              <div>
                <Title headingLevel="h3">Templates</Title>
                <Content
                  component="p"
                  style={{
                    marginTop: 'var(--pf-t--global--spacer--xs)',
                    marginBottom: 0,
                    color: 'var(--pf-t--global--text--color--subtle)',
                  }}
                >
                  Select a template to create your virtual machine from
                </Content>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 'var(--pf-t--global--spacer--md)',
                }}
              >
                <Dropdown
                  className="osac-create-vm-wizard-template-filter-menu"
                  isOpen={templateFilterMenuOpen}
                  onOpenChange={setTemplateFilterMenuOpen}
                  onSelect={() => setTemplateFilterMenuOpen(false)}
                  popperProps={{ placement: 'bottom-start' }}
                  toggle={(toggleRef) => {
                    const filterDetail = templateWizardFilterOptionLabel(templateStepFilter)
                    return (
                    <MenuToggle
                      ref={toggleRef}
                      id="create-vm-wizard-template-filter"
                      className="osac-create-vm-wizard-template-filter-toggle"
                      icon={<FilterIcon />}
                      isExpanded={templateFilterMenuOpen}
                      onClick={() => setTemplateFilterMenuOpen((o) => !o)}
                      aria-label={templateWizardFilterAriaLabel(templateStepFilter)}
                      style={{ minWidth: '12rem' }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          flexWrap: 'wrap',
                          alignItems: 'baseline',
                          gap: 'var(--pf-t--global--spacer--xs)',
                          minWidth: 0,
                        }}
                      >
                        <span>Filter</span>
                        {filterDetail ? (
                          <>
                            <span
                              style={{
                                color: 'var(--pf-t--global--text--color--subtle)',
                                flexShrink: 0,
                              }}
                              aria-hidden
                            >
                              ·
                            </span>
                            <span style={{ minWidth: 0, textAlign: 'start' }}>
                              {filterDetail}
                            </span>
                          </>
                        ) : null}
                      </span>
                    </MenuToggle>
                    )
                  }}
                >
                  <DropdownList>
                    {TEMPLATE_WIZARD_FILTER_OPTIONS.map((opt) => (
                      <DropdownItem
                        key={opt.value}
                        isSelected={templateStepFilter === opt.value}
                        onClick={() => {
                          setTemplateStepFilter(opt.value)
                          setTemplateFilterMenuOpen(false)
                        }}
                      >
                        {opt.label}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
                <div style={{ flex: '2 1 16rem', minWidth: '14rem' }}>
                  <SearchInput
                    placeholder="Search templates..."
                    value={templateStepSearch}
                    onChange={(_e, v) => setTemplateStepSearch(v)}
                    onClear={() => setTemplateStepSearch('')}
                    aria-label="Search templates by keyword"
                  />
                </div>
              </div>
              <Content
                component="p"
                style={{
                  margin: 0,
                  color: 'var(--pf-t--global--text--color--subtle)',
                  fontSize: 'var(--pf-t--global--font--size--body--sm)',
                }}
              >
                {filteredWizardTemplates.length} template
                {filteredWizardTemplates.length === 1 ? '' : 's'} · Select one to
                continue
              </Content>
              <div
                style={{
                  maxHeight: 'min(22rem, 50dvh)',
                  overflowY: 'auto',
                  paddingInlineEnd: 'var(--pf-t--global--spacer--xs)',
                }}
              >
                <Gallery
                  hasGutter
                  minWidths={{ default: '260px', md: '280px', lg: '300px' }}
                >
                  {wizardTemplateGalleryOrder.map((item) => (
                    <GalleryItem key={item.id}>
                      <Card
                        id={`create-vm-wizard-tpl-${item.id}`}
                        isFullHeight
                        component="article"
                        isSelectable
                        isSelected={selectedTemplateId === item.id}
                      >
                        <CardHeader
                          selectableActions={{
                            variant: 'single',
                            name: 'create-vm-wizard-template',
                            selectableActionId: `wizard-tpl-${item.id}`,
                            selectableActionAriaLabelledby: `catalog-template-card-title-${item.id}`,
                            onChange: (_, checked) => {
                              if (checked) selectWizardTemplate(item)
                            },
                          }}
                        >
                          <CatalogTemplateCardHeaderContent template={item} />
                        </CardHeader>
                        <CardBody
                          style={{
                            paddingTop: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--pf-t--global--spacer--md)',
                          }}
                        >
                          <CatalogTemplateCardBodyContent template={item} />
                        </CardBody>
                      </Card>
                    </GalleryItem>
                  ))}
                </Gallery>
                {filteredWizardTemplates.length === 0 && (
                  <Content
                    component="p"
                    style={{
                      textAlign: 'center',
                      padding: 'var(--pf-t--global--spacer--2xl)',
                    }}
                  >
                    No VM templates match your filters. Try another filter or search
                    keyword.
                  </Content>
                )}
              </div>
            </div>
          </WizardStep>

          <WizardStep id="source-clone" name="Source" isHidden={deployment !== 'clone'}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--pf-t--global--spacer--md)',
                minHeight: 0,
              }}
            >
              <div>
                <Title headingLevel="h3">Source</Title>
                <Content
                  component="p"
                  style={{
                    marginTop: 'var(--pf-t--global--spacer--xs)',
                    marginBottom: 0,
                    color: 'var(--pf-t--global--text--color--subtle)',
                  }}
                >
                  Choose a name for the clone, then select a virtual machine to copy from.
                </Content>
              </div>
              <Form>
                <FormGroup label="Virtual machine name" fieldId="create-vm-clone-name">
                  <TextInput
                    id="create-vm-clone-name"
                    value={cloneNewName}
                    onChange={(_e, v) => setCloneNewName(v)}
                    aria-label="Virtual machine name for clone"
                  />
                </FormGroup>
              </Form>
              {existingVirtualMachines.length === 0 ? (
                <Content component="p">No virtual machines are available to clone.</Content>
              ) : (
                <>
                  <div
                    className="tenant-vm-page-filters tenant-vm-page-filters__toolbar"
                    role="search"
                    aria-label="Virtual machine filters"
                  >
                    <div className="tenant-vm-page-filters__search-wrap">
                      <SearchInput
                        className="tenant-vm-page-filters__search"
                        placeholder="Filter by VM name"
                        value={cloneStepSearch}
                        onChange={(_e, v) => setCloneStepSearch(v)}
                        onClear={() => setCloneStepSearch('')}
                        aria-label="Filter by VM name"
                      />
                    </div>
                    <Dropdown
                      isOpen={clonePowerMenuOpen}
                      onOpenChange={setClonePowerMenuOpen}
                      onSelect={() => setClonePowerMenuOpen(false)}
                      popperProps={{ placement: 'bottom-start' }}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          className="tenant-vm-filter-dropdown"
                          icon={<FilterIcon />}
                          isExpanded={clonePowerMenuOpen}
                          onClick={() => setClonePowerMenuOpen((o) => !o)}
                          aria-label={`Power state filter, ${cloneWizardPowerFilterLabel(cloneStepPowerFilter)} selected`}
                        >
                          {cloneWizardPowerFilterLabel(cloneStepPowerFilter)}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        {CLONE_WIZARD_POWER_OPTIONS.map((opt) => (
                          <DropdownItem
                            key={opt.value}
                            isSelected={cloneStepPowerFilter === opt.value}
                            onClick={() => {
                              setCloneStepPowerFilter(opt.value)
                              setClonePowerMenuOpen(false)
                            }}
                          >
                            {opt.label}
                          </DropdownItem>
                        ))}
                      </DropdownList>
                    </Dropdown>
                    <Dropdown
                      isOpen={cloneOsMenuOpen}
                      onOpenChange={setCloneOsMenuOpen}
                      onSelect={() => setCloneOsMenuOpen(false)}
                      popperProps={{ placement: 'bottom-start' }}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          className="tenant-vm-filter-dropdown"
                          icon={<FilterIcon />}
                          isExpanded={cloneOsMenuOpen}
                          onClick={() => setCloneOsMenuOpen((o) => !o)}
                          aria-label={`Operating system filter, ${cloneWizardOsFilterLabel(cloneStepOsFilter)} selected`}
                        >
                          {cloneWizardOsFilterLabel(cloneStepOsFilter)}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        {CLONE_WIZARD_OS_OPTIONS.map((opt) => (
                          <DropdownItem
                            key={opt.value}
                            isSelected={cloneStepOsFilter === opt.value}
                            onClick={() => {
                              setCloneStepOsFilter(opt.value)
                              setCloneOsMenuOpen(false)
                            }}
                          >
                            {opt.label}
                          </DropdownItem>
                        ))}
                      </DropdownList>
                    </Dropdown>
                  </div>
                  <Content
                    component="p"
                    style={{
                      margin: 0,
                      color: 'var(--pf-t--global--text--color--subtle)',
                      fontSize: 'var(--pf-t--global--font--size--body--sm)',
                    }}
                  >
                    {filteredCloneWizardVms.length} virtual machine
                    {filteredCloneWizardVms.length === 1 ? '' : 's'}
                    {' · '}
                    Select one to continue
                  </Content>
                  <div
                    style={{
                      maxHeight: 'min(22rem, 50dvh)',
                      overflowY: 'auto',
                      paddingInlineEnd: 'var(--pf-t--global--spacer--xs)',
                    }}
                  >
                    <Gallery
                      hasGutter
                      minWidths={{ default: '260px', md: '280px', lg: '300px' }}
                    >
                      {cloneWizardGalleryOrder.map((vm) => {
                        const VmIcon = vm.Icon
                        const iconColor = catalogIconColor(vm.iconAccent)
                        const isLinuxTux = vm.iconAccent === 'linux'
                        const iconPx = isLinuxTux ? 28 : 24
                        return (
                          <GalleryItem key={vm.id}>
                            <Card
                              id={`create-vm-clone-vm-${vm.id}`}
                              isFullHeight
                              component="article"
                              isSelectable
                              isSelected={cloneSourceVmId === vm.id}
                            >
                              <CardHeader
                                selectableActions={{
                                  variant: 'single',
                                  name: 'create-vm-wizard-clone-source',
                                  selectableActionId: `wizard-clone-vm-${vm.id}`,
                                  selectableActionAriaLabelledby: `create-vm-clone-card-title-${vm.id}`,
                                  onChange: (_, checked) => {
                                    if (checked) selectCloneSourceVm(vm)
                                  },
                                }}
                              >
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
                                        borderRadius:
                                          'var(--pf-t--global--border--radius--medium)',
                                        backgroundColor: CATALOG_ICON_TILE_BG,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <VmIcon
                                        aria-hidden
                                        style={{
                                          width: iconPx,
                                          height: iconPx,
                                          flexShrink: 0,
                                          ...(iconColor ? { color: iconColor } : {}),
                                        }}
                                      />
                                    </div>
                                    <Label color={cloneWizardStatusLabelColor(vm.status)}>
                                      {CLONE_WIZARD_STATUS_LABEL[vm.status]}
                                    </Label>
                                  </div>
                                  <div style={{ minWidth: 0, width: '100%', textAlign: 'start' }}>
                                    <span
                                      id={`create-vm-clone-card-title-${vm.id}`}
                                      style={{
                                        display: 'block',
                                        fontSize: 'var(--pf-t--global--font--size--body--lg)',
                                        fontWeight:
                                          'var(--pf-t--global--font--weight--heading--default)',
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
                                  {cloneWizardVmResourceCell('CPU', vm.cpu)}
                                  {cloneWizardVmResourceCell('Memory', vm.memory)}
                                  {cloneWizardVmResourceCell('Storage', vm.storage)}
                                </div>
                                <Divider
                                  component="div"
                                  role="separator"
                                  style={{ marginBlock: 0 }}
                                />
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--pf-t--global--spacer--sm)',
                                  }}
                                >
                                  {cloneWizardVmSpecRow('Created', vm.created)}
                                  {cloneWizardVmSpecRow('Owner', vm.owner)}
                                </div>
                              </CardBody>
                            </Card>
                          </GalleryItem>
                        )
                      })}
                    </Gallery>
                    {filteredCloneWizardVms.length === 0 && (
                      <Content
                        component="p"
                        style={{
                          textAlign: 'center',
                          padding: 'var(--pf-t--global--spacer--2xl)',
                        }}
                      >
                        No virtual machines match your filters. Try another filter or search
                        keyword.
                      </Content>
                    )}
                  </div>
                </>
              )}
            </div>
          </WizardStep>

          <WizardStep
            id="customization"
            name="Customization"
            isHidden={deployment !== 'new' && deployment !== 'template'}
          >
            {deployment === 'new' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--pf-t--global--spacer--md)',
                }}
              >
                <div>
                  <Title headingLevel="h3">Customization</Title>
                  <Content
                    component="p"
                    style={{
                      marginTop: 'var(--pf-t--global--spacer--xs)',
                      marginBottom: 0,
                      color: 'var(--pf-t--global--text--color--subtle)',
                    }}
                  >
                    Optional hostname and cloud-init user data. Leave blank to use defaults
                    on create.
                  </Content>
                </div>
                <Form>
                  <FormGroup label="Hostname" fieldId="create-vm-modal-hostname">
                    <TextInput
                      id="create-vm-modal-hostname"
                      value={hostname}
                      onChange={(_e, v) => setHostname(v)}
                      aria-label="Hostname"
                    />
                  </FormGroup>
                  <FormGroup
                    label="Cloud-init user data"
                    fieldId="create-vm-modal-cloud-init"
                  >
                    <TextArea
                      id="create-vm-modal-cloud-init"
                      value={cloudInitUserData}
                      onChange={(_e, v) => setCloudInitUserData(v)}
                      aria-label="Cloud-init user data"
                      rows={4}
                    />
                  </FormGroup>
                </Form>
              </div>
            )}
            {deployment === 'template' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--pf-t--global--spacer--md)',
                }}
              >
                <div>
                  <Title headingLevel="h3">Customization</Title>
                  <Content
                    component="p"
                    style={{
                      marginTop: 'var(--pf-t--global--spacer--xs)',
                      marginBottom: 0,
                      color: 'var(--pf-t--global--text--color--subtle)',
                    }}
                  >
                    Review template details and optional parameters before you finish.
                  </Content>
                </div>
                <Form
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--pf-t--global--spacer--md)',
                  }}
                >
                  <FormGroup label="Virtual machine name" fieldId="create-vm-template-vm-name">
                    <TextInput
                      id="create-vm-template-vm-name"
                      value={templateVmName}
                      onChange={(_e, v) => setTemplateVmName(v)}
                      aria-label="Virtual machine name"
                    />
                  </FormGroup>
                  <Tabs
                    id="create-vm-template-customization-tabs"
                    activeKey={templateCustomizationActiveTab}
                    onSelect={(_e, key) => setTemplateCustomizationActiveTab(key)}
                    aria-label="Template details and parameters"
                    mountOnEnter
                    className="tenant-vm-template-drawer-tabs"
                  >
                    <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>}>
                      <TabContentBody>
                        {selectedCatalogTemplate ? (
                          <>
                            <Content
                              component="p"
                              style={{
                                margin: '0 0 var(--pf-t--global--spacer--md)',
                                color: 'var(--pf-t--global--text--color--subtle)',
                                fontSize: 'var(--pf-t--global--font--size--body--default)',
                              }}
                            >
                              {selectedCatalogTemplate.subtitle}
                            </Content>
                            <div className="tenant-vm-template-detail-stack">
                              <DescriptionList isCompact aria-label="Template details">
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Guest operating system</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {selectedCatalogTemplate.os
                                      .map((o) => CATALOG_OS_LABEL[o])
                                      .join(', ')}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>CPU</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {selectedCatalogTemplate.cpu}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Memory</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {selectedCatalogTemplate.memory}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Storage</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {selectedCatalogTemplate.diskSize ??
                                      CATALOG_TEMPLATE_DETAIL_DEFAULTS.diskSize}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Network</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {selectedCatalogTemplate.cardNetworkDisplay ??
                                      CATALOG_TEMPLATE_CARD_NETWORK_DEFAULT}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Workload</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {selectedCatalogTemplate.cardWorkloadDisplay ??
                                      CATALOG_WORKLOAD_LABEL[selectedCatalogTemplate.workload]}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              </DescriptionList>
                            </div>
                          </>
                        ) : (
                          <Content
                            component="p"
                            style={{
                              margin: 0,
                              color: 'var(--pf-t--global--text--color--subtle)',
                            }}
                          >
                            Select a template in the previous step.
                          </Content>
                        )}
                      </TabContentBody>
                    </Tab>
                    <Tab eventKey="parameters" title={<TabTitleText>Parameters</TabTitleText>}>
                      <TabContentBody>{null}</TabContentBody>
                    </Tab>
                  </Tabs>
                </Form>
              </div>
            )}
          </WizardStep>

          <WizardStep id="review-create" name="Review and create">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--pf-t--global--spacer--md)',
              }}
            >
              <Title headingLevel="h3">Review and create</Title>
              <Content
                component="p"
                style={{ margin: 0, color: 'var(--pf-t--global--text--color--subtle)' }}
              >
                Confirm the choices below, then create the virtual machine.
              </Content>
              <Checkbox
                id="create-vm-start-after-creation"
                label="Start this virtual machine after creation"
                isChecked={startVmAfterCreation}
                checked={startVmAfterCreation}
                onChange={(_event, checked) => setStartVmAfterCreation(checked)}
              />
              {deployment === 'new' && guestOsFamily && (
                <DescriptionList isCompact>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Deployment</DescriptionListTerm>
                    <DescriptionListDescription>
                      Create new virtual machine
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Guest OS</DescriptionListTerm>
                    <DescriptionListDescription>
                      {guestOsTypeOptions[guestOsFamily].find((o) => o.value === guestOsType)
                        ?.label ?? guestOsType}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Boot source</DescriptionListTerm>
                    <DescriptionListDescription>
                      {bootSourceChoice === 'boot-volume'
                        ? 'Boot volume'
                        : bootSourceChoice === 'no-boot-source'
                          ? 'No boot source'
                          : '—'}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Compute</DescriptionListTerm>
                    <DescriptionListDescription>
                      {cpu.trim() || '2 vCPU'} · {memory.trim() || '4 GiB'}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Hostname</DescriptionListTerm>
                    <DescriptionListDescription>
                      {hostname.trim() || '(default)'}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              )}
              {deployment === 'template' && selectedTemplateId && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--pf-t--global--spacer--sm)',
                  }}
                >
                  <ExpandableSection
                    toggleText="Details"
                    isExpanded={templateReviewSectionsExpanded.details}
                    isIndented
                    onToggle={(_e, expanded) =>
                      setTemplateReviewSectionsExpanded((s) => ({ ...s, details: expanded }))
                    }
                  >
                    {selectedCatalogTemplate ? (
                      <>
                        <Content
                          component="p"
                          style={{
                            margin: '0 0 var(--pf-t--global--spacer--md)',
                            color: 'var(--pf-t--global--text--color--subtle)',
                            fontSize: 'var(--pf-t--global--font--size--body--default)',
                          }}
                        >
                          {selectedCatalogTemplate.subtitle}
                        </Content>
                        <div className="tenant-vm-template-detail-stack">
                          <DescriptionList isCompact aria-label="Template details">
                            <DescriptionListGroup>
                              <DescriptionListTerm>Guest operating system</DescriptionListTerm>
                              <DescriptionListDescription>
                                {selectedCatalogTemplate.os
                                  .map((o) => CATALOG_OS_LABEL[o])
                                  .join(', ')}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>CPU</DescriptionListTerm>
                              <DescriptionListDescription>
                                {selectedCatalogTemplate.cpu}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Memory</DescriptionListTerm>
                              <DescriptionListDescription>
                                {selectedCatalogTemplate.memory}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Storage</DescriptionListTerm>
                              <DescriptionListDescription>
                                {selectedCatalogTemplate.diskSize ??
                                  CATALOG_TEMPLATE_DETAIL_DEFAULTS.diskSize}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Network</DescriptionListTerm>
                              <DescriptionListDescription>
                                {selectedCatalogTemplate.cardNetworkDisplay ??
                                  CATALOG_TEMPLATE_CARD_NETWORK_DEFAULT}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Workload</DescriptionListTerm>
                              <DescriptionListDescription>
                                {selectedCatalogTemplate.cardWorkloadDisplay ??
                                  CATALOG_WORKLOAD_LABEL[selectedCatalogTemplate.workload]}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          </DescriptionList>
                        </div>
                      </>
                    ) : (
                      <DescriptionList isCompact>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Template</DescriptionListTerm>
                          <DescriptionListDescription>{selectedTemplateId}</DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    )}
                  </ExpandableSection>
                  <ExpandableSection
                    toggleText="Parameters"
                    isExpanded={templateReviewSectionsExpanded.parameters}
                    isIndented
                    onToggle={(_e, expanded) =>
                      setTemplateReviewSectionsExpanded((s) => ({
                        ...s,
                        parameters: expanded,
                      }))
                    }
                  >
                    <DescriptionList isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Virtual machine name</DescriptionListTerm>
                        <DescriptionListDescription>
                          {templateVmName.trim() || '—'}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </ExpandableSection>
                </div>
              )}
              {deployment === 'clone' && cloneSourceVmId && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--pf-t--global--spacer--sm)',
                  }}
                >
                  <ExpandableSection
                    toggleText="Details"
                    isExpanded={templateReviewSectionsExpanded.details}
                    isIndented
                    onToggle={(_e, expanded) =>
                      setTemplateReviewSectionsExpanded((s) => ({ ...s, details: expanded }))
                    }
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        gap: 'var(--pf-t--global--spacer--lg)',
                      }}
                    >
                      <div style={{ flex: '1 1 14rem', minWidth: 0 }}>
                        <DescriptionList isCompact>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Deployment</DescriptionListTerm>
                            <DescriptionListDescription>Clone</DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Source virtual machine</DescriptionListTerm>
                            <DescriptionListDescription>
                              {cloneSourceVmForReview?.name ?? '—'}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>CPU</DescriptionListTerm>
                            <DescriptionListDescription>
                              {cloneSourceVmForReview?.cpu ?? '—'}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Memory</DescriptionListTerm>
                            <DescriptionListDescription>
                              {cloneSourceVmForReview?.memory ?? '—'}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Storage</DescriptionListTerm>
                            <DescriptionListDescription>
                              {cloneSourceVmForReview?.storage ?? '—'}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Network</DescriptionListTerm>
                            <DescriptionListDescription>
                              {cloneSourceVmForReview?.networkSummary ?? '—'}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--pf-t--global--spacer--md)',
                          flex: '1 1 14rem',
                          minWidth: 0,
                        }}
                      >
                        <DescriptionList isCompact>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Virtual machine name</DescriptionListTerm>
                            <DescriptionListDescription>
                              {cloneNewName.trim() || '—'}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Hostname</DescriptionListTerm>
                            <DescriptionListDescription>
                              Inherited from source configuration
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                        <FormGroup label="Headless mode" fieldId="create-vm-clone-review-headless">
                          <Switch
                            id="create-vm-clone-review-headless"
                            aria-label="Headless mode"
                            isChecked={TEMPLATE_REVIEW_DETAILS_SWITCH_DEFAULTS.headlessMode}
                            isDisabled
                          />
                        </FormGroup>
                        <FormGroup
                          label="Guest system log access"
                          fieldId="create-vm-clone-review-guest-log"
                        >
                          <Switch
                            id="create-vm-clone-review-guest-log"
                            aria-label="Guest system log access"
                            isChecked={TEMPLATE_REVIEW_DETAILS_SWITCH_DEFAULTS.guestLogAccess}
                            isDisabled
                          />
                        </FormGroup>
                        <FormGroup
                          label="Deletion protection"
                          fieldId="create-vm-clone-review-deletion-protection"
                        >
                          <Switch
                            id="create-vm-clone-review-deletion-protection"
                            aria-label="Deletion protection"
                            isChecked={TEMPLATE_REVIEW_DETAILS_SWITCH_DEFAULTS.deletionProtection}
                            isDisabled
                          />
                        </FormGroup>
                      </div>
                    </div>
                  </ExpandableSection>
                  <ExpandableSection
                    toggleText="Storage"
                    isExpanded={templateReviewSectionsExpanded.storage}
                    isIndented
                    onToggle={(_e, expanded) =>
                      setTemplateReviewSectionsExpanded((s) => ({ ...s, storage: expanded }))
                    }
                  >
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {TEMPLATE_REVIEW_STORAGE_CAPTION}
                    </Content>
                  </ExpandableSection>
                  <ExpandableSection
                    toggleText="Network"
                    isExpanded={templateReviewSectionsExpanded.network}
                    isIndented
                    onToggle={(_e, expanded) =>
                      setTemplateReviewSectionsExpanded((s) => ({ ...s, network: expanded }))
                    }
                  >
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {templateReviewNetworkCaption(selectedTemplateId)}
                    </Content>
                  </ExpandableSection>
                  <ExpandableSection
                    toggleText="SSH"
                    isExpanded={templateReviewSectionsExpanded.ssh}
                    isIndented
                    onToggle={(_e, expanded) =>
                      setTemplateReviewSectionsExpanded((s) => ({ ...s, ssh: expanded }))
                    }
                  >
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {TEMPLATE_REVIEW_SSH_CAPTION}
                    </Content>
                  </ExpandableSection>
                  <ExpandableSection
                    toggleText="Scheduling"
                    isExpanded={templateReviewSectionsExpanded.scheduling}
                    isIndented
                    onToggle={(_e, expanded) =>
                      setTemplateReviewSectionsExpanded((s) => ({
                        ...s,
                        scheduling: expanded,
                      }))
                    }
                  >
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {TEMPLATE_REVIEW_SCHEDULING_CAPTION}
                    </Content>
                  </ExpandableSection>
                  <ExpandableSection
                    toggleText="Initial run"
                    isExpanded={templateReviewSectionsExpanded.initialRun}
                    isIndented
                    onToggle={(_e, expanded) =>
                      setTemplateReviewSectionsExpanded((s) => ({
                        ...s,
                        initialRun: expanded,
                      }))
                    }
                  >
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {TEMPLATE_REVIEW_INITIAL_RUN_CAPTION}
                    </Content>
                  </ExpandableSection>
                  <ExpandableSection
                    toggleText="Metadata"
                    isExpanded={templateReviewSectionsExpanded.metadata}
                    isIndented
                    onToggle={(_e, expanded) =>
                      setTemplateReviewSectionsExpanded((s) => ({ ...s, metadata: expanded }))
                    }
                  >
                    <Content
                      component="p"
                      style={{
                        margin: 0,
                        color: 'var(--pf-t--global--text--color--subtle)',
                      }}
                    >
                      {TEMPLATE_REVIEW_METADATA_CAPTION}
                    </Content>
                  </ExpandableSection>
                </div>
              )}
            </div>
          </WizardStep>
        </Wizard>
      </Modal>
    </>
  )
})

CreateVirtualMachineLaunchButton.displayName = 'CreateVirtualMachineLaunchButton'
