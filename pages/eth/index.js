import React from 'react'
import withRedux from 'next-redux-wrapper'
import { compose, withState, withHandlers, renderComponent, branch } from 'recompose'
import { TextField, FlatButton } from 'material-ui'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Link from 'next/link'
import withApolloProvider from '../../lib/withApolloProvider'
import initStore from '../../lib/store'

const Container = styled.div`
display:flex;
width:100vw;
height:100vh;
background: ${props => props.theme.BG_BLACK};
align-items:center;
justify-content:center;
`

const StyledText = styled.div`
  color: ${props => props.theme.TX_GOLD};
`;

export default compose(
  withApolloProvider,
  withRedux(initStore),
)(props => (
  <Container>
    <StyledText>
      ETH
    </StyledText>
  </Container>
))
