import MTProto from '@mtproto/core/envs/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function initializeAPI() {
  const apiID = await AsyncStorage.getItem('app_api_id')
  const apiHash = await AsyncStorage.getItem('app_api_hash')

  const api = new MTProto({
    api_id: Number(apiID),
    api_hash: apiHash
  })

  api.close = () => {
    api.call = () => {
      throw new Error('MTProto has been closed.')
    }
    for (const rpc of Object.values(api.rpcs)) {
      rpc.transport.connect = () => {/**/}
      rpc.transport.socket.destroy()
    }
  }

  global.api = api
}