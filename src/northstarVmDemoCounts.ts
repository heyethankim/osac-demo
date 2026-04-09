/** Demo VM power-state totals — keep in sync with generated `TENANT_VIRTUAL_MACHINES`. */
export const NORTHSTAR_DEMO_VM_COUNTS = {
  running: 7,
  paused: 1,
  stopped: 3,
} as const

export const NORTHSTAR_DEMO_VM_TOTAL =
  NORTHSTAR_DEMO_VM_COUNTS.running +
  NORTHSTAR_DEMO_VM_COUNTS.paused +
  NORTHSTAR_DEMO_VM_COUNTS.stopped
