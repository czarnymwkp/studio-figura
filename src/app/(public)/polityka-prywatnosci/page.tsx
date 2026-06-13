import type { Metadata } from "next"
import { SiteHeader } from "@/components/public/SiteHeader"
import { SiteFooter } from "@/components/public/SiteFooter"

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Polityka prywatności Studio Figura — informacje o przetwarzaniu danych osobowych, plikach cookies i prawach użytkownika.",
  alternates: { canonical: "/polityka-prywatnosci" },
}

const SECTIONS = [
  {
    h2: "1. Administrator danych osobowych",
    body: `Administratorem Twoich danych osobowych jest Studio Figura sp. z o.o. z siedzibą w Polsce (dalej: „Administrator"). We wszelkich sprawach dotyczących przetwarzania danych osobowych możesz skontaktować się z nami pod adresem e-mail: rodo@studiofigura.pl.`,
  },
  {
    h2: "2. Jakie dane przetwarzamy",
    body: `W zależności od zakresu korzystania z naszych usług przetwarzamy następujące dane:
• imię i nazwisko,
• adres e-mail,
• numer telefonu,
• dane dotyczące rezerwacji i historii wizyt,
• punkty lojalnościowe,
• dane dotyczące logowań do panelu klienta (data, czas).

Dane podajesz dobrowolnie. Niepodanie danych wymaganych do założenia konta uniemożliwi korzystanie z panelu klienta.`,
  },
  {
    h2: "3. Cele i podstawy prawne przetwarzania",
    body: `Twoje dane przetwarzamy w następujących celach:

a) Realizacja umowy o usługi (art. 6 ust. 1 lit. b RODO) — obsługa konta klienta, rezerwacji i historii wizyt.

b) Uzasadniony interes Administratora (art. 6 ust. 1 lit. f RODO) — program lojalnościowy, bezpieczeństwo systemu, statystyki użytkowania.

c) Spełnienie obowiązków prawnych (art. 6 ust. 1 lit. c RODO) — obowiązki wynikające z prawa podatkowego i rachunkowego.

d) Zgoda (art. 6 ust. 1 lit. a RODO) — wysyłka newslettera i komunikacji marketingowej, jeśli wyraziłaś na to zgodę.`,
  },
  {
    h2: "4. Okres przechowywania danych",
    body: `Dane przechowujemy przez czas niezbędny do realizacji celu, w jakim zostały zebrane:
• dane konta klienta — przez czas trwania umowy, a po jej zakończeniu przez wymagany przepisami prawa okres,
• dane wymagane przepisami podatkowymi — przez 5 lat od zakończenia roku, w którym powstał obowiązek podatkowy,
• dane przetwarzane na podstawie zgody — do czasu cofnięcia zgody.`,
  },
  {
    h2: "5. Prawa użytkownika",
    body: `Przysługują Ci następujące prawa:
• prawo dostępu do danych (art. 15 RODO),
• prawo do sprostowania danych (art. 16 RODO),
• prawo do usunięcia danych („prawo do bycia zapomnianym", art. 17 RODO),
• prawo do ograniczenia przetwarzania (art. 18 RODO),
• prawo do przenoszenia danych (art. 20 RODO),
• prawo sprzeciwu wobec przetwarzania (art. 21 RODO),
• prawo do cofnięcia zgody w dowolnym momencie (bez wpływu na zgodność z prawem przetwarzania, które miało miejsce przed jej cofnięciem),
• prawo wniesienia skargi do organu nadzorczego — Prezesa Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa.

Aby skorzystać ze swoich praw, skontaktuj się z nami pod adresem rodo@studiofigura.pl.`,
  },
  {
    h2: "6. Odbiorcy danych",
    body: `Twoje dane mogą być przekazywane podmiotom przetwarzającym dane w naszym imieniu, w tym dostawcom usług IT (hosting, bazy danych, poczta elektroniczna). Podmioty te działają wyłącznie na nasze polecenie i zgodnie z zawartymi umowami powierzenia przetwarzania danych. Nie sprzedajemy Twoich danych osobom trzecim.`,
  },
  {
    h2: "7. Pliki cookies",
    body: `Nasza strona internetowa używa plików cookies (ciasteczek). Cookies to małe pliki tekstowe zapisywane na Twoim urządzeniu.

Używamy cookies:
• niezbędnych — zapewniają podstawowe funkcjonowanie strony (sesja logowania, preferencje języka),
• analitycznych — pomagają nam zrozumieć, w jaki sposób odwiedzający korzystają ze strony (np. Google Analytics),
• funkcjonalnych — zapamiętują Twoje preferencje (np. wybrany motyw strony).

Cookies analityczne i funkcjonalne wymagają Twojej zgody. Możesz zarządzać ustawieniami cookies w przeglądarce internetowej.`,
  },
  {
    h2: "8. Przekazywanie danych poza EOG",
    body: `Niektóre narzędzia, z których korzystamy (np. Google Firebase), mogą przekazywać dane do państw trzecich (w tym USA). Przekazanie odbywa się na podstawie standardowych klauzul umownych zatwierdzonych przez Komisję Europejską, co zapewnia odpowiedni poziom ochrony Twoich danych.`,
  },
  {
    h2: "9. Zmiany polityki prywatności",
    body: `Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej polityce prywatności. O wszelkich istotnych zmianach poinformujemy Cię poprzez stosowne powiadomienie na stronie lub drogą e-mail. Data ostatniej aktualizacji: czerwiec 2025 r.`,
  },
]

export default function PolitykaPrywatnosci() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Polityka prywatności</h1>
          <p className="mt-3 text-sm text-muted-foreground">Ostatnia aktualizacja: czerwiec 2025 r.</p>

          <div className="mt-10 flex flex-col gap-8">
            {SECTIONS.map(({ h2, body }) => (
              <section key={h2}>
                <h2 className="mb-3 text-xl font-semibold">{h2}</h2>
                <div className="flex flex-col gap-2">
                  {body.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
