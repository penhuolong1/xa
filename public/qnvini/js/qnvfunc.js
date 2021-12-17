// ///////////////////////////////////////////////////////////////////////
var uMaxID = 64
var uPlayFileID = new Array(64)
var uRecordID = new Array(64)
var uCCSessID = -1
var vConfID = 0
var g_interval = 0// 定时器全局变量
var g_msg = false
var isFirefox = !!navigator.userAgent.toUpperCase().indexOf('FIREFOX')
var isIE = !!navigator.userAgent.toUpperCase().indexOf('MSIE')
var isChrome = !!navigator.userAgent.toUpperCase().indexOf('CHROME')
var saveFileSrc = 'd'
var recordTime = {}

// //////////////////////////////////////////////////////////////////////
//
// js脚本调用在IE10以上需要IE10兼容模式如例子html否则js脚本会失效，
// 当然开发者可以重新构造IE10调用activex的js脚本。
//
function T_WaitForWin (vWin) {
  var vTimeout = 5000
  var vBegintime = new Date()
  var vEndtime = new Date()
  while (vWin.vInit != 1 && vEndtime.getTime() - vBegintime.getTime() < (vTimeout * 2))// ns超时
  {
    if (vEndtime.getTime() - vBegintime.getTime() > vTimeout)// 1s还没有完成，使用等待方式
    {
      Sleep(100)// 等待100ms
    }
    vEndtime = new Date()
  }
}

function I_CheckActiveX () {
  var iVer = 1// 第一个版本
  check_ver(iVer, function (nRet) {
    var szHint = ''
    switch (nRet) {
      case W_OK:// 检查成功
        szHint = '安装成功'
        break
      case W_TRY:// 试用
        szHint = '试用版本已安装成功'
        break
      case W_NO_FOUND:// 没有找到校验服务器
        szHint = '没有找到校验服务器'
        break
      case W_EXCEED_NUM:
        szHint = '校验服务器超过用户数了'
        break
      default:
        szHint = '没有安装本地驱动，请下载'
        break
    }
    AppendStatus(szHint)
    alert(szHint)
  })
}

function TV_Initialize () {
// 检测是否安装中间件
  // var qnv = document.getElementById('qnviccub');
  //	qnv.attachEvent("OnQnvEvent", T_GetEvent);
  DevInfo(0, QNV_DEVINFO_GETCHANNELS, function (nResult) {
    if (nResult <= 0) {
      OpenDevice(0, function (nResult) {
        DevInfo(0, QNV_DEVINFO_GETCHANNELS, function (channels) {
          if (channels > 0) { // 初始化变量
            for (i = 0; i < uMaxID; i = i + 1) {
              uPlayFileID[i] = -1
              uRecordID[i] = -1
            }
            for (j = 0; j < channels; j++) {
              // SetParam(j,QNV_PARAM_DTMFVOL,5);
              SetParam(j, QNV_PARAM_AM_LINEIN, 5, null)// 把输入能量增益调为5
            }
            DevInfo(0, QNV_DEVINFO_GETSERIAL, function (sn) {
              DevInfo(0, QNV_DEVINFO_GETTYPE, function (type) {
                DevInfo(0, QNV_DEVINFO_FILEVERSION, function (ver) {
                  AppendStatus('打开设备成功 通道数:' + channels + ' 序列号:' + sn + ' 设备类型:' + type + ' ver:' + ver)
                })
              })
            })
          } else {
            AppendStatus('打开设备失败,请检查设备是否已经插入并安装了驱动,并且没有其它程序已经打开设备')
          }
        })
      })// OpenDevice
    }// if(nResult <= 0)
    else {
      AppendStatus('设备已经被打开，不需要重复打开')
    }
  })
}

// 配置设备参数函数
// nChannel通道号
// paramName//参数名
// nValue参数值
function TV_SetParam (nChannel, paramName, nValue, nextFunc) {
  if (nChannel >= 0) {
    SetParam(nChannel, paramName, nValue, nextFunc)// 设置参数
  }
}
// 控制设备参数函数
// nChannel通道号
// paramName//参数名
// nValue参数值
function TV_SetDevCtrl (nChannel, paramName, nValue, nextFunc) {
  return SetDevCtrl(nChannel, paramName, nValue, nextFunc)
}
function TV_StopConference (nextFunc) {
  if (vConfID > 0) {
    Conference(-1, vConfID, QNV_CONFERENCE_DELETECONF, 0, 0, function (nResult) {
      nextFunc(nResult)
      vConfID = 0
      AppendStatus('会议停止')
    })// 删除会议
  }
}
function TV_StartConference () {
  OpenDevice(ODT_SOUND, 0, 0, function (nResult) {
    if (nResult <= 0) {
      AppendStatus('打开声卡模块失败')
    } else {
      TV_StopConference(function (nResult) {
        Conference(-1, 0, QNV_CONFERENCE_CREATE, 0, '', function (vConfID) {
          if (vConfID <= 0) { AppendStatus('创建会议失败') } else {
            Conference(SOUND_CHANNELID, vConfID, QNV_CONFERENCE_ADDTOCONF, 0, '', function (vRet) {
              AppendStatus('加入会议完成,Ret=' + vRet)
              DevInfo(0, QNV_DEVINFO_GETCHANNELS, function (chammels) {
                for (i = 0; i < chammels; i = i + 1) {
                  Conference(i, vConfID, QNV_CONFERENCE_ADDTOCONF, 0, '', function (nRet) {
                    AppendStatus('加入会议完成,Ret=' + nRet)
                  })
                }
                AppendStatus('会议创建完成,会议ID=' + vConfID)
              })
            })// Conference(SOUND_CHANNELID
          }
        })// Conference-1
      })// TV_StopConference
    }
  })
}

