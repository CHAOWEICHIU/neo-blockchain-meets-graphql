import React from 'react'
import PropTypes from 'prop-types'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { ThemeProvider } from 'styled-components';
import { IntlProvider, addLocaleData } from 'react-intl'
import Head from 'next/head'
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles'
import colors from '../utils/colors';
import initApollo from './initApollo'

// Gets the display name of a JSX component for dev tools
function getComponentDisplayName(Component) {
  return Component.displayName || Component.name || 'Unknown'
}

/* Intl */
// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
  Object.keys(window.ReactIntlLocaleData).forEach((lang) => {
    addLocaleData(window.ReactIntlLocaleData[lang])
  })
}



export default ComposedComponent => {
  return class WithData extends React.Component {
    static displayName = `WithData(${getComponentDisplayName(ComposedComponent)})`
    static propTypes = {serverState: PropTypes.object.isRequired}

    static async getInitialProps(ctx) {
      // Initial serverState with apollo (empty)
      let serverState = {apollo: {}}

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps = {}
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(ctx)
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      if (!process.browser) {
        const apollo = initApollo()
        // Provide the `url` prop data in case a GraphQL query uses it
        const url = {query: ctx.query, pathname: ctx.pathname}
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <ApolloProvider client={apollo}>
              <ComposedComponent url={url} {...composedInitialProps} />
            </ApolloProvider>
          )
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
        }
        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind()

        // Extract query data from the Apollo store
        serverState = {
          apollo: {
            data: apollo.cache.extract()
          }
        }
      }

      // Get the `locale` and `messages` from the request object on the server.
      // In the browser, use the same values that the server serialized.
      const { req } = ctx
      const { locale, messages } = req || window.__NEXT_DATA__.props.pageProps

      return ctx.req
        ? {
          serverState,
          userAgent: ctx.req.headers['user-agent'],
          locale,
          messages,
          ...composedInitialProps,
          
        }
        : {
          serverState,
          userAgent: navigator.userAgent,
          locale,
          messages,
          ...composedInitialProps,
        }
    }

    constructor(props) {
      super(props)
      this.apollo = initApollo(this.props.serverState.apollo.data)
    }

    render() {
      const { locale, messages} = this.props
      return (
        <ApolloProvider client={this.apollo}>
          <MuiThemeProvider muiTheme={getMuiTheme({userAgent: this.props.userAgent})}>
            <ThemeProvider theme={colors}>
              <IntlProvider locale={locale} messages={messages}>
                <ComposedComponent {...this.props} apolloClient={this.apollo}/>
              </IntlProvider>
            </ThemeProvider>
          </MuiThemeProvider>
        </ApolloProvider>
      )
    }
  }
}
