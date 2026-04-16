import { useState } from 'react'
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  Label,
  MenuToggle,
} from '@patternfly/react-core'
import { EllipsisVIcon } from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import tableStyles from '@patternfly/react-styles/css/components/Table/table'
import type { DemoTenantId } from './demoTenant'
import {
  DEMO_TENANT_DISPLAY_ADMIN,
  DEMO_TENANT_DISPLAY_USER,
  DEMO_TENANT_LOGIN_EMAIL_USER,
} from './demoTenant'

type UserRole = 'Admin' | 'User' | 'Viewer'

type UserResource = {
  vcpuUsed: number
  vcpuAlloc: number
  memUsedGiB: number
  memAllocGiB: number
  gpuUsed: number
  gpuAlloc: number
  storUsedTb: number
  storAllocTb: number
}

export type TenantAdminUserRow = {
  id: string
  name: string
  email: string
  role: UserRole
  vms: number
  resource: UserResource
  lastLogin: string
  status: 'Active' | 'Locked' | 'Suspended'
}

const NORTHSTAR_USER_ROWS: TenantAdminUserRow[] = [
  {
    id: 'ns-1',
    name: DEMO_TENANT_DISPLAY_ADMIN.northstar,
    email: 'jlee@northstarbank.com',
    role: 'Admin',
    vms: 5,
    resource: {
      vcpuUsed: 48,
      vcpuAlloc: 96,
      memUsedGiB: 192,
      memAllocGiB: 384,
      gpuUsed: 2,
      gpuAlloc: 4,
      storUsedTb: 4.2,
      storAllocTb: 12,
    },
    lastLogin: 'Active now',
    status: 'Active',
  },
  {
    id: 'ns-chris',
    name: DEMO_TENANT_DISPLAY_USER.northstar,
    email: DEMO_TENANT_LOGIN_EMAIL_USER.northstar,
    role: 'User',
    vms: 7,
    resource: {
      vcpuUsed: 40,
      vcpuAlloc: 80,
      memUsedGiB: 160,
      memAllocGiB: 320,
      gpuUsed: 1,
      gpuAlloc: 4,
      storUsedTb: 3.4,
      storAllocTb: 10,
    },
    lastLogin: '52 min ago',
    status: 'Active',
  },
  {
    id: 'ns-2',
    name: 'Taylor Kim',
    email: 'tkim@northstarbank.com',
    role: 'User',
    vms: 4,
    resource: {
      vcpuUsed: 32,
      vcpuAlloc: 64,
      memUsedGiB: 128,
      memAllocGiB: 256,
      gpuUsed: 1,
      gpuAlloc: 2,
      storUsedTb: 2.8,
      storAllocTb: 8,
    },
    lastLogin: '18 min ago',
    status: 'Active',
  },
  {
    id: 'ns-3',
    name: 'Jamie Ortiz',
    email: 'jortiz@northstarbank.com',
    role: 'Viewer',
    vms: 0,
    resource: {
      vcpuUsed: 0,
      vcpuAlloc: 16,
      memUsedGiB: 0,
      memAllocGiB: 64,
      gpuUsed: 0,
      gpuAlloc: 0,
      storUsedTb: 0,
      storAllocTb: 2,
    },
    lastLogin: 'Yesterday',
    status: 'Active',
  },
  {
    id: 'ns-4',
    name: 'Avery Collins',
    email: 'acollins@northstarbank.com',
    role: 'User',
    vms: 2,
    resource: {
      vcpuUsed: 16,
      vcpuAlloc: 48,
      memUsedGiB: 64,
      memAllocGiB: 192,
      gpuUsed: 0,
      gpuAlloc: 2,
      storUsedTb: 1.1,
      storAllocTb: 6,
    },
    lastLogin: '3 hr ago',
    status: 'Active',
  },
  {
    id: 'ns-5',
    name: 'Rio Nakamura',
    email: 'rnakamura@northstarbank.com',
    role: 'Viewer',
    vms: 0,
    resource: {
      vcpuUsed: 0,
      vcpuAlloc: 8,
      memUsedGiB: 0,
      memAllocGiB: 32,
      gpuUsed: 0,
      gpuAlloc: 0,
      storUsedTb: 0,
      storAllocTb: 1,
    },
    lastLogin: 'Mar 28, 2026',
    status: 'Active',
  },
  {
    id: 'ns-6',
    name: 'Casey Wu',
    email: 'cwu@northstarbank.com',
    role: 'User',
    vms: 3,
    resource: {
      vcpuUsed: 24,
      vcpuAlloc: 64,
      memUsedGiB: 96,
      memAllocGiB: 256,
      gpuUsed: 1,
      gpuAlloc: 2,
      storUsedTb: 2.4,
      storAllocTb: 10,
    },
    lastLogin: '2 days ago',
    status: 'Locked',
  },
  {
    id: 'ns-7',
    name: 'Dana Frost',
    email: 'dfrost@northstarbank.com',
    role: 'User',
    vms: 1,
    resource: {
      vcpuUsed: 8,
      vcpuAlloc: 32,
      memUsedGiB: 32,
      memAllocGiB: 128,
      gpuUsed: 0,
      gpuAlloc: 1,
      storUsedTb: 0.6,
      storAllocTb: 4,
    },
    lastLogin: 'Apr 2, 2026',
    status: 'Active',
  },
  {
    id: 'ns-8',
    name: 'Morgan Blake',
    email: 'mblake@northstarbank.com',
    role: 'Viewer',
    vms: 0,
    resource: {
      vcpuUsed: 0,
      vcpuAlloc: 8,
      memUsedGiB: 0,
      memAllocGiB: 32,
      gpuUsed: 0,
      gpuAlloc: 0,
      storUsedTb: 0,
      storAllocTb: 1,
    },
    lastLogin: 'Mar 15, 2026',
    status: 'Suspended',
  },
]

