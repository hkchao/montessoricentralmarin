export const site = {
  name: "Montessori School of Central Marin",
  shortName: "MSCM",
  tagline: "Bilingual Montessori since 1974",
  description:
    "AMS-affiliated bilingual Montessori preschool in San Rafael. English and Spanish. Ages 2–6.",
  url: "https://www.montessoricentralmarin.org",
  founded: 1974,
  // U+2060 word joiner keeps "2–6" from breaking across lines.
  ages: "Ages 2–\u20606",
  phone: "(415) 456-1748",
  phoneHref: "tel:+14154561748",
  email: "MSCMOfficeAssistant@gmail.com",
  address: {
    street: "317 Auburn Street",
    city: "San Rafael",
    state: "CA",
    zip: "94901",
    full: "317 Auburn Street, San Rafael, CA 94901",
  },
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=317+Auburn+Street+San+Rafael+CA+94901",
  mapsEmbed:
    "https://www.google.com/maps?q=317+Auburn+Street,+San+Rafael,+CA+94901&output=embed",
  hours: "Monday – Friday, 7:30 am – 5:30 pm",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61580809984939",
    yelp: "https://www.yelp.com/biz/montessori-bilingual-school-of-central-marin-san-rafael",
    ams: "https://amshq.org/",
  },
} as const;

