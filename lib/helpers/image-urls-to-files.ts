import { compressedFileFromUrl } from "@/lib/helpers/compress-image-from-url"

export const imageUrlsToFiles = async (imageUrls: string[]) =>
  await Promise.all(
    imageUrls
      .filter((url) => url.startsWith('blob:'))
      .map(async (url) => {
        try {
          return await compressedFileFromUrl(url)
        } catch (error) {
          throw error
        }
      }),
  )
