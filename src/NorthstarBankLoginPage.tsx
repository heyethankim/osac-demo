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
  Title,
} from '@patternfly/react-core'

export type NorthstarBankLoginPageProps = {
  onLoginSuccess: () => void
  /** Pre-filled username / email (tenant user vs tenant admin demo). */
  defaultUsername: string
  isLandingPageLoading?: boolean
  onChooseAnotherInstitution?: () => void
}

export function NorthstarBankLoginPage({
  onLoginSuccess,
  defaultUsername,
  isLandingPageLoading = false,
  onChooseAnotherInstitution,
}: NorthstarBankLoginPageProps) {
  const [username, setUsername] = useState(defaultUsername)
  const [password, setPassword] = useState('')
  const [passwordHidden, setPasswordHidden] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)

  const passwordInput = (
    <TextInput
      id="ns-password"
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
    setUsername(defaultUsername)
  }, [defaultUsername])

  return (
    <div className="northstar-login">
      <div className="northstar-login__bokeh" aria-hidden>
        <span className="northstar-login__bokeh-dot northstar-login__bokeh-dot--a" />
        <span className="northstar-login__bokeh-dot northstar-login__bokeh-dot--b" />
        <span className="northstar-login__bokeh-dot northstar-login__bokeh-dot--c" />
        <span className="northstar-login__bokeh-dot northstar-login__bokeh-dot--d" />
        <span className="northstar-login__bokeh-dot northstar-login__bokeh-dot--e" />
      </div>

      <div className="northstar-login__shell">
        <aside className="northstar-login__brand">
          <div className="northstar-login__brand-top">
            <div className="northstar-login__logo" aria-label="Northstar Bank">
              <span className="northstar-login__logo-line1">Northstar</span>
              <span className="northstar-login__logo-line2">
                <span className="northstar-login__logo-ring" aria-hidden>
                  <svg viewBox="0 0 48 48" className="northstar-login__logo-star">
                    <path
                      fill="currentColor"
                      d="M24 4l4.2 12.9h13.6L32.3 25.8l4.2 12.9L24 33.7l-12.5 5 4.2-12.9L6.2 16.9h13.6L24 4z"
                    />
                  </svg>
                </span>
                <span className="northstar-login__logo-bank">Bank</span>
              </span>
            </div>
            <p className="northstar-login__tagline">
              Smart banking starts here.
            </p>
          </div>
          <div className="northstar-login__brand-bottom">
            <p className="northstar-login__support">
              For support, contact{' '}
              <a href="mailto:support@northstarbank.com">support@northstarbank.com</a>
            </p>
            <p className="northstar-login__copyright">© 2026 Northstar Bank. All rights reserved.</p>
          </div>
        </aside>

        <main className="northstar-login__panel">
          <Card className="northstar-login__card" isCompact={false}>
            <CardBody>
              <Title headingLevel="h1" size="2xl" className="northstar-login__card-title">
                Login
              </Title>
              <p className="northstar-login__card-subtitle">
                Enter your credentials to access your account.
              </p>

              <Form
                className="northstar-login__form"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (isLandingPageLoading) return
                  onLoginSuccess()
                }}
              >
                <FormGroup fieldId="ns-username" className="northstar-login__field">
                  <TextInput
                    id="ns-username"
                    name="username"
                    type="email"
                    placeholder="Email address"
                    value={username}
                    onChange={(_e, v) => setUsername(v)}
                    autoComplete="email"
                    validated="default"
                    aria-label="Email address"
                    isDisabled={isLandingPageLoading}
                  />
                </FormGroup>
                <FormGroup fieldId="ns-password" className="northstar-login__field">
                  <InputGroup className="northstar-login__password-group">
                    <InputGroupItem isFill>{passwordInput}</InputGroupItem>
                    <InputGroupItem>
                      <Button
                        variant="control"
                        type="button"
                        className="northstar-login__password-toggle"
                        onClick={() => setPasswordHidden((h) => !h)}
                        aria-label={passwordHidden ? 'Show password' : 'Hide password'}
                        icon={passwordHidden ? <EyeIcon /> : <EyeSlashIcon />}
                        isDisabled={isLandingPageLoading}
                      />
                    </InputGroupItem>
                  </InputGroup>
                </FormGroup>

                <div className="northstar-login__form-row">
                  <Checkbox
                    id="ns-remember"
                    label="Remember me?"
                    isChecked={rememberMe}
                    onChange={(_e, checked) => setRememberMe(checked)}
                    isDisabled={isLandingPageLoading}
                  />
                  <Button
                    variant="link"
                    isInline
                    type="button"
                    className="northstar-login__forgot-link"
                    onClick={(e) => e.preventDefault()}
                    isDisabled={isLandingPageLoading}
                  >
                    Forgot password
                  </Button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  isBlock
                  className="northstar-login__submit"
                  isDisabled={isLandingPageLoading}
                >
                  Login
                </Button>
                {onChooseAnotherInstitution ? (
                  <div className="northstar-login__back-row">
                    <Button
                      variant="link"
                      isInline
                      type="button"
                      className="northstar-login__back-link"
                      onClick={() => onChooseAnotherInstitution()}
                      isDisabled={isLandingPageLoading}
                    >
                      Choose another institution
                    </Button>
                  </div>
                ) : null}
              </Form>
            </CardBody>
            {isLandingPageLoading ? (
              <div
                className="northstar-login__landing-overlay"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <Spinner
                  size="lg"
                  aria-label="Loading"
                  aria-valuetext="Loading the landing page"
                />
                <p className="northstar-login__landing-overlay-text">
                  Loading the landing page…
                </p>
              </div>
            ) : null}
          </Card>
        </main>
      </div>
    </div>
  )
}
