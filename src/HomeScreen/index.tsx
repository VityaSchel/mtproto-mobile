import { View } from 'react-native'
import MethodInput from '../components/MethodInput'
import RootParams from '../components/MethodParams/RootParams'
import SendRequest from '../components/SendRequest'
import styles from '../globalStyles'

export default function HomeScreen() {
  return (
    <View style={styles.view}>
      <MethodInput />
      <RootParams />
      <SendRequest />
    </View>
  )
}

