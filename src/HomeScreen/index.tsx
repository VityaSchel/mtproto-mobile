import { View } from 'react-native'
import MethodInput from '../components/MethodInput'
import RootParams from '../components/MethodParams/RootParams'
import styles from '../globalStyles'

export default function HomeScreen() {
  return (
    <View style={styles.view}>
      <MethodInput />
      <RootParams />
    </View>
  )
}

