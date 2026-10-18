import { motion, useReducedMotion } from 'framer-motion'
import { fixtures as allFixtures, type Fixture } from '../data/duke'
import { useClock } from '../lib/clock'
import { useSheets } from '../lib/sheets'
import { dayStart, duration, isoToLabel, koToMin } from '../lib/time'

function kickoffWall(f: Fixture) {
  const d = dayStart(f.date)!
  return d.getTime() + koToMin(f.ko) * 60_000
}

/** Days and hours to go, from the pub's clock. */
function untilText(ms: number) {
  const mins = Math.round(ms / 60_000)
  if (mins <= 0) return 'On now'
  if (mins < 60 * 24) return `In ${duration(mins)}`
  const days = Math.floor(mins / 1440)
  return days === 1 ? 'Tomorrow' : `In ${days} days`
}

type Props = { limit?: number; title?: string }

/** The jumbo screen: kick-offs grouped by day, each with its own Book button. */
export function FixturesBoard({ limit, title = 'On the screens' }: Props) {
  const { now } = useClock()
  const { openBooking } = useSheets()
  const reduce = useReducedMotion()
  const t = now.getTime()
  // keep a match on the board until roughly full time
  const upcoming = allFixtures.filter((f) => kickoffWall(f) + 100 * 60_000 > t).sort((a, b) => kickoffWall(a) - kickoffWall(b))
  const list = limit ? upcoming.slice(0, limit) : upcoming
  const next = upcoming[0]

  const byDay = new Map<string, Fixture[]>()
  for (const f of list) byDay.set(f.date, [...(byDay.get(f.date) ?? []), f])

  return (
    <div className="screen">
      <div className="screen__canopy" aria-hidden="true" />
      <div className="screen__panel">
        <header className="screen__head">
          <h2 className="screen__title">{title}</h2>
          {next ? (
            <p className="screen__next mono">
              Next: {next.home} v {next.away} · {untilText(kickoffWall(next) - t)}
            </p>
          ) : (
            <p className="screen__next mono">No fixtures listed yet</p>
          )}
        </header>
        {list.length === 0 ? (
          <p className="screen__empty">The November rugby is done. New fixtures go up here as soon as they’re announced.</p>
        ) : (
          <ol className="screen__days">
            {[...byDay.entries()].map(([date, fs]) => (
              <li key={date} className="screen__day">
                <h3 className="screen__date mono">{isoToLabel(date, true)}</h3>
                <ul>
                  {fs.map((f, i) => {
                    const live = kickoffWall(f) <= t
                    return (
                      <motion.li
                        key={f.id}
                        className={`match ${live ? 'is-live' : ''}`}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                      >
                        <span className="match__ko mono">{live ? 'LIVE' : f.ko}</span>
                        <span className="match__teams">
                          <span>{f.home}</span>
                          <i>v</i>
                          <span>{f.away}</span>
                        </span>
                        <span className="match__sport mono">{f.sport}</span>
                        <button
                          className="btn btn--screen"
                          onClick={() => openBooking({ date: f.date, time: f.ko, occasion: 'Watching the match', fixtureId: f.id })}
                          aria-label={`Book a table for ${f.home} v ${f.away}, ${isoToLabel(f.date, true)} at ${f.ko}`}
                        >
                          Book
                        </button>
                      </motion.li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
