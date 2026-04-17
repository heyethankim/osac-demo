import { useMemo, useState } from 'react'
import { Dropdown, DropdownItem, DropdownList, MenuToggle } from '@patternfly/react-core'
import { EllipsisVIcon } from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import tableStyles from '@patternfly/react-styles/css/components/Table/table'
import type { DemoTenantId } from './demoTenant'
import {
  getTenantAdminProjectQuotaRows,
  type TenantAdminProjectQuotaRow,
} from './tenantAdminProjectQuotasDemo'

export type TenantAdminQuotaControlPageProps = {
  demoTenantId: DemoTenantId
}

/** Tenant admin — project quotas (demo). Page title comes from the shell toolbar. */
export function TenantAdminQuotaControlPage({ demoTenantId }: TenantAdminQuotaControlPageProps) {
  const rows = useMemo(() => getTenantAdminProjectQuotaRows(demoTenantId), [demoTenantId])
  const [actionsMenuOpenId, setActionsMenuOpenId] = useState<string | null>(null)

  return (
    <div className="osac-tenant-admin-page tenant-admin-quota-page">
      <div className="tenant-admin-quota-project-table-wrap">
        <table
          className={`${tableStyles.table} ${tableStyles.modifiers.striped} tenant-admin-quota-project-table`}
          aria-label="Project quotas"
        >
          <colgroup>
            <col className="tenant-admin-quota-project-table__col tenant-admin-quota-project-table__col--project" />
            <col className="tenant-admin-quota-project-table__col tenant-admin-quota-project-table__col--vcpu" />
            <col className="tenant-admin-quota-project-table__col tenant-admin-quota-project-table__col--memory" />
            <col className="tenant-admin-quota-project-table__col tenant-admin-quota-project-table__col--gpu" />
            <col className="tenant-admin-quota-project-table__col tenant-admin-quota-project-table__col--storage" />
            <col className="tenant-admin-quota-project-table__col tenant-admin-quota-project-table__col--util" />
            <col className="tenant-admin-quota-project-table__col tenant-admin-quota-project-table__col--actions" />
          </colgroup>
          <thead className={tableStyles.tableThead}>
            <tr className={tableStyles.tableTr}>
              <th className={tableStyles.tableTh} scope="col">
                Project
              </th>
              <th className={tableStyles.tableTh} scope="col">
                vCPU quota
              </th>
              <th className={tableStyles.tableTh} scope="col">
                Memory quota
              </th>
              <th className={tableStyles.tableTh} scope="col">
                GPU quota
              </th>
              <th className={tableStyles.tableTh} scope="col">
                Storage quota
              </th>
              <th className={tableStyles.tableTh} scope="col">
                Utilization
              </th>
              <th
                className={`${tableStyles.tableTh} ${tableStyles.tableAction}`}
                aria-label="Actions"
                scope="col"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={tableStyles.tableTbody}>
            {rows.map((row: TenantAdminProjectQuotaRow) => (
              <tr key={row.id} className={tableStyles.tableTr}>
                <td className={tableStyles.tableTd} data-label="Project">
                  <strong>{row.project}</strong>
                </td>
                <td className={tableStyles.tableTd} data-label="vCPU quota">
                  <code className="tenant-admin-quota-project-table__mono">{row.vcpuQuota}</code>
                </td>
                <td className={tableStyles.tableTd} data-label="Memory quota">
                  <code className="tenant-admin-quota-project-table__mono">{row.memoryQuota}</code>
                </td>
                <td className={tableStyles.tableTd} data-label="GPU quota">
                  <code className="tenant-admin-quota-project-table__mono">{row.gpuQuota}</code>
                </td>
                <td className={tableStyles.tableTd} data-label="Storage quota">
                  <code className="tenant-admin-quota-project-table__mono">{row.storageQuota}</code>
                </td>
                <td className={tableStyles.tableTd} data-label="Utilization">
                  {row.utilization}
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
                        aria-label={`Actions for ${row.project}`}
                        icon={<EllipsisVIcon />}
                      />
                    )}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="edit"
                        onClick={(e) => {
                          e.preventDefault()
                          setActionsMenuOpenId(null)
                        }}
                      >
                        Edit quotas
                      </DropdownItem>
                      <DropdownItem
                        key="history"
                        onClick={(e) => {
                          e.preventDefault()
                          setActionsMenuOpenId(null)
                        }}
                      >
                        View history
                      </DropdownItem>
                      <DropdownItem
                        key="export"
                        onClick={(e) => {
                          e.preventDefault()
                          setActionsMenuOpenId(null)
                        }}
                      >
                        Export CSV
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
