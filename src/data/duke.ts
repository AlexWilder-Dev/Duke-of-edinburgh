// Everything the site says about the pub lives here: hours, deals, menus,
// fixtures, the Christmas menu and contact details. Times are minutes after
// midnight, London time; a close after midnight runs past 1440 (1am = 1500).
// Day keys follow Date.getDay(): 0 = Sunday … 6 = Saturday.

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type Span = readonly [open: number, close: number]
export type Diet = 'V' | 'VE'

export const h = (hh: number, mm = 0) => hh * 60 + mm

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

/* ------------------------------------------------------------------ hours */

export const hours = {
  pub: {
    0: [h(12), h(23)],
    1: [h(15), h(23)],
    2: [h(15), h(23)],
    3: [h(15), h(23)],
    4: [h(15), h(23)],
    5: [h(12), h(24)],
    6: [h(12), h(25)],
  } satisfies Record<DayIndex, Span>,
  // the garden opens with the pub and always shuts at 21:30
  // "(unless we've got some sort of screening on!)"
  gardenCloses: h(21, 30),
  kitchen: {
    0: [h(12), h(20)],
    1: [h(16), h(21)],
    2: [h(16), h(21)],
    3: [h(16), h(21)],
    4: [h(16), h(21)],
    5: [h(15), h(21)],
    6: [h(12), h(21)],
  } satisfies Record<DayIndex, Span>,
  // under-18s welcome until 7pm Sunday–Thursday, 5pm Friday & Saturday
  under18Until: { 0: h(19), 1: h(19), 2: h(19), 3: h(19), 4: h(19), 5: h(17), 6: h(17) } satisfies Record<DayIndex, number>,
  under18Note:
    'If larger sporting events are on this may be brought earlier to keep under-18s safe. The manager’s decision is always final.',
}

/* ------------------------------------------------------- happy hour & deals */

export const happyHour = {
  offer: '2 for £13',
  what: 'cocktails',
  windows: {
    0: { span: [h(12), h(18)], name: 'Sunday Happy Hour' },
    1: { span: [h(15), h(19)], name: 'Happy Hour' },
    2: { span: [h(15), h(19)], name: 'Happy Hour' },
    3: { span: [h(15), h(19)], name: 'Happy Hour' },
    4: { span: [h(15), h(19)], name: 'Happy Hour' },
    5: { span: [h(15), h(20)], name: 'Friday Feels' },
  } as Partial<Record<DayIndex, { span: Span; name: string }>>,
}

export type Deal = {
  title: string
  detail: string
  small?: string
  kind: 'kitchen' | 'bar'
}

export const deals: Partial<Record<DayIndex, Deal[]>> = {
  1: [{ kind: 'kitchen', title: 'Two burgers or wraps for £16', detail: 'Jerk Valley’s Monday deal.', small: 'Sides not included. Must be two of the same.' }],
  2: [{ kind: 'kitchen', title: 'Free side with any burger', detail: 'Jerk Valley’s Tuesday deal.' }],
  3: [
    { kind: 'kitchen', title: 'Wing Wednesday: 10 wings for £12', detail: 'Crispy fried BBQ, tropical mango glaze or grilled jerk BBQ.' },
    { kind: 'bar', title: 'Wine Wednesday: £20 a bottle', detail: 'House red, white or rosé.' },
  ],
}

export const weekendSpecials = {
  days: [5, 6, 0] as DayIndex[],
  label: 'Weekend specials, Friday to Sunday',
}

export const sundayRoast = {
  span: [h(12), h(20)] as Span,
  note: 'While stocks last.',
  season: 'Every Sunday through the colder months',
}

export const saturdayDJs = {
  day: 6 as DayIndex,
  line: 'DJs every Saturday',
}

/* ------------------------------------------------------------------- food */

export type MenuItem = {
  name: string
  price?: string
  desc?: string
  diet?: Diet
  weekend?: boolean
  extra?: string
}

export type MenuSection = {
  id: string
  title: string
  intro?: string
  items: MenuItem[]
  weekend?: boolean
}

const EXTRA_CHICKEN = 'Add extra chicken £4'

