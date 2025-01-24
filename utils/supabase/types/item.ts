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
  user_email: string
  user_handle: string
  created_at: Date
  updated_at: Date
  suburb: string
  state: string
  condition: string
}
