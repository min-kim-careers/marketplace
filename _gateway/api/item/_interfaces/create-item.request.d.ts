export interface CreateItemRequest {
    name: string
    description: string
    price: number
    category: string
    condition: string
    postcode: string
    imageUrls?: string[]
}
