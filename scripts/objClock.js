

export function objClock() {
  
  const en_month_name = ['"January"', '"February"', '"March"', '"April"', '"May"', '"June"', '"July"', '"August"', '"September"', '"October"', '"November"', '"December"'];
  const en_week_days_name = ['"Sunday"', '"Monday"', '"Tuesday"', '"Wednesday"', '"Thursday"', '"Friday"', '"Saturday"'];
    
  let time = new Date();

  let timeZoneOffsetInMinutes = time.getTimezoneOffset();
  let timeZoneSign = timeZoneOffsetInMinutes > 0 ? '-' : '+';
  let timeZoneOffsetHours = Math.abs(Math.floor(timeZoneOffsetInMinutes / 60));

  return {
    hour: this.hour = time.getHours(),
    minute: this.minute = time.getMinutes(),
    second: this.second = time.getSeconds(),
    period: this.period = (this.hour < 12) ? '"AM"' : '"PM"',
    day: this.day = time.getDate(),
    weekday: this.weekday = en_week_days_name[time.getDay()],
    month: this.month = en_month_name[time.getMonth()],
    year: this.year = time.getFullYear(),
    timezone: this.timezone = `"GMT${timeZoneSign}${timeZoneOffsetHours.toString().padStart(2, '0')}"`,
    unix: this.unix = Math.floor(Date.now() / 1000),
    utc: this.utc = `"${new Date(this.unix * 1000).toISOString()}"`,
  }
}