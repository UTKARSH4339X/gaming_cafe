import { createContext, useContext, useEffect, useState } from "react";
import { schemes } from "./data";

const KEY = "fgz-katwaria";
const DeskContext = createContext(null);

function emptyState() {
  return { player: null, bookings: [] };
}

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return {
      player: parsed.player || null,
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
    };
  } catch {
    return emptyState();
  }
}

function makePlayerId() {
  const letters = "KATWARIA";
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `FGZ-${letter}${number}`;
}

export function DeskProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  function savePlayer(fields) {
    setState((current) => ({
      ...current,
      player: {
        id: current.player?.id || makePlayerId(),
        createdAt: current.player?.createdAt || new Date().toISOString(),
        wallets: current.player?.wallets || {},
        ...fields,
      },
    }));
  }

  function holdSeat(booking) {
    setState((current) => {
      const wallets = { ...(current.player?.wallets || {}) };
      if (booking.hoursSpent) {
        const scheme = schemes.find((item) => item.id === booking.schemeId);
        const existing = wallets[booking.schemeId];
        const active = existing && existing.expires >= booking.date && existing.remaining > 0;
        if (!active) {
          wallets[booking.schemeId] = {
            remaining: Math.max(0, scheme.walletHours - booking.hoursSpent),
            total: scheme.walletHours,
            expires: booking.walletExpires,
            activated: booking.date,
          };
        } else {
          wallets[booking.schemeId] = {
            ...existing,
            remaining: Math.max(0, existing.remaining - booking.hoursSpent),
          };
        }
      }
      return {
        ...current,
        player: { ...current.player, wallets },
        bookings: [...current.bookings, booking],
      };
    });
  }

  function cancelBooking(id) {
    setState((current) => {
      const booking = current.bookings.find((item) => item.id === id);
      if (!booking) return current;
      const wallets = { ...(current.player?.wallets || {}) };
      if (booking.hoursSpent && wallets[booking.schemeId]) {
        const wallet = wallets[booking.schemeId];
        wallets[booking.schemeId] = {
          ...wallet,
          remaining: Math.min(wallet.total, wallet.remaining + booking.hoursSpent),
        };
      }
      return {
        ...current,
        player: { ...current.player, wallets },
        bookings: current.bookings.filter((item) => item.id !== id),
      };
    });
  }

  function clearPass() {
    setState(emptyState());
  }

  const value = {
    player: state.player,
    bookings: state.bookings,
    savePlayer,
    holdSeat,
    cancelBooking,
    clearPass,
  };

  return <DeskContext.Provider value={value}>{children}</DeskContext.Provider>;
}

export function useDesk() {
  const value = useContext(DeskContext);
  if (!value) throw new Error("useDesk must be used inside DeskProvider");
  return value;
}

export function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function useTitle(page) {
  useEffect(() => {
    document.title = page
      ? `${page} · Fun Gaming Zone Katwaria`
      : "Fun Gaming Zone Katwaria";
  }, [page]);
}
