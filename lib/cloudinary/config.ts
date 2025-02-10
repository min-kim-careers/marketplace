'use server'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export const getSignature = async () => {
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!apiSecret) {
    throw Error()
  }

  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: 'uploads' },
    apiSecret,
  )
  return { timestamp, signature }
}
