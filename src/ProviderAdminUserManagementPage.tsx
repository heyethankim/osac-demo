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

type ProviderUserRole = 'Admin' | 'User' | 'Viewer'
type ProviderUserStatus = 'Active' | 'Locked' | 'Suspended'

type ProviderAdminUserRow = {
  id: string
  name: string
  email: string
  role: ProviderUserRole
  /** Comma-separated tenant assignments (demo). */
  tenants: string
  lastLogin: string
  status: ProviderUserStatus
}

const FIRST_NAMES = [
  'Alex',
  'Jordan',
  'Taylor',
  'Avery',
  'Riley',
  'Morgan',
  'Casey',
  'Cameron',
  'Skyler',
  'Rowan',
  'Parker',
  'Quinn',
] as const

const LAST_NAMES = [
  'Johnson',
  'Lee',
  'Kim',
  'Nguyen',
  'Patel',
  'Garcia',
  'Chen',
  'Miller',
  'Brooks',
  'Rivera',
  'Morales',
  'Foster',
] as const

const TENANT_SCOPES = [
  'Northstar Bank',
  'Bluestone Financial Group',
  'Summit Credit Alliance',
  'Lighthouse Capital',
  'Union Harbor Trust',
  'Atlas Regional Bank',
] as const

const LAST_LOGIN_VALUES = [
  'Active now',
  '3 min ago',
  '12 min ago',
  '38 min ago',
  '1 hr ago',
  '4 hr ago',
  'Yesterday',
  '2 days ago',
  'Apr 2, 2026',
  'Mar 25, 2026',
] as const

function seededPick(seed: number, modulo: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  const fraction = value - Math.floor(value)
  return Math.floor(fraction * modulo)
}

function pickDistinctTenantScopes(seed: number): string {
  const count = 1 + seededPick(seed + 1, 3)
  const picks: string[] = []
  let cursor = 0
  while (picks.length < count) {
    const idx = seededPick(seed + cursor * 13, TENANT_SCOPES.length)
    const candidate = TENANT_SCOPES[idx]
    if (!picks.includes(candidate)) picks.push(candidate)
    cursor += 1
  }
  return picks.join(', ')
}

function buildProviderAdminUserRows(total = 84): ProviderAdminUserRow[] {
  const rows: ProviderAdminUserRow[] = []
  const rolePool: ProviderUserRole[] = ['User', 'User', 'User', 'Viewer', 'Admin']
  const statusPool: ProviderUserStatus[] = ['Active', 'Active', 'Active', 'Locked', 'Suspended']

  for (let i = 0; i < total; i += 1) {
    const first = FIRST_NAMES[seededPick(i + 5, FIRST_NAMES.length)]
    const last = LAST_NAMES[seededPick(i + 11, LAST_NAMES.length)]
    const role = rolePool[seededPick(i + 17, rolePool.length)]
    const status = statusPool[seededPick(i + 23, statusPool.length)]

    const tenantScopes =
      role === 'Admin' ? 'All tenant organizations' : pickDistinctTenantScopes(i + 29)

    rows.push({
      id: `provider-user-${i + 1}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@vertexacloud.com`,
      role,
      tenants: tenantScopes,
      lastLogin: LAST_LOGIN_VALUES[seededPick(i + 31, LAST_LOGIN_VALUES.length)],
      status,
    })
  }

  return rows
}

const PROVIDER_USER_ROWS = buildProviderAdminUserRows(84)

function roleLabelColor(role: ProviderUserRole): 'purple' | 'blue' | 'grey' {
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

function statusLabelColor(status: ProviderUserStatus): 'green' | 'orange' | 'red' {
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

/** Provider admin — user directory (demo, 84 generated users). */
export function ProviderAdminUserManagementPage() {
  const [actionsMenuOpenId, setActionsMenuOpenId] = useState<string | null>(null)

  return (
    <div className="osac-tenant-admin-page">
      <div className="tenant-admin-users-table-wrap">
        <table
          className={`${tableStyles.table} ${tableStyles.modifiers.striped} tenant-admin-users-table`}
          aria-label="Provider user directory"
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
              <th className={tableStyles.tableTh} scope="col">
                Tenants
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
            {PROVIDER_USER_ROWS.map((row) => (
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
                <td className={`${tableStyles.tableTd} tenant-admin-users-table__td--projects`} data-label="Tenants">
                  {row.tenants}
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
                        key="suspend"
                        onClick={(e) => {
                          e.preventDefault()
                          setActionsMenuOpenId(null)
                        }}
                      >
                        Suspend access
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
