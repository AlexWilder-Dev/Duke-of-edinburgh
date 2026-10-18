import {
  DAY_NAMES,
  DAY_SHORT,
  deals,
  fixtures,
  happyHour,
  hours,
  saturdayDJs,
  sundayRoast,
  weekendSpecials,
  type DayIndex,
  type Deal,
  type Fixture,
  type Span,
} from '../data/duke'

/*
 * All maths happens in London wall-clock time. A "wall" date is a Date whose
 * UTC fields hold the London local time, so getUTCHours() is the hour on the
 * pub's clock. That keeps ?at=2026-11-08T14:00 and the real clock in the same
 * space without a timezone library.
 */

const londonParts = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

export function londonWallNow(instant = new Date()): Date {
  const p = Object.fromEntries(londonParts.formatToParts(instant).map((x) => [x.type, x.value]))
  return new Date(Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second))
}

const AT_RE = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/

/** Midnight (wall time) at the start of an ISO date. */
export function dayStart(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null
}

export function parseAt(raw: string | null): Date | null {
  if (!raw) return null
  const m = AT_RE.exec(raw.trim())
  if (!m) return null
  const [, y, mo, d, hh = '12', mm = '00'] = m
  const date = new Date(Date.UTC(+y, +mo - 1, +d, +hh, +mm))
  return Number.isNaN(date.getTime()) ? null : date
}

/** ?at= may sit before the hash (/?at=…#/sport) or inside it (#/sport?at=…). */
export function readAtParam(): string | null {
  const before = new URLSearchParams(window.location.search).get('at')
  if (before) return before
  const hash = window.location.hash
  const q = hash.indexOf('?')
  return q >= 0 ? new URLSearchParams(hash.slice(q + 1)).get('at') : null
}

export const minutesOf = (wall: Date) => wall.getUTCHours() * 60 + wall.getUTCMinutes()
export const dowOf = (wall: Date) => wall.getUTCDay() as DayIndex
export const isoDate = (wall: Date) => wall.toISOString().slice(0, 10)
export const addDays = (wall: Date, n: number) => new Date(wall.getTime() + n * 86_400_000)
export const startOfDay = (wall: Date) => new Date(Date.UTC(wall.getUTCFullYear(), wall.getUTCMonth(), wall.getUTCDate()))

export const prevDay = (d: DayIndex) => ((d + 6) % 7) as DayIndex

/**
 * The pub's day runs past midnight: 00:30 on a Sunday is still Saturday night.
 * Returns the session's calendar day and minutes measured from its midnight.
 */
export function sessionOf(wall: Date): { day: Date; dow: DayIndex; min: number } {
  const dow = dowOf(wall)
  const min = minutesOf(wall)
  const yesterday = prevDay(dow)
  const [, lateClose] = hours.pub[yesterday]
  if (lateClose > 1440 && min < lateClose - 1440) {
    return { day: startOfDay(addDays(wall, -1)), dow: yesterday, min: min + 1440 }
  }
  if (lateClose === 1440 && min === 0) {
    return { day: startOfDay(addDays(wall, -1)), dow: yesterday, min: 1440 }
  }
  return { day: startOfDay(wall), dow, min }
}

/* -------------------------------------------------------------- formatting */

export function clock(min: number, style: 'short' | 'long' = 'short'): string {
  const m = ((min % 1440) + 1440) % 1440
  const hh = Math.floor(m / 60)
  const mm = m % 60
  if (style === 'long') return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
  if (m === 0) return 'midnight'
  if (m === 720) return '12pm'
  const suffix = hh < 12 ? 'am' : 'pm'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return mm ? `${h12}:${String(mm).padStart(2, '0')}${suffix}` : `${h12}${suffix}`
}

export const spanText = ([a, b]: Span) => `${clock(a)}–${clock(b)}`

