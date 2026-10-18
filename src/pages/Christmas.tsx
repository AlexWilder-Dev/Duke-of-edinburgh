import { useState } from 'react'
import { christmas, contact, kitchen } from '../data/duke'
import { Arch, ExtLink, money, Photo, Star } from '../components/bits'
import { DietFilters, FestiveMenu, type DietFilter } from '../components/Menus'
import { useSheets } from '../lib/sheets'

export function Christmas() {
  const { openChristmas } = useSheets()
  const [filter, setFilter] = useState<DietFilter>('all')
  return (
    <div className="page page--xmas">
      <header className="xhead">
        <Photo name="xmas-banner" className="xhead__banner" sizes="100vw" eager alt="Christmas Time" />
        <div className="wrap xhead__wrap">
          <h1 className="xhead__title">{christmas.headline}</h1>
          <p className="xhead__intro">{christmas.intro}</p>
          <p>{christmas.body}</p>
          <div className="xband__prices">
            <button onClick={() => openChristmas({ courses: 2 })}>
              <b>2 courses</b>
              <span>{money(christmas.prices.two)}</span>
            </button>
            <button onClick={() => openChristmas({ courses: 3 })}>
              <b>3 courses</b>
              <span>{money(christmas.prices.three)}</span>
            </button>
          </div>
          <button className="btn btn--xmasred" onClick={() => openChristmas()}>
            Book your festive do
          </button>
        </div>
      </header>

      <div className="wrap xbody">
        <section className="xmenu" aria-labelledby="xmenu-title">
          <div className="xmenu__head">
            <h2 id="xmenu-title" className="serif-title">
              The festive menu
            </h2>
            <p className="mono">By {kitchen.name}</p>
          </div>
          <DietFilters value={filter} onChange={setFilter} />
          <FestiveMenu filter={filter} />
          <p className="xmenu__foot">
            {kitchen.halal} {kitchen.allergies} <ExtLink href={christmas.pdf}>Menu PDF</ExtLink>
          </p>
        </section>

        <aside className="xside">
          <div className="xside__arches">
            <Arch name="xmas-crackers" sizes="(min-width: 900px) 18vw, 45vw" />
            <Arch name="xmas-salmon" sizes="(min-width: 900px) 18vw, 45vw" />
          </div>
          <div className="xside__card">
            <p className="eyebrow">
              <Star size={11} /> <span>Get those bookings in early</span>
            </p>
            <p>{christmas.sign}</p>
            <p className="xside__closer">{christmas.closer}</p>
            <button className="btn btn--xmas btn--wide" onClick={() => openChristmas()}>
              Party enquiry
            </button>
            <p className="field-hint">
              Taking over the whole place? <a href={`mailto:${contact.hireEmail}`}>{contact.hireEmail}</a>
            </p>
          </div>
          <Photo name="xmas-cheers" className="xside__pic" sizes="(min-width: 900px) 30vw, 100vw" />
        </aside>
      </div>
    </div>
  )
}
