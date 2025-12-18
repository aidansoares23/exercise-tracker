const BASE =
  (process.env.REACT_APP_API_URL || "").replace(/\/+$/, ""); // trim trailing slashes

export function apiUrl(path) {
  // path should start with "/"
  return `${BASE}${path}`;
}
