import { asset } from "./assets";
import { useEffect, useRef } from "react";
import { X, Play, Star, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Game } from "./data";
export function Artwork({
  game,
  className = "",
}: {
  game: Game;
  className?: string;
}) {
  return (
    <img
      className={"art " + className}
      src={game.cover ? asset(game.cover) : asset(`/art/game-${game.id}.webp`)}
      alt=""
      loading={game.id === 0 ? "eager" : "lazy"}
    />
  );
}
export function GameCard({
  game,
  onOpen,
  favorite,
  toggle,
  wide = false,
}: {
  game: Game;
  onOpen: () => void;
  favorite: boolean;
  toggle: () => void;
  wide?: boolean;
}) {
  const release = game.launchUrl === "/games/next-chapter/index.html" ? __NEXT_CHAPTER_RELEASE__ : null;
  return (
    <motion.article
      className={"game-card " + (wide ? "wide" : "")}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <button
        className="card-open"
        onClick={onOpen}
        aria-label={`View ${game.title}`}
        aria-description={release ? `Version ${release.version}, updated ${release.date}` : undefined}
      >
        <div className="cover">
          <Artwork game={game} />
          <div className="cover-shade" />
          {release && <span className="game-release-badge">v{release.version}</span>}
          <div className={"game-wordmark wordmark-" + game.id}>
            {game.short}
            <small>
              {game.id === 0 ? "OVERDRIVE" : game.genre.toUpperCase()}
            </small>
          </div>
          <span className="cover-play">
            <Play size={20} fill="currentColor" />
          </span>
          {/PEMDAS|order of operations/i.test(game.skill) ? (
            <span className="algebra-a-mark" title="Algebra A" aria-label="Algebra A">a</span>
          ) : null}
        </div>
        <div className="card-caption">
          <strong>{game.title}</strong>
          <small>{game.genre}</small>
          {release && <small className="game-release-date">Updated {release.date}</small>}
        </div>
      </button>
      <button
        className={"favorite icon-button " + (favorite ? "is-favorite" : "")}
        onClick={toggle}
        aria-label={`${favorite ? "Unfavorite" : "Favorite"} ${game.title}`}
        aria-pressed={favorite}
      >
        <Star size={15} fill={favorite ? "currentColor" : "none"} />
      </button>
    </motion.article>
  );
}
export function Dialog({
  title,
  onClose,
  children,
  className = "",
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef(document.activeElement as HTMLElement);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      opener.current?.focus();
    };
  }, []);
  return (
    <dialog
      className={className}
      aria-label={title}
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-head">
        <h2>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Primary({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="primary" onClick={onClick}>
      <Play size={16} fill="currentColor" />
      {children}
      <ArrowUpRight size={16} />
    </button>
  );
}
