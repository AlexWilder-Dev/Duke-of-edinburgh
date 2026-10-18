import { MotionConfig } from 'framer-motion'
import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BookingSheet } from './components/BookingSheet'
import { ChristmasSheet } from './components/ChristmasSheet'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ClockProvider } from './lib/clock'
import { SheetProvider } from './lib/sheets'
import { Christmas } from './pages/Christmas'
import { Drinks } from './pages/Drinks'
import { Food } from './pages/Food'
import { Hire } from './pages/Hire'
import { Home } from './pages/Home'
import { Sport } from './pages/Sport'
import { Visit } from './pages/Visit'

const TITLES: Record<string, string> = {
  '/': 'The Duke of Edinburgh, Brixton',
  '/food': 'Food by Jerk Valley · The Duke of Edinburgh, Brixton',
  '/drinks': 'Drinks · The Duke of Edinburgh, Brixton',
  '/sport': 'Sport & fixtures · The Duke of Edinburgh, Brixton',
  '/christmas': 'Christmas parties · The Duke of Edinburgh, Brixton',
  '/hire': 'Private hire, filming & history · The Duke of Edinburgh, Brixton',
  '/visit': 'Find us · The Duke of Edinburgh, Brixton',
}

function RouteEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = TITLES[pathname] ?? TITLES['/']
  }, [pathname])
  return null
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <ClockProvider>
          <SheetProvider>
            <RouteEffects />
            <button className="skip" onClick={() => document.getElementById('main')?.focus()}>
              Skip to content
            </button>
            <Header />
            <main id="main" tabIndex={-1}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/food" element={<Food />} />
                <Route path="/drinks" element={<Drinks />} />
                <Route path="/sport" element={<Sport />} />
                <Route path="/christmas" element={<Christmas />} />
                <Route path="/hire" element={<Hire />} />
                <Route path="/visit" element={<Visit />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <BookingSheet />
            <ChristmasSheet />
          </SheetProvider>
        </ClockProvider>
      </HashRouter>
    </MotionConfig>
  )
}