function TV_InitCCModule () {
  OpenDevice(ODT_CC, 0, QNV_CC_LICENSE, function (nResult) {
    if (nResult > 0) {
      AppendStatus('加载CC网络模块成功')
    } else { AppendStatus('加载CC网络模块失败') }
  })
}
function TV_Disable () {
  g_msg = true
  CloseDevice(ODT_ALL, function (nResult) {
    AppendStatus('关闭设备完成.')
  })// 关闭所有设备
}

// ---------------------------------------
// function TV_EnableHook (uID, bEnable) {
//   TV_SetDevCtrl(uID, QNV_CTRL_DOHOOK, bEnable, function (nResult) {
//     AppendStatusEx(uID, bEnable ? '软摘机' : '软挂机')
//   })
// }
// ---------------------------------------
// 开始拨号：
function TV_EnableHook (uID, bEnable, phoneNum) {
  // AppendStatusEx(uID, bEnable ? "软摘机" : "软挂机2" +phoneNum);
  TV_SetDevCtrl(uID, QNV_CTRL_DOHOOK, bEnable, function (nResult) {
    AppendStatusEx(uID, bEnable ? '软摘机' : '软挂机' + phoneNum)
    if (bEnable == TRUE) {
      	// 摘机
      var numss = phoneNum
      AppendStatusEx(uID, '1秒后开始录音')
      window.setTimeout(function () {
        TV_StartRecordFile(uID, numss)// 开启录音
      }, 1000)
    } else if (bEnable == FALSE) {	// 挂机
      AppendStatusEx(uID, '1秒后停止录音')
      var nums = phoneNum
      callphone = phoneNum
      window.setTimeout(function () {
        TV_StopRecordFile(uID, nums)// 停止录音
      }, 1000)
    }
  })
}

function TV_OffHookCtrl (uID) {
  TV_EnableHook(uID, TRUE)
}

function TV_HangUpCtrl (uID) {
  TV_EnableHook(uID, FALSE, callphone)
}
// ----------------------------------------
function TV_EnableMic2Line (uID, bEnable) {
  // SetDevCtrl(uID,QNV_CTRL_DOMICTOLINE,bEnable);
  TV_SetDevCtrl(uID, QNV_CTRL_DOMICTOLINE, bEnable)
}
function TV_EnableMic (uID, bEnable) {
  TV_EnableMic2Line(uID, bEnable)
}
// ----------------------------------------
function TV_EnableDoPhone (uID, bEnable) {
  SetDevCtrl(uID, QNV_CTRL_DOPHONE, bEnable)
}
function TV_EnableRing (uID, bEnable) {
  TV_EnableDoPhone(uID, bEnable)
}
function TV_StartRing (uID, bEnable) {
  if (bEnable) { General(uID, QNV_GENERAL_STARTRING, 0, '1234', null) } else { General(uID, QNV_GENERAL_STOPRING, 0, '', null) }
}
// --------------------------------------

function TV_EnableDoPlay (uID, bEnable) {
  SetDevCtrl(uID, QNV_CTRL_DOPLAY, bEnable, null)
}
function TV_OpenDoPlay (uID) {
  TV_EnableDoPlay(uID, TRUE)
}
function TV_CloseDoPlay (uID) {
  TV_EnableDoPlay(uID, FALSE)
}
// ----------------------------------------------
// 线路声音到耳机，用耳机通话时
function TV_EnableLine2Spk (uID, bEnable) {
  SetDevCtrl(uID, QNV_CTRL_DOLINETOSPK, bEnable, null)
}
// 播放的语音到耳机
function TV_EnableMicSpk (uID, bEnable) {
  SetDevCtrl(uID, QNV_CTRL_DOPLAYTOSPK, bEnable)
}
// ----------------------------------------------

function TV_EnablePlay2Spk (uID, bEnable) {
  SetDevCtrl(uID, QNV_CTRL_DOPLAYTOSPK, bEnable)
}

function TV_EnableRingPower (uID, bEnable) {
  GetDevCtrl(uID, QNV_CTRL_DOPHONE, function (nRet) {
    if (nRet && bEnable) {
      alert('请先断开电话机')
    } else {
      SetDevCtrl(uID, QNV_CTRL_RINGPOWER, bEnable, null)
    }
  })
}

