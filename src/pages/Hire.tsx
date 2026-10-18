import { building, contact, hire } from '../data/duke'
import { press } from '../data/press'
import { Arch, Chequer, ExtLink, Eyebrow, Photo, Star } from '../components/bits'

const mailto = `mailto:${contact.hireEmail}?subject=${encodeURIComponent(contact.hireSubject)}`

export function Hire() {
  return (
    <div className="page page--hire">
      <header className="hirehead">
        <div className="wrap hirehead__wrap">
          <div>
            <Eyebrow>Private hire & filming</Eyebrow>
            <h1 className="display display--cream">A pub that’s been in character since 1937</h1>
            <p className="hirehead__lede">{hire.line}</p>
            <p>{hire.why}</p>
            <a href={mailto} className="btn btn--cream">
              Enquire: {contact.hireEmail}
            </a>
          </div>
          <div className="hirehead__arches" aria-hidden="true">
            <Arch name="bar-back" sizes="(min-width: 900px) 15vw, 30vw" eager />
            <Arch name="pool-table" sizes="(min-width: 900px) 15vw, 30vw" eager />
            <Arch name="garden-empty-umbrellas" sizes="(min-width: 900px) 15vw, 30vw" eager />
          </div>
        </div>
      </header>

      <section className="rooms wrap" aria-labelledby="rooms-title">
        <h2 id="rooms-title" className="serif-title">
          The rooms, as Sewell drew them
        </h2>
        <p className="rooms__lede">
          The 1937 plan put four rooms and an off sales compartment around one long L-shaped bar. The walls between them have mostly gone, but you can still read the old layout in the doors, the
          screens and the panelling.
        </p>
        <ol className="rooms__list">
          {building.rooms.map((r, i) => (
            <li key={r}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span> {r}
            </li>
          ))}
        </ol>
        <div className="rooms__pics">
          <Photo name="panelled-room" sizes="(min-width: 900px) 33vw, 100vw" />
          <Photo name="saloon-window-tables" sizes="(min-width: 900px) 33vw, 50vw" />
          <Photo name="long-room" sizes="(min-width: 900px) 33vw, 50vw" />
        </div>
      </section>

      <Chequer />

      <section className="history" aria-labelledby="history-title">
        <div className="wrap history__wrap">
          <div className="history__intro">
            <Eyebrow>The building</Eyebrow>
            <h2 id="history-title" className="display">
              {building.built}, by {building.architect}
            </h2>
            <p>{building.summary}</p>
            <p className="history__listed mono">
              {building.listed} · <ExtLink href={building.listEntry}>Historic England list entry 1427801</ExtLink>
            </p>
            <figure className="plaque plaque--oak">
              <blockquote>“{building.listingQuote}”</blockquote>
              <figcaption>Historic England, reasons for listing</figcaption>
            </figure>
            <figure className="plaque plaque--oak">
              <blockquote>“{press.camra.quote}”</blockquote>
              <figcaption>
                <ExtLink href={press.camra.url}>{press.camra.source}</ExtLink>, interior rated two stars
              </figcaption>
            </figure>
          </div>
          <dl className="facts-list">
            {building.facts.map((f) => (
              <div key={f.k} className="panel">
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
            <div className="panel panel--ghost">
              <dt>On the side wall</dt>
              <dd className="ghost">“{building.ghostSign}”</dd>
            </div>
            <div className="panel">
              <dt>In the garden, 1960s</dt>
              <dd>British Movietone filmed roll curling out the back, on what Brixton Buzz later called the first concrete rink in the UK.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="shoot wrap" aria-labelledby="shoot-title">
        <Photo name="exterior" className="shoot__pic" sizes="(min-width: 900px) 30vw, 100vw" />
        <div>
          <h2 id="shoot-title" className="serif-title">
            {hire.headline}
          </h2>
          <p>{hire.ask}</p>
          <ul className="shoot__list">
            <li>
              <Star /> Light oak panelling, leaded windows and a red baize pool table
            </li>
            <li>
              <Star /> One of South London’s biggest pub gardens
            </li>
            <li>
              <Star /> A recognisably London street corner outside
            </li>
          </ul>
          <a href={mailto} className="btn btn--plum">
            Email {contact.hireEmail}
          </a>
          <p className="field-hint">Part of {contact.group}.</p>
        </div>
      </section>
    </div>
  )
}
