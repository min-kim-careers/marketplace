const imageBase = process.env.NEXT_PUBLIC_IMAGE_BASE

export const imageSrc = (url: string) => `${imageBase}/${url}`
