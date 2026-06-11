"use client";

import LoginForm from "@/components/admin/LoginForm";
import { Card } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="flex flex-col gap-4 items-center w-full max-w-sm border-2 border-orange-500/10 bg-white/5 p-4">
        <LoginForm />
      </Card>
    </div>
  );
}
