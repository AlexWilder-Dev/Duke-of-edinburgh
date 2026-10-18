import { useState } from 'react'
import { deals, foodMenu, kitchen, sundayMenu, sundayRoast, type DayIndex } from '../data/duke'
import { ExtLink, Photo } from '../components/bits'
import { HoursTable } from '../components/HoursTable'
import { DietFilters, FestiveMenu, MenuList, type DietFilter } from '../components/Menus'
import { useClock } from '../lib/clock'
import { useSheets } from '../lib/sheets'
import { liveState, sessionOf, spanText } from '../lib/time'

type Tab = 'everyday' | 'sunday' | 'christmas'

const OFFER_DAYS: [DayIndex, string][] = [
  [1, 'Monday'],
  [2, 'Tuesday'],
  [3, 'Wednesday'],
]

export function Food() {
  const { now } = useClock()
  const { openBooking, openChristmas } = useSheets()
  const s = sessionOf(now)
  const live = liveState(now)
  const [tab, setTab] = useState<Tab>(s.dow === 0 ? 'sunday' : 'everyday')
  const [filter, setFilter] = useState<DietFilter>('all')
  const weekendNow = s.dow === 5 || s.dow === 6 || s.dow === 0

  return (
    <div className="page page--food">
      <header className="foodhead">
        <div className="wrap foodhead__wrap">
          <div>
            <p className="jv__badge">
              The <b>Jerk Valley</b> of London
            </p>
            <h1 className="foodhead__title">Menu</h1>
            <p className="foodhead__lede">
              Kitchen residents since {kitchen.since}: their signature jerk chicken and Caribbean flavours, the perfect accompaniment to a crisp pint.
            </p>
            <p className={`foodhead__live mono ${live.kitchen.open ? 'is-open' : ''}`}>
              <i aria-hidden="true" /> {live.kitchen.text}
            </p>
          </div>
          <Photo name="jv-jerk-fries" className="foodhead__pic" sizes="(min-width: 900px) 30vw, 70vw" eager />
        </div>
      </header>

      <div className="wrap">
        <div className="halal-banner">
          <span className="halal-roundel" aria-hidden="true">
            <b>حلال</b>
            <small>HALAL</small>
          </span>
          <p>
            <b>All our meats are halal.</b> Ask a member of staff for more information. For allergies, please speak to the bar staff.
          </p>
        </div>

        <section aria-labelledby="offers-title" className="foodoffers">
          <h2 id="offers-title" className="foodoffers__title">
            In the week
          </h2>
          <ol className="offers offers--wide">
            {OFFER_DAYS.map(([d, name]) => {
              const deal = deals[d]!.find((x) => x.kind === 'kitchen')!
              return (
                <li key={d} className={`offer offer--${d} ${s.dow === d ? 'is-today' : ''}`}>
                  <span className="offer__day">
                    {name}
                    {s.dow === d ? ' · today' : ''}
                  </span>
                  <b className="offer__what">{deal.title}</b>
                  {deal.small && <small>{deal.small}</small>}
                </li>
              )
            })}
          </ol>
        </section>

        <div className="menubar">
          <div className="tabs" role="tablist" aria-label="Which menu">
            {(
              [
                ['everyday', 'Every day'],
                ['sunday', 'Sunday'],
                ['christmas', 'Christmas'],
              ] as [Tab, string][]
            ).map(([t, label]) => (
              <button key={t} role="tab" aria-selected={tab === t} aria-controls="menu-panel" className={`tab ${tab === t ? 'is-on' : ''}`} onClick={() => setTab(t)}>
                {label}
              </button>
            ))}
          </div>
          <DietFilters value={filter} onChange={setFilter} />
        </div>

        <div id="menu-panel" role="tabpanel" className="menupanel">
          {tab === 'everyday' && (
            <>
              <p className="menupanel__note">
                Served whenever the kitchen’s open, with weekend specials Friday to Sunday.{' '}
                <ExtLink href={kitchen.pdfs.menu}>PDF version</ExtLink>
              </p>
              <MenuList sections={foodMenu} filter={filter} weekendNow={weekendNow} />
            </>
          )}
          {tab === 'sunday' && (
            <>
              <p className="menupanel__note">
                {sundayRoast.season}, {spanText(sundayRoast.span)}. {sundayRoast.note} {kitchen.veganOption}{' '}
                <ExtLink href={kitchen.pdfs.sunday}>PDF version</ExtLink>
              </p>
              <MenuList sections={sundayMenu} filter={filter} />
              <button className="btn btn--black" onClick={() => openBooking({ occasion: 'Sunday roast' })}>
                Book a Sunday table
              </button>
            </>
          )}
          {tab === 'christmas' && (
            <>
              <p className="menupanel__note">The Jerk Valley festive menu for Christmas parties.</p>
              <FestiveMenu filter={filter} />
              <button className="btn btn--xmasred" onClick={() => openChristmas()}>
                Book your festive do
              </button>
            </>
          )}
        </div>

        <div className="foodpics">
          <Photo name="jv-wings" sizes="(min-width: 900px) 25vw, 50vw" />
          <Photo name="jv-wrap" sizes="(min-width: 900px) 25vw, 50vw" />
          <Photo name="jv-burger" sizes="(min-width: 900px) 25vw, 50vw" />
          <Photo name="jv-jerk-cocktail" sizes="(min-width: 900px) 25vw, 50vw" />
        </div>

        <section className="kitchenhours" aria-labelledby="kh-title">
          <h2 id="kh-title" className="foodoffers__title">
            Kitchen hours
          </h2>
          <HoursTable kitchen />
        </section>
      </div>
    </div>
  )
}
