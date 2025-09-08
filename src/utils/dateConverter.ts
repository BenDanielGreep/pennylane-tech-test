//date is receieved as
// YYYY-MM-DD or null/undefined
// returns in locale format or '-' if invalid
export const convertDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-'
  //return as number (no 0s) wiht the three letter abbrieviation of the month and full year
  const date = new Date(dateStr + 'T00:00:00') // Ensure it's treated as UTC
  if (isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
