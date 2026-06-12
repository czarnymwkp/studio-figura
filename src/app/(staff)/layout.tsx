// Panel admina pozostaje zawsze w motywie ciemnym, niezależnie od wyboru klienta —
// klasa "dark" na wrapperze nadpisuje motyw ustawiony przez next-themes na <html>.
export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <div className="dark min-h-svh bg-background text-foreground">{children}</div>
}
