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
  HOME: "/",
  LOGIN: "/login",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  CALENDAR: "/calendar",
  TASKS: "/tasks",
  MESSAGES: "/messages",
  SITES: "/sites",
} as const;
