import type { CSSProperties, ReactNode } from 'react'
import { img, photos, type PhotoKey } from '../data/photos'

/** The eight-point star from their drinks menu and posters. */
export function Star({ size = 14, className = '' }: { size?: number; className?: string }) {
  const pts: string[] = []
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? 10 : 3.6
    const a = (Math.PI / 8) * i - Math.PI / 2
    pts.push(`${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`)
  }
  return (
    <svg className={`star ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <polygon points={pts.join(' ')} fill="currentColor" />
    </svg>
  )
}

/** Two rows of the saloon counter's chequer tiles. */
export function Chequer({ className = '' }: { className?: string }) {
  return <div className={`chequer ${className}`} aria-hidden="true" />
}

type PhotoProps = {
  name: PhotoKey
  className?: string
  sizes?: string
  eager?: boolean
  style?: CSSProperties
  alt?: string
}

export function Photo({ name, className = '', sizes = '(min-width: 900px) 50vw, 100vw', eager, style, alt }: PhotoProps) {
  const p = photos[name]
  return (
    <img
      className={`photo ${className}`}
      src={img(name, 720)}
      srcSet={`${img(name, 720)} 720w, ${img(name, 1440)} 1440w`}
      sizes={sizes}
      width={p.w}
      height={p.h}
      alt={alt ?? p.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={style}
    />
  )
}

/** A photo set under one of the bar back's shallow four-centred arches. */
export function Arch({ name, caption, className = '', sizes, eager }: { name: PhotoKey; caption?: ReactNode; className?: string; sizes?: string; eager?: boolean }) {
  return (
    <figure className={`arch ${className}`}>
      <div className="arch__frame">
        <Photo name={name} sizes={sizes ?? '(min-width: 900px) 30vw, 80vw'} eager={eager} />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

/** The disco ball, turning. Saturdays only. */
export function DiscoBall({ size = 64 }: { size?: number }) {
  const tiles: ReactNode[] = []
  for (let row = -4; row <= 4; row++) {
    const y = 32 + row * 6.4
    const half = Math.sqrt(Math.max(0, 28 * 28 - (row * 6.4) ** 2))
    const n = Math.max(2, Math.round(half / 3.2))
    for (let i = 0; i < n; i++) {
      const x = 32 - half + (i + 0.5) * ((half * 2) / n)
      tiles.push(<rect key={`${row}-${i}`} x={x - 2.6} y={y - 2.6} width={5.2} height={5.2} rx={0.6} className={`disco__tile disco__tile--${(i + row + 8) % 4}`} />)
    }
  }
  return (
    <svg className="disco" width={size} height={size + 10} viewBox="0 -10 64 74" aria-hidden="true">
      <line x1="32" y1="-10" x2="32" y2="4" stroke="currentColor" strokeWidth="1" />
      <defs>
        <clipPath id="disco-clip">
          <circle cx="32" cy="32" r="28" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r="28" className="disco__ball" />
      <g clipPath="url(#disco-clip)" className="disco__tiles">
        {tiles}
      </g>
    </svg>
  )
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow ${className}`}>
      <Star size={11} />
      <span>{children}</span>
    </p>
  )
}

export function ExtLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

export const money = (n: number) => `£${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`
export const priceText = (p?: string) => (p ? `£${p.includes('.') ? Number(p).toFixed(2) : p}` : '')
