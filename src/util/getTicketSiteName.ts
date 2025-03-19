export const getTicketSiteName = (ticketLink: string): string => {
  if (/ticket\.yes24\.com/i.test(ticketLink)) {
    return "Yes24 Ticket";
  }
  if (/tickets\.interpark\.com/i.test(ticketLink)) {
    return "Interpark Ticket";
  }
  if (/ticket\.melon\.com/i.test(ticketLink)) {
    return "Melon Ticket";
  }
  if (/www\.ticketlink\.co\.kr/i.test(ticketLink)) {
    return "Ticketlink";
  }
  if (/www\.thaiticketmajor\.com/i.test(ticketLink)) {
    return "Thai Ticket Major";
  }
  if (/my\.bookmyshow\.com/i.test(ticketLink)) {
    return "BookMyShow";
  }
  if (/w\.pia\.jp/i.test(ticketLink)) {
    return "Pia";
  }
  if (/ticketplus\.com\.tw/i.test(ticketLink)) {
    return "Ticketplus";
  }
  if (/kktix\.com/i.test(ticketLink)) {
    return "KKTix";
  }
  if (/ticketnet\.com\.ph/i.test(ticketLink)) {
    return "Ticketnet";
  }
  if (/www\.instagram\.com/i.test(ticketLink)) {
    return "Instagram";
  }
  if (/nflying-official\.jp/i.test(ticketLink)) {
    return "N.Flying Japan";
  }
  if (/fncent\.com/i.test(ticketLink)) {
    return "FNC Ent.";
  }

  return "Others";
}