// from 153_Duke-of-Edinburgh-Jerk-Valley-A4-Menu.pdf (the menu linked from the kitchen page)
export const foodMenu: MenuSection[] = [
  {
    id: 'jerk-chicken',
    title: 'Jerk chicken',
    items: [
      { name: 'Jerk chicken with chips', price: '12', desc: 'Smoked and spicy BBQ jerk chicken with spiced fries (contains mayo).', extra: EXTRA_CHICKEN },
      { name: 'Jerk chicken meal', price: '14.5', desc: 'Smoked and spicy BBQ jerk chicken with rice and peas, coleslaw and homemade jerk BBQ sauce.', extra: EXTRA_CHICKEN },
      { name: 'Only jerk chicken', price: '9.5', desc: 'A portion of smoked and spicy BBQ jerk chicken with homemade jerk BBQ sauce.', extra: EXTRA_CHICKEN },
      { name: 'Jerk chicken salad', price: '8', desc: 'Smoked and spicy BBQ jerk chicken on mixed salad leaves with spiced mayo and BBQ sauce.' },
      { name: 'Jerk tender strips', price: '8', desc: 'Crispy fried jerk marinated inner fillet with spiced mayo.' },
    ],
  },
  {
    id: 'weekend',
    title: 'Weekend specials',
    intro: 'Friday to Sunday',
    weekend: true,
    items: [
      { name: 'Oxtail', price: '17', desc: 'Slowly cooked tender and flavourful oxtail with rice and peas, plantain and coleslaw.', weekend: true },
      { name: 'Curry goat', price: '17', desc: 'Slowly cooked curry goat with rice and peas, plantain and coleslaw.', weekend: true },
    ],
  },
  {
    id: 'burgers',
    title: 'Burgers & wraps',
    items: [
      { name: 'Jerk chicken burger', price: '10', desc: 'Jerk chicken with spiced mayo, jerk BBQ, and salad in a brioche bun.', extra: EXTRA_CHICKEN },
      { name: 'Jerk chicken wrap', price: '9', desc: 'Tortilla wrap with jerk chicken, coleslaw, spiced mayo and BBQ sauce.' },
      { name: 'Fried chicken burger', price: '10', desc: 'Crispy fried BBQ chicken with spiced mayo, jerk BBQ, salad and pickle in a brioche bun.', extra: EXTRA_CHICKEN },
      { name: 'Fried chicken wrap', price: '9', desc: 'Tortilla wrap with crispy fried chicken, coleslaw, spiced mayo and BBQ sauce.' },
    ],
  },
  {
    id: 'wings',
    title: 'Wings',
    intro: '5 pieces £10 · 10 pieces £15',
    items: [
      { name: 'Crispy fried BBQ wings' },
      { name: 'Tropical mango glaze wings' },
      { name: 'Grilled jerk BBQ wings' },
    ],
  },
  {
    id: 'veg',
    title: 'Vegan / vegetarian',
    items: [
      { name: 'Halloumi meal', price: '13', diet: 'V', desc: 'Crispy fried halloumi and red bell pepper served with rice and peas, coleslaw and homemade BBQ sauce.' },
      { name: 'Halloumi burger', price: '9', diet: 'V', desc: 'Crispy fried halloumi and red bell pepper with spiced mayo, BBQ sauce and salad in a brioche bun.' },
      { name: 'Halloumi wrap', price: '8', diet: 'V', desc: 'Crispy fried halloumi and red bell pepper with spiced mayo, BBQ sauce and coleslaw wrapped in tortilla.' },
      { name: 'Halloumi fries', price: '7', diet: 'V', desc: 'Crispy fried breaded halloumi with spicy ketchup.' },
      { name: 'Spicy bean burger', price: '8', diet: 'VE', desc: 'Red kidney beans and vegetables with a spicy seasoning, coated in breadcrumbs, with vegan mayo, spicy ketchup, coleslaw and salad in a vegan brioche bun.' },
    ],
  },
  {
    id: 'sides',
    title: 'Sides',
    items: [
      { name: 'Mac and cheese', price: '7', diet: 'V', desc: 'Macaroni with mixed cheese sauce and spiced breadcrumbs.' },
      { name: 'Mozzarella sticks', price: '6', diet: 'V', desc: 'Crispy crunchy mozzarella sticks served with spicy ketchup.' },
      { name: 'Jalapeño bites', price: '6', diet: 'V', desc: 'Crispy fried green jalapeño bites served with spicy ketchup.' },
      { name: 'Plantain', price: '4.5', diet: 'V', desc: 'Fried sweet plantain.' },
      { name: 'Onion rings', price: '6', diet: 'V', desc: 'Light and crisp onion rings in golden batter served with spicy ketchup.' },
      { name: 'Cauli bites', price: '6', diet: 'V', desc: 'Cauliflower florets coated in vegan Moroccan-style spiced quinoa breadcrumbs.' },
      { name: 'Jerk fries', price: '6', diet: 'V', desc: 'Crispy fried chips with mixed seasoning and spiced mayo.' },
      { name: 'Plain fries', price: '3.5', diet: 'V' },
      { name: 'Rice & peas', price: '4', diet: 'V' },
      { name: 'Coleslaw', price: '3', diet: 'V' },
      { name: 'Sauces', price: '1', diet: 'V', desc: 'BBQ sauce, hot sauce, tropical mango glaze sauce, spicy ketchup, jerk mayo.' },
    ],
  },
]

