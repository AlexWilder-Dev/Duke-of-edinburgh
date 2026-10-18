import { Link } from 'react-router-dom'
import { contact, place } from '../data/duke'
import { Chequer, ExtLink } from './bits'
import { HoursTable } from './HoursTable'

export function Footer() {
  return (
    <footer className="footer">
      <Chequer />
      <div className="footer__grid wrap">
        <div className="footer__col footer__col--id">
          <img src={`${import.meta.env.BASE_URL}img/duke-circle.png`} alt="The Duke of Edinburgh" width={96} height={96} loading="lazy" />
          <address>
            {place.street}
            <br />
            {place.area}, {place.city} {place.postcode}
          </address>
          <ExtLink href={place.mapUrl} className="footer__map">
            Open in Maps
          </ExtLink>
        </div>

        <div className="footer__col">
          <h2 className="footer__h">Hours</h2>
          <HoursTable compact />
        </div>

        <div className="footer__col">
          <h2 className="footer__h">Get in touch</h2>
          <ul className="footer__list">
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              Private hire & filming: <a href={`mailto:${contact.hireEmail}`}>{contact.hireEmail}</a>
            </li>
            <li>
              <ExtLink href={contact.instagram.url}>Instagram {contact.instagram.handle}</ExtLink>
            </li>
            <li>
              <ExtLink href={contact.facebook.url}>Facebook {contact.facebook.handle}</ExtLink>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__h">Also</h2>
          <ul className="footer__list">
            <li>
              <ExtLink href={contact.giftCards.url}>Gift cards</ExtLink>
            </li>
            <li>
              <ExtLink href={contact.newsletter}>Newsletter</ExtLink>
            </li>
            <li>
              <ExtLink href={contact.jobs}>Work with us</ExtLink>
            </li>
            <li>
              <Link to="/hire">The building</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__base wrap">
        <p>
          Part of {contact.group}. Please drink responsibly: <ExtLink href={contact.drinkaware}>drinkaware.co.uk</ExtLink>
        </p>
        <p className="footer__credit">Site by AlexWilder-Dev</p>
      </div>
    </footer>
  )
}
