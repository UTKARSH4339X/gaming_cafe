/** Rate card for Fun Gaming Zone Katwaria. Change prices and copy here. */

export const games = [
  "Valorant",
  "BGMI",
  "CS2",
  "FC 25",
  "GTA V",
  "Fortnite",
  "Call of Duty",
  "League of Legends",
  "Rocket League",
  "Minecraft",
  "Free Fire",
  "Other",
];

function row(prefix, count, tier) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${i + 1}`,
    tier,
  }));
}

export const stations = [
  ...row("A", 8, "standard"),
  ...row("B", 8, "pro"),
  ...row("C", 4, "arena"),
  ...row("PS", 2, "couch"),
  { id: "BOOTH", tier: "squad" },
];

export const sampleHeld = ["A2", "A5", "A7", "B3", "B6", "B8", "C2", "PS1"];

export const tierMeta = {
  standard: {
    name: "Standard",
    short: "STD",
    seats: "A1–A8",
    screen: "1080p · 144Hz",
    note: "The window row. Everyday play.",
    dropIn: 70,
  },
  pro: {
    name: "Pro",
    short: "PRO",
    seats: "B1–B8",
    screen: "1440p-ready · 165Hz",
    note: "Higher settings, still a full desk row.",
    dropIn: 90,
  },
  arena: {
    name: "Arena",
    short: "ARNA",
    seats: "C1–C4",
    screen: "Fast panel · 240Hz",
    note: "The short back row. Four seats only.",
    dropIn: 120,
  },
  couch: {
    name: "Couch",
    short: "PS5",
    seats: "PS1–PS2",
    screen: "55 inch · 2 controllers",
    note: "Lounge seats beside the desk.",
    dropIn: 120,
  },
  squad: {
    name: "Squad booth",
    short: "SQD",
    seats: "Booth",
    screen: "Four Pro desks · closed row",
    note: "Booked as one hold for four players.",
    dropIn: 240,
  },
};

export const schemes = [
  {
    id: "drop-in",
    name: "Drop-in",
    group: "Hourly",
    priceLabel: "₹70",
    unit: "per hour, Standard",
    summary: "Any PC row, billed for the hours you book.",
    detail:
      "Standard ₹70, Pro ₹90, Arena ₹120. One hour minimum, six maximum. The session has to finish by 2:00 AM.",
    fits: "Any open hour · A, B, or C row",
    wallet: false,
    minHours: 1,
    maxHours: 6,
    tiers: ["standard", "pro", "arena"],
    days: "all",
    popular: false,
  },
  {
    id: "couch",
    name: "Couch",
    group: "Hourly",
    priceLabel: "₹120",
    unit: "per hour",
    summary: "PS5 on a 55-inch screen, two controllers.",
    detail: "One to four hours. The lounge sits beside the desk.",
    fits: "Any open hour · PS1 or PS2",
    wallet: false,
    pricePerHour: 120,
    minHours: 1,
    maxHours: 4,
    tiers: ["couch"],
    days: "all",
    popular: false,
  },
  {
    id: "campus",
    name: "Campus Hours",
    group: "Blocks",
    priceLabel: "₹180",
    unit: "for 3 hours",
    summary: "Afternoon block for students. College ID at the desk.",
    detail:
      "Standard rigs only, starts between 11:00 AM and 2:00 PM so you are done by 5:00 PM. Bring a current college ID.",
    fits: "11:00 AM–5:00 PM · Standard · college ID",
    wallet: false,
    fixedHours: 3,
    price: 180,
    tiers: ["standard"],
    days: "all",
    starts: ["11:00", "12:00", "13:00", "14:00"],
    popular: true,
  },
  {
    id: "pro-block",
    name: "Pro Block",
    group: "Blocks",
    priceLabel: "₹340",
    unit: "for 5 hours",
    summary: "A long sitting on a Pro rig.",
    detail: "Five hours on the B row. The session has to finish by 2:00 AM.",
    fits: "Any start that ends by 2:00 AM · Pro",
    wallet: false,
    fixedHours: 5,
    price: 340,
    tiers: ["pro"],
    days: "all",
    popular: false,
  },
  {
    id: "night",
    name: "Night Shift",
    group: "Blocks",
    priceLabel: "₹450",
    unit: "until 6:00 AM",
    summary: "One flat rate from late evening through early morning.",
    detail:
      "Arrive at 10:00 PM, 11:00 PM, or midnight. Standard or Pro. The counter stays open. You leave by 6:00 AM.",
    fits: "10:00 PM, 11:00 PM, or midnight · Standard or Pro",
    wallet: false,
    price: 450,
    flatUntil: "06:00",
    tiers: ["standard", "pro"],
    days: "all",
    starts: ["22:00", "23:00", "00:00"],
    popular: true,
  },
  {
    id: "weekend",
    name: "Weekend Lock",
    group: "Blocks",
    priceLabel: "₹699",
    unit: "for 6 hours",
    summary: "Saturday or Sunday, one long hold.",
    detail: "Standard or Pro. Six hours, and you still finish by 2:00 AM.",
    fits: "Saturday and Sunday · Standard or Pro",
    wallet: false,
    fixedHours: 6,
    price: 699,
    tiers: ["standard", "pro"],
    days: "weekend",
    popular: false,
  },
  {
    id: "squad",
    name: "Squad Row",
    group: "Group",
    priceLabel: "₹240",
    unit: "per player · 3 hours",
    summary: "The closed booth. Four seats kept together.",
    detail:
      "₹960 for the booth, four players, three hours on Pro desks. Booked as one hold under the squad lead.",
    fits: "Any start that ends by 2:00 AM · booth of 4",
    wallet: false,
    fixedHours: 3,
    price: 960,
    tiers: ["squad"],
    days: "all",
    popular: false,
  },
  {
    id: "ledger",
    name: "Month Ledger",
    group: "Membership",
    priceLabel: "₹1,299",
    unit: "20 hours · 30 days",
    summary: "An hour wallet for regulars. Standard and Pro.",
    detail:
      "Pay once at the desk. Each booking spends hours. One sitting can use up to 5 hours. Unused hours expire after 30 days.",
    fits: "Any open hour · Standard or Pro · 30 days",
    wallet: true,
    walletHours: 20,
    validDays: 30,
    price: 1299,
    tiers: ["standard", "pro"],
    days: "all",
    minHours: 1,
    maxHours: 5,
    popular: true,
  },
  {
    id: "arena-ledger",
    name: "Arena Ledger",
    group: "Membership",
    priceLabel: "₹2,199",
    unit: "20 hours · 30 days",
    summary: "The same kind of wallet, only on the Arena row.",
    detail:
      "Twenty hours on C1–C4, valid 30 days. Up to 5 hours in one sitting.",
    fits: "Any open hour · Arena only · 30 days",
    wallet: true,
    walletHours: 20,
    validDays: 30,
    price: 2199,
    tiers: ["arena"],
    days: "all",
    minHours: 1,
    maxHours: 5,
    popular: false,
  },
  {
    id: "bootcamp",
    name: "Bootcamp",
    group: "Membership",
    priceLabel: "₹999",
    unit: "10 hours · 45 days",
    summary: "Weekday afternoons only, on Standard rigs.",
    detail:
      "Monday to Friday, starts from 11:00 AM to 2:00 PM. Ten hours, valid 45 days, up to 3 hours in one sitting.",
    fits: "Weekdays 11:00 AM–5:00 PM · Standard",
    wallet: true,
    walletHours: 10,
    validDays: 45,
    price: 999,
    tiers: ["standard"],
    days: "weekday",
    starts: ["11:00", "12:00", "13:00", "14:00"],
    minHours: 1,
    maxHours: 3,
    popular: false,
  },
];

export const schemeGroups = ["Hourly", "Blocks", "Group", "Membership"];

export const faqs = [
  {
    q: "Do I have to register before I play?",
    a: "Yes. The floor runs on player passes. Make a pass, pick a scheme, and the desk holds the station. Walk-ups at 8 PM wait on whatever is left.",
  },
  {
    q: "Where do I pay?",
    a: "At the Katwaria desk. This site shows the amount and keeps the hold. It does not take the payment.",
  },
  {
    q: "Where is the cafe?",
    a: "Katwaria Sarai, New Delhi. The desk confirms the lane when you give your player ID.",
  },
  {
    q: "What if I am late?",
    a: "The seat is held for 15 minutes after the start time. After that it can go to the floor.",
  },
  {
    q: "Can a friend use my hours?",
    a: "Ledger, Arena Ledger, and Bootcamp hours stay on your pass. For a group, book Squad Row. That hold is for four players in the booth.",
  },
  {
    q: "What should I bring for Campus Hours?",
    a: "A current college ID. The desk checks it when you sit down. Without it, the visit is billed as Drop-in.",
  },
];

export function inr(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(hhmm) {
  const [hRaw, mRaw] = hhmm.split(":").map(Number);
  const suffix = hRaw % 24 >= 12 ? "PM" : "AM";
  const hour12 = hRaw % 12 === 0 ? 12 : hRaw % 12;
  return `${hour12}:${String(mRaw).padStart(2, "0")} ${suffix}`;
}

export function formatDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatPhone(phone) {
  const digits = String(phone).replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return phone;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function todayISO() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function addDays(iso, days) {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + days);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function toClock(hhmm) {
  let [hours, minutes] = hhmm.split(":").map(Number);
  if (hours < 6) hours += 24;
  return hours * 60 + minutes;
}

export function floorStatus(now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = mins >= 11 * 60 || mins < 2 * 60;
  return open
    ? { open: true, label: "Floor open" }
    : { open: false, label: "Opens 11:00 AM" };
}

export function dayAllowed(scheme, iso) {
  const day = new Date(`${iso}T12:00:00`).getDay();
  if (scheme.days === "weekend") return day === 0 || day === 6;
  if (scheme.days === "weekday") return day >= 1 && day <= 5;
  return true;
}

export function isPastSlot(iso, hhmm, now = new Date()) {
  const start = new Date(`${iso}T${hhmm}:00`);
  if (toClock(hhmm) >= 24 * 60) start.setDate(start.getDate() + 1);
  return start.getTime() < now.getTime();
}

export function sessionHours(scheme, chosen) {
  if (scheme.fixedHours) return scheme.fixedHours;
  const min = scheme.minHours || 1;
  const max = scheme.maxHours || min;
  const value = Number(chosen) || min;
  return Math.min(max, Math.max(min, value));
}

export function sessionMinutes(scheme, start, hours) {
  if (scheme.flatUntil) {
    let end = toClock(scheme.flatUntil);
    const begin = toClock(start);
    if (end <= begin) end += 24 * 60;
    return end - begin;
  }
  return hours * 60;
}

const OPEN = 11 * 60;
const CLOSE = 26 * 60;

export function fitsWindow(scheme, start, hours) {
  if (scheme.flatUntil) return (scheme.starts || []).includes(start);
  const begin = toClock(start);
  const end = begin + hours * 60;
  return begin >= OPEN && end <= CLOSE;
}

export function startOptions(scheme) {
  if (scheme.starts) return scheme.starts;
  const starts = [];
  for (let hour = 11; hour <= 25; hour += 1) {
    starts.push(`${String(hour % 24).padStart(2, "0")}:00`);
  }
  return starts;
}

export function dueNow(scheme, tier, hours, walletActive) {
  if (scheme.wallet) return walletActive ? 0 : scheme.price;
  if (scheme.id === "drop-in") return (tierMeta[tier]?.dropIn || 70) * hours;
  if (scheme.pricePerHour) return scheme.pricePerHour * hours;
  return scheme.price;
}

export function heldByDate(iso) {
  const seed = [...iso].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const held = new Set();
  const count = 5;
  for (let i = 0; i < count; i += 1) {
    held.add(stations[(seed + i * 7) % stations.length].id);
  }
  return held;
}

export function rangesOverlap(startA, minutesA, startB, minutesB) {
  const a1 = toClock(startA);
  const a2 = a1 + minutesA;
  const b1 = toClock(startB);
  const b2 = b1 + minutesB;
  return a1 < b2 && b1 < a2;
}

export function bookingEnd(booking) {
  const start = new Date(`${booking.date}T${booking.start}:00`);
  if (toClock(booking.start) >= 24 * 60) start.setDate(start.getDate() + 1);
  return new Date(start.getTime() + booking.minutes * 60000);
}

export function isUpcoming(booking, now = new Date()) {
  return bookingEnd(booking).getTime() > now.getTime();
}

export function hoursLabel(scheme, hours) {
  if (scheme.flatUntil) return `until ${formatTime(scheme.flatUntil)}`;
  return hours === 1 ? "1 hour" : `${hours} hours`;
}
