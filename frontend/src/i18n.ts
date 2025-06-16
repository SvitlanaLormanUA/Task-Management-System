import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import preferences_en from './locales/en/preferences.json';
import preferences_uk from './locales/uk/preferences.json';

const savedLang = localStorage.getItem('lang') || 'en';


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { preferences: preferences_en },
      uk: { preferences: preferences_uk },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
