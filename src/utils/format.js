export const formatDate = function(time, formatStr) {
  if (!time) {
    return
  }
  if ((typeof time) === 'string') {
    time = time.replace(new RegExp(/-/gm), '/') // ie和火狐浏览器 需要将时间的'-'转为'/'即可
  }
  const date = new Date(time)
  const Y = date.getFullYear()
  const M = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  const D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()
  let h = date.getHours()
  h = h < 10 ? `0${h}` : h
  let m = date.getMinutes()
  m = m < 10 ? `0${m}` : m
  let s = date.getSeconds()
  s = s < 10 ? `0${s}` : s
  formatStr = formatStr || 'YYYY-MM-DD H:m:s'
  return formatStr.replace(/YYYY|MM|DD|H|m|s/ig, function(matches) {
    return ({
      YYYY: Y,
      MM: M,
      DD: D,
      H: h,
      m: m,
      s: s
    })[matches]
  })
}
