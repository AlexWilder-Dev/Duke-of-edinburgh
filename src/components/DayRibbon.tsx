import { motion, useReducedMotion } from 'framer-motion'
import { clock, koToMin, type DayPlan } from '../lib/time'

const START = 12 * 60
const END = 25 * 60
const W = 340
const LABEL = 74
const ROW = 19
const BAR = 9

const x = (min: number) => LABEL + ((Math.min(Math.max(min, START), END) - START) / (END - START)) * (W - LABEL - 8)

const TICKS = [12, 15, 18, 21, 24].map((h) => h * 60)

/** The day drawn as lanes: pub, garden, kitchen, happy hour, roasts, under-18s, kick-offs. */
export function DayRibbon({ plan, nowMin }: { plan: DayPlan; nowMin?: number }) {
  const reduce = useReducedMotion()
  const lanes = plan.lanes
  const screenRow = plan.fixtures.length ? lanes.length : -1
  const rows = lanes.length + (screenRow >= 0 ? 1 : 0)
  const H = rows * ROW + 26

  return (
    <figure className="ribbon">
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {TICKS.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={4} y2={H - 18} className="ribbon__grid" />
            <text x={x(t)} y={H - 5} className="ribbon__tick" textAnchor="middle">
              {t === 1440 ? '12am' : clock(t)}
            </text>
          </g>
        ))}
        {lanes.map((lane, i) => {
          const y = 6 + i * ROW
          const [a, b] = lane.span
          if (b <= a) return null
          return (
            <g key={lane.key}>
              <text x={0} y={y + BAR - 1} className="ribbon__label">
                {lane.label}
              </text>
              <rect x={LABEL} y={y} width={W - LABEL - 8} height={BAR} rx={1} className="ribbon__track" />
              <motion.rect
                x={x(a)}
                y={y}
                height={BAR}
                rx={1}
                className={`ribbon__bar ribbon__bar--${lane.key}`}
                initial={reduce ? false : { width: 0 }}
                animate={{ width: x(b) - x(a) }}
                transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.2, 0.7, 0.2, 1] }}
              />
            </g>
          )
        })}
        {screenRow >= 0 && (
          <g>
            <text x={0} y={6 + screenRow * ROW + BAR - 1} className="ribbon__label">
              Kick-off
            </text>
            {plan.fixtures.map((f, i) => {
              const k = koToMin(f.ko)
              const cy = 6 + screenRow * ROW + BAR / 2
              return (
                <g key={f.id}>
                  <rect x={x(k) - 5} y={cy - 4.5} width={10} height={7} rx={1} className="ribbon__screen" />
                  <line x1={x(k)} x2={x(k)} y1={cy + 2.5} y2={cy + 5} className="ribbon__screen-leg" />
                  {i === plan.fixtures.length - 1 || koToMin(plan.fixtures[i + 1].ko) - k > 70 ? (
                    <text x={x(k) + 8} y={cy + 3.5} className="ribbon__ko">
                      {f.ko}
                    </text>
                  ) : null}
                </g>
              )
            })}
          </g>
        )}
        {nowMin !== undefined && nowMin >= START && nowMin <= END && (
          <g className="ribbon__now">
            <line x1={x(nowMin)} x2={x(nowMin)} y1={0} y2={H - 18} />
            <circle cx={x(nowMin)} cy={2} r={2.6} />
          </g>
        )}
      </svg>
      <figcaption className="sr-only">
        {lanes.map((l) => `${l.label} ${clock(l.span[0])} to ${clock(l.span[1])}`).join('. ')}
      </figcaption>
    </figure>
  )
}
