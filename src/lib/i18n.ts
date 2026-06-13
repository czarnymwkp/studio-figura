export type Locale = "pl" | "en" | "uk"

export const LOCALES: Locale[] = ["pl", "en", "uk"]
export const DEFAULT_LOCALE: Locale = "pl"

export type Dictionary = {
  lang: Locale
  dateLocale: string
  weekdays: [string, string, string, string, string, string, string]

  nav: {
    offer: string
    salons: string
    howItWorks: string
    faq: string
    clientPortal: string
  }

  footer: {
    tagline: string
    ourSalons: string
    forClients: string
    loginLink: string
    faqLink: string
    copyright: string
  }

  banner: {
    nearest: string
    locate: string
    locating: string
  }

  finder: {
    placeholder: string
    notFound: string
    call: string
    viewOffer: string
  }

  home: {
    badge: string
    h1Line1: string
    h1Line2: string
    description: string
    ctaPrimary: string
    ctaSecondary: string
    stats: { salons: string; treatments: string; consultation: string }
    sections: {
      salons: { h2: string; p: string }
      treatments: { h2: string; p: string }
      steps: { h2: string }
      faq: { h2: string }
      cta: { h2: string; p: string; btn: string }
    }
    steps: { title: string; description: string }[]
    faq: { q: string; a: string }[]
  }

  salonPage: {
    allSalons: string
    call: string
    showOnMap: string
    treatments: { h2: string; p: string }
    cta: { h2: string; p: string }
    clientPortalBtn: string
    salonPageBtn: string
    cityIntro: (city: string, count: number) => string
  }

  login: {
    subtitle: string
    email: string
    password: string
    submit: string
    errors: {
      invalidCredentials: string
      tooManyRequests: string
      generic: string
      noProfile: string
      noPermission: string
    }
  }

  client: {
    nav: { home: string; bookings: string; promotions: string }
    dropdown: { myProfile: string; logout: string }
    streak: {
      awarded: (days: number) => string
      started: (target: number) => string
      progress: (streak: number, left: number) => string
    }
    dashboard: {
      greeting: (name?: string) => string
      subtitle: string
      points: { label: string; toReward: (n: number) => string }
      nextVisit: {
        label: string
        noVisit: string
        book: string
        manage: string
        more: string
        andMore: (n: number) => string
      }
      promotions: {
        heading: string
        all: string
        empty: string
        validUntil: (date: string) => string
      }
      history: { heading: string; bookAgain: string }
    }
    bookings: {
      h1: string
      subtitle: string
      step1: string
      step2: string
      step3: string
      noDay: string
      noTreatment: string
      noStaff: (treatment: string) => string
      yourBookings: string
      cancelTitle: string
      cancelDescription: (treatment: string, date: string, time: string) => string
      cancelKeep: string
      cancelConfirm: string
      bookBtn: string
      saving: string
      chooseFirst: string
      chooseDay: string
      chooseTime: string
      bookingFailed: string
      cancelled: string
    }
    promotions: {
      h1: string
      subtitle: string
      empty: { heading: string; text: string }
      bookVisit: string
      validUntil: (date: string) => string
    }
    profile: {
      h1: string
      personalData: string
      firstName: string
      lastName: string
      phone: string
      email: string
      emailNote: string
      saving: string
      saveChanges: string
      changePassword: string
      currentPassword: string
      newPassword: string
      repeatNewPassword: string
      changingPassword: string
      changePasswordBtn: string
      saved: string
      saveFailed: string
      passwordChanged: string
      passwordChangeFailed: string
      passwordTooShort: string
      passwordMismatch: string
      wrongPassword: string
    }
  }
}

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  pl: () => import("@/dictionaries/pl").then((m) => m.pl),
  en: () => import("@/dictionaries/en").then((m) => m.en),
  uk: () => import("@/dictionaries/uk").then((m) => m.uk),
}

export function hasLocale(locale: string): locale is Locale {
  return locale in loaders
}

export async function getDictionary(locale: string): Promise<Dictionary> {
  return loaders[hasLocale(locale) ? locale : DEFAULT_LOCALE]()
}
