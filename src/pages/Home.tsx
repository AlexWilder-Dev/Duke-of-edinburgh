import { Link } from 'react-router-dom'
import { building, christmas, contact, deals, drinksNotes, gigs, happyHour, kitchen, place, screens, sundayRoast } from '../data/duke'
import { Arch, Chequer, ExtLink, Eyebrow, money, Photo, Star } from '../components/bits'
import { FixturesBoard } from '../components/FixturesBoard'
import { TodayBoard } from '../components/TodayBoard'
import { useClock } from '../lib/clock'
import { useSheets } from '../lib/sheets'
import { isoDate, liveState, spanText } from '../lib/time'
import { press } from '../data/press'

function ChristmasBand() {
  const { openChristmas } = useSheets()
  return (
    <section className="xband" aria-labelledby="xband-title">
      <div className="xband__wrap wrap">
        <div className="xband__text">
          <p className="xband__kicker">Christmas Time at the Duke</p>
          <h2 id="xband-title" className="xband__title">
            {christmas.headline}
          </h2>
          <p>{christmas.intro}</p>
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
          <div className="xband__cta">
            <button className="btn btn--xmasred" onClick={() => openChristmas()}>
              Book your festive do
            </button>
            <Link to="/christmas" className="btn btn--line-red">
              See the festive menu
            </Link>
          </div>
        </div>
        <div className="xband__pics">
          <Arch name="xmas-crackers" sizes="(min-width: 900px) 22vw, 45vw" />
          <Arch name="xmas-table-candle" sizes="(min-width: 900px) 22vw, 45vw" />
        </div>
      </div>
    </section>
  )
}

