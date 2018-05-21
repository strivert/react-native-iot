import React, {Component} from 'react'
import {Spinner, StyleProvider} from 'native-base'
import {Provider} from 'react-redux'
import {NativeRouter} from 'react-router-native'
import {AsyncStorage, View, Image} from 'react-native'
import {Font} from 'expo'
import getTheme from '../native-base-theme/components'
import material from '../native-base-theme/variables/material'
import {setDefaults} from './actions/storeActions'
import AppContainer from './containers/App'
import store from './store'

console.disableYellowBox = true

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fontLoaded: false,
    }
  }

  componentDidMount () {
    // AsyncStorage.clear()
    Promise.all([
      AsyncStorage.multiGet(['email', 'token', 'refreshToken']),
      Font.loadAsync({
        Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'),
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        Proxima_nova_altblack: require('./assets/fonts/Proxima-Nova-Alt-Black-webfont.ttf'),
        Proxima_nova_altbold: require('./assets/fonts/Proxima-Nova-Alt-Bold-webfont.ttf'),
        Proxima_nova: require('./assets/fonts/Proxima-Nova-Alt-Regular-webfont.ttf'),
        Proxima_nova_scosfthin: require('./assets/fonts/Proxima-Nova-ScOsf-Thin-webfont.ttf'),
        Proxima_nova_ltsemibold: require('./assets/fonts/Proxima-Nova-Semibold-webfont.ttf'),
        Proxima_nova_ltthin: require('./assets/fonts/Proxima-Nova-Thin-webfont.ttf'),
        Proxima_nova_light: require('./assets/fonts/Proxima-nova-light-webfont.ttf'),
        Arial: require('./assets/fonts/arial.ttf'),
      }),
    ])
      .then(data => {
        const storage = data[0].reduce((obj, [key, value]) => {
          obj[key] = value
          return obj
        }, {})

        const defaultState = {
          user: {
            email: storage.email,
          },
          auth: {
            token: storage.token,
            refreshToken: storage.refreshToken,
          },
        }

        store.dispatch(setDefaults(defaultState))
        this.setState({fontLoaded: true})
      })
  }

  render () {
    const {fontLoaded} = this.state

    return !fontLoaded || !store ? (
      <View style={{flex: 1}}>
        <Image
          source={require('./assets/images/splash.png')}
          style={{flex: 1, width: undefined, height: undefined}}
        >
        </Image>
        <Spinner style={{position: 'absolute', left: '50%', top: '50%', marginLeft: -10, marginTop: -10}} />
      </View>
    ) : (
      <StyleProvider style={getTheme(material)}>
        <Provider store={store}>
          <NativeRouter>
            <AppContainer />
          </NativeRouter>
        </Provider>
      </StyleProvider>
    )
  }
}
