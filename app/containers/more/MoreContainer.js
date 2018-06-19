import React, { Component } from 'react'
import { StyleSheet, Text, View, Linking } from 'react-native'
import { Container } from 'native-base'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import styles from '../../styles'

import PageHeader from '../../components/common/PageHeader'
import PageTop from '../../components/common/PageTop'
import Bar from '../../components/common/Bar'
import BlueBtn from '../../components/common/BlueBtn'
import Border from '../../components/common/Border'
import Spinner from '../../components/common/Spinner'

import config from '../../config/config'

class MoreContainer extends Component {
  checkKeyExist = (key, object) => {
    return (key in object)
  }

  render () {
    const {devicesHash, selectedDeviceId} = this.props

    if (this.props.deviceCount === 0) {
      return (
        <Container style={pageStyles.moreWrapper}>
          <PageHeader />
          <PageTop
            iconName='setting3'
            firstText=''
            secondText='No Points'
          />
          <Bar
            barText='Add Charge Point'
          />

          <BlueBtn style={[pageStyles.paddingLeftRight42, pageStyles.AppWrapper]} onClick={() => { this.props.navigation.navigate('AddCharge') }}>
            <Text style={[styles.blueBtnTextColor, pageStyles.appText]}>Add Charge Point</Text>
          </BlueBtn>
        </Container>
      )
    }

    const selectedDevice = devicesHash[selectedDeviceId]

    if (!selectedDeviceId) {
      return (
        <Container style={[pageStyles.moreWrapper, {alignItems: 'center', justifyContent: 'center'}]}>
          <Spinner />
        </Container>
      )
    }

    if( !selectedDevice || !this.checkKeyExist('variables', selectedDevice) || !selectedDevice['variables']) {
      return (
        <Container style={[pageStyles.moreWrapper, {alignItems: 'center', justifyContent: 'center'}]}>
          <Spinner />
        </Container>
      )
    }

    let deviceCostUnit = parseFloat(config.COST_UNIT).toFixed(2)

    if (this.checkKeyExist('costunit', selectedDevice['variables'])) {
      deviceCostUnit = parseFloat(selectedDevice['variables']['costunit']).toFixed(2)
    }

    return (
      <Container style={pageStyles.moreWrapper}>
        <PageHeader />
        <PageTop
          iconName='setting3'
          firstText=''
          secondText='App Settings'
        />

        <Bar
          barText='Units'
        />

        <BlueBtn style={[pageStyles.currencyWrapper, pageStyles.paddingLeftRight49]} onClick={() => { this.props.navigation.navigate('UnitCost') }}>
          <View style={pageStyles.flexRowView}>
            <View style={{flex: 0.6}}>
              <Text style={[styles.txtColor2, pageStyles.currenctyText]}>Cost kWh</Text>
            </View>
            <View style={{flex: 0.2, alignItems: 'center'}}>
              <Text style={[styles.txtColor2, pageStyles.percentText]}>{deviceCostUnit}</Text>
            </View>
            <View style={{flex: 0.2, alignItems: 'flex-end'}}>
              <BlueBtn style={[]} onClick={() => { this.props.navigation.navigate('UnitCost') }}>
                <Text style={[styles.blueBtnTextColor, pageStyles.appText]}>Edit</Text>
              </BlueBtn>
            </View>
          </View>
        </BlueBtn>

        <Bar
          barText='App Support And Tutorial'
        />

        <BlueBtn style={[pageStyles.paddingLeftRight42, pageStyles.AppWrapper]} onClick={() => { Linking.openURL('https://andersen-ev.com/support/') }}>
          <Text style={[styles.blueBtnTextColor, pageStyles.appText]}>App Support</Text>
        </BlueBtn>

        <Border style={pageStyles.marginLeftRight16} />

        <BlueBtn style={[pageStyles.paddingLeftRight42, pageStyles.AppWrapper]} onClick={() => { Linking.openURL('https://andersen-ev.com/support/') }}>
          <Text style={[styles.blueBtnTextColor, pageStyles.appText]}>App Tutorial</Text>
        </BlueBtn>

        <Bar
          barText='About'
        />

        <View style={[pageStyles.paddingLeftRight42, pageStyles.AppWrapper]}>
          <View style={pageStyles.flexRowView}>
            <View style={{flex: 0.6}}>
              <Text style={[styles.txtColor2, pageStyles.appText]}>App Version</Text>
            </View>
            <View style={{flex: 0.4}}>
              <Text style={[styles.txtColor2, pageStyles.appText]}>4.3.4</Text>
            </View>
          </View>
        </View>

        <Border style={pageStyles.marginLeftRight16} />

      </Container>
    )
  }
}

let pageStyles = StyleSheet.create({
  moreWrapper: {
    backgroundColor: '#FFFFFF',
  },
  paddingLeftRight49: {
    paddingLeft: 36,
    paddingRight: 36,
  },
  paddingLeftRight42: {
    paddingLeft: 42,
    paddingRight: 42,
  },
  marginLeftRight16: {
    marginLeft: 16,
    marginRight: 16,
  },
  currencyWrapper: {
    paddingTop: 17,
    paddingBottom: 17,
  },
  flexRowView: {
    flexDirection: 'row',
  },
  currenctyText: {
    fontSize: 18,
  },
  percentText: {
    fontSize: 18,
  },
  nextText: {
    fontSize: 18,
  },
  AppWrapper: {
    paddingTop: 18,
    paddingBottom: 18,
  },
  appText: {
    fontSize: 18,
  },
})

MoreContainer.propTypes = {
  devicesHash: PropTypes.object,
  navigation: PropTypes.any,
  selectedDeviceId: PropTypes.any,
  deviceCount: PropTypes.any,
}

export default connect(
  state => ({
    devicesHash: state.particle.devicesHash,
    selectedDeviceId: state.particle.selectedDeviceId,
    deviceCount: state.particle.deviceCount,
  }),
  null
)(MoreContainer)