function Garden() {
  const { now } = useClock()
  const live = liveState(now)
  return (
    <section className="garden" aria-labelledby="garden-title">
      <div className="wrap">
        <Eyebrow>The garden</Eyebrow>
        <h2 id="garden-title" className="display">
          South London’s biggest <span className="amp">&</span> best beer garden
        </h2>
        <p className={`garden__live mono ${live.garden.open ? 'is-open' : ''}`}>
          <i aria-hidden="true" /> {live.garden.text}
        </p>
        <div className="garden__arches">
          <Arch name="garden-summer-2026" caption="Umbrellas up, every bench taken" sizes="(min-width: 900px) 30vw, 80vw" />
          <Arch name="jumbo-screen-2026" caption="The bloody-big jumbo screen" sizes="(min-width: 900px) 30vw, 80vw" />
          <Arch name="garden-friends-2026" caption="Under the pergola" sizes="(min-width: 900px) 30vw, 80vw" />
        </div>
        <ul className="garden__facts">
          <li>
            <Star /> <span><b>One jumbo screen</b> under its own timber canopy, out all year. Sound’s inside only.</span>
          </li>
          <li>
            <Star /> <span><b>Closes 9:30pm</b> every night, unless we’ve got some sort of screening on.</span>
          </li>
          <li>
            <Star /> <span><b>Completely dog friendly.</b> Bring your fluffy friends.</span>
          </li>
          <li>
            <Star /> <span><b>Photobooth outside.</b> Tag us {contact.instagram.handle}.</span>
          </li>
        </ul>
        <figure className="plaque">
          <blockquote>“{press.timeoutGarden.quote}”</blockquote>
          <figcaption>
            <ExtLink href={press.timeoutGarden.url}>{press.timeoutGarden.source}</ExtLink>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function Kitchen() {
  const week = [1, 2, 3] as const
  return (
    <section className="jv" aria-labelledby="jv-title">
      <div className="jv__wrap wrap">
        <div className="jv__text">
          <p className="jv__badge">
            The <b>Jerk Valley</b> of London
          </p>
          <h2 id="jv-title" className="jv__title">In the kitchen</h2>
          <p>{kitchen.line} The perfect accompaniment to a crisp pint.</p>
          <p className="jv__halal">
            <span className="halal-dot" aria-hidden="true">
              حلال
            </span>
            {kitchen.halal}
          </p>
          <ol className="offers">
            {week.map((d) => {
              const deal = deals[d]!.find((x) => x.kind === 'kitchen')!
              return (
                <li key={d} className={`offer offer--${d}`}>
                  <span className="offer__day">{['', 'Monday', 'Tuesday', 'Wednesday'][d]}</span>
                  <b className="offer__what">{deal.title.replace('Wing Wednesday: ', '')}</b>
                  {deal.small && <small>{deal.small}</small>}
                </li>
              )
            })}
          </ol>
          <p className="jv__more">
            Weekend specials Friday to Sunday: oxtail and curry goat. Sunday roasts {spanText(sundayRoast.span)}, while stocks last.
          </p>
          <Link to="/food" className="btn btn--black">
            The full menu
          </Link>
        </div>
        <div className="jv__pics">
          <Photo name="jv-spread" className="jv__pic jv__pic--a" sizes="(min-width: 900px) 30vw, 60vw" />
          <Photo name="jv-wings" className="jv__pic jv__pic--b" sizes="(min-width: 900px) 20vw, 40vw" />
        </div>
      </div>
    </section>
  )
}

function Drinks() {
  const unique = [
    `Happy Hour: ${happyHour.offer} Mon–Thurs (3–7pm)`,
    `Friday Feels: ${happyHour.offer} (3–8pm)`,
    `Sunday Happy Hour: ${happyHour.offer} (12–6pm)`,
    drinksNotes.wineWednesday,
  ]
  return (
    <section className="drinksband" aria-labelledby="drinks-title">
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((k) => (
            <span key={k}>
              {unique.map((u) => (
                <span key={u} className="marquee__item">
                  <Star size={12} /> {u}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="drinksband__wrap wrap">
        <div>
          <h2 id="drinks-title" className="serif-title">
            Drinks – yes please?
          </h2>
          <p>{drinksNotes.taps} Margs six ways, spritzes, and a seasonal cocktail list.</p>
          <p className="sr-only">{unique.join('. ')}</p>
          <Link to="/drinks" className="btn btn--plum">
            The drinks list
          </Link>
        </div>
        <Photo name="stout-at-the-bar" className="drinksband__pic" sizes="(min-width: 900px) 25vw, 50vw" />
      </div>
    </section>
  )
}

function GigNights() {
  return (
    <section className="gigs lattice" aria-labelledby="gigs-title">
      <div className="gigs__wrap wrap">
        <Photo name="disco-crowd-2026" className="gigs__pic" sizes="(min-width: 900px) 35vw, 100vw" />
        <div>
          <Eyebrow>Gig nights</Eyebrow>
          <h2 id="gigs-title" className="display display--cream">
            Pre-gig bite.
            <br />
            Post-gig pint.
          </h2>
          <p>{gigs.line}</p>
          <div className="bagdrop">
            <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" className="bagdrop__icon">
              <path d="M10 15h20l-2 19H12z" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M15 15v-4a5 5 0 0110 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <p>
              <b>Bag drop.</b> {gigs.bagDrop.replace('Drop your bags with us. ', '')}
            </p>
          </div>
          <div className="gigs__cta">
            <ExtLink href={gigs.venueUrl} className="btn btn--line">
              What’s on at the Academy
            </ExtLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function Building() {
  return (
    <section className="building" aria-labelledby="building-title">
      <div className="building__wrap wrap">
        <div className="building__pic">
          <Photo name="exterior" sizes="(min-width: 900px) 35vw, 100vw" />
        </div>
        <div className="building__text">
          <Eyebrow>Since {building.built}</Eyebrow>
          <h2 id="building-title" className="display display--cream">
            Built for Truman’s.
            <br />
            Still pouring.
          </h2>
          <p>
            {building.architect} designed the Duke for {building.brewery} in {building.built}. It’s {building.listed.split(',')[0]}, and CAMRA rates the interior two
            stars: “a pub interior of very special national historic interest”.
          </p>
          <p className="ghost">“{building.ghostSign}”</p>
          <Link to="/hire" className="btn btn--cream">
            The building, hire & filming
          </Link>
        </div>
      </div>
    </section>
  )
}

function FindUs() {
  return (
    <section className="findus" aria-labelledby="findus-title">
      <div className="findus__wrap wrap">
        <div>
          <Eyebrow>Find us</Eyebrow>
          <h2 id="findus-title" className="display">
            {place.street}
          </h2>
          <p className="findus__corner">
            {place.corner}, {place.area} {place.postcode}.
          </p>
          <ul className="stations">
            {place.stations.map((s) => (
              <li key={s.name}>
                <ExtLink href={s.url}>
                  <b>{s.name}</b> <span>{s.line}</span>
                </ExtLink>
              </li>
            ))}
          </ul>
          <div className="findus__cta">
            <ExtLink href={place.directionsUrl} className="btn btn--plum">
              Directions
            </ExtLink>
            <Link to="/visit" className="btn btn--line-plum">
              Parking, access, contact
            </Link>
          </div>
        </div>
        <MapCard />
      </div>
    </section>
  )
}

/** A drawn street plan, north up: the pub on the corner, the garden behind it running up to the railway. */
export function MapCard() {
  return (
    <ExtLink href={place.mapUrl} className="mapcard">
      <svg viewBox="0 0 320 240" aria-hidden="true">
        <rect width="320" height="240" className="mapcard__bg" />
        <path d="M-10 52 L330 34" className="mapcard__rail" />
        <path d="M-10 178 L330 166" className="mapcard__road mapcard__road--main" />
        <path d="M118 176 L112 -10" className="mapcard__road" />
        <path d="M142 128 L140 66 L268 58 L270 122 Z" className="mapcard__garden" />
        <rect x="126" y="134" width="36" height="32" className="mapcard__pub" />
        <text x="10" y="200" className="mapcard__label">Ferndale Road</text>
        <text x="96" y="120" className="mapcard__label" transform="rotate(-88 96 120)">Bythorn St</text>
        <text x="200" y="28" className="mapcard__label mapcard__label--rail">railway</text>
        <text x="172" y="98" className="mapcard__label mapcard__label--garden">the garden</text>
        <text x="170" y="156" className="mapcard__label mapcard__label--pub">The Duke</text>
        <g transform="translate(292 206)" className="mapcard__north">
          <path d="M0 -14 L6 4 L0 0 L-6 4 Z" />
          <text y="16" textAnchor="middle">N</text>
        </g>
      </svg>
      <span className="mapcard__cta mono">Open in Google Maps ↗</span>
    </ExtLink>
  )
}

export function Home() {
  const { now } = useClock()
  const iso = isoDate(now)
  const xmasOn = iso >= christmas.prominentFrom && iso <= christmas.prominentUntil
  return (
    <>
      <TodayBoard />
      {xmasOn && <ChristmasBand />}
      <section className="home-sport" aria-label="Sport">
        <div className="wrap">
          <FixturesBoard limit={4} />
          <p className="home-sport__more">
            {screens.jumbo}, {screens.inside.toLowerCase()}. {screens.channels.join(', ')}.{' '}
            <Link to="/sport" className="linkish">
              Every fixture →
            </Link>
          </p>
        </div>
      </section>
      <Garden />
      <Chequer />
      <Kitchen />
      <Drinks />
      <GigNights />
      <Building />
      <FindUs />
    </>
  )
}
