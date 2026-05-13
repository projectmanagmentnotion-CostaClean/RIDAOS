import CommercialNoticeGroup from './CommercialNoticeGroup'

type CommercialNoticeProps = {
  title?: string
  items?: readonly string[]
  className?: string
}

function CommercialNotice({
  title = 'Condiciones comerciales',
  items,
  className = '',
}: CommercialNoticeProps) {
  return <CommercialNoticeGroup className={className} items={items} title={title} />
}

export default CommercialNotice
