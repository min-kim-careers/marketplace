export interface Item {
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

  profileHandle: str
}
