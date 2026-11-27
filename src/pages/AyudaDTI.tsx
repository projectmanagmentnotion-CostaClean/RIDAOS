import { publicRoutes } from '../lib/navigation'

const questions = [
  {
    question: '¿Qué producto estoy comprando?',
    answer: 'El producto real es DTI Innuro, transfer textil por metro de Ridaos Print BCN. DTF es un término habitual de búsqueda; el artículo y la configuración de compra se identifican como DTI Innuro.',
  },
  {
    question: '¿Cuál es el pedido mínimo y el ancho útil?',
    answer: 'El pedido mínimo es 1 metro lineal y el ancho útil es de 55 cm. DTI Innuro cuesta 15 € por metro, IVA incluido.',
  },
  {
    question: '¿Qué archivos puedo enviar?',
    answer: 'PNG y PDF pasan una validación inicial. AI, PSD, SVG y CDR requieren revisión técnica manual. La aceptación del archivo no sustituye la revisión ni autoriza producción.',
  },
  {
    question: '¿Cuándo se prepara y despacha el pedido?',
    answer: 'Hasta 5 m: 48 horas laborables; más de 5 m y hasta 10 m: 3 días laborables; más de 10 m: plazo bajo consulta. El corte es a las 18:30, hora Europe/Madrid. El transporte se suma al plazo de preparación.',
  },
  {
    question: '¿Cuánto cuesta la entrega?',
    answer: 'El envío peninsular cuesta 5 € IVA incluido. También puedes recoger el pedido en Ridaos Print BCN, Carrer d’Aragó 423, Barcelona.',
  },
  {
    question: '¿Puedo pedir ayuda para adaptar el diseño?',
    answer: 'Sí. La adaptación profesional cuesta 35 €/hora más IVA. Ridaos prepara un presupuesto y debe quedar aprobado antes de cualquier pago por ese trabajo.',
  },
]

function AyudaDTI() {
  return (
    <section className="page premium-page content-readable dti-help-page">
      <div className="page-hero premium-hero">
        <p className="eyebrow">AYUDA · DTI INNURO</p>
        <h1>Respuestas claras antes de preparar tu pedido.</h1>
        <p>Información sobre la compra, los archivos y la preparación del transfer DTI Innuro por metro.</p>
      </div>

      <div className="content-card dti-help-faq" aria-label="Preguntas frecuentes de DTI Innuro">
        {questions.map(({ question, answer }) => (
          <details className="dti-help-faq__item" key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>

      <div className="catalog-cta-row">
        <a className="action-button action-link-button" href={publicRoutes.dtf}>Configurar DTI Innuro</a>
        <a className="action-button action-button-muted action-link-button" href={publicRoutes.contacto}>Contactar con soporte</a>
      </div>
    </section>
  )
}

export default AyudaDTI
