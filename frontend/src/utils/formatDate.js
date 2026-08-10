export function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}
