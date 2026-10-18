import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { londonWallNow, parseAt, readAtParam } from './time'

type Clock = {
  /** London wall-clock "now" (see time.ts) */
  now: Date
  /** true when ?at= is steering the clock */
  demo: boolean
  resetDemo: () => void
}

const ClockContext = createContext<Clock | null>(null)

function offsetFromUrl(base = londonWallNow()): number | null {
  const at = parseAt(readAtParam())
  return at ? at.getTime() - base.getTime() : null
}

export function ClockProvider({ children }: { children: ReactNode }) {
  // one reading of the clock for both, so ?at=…T14:00 shows 14:00, not 13:59
  const [start] = useState(() => londonWallNow())
  const [offset, setOffset] = useState<number | null>(() => offsetFromUrl(start))
  const [tick, setTick] = useState(start)

  useEffect(() => {
    const id = window.setInterval(() => setTick(londonWallNow()), 15_000)
    // only re-anchor when ?at= itself changes, not on every page change
    let lastAt = readAtParam()
    const onUrl = () => {
      const at = readAtParam()
      if (at === lastAt) return
      lastAt = at
      const next = offsetFromUrl()
      if (next !== null) setOffset(next)
    }
    window.addEventListener('hashchange', onUrl)
    window.addEventListener('popstate', onUrl)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('hashchange', onUrl)
      window.removeEventListener('popstate', onUrl)
    }
  }, [])

  const resetDemo = useCallback(() => {
    setOffset(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('at')
    const [path, query = ''] = url.hash.split('?')
    const hq = new URLSearchParams(query)
    hq.delete('at')
    url.hash = hq.toString() ? `${path}?${hq}` : path
    window.history.replaceState(null, '', url)
  }, [])

  const value = useMemo<Clock>(
    () => ({ now: new Date(tick.getTime() + (offset ?? 0)), demo: offset !== null, resetDemo }),
    [tick, offset, resetDemo],
  )

  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>
}

export function useClock() {
  const ctx = useContext(ClockContext)
  if (!ctx) throw new Error('useClock outside ClockProvider')
  return ctx
}
