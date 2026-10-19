// Checks the built dist/index.html carries every link-preview tag, with
// absolute URLs, and that og.jpg is a 1200x630 JPEG under 300KB.
// Run after `npm run build` with `npm run check:meta`.
import sharp from 'sharp'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const SITE = 'https://alexwilder-dev.github.io/Duke-of-edinburgh/'
const html = await readFile(path.join(root, 'dist', 'index.html'), 'utf8')
const head = html.slice(0, html.indexOf('</head>'))

const metaContent = (attr, name) => {
  const re = new RegExp(`<meta\\s+${attr}="${name.replace(/[:]/g, '\\$&')}"\\s+content="([^"]*)"`, 'i')
  return re.exec(head)?.[1]
}

const problems = []
const need = (label, value, test = (v) => !!v) => {
  if (!test(value)) problems.push(`${label}: ${value ?? 'missing'}`)
  else console.log(`ok  ${label}: ${value}`)
}
const absolute = (v) => typeof v === 'string' && v.startsWith(SITE)

need('<title>', /<title>([^<]+)<\/title>/.exec(head)?.[1])
need('description', metaContent('name', 'description'))
need('og:type', metaContent('property', 'og:type'), (v) => v === 'website')
need('og:site_name', metaContent('property', 'og:site_name'))
need('og:title', metaContent('property', 'og:title'))
need('og:description', metaContent('property', 'og:description'))
need('og:url', metaContent('property', 'og:url'), absolute)
need('og:image', metaContent('property', 'og:image'), (v) => absolute(v) && v.endsWith('/og.jpg'))
need('og:image:width', metaContent('property', 'og:image:width'), (v) => v === '1200')
need('og:image:height', metaContent('property', 'og:image:height'), (v) => v === '630')
need('og:image:alt', metaContent('property', 'og:image:alt'))
need('twitter:card', metaContent('name', 'twitter:card'), (v) => v === 'summary_large_image')
need('twitter:title', metaContent('name', 'twitter:title'))
need('twitter:description', metaContent('name', 'twitter:description'))
need('twitter:image', metaContent('name', 'twitter:image'), absolute)

for (const rel of ['icon', 'apple-touch-icon']) {
  const href = new RegExp(`<link\\s+rel="${rel}"[^>]*href="([^"]+)"`, 'i').exec(head)?.[1]
  need(`link rel=${rel}`, href, absolute)
}
if (/%BASE_URL%/.test(head)) problems.push('head still contains %BASE_URL%')
for (const m of head.matchAll(/(?:content|href)="(\/[^"]*|\.\/[^"]*)"/g)) {
  // the bundled script and stylesheet are Vite's own; everything else must be absolute
  if (!/\/assets\//.test(m[1])) problems.push(`relative URL in head: ${m[1]}`)
}

const og = path.join(root, 'dist', 'og.jpg')
const meta = await sharp(og).metadata()
const { size } = await stat(og)
need('og.jpg', `${meta.width}x${meta.height} ${meta.format} ${(size / 1024).toFixed(1)}KB`, () => meta.width === 1200 && meta.height === 630 && meta.format === 'jpeg' && size < 300 * 1024)

if (problems.length) {
  console.error('\nProblems:\n' + problems.join('\n'))
  process.exit(1)
}
console.log('\nAll link-preview tags present.')
