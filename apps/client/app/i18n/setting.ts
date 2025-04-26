export const fallbackLng = 'en'
export const languages = [fallbackLng, 'ko']
export const cookieName = 'i18next'
export type LocaleTypes = (typeof languages)[number];
export const defaultNS = 'common';

export function getOptions (lng = fallbackLng, ns = defaultNS) {
    return {
      // debug: true,
      supportedLngs: languages,
      fallbackLng,
      lng,
      fallbackNS: defaultNS,
      defaultNS,
      ns
    }
  }