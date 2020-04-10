import React from 'react'
import App from 'next/app'
import Router from 'next/router'
import NProgress from 'nprogress' 
import { appWithTranslation } from '../i18n'

// NProgress.configure({ showSpinner: true });

Router.events.on('routeChangeStart', url => {
  console.log(`Loading: ${url}`)
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Component {...pageProps} />
    )
  }
}

export default appWithTranslation(MyApp)