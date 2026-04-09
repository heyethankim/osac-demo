import { TENANT_VIRTUAL_MACHINES, type TenantVirtualMachine } from './TenantVirtualMachinesPage'
import {
  parseMemoryGiB,
  parseVCpu,
  VM_UTILIZATION_CHART_STROKES,
} from './dashboardVmUtilizationDemo'

/** Synthetic provisioned footprint (same scale as utilization demo storage math). */
function storageFootprintGiB(vm: TenantVirtualMachine): number {
  return parseVCpu(vm.cpu) * 14 + parseMemoryGiB(vm.memory) * 9
}

function vmAllocatesGpu(vm: TenantVirtualMachine): boolean {
  const n = vm.name.toLowerCase()
  return (
    n.includes('ml') ||
    n.includes('infer') ||
    n.includes('hpc') ||
    n.includes('gpu') ||
    vm.workspace === 'model-serving' ||
    vm.workspace === 'research-hpc'
  )
}

function niceQuotaLimit(used: number, step: number, targetFraction = 0.68): number {
  if (used <= 0) return step
  const raw = used / targetFraction
  return Math.max(Math.ceil(raw / step) * step, Math.ceil(used))
}

export type VmQuotaMetricKey = 'cpu' | 'memory' | 'gpu' | 'storage'

export type VmQuotaMetric = {
  key: VmQuotaMetricKey
  title: string
  used: number
  limit: number
  unit: string
  stroke: string
  formatUsed: (n: number) => string
  formatLimit: (n: number) => string
}

function aggregateFleet(): {
  vCpu: number
  memoryGiB: number
  gpuDevices: number
  storageGiB: number
} {
  let vCpu = 0
  let memoryGiB = 0
  let gpuDevices = 0
  let storageGiB = 0
  for (const vm of TENANT_VIRTUAL_MACHINES) {
    vCpu += parseVCpu(vm.cpu)
    memoryGiB += parseMemoryGiB(vm.memory)
    if (vmAllocatesGpu(vm)) gpuDevices += 1
    storageGiB += storageFootprintGiB(vm)
  }
  return { vCpu, memoryGiB, gpuDevices, storageGiB }
}

/**
 * Demo tenant caps vs summed allocation from `TENANT_VIRTUAL_MACHINES`.
 * Limits are rounded so typical utilization lands around ~two-thirds of quota.
 */
export function buildDashboardVmQuotaMetrics(): VmQuotaMetric[] {
  const { vCpu, memoryGiB, gpuDevices, storageGiB } = aggregateFleet()
  const storageTiB = storageGiB / 1024

  const cpuLimit = niceQuotaLimit(vCpu, 8)
  const memLimit = niceQuotaLimit(memoryGiB, 64)
  const gpuLimit = Math.max(4, niceQuotaLimit(gpuDevices, 1))
  const storageLimitTiB = niceQuotaLimit(storageTiB, 2)

  return [
    {
      key: 'cpu',
      title: 'CPU',
      used: vCpu,
      limit: cpuLimit,
      unit: 'cores',
      stroke: VM_UTILIZATION_CHART_STROKES.cpu,
      formatUsed: (n) => String(Math.round(n)),
      formatLimit: (n) => String(Math.round(n)),
    },
    {
      key: 'memory',
      title: 'Memory',
      used: memoryGiB,
      limit: memLimit,
      unit: 'GiB',
      stroke: VM_UTILIZATION_CHART_STROKES.memory,
      formatUsed: (n) => String(Math.round(n)),
      formatLimit: (n) => String(Math.round(n)),
    },
    {
      key: 'gpu',
      title: 'GPU',
      used: gpuDevices,
      limit: gpuLimit,
      unit: 'devices',
      stroke: VM_UTILIZATION_CHART_STROKES.gpu,
      formatUsed: (n) => String(Math.round(n)),
      formatLimit: (n) => String(Math.round(n)),
    },
    {
      key: 'storage',
      title: 'Storage',
      used: storageTiB,
      limit: storageLimitTiB,
      unit: 'TiB',
      stroke: VM_UTILIZATION_CHART_STROKES.storage,
      formatUsed: (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1)),
      formatLimit: (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1)),
    },
  ]
}
