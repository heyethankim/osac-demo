/** Vertexa Cloud Solutions — masthead wordmark (matches sign-in branding). */
const vertexaMarkSrc = `${import.meta.env.BASE_URL}vertexa-cloud-mark.png`

export function VertexaCloudMastheadLogo() {
  return (
    <div className="vertexa-masthead-brand" role="img" aria-label="Vertexa Cloud Solutions">
      <span className="vertexa-masthead-brand__mark" aria-hidden>
        <img src={vertexaMarkSrc} alt="" className="vertexa-masthead-brand__img" decoding="async" />
      </span>
      <span className="vertexa-masthead-brand__text">
        <span className="vertexa-masthead-brand__line1">Vertexa</span>
        <span className="vertexa-masthead-brand__line2">Cloud Solutions</span>
      </span>
    </div>
  )
}
