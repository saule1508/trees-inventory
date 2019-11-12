const NextI18Next = require('next-i18next').default
const { localeSubpaths } = require('next/config').default().publicRuntimeConfig

const localeSubpathVariations = {
  none: {},
  foreign: {
    en: 'en',
    nl: 'nl',
    fr: 'fr',
  },
  all: {
    fr: 'fr',
    en: 'en',
    nl: 'nl',
  },
}

module.exports = new NextI18Next({
  otherLanguages: ['en','nl','fr'],
  localeSubpaths: localeSubpathVariations[localeSubpaths],
})