const ROAST_WITH = 'All served with roast potatoes, glazed carrots, cauli greens, mac ’n’ cheese, plantain and gravy.'

// from DofE-Jerk-Valley-Sunday-Menu_Update_09_26_cropped.pdf
export const sundayMenu: MenuSection[] = [
  {
    id: 'roasts',
    title: 'Roasts',
    intro: ROAST_WITH,
    items: [
      { name: 'Roast chicken', price: '17' },
      { name: 'Short rib roast beef', price: '18.5' },
      { name: 'Jerk lamb', price: '18.5' },
      { name: 'Mushroom & squash wellington', price: '16.5', diet: 'VE' },
    ],
  },
  {
    id: 'sunday-mains',
    title: 'Mains',
    items: [
      { name: 'Jerk chicken with chips', price: '12.5', desc: 'Smoked and spicy BBQ jerk chicken with spiced fries (contains mayo).', extra: EXTRA_CHICKEN },
      { name: 'Jerk chicken meal', price: '15', desc: 'Smoked and spicy BBQ jerk chicken with rice and peas, coleslaw and homemade jerk BBQ sauce.', extra: EXTRA_CHICKEN },
      { name: 'Jerk chicken burger', price: '11', desc: 'Jerk chicken with spiced mayo, jerk BBQ, and salad in a brioche bun.', extra: EXTRA_CHICKEN },
      { name: 'Fried chicken burger', price: '11', desc: 'Crispy fried BBQ chicken with spiced mayo, jerk BBQ, salad and pickle in a brioche bun.', extra: EXTRA_CHICKEN },
      { name: 'Halloumi meal', price: '14', diet: 'V', desc: 'Crispy fried halloumi and red bell pepper served with rice and peas, coleslaw and homemade BBQ sauce.' },
      { name: 'Halloumi burger', price: '10', diet: 'V', desc: 'Crispy fried halloumi and red bell pepper with spiced mayo, BBQ sauce and salad in a brioche bun.' },
      { name: 'Spicy bean burger', price: '10', diet: 'VE', desc: 'Red kidney beans and vegetables with a spicy seasoning, coated in breadcrumbs, with vegan mayo, spicy ketchup, coleslaw and salad in a vegan brioche bun.' },
    ],
  },
  {
    id: 'sunday-sides',
    title: 'Sides',
    items: [
      { name: 'Plain fries', price: '4', diet: 'V' },
      { name: 'Jerk fries', price: '6', diet: 'V' },
      { name: 'Mac & cheese', price: '7', diet: 'V' },
      { name: 'Cauliflower cheese', price: '6', diet: 'V' },
      { name: 'Roast potatoes', price: '3.5', diet: 'V' },
      { name: 'Extra Yorkshire pudding', price: '3.5', diet: 'V' },
    ],
  },
]

export const kitchen = {
  name: 'The Jerk Valley of London',
  since: 'January 2025',
  line: 'Jerk Valley of London are in our kitchen in the heart of Brixton, serving up their Caribbean inspired flavours and all the jerk chicken you could dream of.',
  halal: 'All our meats are halal. Please ask a member of staff for more information.',
  allergies: 'For allergies, please speak to a member of the bar staff.',
  veganOption: 'Vegan option available.',
  pdfs: {
    menu: 'https://dukeofedinburghpub.com/catalogue/wp-content/uploads/2025/06/153_Duke-of-Edinburgh-Jerk-Valley-A4-Menu.pdf',
    sunday: 'https://dukeofedinburghpub.com/catalogue/wp-content/uploads/2026/10/DofE-Jerk-Valley-Sunday-Menu_Update_09_26_cropped.pdf',
  },
}

