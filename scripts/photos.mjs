// One-off: turn the photos saved in research/ into web sizes under public/img/,
// and the circle logo into favicons. Run with `npm run photos`.
import sharp from 'sharp'
import { mkdir, readdir, readFile, rm } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const src = path.join(root, 'research', 'photos')
const out = path.join(root, 'public', 'img')
await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })

const widths = [720, 1440]
// only the photos the site uses (the keys in src/data/photos.ts)
const manifest = await readFile(path.join(root, 'src', 'data', 'photos.ts'), 'utf8')
const used = new Set([...manifest.matchAll(/^\s+'?([a-z0-9-]+)'?: \{ w:/gm)].map((m) => m[1]))
const files = (await readdir(src)).filter((f) => /\.(jpe?g|png)$/i.test(f) && used.has(f.replace(/\.\w+$/, '')))

for (const file of files) {
  const name = file.replace(/\.(jpe?g|png)$/i, '')
  for (const w of widths) {
    await sharp(path.join(src, file))
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: w > 1000 ? 72 : 76 })
      .toFile(path.join(out, `${name}-${w}.webp`))
  }
  console.log('photo', name)
}

const logo = path.join(root, 'research', 'logo', 'duke-circle.png')
await sharp(logo).resize(640).png({ compressionLevel: 9, palette: true }).toFile(path.join(out, 'duke-circle.png'))
for (const [size, file] of [
  [32, 'favicon-32.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
]) {
  // apple-touch-icon can't be transparent, so it sits on the logo's own plum
  const img = sharp(logo).resize(size)
  const target = path.join(root, 'public', file)
  if (file === 'apple-touch-icon.png') {
    await img.flatten({ background: '#392544' }).png().toFile(target)
  } else {
    await img.png().toFile(target)
  }
  console.log('icon', file)
}
