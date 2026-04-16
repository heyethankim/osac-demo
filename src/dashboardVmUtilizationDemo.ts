import type { TenantVirtualMachine } from './TenantVirtualMachinesPage'

export type VmUtilizationPeriod = '24h' | '7d' | '30d' | '90d'

export const VM_UTILIZATION_PERIOD_OPTIONS: { value: VmUtilizationPeriod; label: string }[] = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

export type VmUtilizationRow = {
  label: string
  cpu: number
  memory: number
  gpu: number
  storage: number
}

/** SVG-safe line colors (CSS variables are unreliable on SVG stroke in some browsers). */
export const VM_UTILIZATION_CHART_STROKES = {
  cpu: '#4394e5',
  memory: '#73bcf7',
  /** Teal-green: distinct from forest `storage`; avoids gold/yellow used for warnings. */
  gpu: '#179d7f',
  storage: '#3e8635',
} as const

/** Dark dashboard cards (Recharts SVG; CSS variables are unreliable on strokes). */
export const VM_UTILIZATION_CHART_GRID_STROKE = 'rgba(255, 255, 255, 0.12)'
export const VM_UTILIZATION_CHART_AXIS_TICK = 'rgba(255, 255, 255, 0.55)'

/**
 * Light dashboard cards — use opaque grays so grid/axes stay visible on white cards.
 * (Low-alpha rgba reads as “missing” on some displays / zoom levels.)
 */
export const VM_UTILIZATION_CHART_GRID_STROKE_ON_LIGHT = '#d2d2d2'
export const VM_UTILIZATION_CHART_AXIS_TICK_ON_LIGHT = '#4d4d4d'

export function parseVCpu(spec: string): number {
  const m = spec.match(/(\d+)\s*vCPU/i)
  return m ? parseInt(m[1], 10) : 0
}

export function parseMemoryGiB(spec: string): number {
  const m = spec.match(/(\d+)\s*GiB/i)
  return m ? parseInt(m[1], 10) : 0
}

function hashId(id: string): number {
  let h = 0
  for (let j = 0; j < id.length; j++) {
    h = (h * 31 + id.charCodeAt(j)) | 0
  }
  return Math.abs(h)
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

function vmLikelyHasGpu(vm: TenantVirtualMachine): boolean {
  const n = vm.name.toLowerCase()
  return (
    n.includes('ml') ||
    n.includes('infer') ||
    n.includes('hpc') ||
    n.includes('gpu') ||
    vm.workspace === 'risk-analytics' ||
    parseMemoryGiB(vm.memory) >= 64
  )
}

function storageFootprintGb(vm: TenantVirtualMachine): number {
  return parseVCpu(vm.cpu) * 14 + parseMemoryGiB(vm.memory) * 9
}

function weightedUtilForRunning(
  vms: readonly TenantVirtualMachine[],
  i: number,
  n: number,
  weightFn: (vm: TenantVirtualMachine) => number,
  baseScale: number,
): number {
  const running = vms.filter((v) => v.status === 'running')
  if (running.length === 0) return 0
  const t = n <= 1 ? 0 : i / (n - 1)
  let wSum = 0
  let uSum = 0
  for (const vm of running) {
    const w = weightFn(vm)
    if (w <= 0) continue
    const h = hashId(vm.id)
    const phase = ((h % 628) / 100) * 0.5
    const base = 36 + (h % 20) * baseScale * 0.01
    const swing = 20 + (h % 18)
    const diurnal =
      Math.sin(t * Math.PI * 2 + phase) * 0.55 +
      Math.sin(t * Math.PI * 4 + phase * 0.7) * 0.2
    const u = base + swing * diurnal + (h % 5) * 0.4
    wSum += w
    uSum += w * clamp(u, 4, 97)
  }
  return wSum > 0 ? round1(uSum / wSum) : 0
}

function gpuUtilAt(vms: readonly TenantVirtualMachine[], i: number, n: number): number {
  const gpuVms = vms.filter((v) => v.status === 'running' && vmLikelyHasGpu(v))
  const t = n <= 1 ? 0 : i / (n - 1)
  if (gpuVms.length === 0) {
    return round1(clamp(3 + 4 * Math.sin(t * Math.PI * 2.3 + 0.4), 0, 18))
  }
  let wSum = 0
  let uSum = 0
  for (const vm of gpuVms) {
    const w = parseMemoryGiB(vm.memory) + parseVCpu(vm.cpu) * 2
    const h = hashId(vm.id)
    const phase = ((h % 400) / 100) * 0.8
    const base = 28 + (h % 35)
    const swing = 32 + (h % 25)
    const u = base + swing * Math.sin(t * Math.PI * 2 + phase)
    wSum += w
    uSum += w * clamp(u, 5, 96)
  }
  return wSum > 0 ? round1(uSum / wSum) : 0
}

function storageUtilAt(vms: readonly TenantVirtualMachine[], i: number, n: number): number {
  let provisioned = 0
  for (const vm of vms) {
    provisioned += storageFootprintGb(vm)
  }
  const t = n <= 1 ? 0 : i / (n - 1)
  const seed = provisioned + vms.length * 17
  const base = 40 + (seed % 19)
  const swing = 16 + (seed % 11)
  const u = base + swing * Math.sin(t * Math.PI * 2 + (seed % 40) / 13)
  return round1(clamp(u, 30, 86))
}

function labelsForPeriod(period: VmUtilizationPeriod, n: number): string[] {
  if (period === '24h') {
    return Array.from({ length: n }, (_, i) => `${i}h`)
  }
  if (period === '7d') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return Array.from({ length: n }, (_, i) => days[i % 7])
  }
  if (period === '30d') {
    return Array.from({ length: n }, (_, i) => `${i + 1}`)
  }
  return Array.from({ length: n }, (_, i) => `${i + 1}`)
}

/**
 * Builds time-series rows from the same demo VM inventory as the Virtual machines page.
 * Running VMs drive CPU / memory / GPU (where applicable); storage uses the full fleet footprint.
 */
export function buildVmUtilizationDemoData(
  period: VmUtilizationPeriod,
  vms: readonly TenantVirtualMachine[],
): VmUtilizationRow[] {
  return buildVmUtilizationFromVms(vms, period)
}

export function buildVmUtilizationFromVms(
  vms: readonly TenantVirtualMachine[],
  period: VmUtilizationPeriod,
): VmUtilizationRow[] {
  const meta: Record<VmUtilizationPeriod, number> = {
    '24h': 24,
    '7d': 7,
    '30d': 14,
    '90d': 12,
  }
  const n = meta[period]
  const labels = labelsForPeriod(period, n)

  return labels.map((label, i) => ({
    label,
    cpu: weightedUtilForRunning(vms, i, n, (vm) => parseVCpu(vm.cpu), 1),
    memory: weightedUtilForRunning(vms, i, n, (vm) => parseMemoryGiB(vm.memory), 1.05),
    gpu: gpuUtilAt(vms, i, n),
    storage: storageUtilAt(vms, i, n),
  }))
}

export function periodLabel(period: VmUtilizationPeriod): string {
  return VM_UTILIZATION_PERIOD_OPTIONS.find((o) => o.value === period)?.label ?? period
}
