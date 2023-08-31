export function changeDateFormatToDDMMYYYY(data){
    if(data === undefined) return ''
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
  if(data === undefined) return ''
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

export function formatDateToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function stringToDate(dateString) {
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    throw new Error('Formato data non valido. Utilizzare il formato YYYY-MM-DD.');
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // I mesi in JavaScript sono indicizzati da 0 a 11
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error('Formato data non valido. Utilizzare il formato YYYY-MM-DD.');
  }

  const date = new Date(year, month, day);
  return date;
}
