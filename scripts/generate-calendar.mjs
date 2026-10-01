import { readFileSync, writeFileSync } from 'node:fs';
import { calendarEvent, calendarIcs } from '../src/lib/calendar.js';
const wedding=JSON.parse(readFileSync(new URL('../src/config/wedding.json',import.meta.url),'utf8'));
writeFileSync(new URL('../public/dam-cuoi-tuan-anh-ngoc-anh.ics',import.meta.url),calendarIcs(calendarEvent(wedding)));
