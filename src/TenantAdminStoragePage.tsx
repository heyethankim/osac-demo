import { useMemo } from 'react'
import { Alert, AlertVariant } from '@patternfly/react-core'
import tableStyles from '@patternfly/react-styles/css/components/Table/table'
import type { DemoTenantId } from './demoTenant'
import {
  getTenantAdminStoragePoolRows,
  type TenantAdminStoragePoolRow,
} from './tenantAdminStorageDemo'

export type TenantAdminStoragePageProps = {
  demoTenantId: DemoTenantId
  /** Set from the shell toolbar when the user clicks Request storage expansion (demo). */
  expansionRequestNotice?: boolean
}

/** Tenant admin — storage pools directory (demo). */
export function TenantAdminStoragePage({
  demoTenantId,
  expansionRequestNotice = false,
}: TenantAdminStoragePageProps) {
  const rows = useMemo(() => getTenantAdminStoragePoolRows(demoTenantId), [demoTenantId])

  return (
    <div className="osac-tenant-admin-page">
      {expansionRequestNotice ? (
        <Alert
          isInline
          variant={AlertVariant.info}
          title="Request recorded (demo)"
          className="tenant-admin-storage-alert"
        >
          In a full product this would open intake or a provider ticket. Nothing is sent from this demo.
        </Alert>
      ) : null}

      <div className="tenant-admin-storage-table-wrap">
        <table
          className={`${tableStyles.table} ${tableStyles.modifiers.striped} tenant-admin-storage-table`}
          aria-label="Storage pools"
        >
          <thead className={tableStyles.tableThead}>
            <tr className={tableStyles.tableTr}>
              <th className={tableStyles.tableTh} scope="col">
                Storage pool name
              </th>
              <th className={tableStyles.tableTh} scope="col">
                Type
              </th>
              <th className={tableStyles.tableTh} scope="col">
                Capacity
              </th>
              <th className={tableStyles.tableTh} scope="col">
                Used
              </th>
              <th className={tableStyles.tableTh} scope="col">
                Available
              </th>
              <th className={tableStyles.tableTh} scope="col">
                IOPS
              </th>
              <th className={`${tableStyles.tableTh} ${tableStyles.modifiers.fitContent}`} scope="col">
                Utilization
              </th>
            </tr>
          </thead>
          <tbody className={tableStyles.tableTbody}>
            {rows.map((row: TenantAdminStoragePoolRow) => (
              <tr key={row.id} className={tableStyles.tableTr}>
                <td className={tableStyles.tableTd} data-label="Storage pool name">
                  <strong>{row.name}</strong>
                </td>
                <td className={tableStyles.tableTd} data-label="Type">
                  {row.type}
                </td>
                <td className={tableStyles.tableTd} data-label="Capacity">
                  <code className="tenant-admin-storage-table__mono">{row.capacity}</code>
                </td>
                <td className={tableStyles.tableTd} data-label="Used">
                  <code className="tenant-admin-storage-table__mono">{row.used}</code>
                </td>
                <td className={tableStyles.tableTd} data-label="Available">
                  <code className="tenant-admin-storage-table__mono">{row.available}</code>
                </td>
                <td className={tableStyles.tableTd} data-label="IOPS">
                  <code className="tenant-admin-storage-table__mono">{row.iops}</code>
                </td>
                <td className={tableStyles.tableTd} data-label="Utilization">
                  {row.utilizationPct}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