const EVERGREEN_USER_ROWS: TenantAdminUserRow[] = [
  {
    id: 'ev-1',
    name: DEMO_TENANT_DISPLAY_ADMIN.evergreen,
    email: 'mchen@bluestonefinancial.com',
    role: 'Admin',
    vms: 4,
    resource: {
      vcpuUsed: 40,
      vcpuAlloc: 80,
      memUsedGiB: 160,
      memAllocGiB: 320,
      gpuUsed: 2,
      gpuAlloc: 4,
      storUsedTb: 3.6,
      storAllocTb: 10,
    },
    lastLogin: 'Active now',
    status: 'Active',
  },
  {
    id: 'ev-priya',
    name: DEMO_TENANT_DISPLAY_USER.evergreen,
    email: DEMO_TENANT_LOGIN_EMAIL_USER.evergreen,
    role: 'User',
    vms: 5,
    resource: {
      vcpuUsed: 28,
      vcpuAlloc: 64,
      memUsedGiB: 112,
      memAllocGiB: 256,
      gpuUsed: 1,
      gpuAlloc: 2,
      storUsedTb: 2.6,
      storAllocTb: 8,
    },
    lastLogin: '36 min ago',
    status: 'Active',
  },
  {
    id: 'ev-2',
    name: 'Sasha Patel',
    email: 'spatel@bluestonefinancial.com',
    role: 'User',
    vms: 3,
    resource: {
      vcpuUsed: 24,
      vcpuAlloc: 64,
      memUsedGiB: 96,
      memAllocGiB: 256,
      gpuUsed: 1,
      gpuAlloc: 2,
      storUsedTb: 2.2,
      storAllocTb: 8,
    },
    lastLogin: '42 min ago',
    status: 'Active',
  },
  {
    id: 'ev-3',
    name: 'Devon Hayes',
    email: 'dhayes@bluestonefinancial.com',
    role: 'Viewer',
    vms: 0,
    resource: {
      vcpuUsed: 0,
      vcpuAlloc: 16,
      memUsedGiB: 0,
      memAllocGiB: 64,
      gpuUsed: 0,
      gpuAlloc: 0,
      storUsedTb: 0,
      storAllocTb: 2,
    },
    lastLogin: 'Yesterday',
    status: 'Active',
  },
  {
    id: 'ev-4',
    name: 'Riley Kim',
    email: 'rkim@bluestonefinancial.com',
    role: 'User',
    vms: 5,
    resource: {
      vcpuUsed: 36,
      vcpuAlloc: 72,
      memUsedGiB: 144,
      memAllocGiB: 288,
      gpuUsed: 1,
      gpuAlloc: 4,
      storUsedTb: 3.1,
      storAllocTb: 12,
    },
    lastLogin: '5 hr ago',
    status: 'Active',
  },
  {
    id: 'ev-5',
    name: 'Emerson Cruz',
    email: 'ecruz@bluestonefinancial.com',
    role: 'Viewer',
    vms: 0,
    resource: {
      vcpuUsed: 0,
      vcpuAlloc: 8,
      memUsedGiB: 0,
      memAllocGiB: 32,
      gpuUsed: 0,
      gpuAlloc: 0,
      storUsedTb: 0,
      storAllocTb: 1,
    },
    lastLogin: 'Mar 22, 2026',
    status: 'Active',
  },
  {
    id: 'ev-6',
    name: 'Quinn Brooks',
    email: 'qbrooks@bluestonefinancial.com',
    role: 'User',
    vms: 2,
    resource: {
      vcpuUsed: 12,
      vcpuAlloc: 48,
      memUsedGiB: 48,
      memAllocGiB: 192,
      gpuUsed: 0,
      gpuAlloc: 2,
      storUsedTb: 1.4,
      storAllocTb: 6,
    },
    lastLogin: 'Apr 1, 2026',
    status: 'Locked',
  },
]

