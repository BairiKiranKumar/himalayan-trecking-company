export type Difficulty = "Easy" | "Moderate" | "Challenging";
export type Season = "Spring" | "Summer" | "Monsoon" | "Autumn" | "Winter";

export interface Trek {
  id: string;
  name: string;
  region: string;
  days: number;
  maxAlt: number;
  difficulty: Difficulty;
  seasons: Season[];
  price: number;
  image: string;
  blurb: string;
}

export const treks: Trek[] = [
  {
    id: "kedarkantha",
    name: "Kedarkantha",
    region: "Uttarakhand",
    days: 6,
    maxAlt: 3800,
    difficulty: "Easy",
    seasons: ["Winter", "Spring"],
    price: 14500,
    image: "/media/trek-kedarkantha.webp",
    blurb: "A snow summit above pine forest, made for a first winter trek.",
  },
  {
    id: "kuari",
    name: "Kuari Pass",
    region: "Uttarakhand",
    days: 6,
    maxAlt: 3650,
    difficulty: "Easy",
    seasons: ["Winter", "Spring", "Autumn"],
    price: 13900,
    image: "/media/trek-kuari.webp",
    blurb: "Oak forest and open meadows with Nanda Devi in view most days.",
  },
  {
    id: "valley-of-flowers",
    name: "Valley of Flowers",
    region: "Uttarakhand",
    days: 6,
    maxAlt: 4330,
    difficulty: "Moderate",
    seasons: ["Monsoon"],
    price: 16500,
    image: "/media/trek-valley-of-flowers.webp",
    blurb: "A monsoon valley in full bloom, then the climb to Hemkund lake.",
  },
  {
    id: "hampta",
    name: "Hampta Pass",
    region: "Himachal Pradesh",
    days: 5,
    maxAlt: 4270,
    difficulty: "Moderate",
    seasons: ["Summer", "Monsoon"],
    price: 15900,
    image: "/media/trek-hampta.webp",
    blurb: "Cross from green Kullu into the bare, bright desert of Spiti.",
  },
  {
    id: "markha",
    name: "Markha Valley",
    region: "Ladakh",
    days: 8,
    maxAlt: 5260,
    difficulty: "Challenging",
    seasons: ["Summer", "Monsoon"],
    price: 24000,
    image: "/media/trek-markha.webp",
    blurb: "Canyons, monasteries and village homestays under the Kongmaru La.",
  },
  {
    id: "rupin",
    name: "Rupin Pass",
    region: "Himachal Pradesh",
    days: 8,
    maxAlt: 4650,
    difficulty: "Challenging",
    seasons: ["Summer", "Autumn"],
    price: 21500,
    image: "/media/trek-rupin.webp",
    blurb: "Cliff villages, a three-tier waterfall and a steep snow gully to finish.",
  },
  {
    id: "pin-bhaba",
    name: "Pin Bhaba Pass",
    region: "Himachal Pradesh",
    days: 9,
    maxAlt: 4915,
    difficulty: "Challenging",
    seasons: ["Summer", "Monsoon"],
    price: 23000,
    image: "/media/trek-pin-bhaba.webp",
    blurb: "From Kinnaur forest to the high, wide emptiness of the Pin valley.",
  },
  {
    id: "goechala",
    name: "Goechala",
    region: "Sikkim",
    days: 11,
    maxAlt: 4600,
    difficulty: "Challenging",
    seasons: ["Spring", "Autumn"],
    price: 27500,
    image: "/media/trek-goechala.webp",
    blurb: "Rhododendron forest to a sunrise face to face with Kanchenjunga.",
  },
];

export const difficulties: Difficulty[] = ["Easy", "Moderate", "Challenging"];
export const seasons: Season[] = ["Spring", "Summer", "Monsoon", "Autumn", "Winter"];

export const durations = [
  { id: "short", label: "Up to 6", test: (d: number) => d <= 6 },
  { id: "mid", label: "7 to 9", test: (d: number) => d >= 7 && d <= 9 },
  { id: "long", label: "10 or more", test: (d: number) => d >= 10 },
] as const;

/** Rupin Pass, Dhaula to Sangla. km is cumulative trail distance. */
export const camps = [
  { name: "Dhaula", day: 1, km: 0, alt: 1550 },
  { name: "Sewa", day: 1, km: 6, alt: 1900 },
  { name: "Jiskun", day: 2, km: 13, alt: 2400 },
  { name: "Jhaka", day: 3, km: 17, alt: 2650 },
  { name: "Saruwas Thach", day: 4, km: 24, alt: 3400 },
  { name: "Dhanderas Thach", day: 5, km: 28, alt: 3550 },
  { name: "Upper Waterfall", day: 6, km: 32, alt: 4000 },
  { name: "Rupin Pass", day: 7, km: 36, alt: 4650 },
  { name: "Ronti Gad", day: 7, km: 40, alt: 4050 },
  { name: "Sangla", day: 8, km: 50, alt: 2700 },
];

export const gallery = [
  { image: "/media/gallery-1.webp", day: "Day 2", place: "Jiskun", line: "Slate roofs on the cliff edge, and tea before you have taken your pack off." },
  { image: "/media/gallery-2.webp", day: "Day 5", place: "Dhanderas Thach", line: "A wide bowl of grass with the waterfall in view from every tent." },
  { image: "/media/gallery-3.webp", day: "Day 7", place: "The gully", line: "An early start, crampons on, one steady step at a time." },
  { image: "/media/gallery-4.webp", day: "Day 7", place: "Rupin Pass, 4,650 m", line: "Prayer flags, a lot of wind, and Kinnaur laid out below." },
  { image: "/media/gallery-5.webp", day: "Day 8", place: "Sangla", line: "Apple orchards, a hot meal and a road home." },
];

export const leaders = [
  { name: "Govind Rawat", role: "Lead guide, Garhwal", years: 22, image: "/media/leader-1.webp" },
  { name: "Ananya Negi", role: "Trek leader, Himachal", years: 7, image: "/media/leader-2.webp" },
  { name: "Tsering Dorjay", role: "Lead guide, Ladakh", years: 16, image: "/media/leader-3.webp" },
  { name: "Pema Lhamu Bhutia", role: "Mountaineer, Sikkim", years: 11, image: "/media/leader-4.webp" },
  { name: "Rohit Thakur", role: "Trek leader, Kullu", years: 9, image: "/media/leader-5.webp" },
];

export const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");
export const formatAlt = (n: number) => n.toLocaleString("en-IN") + " m";
