import { View } from 'react-native'
import SwitchSession from '../components/TopButtonsRow'
import MethodInput from '../components/MethodInput'
import RootParams from '../components/MethodParams/RootParams'
import SendRequest from '../components/BottomButtonsRow'
import ConsoleLogger from '../components/ConsoleLogger'
import styles from '../globalStyles'

export default function HomeScreen() {
  return (
    <View style={styles.view}>
      <SwitchSession />
      <MethodInput />
      <RootParams />
      <SendRequest />
      <ConsoleLogger />
    </View>
  )
}