function TV_RefuseCallIn (uID) {
  GetDevCtrl(uID, QNV_CTRL_RINGTIMES, function (nRet) {
    if (nRet <= 0) {
      alert('没有来电,无效的拒接')
    } else {
      General(uID, QNV_GENERAL_STARTREFUSE, 0, 0, null)
    }
  })
}
function TV_StartFlash (uID) {
  GetDevCtrl(uID, QNV_CTRL_DOHOOK, function (nCon) {
    GetDevCtrl(uID, QNV_CTRL_PHONE, function (nRet) {
      if (nCon <= 0 && nRet <= 0) {
        alert('没有摘机状态，无效的拍插簧')
      } else {
        General(uID, QNV_GENERAL_STARTFLASH, FT_ALL, '', function (nRetCall) {
          if (nRetCall <= 0) {
            alert('拍插簧失败')
          }
        })
      }
    })
  })
}

function TV_EnablePhoneRing (uID, bEnable) {
  if (bEnable) {
    GetDevCtrl(uID, QNV_CTRL_DOPHONE, function (nRet) {
      if (nRet) {
        alert('请先断开电话机')
      } else {
        var szCallID = '1234567890'
        SetParam(uID, QNV_PARAM_RINGCALLIDTYPE, DIALTYPE_FSK, function (n) {
          General(uID, QNV_GENERAL_STARTRING, 0, szCallID, function (k) {
            AppendStatusEx(uID, '开始内线模拟间隔震铃 -> 模拟来电号码：' + szCallID)
          })
        })// 设置送码方式为一声后FSK模式,默认为一声前dtmf模式//DIALTYPE_DTMF
      }
    })
  } else {
    General(uID, QNV_GENERAL_STOPRING, 0, 0, function (h) {
      AppendStatusEx(uID, '停止内线震铃')
    })
  }
}

function TV_StartPlayFile (uID, szFile) {
  vFilePath = 'c:\\test.wav'
  alert('播放文件路径为:' + vFilePath)
  if (vFilePath.length > 0) {
    //    AppendStatus("选择文件:"+vFilePath);
	 //   TV_StopPlayFile(uID);//先停止上次播放的句柄
    var vmask = PLAYFILE_MASK_REPEAT// 循环播放
    PlayFile(uID, QNV_PLAY_FILE_START, 0, vmask, vFilePath, function (id) {
      uPlayFileID[uID] = id
      if (id <= 0) {
        AppendStatusEx(uID, '播放失败:' + vFilePath)
      } else {
        AppendStatusEx(uID, '开始播放文件:' + vFilePath)
      }
    })
  } else {
    AppendStatus('没有选择文件')
  }
}

function TV_StopPlayFile (uID) {
  if (uPlayFileID[uID] > 0) {
    PlayFile(uID, QNV_PLAY_FILE_STOP, uPlayFileID[uID], 0, 0, function (nRet) {
      AppendStatusEx(uID, '停止播放')
      uPlayFileID[uID] = 0
    })
  } else {
    AppendStatusEx(uID, '未播放的句柄')
    uPlayFileID[uID] = 0
  }
}
function TV_StopPlayFileEx (uID, nextFunc) {
  if (uPlayFileID[uID] > 0) {
    PlayFile(uID, QNV_PLAY_FILE_STOP, uPlayFileID[uID], 0, 0, function (nRet) {
      uPlayFileID[uID] = 0
      nextFunc()
      AppendStatusEx(uID, '停止播放')
    })
  } else {
    uPlayFileID[uID] = 0
    nextFunc()
    AppendStatusEx(uID, '未播放的句柄')
  }
}
// 录音功能
function TV_StartRecordFile (uID, phoneNum) {
  var dates = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, '').replace(/\.[\d]{3}Z/, '').replace('-', '').replace('-', '').replace(':', '').replace(':', '')	// 当前时间
  var stry = localStorage.getItem('phoneNums') + '-' + dates + '.wav'// localStorage.getItem("caseNo") + "-"+
  localStorage.setItem('recordName', stry)
  vFilePath = saveFileSrc + ':\\phoneRecord' + '\\' + stry// 文件路径
  AppendStatus('录音文件路径为:' + vFilePath)
  console.log('开始录音拉')
  callStartTime = formatDate(new Date())
  // vFilePath ="E:\\test.wav";  //有些操作系统c盘保护，保存到c盘可能会失败，可以换到其它盘符

  if (vFilePath.length > 0) {
    TV_StopPlayFileEx(uID, function () {
      var vFormatID = BRI_WAV_FORMAT_PCM8K16B// 选择使用8K16bit采样
      var vmask = RECORD_MASK_ECHO | RECORD_MASK_AGC// 使用回音抵消后并且自动增益的
      // console.log('录音文件路径为:' + vFilePath)
      RecordFile(uID, QNV_RECORD_FILE_START, vFormatID, vmask, vFilePath, function (hRec) {
        // console.log('录音返回:' + hRec)
        uRecordID[uID] = hRec
        if (uRecordID[uID] <= 0) {
          AppendStatusEx(uID, '录音失败:' + vFilePath)
        } else {
          AppendStatusEx(uID, '开始录音文件: id=' + uRecordID[uID] + '  ' + vFilePath)
        }
      })
    })
  } else {
    AppendStatus('没有选择文件')
  }
}

