import React from 'react'
import styles from './styles'
import * as Permissions from 'expo-permissions'
import * as MediaLibrary from 'expo-media-library'
import * as FileSystem from 'expo-file-system'
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper'
import { Buffer } from 'buffer'
import { uploadFile, downloadFile } from '../mtproto/files'
import { View, ToastAndroid, Image } from 'react-native'
import { format } from 'date-fns'
import { filesize as filesize_ } from 'filesize/dist/filesize.js'
import _ from 'lodash'
import { nanoid } from 'nanoid'


export default function DownloadWidget() {
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [fileID, setFileID] = React.useState('')
  const [accessHash, setAccessHash] = React.useState('')
  const [fileReference, setFileReference] = React.useState('')
  const [visible, setVisible] = React.useState(false)
  const [downloadedImageBuffer, setDownloadedImageBuffer] = React.useState<Buffer | null>(null)
  const [downloadedImageBase64, setDownloadedImageBase64] = React.useState('')

  const saveFileToFilesystem = async (fileURI: string) => {
    await MediaLibrary.saveToLibraryAsync(fileURI)
    // const asset = await MediaLibrary.createAssetAsync(fileURI)
    // const album = await MediaLibrary.getAlbumAsync('Download')
    // if (album === null) {
    //   await MediaLibrary.createAlbumAsync('Download', asset, false)
    // } else {
    //   await MediaLibrary.addAssetsToAlbumAsync([asset], 'Download', false)
    // }
    return true
  }

  const isJSONdeserializable = () => {
    try { 
      JSON.parse(String(fileReference))
    } catch(e) {
      return false
    }
    return true
  }

  const isIterable = (object: object): boolean => {
    const keys = Object.keys(object)
    const sortedKeys = keys.map(Number).sort((a, b) => a - b)
    let i = 0
    for(const key of sortedKeys) {
      console.log(key, i)
      if(key !== i) return false
      i++
    }
    return true
    // return _.isEqual(sortedKeys, new Array(sortedKeys.length).fill(null).map((_,i) => i))
  }

  const downloadFileInit = (type: 'photo' | 'document') => {
    setIsDownloading(true)
    let fileReferenceParsed = JSON.parse(fileReference)
    console.log(typeof(fileReferenceParsed), isIterable(fileReferenceParsed))
    if(typeof(fileReferenceParsed)==='object' && isIterable(fileReferenceParsed))
      fileReferenceParsed = Object.entries(fileReferenceParsed).sort((a, b) => Number(a[0]) - Number(b[0])).map(([,val]) => Number(val))
    downloadFile(type, fileID, accessHash, fileReferenceParsed, 'm')
      .then(data => {
        setIsDownloading(false)
        setVisible(true)
        setDownloadedImageBase64(data.toString('base64'))
      })
      .catch(e => {
        setIsDownloading(false)
        ToastAndroid.show(JSON.stringify(e), ToastAndroid.LONG)
        throw e
      })
  }

  const savePreview = async () => {
    const path = `${FileSystem.cacheDirectory}/${nanoid(32)}.jpg`
    await FileSystem.writeAsStringAsync(path, downloadedImageBase64, { encoding: 'base64' })

    const { status, permissions } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY_WRITE_ONLY)
    if (status === 'granted') {// && permissions.mediaLibrary.accessPrivileges !== 'limited') {
      try {
        await saveFileToFilesystem(path)
      } catch(e) {
        console.error(e)
        ToastAndroid.show(JSON.stringify(e), ToastAndroid.LONG)
      }
    } else {
      ToastAndroid.show('You must give this app a permission to access your media gallery in order to save the resulted image there, please do this via settings on your phone', ToastAndroid.LONG)
    }
  }

  const noValues = !fileID || !accessHash || !fileReference

  return (
    <>
      <Text variant='headlineSmall' style={{ marginTop: 20 }}>Downloading</Text>
      <View style={styles.container}>
        <TextInput
          disabled={isDownloading}
          value={fileID}
          onChangeText={setFileID}
          label='File ID'
          style={styles.input}
        />
        <TextInput
          disabled={isDownloading}
          value={accessHash}
          label='Access hash'
          onChangeText={setAccessHash}
          style={styles.input}
        />
        <TextInput
          disabled={isDownloading}
          value={fileReference}
          label='File reference'
          onChangeText={setFileReference}
          style={styles.input}
          error={fileReference.length > 0 && !isJSONdeserializable()}
        />
        <Button
          mode='contained'
          onPress={() => downloadFileInit('photo')}
          disabled={noValues || isDownloading}
          loading={isDownloading}
        >
          Download as PHOTO
        </Button>
        <Portal>
          <Modal 
            visible={visible}
            onDismiss={() => setVisible(false)}
            contentContainerStyle={{ margin: 20, backgroundColor: '#222', padding: 20 }}
          >
            <Image
              source={{ uri: 'data:image/jpeg;base64,' + downloadedImageBase64 }}
              style={styles.downloadedImage}
            />
            <Button 
              style={styles.previewImageButton}
              mode='contained'
              onPress={savePreview}
            >Save to gallery</Button>
            <Button 
              style={styles.previewImageButton}
              mode='outlined'
              onPress={() => setVisible(false)}
            >Close</Button>
          </Modal>
        </Portal>
        <Button
          mode='contained'
          onPress={() => downloadFileInit('document')}
          disabled={noValues || isDownloading}
          loading={isDownloading}
          style={{ marginTop: 10 }}
        >
          Download as DOCUMENT
        </Button>
      </View>
    </>
  )
}