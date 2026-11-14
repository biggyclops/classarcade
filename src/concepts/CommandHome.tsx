import { Game, games } from "../data";
import { Artwork, Primary } from "../components";
import { ArrowUpRight, ChevronRight, Star, Orbit } from "lucide-react";
export function CommandHome({
  featured,
  play,
  setDetail,
}: {
  featured: Game;
  play: (g: Game) => void;
  setDetail: (g: Game) => void;
}) {
  return (
    <>
      <div className="welcome">
        <div>
          <p>YOUR NEXT GREAT SESSION STARTS HERE</p>
          <h1>
            Welcome back, Alex<span>.</span>
          </h1>
        </div>
        <span>
          <span className="online-dot" /> Ready when you are
        </span>
      </div>
      <section className="command-hero">
        <Artwork game={featured} />
        <div className="hero-fade" />
        <div className="hero-content">
          <span className="feature-label">
            <span /> IN THE SPOTLIGHT
          </span>
          <div className="slope-logo">
            SLOPE<span>OVERDRIVE</span>
          </div>
          <p>
            Own the racing line.
            <br />
            Every slope is a new way forward.
          </p>
          <div className="hero-meta">
            <span>STREET RACING</span>
            <i />
            LINEAR EQUATIONS
          </div>
          <div className="hero-buttons">
            <Primary onClick={() => play(featured)}>Jump back in</Primary>
            <button className="secondary" onClick={() => setDetail(featured)}>
              View game <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="hero-bottom">
          <span>ORIGINAL CONCEPT TITLE</span>
          <div>
            {[0, 1, 2].map((n) => (
              <button
                key={n}
                aria-label={`Spotlight ${games[n].title}`}
                className={n === 0 ? "selected" : ""}
                onClick={() => setDetail(games[n])}
              />
            ))}
          </div>
          <span>
            01 <i>/ 03</i>
          </span>
        </div>
      </section>
    </>
  );
}