// function TV_StopRecordFile (uID) {
//   if (uRecordID[uID] > 0) {
//     // var vRecPath=GetRecFilePath(uID,uRecordID[uID]);
//     RecordFile(uID, QNV_RECORD_FILE_PATH, uRecordID[uID], 0, 0, function (vRecPath) {
//       RecordFile(uID, QNV_RECORD_FILE_ELAPSE, uRecordID[uID], 0, 0, function (vElapse) {
//         RecordFile(uID, QNV_RECORD_FILE_STOP, uRecordID[uID], 0, 0, function (nRet) {
//           AppendStatusEx(uID, '停止录音:' + vRecPath + '  录音时间:' + vElapse)
//           uRecordID[uID] = 0
//         })
//       })
//     })
//   }
// }
// 停止录音
function TV_StopRecordFile (uID, phoneNum) {
  console.log('停止录音1')
  console.log(uID)
  if (uRecordID[uID] > 0) {
    // var vRecPath=GetRecFilePath(uID,uRecordID[uID]);
    console.log('停止录音')
    RecordFile(uID, QNV_RECORD_FILE_PATH, uRecordID[uID], 0, 0, function (vRecPath) {
      RecordFile(uID, QNV_RECORD_FILE_ELAPSE, uRecordID[uID], 0, 0, function (vElapse) {
        RecordFile(uID, QNV_RECORD_FILE_STOP, uRecordID[uID], 0, 0, function (nRet) {
          localStorage.setItem('endTime', formatDate(new Date()))
          AppendStatusEx(uID, '停止录音:' + vRecPath + '  录音时间:' + vElapse + '【1秒后开始上传文件】')
          uRecordID[uID] = 0
          console.log('停止录音')
          window.setTimeout(function () {
            console.log('上传录音')
            const stamps = callphone + new Date().getTime()
            localStorage.setItem('xaCallPhoneCodes', stamps)
            // TV_uploadFile('http://192.168.86.60:9003/api/file/upload?username=w&type=1')
            if (location.hostname === 'localhost') {
              TV_uploadFile('http://xatjtest.olcourt.cn/api/court/freeFile/uploadWav?type=1&code=' + stamps)
            } else {
              TV_uploadFile('http://' + location.host + '/api/court/freeFile/uploadWav?type=1&code=' + stamps)
            }
            AppendStatusEx(uID, '【开始存储】:' + vRecPath + '  code:' + stamps)
            localStorage.setItem('uprecorder', 'ing')
          }, 1000)
        })
      })
    })
  }
}

function TV_DeleteRecordFile (uID) {
  CallLog(uID, QNV_CALLLOG_DELRECFILE, '', 0, function (vRet) {
    if (vRet <= 0) {
      alert('删除失败:' + vRet)
    } else { alert('删除完成') }
  })
}

// function TV_StartDial (uID, szCode) { // 正常拨号必须使用 DIALTYPE_DTMF
//   General(uID, QNV_GENERAL_STARTDIAL, DIALTYPE_DTMF, szCode, function (nRet) {
//     if (nRet <= 0) {
//       AppendStatusEx(uID, '拨号失败:' + szCode)
//     } else {
//       AppendStatusEx(uID, '开始拨号:' + szCode)
//     }
//   })
// }
function TV_StartDial (uID, szCode) { // 正常拨号必须使用 DIALTYPE_DTMF
  callphone = szCode
  callType = 1
  console.log(uID, szCode)
  // AppendStatusEx(uID, '拨号失败:' + szCode)
  General(uID, QNV_GENERAL_STARTDIAL, DIALTYPE_DTMF, szCode, function (nRet) {
    if (nRet <= 0) {
      AppendStatusEx(uID, '拨号失败:' + szCode)// 提示拨号失败
    } else {
      AppendStatusEx(uID, '开始拨号:' + szCode + '【1秒后开始摘机】')
      window.setTimeout(function () {
        TV_EnableHook(uID, TRUE, szCode)
      }, 1000)
    }
  })
}

function TV_GetDiskList () {
  Tool(QNV_TOOL_DISKLIST, 0, 0, 0, function (vDiskList) {
    AppendStatus('按逗号分隔的盘符列表:' + vDiskList)
  })
}
function TV_GetFreeSpace (szDiskname) {
  Tool(QNV_TOOL_DISKFREESPACE, 0, szDiskname, 0, function (vFreeSpace) {
    AppendStatus(szDiskname + ' 空闲大小为:' + vFreeSpace + '(M)')
  })
}
function TV_GetTotalSpace (szDiskname) {
  Tool(QNV_TOOL_DISKTOTALSPACE, 0, szDiskname, 0, function (vTotalSpace) {
    AppendStatus(szDiskname + ' 总共大小为:' + vTotalSpace + '(M)')
  })
}
function TV_BrowerPath () {
  Tool(QNV_TOOL_SELECTDIRECTORY, 0, '选择目录', 0, function (vPath) {
    AppendStatus('选择目录:' + vPath)
  })
}
function TV_SelectFile () {
  Tool(QNV_TOOL_SELECTFILE, 0, 'wav files|*.wav|all files|*.*||', 0, function (vFilePath) {
    AppendStatus('选择文件:' + vFilePath)
  })
}

