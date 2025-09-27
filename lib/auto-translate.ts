type PhraseMap = Record<string, string>

// Keep this list focused but broad enough to cover common UI text seen across the app.
// You can extend this safely over time.
const PHRASES_EN_TO_HI: PhraseMap = {
  // Navigation and common actions
  Home: "मुख्य पृष्ठ",
  Banking: "बैंकिंग",
  Trading: "ट्रेडिंग",
  "Learning Hub": "लर्निंग हब",
  "Fun Learn": "मज़ेदार सीख",
  Calculator: "कैलकुलेटर",
  Settings: "सेटिंग्स",
  "Live Market Data": "लाइव मार्केट डेटा",
  "Log In": "लॉग इन",
  "Sign Up": "साइन अप",
  "Sign Out": "साइन आउट",

  // Generic UI
  Search: "खोजें",
  Save: "सहेजें",
  "Save changes": "परिवर्तन सहेजें",
  "Saving...": "सहेजा जा रहा है...",
  Submit: "सबमिट",
  Cancel: "रद्द करें",
  Close: "बंद करें",
  Back: "वापस",
  Next: "आगे",
  Previous: "पिछला",
  "Learn more": "और जानें",

  // Trading
  Buy: "खरीदें",
  Sell: "बेचें",
  Portfolio: "पोर्टफोलियो",
  Market: "बाज़ार",
  Price: "कीमत",
  Quantity: "मात्रा",
  Total: "कुल",
  Order: "आदेश",
  Confirm: "पुष्टि करें",

  // Settings/Profile
  "Profile Settings": "प्रोफ़ाइल सेटिंग्स",
  "Profile photo": "प्रोफ़ाइल फोटो",
  Username: "उपयोगकर्ता नाम",
  "Enter your username": "अपना उपयोगकर्ता नाम दर्ज करें",
  Language: "भाषा",
  "Choose your preferred language": "अपनी पसंदीदा भाषा चुनें",
  English: "अंग्रेजी",
  Hindi: "हिंदी",
  "Profile updated instantly": "प्रोफ़ाइल तुरंत अपडेट हो गई",
  "Please sign in to update your profile.": "कृपया अपनी प्रोफ़ाइल अपडेट करने के लिए साइन इन करें।",

  // Misc
  Loading: "लोड हो रहा है",
  "No data": "कोई डेटा नहीं",
}

// Attributes we also want to translate if present.
const TRANSLATABLE_ATTRS = ["placeholder", "title", "aria-label"]

function translateText(text: string): string | null {
  const trimmed = text.trim()
  if (!trimmed) return null
  // Exact phrase match
  if (PHRASES_EN_TO_HI[trimmed]) return PHRASES_EN_TO_HI[trimmed]
  // Title/Sentence case fallbacks
  const lower = trimmed.toLowerCase()
  for (const [en, hi] of Object.entries(PHRASES_EN_TO_HI)) {
    if (en.toLowerCase() === lower) return hi
  }
  return null
}

function walkAndTranslate(root: ParentNode, toHindi: boolean) {
  const elements = root.querySelectorAll<HTMLElement>(
    "h1,h2,h3,h4,h5,h6,p,span,button,a,li,label,th,td,div,small,strong,em,blockquote,summary,figcaption",
  )
  elements.forEach((el) => {
    // Translate attributes
    TRANSLATABLE_ATTRS.forEach((attr) => {
      const originalKey = `data-original-${attr}`
      if (toHindi) {
        const val = el.getAttribute(attr)
        if (val) {
          // Save original once
          if (!el.hasAttribute(originalKey)) el.setAttribute(originalKey, val)
          const t = translateText(val)
          if (t) el.setAttribute(attr, t)
        }
      } else {
        // Revert attribute if saved
        if (el.hasAttribute(originalKey)) {
          el.setAttribute(attr, el.getAttribute(originalKey) || "")
          el.removeAttribute(originalKey)
        }
      }
    })

    // Translate text content when the element is a simple text holder
    // Only when it contains a single text node or simple inline structure
    const childNodes = Array.from(el.childNodes)
    const hasOnlyText = childNodes.length === 1 && childNodes[0].nodeType === Node.TEXT_NODE

    if (hasOnlyText) {
      const originalKey = "data-original-text"
      if (toHindi) {
        const current = (el.textContent || "").trim()
        if (!current) return
        if (!el.hasAttribute(originalKey)) el.setAttribute(originalKey, current)
        const translated = translateText(current)
        if (translated) el.textContent = translated
      } else {
        if (el.hasAttribute(originalKey)) {
          el.textContent = el.getAttribute(originalKey) || ""
          el.removeAttribute(originalKey)
        }
      }
    }
  })
}

export function applyHindiTranslations() {
  try {
    walkAndTranslate(document, true)
  } catch {}
}

export function revertHindiTranslations() {
  try {
    walkAndTranslate(document, false)
  } catch {}
}
