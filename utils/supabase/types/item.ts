interface Location {
  suburb: string
  state: string
}

// type Condition =
//   | 'new'
//   | 'used'
//   | 'refurbished'
//   | 'defective'

// type Category =
//   | 'CPU'
//   | 'GPU'
//   | 'RAM'
//   | 'Motherboard'
//   | 'PSU'
//   | 'Storage'
//   | 'Case'
//   | 'Cooling'
//   | 'Monitor'
//   | 'Peripheral'
//   | 'Software'
//   | 'Other'

export interface Item {
  name: string
  description: string
  price: number
  image_url: string
  category: string
  profile_id: string
  created_at: Date
  updated_at: Date
  location: Location
  condition: string
}
