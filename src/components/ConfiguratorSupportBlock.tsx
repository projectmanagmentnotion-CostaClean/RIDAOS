type ConfiguratorSupportSection = {
  label: string
  title: string
  items: string[]
}

type ConfiguratorSupportBlockProps = {
  sections: ConfiguratorSupportSection[]
}

function ConfiguratorSupportBlock({ sections }: ConfiguratorSupportBlockProps) {
  if (sections.length === 0) {
    return null
  }

  return (
    <div className="configurator-support-grid">
      {sections.map((section) => (
        <article className="content-card configurator-support-card" key={`${section.label}-${section.title}`}>
          <p className="section-label">{section.label}</p>
          <h3>{section.title}</h3>
          <ul className="hint-list">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}

export default ConfiguratorSupportBlock
