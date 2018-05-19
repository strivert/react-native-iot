import React, { Component } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { Container, Spinner } from 'native-base'

import {withRouter} from 'react-router-native'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'

// import shallowCompare from 'react-addons-shallow-compare'
import odiff from 'odiff'

import ListItem from '../../components/home/ListItem'
import MapWrapper from '../../components/home/MapWrapper'
import {setEnableCharging, selectedDeviceId} from '../../actions/particleActions'

class HomeContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedDeviceId: null,
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.selectedDeviceId && (nextProps.devices && nextProps.devices.length > 0)) {
      this.setState({
        selectedDeviceId: nextProps.devices[0].id,
      })
      this.props.selectedDeviceId(nextProps.devices[0].id)
    }
  }

  /*
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  */
  shouldComponentUpdate (nextProps, nextState) {
    if (odiff.equal(this.props, nextProps) && odiff.equal(this.state, nextState)) {
      return false
    } else {
      return true
    }
  }

  selectDevice (deviceId) {
    this.setState({
      selectedDeviceId: deviceId,
    })
    this.props.selectedDeviceId(deviceId)
  }

  checkKeyExist (key, object) {
    return (key in object)
  }

  catchCharFromChargerStatus (str) {
    if (str === '') {
      return str
    } else {
      return str.charAt(0)
    }
  }

  toHHMMSS (str) {
    if (!parseInt(str, 10)) {
      return '00:00:00'
    }
    let secNum = parseInt(str, 10) // don't forget the second param
    let hours = Math.floor(secNum / 3600)
    let minutes = Math.floor((secNum - (hours * 3600)) / 60)
    let seconds = secNum - (hours * 3600) - (minutes * 60)

    if (hours < 10) { hours = '0' + hours }
    if (minutes < 10) { minutes = '0' + minutes }
    if (seconds < 10) { seconds = '0' + seconds }
    return hours + ':' + minutes + ':' + seconds
  }

  render () {
    const { selectedDeviceId } = this.state

    if (!selectedDeviceId || !this.props.token) {
      return (
        <Container style={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
          <Spinner />
        </Container>
      )
    }

    // console.log('this.props.devicesHash', this.props.devicesHash)
    // console.log('this.props.devices', this.props.devices)
    // alert(this.props.devicesHash.length)

    const selectedDevice = this.props.devicesHash[selectedDeviceId]
    // console.log('selectedDevice', selectedDevice)
    let initProtoStates = {
      'status': {
        't1Text': 'Status',
        't2Text': 'Offline',
        'iconName': 'status5-disable',
        'iconSty': 'disableColor',
        't2Sty': 'disableColor',
        'hasSwitch': false,
      },
      'security': {
        't1Text': 'Security',
        't2Text': 'Unlocked',
        'iconName': 'security1-disable',
        'iconSty': 'disableColor',
        't2Sty': 'disableColor',
        'hasSwitch': true,
      },
      'charge': {
        't1Text': 'Last Charge',
        't2Text': '00:00:00',
        'iconName': 'charge-disable',
        'iconSty': 'disableColor',
        't2Sty': 'disableColor',
        'hasSwitch': false,
      },
      'mainternance': {
        't1Text': 'Mainternance',
        't2Text': 'No Action',
        'iconName': 'maintenance1-disable',
        'iconSty': 'disableColor',
        't2Sty': 'disableColor',
        'hasSwitch': false,
      },
    }

    let initStates = Object.assign({}, initProtoStates)

    const evccoffline = this.checkKeyExist('evccoffline', selectedDevice['variables']) ? selectedDevice['variables']['evccoffline'] : undefined
    const online = this.checkKeyExist('online', selectedDevice['variables']) ? selectedDevice['variables']['online'] : undefined
    if (evccoffline === true) {
      initStates['status']['t2Sty'] = 'grayColor'
      initStates['status']['iconSty'] = 'grayColor'
      initStates['security']['t2Sty'] = 'grayColor'
      initStates['security']['iconSty'] = 'grayColor'
      initStates['charge']['t2Sty'] = 'grayColor'
      initStates['charge']['iconSty'] = 'grayColor'
      initStates['mainternance']['t2Sty'] = 'grayColor'
      initStates['mainternance']['iconSty'] = 'grayColor'

      initStates['status']['iconName'] = 'status5'
      initStates['security']['iconName'] = 'security1'
      initStates['charge']['iconName'] = 'charge1'
      initStates['mainternance']['iconName'] = 'maintenance1'
    }

    if (evccoffline === false) {
      initStates['mainternance']['t2Sty'] = 'grayColor'
      initStates['mainternance']['iconSty'] = 'grayColor'

      initStates['mainternance']['iconName'] = 'maintenance1'

      const enablecharger = this.checkKeyExist('enablecharger', selectedDevice['variables']) ? selectedDevice['variables']['enablecharger'] : false
      if (enablecharger) {
        initStates['security']['t2Text'] = 'Unlocked'
        initStates['security']['t2Sty'] = 'grayColor'
        initStates['security']['iconName'] = 'security1'
        initStates['security']['iconSty'] = 'grayColor'
      } else {
        initStates['security']['t2Text'] = 'Locked'
        initStates['security']['t2Sty'] = 'blueColor'
        initStates['security']['iconName'] = 'security4'
        initStates['security']['iconSty'] = 'blueColor'
      }

      const chargerstatus = this.checkKeyExist('chargerstatus', selectedDevice['variables']) ? selectedDevice['variables']['chargerstatus'] : ''
      const lastchargingtime = this.checkKeyExist('lastchargingtime', selectedDevice['variables']) ? selectedDevice['variables']['lastchargingtime'] : ''
      switch (this.catchCharFromChargerStatus(chargerstatus)) {
        case '':
          initStates['status']['t2Text'] = 'Offline'
          initStates['status']['t2Sty'] = 'grayColor'
          initStates['status']['iconName'] = 'status5'
          initStates['status']['iconSty'] = 'grayColor'
          break
        case 'A':
          initStates['status']['t2Text'] = 'Ready'
          initStates['status']['t2Sty'] = 'blueColor'
          initStates['status']['iconName'] = 'status3'
          initStates['status']['iconSty'] = 'blueColor'
          break
        case 'B':
          initStates['status']['t2Text'] = 'Connected'
          initStates['status']['t2Sty'] = 'orangeColor'
          initStates['status']['iconName'] = 'status1'
          initStates['status']['iconSty'] = 'orangeColor'
          break
        case 'C':
        case 'D':
          initStates['status']['t2Text'] = 'Charging'
          initStates['status']['t2Sty'] = 'greenColor'
          initStates['status']['iconName'] = 'status4'
          initStates['status']['iconSty'] = 'greenColor'
          break
      }
      switch (this.catchCharFromChargerStatus(chargerstatus)) {
        case '':
        case 'A':
        case 'B':
          initStates['charge']['t1Text'] = 'Last Charge'
          initStates['charge']['t2Text'] = this.toHHMMSS(lastchargingtime) // to be
          initStates['charge']['t2Sty'] = 'grayColor'
          initStates['charge']['iconSty'] = 'grayColor'

          initStates['charge']['iconName'] = 'charge1'
          break
        case 'C':
        case 'D':
          initStates['charge']['t1Text'] = 'Charger Time'
          initStates['charge']['t2Text'] = this.toHHMMSS(lastchargingtime) // to be
          initStates['charge']['t2Sty'] = 'greenColor'
          initStates['charge']['iconSty'] = 'grayColor'

          initStates['charge']['iconName'] = 'charge1'
          break
      }

      if (!enablecharger) {
        initStates['status']['iconSty'] = 'disableColor'
        initStates['status']['t2Sty'] = 'disableColor'

        initStates['status']['iconName'] = 'status5-disable'
      }
    }

    const deviceArr = this.props.devices.map((item, i) => {
      if (i === 1) {
        // alert(this.checkKeyExist('location', item.variables) ? parseFloat(parseFloat(item.variables.location.latitude).toFixed(10)) : 0);
      }
      return {
        deviceId: item.id,
        deviceName: item.name,
        serialNumber: ('variables' in item) ? item.variables.serialNumber : '',
        location: {
          latitude: this.checkKeyExist('location', item.variables) ? parseFloat(parseFloat(item.variables.location.latitude).toFixed(10)) : 0,
          longitude: this.checkKeyExist('location', item.variables) ? parseFloat(parseFloat(item.variables.location.longitude).toFixed(10)) : 0,
          // latitudeDelta: this.checkKeyExist('location', item.variables) ? parseFloat(item.variables.location.latitudeDelta) : 0,
          // longitudeDelta: this.checkKeyExist('location', item.variables) ? parseFloat(item.variables.location.longitudeDelta) : 0,
          latitudeDelta: 0.6,
          longitudeDelta: 0.6,
        },
      }
    })

    let resultStates = {}

    if (this.props.internetConnection === false || online === false) {
      resultStates = {
        'status': {
          't1Text': 'Status',
          't2Text': 'Offline',
          'iconName': 'status5-disable',
          'iconSty': 'disableColor',
          't2Sty': 'disableColor',
          'hasSwitch': false,
        },
        'security': {
          't1Text': 'Security',
          't2Text': 'Unlocked',
          'iconName': 'security1-disable',
          'iconSty': 'disableColor',
          't2Sty': 'disableColor',
          'hasSwitch': true,
        },
        'charge': {
          't1Text': 'Last Charge',
          't2Text': '00:00:00',
          'iconName': 'charge-disable',
          'iconSty': 'disableColor',
          't2Sty': 'disableColor',
          'hasSwitch': false,
        },
        'mainternance': {
          't1Text': 'Mainternance',
          't2Text': 'No Action',
          'iconName': 'maintenance1-disable',
          'iconSty': 'disableColor',
          't2Sty': 'disableColor',
          'hasSwitch': false,
        },
      }
    } else {
      resultStates = Object.assign({}, initStates)
    }

    return (
      <Container style={styles.homeWrapper}>
        <View style={{height: 207}}>
          {
            (this.props.deviceCount !== null && deviceArr.length === this.props.deviceCount) ? (
              <MapWrapper
                selectDevice={(deviceId) => this.selectDevice(deviceId)}
                mapData={deviceArr}
              />) : (
              <Container style={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                <Spinner />
              </Container>
            )
          }
        </View>
        <View style={{flex: 1, position: 'absolute', left: '50%', marginLeft: -65, top: 10}}>
          <Image
            style={{flex: 1, height: 40, width: 130}}
            source={require('../../assets/images/logo.png')}
            resizeMode="contain"
          />
        </View>

        <View style={{flex: 1, paddingLeft: 10, paddingRight: 10}}>
          {
            ['status', 'security', 'charge', 'mainternance'].map((key, i) => {
              return (
                <ListItem
                  key={`listitem-${i}`}
                  iconName={resultStates[key]['iconName']}
                  hasSwitch={resultStates[key]['hasSwitch']}
                  iconSty={resultStates[key]['iconSty']}
                  t2Sty={resultStates[key]['t2Sty']}
                  t1Text={resultStates[key]['t1Text']}
                  t2Text={resultStates[key]['t2Text']}
                  isLast={ i === 3 }
                  setEnableCharging={this.props.setEnableCharging}
                  deviceId={this.state.selectedDeviceId}
                  isEnableSwitch={resultStates['status']['t2Text'] === 'Ready' || resultStates['status']['t2Text'] === 'Connected'}
                />)
            })
          }
        </View>

      </Container>
    )
  }
}

// ios-unlock-outline
let styles = StyleSheet.create({
  homeWrapper: {
    backgroundColor: '#FFFFFF',
  },
})

HomeContainer.propTypes = {
  devicesHash: PropTypes.object,
  devices: PropTypes.array,
  setEnableCharging: PropTypes.func,
  selectedDeviceId: PropTypes.func,
  token: PropTypes.string,
  internetConnection: PropTypes.any,
  deviceCount: PropTypes.any,
}

export default withRouter(connect(
  state => ({
    devicesHash: state.particle.devicesHash,
    devices: state.particle.devices,
    deviceCount: state.particle.deviceCount,
    token: state.auth.token,
    internetConnection: state.misc.internetConnection,
  }),
  dispatch => bindActionCreators({setEnableCharging, selectedDeviceId}, dispatch)
)(HomeContainer))
