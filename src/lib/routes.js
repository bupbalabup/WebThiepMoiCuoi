export const SIDE_CONFIG = {
  groom: {
    path: "/nha-trai",
    rsvpPath: "/nha-trai/phuc-dap",
    label: "Nhà trai",
  },
  bride: {
    path: "/nha-gai",
    rsvpPath: "/nha-gai/phuc-dap",
    label: "Nhà gái",
  },
};

export function normalizePath(pathname) {
  const clean = pathname.replace(/\/{2,}/g, "/").replace(/\/$/, "");
  return clean || "/";
}

export function matchRoute(pathname) {
  const path = normalizePath(pathname);
  if (path === "/") return { page: "home" };

  for (const [side, config] of Object.entries(SIDE_CONFIG)) {
    if (path === config.path) return { page: "invitation", side, slug: null };
    if (path === config.rsvpPath) return { page: "rsvp", side, slug: null };
    if (path.startsWith(`${config.path}/`)) {
      let slug;
      try { slug = decodeURIComponent(path.slice(config.path.length + 1)); }
      catch { return { page: "not-found" }; }
      if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug !== "phuc-dap") {
        return { page: "invitation", side, slug };
      }
    }
  }

  return { page: "not-found" };
}

export function buildRsvpUrl(side, slug) {
  const base = SIDE_CONFIG[side].rsvpPath;
  return slug ? `${base}?khach=${encodeURIComponent(slug)}` : base;
}
