import { View } from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { resetData } from '../../redux/slices/request'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import tlschema from '../../tl-schema.json'
import styles from './styles'

export default function SendRequest() {
  const request = useAppSelector(selector => selector.request)
  const method = tlschema.methods.find(m => m.method === request.method)
  const dispatch = useAppDispatch()
  
  if(!method) return <></>

  return (
    <View style={styles.buttons}>
      <Button
        mode='contained'
        icon='send'
        style={styles.sendRequest}
        onPress={() => console.log(request)}
      >
        Send
      </Button>
      <Button
        // icon=''
        mode='contained-tonal'
        // size={30}
        onPress={() => dispatch(resetData())}
        // compact
      >
        <Icon name='backspace-outline' size={20} />
      </Button>
    </View>
  )
}