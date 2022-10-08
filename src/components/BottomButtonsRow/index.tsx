import { View } from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { resetData } from '../../redux/slices/request'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import tlschema from '../../tl-schema.json'
import styles from './styles'
import { call, getDefaults, parseFields } from '../../mtproto/requests'

export default function BottomButtonsRow() {
  const request = useAppSelector(selector => selector.request)
  const method = tlschema.methods.find(m => m.method === request.method)
  const dispatch = useAppDispatch()

  const dispatchRequest = async () => {
    const methodName = request.method as string
    const defaults = getDefaults(methodName)
    const params = parseFields(defaults, request.params)
    await call(methodName, params)
  }

  return (
    <View style={{ ...styles.buttons, marginTop: method ? 10 : 'auto' }}>
      {method && (
        <View style={styles.buttonsRow}>
          <Button
            mode='contained'
            icon='send'
            style={styles.sendRequest}
            onPress={dispatchRequest}
          >
            Send
          </Button>
          <Button
            mode='contained-tonal'
            onPress={() => dispatch(resetData())}
          >
            <Icon name='backspace-outline' size={20} />
          </Button>
        </View>
      )}
      <Button mode='contained-tonal' onPress={() => global.api.openConsole()}>Console</Button>
    </View>
  )
}