import React from 'react'
import withRedux from 'next-redux-wrapper'
import { compose, withState, withHandlers, renderComponent, branch } from 'recompose'
import withApolloProvider from '../lib/withApolloProvider'
import initStore from '../lib/store'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { TextField, FlatButton } from 'material-ui'
import Link from 'next/link'

const Container = styled.div`
display:flex;
width:100vw;
height:100vh;
background:black;
align-items:center;
justify-content:center;
`

const StyledLink = styled.a`
color:white;
font-size: 50px;
text-decoration: none;
`

export default compose(
  withApolloProvider,
  withRedux(initStore),
)(props => (
  <Container>
    <StyledLink href="/graphql">
      Link To Graphql
    </StyledLink>
  </Container>
))
