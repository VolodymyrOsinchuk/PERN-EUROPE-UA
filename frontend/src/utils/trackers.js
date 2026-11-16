/*
 * Registry of OPTIONAL integrations. It is intentionally empty:
 * no analytics or marketing service is used by the site today.
 *
 * To add a service:
 *  - set `category` to "analytics" or "marketing"
 *  - load() runs ONLY after that category is consented
 *  - unload() must remove every node/cookie the service created
 */
export const TRACKERS = [
  // Example (do not enable without a real service):
  // {
  //   id: "example-analytics",
  //   category: "analytics",
  //   load() {
  //     const s = document.createElement("script");
  //     s.src = "https://example.com/tracker.js";
  //     s.async = true;
  //     s.dataset.uveTracker = "example-analytics";
  //     document.head.appendChild(s);
  //   },
  //   unload() {
  //     document
  //       .querySelectorAll('[data-uve-tracker="example-analytics"]')
  //       .forEach((n) => n.remove());
  //     deleteCookie("_example_id");
  //   },
  // },
];

// Cookies that must never be removed by consent logic.
const PROTECTED_COOKIES = ["token"];

export function deleteCookie(name) {
  if (PROTECTED_COOKIES.includes(name)) return;
  document.cookie = `${name}=; Max-Age=0; path=/`;
}
