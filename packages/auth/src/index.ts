export * from "./jwt";
export type { JWTPayload } from "./jwt";

// Re-export initAuth for tanstack-start compatibility
export { initAuth } from "./better-auth";
export type { Auth, Session } from "./better-auth";
