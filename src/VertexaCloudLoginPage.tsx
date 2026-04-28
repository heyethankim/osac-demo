import { useEffect, useLayoutEffect, useState } from 'react'
import { EyeIcon } from '@patternfly/react-icons/dist/esm/icons/eye-icon'
import { EyeSlashIcon } from '@patternfly/react-icons/dist/esm/icons/eye-slash-icon'
import { LockIcon } from '@patternfly/react-icons/dist/esm/icons/lock-icon'
import { UserIcon } from '@patternfly/react-icons/dist/esm/icons/user-icon'
import {
  Button,
  Form,
  FormGroup,
  InputGroup,
  InputGroupItem,
  TextInput,
  Title,
} from '@patternfly/react-core'
import { DEMO_LOGIN_PREFILLED_PASSWORD } from './demoTenant'

/**
 * Reference-style mesh: long continuous strokes, sweeping from corners toward center,
 * plus gentle contours — each path is one unbroken curve (no mid-path gaps).
 */
const VERTEXA_LOGIN_WAVE_STROKES: { d: string; o: number; w: number }[] = [
  {
    d: 'M-200,-120 C180,80 520,340 820,420 C1120,500 1380,380 1720,320 C1820,300 1920,285 2050,270',
    o: 0.14,
    w: 1.15,
  },
  {
    d: 'M-160,40 C220,200 560,420 860,480 C1160,540 1420,420 1760,360 C1860,340 1960,325 2080,305',
    o: 0.1,
    w: 0.95,
  },
  {
    d: 'M-120,200 C260,320 600,520 900,540 C1200,560 1460,460 1800,400 C1900,380 2000,365 2100,345',
    o: 0.08,
    w: 0.85,
  },
  {
    d: 'M1820,1020 C1480,780 1120,560 820,500 C520,440 280,520 -80,580 C-180,600 -260,615 -340,630',
    o: 0.15,
    w: 1.2,
  },
  {
    d: 'M1780,860 C1440,660 1080,480 780,440 C480,400 240,480 -120,540 C-200,555 -280,572 -360,588',
    o: 0.09,
    w: 0.9,
  },
  {
    d: 'M1740,720 C1400,560 1040,400 740,380 C440,360 200,440 -100,500 C-180,518 -260,532 -340,548',
    o: 0.07,
    w: 0.8,
  },
  {
    d: 'M-100,280 C280,220 520,380 800,340 C1080,300 1320,420 1600,360 C1760,330 1880,310 1980,295',
    o: 0.12,
    w: 1.05,
  },
  {
    d: 'M-80,450 C300,380 540,520 820,460 C1100,400 1340,540 1620,480 C1780,450 1900,430 2000,412',
    o: 0.18,
    w: 1.25,
  },
  {
    d: 'M-120,620 C260,540 500,700 780,620 C1060,540 1300,680 1580,600 C1740,565 1860,545 1960,528',
    o: 0.11,
    w: 1,
  },
  {
    d: 'M-60,750 C320,680 560,820 840,720 C1120,620 1360,760 1640,680 C1800,640 1920,615 2020,595',
    o: 0.08,
    w: 0.88,
  },
  { d: 'M320,-100 C380,180 340,420 400,620 C460,820 520,920 580,1020', o: 0.09, w: 0.9 },
  {
    d: 'M1280,-80 C1220,200 1260,440 1180,640 C1100,840 1040,960 980,1060',
    o: 0.1,
    w: 0.95,
  },
  { d: 'M720,-60 C760,200 700,460 780,660 C860,860 920,980 980,1080', o: 0.07, w: 0.82 },
  {
    d: 'M1520,-40 C1460,220 1500,480 1420,680 C1340,880 1280,1000 1220,1100',
    o: 0.08,
    w: 0.88,
  },
  {
    d: 'M-40,-60 C400,200 760,400 1120,520 C1480,640 1720,700 1880,730',
    o: 0.06,
    w: 0.78,
  },
  {
    d: 'M40,980 C420,720 800,520 1180,400 C1560,280 1780,220 1920,195',
    o: 0.13,
    w: 1.1,
  },
  {
    d: 'M-200,520 C200,480 600,580 1000,500 C1400,420 1700,380 1880,355',
    o: 0.1,
    w: 1,
  },
]

function VertexaLoginWaves() {
  return (
    <svg
      className="vertexa-login__waves-svg"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {VERTEXA_LOGIN_WAVE_STROKES.map((s, i) => (
        <path
          key={i}
          fill="none"
          stroke={`rgba(255,255,255,${s.o})`}
          strokeWidth={s.w}
          strokeLinecap="round"
          strokeLinejoin="round"
          d={s.d}
        />
      ))}
    </svg>
  )
}

