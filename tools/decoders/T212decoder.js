var CRC16 = require('./tools/crc16'),
  _2011 = require('./_2011'),
  httpSender = require('../senders/httpSender'),
  path = require('path'),
  global = require(path.resolve('./assets/global'));

exports.decode = function (Str) {
  var upload = {};

  var crc16 = Str.substr(-4, 4).toLowerCase();  //截取包中的校验码
  var len = parseInt(Str.substr(2, 4));  //截取数据段长度
  var s = Str.substr(6, len);  //截取数据段
  var crc16result = CRC16.check(s);  //校验数据段
  var crc16str = crc16result.toString(16);  //校验结果转换为字符串
  while (crc16str.length < 4) crc16str = "0" + crc16str;  //校验结果字符串格式化

  var Checked = (crc16 === crc16str);
  var upload = {};

  if (Checked) {
    var type = Str.substr(Str.indexOf("CN=") + 3, 4);
    if (type === "2011") {
      upload = _2011.decode(Str);

      if (!upload || allZeroData(upload)) {
        console.log("Will not upload data: " + JSON.stringify(upload));
        return;
      }

      upload.token = global.token;

      //将重组的数据发送到服务端
      console.log("Uploading date: " + JSON.stringify(upload));
      httpSender.send(upload);
    }
  }
}

// 如果收到数据全为0 则认为设备掉线 数采仪默认发0
function allZeroData(uploadData) {
  // {"machineId":"120111XLQ15003","epochTime":1605601140,"rawSO2":0,"calculatedSO2":0,"rawNOx":0,"calculatedNOx":0,
  // "rawDust":0,"calculatedDust":0,"rawO2":0,"gasTemp":0,"gasPressure":0,"gasVelocity":0,"gasQuantity":0,"gasHumidity":0}
  return uploadData.rawSO2 == 0 && uploadData.calculatedSO2 == 0 && uploadData.rawNOx == 0 && uploadData.calculatedNOx == 0 &&
    uploadData.rawDust == 0 && uploadData.calculatedDust == 0 && uploadData.rawO2 == 0 && uploadData.gasTemp == 0 && uploadData.gasPressure == 0
    && uploadData.gasVelocity == 0 && uploadData.gasQuantity == 0 && uploadData.gasHumidity == 0;
}
