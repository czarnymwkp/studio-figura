import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <Card className="flex flex-col gap-4 items-center w-full max-w-sm mx-auto border-2 border-orange-500/10 bg-white/5 p-4">
      <img src="/img/logo.png" alt="Logo" width={100} height={100} className="rounded-lg" />
      <h1 className="text-xl font-bold text-white">LOGOWANIE</h1>
      <Input type="text" placeholder="Email" className="border border-white/10 p-2 rounded-md text-white" />
      <Input type="password" placeholder="Hasło" className="border border-white/10 p-2 rounded-md text-white" />
      <Button variant="default" size="lg" className="w-full bg-orange-500">Zaloguj</Button>
    </Card>
  );
}
