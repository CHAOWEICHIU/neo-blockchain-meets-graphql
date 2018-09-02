// ./pages/_document.js
import Document, { Head, Main, NextScript } from 'next/document'
import styledNormalize from 'styled-normalize'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage, req: { locale, localeDataScript } }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return {
      ...page,
      styleTags,
      locale,
      localeDataScript,
    }
  }

  render() {
    // Polyfill Intl API for older browsers
    const polyfill = `https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.${this.props.locale}`

    return (
      <html>
      <Head>
        <title>NEON-JS</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge, chrome=1"/>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,shrink-to-fit=no"/>
        <style>{`
            ${styledNormalize}
            html, body{
              font-family:Helvetica Neue, Helvetica, Arial, PingFang TC, 微软雅黑, Microsoft YaHei, 华文细黑, STHeiti, sans-serif;
            }
          `}
        </style>
        {this.props.styleTags}
      </Head>
      <body>
        <Main/>
        <script
          dangerouslySetInnerHTML={{
            __html: this.props.localeDataScript,
          }}
        />
        <NextScript/>
      </body>
      </html>
    )
  }
}
