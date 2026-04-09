/** Demo hostname shown in the catalog template Overview tab (matches Create VM wizard review). */
export const TEMPLATE_CATALOG_DETAIL_DEMO_HOSTNAME = 'rhel-ai-infer-01'

/** Demo copy shared by template review (Create VM wizard) and catalog template detail drawer. */
export const TEMPLATE_REVIEW_STORAGE_CAPTION =
  'Storage volumes and disks as configured.'

export const TEMPLATE_REVIEW_NETWORK_CAPTION =
  'Network interfaces and policies as configured.'

export const TEMPLATE_REVIEW_SSH_CAPTION = 'SSH keys and access as configured.'

export const TEMPLATE_REVIEW_SCHEDULING_CAPTION =
  'Node selectors and scheduling rules as configured.'

export const TEMPLATE_REVIEW_INITIAL_RUN_CAPTION =
  'First-boot scripts and cloud-init as configured.'

export const TEMPLATE_REVIEW_METADATA_CAPTION =
  'Labels and annotations as configured.'

/** Default switch states shown in template Details (demo). */
export const TEMPLATE_REVIEW_DETAILS_SWITCH_DEFAULTS: {
  headlessMode: boolean
  guestLogAccess: boolean
  deletionProtection: boolean
} = {
  headlessMode: false,
  guestLogAccess: true,
  deletionProtection: true,
}
