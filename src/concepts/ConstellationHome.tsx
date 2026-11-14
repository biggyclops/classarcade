import { Game, games } from "../data";
import { Artwork, Primary } from "../components";
import { ArrowUpRight, ChevronRight, Star, Orbit } from "lucide-react";
export function ConstellationHome({
  play,
  setDetail,
  selected,
  setSelected,
}: {
  play: (g: Game) => void;
  setDetail: (g: Game) => void;
  selected: number;
  setSelected: (id: number) => void;
}) {
  return (
    <section className="constellation">
      <div className="map-heading">
        <div>
          <span className="feature-label">YOUR LEARNING CONSTELLATION</span>
          <h1>
            No two journeys
            <br />
            take the same path.
          </h1>
          <p>
            Discover worlds connected by what you know.
            <br />
            Choose a signal. Find your next challenge.
          </p>
        </div>
        <span className="map-live">
          <span className="online-dot" /> 7 WORLDS TO EXPLORE
        </span>
      </div>
      <div className="map-area">
        <div className="orbit-ring ring-one" />
        <div className="orbit-ring ring-two" />
        <svg
          className="map-lines"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M170 120L470 215 760 95M470 215L200 365M470 215L740 365M170 120L200 365M760 95L740 365M470 215L460 435M470 215L450 30" />
        </svg>
        {games.map((g, i) => (
          <button
            key={g.id}
            style={
              {
                "--node-color": g.color,
              } as React.CSSProperties
            }
            className={`world-node node-${i} ${selected === i ? "selected" : ""}`}
            onClick={() => setSelected(i)}
            aria-label={`Select ${g.title}`}
            aria-pressed={selected === i}
          >
            <Artwork game={g} />
            <span className="node-number">0{i + 1}</span>
            <span className="node-name">
              {g.title}
              <small>{g.skill}</small>
            </span>
            <span className="node-point" />
          </button>
        ))}
        <span className="map-coordinate">
          CLASSARCADE / KNOWLEDGE NETWORK
          <br />
          SECTOR 01 — YOUR ORBIT
        </span>
      </div>
      <aside className="signal-inspector">
        <div className="signal-top">
          <Orbit size={20} />
          <span>SIGNAL {String(selected + 1).padStart(2, "0")}</span>
          <span>CONNECTED</span>
        </div>
        <Artwork game={games[selected]} />
        <h2>{games[selected].title}</h2>
        <p>{games[selected].description}</p>
        <dl>
          <div>
            <dt>Connection</dt>
            <dd>{games[selected].skill}</dd>
          </div>
          <div>
            <dt>Session</dt>
            <dd>{games[selected].time}</dd>
          </div>
          <div>
            <dt>World</dt>
            <dd>Concept title</dd>
          </div>
        </dl>
        <Primary onClick={() => play(games[selected])}>
          Follow this signal
        </Primary>
        <button
          className="text-button"
          onClick={() => setDetail(games[selected])}
        >
          View game details <ArrowUpRight size={15} />
        </button>
      </aside>
    </section>
  );
}
