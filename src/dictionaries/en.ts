import type { Dictionary } from "@/lib/i18n"

export const en: Dictionary = {
  lang: "en",
  dateLocale: "en-GB",
  weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],

  nav: {
    offer: "Offer",
    salons: "Salons",
    howItWorks: "How It Works",
    faq: "FAQ",
    clientPortal: "Client Portal",
  },

  footer: {
    tagline: "Body shaping, cosmetology and wellness for women. Book a visit at the nearest salon.",
    ourSalons: "Our salons",
    forClients: "For clients",
    loginLink: "Client portal login",
    faqLink: "Frequently asked questions",
    privacyPolicy: "Privacy policy",
    copyright: "All rights reserved",
  },

  banner: {
    nearest: "Nearest to you:",
    locate: "Find the nearest salon",
    locating: "Searching for the nearest salon...",
  },

  finder: {
    placeholder: "Enter city, e.g. Kraśnik...",
    notFound: "We didn't find a salon in that location. The Studio Figura network is growing — check back soon.",
    call: "Call and book an appointment",
    viewOffer: "View our offer",
  },

  home: {
    badge: "Body shaping salons for women",
    h1Line1: "Your figure.",
    h1Line2: "Our technology.",
    description: "Cryolipolysis, HIFU 4D, laser hair removal and many other treatments — no surgery, no recovery time. The first consultation with body composition analysis is free.",
    ctaPrimary: "Book your first visit",
    ctaSecondary: "View our offer",
    stats: {
      salons: "salons in Poland",
      treatments: "treatments and devices",
      consultation: "first consultation",
    },
    sections: {
      salons: {
        h2: "Our salons",
        p: "Enter your city and find the nearest salon — the first consultation and body composition analysis are free.",
      },
      treatments: {
        h2: "Our treatments",
        p: "We work exclusively with certified Studio Figura devices — from fat reduction to facial care.",
      },
      steps: { h2: "How it works" },
      faq: { h2: "Frequently asked questions" },
      cta: {
        h2: "Ready for a change?",
        p: "Choose a salon and call — the first consultation with body composition analysis is free and we'll set up your client portal account on the spot.",
        btn: "Choose your salon",
      },
    },
    steps: [
      {
        title: "Call the salon",
        description: "Book your first appointment by phone. The reception will create your client portal account on the spot.",
      },
      {
        title: "Book online",
        description: "For subsequent visits, use the client portal — no calls needed, at any time.",
      },
      {
        title: "Earn points",
        description: "Earn loyalty points for treatments and daily logins, redeemable for discounts.",
      },
    ],
    faq: [
      {
        q: "Are body shaping treatments painful?",
        a: "No — the vast majority of our treatments (endermologie, cryolipolysis, radio waves, lipolaser) are painless and require no recovery. You can return to your daily activities immediately after the treatment.",
      },
      {
        q: "How many treatments does it take to see results?",
        a: "First results are often visible after a single treatment, but lasting results come from a series — usually 6–10 sessions a few days apart. At the first visit we'll create a plan tailored to your goals.",
      },
      {
        q: "How do I create a client portal account?",
        a: "Your account is created by the salon during your first visit — just call and book an appointment. With your account you can book further visits online, track treatment history and collect loyalty points.",
      },
      {
        q: "Is laser hair removal safe in summer?",
        a: "The Diamond laser works safely even on darker skin tones, but we don't treat freshly tanned skin. At the consultation we'll assess whether the treatment can be performed right away.",
      },
    ],
  },

  salonPage: {
    allSalons: "All salons",
    call: "Call and book an appointment",
    showOnMap: "Show on map",
    treatments: {
      h2: "What our offer includes",
      p: "We work with certified Studio Figura devices. Call us and we'll tailor treatments to your goals.",
    },
    cta: {
      h2: "Book a free consultation",
      p: "Call us — we'll talk about your goals and perform a free body composition analysis. Already a client? Log in to the portal.",
    },
    clientPortalBtn: "Client portal",
    salonPageBtn: "Salon page",
    cityIntro: (city, count) =>
      `In ${city} you'll find ${count} Studio Figura salons. Body shaping, cosmetology and wellness for women — choose the salon nearest to you and call to book a free consultation with body composition analysis.`,
  },

  login: {
    subtitle: "Log in to your account",
    email: "Email",
    password: "Password",
    submit: "Log in",
    errors: {
      invalidCredentials: "Invalid email or password.",
      tooManyRequests: "Too many attempts. Try again later.",
      generic: "An error occurred. Please try again.",
      noProfile: "No profile found. Please contact your administrator.",
      noPermission: "Access denied.",
    },
  },

  client: {
    nav: {
      home: "Home",
      bookings: "Bookings",
      promotions: "Promotions",
    },
    dropdown: {
      myProfile: "My profile",
      logout: "Log out",
    },
    streak: {
      awarded: (days) => `Well done! ${days} consecutive logins — you earn +1 loyalty point`,
      started: (target) => `Streak started! Log in every day — after ${target} consecutive days you'll earn a loyalty point`,
      progress: (streak, left) =>
        `Great, you've logged in ${streak} day${streak !== 1 ? "s" : ""} in a row! ${left === 1 ? "Just 1 more day to earn a loyalty point" : `${left} more days to earn a loyalty point`}`,
    },
    dashboard: {
      greeting: (name) => (name ? `Hi, ${name}!` : "Hi!"),
      subtitle: "Good to see you. Here's what we've prepared for you.",
      points: {
        label: "Your points",
        toReward: (n) => `${n} more pts to your reward — earn points with every visit.`,
      },
      nextVisit: {
        label: "Upcoming visit",
        noVisit: "No visits scheduled. Book your favourite treatment now.",
        book: "Book a visit",
        manage: "Manage bookings",
        more: "Upcoming visits",
        andMore: (n) => `+ ${n} more visit${n !== 1 ? "s" : ""}`,
      },
      promotions: {
        heading: "Promotions for you",
        all: "All",
        empty: "No active promotions at the moment.",
        validUntil: (date) => `Valid until ${date}`,
      },
      history: {
        heading: "Recent visits",
        bookAgain: "Book again",
      },
      subscription: {
        label: "Treatment package",
        badgeLow: "Running low",
        badgeEmpty: "Exhausted",
        warningLow: (n) => `Only ${n} ${n === 1 ? "treatment" : "treatments"} left — time to renew!`,
        warningEmpty: "Package exhausted — renew it to continue your treatments",
        used: (n, total) => `${n} of ${total} treatments used`,
        renewBtn: "Renew package",
        renewTitle: "Renew package",
        renewDesc: (name) => `Contact ${name} to purchase more treatments or choose a new package.`,
        call: "Call us",
        write: "Email us",
        noContact: "Studio contact details have not been configured yet.",
      },
    },
    portal: {
      inactive: {
        title: "Portal unavailable",
        description: "The client portal is temporarily disabled. Please contact the studio for more information.",
        logout: "Log out",
      },
    },
    bookings: {
      h1: "Book a visit",
      subtitle: "Choose a treatment, day and time — we'll take care of the rest.",
      step1: "Choose a treatment",
      step2: "Choose a day",
      step3: "Choose a time",
      noDay: "Please choose a day first.",
      noTreatment: "Please choose a treatment first — time availability depends on the schedule and devices.",
      noStaff: (t) => `No staff available for "${t}" on this day. Please choose a different day.`,
      yourBookings: "Your bookings",
      cancelTitle: "Cancel appointment?",
      cancelDescription: (t, date, time) => `${t} — ${date}, ${time}. This cannot be undone.`,
      cancelKeep: "Keep",
      cancelConfirm: "Cancel appointment",
      bookBtn: "Book",
      saving: "Booking...",
      chooseFirst: "Choose a treatment, day and time to book your visit.",
      chooseDay: "choose a day",
      chooseTime: "choose a time",
      bookingFailed: "Booking failed. Please try again.",
      cancelled: "Appointment cancelled",
      disabledTitle: "Online bookings unavailable",
      disabledText: "Please contact the studio to schedule a visit.",
    },
    promotions: {
      h1: "Promotions",
      subtitle: "Current special offers — use them before they expire.",
      empty: {
        heading: "No promotions currently",
        text: "Check back regularly — new offers appear often.",
      },
      bookVisit: "Book a visit",
      validUntil: (date) => `Valid until ${date}`,
    },
    profile: {
      h1: "My profile",
      personalData: "Personal information",
      firstName: "First name",
      lastName: "Last name",
      phone: "Phone",
      email: "Email",
      emailNote: "Email address cannot be changed.",
      saving: "Saving...",
      saveChanges: "Save changes",
      changePassword: "Change password",
      currentPassword: "Current password",
      newPassword: "New password",
      repeatNewPassword: "Repeat new password",
      changingPassword: "Changing...",
      changePasswordBtn: "Change password",
      saved: "Saved",
      saveFailed: "Failed to save",
      passwordChanged: "Password changed",
      passwordChangeFailed: "Failed to change password",
      passwordTooShort: "New password must be at least 6 characters",
      passwordMismatch: "Passwords do not match",
      wrongPassword: "Current password is incorrect",
    },
  },
}
