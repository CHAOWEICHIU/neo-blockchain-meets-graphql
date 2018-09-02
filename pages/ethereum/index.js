import React from 'react'
import withRedux from 'next-redux-wrapper'
import { compose, withState, withHandlers, renderComponent, branch } from 'recompose'
import { TextField, FlatButton } from 'material-ui'
import styled from 'styled-components'
import { FormattedMessage, FormattedNumber, defineMessages } from 'react-intl'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Link from 'next/link'
import withNeededProviders from '../../lib/withNeededProviders'
import withIntl from '../../lib/withIntl'
import initStore from '../../lib/store'
import Header from '../../components/Header.js';

const { description } = defineMessages({
  description: {
    id: 'description',
    defaultMessage: 'An example app integrating React Intl with Next.js'
  }
})

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
  withNeededProviders,
  // withRedux(initStore),
  withIntl,
)(props => (
  <Container>
    {console.log(props)}
    <Header />
    <StyledText>
      <FormattedMessage id='greeting' defaultMessage='Hello, World!' />
    </StyledText>
  </Container>
))
