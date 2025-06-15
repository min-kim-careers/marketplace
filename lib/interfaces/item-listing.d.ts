export interface ItemListing {
  id: number
  name: string
  description: string
  price: number
  brand?: string
  category: string
  condition: string
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
  postcode: string
  imageUrls: string[]
}

