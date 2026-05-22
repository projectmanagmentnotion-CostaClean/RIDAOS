type DocumentSignatureBlockProps = {
  block: Extract<import('../types/documents').DocumentBlock, { type: 'signature' }>
}

export function DocumentSignatureBlock({ block }: DocumentSignatureBlockProps) {
  return (
    <section className="document-block">
      <h3>{block.title}</h3>
      <div className="document-signature">
        <span>{block.signerLabel}</span>
        <div className="document-signature-line" aria-hidden="true" />
        {block.note ? <small>{block.note}</small> : null}
      </div>
    </section>
  )
}
