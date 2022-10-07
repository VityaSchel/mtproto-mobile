import { View } from 'react-native'
import MethodInput from '../components/MethodInput'
import MethodParams from '../components/MethodParams'
import styles from './styles'

export default function HomeScreen() {
  return (
    <View style={styles.view}>
      <MethodInput />
      <MethodParams />
    </View>
  )
}

