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
    bestOfMarin: "https://pacificsun.com/best-of/",
  },
} as const;

export const nav = [
  { label: "Programs", href: "/programs" },
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
    summary: "Morning work period, lunch, then nap or afternoon circle and work.",
    body: [
      "9:00 am to 2:45 pm, with a 15-minute window for drop-off and pick-up. Lunch is at noon. Toddlers and preschoolers (who still nap) rest from 12:30 – 2:30 pm while their classmates engage in the afternoon circle time and work period.",
    ],
  },
  {
    id: "day-care",
    name: "Day Care",
    hours: "7:30 am – 5:30 pm",
    summary: "Full-day care around the same Montessori school day.",
    body: [
      "7:30 am to 5:30 pm. Before 8:45 am, children choose from art and games. From 9:00 am to 2:45 pm they join the regular school day. Extended care lasts until 5:30 pm with the children getting a period outside on a playground as well as in the Day Care room. Those children who attend on Fridays past 5 pm will have an opportunity to practice Grace & Courtesy during “Tea Time” from 5:10 pm – 5:20 pm.",
    ],
  },
  {
    id: "partial-week",
    name: "Partial Week",
    hours: "3, 4, or 5 days per week",
    summary: "Any combination of days, kept the same each week.",
    body: [
      "Choose 3, 4, or 5 days (Monday – Friday). For 3- and 4-day schedules, days must remain consistent but any combination is welcome.",
    ],
  },
  {
    id: "summer",
    name: "Summer School",
    hours: "June – August",
    summary: "A relaxed single-subject theme on a three-year rotation.",
    body: [
      "Summer school runs from June to August, with a more relaxed single subject curriculum that changes each year on a three year rotation. These themes include human anatomy, the solar system, and marine biology. Summer session starts the Tuesday after the school year ends; finishes the Thursday before the new school year begins. Current families have priority for Summer enrollment; new families may start their child early during the summer only if space allows.",
    ],
  },
];

export type DaySlot = { time: string; label: string };
export type DaySection = { name: string; slots: DaySlot[] };
export type DaySchedule = { id: string; title: string; sections: DaySection[] };

