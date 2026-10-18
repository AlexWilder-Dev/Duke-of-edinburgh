import { DAY_NAMES, hours, type DayIndex } from '../data/duke'
import { useClock } from '../lib/clock'
import { clock, sessionOf, spanText } from '../lib/time'

const ORDER: DayIndex[] = [1, 2, 3, 4, 5, 6, 0]

/** Opening times, Monday first, today marked. Kitchen hours optional. */
export function HoursTable({ compact, kitchen }: { compact?: boolean; kitchen?: boolean }) {
  const { now } = useClock()
  const today = sessionOf(now).dow
  return (
    <table className={`hours ${compact ? 'hours--compact' : ''}`}>
      <thead className={compact ? 'sr-only' : ''}>
        <tr>
          <th scope="col">Day</th>
          <th scope="col">Pub</th>
          {kitchen && <th scope="col">Kitchen</th>}
        </tr>
      </thead>
      <tbody>
        {ORDER.map((d) => (
          <tr key={d} className={d === today ? 'is-today' : ''}>
            <th scope="row">{compact ? DAY_NAMES[d].slice(0, 3) : DAY_NAMES[d]}</th>
            <td>{spanText(hours.pub[d])}</td>
            {kitchen && <td>{spanText(hours.kitchen[d])}</td>}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={kitchen ? 3 : 2}>Garden closes {clock(hours.gardenCloses)} every day, unless there’s a screening on.</td>
        </tr>
      </tfoot>
    </table>
  )
}
