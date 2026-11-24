import dropInGames from "./generated-games.json";

export type Game = {
  id: number;
  title: string;
  short: string;
  genre: string;
  skill: string;
  description: string;
  color: string;
  time: string;
  progress: number;
  classroom: string[];
  cover?: string;
  launchUrl?: string;
};
const conceptGames: Game[] = [
  {
    id: 0,
    title: "Slope: Overdrive",
    short: "SLOPE",
    genre: "Street racing",
    skill: "Linear equations",
    description:
      "Own the racing line. Tune your ride, read the road, and turn every slope into a competitive edge. The city is yours after dark.",
    color: "#ee9a63",
    time: "24 min",
    progress: 62,
    classroom: ["Algebra 1A"],
  },
  {
    id: 1,
    title: "The Correlation Files",
    short: "THE CORRELATION FILES",
    genre: "Detective mystery",
    skill: "Data & correlation",
    description:
      "Every connection tells a story. Follow a trail through a rain-soaked city, interrogate the evidence, and separate coincidence from the truth.",
    color: "#dab87a",
    time: "18 min",
    progress: 35,
    classroom: ["Algebra 1B"],
  },
  {
    id: 2,
    title: "Graph Runner",
    launchUrl: "/games/graph-runner/index.html",
    short: "GRAPH RUNNER",
    genre: "Futuristic parkour",
    skill: "Coordinate geometry",
    description:
      "Find your trajectory above the city. Map coordinates, connect impossible routes, and make the leap nobody else can see.",
    color: "#ef9285",
    time: "12 min",
    progress: 78,
    classroom: ["Algebra 1A", "Individualized Instruction"],
  },
  {
    id: 3,
    title: "Equation Zero",
    launchUrl: "/games/equation-zero/index.html",
    cover: "/games/equation-zero/cover.svg",
    short: "EQUATION ZERO",
    genre: "Reactor simulation",
    skill: "Solving linear equations",
    description:
      "Stabilize an animated reactor by solving equations. Keep the crew safe as you tackle one-step, two-step, both-sides and distribution challenges.",
    color: "#75f8ff",
    time: "15 min",
    progress: 24,
    classroom: ["Algebra 1B"],
  },
  {
    id: 4,
    title: "Algebra Tycoon",
    short: "ALGEBRA TYCOON",
    genre: "Business simulation",
    skill: "Financial modeling",
    description:
      "Start with a single idea. Build your city, price your next move, and turn smart decisions into an empire.",
    color: "#d5b77b",
    time: "16 min",
    progress: 45,
    classroom: ["Algebra 1A", "Algebra 1B"],
  },
  {
    id: 5,
    title: "System Override",
    short: "SYSTEM OVERRIDE",
    genre: "Cyberpunk hacking",
    skill: "Logic & sequences",
    description:
      "The network has a weakness. Decode its patterns, rewrite the rules, and disappear before the system finds you.",
    color: "#85c9bb",
    time: "21 min",
    progress: 50,
    classroom: ["Individualized Instruction", "Algebra 1B"],
  },
  {
    id: 6,
    title: "DeskFault",
    short: "DESKFAULT",
    genre: "IT support simulator",
    skill: "Problem solving",
    description:
      "Seven tickets. One very long shift. Diagnose broken systems, decode cryptic requests, and keep the office online.",
    color: "#c4aa90",
    time: "14 min",
    progress: 15,
    classroom: ["Individualized Instruction"],
  },
];
export const games: Game[] = [
  ...conceptGames,
  ...(dropInGames as Game[]),
];
export const classroomNames = [
  "Algebra 1A",
  "Algebra 1B",
  "Individualized Instruction",
];
export const concepts = [
  {
    id: "a",
    name: "Command Center",
    label: "Built for your everyday escape.",
    description:
      "A focused desktop home. Your whole library, perfectly within reach.",
    tone: "Precision / familiarity",
    recommend: "Recommended for classroom rollout",
  },
  {
    id: "b",
    name: "Immersive Gaming",
    label: "Enter another world.",
    description:
      "Artwork takes the stage. A cinematic launcher made for discovery.",
    tone: "Atmosphere / focus",
    recommend: "Best for shared displays and discovery",
  },
  {
    id: "c",
    name: "Next Generation",
    label: "Follow your curiosity.",
    description:
      "A constellation of connected worlds. Find your next game by the skills that connect them.",
    tone: "Exploration / connection",
    recommend: "Best for an experimental learning pathway",
  },
];