const VERTEXA_USER_ROWS: TenantAdminUserRow[] = [
  {
    id: 'vx-1',
    name: DEMO_TENANT_DISPLAY_ADMIN.vertexa,
    email: 'ajohnson@vertexacloud.com',
    role: 'Admin',
    vms: 2,
    resource: {
      vcpuUsed: 16,
      vcpuAlloc: 48,
      memUsedGiB: 64,
      memAllocGiB: 192,
      gpuUsed: 0,
      gpuAlloc: 2,
      storUsedTb: 1.2,
      storAllocTb: 5,
    },
    lastLogin: 'Active now',
    status: 'Active',
  },
  {
    id: 'vx-2',
    name: 'Riley Park',
    email: 'rpark@vertexacloud.com',
    role: 'User',
    vms: 1,
    resource: {
      vcpuUsed: 8,
      vcpuAlloc: 24,
      memUsedGiB: 32,
      memAllocGiB: 96,
      gpuUsed: 0,
      gpuAlloc: 1,
      storUsedTb: 0.5,
      storAllocTb: 3,
    },
    lastLogin: '1 hr ago',
    status: 'Active',
  },
  {
    id: 'vx-3',
    name: 'Sam Vega',
    email: 'svega@vertexacloud.com',
    role: 'Viewer',
    vms: 0,
    resource: {
      vcpuUsed: 0,
      vcpuAlloc: 8,
      memUsedGiB: 0,
      memAllocGiB: 32,
      gpuUsed: 0,
      gpuAlloc: 0,
      storUsedTb: 0,
      storAllocTb: 1,
    },
    lastLogin: 'Mar 30, 2026',
    status: 'Active',
  },
]

export function getTenantAdminUserRowsForTenant(tenantId: DemoTenantId): TenantAdminUserRow[] {
  switch (tenantId) {
    case 'northstar':
      return NORTHSTAR_USER_ROWS
    case 'evergreen':
      return EVERGREEN_USER_ROWS
    case 'vertexa':
      return VERTEXA_USER_ROWS
    default:
      return NORTHSTAR_USER_ROWS
  }
}

function roleLabelColor(role: UserRole): 'purple' | 'blue' | 'grey' {
  switch (role) {
    case 'Admin':
      return 'purple'
    case 'User':
      return 'blue'
    case 'Viewer':
      return 'grey'
    default:
      return 'grey'
  }
}

function statusLabelColor(status: TenantAdminUserRow['status']): 'green' | 'orange' | 'red' {
  switch (status) {
    case 'Active':
      return 'green'
    case 'Locked':
      return 'orange'
    case 'Suspended':
      return 'red'
    default:
      return 'green'
  }
}