const vertexaMarkSrc = `${import.meta.env.BASE_URL}vertexa-cloud-mark.png`

export type VertexaCloudLoginPageProps = {
  onLoginSuccess: () => void
  defaultUsername: string
  isLandingPageLoading?: boolean
  onChooseAnotherInstitution?: () => void
}

export function VertexaCloudLoginPage({
  onLoginSuccess,
  defaultUsername,
  isLandingPageLoading = false,
  onChooseAnotherInstitution,
}: VertexaCloudLoginPageProps) {
  const [username, setUsername] = useState(defaultUsername)
  const [password, setPassword] = useState(DEMO_LOGIN_PREFILLED_PASSWORD)
  const [passwordHidden, setPasswordHidden] = useState(true)

  const passwordInput = (
    <TextInput
      id="vx-password"
      name="password"
      type={passwordHidden ? 'password' : 'text'}
      placeholder="Password"
      value={password}
      onChange={(_e, v) => setPassword(v)}
      autoComplete="off"
      validated="default"
      aria-label="Password"
      isDisabled={isLandingPageLoading}
      className="vertexa-login__field-input"
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

  useLayoutEffect(() => {
    setPassword(DEMO_LOGIN_PREFILLED_PASSWORD)
  }, [])

  return (
    <div className="vertexa-login">
      <div className="vertexa-login__ambient" aria-hidden>
        <VertexaLoginWaves />
      </div>

      <div className="vertexa-login__frame">
        <div className="vertexa-login__brand-chip" aria-hidden>
          <img src={vertexaMarkSrc} alt="" className="vertexa-login__brand-img" decoding="async" />
        </div>
        <p className="vertexa-login__company">Vertexa Cloud Solutions</p>

        <p className="vertexa-login__subhead">Provider platform console</p>

        <Title headingLevel="h1" size="2xl" className="vertexa-login__headline">
          Login
        </Title>

        <div className="vertexa-login__surface">
          <Form
            autoComplete="off"
            className="vertexa-login__form"
            onSubmit={(e) => {
              e.preventDefault()
              if (isLandingPageLoading) return
              onLoginSuccess()
            }}
          >
            <FormGroup fieldId="vx-username" className="vertexa-login__field">
              <InputGroup className="vertexa-login__glass-group">
                <InputGroupItem className="vertexa-login__glass-addon">
                  <UserIcon />
                </InputGroupItem>
                <InputGroupItem isFill>
                  <TextInput
                    id="vx-username"
                    name="username"
                    type="email"
                    placeholder="Email address"
                    value={username}
                    onChange={(_e, v) => setUsername(v)}
                    autoComplete="email"
                    validated="default"
                    aria-label="Email address"
                    isDisabled={isLandingPageLoading}
                    className="vertexa-login__field-input"
                  />
                </InputGroupItem>
              </InputGroup>
            </FormGroup>

            <FormGroup fieldId="vx-password" className="vertexa-login__field">
              <InputGroup className="vertexa-login__glass-group">
                <InputGroupItem className="vertexa-login__glass-addon">
                  <LockIcon />
                </InputGroupItem>
                <InputGroupItem isFill>{passwordInput}</InputGroupItem>
                <InputGroupItem>
                  <Button
                    variant="plain"
                    type="button"
                    className="vertexa-login__eye"
                    onClick={() => setPasswordHidden((h) => !h)}
                    aria-label={passwordHidden ? 'Show password' : 'Hide password'}
                    icon={passwordHidden ? <EyeIcon /> : <EyeSlashIcon />}
                    isDisabled={isLandingPageLoading}
                  />
                </InputGroupItem>
              </InputGroup>
            </FormGroup>

            <Button
              type="submit"
              variant="primary"
              isBlock
              className="vertexa-login__submit"
              isDisabled={isLandingPageLoading}
            >
              Login
            </Button>

            {onChooseAnotherInstitution ? (
              <div className="vertexa-login__back-row">
                <Button
                  variant="link"
                  isInline
                  type="button"
                  className="vertexa-login__back-link"
                  onClick={() => onChooseAnotherInstitution()}
                  isDisabled={isLandingPageLoading}
                >
                  Choose another institution
                </Button>
              </div>
            ) : null}
          </Form>
        </div>
      </div>

      {isLandingPageLoading ? (
        <div
          className="vertexa-login__loading-veil"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="vertexa-login__standard-spinner" aria-hidden />
          <p className="vertexa-login__loading-veil__text">Signing in…</p>
        </div>
      ) : null}
    </div>
  )
}