/* ----------------------------------------------------------------- drinks */

export type DrinkItem = { name: string; price?: string; makeup?: string; note?: string }
export type WineItem = { name: string; from?: string; glass: [string, string, string]; bottle: string }

// from DoESS-Drinks-Menu-2026_.pdf
export const cocktails: DrinkItem[] = [
  { name: 'Spicy Mango Marg', price: '11', makeup: 'Cazcabel Blanco, triple sec, mango purée, lime juice, dash of Tabasco' },
  { name: 'Honey Marg', price: '11', makeup: 'Cazcabel Honey, triple sec, lime juice' },
  { name: 'Pineapple & Basil Marg', price: '11', makeup: 'Cazcabel Blanco, Monin basil, pineapple juice, lime juice' },
  { name: 'Berry Marg', price: '11', makeup: 'Cazcabel Blanco, triple sec, lime juice, grenadine' },
  { name: 'Pomegranate Marg', price: '11', makeup: 'Cazcabel Blanco, triple sec, lime juice, grenadine, pomegranate syrup' },
  { name: 'Coconut Marg', price: '11', makeup: 'Cazcabel Coconut, triple sec, lime juice' },
  { name: 'Pretty in Pink', price: '11', makeup: 'Greenall’s gin, Earl Grey syrup, pink grapefruit soda' },
  { name: 'Bramble', price: '11', makeup: 'Greenall’s gin, lemon juice, sugar syrup, crème de mûre' },
  { name: 'Rum Punch', price: '11', makeup: 'Captain Morgan Dark, Wray & Nephew, pineapple syrup, orange juice, lime juice, grenadine' },
  { name: 'Cosmopolitan', price: '11', makeup: 'Stoli vodka, triple sec, cranberry juice' },
  { name: 'Watermelon Daiquiri', price: '11.5', makeup: 'Captain Morgan White rum, lime juice, watermelon syrup' },
  { name: 'Mango Spritz', price: '11.5', makeup: 'Mango liqueur, prosecco, soda' },
  { name: 'Aperol Spritz', price: '11.5', makeup: 'Aperol, prosecco, soda' },
  { name: 'Limoncello Spritz', price: '11.5', makeup: 'Limoncello, prosecco, soda' },
  { name: 'Elderflower Spritz', price: '11.5', makeup: 'Elderflower liqueur, prosecco, soda' },
]

export const wine: { colour: string; items: WineItem[] }[] = [
  {
    colour: 'White',
    items: [
      { name: 'Rambler White', glass: ['5.6', '7.4', '9.8'], bottle: '29' },
      { name: 'Pinot Grigio', glass: ['6', '8', '10.7'], bottle: '32' },
      { name: 'Te Mério Sauvignon Blanc', glass: ['5.9', '7.9', '10.5'], bottle: '31' },
    ],
  },
  {
    colour: 'Rosé',
    items: [
      { name: 'El Ninot Rosé', glass: ['5.6', '7.4', '9.8'], bottle: '29' },
      { name: 'Papia Pinot Grigio Rosé', glass: ['6.5', '8.4', '11.2'], bottle: '33' },
    ],
  },
  {
    colour: 'Red',
    items: [
      { name: 'Rambler Red', glass: ['5.6', '7.4', '9.8'], bottle: '29' },
      { name: 'Malbec', from: 'Estampado', glass: ['5.9', '8.4', '11.2'], bottle: '33' },
      { name: 'Merlot', from: 'Sangvilio, Argentina', glass: ['5.9', '7.9', '10.5'], bottle: '31' },
      { name: 'Pinot Noir', from: 'Adobe Reserva, Chile', glass: ['6.7', '8.9', '11.8'], bottle: '35' },
    ],
  },
]

