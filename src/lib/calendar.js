export function calendarEvent(wedding) {
  const title = `Đám cưới Lương Tuấn Anh & Đặng Ngọc Anh`;
  const location = `${wedding.event.venueName} – ${wedding.event.hall} – ${wedding.event.address}`;
  const description = `Trân trọng kính mời bạn đến dự đám cưới ${wedding.couple.groomFullName} và ${wedding.couple.brideFullName}.\nThời gian: 11:00 ngày 21/10/2026 (giờ Việt Nam).\nĐịa điểm: ${location}\nChỉ đường: ${wedding.event.maps.directionsUrl}`;
  const start = new Date(wedding.event.startsAt);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  return { title, location, description, start, end };
}
const utc = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
export function googleCalendarLink(event) {
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({action:'TEMPLATE',text:event.title,dates:`${utc(event.start)}/${utc(event.end)}`,ctz:'Asia/Ho_Chi_Minh',details:event.description,location:event.location})}`;
}
const escapeText = value => value.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
function foldLine(line) {
  let result='', current='', bytes=0;
  for (const character of line) {
    const length=new TextEncoder().encode(character).length;
    if(bytes+length>75){result+=current+'\r\n';current=' ';bytes=1;}
    current+=character;bytes+=length;
  }
  return result+current;
}
export function calendarIcs(event) {
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//TuanAnhNgocAnh//Wedding//VI','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Đám cưới Tuấn Anh và Ngọc Anh','X-WR-TIMEZONE:Asia/Ho_Chi_Minh','BEGIN:VEVENT','UID:wedding-tuananh-ngocanh-20261021@tanawedding.workers.dev','DTSTAMP:20261002T000000Z',`DTSTART:${utc(event.start)}`,`DTEND:${utc(event.end)}`,`SUMMARY:${escapeText(event.title)}`,`DESCRIPTION:${escapeText(event.description)}`,`LOCATION:${escapeText(event.location)}`,'STATUS:CONFIRMED','END:VEVENT','END:VCALENDAR'].map(foldLine).join('\r\n')+'\r\n';
}
