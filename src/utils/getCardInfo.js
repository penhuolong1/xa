// 通过身份证获取 年龄 籍贯 生日 性别
const PROVINCES = { // 身份证对应的籍贯
  11: '北京',
  12: '天津',
  13: '河北',
  14: '山西',
  15: '内蒙古',
  21: '辽宁',
  22: '吉林',
  23: '黑龙江',
  31: '上海',
  32: '江苏',
  33: '浙江',
  34: '安徽',
  35: '福建',
  36: '江西',
  37: '山东',
  41: '河南',
  42: '湖北',
  43: '湖南',
  44: '广东',
  45: '广西',
  46: '海南',
  50: '重庆',
  51: '四川',
  52: '贵州',
  53: '云南',
  54: '西藏',
  61: '陕西',
  62: '甘肃',
  63: '青海',
  64: '宁夏',
  65: '新疆',
  71: '台湾',
  81: '香港',
  82: '澳门',
  91: '国外'
}
export const getCardInfo = function(idNumber) {
  var province, birthday, currDate, month, date, age, sex
  // 获取籍贯
  province = PROVINCES[parseInt(idNumber.substr(0, 2))]
  // 二、出生日期
  birthday = idNumber.substring(6, 10) + '-' + idNumber.substring(10, 12) + '-' + idNumber.substring(12, 14)
  // 三、计算年龄
  currDate = new Date()
  month = currDate.getMonth() + 1
  date = currDate.getDate()
  age = currDate.getFullYear() - idNumber.substring(6, 10) - 1
  // 判断年龄
  if (idNumber.substring(10, 12) < month || (idNumber.substring(10, 12) == month && idNumber.substring(12, 14) <= date)) {
    age++
  }
  // 四、获取性别
  if (parseInt(idNumber.substr(16, 1)) % 2 == 1) {
    // 男
    sex = 1
  } else {
    // 女
    sex = 0
  }
  return {
    province,
    birthday,
    age,
    sex
  }
}
