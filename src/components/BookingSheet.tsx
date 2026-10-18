import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { bookingRules, contact, fixtures, hours, occasions } from '../data/duke'
import { useClock } from '../lib/clock'
import { useSheets, type BookingPrefill } from '../lib/sheets'
import { clock, dayStart, isoDate, isoToLabel, koToMin, planFor, sessionOf } from '../lib/time'
import { Chequer, Star } from './bits'
import { Sheet } from './Sheet'

type Area = 'inside' | 'garden' | 'either'

type Form = {
  date: string
  time: string
  size: number
  area: Area
  occasion: string
  kids: boolean
  name: string
  email: string
  phone: string
  notes: string
  agreed: boolean
}

const hhmm = (m: number) => `${String(Math.floor((m % 1440) / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
const toMin = (t: string) => koToMin(t)

/** Booking times run from opening to half an hour before close, every 30 minutes. */
function slotsFor(dateIso: string, extra?: string) {
  const d = dayStart(dateIso)
  if (!d) return []
  const [open, close] = planFor(d).pub
  const out: number[] = []
  for (let t = open; t <= close - 30; t += 30) out.push(t)
  if (extra) {
    const e = toMin(extra)
    if (e >= open && e < close && !out.includes(e)) out.push(e)
  }
  return out.sort((a, b) => a - b)
}

function ref() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'DUKE-' + Array.from({ length: 5 }, () => abc[Math.floor(Math.random() * abc.length)]).join('')
}

function blank(prefill: BookingPrefill, todayIso: string): Form {
  const date = prefill.date && prefill.date >= todayIso ? prefill.date : todayIso
  const slots = slotsFor(date, prefill.time)
  const time = prefill.time && slots.includes(toMin(prefill.time)) ? prefill.time : hhmm(slots[0] ?? hours.pub[1][0])
  return {
    date,
    time,
    size: 4,
    area: prefill.area ?? 'either',
    occasion: prefill.occasion ?? '',
    kids: false,
    name: '',
    email: '',
    phone: '',
    notes: '',
    agreed: false,
  }
}

export function BookingSheet() {
  const { booking, close } = useSheets()
  const { now } = useClock()
  const todayIso = isoDate(sessionOf(now).day)
  const [form, setForm] = useState<Form>(() => blank(booking ?? {}, todayIso))
  const [done, setDone] = useState<{ ref: string; form: Form } | null>(null)
  const [tried, setTried] = useState(false)

  useEffect(() => {
    if (booking) {
      setForm(blank(booking, todayIso))
      setDone(null)
      setTried(false)
    }
  }, [booking, todayIso])

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  const fixture = booking?.fixtureId ? fixtures.find((f) => f.id === booking.fixtureId) : undefined
  const slots = useMemo(() => slotsFor(form.date, fixture?.date === form.date ? fixture.ko : undefined), [form.date, fixture])
  const d = dayStart(form.date)
  const plan = d ? planFor(d) : undefined
  const t = toMin(form.time)
  const dayFixtures = plan?.fixtures ?? []

  // keep the time valid when the date changes
  useEffect(() => {
    if (slots.length && !slots.includes(toMin(form.time))) set('time', hhmm(slots[0]))
  }, [slots])

  const notes: { tone: 'warn' | 'info'; text: string }[] = []
  if (plan) {
    if (form.area === 'garden' && t >= plan.garden[1]) notes.push({ tone: 'warn', text: `The garden closes at ${clock(plan.garden[1])}, unless there’s a screening on. Inside might suit better.` })
    if (form.kids && t >= plan.kidsUntil) notes.push({ tone: 'warn', text: `Under-18s are welcome until ${clock(plan.kidsUntil)} on ${isoToLabel(form.date, true).split(' ')[0]}s. Pick an earlier time if you’re bringing kids.` })
    if (form.kids && dayFixtures.length) notes.push({ tone: 'info', text: 'There’s a match on that day, and on big sporting days the under-18 cut-off can come earlier. The manager’s decision is final.' })
    if ((fixture || form.occasion === 'Watching the match') && form.area === 'garden') notes.push({ tone: 'info', text: 'No commentary on the garden screen: that’s a licensing rule. Sound is inside only.' })
  }

  const errors = {
    name: !form.name.trim() ? 'Who’s the booking under?' : '',
    email: !/^\S+@\S+\.\S+$/.test(form.email) ? 'We need an email for the confirmation.' : '',
    agreed: !form.agreed ? 'Tick to say you’ve read the house rules.' : '',
    kids: form.kids && plan && t >= plan.kidsUntil ? 'Too late for under-18s.' : '',
  }
  const valid = !Object.values(errors).some(Boolean)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!valid) return
    setDone({ ref: ref(), form })
  }

  const held = clock(t + 60)

  return (
    <Sheet open={booking !== null} onClose={close} label="Book a table">
      {done ? (
        <div className="confirm">
          <p className="eyebrow">
            <Star size={11} /> <span>Request received</span>
          </p>
          <h2 tabIndex={-1} className="sheet__title">
            See you at the bar, {done.form.name.split(' ')[0]}
          </h2>
          <div className="ticket">
            <div className="ticket__row">
              <span>When</span>
              <b>
                {isoToLabel(done.form.date, true)}, {clock(toMin(done.form.time))}
              </b>
            </div>
            <div className="ticket__row">
              <span>How many</span>
              <b>{done.form.size}</b>
            </div>
            <div className="ticket__row">
              <span>Where</span>
              <b>{done.form.area === 'either' ? 'Wherever’s best' : done.form.area === 'garden' ? 'In the garden' : 'Inside'}</b>
            </div>
            {fixture && (
              <div className="ticket__row">
                <span>Match</span>
                <b>
                  {fixture.home} v {fixture.away}, {fixture.ko}
                </b>
              </div>
            )}
            {done.form.occasion && (
              <div className="ticket__row">
                <span>Occasion</span>
                <b>{done.form.occasion}</b>
              </div>
            )}
            <Chequer />
            <div className="ticket__row ticket__row--ref">
              <span>Ref</span>
              <b className="mono">{done.ref}</b>
            </div>
          </div>
          <ul className="confirm__list">
            <li>We’ll hold your space till {held}. After that, late arrivals may have to queue if we’re full.</li>
            <li>The £25 card authorisation is only charged if nobody turns up.</li>
            <li>
              Need to change something? Reply to your confirmation email, or write to <a href={`mailto:${contact.bookingsEmail}`}>{contact.bookingsEmail}</a>.
            </li>
          </ul>
          <p className="demo-note">Demo only. Nothing has been booked and no card details were taken.</p>
          <button className="btn btn--plum" onClick={close}>
            Done
          </button>
        </div>
      ) : (
        <form className="bookform" onSubmit={submit} noValidate>
          <p className="eyebrow">
            <Star size={11} /> <span>Don’t be shy, be reserved</span>
          </p>
          <h2 tabIndex={-1} className="sheet__title">
            {fixture ? `${fixture.home} v ${fixture.away}` : 'Book a table'}
          </h2>
          {fixture && (
            <p className="bookform__lede">
              {isoToLabel(fixture.date, true)}, kick-off {fixture.ko}. Seven screens inside, one bloody-big one in the garden.
            </p>
          )}

          <fieldset className="field-group">
            <legend>When</legend>
            <div className="row2">
              <label className="field">
                <span>Date</span>
                <input type="date" value={form.date} min={todayIso} onChange={(e) => e.target.value && set('date', e.target.value)} data-autofocus />
              </label>
              <label className="field">
                <span>Time</span>
                <select value={form.time} onChange={(e) => set('time', e.target.value)}>
                  {slots.map((m) => (
                    <option key={m} value={hhmm(m)}>
                      {clock(m)}
                      {dayFixtures.some((f) => toMin(f.ko) === m) ? ' · kick-off' : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {plan && (
              <p className="field-hint mono">
                {isoToLabel(form.date)}: open {clock(plan.pub[0])}–{clock(plan.pub[1])} · garden till {clock(plan.garden[1])}
                {dayFixtures.length ? ` · ${dayFixtures.length} match${dayFixtures.length > 1 ? 'es' : ''} on` : ''}
              </p>
            )}
          </fieldset>

          <fieldset className="field-group">
            <legend>Who</legend>
            <div className="stepper">
              <span>Group size</span>
              <div>
                <button type="button" onClick={() => set('size', Math.max(1, form.size - 1))} aria-label="Fewer people">
                  −
                </button>
                <output aria-live="polite">{form.size}</output>
                <button type="button" onClick={() => set('size', Math.min(60, form.size + 1))} aria-label="More people">
                  +
                </button>
              </div>
            </div>
            <div className="segmented" role="radiogroup" aria-label="Where would you like to sit?">
              {(['inside', 'garden', 'either'] as Area[]).map((a) => (
                <label key={a} className={form.area === a ? 'is-on' : ''}>
                  <input type="radio" name="area" value={a} checked={form.area === a} onChange={() => set('area', a)} />
                  {a === 'either' ? 'Don’t mind' : a === 'garden' ? 'Garden' : 'Inside'}
                </label>
              ))}
            </div>
            <div className="chips" role="group" aria-label="What’s the occasion?">
              {occasions.map((o) => (
                <button type="button" key={o} className={`chip ${form.occasion === o ? 'is-on' : ''}`} aria-pressed={form.occasion === o} onClick={() => set('occasion', form.occasion === o ? '' : o)}>
                  {o}
                </button>
              ))}
            </div>
            {form.size >= 20 && (
              <p className="field-hint">
                Planning something bigger? Private hire enquiries go to <a href={`mailto:${contact.hireEmail}`}>{contact.hireEmail}</a>.
              </p>
            )}
            <label className="check">
              <input type="checkbox" checked={form.kids} onChange={(e) => set('kids', e.target.checked)} />
              <span>We’re bringing under-18s</span>
            </label>
            {tried && errors.kids && <p className="field-error">{errors.kids}</p>}
          </fieldset>

          {notes.length > 0 && (
            <ul className="notes">
              {notes.map((n) => (
                <li key={n.text} className={`note note--${n.tone}`}>
                  {n.text}
                </li>
              ))}
            </ul>
          )}

          <fieldset className="field-group">
            <legend>Your details</legend>
            <label className="field">
              <span>Name</span>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" aria-invalid={tried && !!errors.name} />
              {tried && errors.name && <em className="field-error">{errors.name}</em>}
            </label>
            <div className="row2">
              <label className="field">
                <span>Email</span>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" aria-invalid={tried && !!errors.email} />
                {tried && errors.email && <em className="field-error">{errors.email}</em>}
              </label>
              <label className="field">
                <span>Phone</span>
                <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" />
              </label>
            </div>
            <label className="field">
              <span>Anything we should know?</span>
              <textarea rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="A birthday, a dog, a pram…" />
            </label>
          </fieldset>

          <section className="rules" aria-labelledby="rules-title">
            <h3 id="rules-title">Before you book</h3>
            <ol>
              {bookingRules.map((r) => (
                <li key={r.key}>
                  <b>{r.title}</b>
                  <span>{r.body}</span>
                </li>
              ))}
            </ol>
            <label className="check check--strong">
              <input type="checkbox" checked={form.agreed} onChange={(e) => set('agreed', e.target.checked)} aria-invalid={tried && !!errors.agreed} />
              <span>Got it. Hold my table.</span>
            </label>
            {tried && errors.agreed && <p className="field-error">{errors.agreed}</p>}
          </section>

          <button type="submit" className="btn btn--plum btn--wide">
            Request {form.size} {form.size === 1 ? 'place' : 'places'}, {isoToLabel(form.date)} at {clock(t)}
          </button>
        </form>
      )}
    </Sheet>
  )
}
