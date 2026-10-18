import { contact, gigs, hours, place } from '../data/duke'
import { ExtLink, Eyebrow, money, Photo, Star } from '../components/bits'
import { HoursTable } from '../components/HoursTable'
import { MapCard } from './Home'
import { clock } from '../lib/time'

export function Visit() {
  return (
    <div className="page page--visit">
      <header className="visithead wrap">
        <Eyebrow>Find us</Eyebrow>
        <h1 className="display">
          {place.street}, {place.area} {place.postcode}
        </h1>
        <p>{place.corner}. A short walk from Brixton station and not much further from Clapham North. All are welcome.</p>
      </header>

      <div className="wrap visit__grid">
        <section aria-labelledby="getting-title" className="visit__card">
          <h2 id="getting-title" className="serif-title">
            Getting here
          </h2>
          <MapCard />
          <ul className="stations">
            {place.stations.map((s) => (
              <li key={s.name}>
                <ExtLink href={s.url}>
                  <b>{s.name}</b> <span>{s.line}</span>
                </ExtLink>
              </li>
            ))}
          </ul>
          <p>
            <b>Parking.</b> {place.parking}
          </p>
          <p>
            <b>Access.</b> {place.access} <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
          <ExtLink href={place.directionsUrl} className="btn btn--plum">
            Directions
          </ExtLink>
        </section>

        <section aria-labelledby="hours-title" className="visit__card">
          <h2 id="hours-title" className="serif-title">
            Opening times
          </h2>
          <HoursTable kitchen />
          <p className="mono visit__kids">
            <Star size={11} /> Under-18s until {clock(hours.under18Until[1])} Sunday to Thursday, {clock(hours.under18Until[5])} Friday and Saturday. {hours.under18Note}
          </p>
          <p>
            <b>Dogs.</b> {place.dogs}
          </p>
        </section>

        <section aria-labelledby="gig-title" className="visit__card visit__card--plum">
          <h2 id="gig-title" className="serif-title">
            Going to the Academy?
          </h2>
          <p>{gigs.line}</p>
          <p>
            <b>Bag drop.</b> {gigs.bagDrop}
          </p>
          <ExtLink href={gigs.venueUrl} className="btn btn--cream">
            O2 Academy Brixton listings
          </ExtLink>
        </section>

        <section aria-labelledby="gift-title" className="visit__card visit__card--gift">
          <h2 id="gift-title" className="serif-title">
            Gift cards
          </h2>
          <p>Give the gift of the Duke. {contact.giftCards.note}</p>
          <ul className="giftamounts" aria-label="Amounts">
            {contact.giftCards.amounts.map((a) => (
              <li key={a}>{money(a)}</li>
            ))}
          </ul>
          <ExtLink href={contact.giftCards.url} className="btn btn--plum">
            Buy a gift card
          </ExtLink>
        </section>

        <section aria-labelledby="contact-title" className="visit__card visit__card--wide">
          <h2 id="contact-title" className="serif-title">
            Contact
          </h2>
          <dl className="contactlist">
            <div>
              <dt>General</dt>
              <dd>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </dd>
            </div>
            <div>
              <dt>Already booked?</dt>
              <dd>
                {contact.bookingsNote} <a href={`mailto:${contact.bookingsEmail}`}>{contact.bookingsEmail}</a>
              </dd>
            </div>
            <div>
              <dt>Private hire & filming</dt>
              <dd>
                <a href={`mailto:${contact.hireEmail}`}>{contact.hireEmail}</a>
              </dd>
            </div>
            <div>
              <dt>Instagram</dt>
              <dd>
                <ExtLink href={contact.instagram.url}>{contact.instagram.handle}</ExtLink>
              </dd>
            </div>
            <div>
              <dt>Facebook</dt>
              <dd>
                <ExtLink href={contact.facebook.url}>{contact.facebook.handle}</ExtLink>
              </dd>
            </div>
            <div>
              <dt>Work with us</dt>
              <dd>
                <ExtLink href={contact.jobs}>Current jobs</ExtLink>, or email your CV to <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </dd>
            </div>
            <div>
              <dt>Not happy?</dt>
              <dd>{contact.complaints}</dd>
            </div>
          </dl>
          <p className="field-hint">
            <ExtLink href={contact.newsletter}>Subscribe</ExtLink> for the latest news and offers.
          </p>
        </section>

        <Photo name="leaded-window-fern" className="visit__pic" sizes="(min-width: 900px) 30vw, 100vw" />
      </div>
    </div>
  )
}
