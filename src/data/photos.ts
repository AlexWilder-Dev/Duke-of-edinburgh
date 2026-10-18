// The pub's own photos, from dukeofedinburghpub.com/catalogue/wp-content/uploads/.
// Web sizes are generated into public/img by scripts/photos.mjs.

export type PhotoKey = keyof typeof photos

export const photos = {
  'garden-summer-2026': { w: 2048, h: 1374, alt: 'The garden on a summer afternoon: mustard umbrellas, festoon bulbs and every bench taken.' },
  'garden-friends-2026': { w: 2048, h: 1358, alt: 'A table of friends with pints under the garden pergola.' },
  'jumbo-screen-2026': { w: 2048, h: 1358, alt: 'Football on the jumbo screen under its timber canopy at the end of the garden.' },
  'dj-saturday-2026': { w: 2048, h: 1358, alt: 'A DJ playing to a packed room inside on a Saturday night.' },
  'disco-crowd-2026': { w: 1638, h: 2048, alt: 'The disco ball hanging over a busy dance floor.' },
  'disco-ball': { w: 1202, h: 1503, alt: 'The Duke’s disco ball, close up.' },
  exterior: { w: 1080, h: 1350, alt: 'The red-brick front on Ferndale Road, with the ghost sign: If it’s Truman’s it is beer!' },
  'garden-crowd-spring': { w: 1370, h: 2048, alt: 'The garden in early spring, benches full and the trees still bare.' },
  'stout-at-the-bar': { w: 1638, h: 2048, alt: 'A pint of stout settling on the bar.' },
  'leaded-window-fern': { w: 1598, h: 1998, alt: 'A fern on the sill of one of the original leaded windows.' },
  'sport-garden-celebration': { w: 1638, h: 2048, alt: 'A fan celebrating under a garden umbrella.' },
  'bar-back': { w: 2048, h: 1367, alt: 'The oak bar with its signboard, panelled counter and chequer-tiled border.' },
  'bar-taps': { w: 2048, h: 1367, alt: 'The taps along the panelled oak bar, Brixton Brewery among them.' },
  'saloon-window-tables': { w: 2048, h: 1367, alt: 'Tables under the leaded windows in the old saloon.' },
  'panelled-room': { w: 2048, h: 1367, alt: 'Light oak panelling, globe pendants and round tables.' },
  'long-room': { w: 2048, h: 1367, alt: 'Looking down the long panelled room towards the door.' },
  'pool-table': { w: 2048, h: 1367, alt: 'The red baize pool table in front of the panelled bar.' },
  'garden-empty-umbrellas': { w: 2048, h: 1367, alt: 'The garden before opening: picnic benches under open umbrellas.' },
  'sport-inside-screens': { w: 2048, h: 2048, alt: 'A full house watching the projector screen inside.' },
  'jv-spread': { w: 1637, h: 2048, alt: 'A spread from Jerk Valley: jerk chicken, mac and cheese, wings and loaded fries.' },
  'jv-wings': { w: 1638, h: 2048, alt: 'A bowl of glazed wings with chilli and spring onion.' },
  'jv-burger': { w: 1637, h: 2048, alt: 'A loaded burger in a brioche bun on an enamel plate.' },
  'jv-wrap': { w: 1637, h: 2048, alt: 'A jerk chicken wrap in a basket with salad and sauce.' },
  'jv-jerk-fries': { w: 1637, h: 2048, alt: 'Jerk chicken over fries with spiced mayo and BBQ sauce.' },
  'jv-jerk-cocktail': { w: 1637, h: 2048, alt: 'Jerk chicken and fries next to a margarita and a pint.' },
  'xmas-table-candle': { w: 1638, h: 2048, alt: 'A festive table by candlelight, roast plates and gold crackers.' },
  'xmas-crackers': { w: 1638, h: 2048, alt: 'Pulling a gold cracker over the Christmas plates.' },
  'xmas-salmon': { w: 1638, h: 2048, alt: 'Smoked salmon on sourdough toast, a festive starter.' },
  'xmas-cheers': { w: 1638, h: 2048, alt: 'Two glasses of fizz raised across the table.' },
  'xmas-banner': { w: 2048, h: 795, alt: 'Christmas Time at the Duke.' },
} as const

export const img = (key: PhotoKey, w: 720 | 1440 = 720) => `${import.meta.env.BASE_URL}img/${key}-${w}.webp`