export function duration(mins: number): string {
  if (mins < 60) return `${mins} min`
  const hh = Math.floor(mins / 60)
  const mm = mins % 60
  return mm ? `${hh}h ${mm}m` : `${hh}h`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const dateLabel = (wall: Date) => `${DAY_SHORT[dowOf(wall)]} ${wall.getUTCDate()} ${MONTHS[wall.getUTCMonth()]}`
export const longDateLabel = (wall: Date) => `${DAY_NAMES[dowOf(wall)]} ${wall.getUTCDate()} ${MONTHS[wall.getUTCMonth()]}`

export function isoToLabel(iso: string, long = false) {
  const d = dayStart(iso)
  return d ? (long ? longDateLabel(d) : dateLabel(d)) : iso
}

export const koToMin = (ko: string) => {
  const [hh, mm] = ko.split(':').map(Number)
  return hh * 60 + mm
}

/* ------------------------------------------------------------- day plans */

export type Lane = {
  key: 'pub' | 'garden' | 'kitchen' | 'happy' | 'roast' | 'kids'
  label: string
  span: Span
}

export type DayPlan = {
  date: Date
  iso: string
  dow: DayIndex
  pub: Span
  garden: Span
  kitchen: Span
  happy?: { span: Span; name: string }
  roast?: Span
  kidsUntil: number
  deals: Deal[]
  weekendSpecials: boolean
  djs: boolean
  fixtures: Fixture[]
  lanes: Lane[]
}

export function planFor(day: Date): DayPlan {
  const date = startOfDay(day)
  const dow = dowOf(date)
  const iso = isoDate(date)
  const pub = hours.pub[dow]
  const garden: Span = [pub[0], Math.min(hours.gardenCloses, pub[1])]
  const kitchen = hours.kitchen[dow]
  const happy = happyHour.windows[dow]
  const roast = dow === 0 ? sundayRoast.span : undefined
  const kidsUntil = hours.under18Until[dow]

  const lanes: Lane[] = [
    { key: 'pub', label: 'Pub', span: pub },
    { key: 'garden', label: 'Garden', span: garden },
    { key: 'kitchen', label: 'Kitchen', span: kitchen },
  ]
  if (happy) lanes.push({ key: 'happy', label: happy.name === 'Friday Feels' ? 'Fri Feels' : 'Happy hr', span: happy.span })
  if (roast) lanes.push({ key: 'roast', label: 'Roasts', span: roast })
  lanes.push({ key: 'kids', label: 'Under-18s', span: [pub[0], kidsUntil] })

  return {
    date,
    iso,
    dow,
    pub,
    garden,
    kitchen,
    happy,
    roast,
    kidsUntil,
    deals: deals[dow] ?? [],
    weekendSpecials: weekendSpecials.days.includes(dow),
    djs: dow === saturdayDJs.day,
    fixtures: fixtures.filter((f) => f.date === iso).sort((a, b) => koToMin(a.ko) - koToMin(b.ko)),
    lanes,
  }
}

export const within = (min: number, [a, b]: Span) => min >= a && min < b

export type LiveState = {
  open: boolean
  headline: string
  sub: string
  garden: { open: boolean; text: string }
  kitchen: { open: boolean; text: string }
  happy?: { on: boolean; text: string }
  kids: { ok: boolean; text: string }
}

/** What's true right now, for the session that `wall` falls in. */
export function liveState(wall: Date): LiveState {
  const s = sessionOf(wall)
  const plan = planFor(s.day)
  const min = s.min
  const [open, close] = plan.pub
  const isOpen = within(min, plan.pub)

  let headline: string
  let sub: string
  if (isOpen) {
    headline = 'Open'
    const left = close - min
    sub = left <= 60 ? `Closing at ${clock(close)}, ${duration(left)} to go` : `Open till ${clock(close)}`
  } else if (min < open) {
    headline = 'Closed'
    sub = `Opens at ${clock(open)} today`
  } else {
    const tomorrow = planFor(addDays(s.day, 1))
    headline = 'Closed'
    sub = `Back tomorrow at ${clock(tomorrow.pub[0])}`
  }

  const gardenOpen = within(min, plan.garden)
  const garden = gardenOpen
    ? { open: true, text: `Garden open till ${clock(plan.garden[1])}` }
    : min < plan.garden[0]
      ? { open: false, text: `Garden opens ${clock(plan.garden[0])}, closes ${clock(plan.garden[1])}` }
      : { open: false, text: `Garden closed at ${clock(plan.garden[1])}` }

  const kitchenOpen = within(min, plan.kitchen)
  const kitchen = kitchenOpen
    ? { open: true, text: `Kitchen serving till ${clock(plan.kitchen[1])}` }
    : min < plan.kitchen[0]
      ? { open: false, text: `Kitchen opens ${clock(plan.kitchen[0])}` }
      : { open: false, text: `Kitchen closed at ${clock(plan.kitchen[1])}` }

  let happy: LiveState['happy']
  if (plan.happy) {
    const [a, b] = plan.happy.span
    happy = within(min, plan.happy.span)
      ? { on: true, text: `${plan.happy.name} on for ${duration(b - min)}` }
      : min < a
        ? { on: false, text: `${plan.happy.name} ${clock(a)}–${clock(b)}` }
        : { on: false, text: `${plan.happy.name} finished at ${clock(b)}` }
  }

  const kids =
    min < plan.kidsUntil
      ? { ok: true, text: `Under-18s welcome till ${clock(plan.kidsUntil)}` }
      : { ok: false, text: `Adults only after ${clock(plan.kidsUntil)}` }

  return { open: isOpen, headline, sub, garden, kitchen, happy, kids }
}
