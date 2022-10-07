import { useNavigation } from '@react-navigation/native'
import { Button } from 'react-native-paper'

export default function SwitchSessionButton() {
  const navigation = useNavigation()

  const disconnectAndSwitchSession = () => {
    global.api.close()
    navigation.replace('Sessions')
  }

  return (
    <Button
      mode='contained-tonal'
      style={{ marginLeft: 'auto' }}
      onPress={disconnectAndSwitchSession}
    >
      Switch session
    </Button>
  )
}