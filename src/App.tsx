import { CommandHome } from "./concepts/CommandHome";
import { ImmersiveHome } from "./concepts/ImmersiveHome";
import { ConstellationHome } from "./concepts/ConstellationHome";
import { asset } from "./assets";
import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import {
  Gamepad2,
  Home,
  Library,
  Layers,
  Star,
  Clock,
  Plus,
  Settings,
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  Grid2X2,
  List,
  SlidersHorizontal,
  Upload,
  Check,
  Orbit,
  Compass,
  Volume2,
  Wifi,
  GraduationCap,
  X,
  Folder,
} from "lucide-react";
import { games, classroomNames, concepts, Game } from "./data";
import { Artwork, GameCard, Dialog, Primary } from "./components";
type Collection = { name: string; ids: number[] };
type Modal = "settings" | "import" | "collection" | null;
function saved<T>(key: string, fallback: T): T {
  try {
    return (
      JSON.parse(localStorage.getItem("ca-v1-" + key) || "null") ?? fallback
    );
  } catch {
    return fallback;
  }
}
export default function App() {
  const [concept, setConcept] = useState(() => {
    const c = new URLSearchParams(location.search).get("concept");
    return c && ["a", "b", "c"].includes(c) ? c : "a";
  });
  const [page, setPage] = useState("Home");
  const [compare, setCompare] = useState(location.hash === "#compare");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All games");
  const [genre, setGenre] = useState("All genres");
  const [sort, setSort] = useState("Featured");
  const [list, setList] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() =>
    saved("favorites", [0, 3]),
  );
  const [recent, setRecent] = useState<number[]>(() =>
    saved("recent", [0, 2, 1]),
  );
  const [collections, setCollections] = useState<Collection[]>(() =>
    saved("collections", []),
  );
  const [modal, setModal] = useState<Modal>(null);
  const [detail, setDetail] = useState<Game | null>(null);
  const [selected, setSelected] = useState(3);
  const [role, setRole] = useState("Student");
  const [notice, setNotice] = useState("");
  const [reduced, setReduced] = useState(() => saved("reduced", false));
  const [sound, setSound] = useState(() => saved("sound", false));
  const [launch, setLaunch] = useState<Game | null>(null);
  const [collectionName, setCollectionName] = useState("");
  const [collectionError, setCollectionError] = useState("");
  const [collectionGames, setCollectionGames] = useState<number[]>([]);
  const [importError, setImportError] = useState("");
  const [manifest, setManifest] = useState<{
    title: string;
    version: string;
  } | null>(null);
  const [imports, setImports] = useState<string[]>(() => saved("imports", []));
  const [importBusy, setImportBusy] = useState(false);
  const [assignment, setAssignment] = useState(() => saved("assignment", ""));
  useEffect(() => {
    try {
      for (const [k, v] of Object.entries({
        favorites,
        recent,
        collections,
        reduced,
        sound,
        imports,
        assignment,
      }))
        localStorage.setItem("ca-v1-" + k, JSON.stringify(v));
    } catch {
      /* Browsers may restrict device storage. */
    }
  }, [favorites, recent, collections, reduced, sound, imports, assignment]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4200);
    return () => clearTimeout(t);
  }, [notice]);
  useLayoutEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDetail(null);
        setLaunch(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search")?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  function choose(id: string) {
    setConcept(id);
    setCompare(false);
    setPage("Home");
    setQuery("");
    setFilter("All games");
    setGenre("All genres");
    history.replaceState(null, "", `?concept=${id}`);
  }
  function go(p: string) {
    setPage(p);
    setQuery("");
    setFilter("All games");
    setGenre("All genres");
  }
  function favorite(id: number) {
    setFavorites((x) =>
      x.includes(id) ? x.filter((n) => n !== id) : [...x, id],
    );
  }
  function play(g: Game) {
    setRecent((x) => [g.id, ...x.filter((i) => i !== g.id)]);
    setLaunch(g);
    if (sound) {
      try {
        const c = new AudioContext();
        const o = c.createOscillator(),
          gain = c.createGain();
        o.connect(gain);
        gain.connect(c.destination);
        o.frequency.setValueAtTime(330, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(660, c.currentTime + 0.15);
        gain.gain.setValueAtTime(0.025, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
        o.start();
        o.stop(c.currentTime + 0.25);
        o.onended = () => c.close();
      } catch {
        /* optional audio */
      }
    }
  }
  const filtered = games
    .filter(
      (g) =>
        (g.title + " " + g.genre + " " + g.skill)
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (page !== "Favorites" || favorites.includes(g.id)) &&
        (page !== "Recently played" || recent.includes(g.id)) &&
        (filter === "All games" ||
          g.classroom.includes(filter) ||
          collections.some((c) => c.name === filter && c.ids.includes(g.id))) &&
        (genre === "All genres" || g.genre === genre),
    )
    .sort((a, b) =>
      sort === "A–Z"
        ? a.title.localeCompare(b.title)
        : page === "Recently played"
          ? recent.indexOf(a.id) - recent.indexOf(b.id)
          : a.id - b.id,
    );
  const isHome =
    page === "Home" &&
    !query &&
    filter === "All games" &&
    genre === "All genres";
  const featured = games[concept === "b" ? selected : 0];
  const card = (g: Game, wide = false) => (
    <GameCard
      key={g.id}
      game={g}
      wide={wide}
      onOpen={() => setDetail(g)}
      favorite={favorites.includes(g.id)}
      toggle={() => favorite(g.id)}
    />
  );
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <div
        className={`app concept-${concept} ${reduced ? "reduce-motion" : ""}`}
      >
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <div className="review-bar">
          <span>
            <span className="review-dot" /> CLASSARCADE{" "}
            <span className="review-muted">/ DESIGN EXPLORATIONS</span>
          </span>
          <div>
            {concepts.map((c, i) => (
              <button
                key={c.id}
                aria-pressed={!compare && concept === c.id}
                className={!compare && concept === c.id ? "current" : ""}
                onClick={() => choose(c.id)}
              >
                <span>{String.fromCharCode(65 + i)}</span> {c.name}
              </button>
            ))}
            <button
              className={compare ? "current" : ""}
              onClick={() => {
                setCompare(true);
                history.replaceState(null, "", "#compare");
              }}
            >
              Compare <ArrowUpRight size={13} />
            </button>
          </div>
          <span className="prototype-tag">INTERACTIVE PROTOTYPE</span>
        </div>
        {compare ? (
          <main className="comparison" id="content">
            <div className="brand">
              <Gamepad2 />
              ClassArcade<span>®</span>
            </div>
            <div className="comparison-heading">
              <p>One library. Endless learning.</p>
              <h1>
                Three ways to
                <br />
                press play.
              </h1>
              <p>
                A new home for learning through games.
                <br />
                Explore three distinct directions for ClassArcade.
              </p>
            </div>
            <div className="comparison-grid">
              {concepts.map((c, i) => (
                <button
                  className={"concept-preview preview-" + c.id}
                  key={c.id}
                  onClick={() => choose(c.id)}
                >
                  <div className="preview-image">
                    <img src={asset(`/art/game-${[0, 3, 5][i]}.webp`)} alt="" />
                    <span>0{i + 1}</span>
                    <strong>{c.name}</strong>
                    <ArrowUpRight />
                  </div>
                  <div className="preview-caption">
                    <span>{c.tone}</span>
                    <h2>{c.label}</h2>
                    <p>{c.description}</p>
                    <b>
                      Explore concept {c.id.toUpperCase()}{" "}
                      <ChevronRight size={16} />
                    </b>
                  </div>
                </button>
              ))}
            </div>
            <div className="recommendation">
              <span>OUR RECOMMENDATION</span>
              <h2>Command Center</h2>
              <p>
                The strongest everyday home for students and teachers. Familiar
                navigation, compact library tools, and artwork with room to
                breathe. Immersive Gaming brings the atmosphere; Next Generation
                reimagines how skills connect.
              </p>
            </div>
            <footer>
              Synthetic data · Original concept artwork · All game titles are
              concepts · No public deployment
            </footer>
          </main>
        ) : (
          <>
            <header className="topbar">
              <button
                className="brand"
                onClick={() => go("Home")}
                aria-label="ClassArcade home"
              >
                <Gamepad2 size={28} />
                ClassArcade<span>®</span>
              </button>
              <nav aria-label="Main navigation">
                {["Home", "Library", "Collections"].map((p) => (
                  <button
                    key={p}
                    className={page === p ? "active" : ""}
                    onClick={() => go(p)}
                  >
                    {p}
                  </button>
                ))}
              </nav>
              <div className="top-actions">
                <label className="search">
                  <Search size={16} />
                  <input
                    id="search"
                    aria-label="Search your library"
                    placeholder="Search your library"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <kbd>⌘ K</kbd>
                </label>
                <button
                  className="icon-button"
                  aria-label="Settings"
                  onClick={() => setModal("settings")}
                >
                  <Settings size={18} />
                </button>
                <div className="avatar" aria-hidden="true">
                  AK
                </div>
                <label className="role">
                  <span className="sr-only">Navigation role</span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option>Student</option>
                    <option>Teacher</option>
                  </select>
                </label>
              </div>
            </header>
            <div className="workspace">
              {concept === "a" && (
                <aside className="sidebar">
                  <div className="sidebar-group">
                    <span className="section-label">YOUR SPACE</span>
                    {[
                      [Home, "Home"],
                      [Library, "Library"],
                      [Star, "Favorites"],
                      [Clock, "Recently played"],
                    ].map(([Icon, p]) => {
                      const I = Icon as typeof Home;
                      return (
                        <button
                          aria-label={String(p)}
                          className={page === p ? "active" : ""}
                          key={String(p)}
                          onClick={() => go(String(p))}
                        >
                          <I size={18} />
                          {String(p)}
                          {p === "Library" && <small>07</small>}
                          {p === "Favorites" && (
                            <small>
                              {favorites.length.toString().padStart(2, "0")}
                            </small>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="sidebar-group">
                    <div className="section-label">
                      CLASSROOM COLLECTIONS <GraduationCap size={14} />
                    </div>
                    {classroomNames.map((c, i) => (
                      <button
                        className={filter === c ? "selected" : ""}
                        key={c}
                        onClick={() => {
                          go("Library");
                          setFilter(c);
                        }}
                      >
                        <span className={"collection-dot dot-" + i} />
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="sidebar-group">
                    <div className="section-label">
                      MY COLLECTIONS
                      <button
                        className="tiny"
                        aria-label="Create collection"
                        onClick={() => setModal("collection")}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {collections.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          go("Library");
                          setFilter(c.name);
                        }}
                      >
                        <Folder size={16} />
                        {c.name}
                        <small>{c.ids.length}</small>
                      </button>
                    ))}
                    {!collections.length && (
                      <button
                        className="muted"
                        onClick={() => setModal("collection")}
                      >
                        <Plus size={16} />
                        Create a collection
                      </button>
                    )}
                  </div>
                  <div className="sidebar-bottom">
                    <div className="classroom-note">
                      <span className="online-dot" /> YOUR CLASSROOM, CONNECTED
                      <strong>
                        One library.
                        <br />
                        Endless learning.
                      </strong>
                      <small>Find your next challenge.</small>
                    </div>
                    <button onClick={() => setModal("import")}>
                      <Plus size={17} />
                      Import a game
                    </button>
                    <button onClick={() => setModal("settings")}>
                      <Settings size={17} />
                      Settings
                    </button>
                  </div>
                </aside>
              )}
              <main id="content" className="main-content">
                {role === "Teacher" && (
                  <div className="teacher-panel">
                    <GraduationCap />
                    <div>
                      <strong>Teacher workspace</strong>
                      <span>
                        Preview classroom collections and assign a concept
                        challenge. Synthetic data only.
                      </span>
                    </div>
                    <select
                      aria-label="Assign classroom"
                      onChange={(e) => setAssignment(e.target.value)}
                      value={assignment}
                    >
                      <option value="">Assign featured game…</option>
                      {classroomNames.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    {assignment && (
                      <span className="assignment-status">
                        <Check size={14} />
                        Assigned to {assignment} · simulated
                      </span>
                    )}
                  </div>
                )}
                {
                  <div
                    className={
                      "secondary-nav " +
                      (concept === "a" ? "mobile-secondary" : "")
                    }
                  >
                    <button
                      className={page === "Favorites" ? "active" : ""}
                      onClick={() => go("Favorites")}
                    >
                      <Star size={14} />
                      Favorites
                    </button>
                    <button
                      className={page === "Recently played" ? "active" : ""}
                      onClick={() => go("Recently played")}
                    >
                      <Clock size={14} />
                      Recently played
                    </button>
                    <button onClick={() => setModal("import")}>
                      <Plus size={15} />
                      Import game
                    </button>
                    <span>One library. Endless learning.</span>
                  </div>
                }
                {page === "Collections" ? (
                  <section className="collection-page">
                    <div className="section-heading">
                      <div>
                        <p className="muted">Made for your next session</p>
                        <h1>Your collections</h1>
                      </div>
                      <button
                        className="primary"
                        onClick={() => setModal("collection")}
                      >
                        <Plus size={16} />
                        New collection
                      </button>
                    </div>
                    <div className="collection-grid">
                      {[
                        ...classroomNames.map((name) => ({
                          name,
                          ids: games
                            .filter((g) => g.classroom.includes(name))
                            .map((g) => g.id),
                        })),
                        ...collections,
                      ].map((c, i) => (
                        <button
                          className="collection-tile"
                          key={c.name}
                          onClick={() => {
                            go("Library");
                            setFilter(c.name);
                          }}
                        >
                          <div className="collection-covers">
                            {c.ids.slice(0, 3).map((id) => (
                              <Artwork key={id} game={games[id]} />
                            ))}
                          </div>
                          <div>
                            <span>
                              {i < 3 ? "CLASSROOM" : "PERSONAL"} COLLECTION
                            </span>
                            <h2>{c.name}</h2>
                            <p>
                              {c.ids.length} concept titles{" "}
                              <ArrowUpRight size={18} />
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : (
                  <>
                    {isHome && concept === "a" && (
                      <CommandHome
                        featured={featured}
                        play={play}
                        setDetail={setDetail}
                      />
                    )}
                    {isHome && concept === "b" && (
                      <ImmersiveHome
                        featured={featured}
                        play={play}
                        setDetail={setDetail}
                        selected={selected}
                        setSelected={setSelected}
                        favorites={favorites}
                        favorite={favorite}
                      />
                    )}
                    {isHome && concept === "c" && (
                      <ConstellationHome
                        play={play}
                        setDetail={setDetail}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    )}
                    {isHome && concept === "a" && (
                      <section className="continue-section">
                        <div className="section-heading">
                          <h2>Pick up where you left off</h2>
                          <button
                            className="text-button"
                            onClick={() => go("Recently played")}
                          >
                            Recently played <ChevronRight size={15} />
                          </button>
                        </div>
                        <div className="continue-grid">
                          {recent.slice(0, 3).map((id) => (
                            <button
                              className="continue-game"
                              key={id}
                              onClick={() => setDetail(games[id])}
                            >
                              <Artwork game={games[id]} />
                              <div>
                                <strong>{games[id].title}</strong>
                                <span>{games[id].skill}</span>
                                <div className="progress">
                                  <span
                                    style={{ width: games[id].progress + "%" }}
                                  />
                                </div>
                                <small>
                                  Continue your journey{" "}
                                  <ChevronRight size={12} />
                                </small>
                              </div>
                              <span className="mini-play">
                                <Gamepad2 size={18} />
                              </span>
                            </button>
                          ))}
                        </div>
                      </section>
                    )}
                    <section className="library-section">
                      <div className="section-heading">
                        <div className="heading-with-count">
                          <h2>
                            {query
                              ? "Search results"
                              : isHome
                                ? concept === "c"
                                  ? "Explore every world"
                                  : "Your next obsession"
                                : page === "Home"
                                  ? "Your library"
                                  : page}
                          </h2>
                          <span>
                            {filtered.length.toString().padStart(2, "0")}
                          </span>
                        </div>
                        <div className="view-controls">
                          {isHome ? (
                            <button
                              className="text-button"
                              onClick={() => go("Library")}
                            >
                              View library <ArrowUpRight size={16} />
                            </button>
                          ) : (
                            <>
                              <label>
                                <span className="sr-only">Sort games</span>
                                <select
                                  value={sort}
                                  onChange={(e) => setSort(e.target.value)}
                                >
                                  <option>Featured</option>
                                  <option>A–Z</option>
                                </select>
                              </label>
                              <button
                                className={
                                  !list ? "active icon-button" : "icon-button"
                                }
                                aria-label="Grid view"
                                aria-pressed={!list}
                                onClick={() => setList(false)}
                              >
                                <Grid2X2 size={16} />
                              </button>
                              <button
                                className={
                                  list ? "active icon-button" : "icon-button"
                                }
                                aria-label="List view"
                                aria-pressed={list}
                                onClick={() => setList(true)}
                              >
                                <List size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {!isHome && (
                        <div className="filter-row">
                          <SlidersHorizontal size={16} />
                          <label>
                            <span className="sr-only">Collection filter</span>
                            <select
                              value={filter}
                              onChange={(e) => setFilter(e.target.value)}
                            >
                              <option>All games</option>
                              {[
                                ...classroomNames,
                                ...collections.map((c) => c.name),
                              ].map((c) => (
                                <option key={c}>{c}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            <span className="sr-only">Genre filter</span>
                            <select
                              value={genre}
                              onChange={(e) => setGenre(e.target.value)}
                            >
                              <option>All genres</option>
                              {games.map((g) => (
                                <option key={g.id}>{g.genre}</option>
                              ))}
                            </select>
                          </label>
                          <button
                            className="text-button"
                            onClick={() => {
                              setFilter("All games");
                              setGenre("All genres");
                              setQuery("");
                            }}
                          >
                            Clear filters
                          </button>
                          <span>{filtered.length} concept titles</span>
                        </div>
                      )}
                      {filtered.length ? (
                        <div className={list ? "games-list" : "games-grid"}>
                          {filtered.map((g) => card(g, concept === "b"))}
                        </div>
                      ) : (
                        <div className="empty-state">
                          <Search size={30} />
                          <h3>No games in this orbit.</h3>
                          <p>
                            Try another search or add a favorite to build your
                            collection.
                          </p>
                          <button
                            className="secondary"
                            onClick={() => {
                              go("Library");
                              setGenre("All genres");
                            }}
                          >
                            Explore all games
                          </button>
                        </div>
                      )}
                      {imports.length > 0 && (
                        <div className="imported-list">
                          <h3>Imported manifests</h3>
                          {imports.map((n) => (
                            <p key={n}>
                              <Folder size={16} />
                              {n} <span>Metadata only · not executable</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </section>
                  </>
                )}
                <footer className="app-footer">
                  <span>
                    <Wifi size={12} /> Local prototype <i>·</i> All games are
                    concept titles
                  </span>
                  <span>
                    Synthetic data <i>·</i>{" "}
                    {concepts.find((c) => c.id === concept)?.name}{" "}
                    <span className="footer-letter">
                      {concept.toUpperCase()}
                    </span>
                  </span>
                </footer>
              </main>
            </div>
          </>
        )}
        {modal === "settings" && (
          <Dialog title="Make yourself at home" onClose={() => setModal(null)}>
            <p className="dialog-subtitle">
              Preferences are saved on this device.
            </p>
            <div className="setting-row">
              <div>
                <h3>Reduced motion</h3>
                <p>Keep transitions quiet and disable ambient movement.</p>
              </div>
              <input
                aria-label="Reduced motion"
                type="checkbox"
                role="switch"
                checked={reduced}
                onChange={(e) => setReduced(e.target.checked)}
              />
            </div>
            <div className="setting-row">
              <div>
                <h3>Interface sounds</h3>
                <p>A subtle tone on simulated launch. Off by default.</p>
              </div>
              <input
                aria-label="Interface sounds"
                type="checkbox"
                role="switch"
                checked={sound}
                onChange={(e) => setSound(e.target.checked)}
              />
            </div>
            <div className="settings-info">
              <Wifi size={18} />
              <div>
                <strong>Built with offline in mind</strong>
                <p>
                  Favorites and collections stay in this browser. Full offline
                  installation is a future milestone.
                </p>
              </div>
            </div>
            <button
              className="primary full"
              onClick={() => {
                setModal(null);
                setNotice("Preferences saved on this device.");
              }}
            >
              Done <Check size={16} />
            </button>
          </Dialog>
        )}
        {modal === "collection" && (
          <Dialog
            title="A collection of your own"
            onClose={() => setModal(null)}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const name = collectionName.trim();
                if (!name || !collectionGames.length) return;
                if (
                  [...classroomNames, ...collections.map((c) => c.name)].some(
                    (n) => n.toLowerCase() === name.toLowerCase(),
                  )
                ) {
                  setCollectionError("Choose a unique collection name.");
                  return;
                }
                setCollections((x) => [...x, { name, ids: collectionGames }]);
                setCollectionName("");
                setCollectionGames([]);
                setModal(null);
                go("Collections");
                setNotice("Your collection is ready.");
              }}
            >
              <label className="field-label">
                Collection name
                <input
                  autoFocus
                  maxLength={48}
                  required
                  placeholder="e.g. Friday night favorites"
                  value={collectionName}
                  onChange={(e) => {
                    setCollectionName(e.target.value);
                    setCollectionError("");
                  }}
                />
              </label>
              <p className="dialog-subtitle">
                Choose the worlds that belong here.
              </p>
              {collectionError && (
                <p className="error" role="alert">
                  {collectionError}
                </p>
              )}
              <div className="game-checks">
                {games.map((g) => (
                  <label key={g.id}>
                    <Artwork game={g} />
                    <span>{g.title}</span>
                    <input
                      type="checkbox"
                      checked={collectionGames.includes(g.id)}
                      onChange={() =>
                        setCollectionGames((x) =>
                          x.includes(g.id)
                            ? x.filter((i) => i !== g.id)
                            : [...x, g.id],
                        )
                      }
                    />
                  </label>
                ))}
              </div>
              <button
                className="primary full"
                disabled={!collectionName.trim() || !collectionGames.length}
              >
                Create collection <Plus size={16} />
              </button>
            </form>
          </Dialog>
        )}
        {modal === "import" && (
          <Dialog
            title="Bring a new world with you"
            onClose={() => {
              setModal(null);
              setManifest(null);
              setImportError("");
            }}
          >
            <p className="dialog-subtitle">
              Preview a modular game manifest. This prototype reads metadata
              only and never runs imported code.
            </p>
            <label className="upload-zone">
              <Upload size={30} />
              <strong>Choose a game manifest</strong>
              <span>JSON · up to 100 KB</span>
              <input
                aria-label="Choose game manifest"
                type="file"
                accept=".json,application/json"
                onChange={async (e) => {
                  setManifest(null);
                  setImportError("");
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 100000) {
                    setImportError("Manifest must be smaller than 100 KB.");
                    return;
                  }
                  try {
                    const j = JSON.parse(await f.text());
                    if (
                      typeof j.title !== "string" ||
                      !j.title.trim() ||
                      j.title.length > 100 ||
                      typeof j.version !== "string" ||
                      j.version.length > 30
                    )
                      throw Error();
                    setManifest({ title: j.title.trim(), version: j.version });
                  } catch {
                    setImportError(
                      "Use valid JSON with a title and version, both text.",
                    );
                  }
                }}
              />
            </label>
            <p className="code-example">
              Example: {'{"title":"My concept game","version":"1.0.0"}'}
            </p>
            {importError && (
              <p role="alert" className="error">
                {importError}
              </p>
            )}
            {manifest && (
              <div className="manifest-preview">
                <Check />
                <div>
                  <strong>{manifest.title}</strong>
                  <p>Version {manifest.version} · Valid manifest</p>
                </div>
              </div>
            )}
            <button
              disabled={!manifest || importBusy}
              className="primary full"
              onClick={() => {
                if (!manifest) return;
                setImportBusy(true);
                setTimeout(() => {
                  setImports((x) => [...new Set([...x, manifest.title])]);
                  setImportBusy(false);
                  setModal(null);
                  setManifest(null);
                  go("Library");
                  setNotice("Manifest added. Game execution is simulated.");
                }, 450);
              }}
            >
              {importBusy ? "Adding manifest…" : "Add to local library"}
              <Plus size={16} />
            </button>
          </Dialog>
        )}
        {detail && (
          <Dialog title="Game details" onClose={() => setDetail(null)}>
            <div className="detail-art">
              <Artwork game={detail} />
              <div />
              <span className={"game-wordmark wordmark-" + detail.id}>
                {detail.short}
              </span>
            </div>
            <div className="detail-copy">
              <span className="feature-label">ORIGINAL CONCEPT TITLE</span>
              <h2>{detail.title}</h2>
              <p>{detail.description}</p>
              <div className="detail-facts">
                <div>
                  <small>GENRE</small>
                  <strong>{detail.genre}</strong>
                </div>
                <div>
                  <small>SKILL CONNECTION</small>
                  <strong>{detail.skill}</strong>
                </div>
                <div>
                  <small>SESSION</small>
                  <strong>~{detail.time}</strong>
                </div>
              </div>
              <div className="hero-buttons">
                <Primary onClick={() => play(detail)}>Launch preview</Primary>
                <button
                  className="secondary"
                  onClick={() => favorite(detail.id)}
                >
                  <Star
                    size={16}
                    fill={
                      favorites.includes(detail.id) ? "currentColor" : "none"
                    }
                  />
                  {favorites.includes(detail.id) ? "Favorited" : "Add favorite"}
                </button>
              </div>
              <p className="simulation-note">
                Concept title · Gameplay is not built in this milestone.
              </p>
            </div>
          </Dialog>
        )}
        {launch && (
          <Dialog title="Launch preview" onClose={() => setLaunch(null)}>
            <div className="launch-preview">
              <Artwork game={launch} />
              <Gamepad2 size={42} />
              <h2>{launch.title}</h2>
              <p>Your next session starts here.</p>
              <div className="launch-ready">
                <Check size={16} />
                Simulated launch complete
              </div>
              <p>
                This is a concept title. No playable game is included.
                <br />
                Your recently played library has been updated locally.
              </p>
              <button
                className="primary full"
                onClick={() => {
                  setLaunch(null);
                  setDetail(null);
                }}
              >
                Back to ClassArcade <ChevronRight size={16} />
              </button>
            </div>
          </Dialog>
        )}
        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="toast"
              role="status"
            >
              <Check size={17} />
              {notice}
              <button
                className="icon-button"
                aria-label="Dismiss notification"
                onClick={() => setNotice("")}
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
