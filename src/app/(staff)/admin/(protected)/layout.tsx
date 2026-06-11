"use client";

import useRequireAuth from "@/lib/hooks/useRequireAuth";
import { UserRole } from "@/types";

const ALLOWED_ROLES: UserRole[] = ["admin", "employee"];

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useRequireAuth(ALLOWED_ROLES);

  if (loading || !profile) return null;

  return <>{children}</>;
}
