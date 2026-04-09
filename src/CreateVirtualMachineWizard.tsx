import { RedhatIcon } from '@patternfly/react-icons/dist/esm/icons/redhat-icon'
import { WindowsIcon } from '@patternfly/react-icons/dist/esm/icons/windows-icon'
import { LinuxTuxIcon } from './LinuxTuxIcon'
import {
  CATALOG_ICON_TILE_BG,
  catalogIconColor,
  type CatalogIconAccent,
} from './TenantVmTemplatesCatalog'
import {
  Card,
  CardHeader,
  CardTitle,
  Content,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Radio,
  Title,
  Wizard,
  WizardFooter,
  WizardHeader,
  WizardStep,
} from '@patternfly/react-core'

export type GuestOsFamily = 'rhel' | 'windows' | 'other-linux'

export const guestOsTypeOptions: Record<
  GuestOsFamily,
  { value: string; label: string }[]
> = {
  rhel: [
    { value: 'rhel-9-5', label: 'Red Hat Enterprise Linux 9.5' },
    { value: 'rhel-9-4', label: 'Red Hat Enterprise Linux 9.4' },
    { value: 'rhel-8-10', label: 'Red Hat Enterprise Linux 8.10' },
  ],
  windows: [
    { value: 'win-srv-2025', label: 'Microsoft Windows Server 2025' },
    { value: 'win-srv-2022', label: 'Microsoft Windows Server 2022' },
    { value: 'win-11', label: 'Microsoft Windows 11' },
  ],
  'other-linux': [
    { value: 'ubuntu-2404', label: 'Ubuntu 24.04 LTS' },
    { value: 'debian-12', label: 'Debian 12' },
    { value: 'fedora-41', label: 'Fedora 41' },
    { value: 'centos-stream-9', label: 'CentOS Stream 9' },
  ],
}

export function guestOsFamilyCatalogAccent(family: GuestOsFamily): CatalogIconAccent {
  if (family === 'rhel') return 'redhat'
  if (family === 'windows') return 'windows'
  return 'linux'
}

export const guestOsFamilyCards: {
  family: GuestOsFamily
  cardId: string
  inputId: string
  title: string
  description: string
  ariaLabel: string
}[] = [
  {
    family: 'rhel',
    cardId: 'guest-os-rhel-card',
    inputId: 'guest-os-rhel',
    title: 'RHEL',
    description:
      'Red Hat Enterprise Linux for production workloads with long-term support.',
    ariaLabel: 'Select Red Hat Enterprise Linux',
  },
  {
    family: 'windows',
    cardId: 'guest-os-windows-card',
    inputId: 'guest-os-windows',
    title: 'Microsoft Windows',
    description:
      'Windows Server or client images for Microsoft-based applications.',
    ariaLabel: 'Select Microsoft Windows',
  },
  {
    family: 'other-linux',
    cardId: 'guest-os-other-linux-card',
    inputId: 'guest-os-other-linux',
    title: 'Other Linux',
    description:
      'Community and third-party Linux distributions such as Ubuntu or Debian.',
    ariaLabel: 'Select other Linux distribution',
  },
]

export type CreateVirtualMachineWizardProps = {
  wizardKey: number
  guestOsFamily: GuestOsFamily | null
  setGuestOsFamily: (f: GuestOsFamily | null) => void
  guestOsType: string
  setGuestOsType: (t: string) => void
  bootSourceChoice: 'boot-volume' | 'no-boot-source' | null
  setBootSourceChoice: (c: 'boot-volume' | 'no-boot-source' | null) => void
  onClose: () => void
  onSave: () => void
}

