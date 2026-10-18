// One-off: build public/og.jpg (1200x630) for link previews from the summer
// garden photo with the circle logo on it. Run with `npm run og`.
import sharp from 'sharp'
import { stat } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const photo = path.join(root, 'research', 'photos', 'garden-summer-2026.jpg')
const logo = path.join(root, 'research', 'logo', 'duke-circle.png')
const target = path.join(root, 'public', 'og.jpg')

const W = 1200
const H = 630
const LOGO = 250

// the right edge of the photo is a dark post, so scale up a touch and crop from the left
const base = await sharp(photo)
  .resize({ width: 1380 })
  .extract({ left: 0, top: 150, width: W, height: H })
  .toBuffer()

// plum wash from the left so the logo sits on the logo's own colour
const wash = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#392544" stop-opacity="0.7"/>
      <stop offset="0.3" stop-color="#392544" stop-opacity="0.25"/>
      <stop offset="0.48" stop-color="#392544" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
</svg>`)

const ring = Buffer.from(`
<svg width="${LOGO + 24}" height="${LOGO + 24}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${(LOGO + 24) / 2}" cy="${(LOGO + 24) / 2}" r="${LOGO / 2 + 10}" fill="#f5efc3"/>
</svg>`)

const logoBuf = await sharp(logo).resize(LOGO).png().toBuffer()

await sharp(base)
  .composite([
    { input: wash, top: 0, left: 0 },
    { input: ring, top: Math.round((H - LOGO) / 2) - 12, left: 72 - 12 },
    { input: logoBuf, top: Math.round((H - LOGO) / 2), left: 72 },
  ])
  .jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: '4:2:0' })
  .toFile(target)

const meta = await sharp(target).metadata()
const { size } = await stat(target)
console.log(`og.jpg ${meta.width}x${meta.height} ${meta.format} ${(size / 1024).toFixed(1)}KB`)
if (meta.width !== W || meta.height !== H || size > 300 * 1024) {
  throw new Error('og.jpg must be 1200x630 and under 300KB')
}
