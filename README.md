# The Duke of Edinburgh, Brixton — demo site

A speculative front-end demo for The Duke of Edinburgh, 204 Ferndale Road, Brixton SW9 8AG. It's built to show the owners what their site could do. The demo has no CMS, database, payments or booking integration: the booking and Christmas enquiry sheets end in a mock confirmation.

Everything on it comes from the pub. That covers their own site, menus, photos and Instagram, the Historic England list entry, CAMRA, and published press about the garden. Research and sources are in [`research/notes.md`](research/notes.md).

## What's here

- **Today at the Duke.** The first screen reads the London clock. It shows whether the pub is open and till when, whether the garden is still open (it closes at 9:30pm), the kitchen hours, today's Jerk Valley deal, the happy hour window, the under-18 cut-off, and anything on the screens. Swipe it, or use the day tabs, to see the rest of the week.
- **The jumbo screen.** A fixtures board where every Book button opens the booking sheet with that match's date and kick-off filled in.
- **Booking sheet.** The house rules are shown before you submit: the £25 card authorisation, tables held for an hour, first come first served, garden 9:30pm, commentary inside only, and under-18s. The sheet warns you about a garden table after 9:30 or kids after the cut-off.
- **Christmas.** The Jerk Valley festive menu and a party enquiry sheet: date, group size, 2 or 3 courses, with a live food estimate. It's featured on the home page until early January.
- **Menus as real pages.** Food has every-day, Sunday and Christmas tabs, a V/VE filter, the halal note and flagged weekend specials. Drinks are laid out like their 2026 drinks menu.
- **The rest.** Sport, the garden, gig nights and the bag drop, private hire and filming with the building's history, gift cards (links to their real shop), getting there, contact, and Drinkaware.

## Demo clock

Add `?at=` to show any moment, in London time:

```
/duke-of-edinburgh-brixton/?at=2026-11-08T14:00#/
```

A "Demo clock · reset" pill appears on the board while it's set.

## Data

Hours, deals, menus, fixtures, the Christmas menu and contact details all live in [`src/data/duke.ts`](src/data/duke.ts). Photos are listed in `src/data/photos.ts`. Credited press lines are in `src/data/press.ts`.

## Run it

```
npm install
npm run dev        # local
npm run build      # production build into dist/
npm run check:meta # verify link-preview tags and og.jpg in dist/
```

One-off asset scripts (need the files in `research/`):

```
npm run photos     # web sizes of the pub's photos into public/img, plus favicons
npm run og         # public/og.jpg, 1200x630, garden photo with the logo
```

## Deploy

Vite + React + TypeScript + Framer Motion, HashRouter. It's built for GitHub Pages under `/duke-of-edinburgh-brixton/` (`base` in `vite.config.ts`). The link-preview tags in `index.html` use absolute URLs on that path. `.github/workflows/deploy.yml` builds and publishes on push to `main`.

Photos, logo and menu content belong to The Duke of Edinburgh / Rose Pubs and The Jerk Valley of London.

Site by AlexWilder-Dev
