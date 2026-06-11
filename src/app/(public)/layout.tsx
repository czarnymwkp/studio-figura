import Wrapper from "@/components/layout/Wrapper";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Wrapper>{children}</Wrapper>
    </main>
  );
}
