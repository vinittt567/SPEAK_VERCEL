import { useEffect, useState } from "react";

export type Role = "student" | "institute" | "counselor" | "admin" | null;
const KEY = "app.role";

export function getStoredRole(): Role {
  const v = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
  if (
    v === "student" ||
    v === "institute" ||
    v === "counselor" ||
    v === "admin"
  )
    return v;
  return null;
}

export function setStoredRole(r: Role) {
  if (typeof window === "undefined") return;
  if (r) localStorage.setItem(KEY, r);
  else localStorage.removeItem(KEY);
  window.dispatchEvent(
    new StorageEvent("storage", { key: KEY, newValue: r || null }),
  );
}

export function useRole() {
  const [role, setRole] = useState<Role>(() => getStoredRole());
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setRole(getStoredRole());
    };
    const onFocus = () => setRole(getStoredRole());
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);
  return {
    role,
    setRole: (r: Role) => {
      setStoredRole(r);
      setRole(r);
    },
  };
}
