// User roles — primary is Olivia, supportive is Emma
export const ROLES = {
  PRIMARY: "primary",
  SUPPORTIVE: "supportive",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Cities for weather widget
export const CITIES = {
  SARASOTA: { name: "Sarasota", state: "FL", query: "Sarasota,US" },
  THOUSAND_OAKS: { name: "Thousand Oaks", state: "CA", query: "Thousand Oaks,US" },
} as const;

// App route paths
export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  RESET_PASSWORD: "/reset-password",
  HOME: "/home",
  CALENDAR: "/calendar",
  TASKS: "/tasks",
  CHAT: "/chat",
  MESSAGES: "/chat",
  SITES: "/sites",
} as const;
