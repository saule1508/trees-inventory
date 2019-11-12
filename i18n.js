const NextI18Next = require('next-i18next').default


module.exports = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['nl','fr'],
  defaultNS: 'common',
  localeSubpaths: {
    fr: 'fr',
    nl: 'nl',
    en: 'en',
  },
})