// 上传文件
function TV_uploadFile (uploadUrl, phoneNum) {
  // 上传文件
  // vFilePath = "e:\\test.wav";
  var stry = localStorage.getItem('recordName')
  callEndTime = formatDate(new Date())
  // vFilePath = "e:\\phoneRecord\\" + stry;
  vFilePath = saveFileSrc + ':\\phoneRecord' + '\\' + stry
  // vFilePath = "d:\\phoneRecord\\" + stry;
  // vFilePath = "e:\\test.mp3";
  // vFilePath = 'd:\\phoneRecord\\918650175610-20201230105421.wav'
  AppendStatus('上传文件路径为:' + vFilePath)
  Remote(QNV_REMOTE_UPLOAD_START, 0, uploadUrl, vFilePath, 0, 0, function (nRet) {
    // nRet <=0表示失败
    console.log(nRet)
    console.log(uploadUrl, vFilePath)
    if (nRet <= 0) { AppendStatus('上传文件:' + vFilePath + '失败') } else {
      AppendStatus('上传文件:' + vFilePath + '成功 ' + 'code:' + localStorage.getItem('codes') + '请保存本次通话记录')
      window.parent.postMessage({
        callType: callType,
        phone: callphone,
        startTime: callStartTime,
        endTime: callEndTime,
        type: 'callPhone'
      }, '*')
    }
  })
}
// function TV_uploadFile (uploadUrl, vFilePath) {
//   // 上传文件
//   console.log('上传路径' + vFilePath)
//   setTimeout(() => {
//     Remote(QNV_REMOTE_UPLOAD_START, 0, uploadUrl, vFilePath, 0, 0, function (nRet) {
//       // nRet <=0表示失败wenj
//       if (nRet <= 0) { AppendStatus('上传文件:' + vFilePath + '失败') } else { AppendStatus('上传文件:' + vFilePath + '成功') }
//     })
//   }, 1000)
// }
/**
 * 检测上传成功与否
 */
function CHECK_uploadFile (phoneNum) {
  // var litigantId = localStorage.getItem('litigantId')
  // var answer = 1
  // var callLogId = localStorage.getItem('codes')
  var answerPhone = $('#dialcode').val()
  console.log(phoneNum)
  $.ajax({
    type: 'post',
    // url: "http://court2.ptnetwork001.com/sq/sqmobile/telephoneRecord.jhtml",
    url: '/api/mediate/file/saveCallWav.jhtml?',
    dataType: 'json',
    contentType: 'application/json;charset=UTF-8',
    data: JSON.stringify({
      // "lawCaseId":localStorage.getItem("lawcaseId"),
      // litigantId:localStorage.getItem("litigantId"),
      // lawCaseId:window.location.href.split('lawCaseId=')[1],
      // litigantId:(window.location.href.split('litigantId=')[1]).split('&&')[0],
      // dialPhone:"",
      // answerPhone:localStorage.getItem("phoneNums"),
      // startTime:"",
      // endTime:"",
      // isAnswer:1,
      // systemId:localStorage.getItem("systemId"),
      // noAnswerReason:"",
      litigantId: localStorage.getItem('litigantId'),
      answer: '1',
      code: localStorage.getItem('codes'),
      answerPhone: answerPhone,
      startTime: localStorage.getItem('startTime'),
      endTime: localStorage.getItem('endTime')
      // code:"135995082581568107711258"
    }),
    // timeout:1000,
    success: function (data) {
      // let msg = JSON.parse(data);
      // if(msg.state == 100){
      // 	AppendStatus("【录音文件校验成功】");
      // }else{
      // 	AppendStatus("【"+msg.message+"】");
      // 	// AppendStatus("【上传成功！】");
      // }
      console.log(data)
      AppendStatus('【' + data.message + '】')
    },
    error: function (err) {
      console.log(err)
    }
  })
}

