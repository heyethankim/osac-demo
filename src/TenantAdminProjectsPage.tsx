import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Label,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  TextArea,
  TextInput,
} from '@patternfly/react-core'
import { EllipsisVIcon } from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import tableStyles from '@patternfly/react-styles/css/components/Table/table'
import type { DemoTenantId } from './demoTenant'
import {
  getTenantAdminProjectRows,
  type TenantAdminProjectRow,
  type TenantAdminProjectStatus,
} from './tenantAdminProjectsDemo'
import {
  TenantAdminUsageMicroBar,
  formatMemoryGiBPair,
  formatStorageTbPair,
} from './TenantAdminUsageMicroBar'

const ENVIRONMENT_OPTIONS = ['Production', 'Staging', 'Development', 'Sandbox'] as const

function parseQuotaGiB(s: string): number {
  const t = s.trim().toLowerCase()
  const m = t.match(/([\d.]+)/)
  const n = m ? parseFloat(m[1]) : 256
  if (Number.isNaN(n)) return 256
  if (t.includes('tib')) return Math.round(n * 1024)
  return Math.round(n)
}

function parseQuotaTb(s: string): number {
  const t = s.trim().toLowerCase()
  const m = t.match(/([\d.]+)/)
  const n = m ? parseFloat(m[1]) : 16
  if (Number.isNaN(n)) return 16
  return n
}

export type TenantAdminProjectsPageProps = {
  demoTenantId: DemoTenantId
  createProjectModalOpen: boolean
  onCloseCreateProjectModal: () => void
}

function statusLabelColor(status: TenantAdminProjectStatus): 'green' | 'blue' | 'orange' | 'red' {
  switch (status) {
    case 'Active':
      return 'green'
    case 'Provisioning':
      return 'blue'
    case 'Maintenance':
      return 'orange'
    case 'Degraded':
      return 'red'
    default:
      return 'green'
  }
}

