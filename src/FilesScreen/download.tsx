import React from 'react'
import styles from './styles'
import * as Permissions from 'expo-permissions'
import * as MediaLibrary from 'expo-media-library'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import { Button, Divider, Modal, Portal, Text, TextInput } from 'react-native-paper'
import { Buffer } from 'buffer'
import { uploadFile, downloadFile } from '../mtproto/files'
import { View, ToastAndroid, Image } from 'react-native'
import { format } from 'date-fns'
import { filesize as filesize_ } from 'filesize/dist/filesize.js'
import _ from 'lodash'
import { nanoid } from 'nanoid'
import { PermissionType } from 'expo-permissions'
import mime from 'mime'

export default function DownloadWidget() {
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [fileID, setFileID] = React.useState('')
  const [accessHash, setAccessHash] = React.useState('')
  const [fileReference, setFileReference] = React.useState('')
  const [imagePreviewVisible, setImagePreviewVisible] = React.useState(false)
  const [filePreviewVisible, setFilePreviewVisible] = React.useState(false)
  const [downloadedFileBuffer, setDownloadedFileBuffer] = React.useState<Buffer | null>(null)
  const [downloadedImageBase64, setDownloadedImageBase64] = React.useState('')
  const [downloadedFileBase64, setDownloadedFileBase64] = React.useState('')
  const [downloadedFileMimeType, setDownloadedFileMimeType] = React.useState('')
  const [downloadedFileMimeTypeGuess, setDownloadedFileMimeTypeGuess] = React.useState('')
  const [filename, setFilename] = React.useState('')

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
    if(typeof(fileReferenceParsed)==='object' && isIterable(fileReferenceParsed))
      fileReferenceParsed = Object.entries(fileReferenceParsed).sort((a, b) => Number(a[0]) - Number(b[0])).map(([,val]) => Number(val))
    downloadFile(type, fileID, accessHash, fileReferenceParsed, 'm')
      .then(data => {
        const base64contents = data.toString('base64')
        setIsDownloading(false)
        if(type === 'photo') {
          setDownloadedImageBase64(base64contents)
          setImagePreviewVisible(true)
        } else if(type === 'document') {
          setDownloadedFileBase64(base64contents)
          setDownloadedFileBuffer(data)
          setFilePreviewVisible(true)
        }
      })
      .catch(e => {
        setIsDownloading(false)
        ToastAndroid.show(JSON.stringify(e), ToastAndroid.LONG)
        throw e
      })
  }

  const askPermission = async (permission: PermissionType) => {
    const { status } = await Permissions.askAsync(permission)
    return status === 'granted'
  }

  const savePreview = async () => {
    const path = `${FileSystem.cacheDirectory}/${nanoid(32)}.jpg`
    await FileSystem.writeAsStringAsync(path, downloadedImageBase64, { encoding: 'base64' })
    if(!await askPermission(Permissions.MEDIA_LIBRARY_WRITE_ONLY)) {
      return ToastAndroid.show('You must give this app a permission to access your media gallery in order to save the resulted image there, please do this via settings on your phone', ToastAndroid.LONG)
    }

    try {
      await MediaLibrary.saveToLibraryAsync(path)
      ToastAndroid.show('Saved to gallery!', ToastAndroid.LONG)
      setImagePreviewVisible(false)
    } catch(e) {
      console.error(e)
      ToastAndroid.show(JSON.stringify(e), ToastAndroid.LONG)
    }
  }

  const saveFileToFilesystem = async () => {
    const contentURI = await getFileContentURI()
    if(!contentURI) return
    IntentLauncher.startActivityAsync('android.intent.action.CREATE_DOCUMENT', {
      data: contentURI,
      type: downloadedFileMimeType || downloadedFileMimeTypeGuess,
      extra: {
        'com.android.documentsui.EXTRA_TITLE': filename
      },
      flags: 1
    })
  }

  const openWithoutSaving = async () => {
    const contentURI = await getFileContentURI()
    if(!contentURI) return
    IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: contentURI,
      flags: 1
    })
  }

  const getFileContentURI = async (): Promise<string | null> => {
    if(!await askPermission(Permissions.MEDIA_LIBRARY_WRITE_ONLY)) {
      ToastAndroid.show('You must give this app a permission to access your files in order to save the resulted file there, please do this via settings on your phone', ToastAndroid.LONG)
      return null
    }
    try {
      const fileURI = `${FileSystem.documentDirectory}${filename}`
      await FileSystem.writeAsStringAsync(fileURI, downloadedFileBase64, { encoding: 'base64' })
      const fileInfo = await FileSystem.getInfoAsync(fileURI)
      const contentURI = await FileSystem.getContentUriAsync(fileInfo.uri)
      return contentURI
      // Doesn't work well:
      // const asset = await MediaLibrary.createAssetAsync(fileURI)
      // await MediaLibrary.createAlbumAsync('Download', asset, false)
    } catch(e) {
      console.error(e)
      ToastAndroid.show(e?.message, ToastAndroid.LONG)
      return null
    }
  }

  React.useEffect(() => {
    console.log(filename, mime.getType(filename))
    setDownloadedFileMimeTypeGuess(mime.getType(filename) ?? '')
  }, [filename])

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
            visible={imagePreviewVisible}
            onDismiss={() => setImagePreviewVisible(false)}
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
              onPress={() => setImagePreviewVisible(false)}
            >Close</Button>
          </Modal>
        </Portal>
        <Portal>
          <Modal 
            visible={filePreviewVisible}
            onDismiss={() => setFilePreviewVisible(false)}
            contentContainerStyle={{ margin: 20, backgroundColor: '#222', padding: 20 }}
          >
            <Text style={styles.filesize}>Filesize: {downloadedFileBuffer && filesize_(downloadedFileBuffer?.length).toString()}</Text>
            <TextInput 
              value={filename}
              onChangeText={setFilename}
              label='Filename'
            />
            <Text style={styles.hint}>Make sure it ends with an extension!</Text>
            <TextInput 
              value={downloadedFileMimeType}
              onChangeText={setDownloadedFileMimeType}
              placeholder={downloadedFileMimeTypeGuess}
              label='Mime-type (only for saving)'
            />
            <Text style={styles.hint}>Android requires you to have a mime-type before you can save file. If you don&quot;t specify it, the app will try to guess it by extension.</Text>
            <Button
              mode='contained'
              onPress={openWithoutSaving}
              disabled={!filename}
            >Open without saving</Button>
            <Button 
              style={styles.previewImageButton}
              mode='contained'
              onPress={saveFileToFilesystem}
              disabled={!filename || (!downloadedFileMimeType && !downloadedFileMimeTypeGuess)}
            >Save to Downloads</Button>
            <Button 
              style={styles.previewImageButton}
              mode='outlined'
              onPress={() => setFilePreviewVisible(false)}
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