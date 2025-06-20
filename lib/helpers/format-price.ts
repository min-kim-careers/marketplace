export const formatCurrency = (value: string) => {
  const amount = parseFloat(value)
  const formatted = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount)

  return formatted
}

export function unformatCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned);
}