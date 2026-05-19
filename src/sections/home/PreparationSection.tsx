import ConversionTrustBlock from '../../components/ConversionTrustBlock'
import UploadGuidanceBlock from '../../components/UploadGuidanceBlock'
import { dtfEntry } from '../../catalog/products/dtf'

function PreparationSection() {
  return (
    <section className="content-section content-grid-two">
      <UploadGuidanceBlock entryId={dtfEntry.id} title="Como preparar el pedido" />
      <ConversionTrustBlock entryId={dtfEntry.id} title="Por que RidaosPrint" />
    </section>
  )
}

export default PreparationSection
