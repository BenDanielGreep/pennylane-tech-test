export const convertDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-'

  const datePattern = /^\d{4}-\d{2}-\d{2}$/
  if (!datePattern.test(dateStr)) return '-'

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'

  const [year, month, day] = dateStr.split('-').map(Number)
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return '-'
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
