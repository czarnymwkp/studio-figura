import type { Dictionary } from "@/lib/i18n"

export const pl: Dictionary = {
  lang: "pl",
  dateLocale: "pl-PL",
  weekdays: ["pn", "wt", "śr", "cz", "pt", "so", "nd"],

  nav: {
    offer: "Oferta",
    salons: "Salony",
    howItWorks: "Jak to działa",
    faq: "FAQ",
    clientPortal: "Panel klienta",
  },

  footer: {
    tagline: "Modelowanie sylwetki, kosmetologia i wellness dla kobiet. Umów wizytę w salonie najbliżej Ciebie.",
    ourSalons: "Nasze salony",
    forClients: "Dla klientek",
    loginLink: "Logowanie do panelu klienta",
    faqLink: "Najczęstsze pytania",
    copyright: "Wszystkie prawa zastrzeżone",
  },

  banner: {
    nearest: "Najbliżej Ciebie:",
    locate: "Znajdź salon najbliżej Ciebie",
    locating: "Szukam najbliższego salonu...",
  },

  finder: {
    placeholder: "Wpisz miasto, np. Kraśnik...",
    notFound: "Nie znaleźliśmy salonu w tej miejscowości. Sieć Studio Figura cały czas rośnie — sprawdź ponownie wkrótce.",
    call: "Zadzwoń i umów wizytę",
    viewOffer: "Sprawdź, co mamy w ofercie",
  },

  home: {
    badge: "Salony modelowania sylwetki dla kobiet",
    h1Line1: "Twoja figura.",
    h1Line2: "Nasza technologia.",
    description: "Kriolipoliza, HIFU 4D, depilacja laserowa i kilkanaście innych zabiegów — bez skalpela i bez rekonwalescencji. Pierwsza konsultacja z analizą składu ciała jest bezpłatna.",
    ctaPrimary: "Umów pierwszą wizytę",
    ctaSecondary: "Zobacz ofertę",
    stats: {
      salons: "salonów w Polsce",
      treatments: "zabiegów i urządzeń",
      consultation: "pierwsza konsultacja",
    },
    sections: {
      salons: {
        h2: "Nasze salony",
        p: "Wpisz swoją miejscowość i znajdź salon najbliżej Ciebie — pierwsza rozmowa i analiza składu ciała są bezpłatne.",
      },
      treatments: {
        h2: "Nasze zabiegi",
        p: "Pracujemy wyłącznie na certyfikowanych urządzeniach Studio Figura — od redukcji tkanki tłuszczowej po pielęgnację twarzy.",
      },
      steps: { h2: "Jak to działa" },
      faq: { h2: "Najczęstsze pytania" },
      cta: {
        h2: "Gotowa na zmianę?",
        p: "Wybierz salon i zadzwoń — pierwsza konsultacja z analizą składu ciała jest bezpłatna, a konto w panelu klienta założymy Ci na miejscu.",
        btn: "Wybierz swój salon",
      },
    },
    steps: [
      {
        title: "Zadzwoń do salonu",
        description: "Umów pierwszą wizytę telefonicznie. Na miejscu recepcja założy Ci konto w panelu klienta.",
      },
      {
        title: "Rezerwuj online",
        description: "Kolejne wizyty rezerwujesz już w panelu klienta — bez dzwonienia, o każdej porze.",
      },
      {
        title: "Zbieraj punkty",
        description: "Za zabiegi i codzienne logowania zbierasz punkty lojalnościowe, które wymieniasz na rabaty.",
      },
    ],
    faq: [
      {
        q: "Czy zabiegi modelowania sylwetki są bolesne?",
        a: "Nie — zdecydowana większość naszych zabiegów (endomasaż, kriolipoliza, fale radiowe, lipolaser) jest bezbolesna i nie wymaga rekonwalescencji. Po zabiegu od razu wracasz do codziennych aktywności.",
      },
      {
        q: "Ile zabiegów potrzeba, żeby zobaczyć efekty?",
        a: "Pierwsze efekty często widać już po jednym zabiegu, ale trwałe rezultaty daje seria — zwykle 6–10 spotkań w odstępach kilku dni. Na pierwszej wizycie dobierzemy plan do Twoich celów.",
      },
      {
        q: "Jak założyć konto w panelu klienta?",
        a: "Konto zakłada dla Ciebie salon podczas pierwszej wizyty — wystarczy, że zadzwonisz i umówisz termin. Z kontem rezerwujesz kolejne wizyty online, śledzisz historię zabiegów i zbierasz punkty lojalnościowe.",
      },
      {
        q: "Czy depilacja laserowa jest bezpieczna latem?",
        a: "Laser Diamond pracuje bezpiecznie także przy ciemniejszej karnacji, jednak skóry świeżo opalonej nie depilujemy. Na konsultacji ocenimy, czy zabieg można wykonać od razu.",
      },
    ],
  },

  salonPage: {
    allSalons: "Wszystkie salony",
    call: "Zadzwoń i umów wizytę",
    showOnMap: "Pokaż na mapie",
    treatments: {
      h2: "Co znajdziesz w naszej ofercie",
      p: "Pracujemy na certyfikowanych urządzeniach Studio Figura. Zadzwoń, a dobierzemy zabiegi do Twoich celów.",
    },
    cta: {
      h2: "Umów się na bezpłatną konsultację",
      p: "Zadzwoń do nas — porozmawiamy o Twoich celach i wykonamy bezpłatną analizę składu ciała. Jesteś już naszą klientką? Zaloguj się do panelu.",
    },
    clientPortalBtn: "Panel klienta",
    salonPageBtn: "Strona salonu",
    cityIntro: (city, count) =>
      `W ${city === "Kraśnik" ? "Kraśniku" : city} znajdziesz ${count} salony Studio Figura. Modelowanie sylwetki, kosmetologia i wellness dla kobiet — wybierz salon bliżej Ciebie i zadzwoń, aby umówić bezpłatną konsultację z analizą składu ciała.`,
  },

  login: {
    subtitle: "Zaloguj się do swojego konta",
    email: "Email",
    password: "Hasło",
    submit: "Zaloguj",
    errors: {
      invalidCredentials: "Nieprawidłowy email lub hasło.",
      tooManyRequests: "Zbyt wiele prób. Spróbuj później.",
      generic: "Wystąpił błąd. Spróbuj ponownie.",
      noProfile: "Brak profilu. Skontaktuj się z administratorem.",
      noPermission: "Brak uprawnień.",
    },
  },

  client: {
    nav: {
      home: "Start",
      bookings: "Rezerwacje",
      promotions: "Promocje",
    },
    dropdown: {
      myProfile: "Mój profil",
      logout: "Wyloguj",
    },
    streak: {
      awarded: (days) => `Brawo! ${days} dni logowania z rzędu — zdobywasz +1 punkt lojalnościowy`,
      started: (target) => `Seria logowań rozpoczęta! Loguj się codziennie — po ${target} dniach z rzędu zdobędziesz punkt lojalnościowy`,
      progress: (streak, left) =>
        `Brawo, logujesz się już ${streak}. dzień z rzędu! ${left === 1 ? "Jeszcze tylko 1 dzień do punktu lojalnościowego" : `Jeszcze ${left} dni do punktu lojalnościowego`}`,
    },
    dashboard: {
      greeting: (name) => (name ? `Cześć, ${name}!` : "Cześć!"),
      subtitle: "Miło Cię widzieć. Zobacz, co dla Ciebie przygotowaliśmy.",
      points: {
        label: "Twoje punkty",
        toReward: (n) => `Jeszcze ${n} pkt do nagrody — punkty zbierasz za każdą wizytę.`,
      },
      nextVisit: {
        label: "Najbliższa wizyta",
        noVisit: "Nie masz zaplanowanych wizyt. Zarezerwuj swój ulubiony zabieg już teraz.",
        book: "Zarezerwuj wizytę",
        manage: "Zarządzaj wizytami",
        more: "Kolejne wizyty",
        andMore: (n) => `+ jeszcze ${n} ${n === 1 ? "wizyta" : "wizyty"}`,
      },
      promotions: {
        heading: "Promocje dla Ciebie",
        all: "Wszystkie",
        empty: "Aktualnie brak aktywnych promocji.",
        validUntil: (date) => `Ważna do ${date}`,
      },
      history: {
        heading: "Ostatnie wizyty",
        bookAgain: "Zarezerwuj ponownie",
      },
    },
    bookings: {
      h1: "Rezerwacja wizyty",
      subtitle: "Wybierz zabieg, dzień i godzinę — resztą zajmiemy się my.",
      step1: "Wybierz zabieg",
      step2: "Wybierz dzień",
      step3: "Wybierz godzinę",
      noDay: "Najpierw wybierz dzień.",
      noTreatment: "Najpierw wybierz zabieg — dostępność godzin zależy od grafiku i urządzeń.",
      noStaff: (t) => `W tym dniu nikt z personelu nie wykonuje zabiegu „${t}". Wybierz inny dzień.`,
      yourBookings: "Twoje rezerwacje",
      cancelTitle: "Odwołać wizytę?",
      cancelDescription: (t, date, time) => `${t} — ${date}, ${time}. Tej operacji nie można cofnąć.`,
      cancelKeep: "Zostaw",
      cancelConfirm: "Odwołaj wizytę",
      bookBtn: "Zarezerwuj",
      saving: "Rezerwuję...",
      chooseFirst: "Wybierz zabieg, dzień i godzinę, aby zarezerwować wizytę.",
      chooseDay: "wybierz dzień",
      chooseTime: "wybierz godzinę",
      bookingFailed: "Nie udało się zarezerwować wizyty. Spróbuj ponownie.",
      cancelled: "Wizyta odwołana",
    },
    promotions: {
      h1: "Promocje",
      subtitle: "Aktualne oferty specjalne — skorzystaj, zanim wygasną.",
      empty: {
        heading: "Aktualnie brak promocji",
        text: "Zaglądaj tu regularnie — nowe oferty pojawiają się często.",
      },
      bookVisit: "Zarezerwuj wizytę",
      validUntil: (date) => `Ważna do ${date}`,
    },
    profile: {
      h1: "Mój profil",
      personalData: "Dane osobowe",
      firstName: "Imię",
      lastName: "Nazwisko",
      phone: "Telefon",
      email: "Email",
      emailNote: "Adres email nie może być zmieniony.",
      saving: "Zapisywanie...",
      saveChanges: "Zapisz zmiany",
      changePassword: "Zmiana hasła",
      currentPassword: "Obecne hasło",
      newPassword: "Nowe hasło",
      repeatNewPassword: "Powtórz nowe hasło",
      changingPassword: "Zmienianie...",
      changePasswordBtn: "Zmień hasło",
      saved: "Dane zapisane",
      saveFailed: "Nie udało się zapisać danych",
      passwordChanged: "Hasło zmienione",
      passwordChangeFailed: "Nie udało się zmienić hasła",
      passwordTooShort: "Nowe hasło musi mieć co najmniej 6 znaków",
      passwordMismatch: "Hasła nie są takie same",
      wrongPassword: "Obecne hasło jest nieprawidłowe",
    },
  },
}
