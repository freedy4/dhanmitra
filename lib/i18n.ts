export type Locale = "en" | "hi"

type Dict = Record<string, string>

const en: Dict = {
  // Navigation
  "nav.home": "Home",
  "nav.banking": "Banking",
  "nav.trading": "Trading",
  "nav.learn": "Learning Hub",
  "nav.funLearn": "Fun Learn",
  "nav.calculator": "Calculator",
  "nav.settings": "Settings",
  "nav.liveData": "Live Market Data",
  // Auth/UI
  "auth.login": "Log In",
  "auth.signup": "Sign Up",
  "auth.logout": "Sign Out",
  // Settings
  "settings.title": "Settings",
  "settings.profile.title": "Profile Settings",
  "settings.profile.photo": "Profile photo",
  "settings.profile.username": "Username",
  "settings.profile.placeholder": "Enter your username",
  "settings.profile.save": "Save changes",
  "settings.profile.saving": "Saving...",
  "settings.profile.instantSaved": "Profile updated instantly",
  "settings.profile.signinNeeded": "Please sign in to update your profile.",
  "settings.language": "Language",
  "settings.language.helper": "Choose your preferred language",
  "settings.language.english": "English",
  "settings.language.hindi": "Hindi",
}

const hi: Dict = {
  // Navigation
  "nav.home": "मुख्य पृष्ठ",
  "nav.banking": "बैंकिंग",
  "nav.trading": "ट्रेडिंग",
  "nav.learn": "लर्निंग हब",
  "nav.funLearn": "मज़ेदार सीख",
  "nav.calculator": "कैलकुलेटर",
  "nav.settings": "सेटिंग्स",
  "nav.liveData": "लाइव मार्केट डेटा",
  // Auth/UI
  "auth.login": "लॉग इन",
  "auth.signup": "साइन अप",
  "auth.logout": "साइन आउट",
  // Settings
  "settings.title": "सेटिंग्स",
  "settings.profile.title": "प्रोफ़ाइल सेटिंग्स",
  "settings.profile.photo": "प्रोफ़ाइल फोटो",
  "settings.profile.username": "उपयोगकर्ता नाम",
  "settings.profile.placeholder": "अपना उपयोगकर्ता नाम दर्ज करें",
  "settings.profile.save": "परिवर्तन सहेजें",
  "settings.profile.saving": "सहेजा जा रहा है...",
  "settings.profile.instantSaved": "प्रोफ़ाइल तुरंत अपडेट हो गई",
  "settings.profile.signinNeeded": "कृपया अपनी प्रोफ़ाइल अपडेट करने के लिए साइन इन करें।",
  "settings.language": "भाषा",
  "settings.language.helper": "अपनी पसंदीदा भाषा चुनें",
  "settings.language.english": "अंग्रेजी",
  "settings.language.hindi": "हिंदी",
}

export function getDictionary(locale: Locale): Dict {
  return locale === "hi" ? hi : en
}

export function translate(locale: Locale, key: string, fallback?: string) {
  const dict = getDictionary(locale)
  return dict[key] ?? fallback ?? key
}
