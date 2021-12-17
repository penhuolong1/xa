import { FILE_SIZE } from './constVal'
import { message as Message } from 'ant-design-vue'
// 升序排序
/**
 *
 * @param {升序的数组} ary
 * @param {根据的字段} clom
 */
export function sortNum(ary, clom) {
  // 根據距離遠近排序，越近在前面，升序
  ary.sort((a, b) => {
    if (a[clom] < b[clom]) {
      return -1
    } else if (a[clom] == b[clom]) {
      return 0
    } else {
      return 1
    }
  })
  return ary
}

/**
 *
 * @param {要插入目标元素后面的新元素} newElement
 * @param {目标元素} targetElement
 */
export function insertAfter(newElement, targetElement) {
  var parent = targetElement.parentNode
  if (parent.lastChild == targetElement) {
    // 如果最后的节点是目标元素，则直接添加。因为默认是最后
    parent.appendChild(newElement)
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling)
    // 如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
  }
}

/**
 * @description 身份证算出出生年月和性别
 * @param [string] 身份证号码
 */

export function tools_calcIdentiyInfo(str) {
  // 获取性别
  const sex = parseInt(str.substr(16, 1)) % 2 == 1 ? '男' : '女'
  const brith = str.substring(6, 10) + '-' + str.substring(10, 12) + '-' + str.substring(12, 14)
  const obj = {
    sex: sex,
    birth: brith
  }
  return obj
}

// 获取指定值的在数组的index值
export const findArrayIndexByKey = function(arrayStr, key, value) {
  return arrayStr.findIndex(function(item) {
    return item[key] == value
  })
}

/**
 * 计算当前月份的天数
 */
export const monthDay = () => {
  const month = new Date().getMonth()
  const year = new Date().getFullYear()
  return new Date(year, month, 0).getDate()
}

/**
 * 限制上传文件大小,文件名不可包含特殊字符
 * @param {number} size 文件大小
 */
export const limitFileSize = file => {
  const size = file.size
  const type = file.type
  const name = file.name
  const nolimit = ['pdf', 'mp4', 'avi', 'mp3', 'wav']
  // 判断是否需要限制
  function isLimit() {
    let flag = false
    nolimit.forEach(item => {
      if (type.indexOf(item) !== -1) {
        flag = true
      }
    })
    return flag
  }
  if (name.includes(',') || name.includes(';')) {
    Message.error('文件名不可包含特殊字符')
    return true
  } else {
    if (isLimit()) {
      return false
    } else {
      if (size / 1024 > FILE_SIZE * 1000) {
        Message.error('上传的文件不能超过20M')
        return true
      } else {
        return false
      }
    }
  }
}

// 判断浏览器内核
export const browserKernel = () => {
  // 取得浏览器的userAgent字符串
  var userAgent = navigator.userAgent
  // 判断是否Opera浏览器
  var isOpera = userAgent.indexOf('Opera') > -1
  // 判断是否IE浏览器
  var isIE =
   userAgent.indexOf('compatible') > -1 &&
   userAgent.indexOf('MSIE') > -1 &&
   !isOpera
  // 判断是否IE的Edge浏览器
  var isEdge = userAgent.indexOf('Edge') > -1
  // 判断是否Firefox浏览器
  var isFF = userAgent.indexOf('Firefox') > -1
  // 判断是否Safari浏览器
  var isSafari =
   userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1
  // 判断Chrome浏览器
  var isChrome =
   userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1

  if (isIE) {
    // var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    // reIE.test(userAgent)
    // var fIEVersion = parseFloat(RegExp['$1'])
    // if (fIEVersion === 7) {
    //   return 'IE7'
    // } else if (fIEVersion === 8) {
    //   return 'IE8'
    // } else if (fIEVersion === 9) {
    //   return 'IE9'
    // } else if (fIEVersion === 10) {
    //   return 'IE10'
    // } else if (fIEVersion === 11) {
    //   return 'IE11'
    // } else {
    //   return 'IE'
    // }
    return 'IE'
  }
  if (isOpera) {
    return 'Opera'
  }
  if (isEdge) {
    return 'Edge'
  }
  if (isFF) {
    return 'FF'
  }
  if (isSafari) {
    return 'Safari'
  }
  if (isChrome) {
    return 'Chrome'
  }
}