export function CreateVirtualMachineWizard({
  wizardKey,
  guestOsFamily,
  setGuestOsFamily,
  guestOsType,
  setGuestOsType,
  bootSourceChoice,
  setBootSourceChoice,
  onClose,
  onSave,
}: CreateVirtualMachineWizardProps) {
  return (
    <Wizard
      key={wizardKey}
      className="osac-create-vm-from-scratch-wizard"
      height="auto"
      style={{ width: '100%' }}
      header={
        <WizardHeader
          title="Create virtual machine"
          titleId="create-vm-scratch-wizard-title"
          onClose={onClose}
          closeButtonAriaLabel="Close wizard"
          isCloseHidden
          description="Configure guest OS, boot source, and resources, then review and create."
          descriptionId="create-vm-scratch-description"
          className="osac-create-vm-from-scratch-wizard__header"
        />
      }
      onClose={onClose}
      onSave={onSave}
      footer={(activeStep, onNext, onBack, onCloseFooter) => (
        <WizardFooter
          className="osac-create-vm-from-scratch-wizard__footer"
          activeStep={activeStep}
          onNext={onNext}
          onBack={onBack}
          onClose={onCloseFooter}
          nextButtonText={
            activeStep?.id === 'review-create'
              ? 'Create virtual machine'
              : 'Next'
          }
          isBackDisabled={activeStep?.index === 1}
          isNextDisabled={
            (activeStep?.id === 'guest-os' &&
              (!guestOsFamily || !guestOsType)) ||
            (activeStep?.id === 'boot-source' && bootSourceChoice === null)
          }
        />
      )}
    >
      <WizardStep id="guest-os" name="Guest operating system">
        <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--pf-t--global--spacer--lg)',
            }}
          >
            <div>
              <Title headingLevel="h3">Guest operating system</Title>
              <Content
                component="p"
                style={{
                  marginTop: 'var(--pf-t--global--spacer--xs)',
                  color: 'var(--pf-t--global--text--color--subtle)',
                }}
              >
                Select the guest operating system to be installed on your
                virtual machine.
              </Content>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                columnGap: 'var(--pf-t--global--spacer--md)',
                rowGap: 'var(--pf-t--global--spacer--md)',
                width: '100%',
              }}
            >
              {guestOsFamilyCards.map(
                ({
                  family,
                  cardId,
                  inputId,
                  title,
                  description,
                  ariaLabel,
                }) => {
                  const accent = guestOsFamilyCatalogAccent(family)
                  const iconColor = catalogIconColor(accent)
                  const isLinuxTux = accent === 'linux'
                  const iconPx = isLinuxTux ? 28 : 24
                  return (
                    <div key={family} style={{ minWidth: 0 }}>
                      <Card
                        id={cardId}
                        isFullHeight
                        isSelectable
                        isSelected={guestOsFamily === family}
                      >
                        <CardHeader
                          selectableActions={{
                            variant: 'single',
                            name: 'guest-os-family',
                            selectableActionId: inputId,
                            selectableActionAriaLabel: ariaLabel,
                            onChange: (_, checked) => {
                              if (checked) {
                                setGuestOsFamily(family)
                                setGuestOsType('')
                              }
                            },
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 'var(--pf-t--global--spacer--md)',
                              width: '100%',
                            }}
                          >
                            <div
                              style={{
                                flexShrink: 0,
                                width: 44,
                                height: 44,
                                borderRadius:
                                  'var(--pf-t--global--border--radius--medium)',
                                backgroundColor: CATALOG_ICON_TILE_BG,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {family === 'rhel' && (
                                <RedhatIcon
                                  aria-hidden
                                  style={{
                                    width: iconPx,
                                    height: iconPx,
                                    flexShrink: 0,
                                    ...(iconColor ? { color: iconColor } : {}),
                                  }}
                                />
                              )}
                              {family === 'windows' && (
                                <WindowsIcon
                                  aria-hidden
                                  style={{
                                    width: iconPx,
                                    height: iconPx,
                                    flexShrink: 0,
                                    ...(iconColor ? { color: iconColor } : {}),
                                  }}
                                />
                              )}
                              {family === 'other-linux' && (
                                <LinuxTuxIcon
                                  aria-hidden
                                  style={{
                                    width: iconPx,
                                    height: iconPx,
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <CardTitle
                                style={{
                                  fontSize:
                                    'var(--pf-t--global--font--size--body--lg)',
                                  marginBottom:
                                    'var(--pf-t--global--spacer--xs)',
                                }}
                              >
                                {title}
                              </CardTitle>
                              <Content
                                component="p"
                                style={{
                                  margin: 0,
                                  color:
                                    'var(--pf-t--global--text--color--subtle)',
                                  fontSize:
                                    'var(--pf-t--global--font--size--body--sm)',
                                }}
                              >
                                {description}
                              </Content>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </div>
                  )
                },
              )}
            </div>
            <Form>
              <FormGroup
                label="Guest operating system type"
                fieldId="guest-os-type"
              >
                <FormSelect
                  id="guest-os-type"
                  value={guestOsType}
                  isDisabled={guestOsFamily === null}
                  onChange={(_, value) => setGuestOsType(value)}
                  aria-label="Guest operating system type"
                >
                  <FormSelectOption
                    value=""
                    label={
                      guestOsFamily === null
                        ? 'Select a guest operating system first'
                        : 'Select a type'
                    }
                    isPlaceholder
                  />
                  {guestOsFamily !== null &&
                    guestOsTypeOptions[guestOsFamily].map((opt) => (
                      <FormSelectOption
                        key={opt.value}
                        value={opt.value}
                        label={opt.label}
                      />
                    ))}
                </FormSelect>
              </FormGroup>
            </Form>
          </div>
      </WizardStep>
      <WizardStep id="boot-source" name="Boot source">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--pf-t--global--spacer--lg)',
          }}
        >
          <div>
            <Title headingLevel="h3" id="boot-source-step-title">
              Boot source
            </Title>
            <Content
              component="p"
              style={{
                marginTop: 'var(--pf-t--global--spacer--xs)',
                color: 'var(--pf-t--global--text--color--subtle)',
              }}
            >
              Choose how the virtual machine will start. You can select a
              bootable disk now or configure storage after creation.
            </Content>
          </div>
          <Form>
            <div
              role="radiogroup"
              aria-labelledby="boot-source-step-title"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--pf-t--global--spacer--md)',
              }}
            >
              <Radio
                id="boot-source-boot-volume"
                name="boot-source-choice"
                isLabelWrapped
                label="Boot volume"
                description={
                  <Content component="p">
                    Start your VM with an existing disk image or volume from
                    your workspace.
                  </Content>
                }
                isChecked={bootSourceChoice === 'boot-volume'}
                onChange={(_, checked) =>
                  checked && setBootSourceChoice('boot-volume')
                }
              />
              <Radio
                id="boot-source-none"
                name="boot-source-choice"
                isLabelWrapped
                label="No boot source"
                description={
                  <Content component="p">
                    Create an empty virtual machine. You can mount an ISO or
                    attach storage during the customization step.
                  </Content>
                }
                isChecked={bootSourceChoice === 'no-boot-source'}
                onChange={(_, checked) =>
                  checked && setBootSourceChoice('no-boot-source')
                }
              />
            </div>
          </Form>
        </div>
      </WizardStep>
      <WizardStep id="compute" name="Compute resources">
        <Content component="p">
          Define CPU, memory, and instance size. (Add your form fields here.)
        </Content>
      </WizardStep>
      <WizardStep id="customization" name="Customization">
        <Content component="p">
          Optional hostname, cloud-init, or other customization. (Add your form
          fields here.)
        </Content>
      </WizardStep>
      <WizardStep id="review-create" name="Review and create">
        <Content component="p">
          Review your choices, then create the virtual machine.
        </Content>
      </WizardStep>
    </Wizard>
  )
}
