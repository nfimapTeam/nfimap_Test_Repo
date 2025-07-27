import { TFunction } from "i18next";

export const getTicketSiteName = (ticketLink: string, lang: string): string => {
  const isKorean = lang === "ko";

  if (/ticket\.yes24\.com/i.test(ticketLink)) {
    return isKorean ? "예스24 티켓" : "Yes24 Ticket";
  }
  if (/tickets\.interpark\.com/i.test(ticketLink)) {
    return isKorean ? "놀티켓" : "NOL Ticket";
  }
  if (/ticket\.melon\.com/i.test(ticketLink)) {
    return isKorean ? "멜론 티켓" : "Melon Ticket";
  }
  if (/www\.ticketlink\.co\.kr/i.test(ticketLink)) {
    return isKorean ? "티켓링크" : "Ticketlink";
  }
  if (/www\.thaiticketmajor\.com/i.test(ticketLink)) {
    return isKorean ? "타이티켓메이저" : "Thai Ticket Major";
  }
  if (/my\.bookmyshow\.com/i.test(ticketLink)) {
    return isKorean ? "북마이쇼" : "BookMyShow";
  }
  if (/ticketplus\.com\.tw/i.test(ticketLink)) {
    return isKorean ? "티켓플러스" : "Ticketplus";
  }
  if (/kktix\.com/i.test(ticketLink)) {
    return isKorean ? "KKTix" : "KKTix";
  }
  if (/ticketnet\.com\.ph/i.test(ticketLink)) {
    return isKorean ? "티켓넷" : "Ticketnet";
  }
  if (/www\.instagram\.com/i.test(ticketLink)) {
    return isKorean ? "인스타그램" : "Instagram";
  }
  if (/nflying-official\.jp/i.test(ticketLink)) {
    return isKorean ? "엔플라잉 재팬" : "N.Flying Japan";
  }
  if (/fncent\.com/i.test(ticketLink)) {
    return isKorean ? "FNC 엔터" : "FNC Ent.";
  }

  return isKorean ? "기타" : "Others";
};
