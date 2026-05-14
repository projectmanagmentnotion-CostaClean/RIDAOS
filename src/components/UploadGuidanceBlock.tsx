import { getUploadGuidanceForEntry } from '../catalog/content/contentSelectors'

type UploadGuidanceBlockProps = {
  entryId: string
  title?: string
}

function UploadGuidanceBlock({
  entryId,
  title = 'Guia de archivo y preparacion',
}: UploadGuidanceBlockProps) {
  const guidance = getUploadGuidanceForEntry(entryId)

  if (!guidance.length) {
    return null
  }

  return (
    <article className="content-card upload-guidance-block">
      <p className="section-label">Archivo</p>
      <h3>{title}</h3>
      <ul className="hint-list">
        {guidance.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

export default UploadGuidanceBlock
