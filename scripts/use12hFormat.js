export function use12hFormat(object) {

  let hour = object['hour']
  let use12hFormat = hour %= 12
  use12hFormat === 0 ? 12 : use12hFormat

  object['hour'] = use12hFormat
}