import { type FormEvent, useCallback, useEffect, useState } from 'react'
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  TextInput,
} from '@patternfly/react-core'

export type ProviderOnboardTenantModalProps = {
  isOpen: boolean
  onClose: () => void
}

/** Provider admin — onboard tenant organization (demo form; no backend). */
export function ProviderOnboardTenantModal({ isOpen, onClose }: ProviderOnboardTenantModalProps) {
  const [organizationName, setOrganizationName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [vcpuQuota, setVcpuQuota] = useState('')
  const [memoryQuota, setMemoryQuota] = useState('')
  const [storageQuota, setStorageQuota] = useState('')

  const resetForm = useCallback(() => {
    setOrganizationName('')
    setContactEmail('')
    setVcpuQuota('')
    setMemoryQuota('')
    setStorageQuota('')
  }, [])

  useEffect(() => {
    if (!isOpen) resetForm()
  }, [isOpen, resetForm])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      handleClose()
    },
    [handleClose],
  )

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={handleClose}
      ouiaId="provider-onboard-tenant-modal"
    >
      <ModalHeader
        title="Onboard tenant organization"
        labelId="provider-onboard-tenant-modal-title"
      />
      <ModalBody>
        <Form id="provider-onboard-tenant-form" onSubmit={handleSubmit}>
          <FormGroup label="Organization name" fieldId="provider-onboard-org-name" isRequired>
            <TextInput
              id="provider-onboard-org-name"
              value={organizationName}
              onChange={(_e, v) => setOrganizationName(v)}
              aria-label="Organization name"
            />
          </FormGroup>
          <FormGroup label="Contact email" fieldId="provider-onboard-contact-email" isRequired>
            <TextInput
              id="provider-onboard-contact-email"
              type="email"
              value={contactEmail}
              onChange={(_e, v) => setContactEmail(v)}
              aria-label="Contact email"
            />
          </FormGroup>
          <FormGroup label="vCPU quota" fieldId="provider-onboard-vcpu-quota" isRequired>
            <TextInput
              id="provider-onboard-vcpu-quota"
              type="number"
              min={0}
              value={vcpuQuota}
              onChange={(_e, v) => setVcpuQuota(v)}
              aria-label="vCPU quota"
              placeholder="e.g. 400"
            />
          </FormGroup>
          <FormGroup label="Memory quota" fieldId="provider-onboard-memory-quota" isRequired>
            <TextInput
              id="provider-onboard-memory-quota"
              value={memoryQuota}
              onChange={(_e, v) => setMemoryQuota(v)}
              aria-label="Memory quota"
              placeholder="e.g. 2048 GiB"
            />
          </FormGroup>
          <FormGroup label="Storage quota" fieldId="provider-onboard-storage-quota" isRequired>
            <TextInput
              id="provider-onboard-storage-quota"
              value={storageQuota}
              onChange={(_e, v) => setStorageQuota(v)}
              aria-label="Storage quota"
              placeholder="e.g. 120 TB"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button key="cancel" variant="link" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          key="submit"
          variant="primary"
          type="submit"
          form="provider-onboard-tenant-form"
          ouiaId="provider-onboard-tenant-submit"
        >
          Create tenant organization
        </Button>
      </ModalFooter>
    </Modal>
  )
}
