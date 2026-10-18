import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { christmas, contact, DAY_NAMES, hours } from '../data/duke'
import { useClock } from '../lib/clock'
import { useSheets } from '../lib/sheets'
import { isoDate, liveState, sessionOf, spanText } from '../lib/time'
import { ExtLink } from './bits'

const LOGO = `${import.meta.env.BASE_URL}img/duke-circle.png`

const NAV = [
  { to: '/', label: 'Today', end: true },
  { to: '/food', label: 'Food' },
  { to: '/drinks', label: 'Drinks' },
  { to: '/sport', label: 'Sport' },
  { to: '/christmas', label: 'Christmas', xmas: true },
  { to: '/hire', label: 'Hire & history' },
  { to: '/visit', label: 'Find us' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const { openBooking } = useSheets()
  const { now } = useClock()
  const loc = useLocation()
  const live = liveState(now)
  const s = sessionOf(now)
  const xmasOn = isoDate(now) >= christmas.prominentFrom && isoDate(now) <= christmas.prominentUntil

  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => {
    document.documentElement.classList.toggle('no-scroll', open)
  }, [open])

  return (
    <header className="masthead">
      <div className="masthead__bar wrap">
        <Link to="/" className="fascia" aria-label="The Duke of Edinburgh, Brixton: home">
          <span className="fascia__board fascia__board--l">The Duke of</span>
          <img src={LOGO} alt="" className="fascia__logo" width={44} height={44} />
          <span className="fascia__board fascia__board--r">Edinburgh</span>
        </Link>

        <nav className="masthead__nav" aria-label="Main">
          {NAV.filter((n) => n.to !== '/').map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `navlink ${n.xmas && xmasOn ? 'navlink--xmas' : ''} ${isActive ? 'is-active' : ''}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="masthead__actions">
          <span className={`masthead__live mono ${live.open ? 'is-open' : ''}`} title={live.sub}>
            <i aria-hidden="true" />
            {live.open ? 'Open' : 'Closed'}
          </span>
          <button className="btn btn--cream btn--small" onClick={() => openBooking({})}>
            Book
          </button>
          <button className="burger" aria-expanded={open} aria-controls="drawer" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="drawer"
            className="drawer lattice"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.32, ease: [0.3, 0.7, 0.2, 1] }}
          >
            <nav aria-label="Menu" className="drawer__nav wrap">
              {NAV.map((n, i) => (
                <motion.div key={n.to} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + i * 0.035 }}>
                  <NavLink to={n.to} end={n.end} className={({ isActive }) => `drawer__link ${n.xmas && xmasOn ? 'drawer__link--xmas' : ''} ${isActive ? 'is-active' : ''}`}>
                    {n.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="drawer__foot wrap">
              <p className="mono">
                {DAY_NAMES[s.dow]}: {spanText(hours.pub[s.dow])} · garden till 9:30pm
              </p>
              <p>
                <ExtLink href={contact.giftCards.url}>Gift cards</ExtLink> · <ExtLink href={contact.instagram.url}>{contact.instagram.handle}</ExtLink> ·{' '}
                <ExtLink href={contact.facebook.url}>Facebook</ExtLink>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
