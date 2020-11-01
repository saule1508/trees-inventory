const NextI18Next = require('next-i18next').default


module.exports = new NextI18Next({
  defaultLanguage: 'fr',
  otherLanguages: ['nl','en'],
  defaultNS: 'common',
  localeSubpaths: {
    fr: 'fr',
    nl: 'nl',
    en: 'en',
  },
  detection: {
    lookupCookie: 'next-i18next',
    order: ['cookie', 'querystring', 'localStorage', 'path', 'subdomain'],
    caches: ['cookie'],
  },
})