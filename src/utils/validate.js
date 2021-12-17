/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 验证手机号
 * @param {string} phone
 * @returns {Boolean}
 */
export function validPhone(phone) {
  const reg = /^1[3456789]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证身份证
 * @param {string} IDCard
 * @returns {Boolean}
 */
export function validIDCard(IDCard) {
  const reg = /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/
  return reg.test(IDCard)
}

/**
 * 验证身份证
 */
export function validIDCardForm(rule, IDCard, callback) {
  if (!validIDCard(IDCard)) {
    callback('证件格式不正确')
  } else {
    callback()
  }
}
/**
 * 验证手机号
 * @param {string} IDCard
 */
export function validPhoneForm(rule, phone, callback) {
  if (!validPhone(phone)) {
    callback('手机号码格式不正确')
  } else {
    callback()
  }
}
/**
 * 验证密码只包含字母及数字（6位以上）
 * @param {string} password
 * @returns {Boolean}
 */
export function validPassword(password) {
  // const reg = new RegExp('^(?!\D+$)(?![^a-zA-Z]+$).{6,}$')
  const reg = /^[a-zA-Z0-9]{7,}$/
  return reg.test(password)
}
/**
 * 判空
 * @param {string} content
 * @returns {Boolean}
 */
export function validNull(content) {
  if (content.replace(/^\s*|[\x00-\x1f]|\s*$/g, '') == '') {
    return true
  } else {
    return false
  }
}