function formatStorageTb(n: number): string {
  return Number.isInteger(n) ? `${n}` : n.toFixed(1)
}

function ResourceUsageCell({ r }: { r: UserResource }) {
  return (
    <div className="tenant-admin-users-resource">
      <div className="tenant-admin-users-resource__line">
        vCPU {r.vcpuUsed}/{r.vcpuAlloc}
      </div>
      <div className="tenant-admin-users-resource__line">
        Memory {r.memUsedGiB}/{r.memAllocGiB} GiB
      </div>
      <div className="tenant-admin-users-resource__line">
        GPU {r.gpuUsed}/{r.gpuAlloc}
      </div>
      <div className="tenant-admin-users-resource__line">
        Storage {formatStorageTb(r.storUsedTb)}/{formatStorageTb(r.storAllocTb)} TB
      </div>
    </div>
  )
}

export type TenantAdminUserManagementPageProps = {
  demoTenantId: DemoTenantId
}

/** Tenant admin — user directory (demo). */
export function TenantAdminUserManagementPage({ demoTenantId }: TenantAdminUserManagementPageProps) {
  const [actionsMenuOpenId, setActionsMenuOpenId] = useState<string | null>(null)
  const rows = getTenantAdminUserRowsForTenant(demoTenantId)

  return (
    <div className="osac-tenant-admin-page">
      <div className="tenant-admin-users-table-wrap">
        <table
          className={`${tableStyles.table} ${tableStyles.modifiers.striped} tenant-admin-users-table`}
          aria-label="User directory"
        >
          <thead className={tableStyles.tableThead}>
            <tr className={tableStyles.tableTr}>
              <th className={tableStyles.tableTh} scope="col">
                Name
              </th>
              <th className={tableStyles.tableTh} scope="col">
                Email
              </th>
              <th className={`${tableStyles.tableTh} ${tableStyles.modifiers.fitContent}`} scope="col">
                Role
              </th>
              <th className={`${tableStyles.tableTh} ${tableStyles.modifiers.fitContent}`} scope="col">
                VMs
              </th>
              <th className={`${tableStyles.tableTh} tenant-admin-users-table__th--resource`} scope="col">
                Resource usage
              </th>
              <th className={tableStyles.tableTh} scope="col">
                Last login
              </th>
              <th className={`${tableStyles.tableTh} ${tableStyles.modifiers.fitContent}`} scope="col">
                Status
              </th>
              <th
                className={`${tableStyles.tableTh} ${tableStyles.tableAction} ${tableStyles.modifiers.fitContent}`}
                aria-label="Actions"
                scope="col"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={tableStyles.tableTbody}>
            {rows.map((row) => (
              <tr key={row.id} className={tableStyles.tableTr}>
                <td className={tableStyles.tableTd} data-label="Name">
                  <strong>{row.name}</strong>
                </td>
                <td className={tableStyles.tableTd} data-label="Email">
                  {row.email}
                </td>
                <td className={tableStyles.tableTd} data-label="Role">
                  <Label color={roleLabelColor(row.role)}>{row.role}</Label>
                </td>
                <td className={tableStyles.tableTd} data-label="VMs">
                  {row.vms}
                </td>
                <td className={`${tableStyles.tableTd} tenant-admin-users-table__td--resource`} data-label="Resource usage">
                  <ResourceUsageCell r={row.resource} />
                </td>
                <td className={tableStyles.tableTd} data-label="Last login">
                  {row.lastLogin}
                </td>
                <td className={tableStyles.tableTd} data-label="Status">
                  <Label color={statusLabelColor(row.status)}>{row.status}</Label>
                </td>
                <td
                  className={`${tableStyles.tableTd} ${tableStyles.tableAction} ${tableStyles.modifiers.action} ${tableStyles.modifiers.fitContent}`}
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
                        onClick={() => setActionsMenuOpenId((cur) => (cur === row.id ? null : row.id))}
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
                        Edit user
                      </DropdownItem>
                      <DropdownItem
                        key="remove"
                        onClick={(e) => {
                          e.preventDefault()
                          setActionsMenuOpenId(null)
                        }}
                      >
                        Remove access
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
