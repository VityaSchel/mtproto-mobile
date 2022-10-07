import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'
import ConstructorParamsEditor from './editor'
import styles from '../globalStyles'
import { View } from 'react-native'
import { Appbar, Text } from 'react-native-paper'

export default function EditorScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  if(!route.params) throw 'No params passed to EditorScreen'
  type EditorScreenParams = { constructorType: string, prefix: string, field: string }
  const params = route.params as EditorScreenParams

  return (
    <View style={styles.view}>
      <Appbar.Header style={{ width: '100%', backgroundColor: '#000' }} statusBarHeight={0}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={params.field + ': ' + params.constructorType} />
      </Appbar.Header>
      <ConstructorParamsEditor
        fieldIDPrefix={`${params.prefix}_constructor<${params.field}>`}
        constructorType={params.constructorType}
      />
    </View>
  )
}