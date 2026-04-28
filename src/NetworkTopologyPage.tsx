import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Button, Content, Label } from '@patternfly/react-core'
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import NetworkIcon from '@patternfly/react-icons/dist/esm/icons/network-icon'
import ShieldAltIcon from '@patternfly/react-icons/dist/esm/icons/shield-alt-icon'
import type { TenantVirtualMachine, VmPowerState } from './TenantVirtualMachinesPage'

export type NetworkTopologyPageProps = {
  vms: TenantVirtualMachine[]
  onOpenVirtualMachineDetail: (vmId: string) => void
}

const MAX_VISIBLE_NETWORKS = 7
const MAX_VMS_PER_NETWORK = 5

const FIREWALL_RULES = [
  'Allow east-west tenant traffic',
  'Deny inbound from internet',
  'Permit management plane probes',
] as const

type WorkspaceGroup = {
  key: string
  label: string
  vms: TenantVirtualMachine[]
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h >>> 0
}

function extractPrimaryIp(summary: string, vmId: string): string {
  const m = summary.match(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/)
  if (m) return m[1]
  const h = hashString(vmId)
  const second = (h % 200) + 1
  const third = ((h >> 9) % 250) + 1
  const fourth = ((h >> 18) % 250) + 1
  return `10.${second}.${third}.${fourth}`
}

function workspaceToCidr(workspace: string): string {
  const n = hashString(workspace) % 200
  return `10.${n + 1}.0.0/16`
}

