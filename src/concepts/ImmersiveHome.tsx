import { Game, games } from "../data";
import { Artwork, Primary } from "../components";
import { ArrowUpRight, ChevronRight, Star, Orbit } from "lucide-react";
import { asset } from "../assets";
import { AnimatePresence, motion } from "motion/react";
export function ImmersiveHome({
  featured,
  play,
  setDetail,
  selected,
  setSelected,
  favorites,
  favorite,
}: {
  featured: Game;
  play: (g: Game) => void;
  setDetail: (g: Game) => void;
  selected: number;
  setSelected: (id: number) => void;
  favorites: number[];
  favorite: (id: number) => void;
}) {
  return (
    <section className="immersive-hero">
      <AnimatePresence mode="wait">
        <motion.div
          className="immersive-background"
          key={selected}
          initial={{ opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            className="art"
            src={asset(
              featured.id === 3
                ? "/art/equation-banner.webp"
                : featured.id === 0
                  ? "/art/slope-banner.webp"
                  : `/art/game-${featured.id}.webp`,
            )}
            alt=""
          />
        </motion.div>
      </AnimatePresence>
      <div className="immersive-fade" />
      <div className="immersive-copy">
        <span className="feature-label">A WORLD WORTH GETTING LOST IN</span>
        <h1>
          {featured.short.split(" ").map((s, i) => (
            <span key={i}>{s} </span>
          ))}
        </h1>
        <p>{featured.description}</p>
        <div className="hero-meta">
          {featured.genre.toUpperCase()}
          <i />
          {featured.skill.toUpperCase()}
        </div>
        <div className="hero-buttons">
          <Primary onClick={() => play(featured)}>Enter the world</Primary>
          <button className="secondary" onClick={() => setDetail(featured)}>
            Explore game <ArrowUpRight size={16} />
          </button>
          <button
            className="icon-button"
            aria-label={`Favorite ${featured.title}`}
            onClick={() => favorite(featured.id)}
          >
            <Star
              fill={favorites.includes(featured.id) ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="cinema-picker">
        <div className="cinema-heading">
          <span>CHOOSE YOUR WORLD</span>
          <span>{String(selected + 1).padStart(2, "0")} / 07</span>
        </div>
        <div className="cinema-tiles">
          {games.map((g) => (
            <button
              key={g.id}
              className={selected === g.id ? "selected" : ""}
              onClick={() => setSelected(g.id)}
              aria-label={`Feature ${g.title}`}
              aria-pressed={selected === g.id}
            >
              <Artwork game={g} />
              <span>{g.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
