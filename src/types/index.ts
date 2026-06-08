export type UserRole = "client" | "employee" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
}