export const backBar: { title: string; note?: string; items: DrinkItem[] }[] = [
  { title: 'Bottles', items: [{ name: 'Sol', price: '6' }, { name: 'Desperados', price: '6' }, { name: 'Daura Damm', price: '6', note: 'gluten free' }] },
  { title: 'Bottled cider', items: [{ name: 'Bulmers', price: '6.5' }, { name: 'Old Mout Cherries & Berries', price: '6.5' }, { name: 'Old Mout Kiwi & Lime', price: '6.5' }] },
  { title: 'Cans', note: 'Ask the team for flavours', items: [{ name: 'White Claw', price: '6.2' }, { name: 'Hooch', price: '5.5' }] },
  { title: 'No & low', items: [{ name: 'Guinness 0%', price: '6.5' }, { name: 'Lucky Saint', price: '5.5' }] },
  { title: 'Tequila', items: [{ name: 'Cazcabel Blanco', price: '5.5' }, { name: 'Cazcabel Reposado', price: '6' }, { name: 'Cazcabel Coconut', price: '6' }, { name: 'Cazcabel Honey', price: '6' }, { name: 'Cazcabel Coffee', price: '6' }] },
  { title: 'Shooters', items: [{ name: 'Jägermeister', price: '5.5' }, { name: 'Jäger Bomb', price: '6.9' }, { name: 'Fireball', price: '5.5' }, { name: 'White Sambuca', price: '5.5' }, { name: 'Black Sambuca', price: '5' }] },
]

export const drinksNotes = {
  taps: 'A large range of beers on tap, including beers from our friends at Brixton Brewery.',
  photobooth: 'Snap a pic in our photobooth outside & don’t forget to tag us @dukebrixton',
  wineWednesday: 'Wine Wednesday: £20 a bottle of house red, white or rosé.',
  pdf: 'https://dukeofedinburghpub.com/catalogue/wp-content/uploads/2026/06/DoESS-Drinks-Menu-2026_.pdf',
}

/* ------------------------------------------------------------------ sport */

export type Fixture = { id: string; sport: string; home: string; away: string; date: string; ko: string }

