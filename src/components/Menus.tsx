import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { christmas, type Diet, type MenuSection } from '../data/duke'
import { money, priceText } from './bits'

export type DietFilter = 'all' | 'V' | 'VE'

const matches = (diet: Diet | undefined, f: DietFilter) => f === 'all' || (f === 'V' ? diet === 'V' || diet === 'VE' : diet === 'VE')

export function DietTag({ diet }: { diet?: Diet }) {
  if (!diet) return null
  return (
    <abbr className={`diet diet--${diet}`} title={diet === 'V' ? 'Vegetarian' : 'Vegan'}>
      {diet}
    </abbr>
  )
}

export function MenuList({ sections, filter, weekendNow }: { sections: MenuSection[]; filter: DietFilter; weekendNow?: boolean }) {
  const reduce = useReducedMotion()
  const visible = sections
    .map((s) => ({ ...s, items: s.items.filter((i) => matches(i.diet, filter)) }))
    .filter((s) => s.items.length > 0)

  if (!visible.length) return <p className="menu__empty">Nothing on this menu for that filter.</p>

  return (
    <div className="menu">
      <AnimatePresence initial={false}>
        {visible.map((s) => (
          <motion.section
            key={s.id}
            layout={!reduce}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`menu__section ${s.weekend ? 'menu__section--weekend' : ''}`}
            aria-labelledby={`m-${s.id}`}
          >
            <header className="menu__head">
              <h3 id={`m-${s.id}`}>{s.title}</h3>
              {s.weekend && <span className={`flag ${weekendNow ? 'flag--on' : ''}`}>{weekendNow ? 'On this weekend' : 'Fri–Sun only'}</span>}
            </header>
            {s.intro && <p className="menu__intro">{s.intro}</p>}
            <ul>
              {s.items.map((i) => (
                <li key={i.name} className="dish">
                  <div className="dish__line">
                    <span className="dish__name">
                      {i.name} <DietTag diet={i.diet} />
                    </span>
                    {i.price && <span className="dish__price">{priceText(i.price)}</span>}
                  </div>
                  {i.desc && <p className="dish__desc">{i.desc}</p>}
                  {i.extra && <span className="dish__extra">{i.extra}</span>}
                </li>
              ))}
            </ul>
          </motion.section>
        ))}
      </AnimatePresence>
    </div>
  )
}

type Course = { name: string; desc: string; diet?: Diet }

export function FestiveMenu({ filter = 'all' }: { filter?: DietFilter }) {
  const groups: [string, Course[]][] = [
    ['Starters', christmas.menu.starters],
    ['Mains', christmas.menu.mains],
    ['Desserts', christmas.menu.desserts],
  ]
  return (
    <div className="festive">
      <p className="festive__prices">
        <span>
          2 courses <b>{money(christmas.prices.two)}</b>
        </span>
        <span>
          3 courses <b>{money(christmas.prices.three)}</b>
        </span>
      </p>
      {groups.map(([title, items]) => {
        const shown = items.filter((i) => matches(i.diet, filter))
        return (
          <section key={title} className="festive__group" aria-label={title}>
            <h3>{title}</h3>
            {shown.length ? (
              <ul>
                {shown.map((i) => (
                  <li key={i.name}>
                    <span className="festive__name">
                      {i.name} <DietTag diet={i.diet} />
                    </span>
                    <span className="festive__desc">{i.desc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="festive__none">Nothing marked {filter === 'VE' ? 'vegan' : 'vegetarian'} here. Ask the team.</p>
            )}
          </section>
        )
      })}
    </div>
  )
}

export function DietFilters({ value, onChange }: { value: DietFilter; onChange: (f: DietFilter) => void }) {
  const opts: [DietFilter, string][] = [
    ['all', 'Everything'],
    ['V', 'Vegetarian'],
    ['VE', 'Vegan'],
  ]
  return (
    <div className="filters" role="radiogroup" aria-label="Filter the menu">
      {opts.map(([v, label]) => (
        <button key={v} role="radio" aria-checked={value === v} className={`filter ${value === v ? 'is-on' : ''}`} onClick={() => onChange(v)}>
          {v !== 'all' && <span className={`diet diet--${v}`}>{v}</span>}
          {label}
        </button>
      ))}
    </div>
  )
}
