import { bookingRules, hours, screens } from '../data/duke'
import { Eyebrow, Photo, Star } from '../components/bits'
import { FixturesBoard } from '../components/FixturesBoard'
import { clock } from '../lib/time'

export function Sport() {
  const kids = bookingRules.find((r) => r.key === 'kids')!
  return (
    <div className="page page--sport">
      <header className="sporthead lattice">
        <div className="wrap sporthead__wrap">
          <div>
            <Eyebrow>Sport</Eyebrow>
            <h1 className="display display--cream">Screens for days</h1>
            <p className="sporthead__lede">
              That’s eight screens including a jumbo screen in the garden. The whole pub is covered.
            </p>
            <ul className="channels" aria-label="Channels">
              {screens.channels.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <Photo name="jumbo-screen-2026" className="sporthead__pic" sizes="(min-width: 900px) 40vw, 100vw" eager />
        </div>
      </header>

      <div className="wrap">
        <div className="sportrules">
          <div className="sportrule">
            <b>{screens.jumbo}</b>
            <span>Under its own timber canopy, out all year.</span>
          </div>
          <div className="sportrule">
            <b>{screens.inside}</b>
            <span>So you’ll always have a great view from wherever you’re sat.</span>
          </div>
          <div className="sportrule sportrule--loud">
            <b>Commentary inside only</b>
            <span>{screens.commentary.split('. ')[0]}.</span>
          </div>
          <div className="sportrule">
            <b>Garden shuts {clock(hours.gardenCloses)}</b>
            <span>Unless we’ve got some sort of screening on.</span>
          </div>
        </div>

        <FixturesBoard title="Fixtures" />
        <p className="sport__more">
          We’re showing all the action: {screens.sports.join(', ')} and more. Tap Book on any match and we’ll fill in the date and kick-off for you.
        </p>

        <section className="telly" aria-labelledby="telly-title">
          <Photo name="sport-inside-screens" sizes="(min-width: 900px) 40vw, 100vw" />
          <div>
            <h2 id="telly-title" className="serif-title">
              Not just sport
            </h2>
            <p>
              This autumn The Celebrity Traitors has been on the big screen on Thursday nights at 8pm. Book a table and watch with us, faithfuls.
            </p>
            <p className="mono telly__kids">
              <Star size={11} /> {kids.title}: {kids.body}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
