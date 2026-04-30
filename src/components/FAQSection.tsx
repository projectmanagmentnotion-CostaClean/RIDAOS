type FAQItem = {
  question: string
  answer: string
}

type FAQSectionProps = {
  items: FAQItem[]
}

function FAQSection({ items }: FAQSectionProps) {
  return (
    <div className="faq-grid" data-animate="reveal">
      {items.map((item) => (
        <article className="content-card faq-card hover-lift" data-animate="panel" key={item.question}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </article>
      ))}
    </div>
  )
}

export default FAQSection
