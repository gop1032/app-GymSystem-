export function formatCurrency(amount) {
  const value = Number.isFinite(amount) ? amount : 0
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
