export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}

export const parseDate = (formattedDateStr) => {
  if (formattedDateStr.includes('-')) {
    return formattedDateStr;
  } else {
    const parts = formattedDateStr.split(' ');
    const day = parts[0].padStart(2, '0');
    const month = parts[1].replace('.', '').toLowerCase();
    const year = '20' + parts[2];

    const monthNames = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sept', 'oct', 'nov', 'déc'];
    const monthIndex = monthNames.indexOf(month) + 1;
    const monthStr = monthIndex.toString().padStart(2, '0');

    return `${year}-${monthStr}-${day}`;
  }
}