import { describe, it, expect } from 'vitest'
import { uploadMedia } from '@/api/media.api'

describe('uploadMedia()', () => {
  it('sends multipart/form-data and returns media assets', async () => {
    const formData = new FormData()
    const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' })
    formData.append('files', file)
    formData.append('mediaType', '1')

    const result = await uploadMedia(1, formData)
    expect(result).toHaveLength(1)
    expect(result[0].mediaType).toBe(1)
    expect(result[0].mediaUrl).toBe('https://example.com/photo.jpg')
  })
})