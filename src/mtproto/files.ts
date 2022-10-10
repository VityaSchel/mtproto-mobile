import lodash from 'lodash'
import { Buffer } from 'buffer'

const debug = false

const partsSizes = [1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288]
export async function uploadFile(fileBuffer: Buffer) {
  const fileID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  
  const imageSize = Buffer.byteLength(fileBuffer)
  const maxPartSize = lodash.last(partsSizes) as number
  const minPartSize = partsSizes.find(size => imageSize <= size) as number
  const partContentMaxSize = imageSize >= maxPartSize ? maxPartSize : minPartSize
  const chunks = Math.ceil(imageSize / partContentMaxSize)
  for (let i = 0; i < chunks; i++) {
    const partSize = i === chunks - 1 ? imageSize % partContentMaxSize : partContentMaxSize
    const part = fileBuffer.subarray(i * partContentMaxSize, i * partContentMaxSize + partSize)
    await global.api.call('upload.saveFilePart', {
      file_id: fileID,
      file_part: i,
      bytes: part
    })
  }
  debug && console.log('Uploaded file', fileID)
  return { id: fileID, parts: chunks }
}

export async function downloadFile(type: 'photo' | 'document', id: string, accessHash: string, fileReference: number[], photoSizeID?: string): Promise<Buffer> {
  const partSize = 524288 * 2
  let dcId: undefined | number = undefined
  const downloadPart = async (offset: number) => {
    const body = {
      location: type === 'photo'
        ? { _: 'inputPhotoFileLocation', id, access_hash: accessHash, file_reference: fileReference, thumb_size: photoSizeID }
        : { _: 'inputDocumentFileLocation', id, access_hash: accessHash, file_reference: fileReference },
      offset: offset,
      limit: partSize
    }
    console.log(body)
    const file = await global.api.call('upload.getFile', body, dcId && { dcId })
    return file
  }

  let partBytesLength
  let iter = 0
  const fileChunks = []
  while (partBytesLength === undefined || partBytesLength === partSize) {
    console.log('Downloading part of file', iter, iter * partSize)
    let file
    try {
      file = await downloadPart(iter * partSize)
    } catch(e) {
      if (e._ === 'mt_rpc_error' && e.error_message.startsWith('FILE_MIGRATE_')) {
        const _dcId = Number(e.error_message.substring('FILE_MIGRATE_'.length))
        dcId = _dcId
        continue
      } else {
        throw e
      }
    }
    partBytesLength = file.bytes.length
    console.log('Downloaded part of file', iter, iter * partSize, partBytesLength)
    fileChunks.push(file.bytes)
    iter++
  } 
  const fileChunksBuffers = fileChunks.map(chunk => Buffer.from(chunk))
  const fileBuffer = Buffer.concat(fileChunksBuffers)
  console.log('Downloaded file', fileBuffer)
  return fileBuffer
}