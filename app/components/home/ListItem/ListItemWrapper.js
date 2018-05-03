import React, { Component } from 'react'
import { Text } from 'native-base'
import { StyleSheet, View, Image } from 'react-native'
import PropTypes from 'prop-types'
// import ToggleSwitch from 'toggle-switch-react-native'
// import * as Animatable from 'react-native-animatable'
import Swipeout from 'react-native-swipeout'

const LockCompoment = ({textValue}) => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text style={{fontSize: 25, color: 'white'}}>{textValue}</Text></View>
)

LockCompoment.propTypes = {
  textValue: PropTypes.string,
}

class ListItemWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      switchValue: false,
      switchValueExam: false,
      fontSize: 10,
    }

    this.statusIcons = {
      'charge1': require('../../../assets/images/status_icons/charge1.png'),
      'charge-disable': require('../../../assets/images/status_icons/charge-disable.png'),
      'maintenance1': require('../../../assets/images/status_icons/maintenance1.png'),
      'maintenance1-disable': require('../../../assets/images/status_icons/maintenance1-disable.png'),
      'security1': require('../../../assets/images/status_icons/security1.png'),
      'security1-disable': require('../../../assets/images/status_icons/security1-disable.png'),
      'security2': require('../../../assets/images/status_icons/security2.png'),
      'security3': require('../../../assets/images/status_icons/security3.png'),
      'status1': require('../../../assets/images/status_icons/status1.png'),
      'status2': require('../../../assets/images/status_icons/status2.png'),
      'status3': require('../../../assets/images/status_icons/status3.png'),
      'status4': require('../../../assets/images/status_icons/status4.png'),
      'status5': require('../../../assets/images/status_icons/status5.png'),
      'status5-disable': require('../../../assets/images/status_icons/status5-disable.png'),
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.hasSwitch) {
      if (nextProps.t2Text === 'Locked') {
        this.setState({
          switchValue: true,
        })
      }
      if (nextProps.t2Text === 'Unlocked') {
        this.setState({
          switchValue: false,
        })
      }
    }
  }

  render () {
    const {iconName, t1Text, t2Text, t2Sty, hasSwitch, isLast, switchSty, isEnableSwitch} = this.props
    // const {iconSty} = this.props

    // item wrapper style
    let itemWrapperStyles = [styles.itemWrapper]
    isLast && itemWrapperStyles.push(styles.noBorder)

    // left icon style
    let iconStyles = [styles.iconStyle]
    // iconSty && iconStyles.push(styles[iconSty])

    // body style
    let bodyStyles = [styles.bodyCtr]
    hasSwitch && bodyStyles.push(styles.flex_6)

    // first text style
    let t1Styles = [styles.t1]

    // second text style
    let t2Styles = [styles.t2]
    t2Sty && t2Styles.push(styles[t2Sty])

    // switch style
    let switchStyles = []
    switchSty && switchStyles.push(styles[switchSty])

    let swipeBtnOption = []
    const _this = this
    if (this.state.switchValue) {
      swipeBtnOption = [
        {
          text: 'Unlock',
          backgroundColor: '#6C3D90',
          onPress: () => {
            _this.setState({
              switchValue: false,
            })
            _this.props.setEnableCharging(_this.props.deviceId, false)
          },
          component: <LockCompoment textValue={'Unlock'} />,
        },
      ]
    } else {
      swipeBtnOption = [
        {
          text: 'Lock',
          backgroundColor: '#959595',
          onPress: () => {
            _this.setState({
              switchValue: true,
            })
            _this.props.setEnableCharging(_this.props.deviceId, true)
          },
          component: <LockCompoment textValue={'Lock'} />,
        },
      ]
    }
    return (
      (hasSwitch && isEnableSwitch) ? (
        <Swipeout
          backgroundColor={'white'}
          right={swipeBtnOption}
          style={{borderColor: '#959595', borderWidth: 0, borderBottomWidth: 0.5}}
          buttonWidth={120}
          autoClose={true}
        >
          <View style={{flexDirection: 'row', padding: 10, paddingLeft: 20, borderColor: '#959595', borderWidth: 0, borderTopWidth: 0}}>
            <View style={styles.leftCtr}>
              <Text style={t1Styles}></Text>
              <Image source={this.statusIcons[iconName]} style={iconStyles} />
            </View>
            <View style={bodyStyles}>
              <Text style={t1Styles}>{t1Text}</Text>
              <Text style={t2Styles}>{t2Text}</Text>
            </View>
          </View>
        </Swipeout>
      ) : (
        <View style={itemWrapperStyles}>
          <View style={styles.leftCtr}>
            <Text style={t1Styles}></Text>
            <Image source={this.statusIcons[iconName]} style={iconStyles} />
          </View>
          <View style={bodyStyles}>
            <Text style={t1Styles}>{t1Text}</Text>
            <Text style={t2Styles}>{t2Text}</Text>
          </View>

          {
            (hasSwitch && isEnableSwitch) &&
              <View style={styles.rightCtr}>
                {
                }
              </View>
          }
        </View>
      )
    )
  }
}

let styles = StyleSheet.create({
  itemWrapper: {
    flex: 1, flexDirection: 'row', borderColor: '#959595', borderWidth: 0, borderBottomWidth: 0.5, padding: 20, alignItems: 'center',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  iconStyle: {
    width: 40,
    height: 40,
    justifyContent: 'flex-end',
  },
  leftCtr: {
    flex: 0.2,
    flexDirection: 'column',
  },
  rightCtr: {
    flex: 0.3,
  },
  bodyCtr: {
    flexDirection: 'column', flex: 0.8,
  },
  flex_6: {
    flex: 0.5,
  },
  t1: {
    color: '#707070',
    fontSize: 17,
    lineHeight: 21,
    fontFamily: 'Proxima_nova_light',
  },
  t2: {
    color: '#707070',
    fontSize: 32,
    lineHeight: 39,
    fontFamily: 'Proxima_nova_light',
  },

  blueColor: {
    color: '#218FD8',
  },
  orangeColor: {
    color: '#F58533',
  },
  greenColor: {
    color: '#3FAF51',
  },
  purpleColor: {
    color: '#6C3D90',
  },
  redColor: {
    color: '#E33535',
  },
  yellowColor: {
    color: '#FFC400',
  },
  grayColor: {
    color: '#707070',
  },
  disableColor: {
    color: '#E8E3E3',
  },
})

ListItemWrapper.propTypes = {
  iconName: PropTypes.string,
  iconSty: PropTypes.string,
  t1Text: PropTypes.string,
  t2Text: PropTypes.string,
  t2Sty: PropTypes.string,
  hasSwitch: PropTypes.bool,
  isLast: PropTypes.bool,
  switchSty: PropTypes.string,
  setEnableCharging: PropTypes.func,
  deviceId: PropTypes.string,
  isEnableSwitch: PropTypes.bool,
}

export default ListItemWrapper
