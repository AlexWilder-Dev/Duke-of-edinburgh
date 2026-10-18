import { useEffect, useState, type FormEvent } from 'react'
import { bookingRules, christmas, contact } from '../data/duke'
import { useClock } from '../lib/clock'
import { useSheets } from '../lib/sheets'
import { isoDate, isoToLabel, sessionOf } from '../lib/time'
import { money, Star } from './bits'
import { Sheet } from './Sheet'

type Form = {
  date: string
  size: number
  courses: 2 | 3
  name: string
  email: string
  phone: string
  company: string
  notes: string
  agreed: boolean
}

const blank = (date: string, courses: 2 | 3 = 3): Form => ({
  date,
  size: 10,
  courses,
  name: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
  agreed: false,
})

export function ChristmasSheet() {
  const { christmas: open, close } = useSheets()
  const { now } = useClock()
  const today = isoDate(sessionOf(now).day)
  const firstDate = today > '2026-12-01' ? today : '2026-12-04'
  const [form, setForm] = useState<Form>(() => blank(firstDate))
  const [sent, setSent] = useState<Form | null>(null)
  const [tried, setTried] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(blank(firstDate, open.courses))
      setSent(null)
      setTried(false)
    }
  }, [open, firstDate])

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))
  const per = form.courses === 2 ? christmas.prices.two : christmas.prices.three
  const total = per * form.size

  const errors = {
    name: !form.name.trim(),
    email: !/^\S+@\S+\.\S+$/.test(form.email),
    agreed: !form.agreed,
  }
  const valid = !Object.values(errors).some(Boolean)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (valid) setSent(form)
  }

  return (
    <Sheet open={open !== null} onClose={close} label="Christmas party enquiry" tone="xmas">
      {sent ? (
        <div className="confirm">
          <p className="eyebrow">
            <Star size={11} /> <span>On the list</span>
          </p>
          <h2 tabIndex={-1} className="sheet__title">
            More ho ho ho than oh no no
          </h2>
          <div className="ticket ticket--xmas">
            <div className="ticket__row">
              <span>Date</span>
              <b>{isoToLabel(sent.date, true)}</b>
            </div>
            <div className="ticket__row">
              <span>Party of</span>
              <b>{sent.size}</b>
            </div>
            <div className="ticket__row">
              <span>Menu</span>
              <b>
                {sent.courses} courses at {money(sent.courses === 2 ? christmas.prices.two : christmas.prices.three)} a head
              </b>
            </div>
            <div className="ticket__row">
              <span>Food estimate</span>
              <b>{money((sent.courses === 2 ? christmas.prices.two : christmas.prices.three) * sent.size)}</b>
            </div>
          </div>
          <p className="confirm__p">
            The team will come back to {sent.email} to confirm the date and sort the details. Santa’s list fills up fast, and ours does too.
          </p>
          <p className="demo-note">Demo only. Nothing has been sent or booked.</p>
          <button className="btn btn--xmasred" onClick={close}>
            Done
          </button>
        </div>
      ) : (
        <form className="bookform" onSubmit={submit} noValidate>
          <p className="eyebrow">
            <Star size={11} /> <span>{christmas.headline}</span>
          </p>
          <h2 tabIndex={-1} className="sheet__title">
            Book your festive do
          </h2>
          <p className="bookform__lede">Jerk Valley’s festive menu: two courses {money(christmas.prices.two)}, three courses {money(christmas.prices.three)}.</p>

          <fieldset className="field-group">
            <legend>The do</legend>
            <label className="field">
              <span>Date</span>
              <input type="date" value={form.date} min={today} max={christmas.prominentUntil} onChange={(e) => e.target.value && set('date', e.target.value)} data-autofocus />
            </label>
            <div className="stepper">
              <span>Group size</span>
              <div>
                <button type="button" onClick={() => set('size', Math.max(2, form.size - 1))} aria-label="Fewer people">
                  −
                </button>
                <output aria-live="polite">{form.size}</output>
                <button type="button" onClick={() => set('size', Math.min(200, form.size + 1))} aria-label="More people">
                  +
                </button>
              </div>
            </div>
            <div className="courses" role="radiogroup" aria-label="Courses">
              {([2, 3] as const).map((c) => (
                <label key={c} className={form.courses === c ? 'is-on' : ''}>
                  <input type="radio" name="courses" checked={form.courses === c} onChange={() => set('courses', c)} />
                  <b>{c} courses</b>
                  <span>{money(c === 2 ? christmas.prices.two : christmas.prices.three)}</span>
                  <small>a head{c === 3 ? ': starter, main & dessert' : ''}</small>
                </label>
              ))}
            </div>
            <p className="estimate" aria-live="polite">
              <span>
                {form.size} × {money(per)}
              </span>
              <b>{money(total)}</b>
              <small>Food estimate</small>
            </p>
          </fieldset>

          <fieldset className="field-group">
            <legend>Who’s organising</legend>
            <label className="field">
              <span>Name</span>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" aria-invalid={tried && errors.name} />
            </label>
            <div className="row2">
              <label className="field">
                <span>Email</span>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" aria-invalid={tried && errors.email} />
              </label>
              <label className="field">
                <span>Phone</span>
                <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" />
              </label>
            </div>
            <label className="field">
              <span>Work do? Company name</span>
              <input value={form.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" />
            </label>
            <label className="field">
              <span>Dietary needs, timings, anything else</span>
              <textarea rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Three veggies, one vegan, we’d like the long table…" />
            </label>
            {tried && (errors.name || errors.email) && <p className="field-error">We need a name and an email to come back to you.</p>}
          </fieldset>

          <section className="rules rules--xmas" aria-labelledby="xrules">
            <h3 id="xrules">The small print</h3>
            <ol>
              {bookingRules
                .filter((r) => ['card', 'hour', 'first', 'kids'].includes(r.key))
                .map((r) => (
                  <li key={r.key}>
                    <b>{r.title}</b>
                    <span>{r.body}</span>
                  </li>
                ))}
            </ol>
            <label className="check check--strong">
              <input type="checkbox" checked={form.agreed} onChange={(e) => set('agreed', e.target.checked)} />
              <span>Understood. Get us on the list.</span>
            </label>
            {tried && errors.agreed && <p className="field-error">Tick to say you’ve read the small print.</p>}
            <p className="field-hint">
              Hiring the whole place or filming? <a href={`mailto:${contact.hireEmail}`}>{contact.hireEmail}</a>
            </p>
          </section>

          <button type="submit" className="btn btn--xmasred btn--wide">
            Send enquiry for {form.size}
          </button>
        </form>
      )}
    </Sheet>
  )
}