// from dukeofedinburghpub.com/sports-listings/, October 2026
export const fixtures: Fixture[] = [
  ['2026-11-06', '20:10', 'Ireland', 'Argentina'],
  ['2026-11-07', '14:10', 'Scotland', 'New Zealand'],
  ['2026-11-07', '16:40', 'Wales', 'Japan'],
  ['2026-11-07', '20:10', 'France', 'Fiji'],
  ['2026-11-08', '15:10', 'England', 'Australia'],
  ['2026-11-13', '20:10', 'France', 'South Africa'],
  ['2026-11-14', '14:10', 'Wales', 'New Zealand'],
  ['2026-11-14', '16:40', 'England', 'Japan'],
  ['2026-11-14', '20:10', 'Ireland', 'Fiji'],
  ['2026-11-15', '15:10', 'Scotland', 'Australia'],
  ['2026-11-21', '14:10', 'England', 'New Zealand'],
  ['2026-11-21', '14:10', 'Scotland', 'Japan'],
  ['2026-11-21', '16:40', 'Ireland', 'South Africa'],
  ['2026-11-21', '16:40', 'Italy', 'Fiji'],
  ['2026-11-21', '20:10', 'France', 'Argentina'],
  ['2026-11-21', '20:10', 'Wales', 'Australia'],
].map(([date, ko, home, away]) => ({
  id: `${date}-${ko}-${home}-${away}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  sport: 'Rugby union',
  date,
  ko,
  home,
  away,
}))

export const screens = {
  jumbo: 'One bloody-big jumbo screen in the garden',
  inside: 'Seven ‘normal’ sized screens inside',
  total: 8,
  channels: ['Sky Sports', 'TNT Sports', 'Amazon Prime'],
  sports: ['football', 'women’s football', 'F1', 'cricket', 'rugby'],
  commentary: 'We don’t have commentary on for any sport showing outside due to licensing stipulations. Commentary is only available inside.',
}

/* --------------------------------------------------------------- bookings */

export const bookingRules = [
  { key: 'card', title: '£25 card authorisation', body: 'All bookings require a £25 card authorisation for all groups. It’s only charged if you fail to arrive for your booking.' },
  { key: 'hour', title: 'We hold your space for one hour', body: 'We hold space for all bookings and their guests for up to one hour. Later arrivals may be subject to entry queues if the pub is at capacity.' },
  { key: 'first', title: 'First come, first served', body: 'Bookings go first come, first served, so we always recommend getting yours in as soon as you can.' },
  { key: 'garden', title: 'Garden closes 9:30pm', body: 'The garden always closes at 21:30 (unless we’ve got some sort of screening on!).' },
  { key: 'commentary', title: 'Commentary inside only', body: 'No commentary on any sport showing outside, due to licensing stipulations.' },
  { key: 'kids', title: 'Under-18s', body: 'Welcome until 7pm Sunday to Thursday and 5pm on Friday and Saturday. Earlier on big sporting days. The manager’s decision is always final.' },
] as const

export const occasions = ['Drinks with friends', 'Birthday', 'Engagement', 'Watching the match', 'Pre-gig', 'Sunday roast', 'Christmas do'] as const

/* -------------------------------------------------------------- christmas */

export const christmas = {
  // prominent on the home page from the start of the season until early January
  prominentFrom: '2026-09-01',
  prominentUntil: '2027-01-06',
  headline: 'Here We Ho Ho Ho Again!',
  intro:
    'Christmas is coming up faster than Santa’s reindeer can eat those carrots you left out for them – and trust us, they don’t mess about.',
  body:
    'Whether you’re after a knees-up with your colleagues, a jolly with mates, or you just fancy eating your weight in curried goat croquettes, roast turkey and mince pies, The Jerk Valley of London’s festive menu has you covered.',
  sign:
    'Dust off your Christmas jumper, perfect your cracker-pulling technique, and get those bookings in early. Santa’s list fills up fast and ours does too.',
  closer: 'Make sure this Christmas is more ho ho ho than oh no no.',
  prices: { two: 29.5, three: 33 },
  menu: {
    starters: [
      { name: 'Butternut squash soup', desc: 'Sourdough toast', diet: 'VE' },
      { name: 'Smoked salmon', desc: 'Horseradish cream and sourdough toast' },
      { name: 'Curry goat croquette', desc: 'Curry mayo' },
      { name: 'Crispy fried shrimps', desc: 'Spicy ketchup' },
      { name: 'Saltfish fritters', desc: 'Spiced mayo' },
      { name: 'Veg fritters', desc: 'Vegan mayo', diet: 'VE' },
    ],
    mains: [
      { name: 'Bronze roasted turkey breast', desc: 'Crispy roast potatoes, Brussels sprouts, honey-glazed carrots, stuffing and gravy' },
      { name: 'Roast chicken breast', desc: 'Crispy roast potatoes, Brussels sprouts, honey-glazed carrots, stuffing and gravy' },
      { name: 'Jerk marinated lamb neck', desc: 'Crispy roast potatoes, Brussels sprouts, honey-glazed carrots, stuffing and gravy' },
      { name: 'Jerk cod', desc: 'Crispy roast potatoes, Brussels sprouts, green beans and honey-glazed carrots' },
      { name: 'Chestnut & mushroom wellington', desc: 'Crispy roast potatoes, Brussels sprouts, honey-glazed carrots and gravy', diet: 'V' },
      { name: 'Smoked cauliflower', desc: 'Crispy roast potatoes, Brussels sprouts, honey-glazed carrots and gravy', diet: 'VE' },
    ],
    desserts: [
      { name: 'Christmas pudding', desc: 'Brandy cream' },
      { name: 'Mince pie', desc: 'Cream' },
    ],
  } satisfies Record<string, { name: string; desc: string; diet?: Diet }[]>,
  pdf: 'https://dukeofedinburghpub.com/catalogue/wp-content/uploads/2026/09/DofE-Christmas-Menu-Final_web.pdf',
}

/* -------------------------------------------------------- place & contact */

export const place = {
  name: 'The Duke of Edinburgh',
  street: '204 Ferndale Road',
  area: 'Brixton',
  city: 'London',
  postcode: 'SW9 8AG',
  corner: 'On the corner of Ferndale Road and Bythorn Street',
  lat: 51.4632759,
  lng: -0.1199887,
  mapUrl:
    'https://www.google.com/maps/place/The+Duke+of+Edinburgh+Pub+%7C+Brixton/@51.463276,-0.119989,17z/data=!4m5!3m4!1s0x0:0xb321b3946c7883bc!8m2!3d51.4632759!4d-0.1199887?hl=en',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=51.4632759,-0.1199887',
  stations: [
    { name: 'Brixton', line: 'Victoria line', url: 'https://tfl.gov.uk/tube/stop/940GZZLUBXN/brixton-underground-station' },
    { name: 'Clapham North', line: 'Northern line', url: 'https://tfl.gov.uk/tube/stop/940GZZLUCPN/clapham-north-underground-station?lineId=northern' },
  ],
  parking:
    'Paid parking at Acre Lane car park, a 10 minute walk away. Open 7am to 8pm, or until midnight on O2 Academy Brixton event days.',
  access: 'Guide dogs welcome. If you’d like accessibility information before your visit, email us and we’ll make sure everyone’s prepared.',
  dogs: 'Completely dog friendly. Fluffy friends welcome.',
}

export const gigs = {
  venue: 'O2 Academy Brixton',
  venueUrl: 'https://www.academymusicgroup.com/o2academybrixton/events',
  line: 'About a six-minute walk from O2 Academy Brixton: the perfect spot for a pre-gig bite or a post-gig pint.',
  bagDrop: 'Drop your bags with us. Just ask at the bar and we’ll keep your stuff safe while you go and watch your favourites perform.',
}

export const contact = {
  email: 'info@dukeofedinburghpub.com',
  bookingsEmail: 'bookings@dukeofedinburghpub.com',
  bookingsNote: 'Already booked? Reply to your confirmation email first. No email? Write to',
  hireEmail: 'bookings@rosepubs.com',
  hireSubject: 'Photoshoot/Filming at the Duke',
  group: 'Rose Pubs',
  instagram: { handle: '@dukebrixton', url: 'https://www.instagram.com/dukebrixton/' },
  facebook: { handle: 'dukesw9', url: 'https://www.facebook.com/dukesw9' },
  giftCards: {
    url: 'https://duke-of-edinburgh-brixton.mytoggle.io/shop/duke-of-edinburgh-gift-card',
    amounts: [10, 20, 25, 50, 75, 100],
    note: 'Delivered digitally. Valid for a year after purchase.',
  },
  newsletter: 'https://pages.airship.co.uk/forms/756/doe-web-sign-up',
  jobs: 'https://harri.com/Duke-Of-Edinburgh-BSNRhUOAHnZU',
  complaints:
    'If you’re in the pub, ask to speak to a manager. Otherwise email us and we’ll come back to you within seven days at the latest.',
  drinkaware: 'https://www.drinkaware.co.uk/',
}

/* ---------------------------------------------------------------- building */

export const building = {
  listed: 'Grade II listed, 24 August 2015',
  listEntry: 'https://historicengland.org.uk/listing/the-list/list-entry/1427801',
  built: '1936–37',
  architect: 'A. E. Sewell',
  brewery: 'Truman, Hanbury, Buxton & Co.',
  summary:
    'An ‘improved’ public house built for Truman’s by their in-house architect A. E. Sewell. Inside and out, it survives very little altered.',
  facts: [
    { k: 'Before', v: 'The first Duke of Edinburgh on this site is thought to date from around 1860, when Ferndale Road was still Shepherd’s Lane.' },
    { k: 'Drawn', v: 'Sewell’s signed plans, sections and elevations, dated March 1936, survive in Lambeth Archives.' },
    { k: 'Outside', v: 'Thin red bricks in English bond, leaded and stained glass in the original metal casements, three big chimneystacks, and the splayed corner Truman’s gave its inter-war corner pubs.' },
    { k: 'Over the doors', v: 'Carved stone panels with Truman’s eagle, above wrought-iron fanlights.' },
    { k: 'Inside', v: 'Light oak panelling, embossed Truman’s mirrors, an oak bar back of three shallow four-centred arches, a chequer-tiled border along the saloon counter, and a stone inglenook fireplace in the old lounge and billiard room.' },
    { k: 'The barrels', v: 'Rolling-in doors on Bythorn Street, so the draymen could deliver beer straight from the street into the cellar.' },
    { k: 'The garden', v: 'Crazy paving and low stone walls that may date from the 1930s garden scheme.' },
  ],
  listingQuote:
    'Handsome and stylistically restrained, with extensive use of good-quality materials and careful, understated detailing.',
  rooms: ['Public bar', 'Games room', 'Off sales', 'Saloon bar', 'Lounge & billiard room'],
  ghostSign: 'If it’s Truman’s it is beer!',
}

export const hire = {
  headline: 'Filming location & photoshoot hire',
  line:
    'A characterful pub in Brixton for film, TV, photography, editorial shoots, commercials, music videos and branded content.',
  why: 'Suited to shoots looking for a relaxed, lived-in and recognisably London setting, rather than a purpose-built studio.',
  ask: 'Send details of your project, preferred dates, crew size and the areas of the venue you’re interested in using, and we’ll talk through requirements and availability.',
}

export const site = {
  url: 'https://alexwilder-dev.github.io/duke-of-edinburgh-brixton/',
  current: 'https://dukeofedinburghpub.com/',
}
