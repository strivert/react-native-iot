import React, { Component } from 'react'
import { View, StyleSheet, Text, Linking } from 'react-native'

import {withRouter} from 'react-router-native'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'

import {fetchUser} from '../../actions/andersenActions'
import {logout} from '../../actions/azureActions'

import styles from '../../styles'

import PageHeader from '../../components/common/PageHeader'
import PageTop from '../../components/common/PageTop'
import Bar from '../../components/common/Bar'
import BlueBtn from '../../components/common/BlueBtn'
import Border from '../../components/common/Border'

import ResponsiveContainer from '../common/ResponsiveContainer'

class AccountContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {
    if (this.props.token) {
      this.props.fetchUser()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.token && this.props.token) {
      this.props.fetchUser()
    }
  }

  render () {
    const {email, user} = this.props
    return (
      <ResponsiveContainer style={pageStyles.accountWrapper}>
        <PageHeader />
        <PageTop
          iconName='account3'
          firstText='Andersen ID'
          secondText={user.firstName !== null ? `${user.firstName} ${user.lastName}` : ''}
        />
        <Bar
          barText='Your Account'
        />
        <Text style={[styles.txtColor2, pageStyles.paddingLeftRight36, pageStyles.emailText]}>
          {email}
        </Text>

        <Border style={pageStyles.marginLeftRight16} />

        <BlueBtn style={[pageStyles.signOutWrapper, pageStyles.paddingLeftRight36]} onClick={() => this.props.logout()}>
          <Text style={[styles.blueBtnTextColor, pageStyles.manageText]}>Manage your Andersen ID</Text>
          <Text style={[styles.txtColor2, pageStyles.changeText]}>Reset your password, delete account</Text>
        </BlueBtn>

        <Border style={pageStyles.marginLeftRight16} />

        <BlueBtn style={[pageStyles.paddingLeftRight36, pageStyles.signOutWrapper]} onClick={() => this.props.logout()}>
          <Text style={[styles.blueBtnTextColor, pageStyles.signOutText]}>Sign Out</Text>
        </BlueBtn>

        <Border style={pageStyles.marginLeftRight16} />

        <View style={{flex: 1, justifyContent: 'center'}}>

          <BlueBtn style={[pageStyles.paddingLeftRight36, {marginTop: 10, marginBottom: 10}]}
            onClick={() => { Linking.openURL('https://andersen-ev.com/terms-and-conditions/') }}
          >
            <Text style={[styles.blueBtnTextColor, pageStyles.termsText]}>Terms Of Service</Text>
          </BlueBtn>

          <BlueBtn style={[pageStyles.paddingLeftRight36, {marginTop: 10, marginBottom: 10}]}
            onClick={() => { Linking.openURL('https://andersen-ev.com/privacy-statement/') }}
          >
            <Text style={[styles.blueBtnTextColor, pageStyles.termsText]}>Privacy Statement</Text>
          </BlueBtn>

          <BlueBtn style={[pageStyles.paddingLeftRight36, {marginTop: 10, marginBottom: 10}]}
            onClick={() => { Linking.openURL('https://andersen-ev.com/privacy-policy/') }}
          >
            <Text style={[styles.blueBtnTextColor, pageStyles.termsText]}>Privacy Policy</Text>
          </BlueBtn>
        </View>

      </ResponsiveContainer>
    )
  }
}

let pageStyles = StyleSheet.create({
  accountWrapper: {
    backgroundColor: '#FFFFFF',
  },
  paddingLeftRight36: {
    paddingLeft: 36,
    paddingRight: 36,
  },
  marginLeftRight16: {
    marginLeft: 16,
    marginRight: 16,
  },
  width50: {
    width: '50%',
  },
  emailText: {
    marginTop: 17,
    marginBottom: 17,
    fontSize: 18,
  },
  manageWrapper: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  manageText: {
    fontSize: 18,
    lineHeight: 23,
  },
  changeText: {
    fontSize: 17,
    lineHeight: 21,
    marginTop: 6,
  },
  termsWrapper: {
    paddingTop: 31,
    paddingBottom: 31,
  },
  termsText: {
    fontSize: 18,
  },
  signOutWrapper: {
    paddingTop: 17,
    paddingBottom: 17,
  },
  signOutText: {
    fontSize: 18,
  },
})

AccountContainer.propTypes = {
  user: PropTypes.object,
  email: PropTypes.string,
  token: PropTypes.string,
  fetchUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  navigation: PropTypes.any,
}

export default withRouter(connect(
  state => ({
    user: state.user,
    token: state.auth.token,
    email: state.user.email,
  }),
  dispatch => bindActionCreators({fetchUser, logout}, dispatch)
)(AccountContainer))
