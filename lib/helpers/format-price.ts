export const formatPrice = (price: string) => {
  const amount = parseFloat(price)
  const formatted = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount)

  return formatted
}