function formatDate (time, formatStr) {
  if (!time) {
    return
  }
  const date = new Date(time)
  const Y = date.getFullYear()
  const M = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  const D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let m = date.getMinutes()
  m = m < 10 ? ('0' + m) : m
  let s = date.getSeconds()
  s = s < 10 ? ('0' + s) : s
  formatStr = formatStr || 'YYYY-MM-DD H:m:s'
  return formatStr.replace(/YYYY|MM|DD|H|m|s/ig, function (matches) {
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

/* 阿里云的URL
可以参照阿里云上传例子把其中的参数签名加密生成如下URL
http://post-test.oss-cn-hangzhou.aliyuncs.com/?name=message.wav&key=${filename}&policy=eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZ
*/
function ali_uploadFile (uploadUrl) {
  vFilePath = 'c:\\test.wav'
  alert('上传文件路径为:' + vFilePath)
  // 上传文件
  UploadFile(uploadUrl, vFilePath, function (nRet) {
    // nRet <=0表示失败
    if (nRet <= 0) { AppendStatus('上传文件:' + vFilePath + '失败') } else { AppendStatus('上传文件:' + vFilePath + '成功') }
  })
}
/*
//登陆CC
function TV_LoginCC(cc,pwd)
{
	if(CCCtrl(QNV_CCCTRL_ISLOGON,NULL,0) > 0)
         alert('已经登陆,请先离线');
	else
	{
		var v=cc+','+pwd;
		var vret=CCCtrl(QNV_CCCTRL_LOGIN,v,0);
		if(vret <= 0)//开始登陆
             alert('登陆CC失败:'+vret);
		else
			AppendStatus("开始登陆CC:"+cc);
	}
}
//CC离线
function TV_LogoutCC()
{
	CCCtrl(QNV_CCCTRL_LOGOUT,NULL,0);//离线
	AppendStatus("已离线");
}

function T_GetMsgValue(vmsg,vkey)
{
	var strs = vmsg.split("\r\n");
	for(var i = 0; i < strs.length; i++)
  	{
  		var vline=strs[i];
    		var vindex=vline.indexOf(vkey);
		if(vindex != -1)
		{
			return vline.slice(vkey.length+1);
		}
  	}
  	return "";
}
*/

// 页面上的所有js

var callPhone = ''
var callStartTime = ''
var callEndTime = ''
var callType = 1 // 1去电 2来电
$(document).ready(function () {
  console.log(location.host)
  var phone = GetRequest('phone')
  console.log(phone)
  $('#dialcode').val(phone)
  // var myCaseId = GetRequest('lawCaseId');
  // console.log(myCaseId)
  // $('#lawCaseId').val(myCaseId);
  // var myName = GetRequest('litigantName');
  // console.log(myName)
  // $('#litigantName').val(myName);
  var litigantId = GetRequest('litigantId')
  $('#litigantId').val(litigantId)
  console.log(litigantId)
  // console.log(location.origin)
  // console.log(window.location.host)
  // console.log(location.host)
  // if(GetRequest('type')!="suQian"){
  // 	suQianBtn.style.display="none";
  // }
  TV_Initialize()
  getEvent(T_GetEvent)
  // TV_uploadFile('http://sftest.olcourt.cn/api/main/uploadCallWav.jhtml?code=' + '32445634545' + '&litigantId=' + '918cad22de50483db42029e2f5d182f6')
  // TV_uploadFile('http://sftest.olcourt.cn/api/main/uploadCallWav.jhtml?code=' + '32445634545' + '&litigantId=' + 'a433797e4d3949f587408940320a320c')
  // TV_uploadFile('http://192.168.86.60:9003/api/file/upload?username=w&type=1')
  // set_check_data_url('http://192.168.0.4/k.html');//设置注册码URL函数
})
$(window).unload(function () {
  TV_Disable()
})
// 离开页面
$(window).bind('beforeunload', function () {
  ; TV_Disable()
})
// 显示提示文字
function AppendStatus (szStatus) {
  // qnviccub.QNV_Tool(QNV_TOOL_WRITELOG,0,szStatus,NULL,NULL,0);//写本地日志到控件注册目录的userlog目录下
  $('#StatusArea').append(szStatus + '\r\n')
  var scrollTop = $('#StatusArea')[0].scrollHeight
  $('#StatusArea').scrollTop(scrollTop)
  var szHint = $('#StatusArea').val() + szStatus + '\r\n'
  $('#StatusArea').val(szHint)
  //  $("#StatusArea").scrollTop($("#StatusArea").scrollHeight());
}
var TYPE = 0 // 1呼出2呼入
function AppendStatusEx (uID, szStatus) {
  uID = uID + 1
  AppendStatus('通道' + uID + ':' + szStatus)
}
function showDlg (flag) {
  var urlStr = prompt('请输入上传的文件的URL，格式如php文件上传', '')
  if (urlStr != null && urlStr != '') {
    if (flag == 0) { TV_uploadFile(urlStr) } else { ali_uploadFile(urlStr) }
  } else {
    alert('上传url不能为空!')
  }
}
function getData (phone) {
  console.log(phone)
}
function T_GetEvent (uID, uEventType, uHandle, uResult, szdata) {
  // var vValueArray=qnviccub.QNV_Event(0,2,0,"","",1024);
  if (uEventType == -1) { return }
  var vValue = ' type=' + uEventType + ' Handle=' + uHandle + ' Result=' + uResult + ' szdata=' + szdata
  switch (uEventType) {
    case BriEvent_PhoneHook:// 本地电话机摘机事件
      AppendStatusEx(uID, '本地电话机摘机' + vValue)
      break
    case BriEvent_PhoneDial:// 只有在本地话机摘机，没有调用软摘机时，检测到DTMF拨号
      AppendStatusEx(uID, '本地话机拨号' + vValue)
      callPhone = szdata
      callType = 1
      break
    case BriEvent_PhoneHang:// 本地电话机挂机事件
      TV_HangUpCtrl(uID)
      AppendStatusEx(uID, '本地电话机挂机' + vValue)
      break
    case BriEvent_CallIn:// 外线通道来电响铃事件
      AppendStatusEx(uID, '外线通道来电响铃事件' + vValue)
      TYPE = 2
      console.log('外线通道来电响铃事件', vValue)
      break
    case BriEvent_GetCallID:// 得到来电号码
      AppendStatusEx(uID, '得到来电号码' + vValue)
      callphone = szdata
      // 拿到来电号码开始录音
      window.parent.postMessage({
        type: 'call',
        phone: szdata,
        startTime: formatDate(new Date()),
        msg: '来电事件'
      }, '*')
      TV_StartRecordFile(0, szdata)
      callType = 2
      break
    case BriEvent_StopCallIn:// 对方停止呼叫(产生一个未接电话)
      AppendStatusEx(uID, '对方停止呼叫(产生一个未接电话)' + vValue)
      break
    case BriEvent_DialEnd:// 调用开始拨号后，全部号码拨号结束
      AppendStatusEx(uID, '调用开始拨号后，全部号码拨号结束' + vValue)
      break
    case BriEvent_PlayFileEnd:// 播放文件结束事件
      AppendStatusEx(uID, '播放文件结束事件' + vValue)
      break
    case BriEvent_PlayMultiFileEnd:// 多文件连播结束事件
      AppendStatusEx(uID, '多文件连播结束事件' + vValue)
      break
    case BriEvent_PlayStringEnd:// 播放字符结束
      AppendStatusEx(uID, '播放字符结束' + vValue)
      break
    case BriEvent_RepeatPlayFile:// 播放文件结束准备重复播放
      AppendStatusEx(uID, '播放文件结束准备重复播放' + vValue)
      break
    case BriEvent_SendCallIDEnd:// 给本地设备发送震铃信号时发送号码结束
      AppendStatusEx(uID, '给本地设备发送震铃信号时发送号码结束' + vValue)
      break
    case BriEvent_RingTimeOut:// 给本地设备发送震铃信号时超时
      AppendStatusEx(uID, '给本地设备发送震铃信号时超时' + vValue)
      break
    case BriEvent_Ringing:// 正在内线震铃
      AppendStatusEx(uID, '正在内线震铃' + vValue)
      break
    case BriEvent_Silence:// 通话时检测到一定时间的静音.默认为5秒
      AppendStatusEx(uID, '通话时检测到一定时间的静音' + vValue)
      break
    case BriEvent_GetDTMFChar:// 线路接通时收到DTMF码事件
      AppendStatusEx(uID, '线路接通时收到DTMF码事件' + vValue)
      break
    case BriEvent_RemoteHook:// 拨号后,被叫方摘机事件
      AppendStatusEx(uID, '拨号后,被叫方摘机事件' + vValue)
      break
    case BriEvent_RemoteHang:// 对方挂机事件
      TV_HangUpCtrl(uID)
      AppendStatusEx(uID, '对方挂机事件' + vValue)
      break
    case BriEvent_Busy:// 检测到忙音事件,表示PSTN线路已经被断开
      AppendStatusEx(uID, '检测到忙音事件,表示PSTN线路已经被断开' + vValue)
      break
    case BriEvent_DialTone:// 本地摘机后检测到拨号音
      AppendStatusEx(uID, '本地摘机后检测到拨号音' + vValue)
      break
    case BriEvent_RingBack:// 电话机拨号结束呼出事件。
      AppendStatusEx(uID, '电话机拨号结束呼出事件' + vValue)
      callStartTime = formatDate(new Date())
      break
    case BriEvent_MicIn:// MIC插入状态
      AppendStatusEx(uID, 'MIC插入状态' + vValue)
      break
    case BriEvent_MicOut:// MIC拔出状态
      AppendStatusEx(uID, 'MIC拔出状态' + vValue)
      break
    case BriEvent_FlashEnd:// 拍插簧(Flash)完成事件，拍插簧完成后可以检测拨号音后进行二次拨号
      AppendStatusEx(uID, '拍插簧(Flash)完成事件，拍插簧完成后可以检测拨号音后进行二次拨号' + vValue)
      break
    case BriEvent_RefuseEnd:// 拒接完成
      AppendStatusEx(uID, '拒接完成' + vValue)
      break
    case BriEvent_SpeechResult:// 语音识别完成
      AppendStatusEx(uID, '语音识别完成' + vValue)
      break
    case BriEvent_FaxRecvFinished:// 接收传真完成
      AppendStatusEx(uID, '接收传真完成' + vValue)
      break
    case BriEvent_FaxRecvFailed:// 接收传真失败
      AppendStatusEx(uID, '接收传真失败' + vValue)
      break
    case BriEvent_FaxSendFinished:// 发送传真完成
      AppendStatusEx(uID, '发送传真完成' + vValue)
      break
    case BriEvent_FaxSendFailed:// 发送传真失败
      AppendStatusEx(uID, '发送传真失败' + vValue)
      break
    case BriEvent_OpenSoundFailed:// 启动声卡失败
      AppendStatusEx(uID, '启动声卡失败' + vValue)
      break
    case BriEvent_UploadSuccess:// 远程上传成功
      AppendStatusEx(uID, '远程上传成功' + vValue)
      break
    case BriEvent_UploadFailed:// 远程上传失败
      AppendStatusEx(uID, '远程上传失败' + vValue)
      break
    case BriEvent_EnableHook:// 应用层调用软摘机/软挂机成功事件
      AppendStatusEx(uID, '应用层调用软摘机/软挂机成功事件' + vValue)
      break
    case BriEvent_EnablePlay:// 喇叭被打开或者/关闭
      AppendStatusEx(uID, '喇叭被打开或者/关闭' + vValue)
      break
    case BriEvent_EnableMic:// MIC被打开或者关闭
      AppendStatusEx(uID, 'MIC被打开或者关闭' + vValue)
      break
    case BriEvent_EnableSpk:// 耳机被打开或者关闭
      AppendStatusEx(uID, '耳机被打开或者关闭' + vValue)
      break
    case BriEvent_EnableRing:// 电话机跟电话线(PSTN)断开/接通
      AppendStatusEx(uID, '电话机跟电话线(PSTN)断开/接通' + vValue)
      break
    case BriEvent_DoRecSource:// 修改录音源
      AppendStatusEx(uID, '修改录音源' + vValue)
      break
    case BriEvent_DoStartDial:// 开始软件拨号
      AppendStatusEx(uID, '开始软件拨号' + vValue)
      break
    case BriEvent_RecvedFSK:// 接收到FSK信号，包括通话中FSK/来电号码的FSK
      AppendStatusEx(uID, '接收到FSK信号，包括通话中FSK/来电号码的FSK' + vValue)
      break
    case BriEvent_PlugOut:
      AppendStatusEx(uID, '设备移除')
      break
    case BriEvent_DevErr:// 设备错误
      AppendStatusEx(uID, '设备错误' + decodeURIComponent(vValue))
      break
    default:
      if (uEventType < BriEvent_EndID)
      // AppendStatusEx(uID, "忽略其它事件发生:ID=" + uEventType + vValue);
      { break }
  }
}

// 编码问题
var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
var base64DecodeChars = new Array(

  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,

  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,

  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,

  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,

  -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,

  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,

  -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,

  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1)
function GetRequest (value) {
  // url例子：www.bicycle.com?id="123456"&Name="bicycle"；
  var url = decodeURI(location.search) // ?id="123456"&Name="bicycle";
  var object = {}
  if (url.indexOf('?') != -1)// url中存在问号，也就说有参数。
  {
    var str = url.substr(1) // 得到?后面的字符串
    var strs = str.split('&') // 将得到的参数分隔成数组[id="123456",Name="bicycle"];
    for (var i = 0; i < strs.length; i++) {
      object[strs[i].split('=')[0]] = strs[i].split('=')[1]
    }
  }
  return object[value]
}
function base64encode (str) {
  var out, i, len

  var c1, c2, c3

  len = str.length

  i = 0

  out = ''

  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff

    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2)

      out += base64EncodeChars.charAt((c1 & 0x3) << 4)

      out += '=='

      break
    }

    c2 = str.charCodeAt(i++)

    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2)

      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))

      out += base64EncodeChars.charAt((c2 & 0xF) << 2)

      out += '='

      break
    }

    c3 = str.charCodeAt(i++)

    out += base64EncodeChars.charAt(c1 >> 2)

    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))

    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))

    out += base64EncodeChars.charAt(c3 & 0x3F)
  }

  return out
}