/** Tenant admin — projects directory (demo). */
export function TenantAdminProjectsPage({
  demoTenantId,
  createProjectModalOpen,
  onCloseCreateProjectModal,
}: TenantAdminProjectsPageProps) {
  const seedRows = useMemo(() => getTenantAdminProjectRows(demoTenantId), [demoTenantId])
  const [rows, setRows] = useState<TenantAdminProjectRow[]>(() => seedRows)
  const [actionsMenuOpenId, setActionsMenuOpenId] = useState<string | null>(null)

  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formEnvironment, setFormEnvironment] = useState<string>('Development')
  const [formVcpuQuota, setFormVcpuQuota] = useState('')
  const [formMemoryQuota, setFormMemoryQuota] = useState('')
  const [formGpuQuota, setFormGpuQuota] = useState('')
  const [formStorageQuota, setFormStorageQuota] = useState('')
  const [formOwner, setFormOwner] = useState('')

  useEffect(() => {
    setRows(seedRows)
  }, [seedRows])

  const resetForm = useCallback(() => {
    setFormName('')
    setFormDescription('')
    setFormEnvironment('Development')
    setFormVcpuQuota('')
    setFormMemoryQuota('')
    setFormGpuQuota('')
    setFormStorageQuota('')
    setFormOwner('')
  }, [])

  useEffect(() => {
    if (!createProjectModalOpen) resetForm()
  }, [createProjectModalOpen, resetForm])

  const handleCloseModal = useCallback(() => {
    resetForm()
    onCloseCreateProjectModal()
  }, [onCloseCreateProjectModal, resetForm])

  const handleSubmitCreate = useCallback(() => {
    const name = formName.trim() || 'Untitled project'
    const vAlloc = Number.parseInt(formVcpuQuota.trim(), 10) || 128
    const memAllocGiB = parseQuotaGiB(formMemoryQuota.trim() || '256 GiB')
    const gpuAlloc = Number.parseInt(formGpuQuota.trim(), 10) || 0
    const storAllocTb = parseQuotaTb(formStorageQuota.trim() || '16')
    const newRow: TenantAdminProjectRow = {
      id: `proj-${Date.now()}`,
      name,
      environment: formEnvironment,
      owner: formOwner.trim() || 'Unassigned',
      members: 1,
      vms: 0,
      vcpuUsed: 0,
      vcpuAlloc: vAlloc,
      memUsedGiB: 0,
      memAllocGiB: memAllocGiB,
      gpuUsed: 0,
      gpuAlloc,
      storUsedTb: 0,
      storAllocTb,
      status: 'Provisioning',
    }
    setRows((prev) => [newRow, ...prev])
    handleCloseModal()
  }, [
    formName,
    formEnvironment,
    formOwner,
    formVcpuQuota,
    formMemoryQuota,
    formGpuQuota,
    formStorageQuota,
    handleCloseModal,
  ])

  return (
    <div className="osac-tenant-admin-page">
      <Modal
        variant={ModalVariant.medium}
        isOpen={createProjectModalOpen}
        onClose={handleCloseModal}
        ouiaId="tenant-admin-create-project-modal"
      >
        <ModalHeader
          title="Create new project"
          labelId="tenant-admin-create-project-modal-title"
        />
        <ModalBody>
        <Form
          id="tenant-admin-create-project-form"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmitCreate()
          }}
        >
          <FormGroup label="Project name" fieldId="tenant-admin-project-name" isRequired>
            <TextInput
              id="tenant-admin-project-name"
              value={formName}
              onChange={(_e, v) => setFormName(v)}
              aria-label="Project name"
            />
          </FormGroup>
          <FormGroup label="Description" fieldId="tenant-admin-project-description">
            <TextArea
              id="tenant-admin-project-description"
              value={formDescription}
              onChange={(_e, v) => setFormDescription(v)}
              aria-label="Description"
              rows={3}
            />
          </FormGroup>
          <FormGroup label="Environment" fieldId="tenant-admin-project-environment">
            <FormSelect
              id="tenant-admin-project-environment"
              value={formEnvironment}
              onChange={(_e, v) => setFormEnvironment(String(v))}
              aria-label="Environment"
            >
              {ENVIRONMENT_OPTIONS.map((opt) => (
                <FormSelectOption key={opt} value={opt} label={opt} />
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup label="vCPU quota" fieldId="tenant-admin-project-vcpu-quota">
            <TextInput
              id="tenant-admin-project-vcpu-quota"
              value={formVcpuQuota}
              onChange={(_e, v) => setFormVcpuQuota(v)}
              placeholder="e.g. 128"
              aria-label="vCPU quota"
            />
          </FormGroup>
          <FormGroup label="Memory quota" fieldId="tenant-admin-project-memory-quota">
            <TextInput
              id="tenant-admin-project-memory-quota"
              value={formMemoryQuota}
              onChange={(_e, v) => setFormMemoryQuota(v)}
              placeholder="e.g. 512 GiB"
              aria-label="Memory quota"
            />
          </FormGroup>
          <FormGroup label="GPU quota" fieldId="tenant-admin-project-gpu-quota">
            <TextInput
              id="tenant-admin-project-gpu-quota"
              value={formGpuQuota}
              onChange={(_e, v) => setFormGpuQuota(v)}
              placeholder="e.g. 4"
              aria-label="GPU quota"
            />
          </FormGroup>
          <FormGroup label="Storage quota" fieldId="tenant-admin-project-storage-quota">
            <TextInput
              id="tenant-admin-project-storage-quota"
              value={formStorageQuota}
              onChange={(_e, v) => setFormStorageQuota(v)}
              placeholder="e.g. 50 TiB"
              aria-label="Storage quota"
            />
          </FormGroup>
          <FormGroup label="Project owner" fieldId="tenant-admin-project-owner">
            <TextInput
              id="tenant-admin-project-owner"
              value={formOwner}
              onChange={(_e, v) => setFormOwner(v)}
              aria-label="Project owner"
            />
          </FormGroup>
        </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="link" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="tenant-admin-create-project-form"
          >
            Create project
          </Button>
        </ModalFooter>
      </Modal>

      <div className="tenant-admin-projects-table-wrap">
        <table
          className={`${tableStyles.table} ${tableStyles.modifiers.striped} tenant-admin-projects-table`}
          aria-label="Projects"
        >
          <colgroup>
            <col className="tenant-admin-projects-table__col tenant-admin-projects-table__col--name" />
            <col className="tenant-admin-projects-table__col tenant-admin-projects-table__col--status" />
            <col className="tenant-admin-projects-table__col tenant-admin-projects-table__col--env" />
            <col className="tenant-admin-projects-table__col tenant-admin-projects-table__col--owner" />
            <col className="tenant-admin-projects-table__col tenant-admin-projects-table__col--members" />
            <col className="tenant-admin-projects-table__col tenant-admin-projects-table__col--vms" />
            <col className="tenant-admin-projects-table__col tenant-admin-projects-table__col--vcpu" />
            <col className="tenant-admin-projects-table__col tenant-admin-projects-table__col--memory" />
            <col className="tenant-admin-projects-table__col tenant-admin-projects-table__col--gpu" />
            <col className="tenant-admin-projects-table__col tenant-admin-projects-table__col--storage" />
            <col className="tenant-admin-projects-table__col tenant-admin-projects-table__col--actions" />
          </colgroup>
          <thead className={tableStyles.tableThead}>
            <tr className={tableStyles.tableTr}>
              <th
                className={`${tableStyles.tableTh} tenant-admin-projects-table__cell--project-name`}
                scope="col"
              >
                Project name
              </th>
              <th className={`${tableStyles.tableTh} tenant-admin-projects-table__cell--status`} scope="col">
                Status
              </th>
              <th
                className={`${tableStyles.tableTh} tenant-admin-projects-table__cell--environment`}
                scope="col"
              >
                Environment
              </th>
              <th className={`${tableStyles.tableTh} tenant-admin-projects-table__cell--owner`} scope="col">
                Owner
              </th>
              <th
                className={`${tableStyles.tableTh} tenant-admin-projects-table__cell--members`}
                scope="col"
              >
                Members
              </th>
              <th className={`${tableStyles.tableTh} tenant-admin-projects-table__cell--vms`} scope="col">
                VMs
              </th>
              <th className={tableStyles.tableTh} scope="col">
                vCPU usage
              </th>
              <th className={tableStyles.tableTh} scope="col">
                Memory usage
              </th>
              <th className={tableStyles.tableTh} scope="col">
                GPU usage
              </th>
              <th className={tableStyles.tableTh} scope="col">
                Storage usage
              </th>
              <th className={`${tableStyles.tableTh} ${tableStyles.tableAction}`} aria-label="Actions" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={tableStyles.tableTbody}>
            {rows.map((row) => (
              <tr key={row.id} className={tableStyles.tableTr}>
                <td
                  className={`${tableStyles.tableTd} tenant-admin-projects-table__cell--project-name`}
                  data-label="Project name"
                >
                  <strong>{row.name}</strong>
                </td>
                <td className={`${tableStyles.tableTd} tenant-admin-projects-table__cell--status`} data-label="Status">
                  <Label color={statusLabelColor(row.status)}>{row.status}</Label>
                </td>
                <td
                  className={`${tableStyles.tableTd} tenant-admin-projects-table__cell--environment`}
                  data-label="Environment"
                >
                  {row.environment}
                </td>
                <td className={`${tableStyles.tableTd} tenant-admin-projects-table__cell--owner`} data-label="Owner">
                  {row.owner}
                </td>
                <td
                  className={`${tableStyles.tableTd} tenant-admin-projects-table__cell--members`}
                  data-label="Members"
                >
                  {row.members}
                </td>
                <td className={`${tableStyles.tableTd} tenant-admin-projects-table__cell--vms`} data-label="VMs">
                  {row.vms}
                </td>
                <td className={tableStyles.tableTd} data-label="vCPU usage">
                  <TenantAdminUsageMicroBar
                    used={row.vcpuUsed}
                    total={row.vcpuAlloc}
                    valueLabel={`${row.vcpuUsed} / ${row.vcpuAlloc}`}
                    ariaLabel={`${row.name} vCPU usage`}
                  />
                </td>
                <td className={tableStyles.tableTd} data-label="Memory usage">
                  <TenantAdminUsageMicroBar
                    used={row.memUsedGiB}
                    total={row.memAllocGiB}
                    valueLabel={formatMemoryGiBPair(row.memUsedGiB, row.memAllocGiB)}
                    ariaLabel={`${row.name} memory usage`}
                  />
                </td>
                <td className={tableStyles.tableTd} data-label="GPU usage">
                  <TenantAdminUsageMicroBar
                    used={row.gpuUsed}
                    total={row.gpuAlloc}
                    valueLabel={`${row.gpuUsed} / ${row.gpuAlloc}`}
                    ariaLabel={`${row.name} GPU usage`}
                  />
                </td>
                <td className={tableStyles.tableTd} data-label="Storage usage">
                  <TenantAdminUsageMicroBar
                    used={row.storUsedTb}
                    total={row.storAllocTb}
                    valueLabel={formatStorageTbPair(row.storUsedTb, row.storAllocTb)}
                    ariaLabel={`${row.name} storage usage`}
                  />
                </td>
                <td
                  className={`${tableStyles.tableTd} ${tableStyles.tableAction} ${tableStyles.modifiers.action}`}
                  data-label="Actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dropdown
                    isOpen={actionsMenuOpenId === row.id}
                    onOpenChange={(open) => setActionsMenuOpenId(open ? row.id : null)}
                    onSelect={() => setActionsMenuOpenId(null)}
                    popperProps={{ placement: 'bottom-end' }}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        variant="plain"
                        size="sm"
                        isExpanded={actionsMenuOpenId === row.id}
                        onClick={() =>
                          setActionsMenuOpenId((cur) => (cur === row.id ? null : row.id))
                        }
                        aria-label={`Actions for ${row.name}`}
                        icon={<EllipsisVIcon />}
                      />
                    )}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="view"
                        onClick={(e) => {
                          e.preventDefault()
                          setActionsMenuOpenId(null)
                        }}
                      >
                        View details
                      </DropdownItem>
                      <DropdownItem
                        key="edit"
                        onClick={(e) => {
                          e.preventDefault()
                          setActionsMenuOpenId(null)
                        }}
                      >
                        Edit project
                      </DropdownItem>
                      <DropdownItem
                        key="archive"
                        onClick={(e) => {
                          e.preventDefault()
                          setActionsMenuOpenId(null)
                        }}
                      >
                        Archive project
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