export const nav = [
  { label: "Programs", href: "/programs" },
  { label: "Events", href: "/events" },
  { label: "Admissions", href: "/admissions" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const primaryCta = { label: "Schedule a Tour", href: "/contact#tour" } as const;

export const docs = {
  calendar: { label: "2026–27 School Calendar", href: "/docs/calendar-2026-27.pdf" },
  application: { label: "2026–27 Application", href: "/docs/application_2026-27.pdf" },
  enrollment: {
    label: "2026–27 Enrollment Packet (new students)",
    href: "/docs/enrollment_package_2026-27.pdf",
  },
  reEnrollment: {
    label: "2026–27 Re-Enrollment Packet (returning students)",
    href: "/docs/re-enrollment_package_2026-27.pdf",
  },
  tuition: { label: "2026–27 Tuition & Fees", href: "/docs/tuition_2026-27_monthly.pdf" },
} as const;

export type EventItem = {
  date: string;
  month: string;
  day?: string;
  title: string;
  detail?: string;
  closed?: boolean;
};

export const events: EventItem[] = [
  {
    date: "2026-09-16",
    month: "Sep",
    day: "16",
    title: "Parent Education Night",
    detail: "5:30 – 6:30 pm · Montessori in the Classroom",
  },
  {
    date: "2026-10-12",
    month: "Oct",
    day: "12",
    title: "School Closed",
    detail: "Indigenous Peoples' Day",
    closed: true,
  },
  {
    date: "2026-10-21",
    month: "Oct",
    day: "21",
    title: "Parent Education Night",
    detail: "5:30 – 6:30 pm · Montessori in the Home",
  },
  {
    date: "2026-10-30",
    month: "Oct",
    day: "30",
    title: "Halloween Parade",
    detail: "Costumes welcome!",
  },
  {
    date: "2026-11-01",
    month: "Nov",
    title: "Parent Observation Month",
    detail: "Sign up to observe your child's classroom",
  },
  {
    date: "2026-11-11",
    month: "Nov",
    day: "11",
    title: "School Closed",
    detail: "Veterans Day",
    closed: true,
  },
];

export type Program = {
  id: string;
  name: string;
  hours?: string;
  summary: string;
  body: string[];
};

export const programs: Program[] = [
  {
    id: "school-day",
    name: "School Day",
    hours: "9:00 am – 2:45 pm",
    summary: "Morning work period, lunch, then nap or afternoon cultural studies.",
    body: [
      "9:00 am to 2:45 pm, with a 15-minute window for drop-off and pick-up. Lunch is at noon. Children who nap rest from 12:30 – 2:30 pm; others join the afternoon cultural program — zoology, botany, geography, history, music, and art.",
    ],
  },
  {
    id: "day-care",
    name: "Day Care",
    hours: "7:30 am – 5:30 pm",
    summary: "Full-day care around the same Montessori program.",
    body: [
      "7:30 am to 5:30 pm. Before 8:45 am, children choose from art and games. From 9:00 am to noon they join the Montessori work period. After lunch, nap or extended day until 5:30 pm.",
    ],
  },
  {
    id: "partial-week",
    name: "Partial Week",
    hours: "3, 4, or 5 days per week",
    summary: "Any combination of days, kept the same each week.",
    body: [
      "Choose 3, 4, or 5 days (Monday – Friday). For 3- and 4-day schedules, any combination of days is fine as long as they stay consistent. Follows the School Day or Day Care schedule.",
    ],
  },
  {
    id: "summer",
    name: "Summer School",
    hours: "June – August",
    summary: "Montessori continues with a new theme each summer.",
    body: [
      "June, July, and August, with a theme that changes each year. Past themes include human anatomy, the solar system, and marine biology. Field trips close the summer. Starts the Tuesday after the school year ends; finishes the Thursday before the new year begins.",
    ],
  },
];

export type CurriculumArea = {
  id: string;
  name: string;
  short: string;
  body: string[];
  image: { src: string; alt: string };
};

export const curriculum: CurriculumArea[] = [
  {
    id: "practical-life",
    name: "Practical Life",
    short: "Pouring, dressing, sweeping, and courtesy.",
    body: [
      "Everyday work that builds concentration, order, coordination, and independence: care of self, care of the environment, and grace and courtesy.",
    ],
    image: { src: "/images/practical-life-pouring.jpg", alt: "Pouring and transferring materials arranged in baskets on a shelf" },
  },
  {
    id: "sensorial",
    name: "Sensorial",
    short: "Size, shape, color, texture, weight, and sound.",
    body: [
      "Materials isolate one quality at a time — size, shape, color, texture, weight, temperature, sound, smell, or taste — so the child can refine each sense.",
    ],
    image: { src: "/images/sensorial-cylinders.jpg", alt: "A child working with knobless cylinders at a small table" },
  },
  {
    id: "mathematics",
    name: "Mathematics",
    short: "Counting and the decimal system, hands-on first.",
    body: [
      "Children count quantity first, then match it to the numeral. Units, tens, hundreds, and thousands follow the same way. Operations come when the child is ready.",
    ],
    image: { src: "/images/math-shelves.jpg", alt: "Number rods and math materials on low classroom shelves" },
  },
  {
    id: "language",
    name: "Language Arts",
    short: "Listening, speaking, reading, and writing.",
    body: [
      "The classroom models clear, complete English. Phonics materials help children write and read words, phrases, and sentences together.",
    ],
    image: { src: "/images/sandpaper-letters.jpg", alt: "Sandpaper letters a and t" },
  },
  {
    id: "spanish",
    name: "Spanish",
    short: "Daily immersion with native and fluent teachers.",
    body: [
      "Spanish is part of every day. Native and fluent teachers from Spanish-speaking countries lead materials and group work so children hear authentic language.",
    ],
    image: { src: "/images/spanish-alphabet.jpg", alt: "Spanish alphabet cards on a classroom wall" },
  },
  {
    id: "cultural",
    name: "Cultural Studies",
    short: "Zoology, botany, geography, history, music, and art.",
    body: [
      "Zoology, botany, geography, history, music, and art — so children learn to care for their environment and stay curious about the world.",
    ],
    image: { src: "/images/spanish-color-cards.jpg", alt: "Colorful Spanish color-word cards above a classroom shelf" },
  },
];

export const enrichment = [
  { name: "Music", note: "Singing, rhythm, and movement in English and Spanish" },
  { name: "Yoga", note: "Movement and rest" },
  { name: "Cooking", note: "Children cook in class" },
  { name: "Gardening", note: "Seasonal work in our garden" },
  { name: "Dance", note: "Movement and expression" },
  { name: "Art", note: "Open-ended materials" },
] as const;

export const afterSchool = [
  { name: "Gymnastics", note: "After-school extra-curricular" },
  { name: "Drama", note: "After-school extra-curricular" },
] as const;

export const admissionSteps = [
  {
    title: "Schedule a tour",
    body: `Call ${site.phone} or email ${site.email}.`,
  },
  {
    title: "Visit",
    body: "See the classroom and watch children at work.",
  },
  {
    title: "Get the forms",
    body: "We'll email them, or download them below.",
  },
  {
    title: "Apply",
    body: "Return the 2-page application with a $100 application fee and a $500 tuition deposit (check or money order). The fee is non-refundable.",
  },
  {
    title: "Enroll",
    body: "Places are first come, first served. After acceptance, submit the full enrollment packet.",
  },
] as const;