function base64decode (str) {
  var c1, c2, c3, c4

  var i, len, out

  len = str.length

  i = 0

  out = ''

  while (i < len) {
    /* c1 */

    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
    } while (i < len && c1 == -1)

    if (c1 == -1) { break }

    /* c2 */

    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
    } while (i < len && c2 == -1)

    if (c2 == -1) { break }

    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))

    /* c3 */

    do {
      c3 = str.charCodeAt(i++) & 0xff

      if (c3 == 61) { return out }

      c3 = base64DecodeChars[c3]
    } while (i < len && c3 == -1)

    if (c3 == -1) { break }

    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2))

    /* c4 */

    do {
      c4 = str.charCodeAt(i++) & 0xff

      if (c4 == 61) { return out }

      c4 = base64DecodeChars[c4]
    } while (i < len && c4 == -1)

    if (c4 == -1) { break }

    out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
  }

  return out
}

function utf16to8 (str) {
  var out, i, len, c

  out = ''

  len = str.length

  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i)

    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i)
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))

      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))

      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))

      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    }
  }

  return out
}

function utf8to16 (str) {
  var out, i, len, c

  var char2, char3

  out = ''

  len = str.length

  i = 0

  while (i < len) {
    c = str.charCodeAt(i++)

    switch (c >> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:

        // 0xxxxxxx

        out += str.charAt(i - 1)

        break

      case 12: case 13:

        // 110x xxxx　 10xx xxxx

        char2 = str.charCodeAt(i++)

        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))

        break

      case 14:

        // 1110 xxxx　10xx xxxx　10xx xxxx

        char2 = str.charCodeAt(i++)

        char3 = str.charCodeAt(i++)

        out += String.fromCharCode(((c & 0x0F) << 12) |

						((char2 & 0x3F) << 6) |

						((char3 & 0x3F) << 0))

        break
    }
  }

  return out
}
