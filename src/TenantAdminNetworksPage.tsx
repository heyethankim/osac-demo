import { useMemo } from 'react'
import { Alert, AlertVariant, Label } from '@patternfly/react-core'
import tableStyles from '@patternfly/react-styles/css/components/Table/table'
import type { DemoTenantId } from './demoTenant'
import {
  getTenantAdminNetworkRows,
  type TenantAdminNetworkRow,
  type TenantAdminNetworkStatus,
} from './tenantAdminNetworksDemo'

export type TenantAdminNetworksPageProps = {
  demoTenantId: DemoTenantId
  /** Set from the shell toolbar when the user clicks Request network segment (demo). */
  segmentRequestNotice?: boolean
}

function statusLabelColor(status: TenantAdminNetworkStatus): 'green' | 'blue' | 'orange' | 'red' {
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

/** Tenant admin — network segments directory (demo). Page title and primary action are in the shell toolbar. */
export function TenantAdminNetworksPage({
  demoTenantId,
  segmentRequestNotice = false,
}: TenantAdminNetworksPageProps) {
  const rows = useMemo(() => getTenantAdminNetworkRows(demoTenantId), [demoTenantId])

  return (
    <div className="osac-tenant-admin-page">
      {segmentRequestNotice ? (
        <Alert
          isInline
          variant={AlertVariant.info}
          title="Request recorded (demo)"
          className="tenant-admin-networks-alert"
        >
          In a full product this would open intake or a provider ticket. Nothing is sent from this demo.
        </Alert>
      ) : null}

      <div className="tenant-admin-networks-table-wrap">
        <table
          className={`${tableStyles.table} ${tableStyles.modifiers.striped} tenant-admin-networks-table`}
          aria-label="Network segments"
        >
          <thead className={tableStyles.tableThead}>
            <tr className={tableStyles.tableTr}>
              <th className={tableStyles.tableTh} scope="col">
                Network name
              </th>
              <th className={tableStyles.tableTh} scope="col">
                CIDR
              </th>
              <th className={`${tableStyles.tableTh} ${tableStyles.modifiers.fitContent}`} scope="col">
                VLAN ID
              </th>
              <th className={`${tableStyles.tableTh} ${tableStyles.modifiers.fitContent}`} scope="col">
                Connected VMs
              </th>
              <th className={tableStyles.tableTh} scope="col">
                Gateway
              </th>
              <th className={`${tableStyles.tableTh} ${tableStyles.modifiers.fitContent}`} scope="col">
                Status
              </th>
            </tr>
          </thead>
          <tbody className={tableStyles.tableTbody}>
            {rows.map((row: TenantAdminNetworkRow) => (
              <tr key={row.id} className={tableStyles.tableTr}>
                <td className={tableStyles.tableTd} data-label="Network name">
                  <strong>{row.name}</strong>
                </td>
                <td className={tableStyles.tableTd} data-label="CIDR">
                  <code className="tenant-admin-networks-table__mono">{row.cidr}</code>
                </td>
                <td className={tableStyles.tableTd} data-label="VLAN ID">
                  {row.vlanId}
                </td>
                <td className={tableStyles.tableTd} data-label="Connected VMs">
                  {row.connectedVms}
                </td>
                <td className={tableStyles.tableTd} data-label="Gateway">
                  <code className="tenant-admin-networks-table__mono">{row.gateway}</code>
                </td>
                <td className={tableStyles.tableTd} data-label="Status">
                  <Label color={statusLabelColor(row.status)}>{row.status}</Label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
