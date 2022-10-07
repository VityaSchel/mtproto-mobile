import { View } from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { resetData } from '../../redux/slices/request'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import tlschema from '../../tl-schema.json'
import styles from './styles'
import { call, parseFields } from '../../mtproto/requests'

export default function SendRequest() {
  const request = useAppSelector(selector => selector.request)
  const method = tlschema.methods.find(m => m.method === request.method)
  const dispatch = useAppDispatch()

  const dispatchRequest = async () => {
    const methodName = request.method
    const params = parseFields(methodName, request.params)
    console.log('params', params)
    // console.log(await call(methodName, params))
  }
  
  if(!method) return <></>

  return (
    <View style={styles.buttons}>
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
  )
}