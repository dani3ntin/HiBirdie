export function changeDateFormatToDDMMYYYY(data){
    const parts = data.split('-')
    if (parts.length === 3) {
        const year = parts[0]
        const month = parts[1]
        const day = parts[2]
        return `${day}-${month}-${year}`
      } else {
        return '01-01-2000'
      }
}

export function changeDateFormatYYYYDDMM(data){
  const parts = data.split('-')
  if (parts.length === 3) {
      const year = parts[0]
      const month = parts[1]
      const day = parts[2]
      return `${year}-${day}-${month}`
    } else {
      return '01-01-2000'
    }
}