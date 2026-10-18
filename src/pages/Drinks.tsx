import { backBar, cocktails, contact, DAY_NAMES, drinksNotes, happyHour, wine, type DayIndex } from '../data/duke'
import { ExtLink, Photo, priceText, Star } from '../components/bits'
import { useClock } from '../lib/clock'
import { liveState, sessionOf, spanText } from '../lib/time'

const HH_ORDER: DayIndex[] = [1, 2, 3, 4, 5, 6, 0]

export function Drinks() {
  const { now } = useClock()
  const s = sessionOf(now)
  const live = liveState(now)
  const margs = cocktails.filter((c) => c.name.endsWith('Marg'))
  const spritz = cocktails.filter((c) => c.price === '11.5')
  const rest = cocktails.filter((c) => !margs.includes(c) && !spritz.includes(c))

  return (
    <div className="page page--drinks gridpaper">
      <div className="wrap">
        <header className="dm-bar">
          <h1>Drinks</h1>
          <p className="mono">Yes please?</p>
        </header>
        <p className="drinks__lede">{drinksNotes.taps} Alongside a seasonal cocktail menu and a wide range of spirits.</p>

        <section className="hh" aria-labelledby="hh-title">
          <div className={`hh__now ${live.happy?.on ? 'is-on' : ''}`}>
            <p className="mono">
              <Star size={12} /> {live.happy ? (live.happy.on ? 'On now' : 'Today') : 'Today'}
            </p>
            <h2 id="hh-title">{live.happy ? live.happy.text : 'No happy hour on Saturdays'}</h2>
            <p>
              {happyHour.offer} {happyHour.what}.
            </p>
          </div>
          <table className="hh__table">
            <caption className="sr-only">Happy hour times</caption>
            <tbody>
              {HH_ORDER.map((d) => {
                const w = happyHour.windows[d]
                return (
                  <tr key={d} className={d === s.dow ? 'is-today' : ''}>
                    <th scope="row">{DAY_NAMES[d]}</th>
                    <td>{w ? spanText(w.span) : '–'}</td>
                    <td>{w ? w.name : d === 6 ? 'DJs every Saturday' : ''}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className={`ww ${s.dow === 3 ? 'is-today' : ''}`}>
            <b>Wine Wednesday</b>
            <span>£20 a bottle of house red, white or rosé{s.dow === 3 ? ', tonight' : ''}.</span>
          </div>
        </section>

        <section className="dm-card" aria-labelledby="cocktails-title">
          <header className="dm-bar dm-bar--small">
            <h2 id="cocktails-title">Cocktails</h2>
          </header>
          <div className="cocktails">
            {[
              ['Margs', margs],
              ['Classics & house', rest],
              ['Spritzes & daiquiri', spritz],
            ].map(([title, list]) => (
              <div key={title as string} className="cocktails__col">
                <h3 className="dm-head">
                  <Star size={14} /> {title as string}
                </h3>
                <ul>
                  {(list as typeof cocktails).map((c) => (
                    <li key={c.name} className="drink">
                      <p className="drink__line">
                        <span className="drink__name">{c.name}</span>
                        <span className="drink__dots" aria-hidden="true" />
                        <span className="drink__price">{priceText(c.price)}</span>
                      </p>
                      <p className="drink__makeup">{c.makeup}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="dm-foot mono">
            <Star size={11} /> Happy Hour <Star size={11} /> 2 for £13 Mon–Thurs (3–7pm) <Star size={11} /> Friday Feels: 2 for £13 (3–8pm) <Star size={11} /> Sunday Happy Hour: 2 for £13 (12–6pm)
          </p>
        </section>

        <div className="drinks__split">
          <section className="dm-card" aria-labelledby="wine-title">
            <header className="dm-bar dm-bar--small">
              <h2 id="wine-title">Wine list</h2>
            </header>
            {wine.map((g) => (
              <div key={g.colour} className="wine">
                <h3 className="dm-head">
                  <Star size={14} /> {g.colour}
                </h3>
                <table>
                  <thead className="sr-only">
                    <tr>
                      <th>Wine</th>
                      <th>125ml</th>
                      <th>175ml</th>
                      <th>250ml</th>
                      <th>Bottle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.items.map((w) => (
                      <tr key={w.name}>
                        <th scope="row">
                          <span className="wine__name">{w.name}</span>
                          {w.from && <span className="wine__from">{w.from}</span>}
                        </th>
                        {w.glass.map((p, i) => (
                          <td key={i} data-size={['125', '175', '250'][i]}>
                            {priceText(p)}
                          </td>
                        ))}
                        <td data-size="btl" className="wine__bottle">
                          {priceText(w.bottle)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            <p className="dm-foot mono">Wine Wednesday: £20 a bottle, house red / white / rosé</p>
          </section>

          <section className="dm-card" aria-labelledby="back-title">
            <header className="dm-bar dm-bar--small">
              <h2 id="back-title">Behind the bar</h2>
            </header>
            <div className="backbar">
              {backBar.map((g) => (
                <div key={g.title} className="backbar__group">
                  <h3 className="dm-head">
                    <Star size={14} /> {g.title}
                  </h3>
                  {g.note && <p className="backbar__note">{g.note}</p>}
                  <ul>
                    {g.items.map((i) => (
                      <li key={i.name}>
                        <span>
                          {i.name}
                          {i.note && <small> ({i.note})</small>}
                        </span>
                        <span>{priceText(i.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="taps" aria-labelledby="taps-title">
          <Photo name="bar-taps" sizes="(min-width: 900px) 50vw, 100vw" />
          <div>
            <h2 id="taps-title" className="serif-title">On tap</h2>
            <p>{drinksNotes.taps} Ask at the bar for what’s pouring.</p>
            <p className="mono taps__booth">
              <Star size={11} /> {drinksNotes.photobooth}
            </p>
            <p className="taps__links">
              <ExtLink href={drinksNotes.pdf}>Drinks menu PDF</ExtLink> · <ExtLink href={contact.drinkaware}>Drinkaware</ExtLink>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
