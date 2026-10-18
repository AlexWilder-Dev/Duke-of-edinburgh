import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion'
import { useMemo, useState, type KeyboardEvent } from 'react'
import { christmas, DAY_NAMES, DAY_SHORT, foodMenu, happyHour, saturdayDJs, sundayRoast, weekendSpecials } from '../data/duke'
import type { PhotoKey } from '../data/photos'
import { useClock } from '../lib/clock'
import { useSheets } from '../lib/sheets'
import {
  addDays,
  clock,
  dateLabel,
  isoDate,
  koToMin,
  liveState,
  planFor,
  sessionOf,
  spanText,
  within,
  type DayPlan,
} from '../lib/time'
import { Arch, DiscoBall, Star } from './bits'
import { DayRibbon } from './DayRibbon'

const specials = foodMenu.find((s) => s.id === 'weekend')!.items

function suggestTime(plan: DayPlan, nowMin?: number) {
  const [open, close] = plan.pub
  let t = open
  if (nowMin !== undefined && nowMin > open) t = Math.ceil((nowMin + 15) / 30) * 30
  if (t > close - 30) return undefined
  const m = t % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

/** Which of their photos fits the moment: closed front, garden by season, screen on match days, disco late on weekends. */
function photosFor(plan: DayPlan, min: number | undefined, month: number): PhotoKey[] {
  const gardenPhoto: PhotoKey = month >= 3 && month <= 8 ? 'garden-summer-2026' : 'garden-crowd-spring'
  if (min === undefined) {
    if (plan.djs) return ['disco-crowd-2026', 'disco-ball', 'dj-saturday-2026']
    if (plan.fixtures.length) return ['jumbo-screen-2026', gardenPhoto, 'bar-back']
    if (plan.dow === 0) return ['jv-spread', gardenPhoto, 'panelled-room']
    return [gardenPhoto, 'bar-back', 'stout-at-the-bar']
  }
  if (!within(min, plan.pub)) return ['exterior', 'leaded-window-fern', 'bar-back']
  const fixtureSoon = plan.fixtures.some((f) => {
    const [hh, mm] = f.ko.split(':').map(Number)
    const k = hh * 60 + mm
    return min > k - 120 && min < k + 110
  })
  if (fixtureSoon) return ['jumbo-screen-2026', 'sport-garden-celebration', 'sport-inside-screens']
  if (min >= plan.garden[1]) {
    return plan.dow === 5 || plan.dow === 6
      ? ['disco-crowd-2026', 'dj-saturday-2026', 'bar-back']
      : ['panelled-room', 'stout-at-the-bar', 'pool-table']
  }
  return [gardenPhoto, 'jumbo-screen-2026', 'bar-back']
}

type Row = { key: string; on?: boolean; text: string; small?: string }

function liveRows(plan: DayPlan, now: Date): Row[] {
  const live = liveState(now)
  const rows: Row[] = [
    { key: 'garden', on: live.garden.open, text: live.garden.text, small: live.garden.open ? 'Unless we’ve got some sort of screening on.' : undefined },
    { key: 'kitchen', on: live.kitchen.open, text: live.kitchen.text, small: `Jerk Valley, ${spanText(plan.kitchen)}` },
  ]
  if (live.happy) rows.push({ key: 'happy', on: live.happy.on, text: live.happy.text, small: `${happyHour.offer} ${happyHour.what}` })
  rows.push({ key: 'kids', on: live.kids.ok, text: live.kids.text })
  return rows
}

function planRows(plan: DayPlan): Row[] {
  const rows: Row[] = [
    { key: 'garden', text: `Garden ${spanText(plan.garden)}` },
    { key: 'kitchen', text: `Kitchen ${spanText(plan.kitchen)}` },
  ]
  if (plan.happy) rows.push({ key: 'happy', text: `${plan.happy.name} ${spanText(plan.happy.span)}`, small: `${happyHour.offer} ${happyHour.what}` })
  rows.push({ key: 'kids', text: `Under-18s till ${clock(plan.kidsUntil)}` })
  return rows
}

function OnToday({ plan, live, nowMin }: { plan: DayPlan; live: boolean; nowMin?: number }) {
  const { openBooking } = useSheets()
  // once a match is over it comes off the board
  const fixtures = nowMin === undefined ? plan.fixtures : plan.fixtures.filter((f) => koToMin(f.ko) + 100 > nowMin)
  const items: { key: string; title: string; detail?: string; tone: string; disco?: boolean }[] = []
  for (const d of plan.deals) items.push({ key: d.title, title: d.title, detail: d.small ?? d.detail, tone: d.kind })
  if (plan.roast) items.push({ key: 'roast', title: `Sunday roasts ${spanText(plan.roast)}`, detail: `${sundayRoast.note} Jerk lamb, short rib, roast chicken or the wellington.`, tone: 'roast' })
  if (plan.djs) items.push({ key: 'djs', title: saturdayDJs.line, detail: `Open till ${clock(plan.pub[1])}.`, tone: 'djs', disco: true })
  if (plan.weekendSpecials)
    items.push({
      key: 'specials',
      title: specials.map((s) => s.name).join(' & '),
      detail: `${weekendSpecials.label}. £${specials[0].price} each.`,
      tone: 'kitchen',
    })

  return (
    <div className="ontoday">
      {fixtures.length > 0 && (
        <ul className="ontoday__fixtures" aria-label="On the screens">
          {fixtures.map((f) => (
            <li key={f.id}>
              <span className="ontoday__ko">{f.ko}</span>
              <span className="ontoday__teams">
                {f.home} <i>v</i> {f.away}
              </span>
              <button className="btn btn--tiny" onClick={() => openBooking({ date: f.date, time: f.ko, occasion: 'Watching the match', fixtureId: f.id })}>
                Book
              </button>
            </li>
          ))}
        </ul>
      )}
      {items.length > 0 ? (
        <ul className="ontoday__list">
          {items.map((it) => (
            <li key={it.key} className={`deal deal--${it.tone}`}>
              {it.disco ? <DiscoBall size={34} /> : <Star size={16} />}
              <div>
                <strong>{it.title}</strong>
                {it.detail && <span>{it.detail}</span>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !fixtures.length && (
          <p className="ontoday__quiet">
            {live ? 'No deal on today, but ' : 'No deal that day, but '}
            {plan.happy ? `${plan.happy.name.toLowerCase()} runs ${spanText(plan.happy.span)}.` : 'the garden’s open till 9:30pm.'}
          </p>
        )
      )}
    </div>
  )
}

export function TodayBoard() {
  const { now, demo, resetDemo } = useClock()
  const { openBooking, openChristmas } = useSheets()
  const reduce = useReducedMotion()
  const session = sessionOf(now)
  const [offset, setOffset] = useState(0)
  const [dir, setDir] = useState(1)

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => planFor(addDays(session.day, i))), [session.day.getTime()])
  const plan = days[offset]
  const isLive = offset === 0
  const nowMin = isLive ? session.min : undefined
  const live = liveState(now)
  const month = now.getUTCMonth()
  const pics = photosFor(plan, nowMin, month)
  const iso = isoDate(now)
  const xmasOn = iso >= christmas.prominentFrom && iso <= christmas.prominentUntil

  const go = (n: number) => {
    const next = Math.max(0, Math.min(6, n))
    if (next === offset) return
    setDir(next > offset ? 1 : -1)
    setOffset(next)
  }
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(offset + 1)
    else if (info.offset.x > 60 || info.velocity.x > 400) go(offset - 1)
  }
  const onTabsKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(offset + 1)
    if (e.key === 'ArrowLeft') go(offset - 1)
  }

  const rows = isLive ? liveRows(plan, now) : planRows(plan)
  const headline = isLive ? live.headline : DAY_NAMES[plan.dow]
  const sub = isLive ? live.sub : `Open ${spanText(plan.pub)}`
  const bookTime = suggestTime(plan, nowMin)
  const canBookToday = !isLive || bookTime !== undefined

  return (
    <section className="today lattice" aria-labelledby="today-title">
      <div className="today__wrap wrap">
        <div className="today__board">
          <div className="today__top">
            <p className="mono today__clock">
              {dateLabel(now)} · {clock(Math.floor(now.getUTCHours() * 60 + now.getUTCMinutes()), 'long')} <span>London</span>
            </p>
            {demo && (
              <button className="demo-pill" onClick={resetDemo} title="Clock set by ?at= in the address. Tap to go back to real time.">
                Demo clock · reset
              </button>
            )}
          </div>

          <div className="daytabs" role="tablist" aria-label="Pick a day" onKeyDown={onTabsKey}>
            {days.map((d, i) => (
              <button
                key={d.iso}
                role="tab"
                aria-selected={i === offset}
                tabIndex={i === offset ? 0 : -1}
                className={`daytab ${i === offset ? 'is-on' : ''} ${d.djs ? 'daytab--djs' : ''}`}
                onClick={() => go(i)}
              >
                <span>{i === 0 ? 'Today' : DAY_SHORT[d.dow]}</span>
                <b>{d.date.getUTCDate()}</b>
                {d.fixtures.length > 0 && <i className="daytab__dot" title="Match on" />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={plan.iso}
              className="today__day"
              custom={dir}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -36 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={onDragEnd}
            >
              <div className="today__head">
                <div>
                  <h1 id="today-title" className={`today__status ${isLive ? (live.open ? 'is-open' : 'is-closed') : ''}`}>
                    {isLive && <span className={`lamp ${live.open ? 'lamp--on' : ''}`} aria-hidden="true" />}
                    <span className="sr-only">The Duke of Edinburgh, {isLive ? 'right now' : DAY_NAMES[plan.dow]}: </span>
                    {headline}
                  </h1>
                  <p className="today__sub">{sub}</p>
                </div>
                <Arch name={pics[0]} className="today__arch-sm" sizes="120px" eager />
              </div>

              <ul className="facts">
                {rows.map((r) => (
                  <li key={r.key} className={`fact fact--${r.key} ${r.on === undefined ? '' : r.on ? 'is-on' : 'is-off'}`}>
                    <span className="fact__dot" aria-hidden="true" />
                    <span>
                      {r.text}
                      {r.small && <small>{r.small}</small>}
                    </span>
                  </li>
                ))}
              </ul>

              <OnToday plan={plan} live={isLive} nowMin={nowMin} />

              <div className="today__cta">
                {canBookToday ? (
                  <button className="btn btn--cream" onClick={() => openBooking({ date: plan.iso, time: bookTime })}>
                    {isLive ? 'Book a table' : `Book for ${DAY_NAMES[plan.dow]}`}
                  </button>
                ) : (
                  <button className="btn btn--cream" onClick={() => go(1)}>
                    Book for tomorrow
                  </button>
                )}
                {xmasOn && (
                  <button className="btn btn--xmas" onClick={() => openChristmas()}>
                    Christmas do?
                  </button>
                )}
              </div>

              <DayRibbon plan={plan} nowMin={nowMin} />
              <p className="today__hint mono">
                {offset < 6 ? (
                  <button className="linkish" onClick={() => go(offset + 1)}>
                    Swipe or tap for {DAY_NAMES[days[offset + 1].dow]} →
                  </button>
                ) : (
                  <button className="linkish" onClick={() => go(0)}>
                    ← Back to today
                  </button>
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="today__arches" aria-hidden="true">
          {pics.map((p, i) => (
            <Arch key={`${p}-${i}`} name={p} sizes="(min-width: 960px) 16vw, 1px" className={`today__arch today__arch--${i}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