function formatWorkspaceLabel(workspace: string): string {
  return workspace
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function groupWorkspaces(vms: readonly TenantVirtualMachine[]): WorkspaceGroup[] {
  const map = new Map<string, TenantVirtualMachine[]>()
  for (const vm of vms) {
    const list = map.get(vm.workspace) ?? []
    list.push(vm)
    map.set(vm.workspace, list)
  }
  let entries = [...map.entries()].map(([workspace, list]) => ({
    key: workspace,
    label: formatWorkspaceLabel(workspace),
    vms: list,
  }))
  entries.sort((a, b) => b.vms.length - a.vms.length)

  if (entries.length <= MAX_VISIBLE_NETWORKS) return entries

  const head = entries.slice(0, MAX_VISIBLE_NETWORKS - 1)
  const tail = entries.slice(MAX_VISIBLE_NETWORKS - 1)
  const merged = tail.flatMap((e) => e.vms)
  return [
    ...head,
    {
      key: '__other__',
      label: `Other workspaces (${tail.length})`,
      vms: merged,
    },
  ]
}

function vmStatusLabel(status: VmPowerState): string {
  switch (status) {
    case 'running':
      return 'Running'
    case 'paused':
      return 'Paused'
    case 'stopped':
      return 'Stopped'
    default:
      return status
  }
}

function truncateMiddle(s: string, max: number): string {
  if (s.length <= max) return s
  const keep = max - 3
  const a = Math.ceil(keep / 2)
  const b = Math.floor(keep / 2)
  return `${s.slice(0, a)}…${s.slice(s.length - b)}`
}

type Segment = { key: string; x1: number; y1: number; x2: number; y2: number }

type GraphGeom = { w: number; h: number; segments: Segment[] }

export function NetworkTopologyPage({
  vms,
  onOpenVirtualMachineDetail,
}: NetworkTopologyPageProps) {
  const groups = useMemo(() => groupWorkspaces(vms), [vms])
  const split = useMemo(() => {
    const mid = Math.ceil(groups.length / 2)
    return { top: groups.slice(0, mid), bottom: groups.slice(mid) }
  }, [groups])

  const graphRef = useRef<HTMLDivElement>(null)
  const firewallRef = useRef<HTMLDivElement>(null)
  const vnetRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const [geom, setGeom] = useState<GraphGeom>({ w: 0, h: 0, segments: [] })

  const setVnetRef = useCallback((key: string) => (el: HTMLDivElement | null) => {
    if (el) vnetRefs.current.set(key, el)
    else vnetRefs.current.delete(key)
  }, [])

  const measure = useCallback(() => {
    const root = graphRef.current
    const fw = firewallRef.current
    if (!root || !fw) {
      setGeom((g) => ({ ...g, segments: [] }))
      return
    }
    const cr = root.getBoundingClientRect()
    const w = cr.width
    const h = cr.height
    const fr = fw.getBoundingClientRect()
    const fcx = fr.left + fr.width / 2 - cr.left
    const ftop = fr.top - cr.top
    const fbot = fr.bottom - cr.top

    const segments: Segment[] = []
    for (const g of split.top) {
      const el = vnetRefs.current.get(g.key)
      if (!el) continue
      const vr = el.getBoundingClientRect()
      const vx = vr.left + vr.width / 2 - cr.left
      segments.push({
        key: `${g.key}-down`,
        x1: vx,
        y1: vr.bottom - cr.top,
        x2: fcx,
        y2: ftop,
      })
    }
    for (const g of split.bottom) {
      const el = vnetRefs.current.get(g.key)
      if (!el) continue
      const vr = el.getBoundingClientRect()
      const vx = vr.left + vr.width / 2 - cr.left
      segments.push({
        key: `${g.key}-up`,
        x1: vx,
        y1: vr.top - cr.top,
        x2: fcx,
        y2: fbot,
      })
    }
    setGeom({ w, h, segments })
  }, [split.bottom, split.top])

  useLayoutEffect(() => {
    measure()
    const root = graphRef.current
    if (!root) return undefined
    const ro = new ResizeObserver(() => measure())
    ro.observe(root)
    return () => ro.disconnect()
  }, [measure, groups, vms.length])

  const renderVnetCard = (g: WorkspaceGroup) => {
    const cidr = g.key === '__other__' ? 'Multiple /16 ranges' : workspaceToCidr(g.key)
    const shown = g.vms.slice(0, MAX_VMS_PER_NETWORK)
    const extra = g.vms.length - shown.length

    return (
      <div
        key={g.key}
        ref={setVnetRef(g.key)}
        className="osac-topology-graph__vnet-host"
      >
        <div className="osac-topology-graph__vnet-dashed">
          <div className="osac-topology-graph__vnet-head">
            <span className="osac-topology-graph__type-badge" aria-hidden>
              N
            </span>
            <NetworkIcon className="osac-topology-graph__vnet-net-icon" aria-hidden />
            <span className="osac-topology-graph__vnet-title" title={g.label}>
              {truncateMiddle(g.label, 22)}
            </span>
            <Label isCompact color="blue">
              VNet
            </Label>
            <Button
              variant="plain"
              aria-label={`More actions for ${g.label}`}
              icon={<EllipsisVIcon />}
              onClick={(e) => e.preventDefault()}
            />
          </div>
          <div className="osac-topology-graph__vnet-meta">
            <span className="osac-topology-graph__vnet-cidr">{cidr}</span>
            <span className="osac-topology-graph__vnet-count">
              {g.vms.length} VM{g.vms.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="osac-topology-graph__vm-list">
            {shown.map((vm) => {
              const Icon = vm.Icon
              const ip = extractPrimaryIp(vm.networkSummary, vm.id)
              return (
                <div key={vm.id} className="osac-topology-graph__vm-column">
                  <div
                    className={`osac-topology-graph__vm-orbit osac-topology-graph__vm-orbit--${vm.status}`}
                  >
                    <span
                      className={`osac-topology-graph__vm-orbit-icon-wrap osac-topology-graph__vm-orbit-icon-wrap--${vm.iconAccent}`}
                    >
                      <Icon aria-hidden className="osac-topology-graph__vm-orbit-icon" />
                    </span>
                  </div>
                  <div className="osac-topology-graph__pill">
                    <span className="osac-topology-graph__type-badge" aria-hidden>
                      V
                    </span>
                    <Button
                      variant="link"
                      isInline
                      className="osac-topology-graph__pill-name"
                      onClick={() => onOpenVirtualMachineDetail(vm.id)}
                    >
                      {truncateMiddle(vm.name, 20)}
                    </Button>
                    <Button
                      variant="plain"
                      aria-label={`Actions for ${vm.name}`}
                      icon={<EllipsisVIcon />}
                      onClick={(e) => e.preventDefault()}
                    />
                  </div>
                  <div className="osac-topology-graph__ip-row">
                    <Label isCompact color="grey">
                      IP
                    </Label>
                    <span className="osac-topology-graph__ip-addr" title={ip}>
                      {ip}
                    </span>
                    <Label isCompact color={vm.status === 'running' ? 'green' : vm.status === 'paused' ? 'orange' : 'grey'}>
                      {vmStatusLabel(vm.status)}
                    </Label>
                  </div>
                </div>
              )
            })}
            {extra > 0 ? (
              <Content
                component="p"
                className="osac-topology-graph__vm-more"
              >
                +{extra} more in this network (see My VMs list)
              </Content>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="osac-network-topology">
      <div className="osac-network-topology__canvas">
        {vms.length === 0 ? (
          <Content
            component="p"
            style={{
              margin: 'var(--pf-t--global--spacer--lg)',
              color: 'var(--pf-t--global--text--color--subtle)',
            }}
          >
            No virtual machines in inventory — provision instances to see them on the topology.
          </Content>
        ) : (
          <div ref={graphRef} className="osac-topology-graph">
            {geom.w > 0 && geom.h > 0 ? (
              <svg
                className="osac-topology-graph__svg"
                width={geom.w}
                height={geom.h}
                aria-hidden
              >
                {geom.segments.map((s) => (
                  <line
                    key={s.key}
                    x1={s.x1}
                    y1={s.y1}
                    x2={s.x2}
                    y2={s.y2}
                    className="osac-topology-graph__edge"
                  />
                ))}
              </svg>
            ) : null}

            <div className="osac-topology-graph__body">
              <div className="osac-topology-graph__row">{split.top.map(renderVnetCard)}</div>

              <div ref={firewallRef} className="osac-topology-graph__firewall">
                <div className="osac-topology-graph__firewall-orbit">
                  <ShieldAltIcon aria-hidden className="osac-topology-graph__firewall-icon" />
                </div>
                <div className="osac-topology-graph__pill osac-topology-graph__pill--fw">
                  <span
                    className="osac-topology-graph__type-badge osac-topology-graph__type-badge--firewall"
                    aria-hidden
                  >
                    F
                  </span>
                  <span className="osac-topology-graph__fw-title">Internal firewall</span>
                  <Button
                    variant="plain"
                    aria-label="Firewall actions"
                    icon={<EllipsisVIcon />}
                    onClick={(e) => e.preventDefault()}
                  />
                </div>
                <ul className="osac-topology-graph__fw-rules">
                  {FIREWALL_RULES.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="osac-topology-graph__row">{split.bottom.map(renderVnetCard)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
