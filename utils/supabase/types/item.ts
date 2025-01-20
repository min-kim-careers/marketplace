interface Location {
  suburb: string
  state: string
}

type Condition =
  | 'new'
  | 'used'
  | 'refurbished'
  | 'defective'

type Category =
  | 'CPU'
  | 'GPU'
  | 'RAM'
  | 'Motherboard'
  | 'PSU'
  | 'Storage'
  | 'Case'
  | 'Cooling'
  | 'Monitor'
  | 'Peripheral'
  | 'Software'
  | 'Other'

export interface Item {
  name: string
  description: string
  price: number
  imageUrl: string
  category: Category
  userEmail: string
  userHandle: string
  location: Location
  condition: Condition
  createdAt: Date
  updatedAt: Date
}