export const daySchedules: DaySchedule[] = [
  {
    id: "toddlers",
    title: "A typical day — Toddlers",
    sections: [
      {
        name: "Morning Session",
        slots: [
          { time: "7:30 – 8:45 am", label: "Arrival & Morning Care" },
          { time: "8:30 – 9:00 am", label: "Morning Care Outdoor Recess" },
          { time: "9:30 – 9:45 am", label: "Circle Time" },
          { time: "9:45 – 10:00 am", label: "Snack" },
          { time: "10:00 – 11:00 am", label: "Recess: Outdoor time" },
          { time: "11:00 – 11:30 am", label: "Work Period" },
          { time: "11:30 – 11:45 am", label: "Spanish Circle Time" },
          { time: "11:50 am – 12:25 pm", label: "Lunch" },
        ],
      },
      {
        name: "Afternoon Session",
        slots: [
          { time: "12:30 – 2:30 pm", label: "Nap Time" },
          { time: "2:45 – 3:00 pm", label: "Snack" },
        ],
      },
      {
        name: "Afternoon Daycare",
        slots: [
          { time: "3:00 – 4:00 pm", label: "Recess: Outdoor Time" },
          { time: "4:00 – 5:30 pm", label: "Free Play" },
          { time: "5:30 pm", label: "End of Day" },
        ],
      },
    ],
  },
  {
    id: "preschoolers",
    title: "A typical day — Preschoolers",
    sections: [
      {
        name: "Morning Session",
        slots: [
          { time: "7:30 – 8:45 am", label: "Arrival & Morning Care" },
          { time: "8:30 – 9:00 am", label: "Morning Care Outdoor Recess" },
          { time: "9:10 – 9:30 am", label: "Circle Time" },
          { time: "9:30 – 10:45 am", label: "Work Period" },
          { time: "10:45 – 11:00 am", label: "Spanish Circle Time" },
          { time: "11:00 – 11:45 am", label: "Recess: Outdoor Time" },
          { time: "11:30 – 11:45 am", label: "Spanish Circle Time" },
          { time: "12:00 – 12:30 pm", label: "Lunch" },
        ],
      },
      {
        name: "Afternoon Session",
        slots: [
          { time: "12:30 – 2:30 pm", label: "Nap Time (for those children who still nap)" },
          { time: "12:30 – 1:00 pm", label: "Rest Time (for non-napping children)" },
          { time: "1:00 – 1:20 pm", label: "Circle Time" },
          { time: "1:20 – 2:30 pm", label: "Work Period" },
          { time: "2:30 – 2:45 pm", label: "Movement Circle Time (for non-napping children)" },
          { time: "2:45 – 3:00 pm", label: "Snack" },
        ],
      },
      {
        name: "Afternoon Daycare",
        slots: [
          {
            time: "3:00 – 4:00 pm",
            label: "Recess: Outdoor Time (R1) & Daycare (R2) Free Play",
          },
          {
            time: "4:00 – 5:00 pm",
            label: "Recess: Outdoor Time (R2) & Daycare (R1) Free Play",
          },
          { time: "5:30 pm", label: "End of Day" },
        ],
      },
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
    short: "Pouring, dressing, sweeping, and Grace & Courtesy.",
    body: [
      "Everyday work that builds concentration, order, coordination, and independence: care of self, care of the environment, and grace and courtesy.",
    ],
    image: {
      src: "/images/practical-life-pouring.jpg",
      alt: "Pouring and transferring materials arranged in baskets on a shelf",
    },
  },
  {
    id: "sensorial",
    name: "Sensorial",
    short: "Size, shape, color, texture, weight, and sound.",
    body: [
      "Materials isolate one quality at a time — size, shape, color, texture, weight, temperature, sound, smell, or taste — so the child can refine each sense.",
    ],
    image: {
      src: "/images/sensorial-cylinders.jpg",
      alt: "A child working with knobless cylinders at a small table",
    },
  },
  {
    id: "mathematics",
    name: "Mathematics",
    short: "Counting, fractions, place value, and order.",
    body: [
      "Children count quantity first, then match it to the numeral. Units, tens, hundreds, and thousands follow the same way. Operations come when the child is ready.",
    ],
    image: {
      src: "/images/math-shelves.jpg",
      alt: "Number rods and math materials on low classroom shelves",
    },
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
    image: {
      src: "/images/spanish-alphabet.jpg",
      alt: "Spanish alphabet cards on a classroom wall",
    },
  },
  {
    id: "cultural",
    name: "Cultural Studies",
    short: "Zoology, botany, geography, history, music, and art.",
    body: [
      "Zoology, botany, geography, history, music, and art — so children learn to care for their environment and stay curious about the world.",
    ],
    image: {
      src: "/images/spanish-color-cards.jpg",
      alt: "Colorful Spanish color-word cards above a classroom shelf",
    },
  },
];

export type EnrichmentItem = {
  name: string;
  note: string;
  badge?: string;
};

export const enrichment: EnrichmentItem[] = [
  { name: "Music", note: "Singing, rhythm, and movement" },
  { name: "Yoga", note: "Movement and rest" },
  { name: "Cooking", note: "Cleaning, cutting, measuring, and nutrition" },
  { name: "Gardening", note: "Watering and husbandry of plants and the natural world" },
  { name: "Art", note: "Fine motor skills and self expression" },
  {
    name: "Gymnastics",
    note: "After-school extra-curricular",
    badge: "After school · Sign up",
  },
  {
    name: "Athletics",
    note: "After-school extra-curricular",
    badge: "After school · Sign up",
  },
  {
    name: "Reading",
    note: "Curated monthly reading",
    badge: "Take home · Sign up",
  },
  { name: "Field trips", note: "One in the Fall, one in the Spring" },
];

export const admissionSteps = [
  {
    title: "Schedule a virtual tour",
    body: `Call ${site.phone} or email ${site.email}.`,
  },
  {
    title: "Visit in-person (optional)",
    body: "See the classroom and watch children at work.",
  },
  {
    title: "Get the forms",
    body: "You can download them below or request us to email them to you.",
  },
  {
    title: "Apply",
    body: "Return the 2-page application with a $100 application fee and a $500 tuition deposit (check or money order). The fee is non-refundable.",
  },
  {
    title: "Enroll",
    body: "Acceptance is first come, first served. We will let you know when we have received your application and when to expect a response regarding acceptance. After acceptance, please submit the full enrollment packet which will be emailed to you or you can download below.",
  },
] as const;
