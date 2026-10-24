import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json' with { type: 'json' }
import es from './es.json' with { type: 'json' }

export type Language = 'en' | 'es'
const i18n = createInstance()
await i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: 'en', fallbackLng: 'en', supportedLngs: ['en', 'es'],
  keySeparator: false, nsSeparator: false,
  interpolation: { escapeValue: false },
})

export const t = i18n.t.bind(i18n)
export function displayLocale() { return i18n.language === 'es' ? 'es' : 'en-GB' }
export function changeLanguage(language: Language) { return i18n.changeLanguage(language) }
export default i18n
