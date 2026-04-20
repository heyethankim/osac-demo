import { useEffect, useState } from 'react'
import { EyeIcon } from '@patternfly/react-icons/dist/esm/icons/eye-icon'
import { EyeSlashIcon } from '@patternfly/react-icons/dist/esm/icons/eye-slash-icon'
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Form,
  FormGroup,
  InputGroup,
  InputGroupItem,
  Spinner,
  TextInput,
} from '@patternfly/react-core'
import { BluestoneMarkIcon } from './BluestoneMarkIcon'

const BLUESTONE_LOGIN_ILLUSTRATION_SRC = `${import.meta.env.BASE_URL}bluestone-login-illustration.png`

export type EvergreenFinancialGroupLoginPageProps = {
  onLoginSuccess: () => void
  /** Pre-filled email (tenant user vs tenant admin demo). */
  defaultEmail: string
  isLandingPageLoading?: boolean
  onChooseAnotherInstitution?: () => void
}

export function EvergreenFinancialGroupLoginPage({
  onLoginSuccess,
  defaultEmail,
  isLandingPageLoading = false,
  onChooseAnotherInstitution,
}: EvergreenFinancialGroupLoginPageProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState('')
  const [passwordHidden, setPasswordHidden] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)

  const passwordInput = (
    <TextInput
      id="efg-password"
      name="password"
      type={passwordHidden ? 'password' : 'text'}
      placeholder="Password"
      value={password}
      onChange={(_e, v) => setPassword(v)}
      autoComplete="current-password"
      validated="default"
      aria-label="Password"
      isDisabled={isLandingPageLoading}
    />
  )

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    setEmail(defaultEmail)
  }, [defaultEmail])

  return (
    <div className="evergreen-login">
      <div className="evergreen-login__bg" aria-hidden>
        <span className="evergreen-login__arc evergreen-login__arc--a" />
        <span className="evergreen-login__arc evergreen-login__arc--b" />
        <span className="evergreen-login__arc evergreen-login__arc--c" />
      </div>

      <div className="evergreen-login__frame">
        <Card className="evergreen-login__split-card" isCompact={false}>
          <CardBody className="evergreen-login__split-body">
            <div className="evergreen-login__left">
              <div className="evergreen-login__brand" aria-label="Bluestone Financial Group">
                <span className="evergreen-login__brand-mark" aria-hidden>
                  <BluestoneMarkIcon className="evergreen-login__brand-logo-img" />
                </span>
                <span className="evergreen-login__brand-wordstack">
                  <span className="evergreen-login__brand-word">Bluestone</span>
                  <span className="evergreen-login__brand-subword">Financial Group</span>
                </span>
              </div>

              <h1 className="evergreen-login__headline">
                Technology driving outcomes for wealth and institutional clients
              </h1>
              <p className="evergreen-login__subhead">Welcome back! Please login to your account.</p>

              <Form
                className="evergreen-login__form"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (isLandingPageLoading) return
                  onLoginSuccess()
                }}
              >
                <FormGroup fieldId="efg-email" className="evergreen-login__field">
                  <TextInput
                    id="efg-email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(_e, v) => setEmail(v)}
                    autoComplete="email"
                    validated="default"
                    aria-label="Email address"
                    isDisabled={isLandingPageLoading}
                  />
                </FormGroup>
                <FormGroup fieldId="efg-password" className="evergreen-login__field">
                  <InputGroup className="evergreen-login__password-group">
                    <InputGroupItem isFill>{passwordInput}</InputGroupItem>
                    <InputGroupItem>
                      <Button
                        variant="control"
                        type="button"
                        className="evergreen-login__password-toggle"
                        onClick={() => setPasswordHidden((h) => !h)}
                        aria-label={passwordHidden ? 'Show password' : 'Hide password'}
                        icon={passwordHidden ? <EyeIcon /> : <EyeSlashIcon />}
                        isDisabled={isLandingPageLoading}
                      />
                    </InputGroupItem>
                  </InputGroup>
                </FormGroup>

                <div className="evergreen-login__form-row">
                  <Checkbox
                    id="efg-remember"
                    label="Remember me"
                    isChecked={rememberMe}
                    onChange={(_e, checked) => setRememberMe(checked)}
                    isDisabled={isLandingPageLoading}
                  />
                  <Button
                    variant="link"
                    isInline
                    type="button"
                    className="evergreen-login__forgot-link"
                    onClick={(e) => e.preventDefault()}
                    isDisabled={isLandingPageLoading}
                  >
                    Forgot password?
                  </Button>
                </div>

                <div className="evergreen-login__actions">
                  <Button
                    type="submit"
                    variant="primary"
                    className="evergreen-login__btn-primary"
                    isDisabled={isLandingPageLoading}
                  >
                    Login
                  </Button>
                </div>

                {onChooseAnotherInstitution ? (
                  <div className="evergreen-login__back-row">
                    <Button
                      variant="link"
                      isInline
                      type="button"
                      onClick={() => onChooseAnotherInstitution()}
                      isDisabled={isLandingPageLoading}
                    >
                      Choose another institution
                    </Button>
                  </div>
                ) : null}
              </Form>
            </div>

            <div className="evergreen-login__right">
              <div className="evergreen-login__illustration">
                <img
                  src={BLUESTONE_LOGIN_ILLUSTRATION_SRC}
                  alt=""
                  className="evergreen-login__illustration-img"
                  width={495}
                  height={264}
                  draggable={false}
                />
              </div>
            </div>
          </CardBody>
          {isLandingPageLoading ? (
            <div
              className="evergreen-login__landing-overlay"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <Spinner size="lg" aria-label="Loading" aria-valuetext="Loading the landing page" />
              <p className="evergreen-login__landing-overlay-text">Loading the landing page…</p>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
