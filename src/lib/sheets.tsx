import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type BookingPrefill = {
  date?: string
  time?: string
  occasion?: string
  fixtureId?: string
  area?: 'inside' | 'garden' | 'either'
}

export type ChristmasPrefill = { courses?: 2 | 3 }

type Sheets = {
  booking: BookingPrefill | null
  christmas: ChristmasPrefill | null
  openBooking: (prefill?: BookingPrefill) => void
  openChristmas: (prefill?: ChristmasPrefill) => void
  close: () => void
}

const SheetContext = createContext<Sheets | null>(null)

export function SheetProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingPrefill | null>(null)
  const [christmas, setChristmas] = useState<ChristmasPrefill | null>(null)

  const openBooking = useCallback((prefill: BookingPrefill = {}) => {
    setChristmas(null)
    setBooking(prefill)
  }, [])
  const openChristmas = useCallback((prefill: ChristmasPrefill = {}) => {
    setBooking(null)
    setChristmas(prefill)
  }, [])
  const close = useCallback(() => {
    setBooking(null)
    setChristmas(null)
  }, [])

  const value = useMemo(
    () => ({ booking, christmas, openBooking, openChristmas, close }),
    [booking, christmas, openBooking, openChristmas, close],
  )
  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
}

export function useSheets() {
  const ctx = useContext(SheetContext)
  if (!ctx) throw new Error('useSheets outside SheetProvider')
  return ctx
}
