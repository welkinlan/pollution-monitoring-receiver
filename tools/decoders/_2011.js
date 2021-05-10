var _ = require('lodash'),
    items = require('./assets/items2011');

exports.decode = function (Str) {
  var upload =
    {
      machineId : '',
      epochTime : 0
    }
  
  //解析MN
  var posMN = Str.indexOf("MN=");
  if (posMN >= 0) {
    var posEqual = Str.indexOf("=", posMN);
    var posSemicolon = Str.indexOf(";", posMN);
    upload.machineId = Str.substr(posEqual + 1, posSemicolon - posEqual - 1);
  } else return undefined;

  //时间
  var posTime = Str.indexOf("DataTime=");
  if (posTime >= 0) {
    var posEqual = Str.indexOf("=", posTime);
    var posSemicolon = Str.indexOf(";", posTime);
    var timeStr = Str.substr(posEqual + 1, posSemicolon - posEqual - 1);
    var year = parseInt(timeStr.substr(0,4));
    var month = parseInt(timeStr.substr(4,2)) - 1;  //月份是从0到11
    var day = parseInt(timeStr.substr(6,2));
    var hour = parseInt(timeStr.substr(8,2));
    var min = parseInt(timeStr.substr(10,2));
    var sec = parseInt(timeStr.substr(12,2));

    var epochTime = new Date(year,month,day,hour,min,sec);
    upload.epochTime = epochTime.getTime()/1000.0;
  } else {
    upload.epochTime = Math.round(new Date().getTime()/1000.0);
  }

  //数据
  _.mapKeys(items, function (value, key) {
    var posItem = Str.indexOf(value.fieldName + "=");
    if (posItem >= 0) {
      var posEqual = Str.indexOf("=", posItem);  //定位等于号
      var posSplit = Str.indexOf(value.split, posItem);  //定位数值后的分隔符
      if (posSplit < 0) posSplit = Str.indexOf('&', posItem);  //最后一个元素后面没有分隔符，而是&，属于特殊情况
      var itemValue = parseFloat(Str.substr(posEqual + 1, posSplit - posEqual - 1));
      if (_.isNumber(itemValue) && !_.isNaN(itemValue)) _.set(upload, key, itemValue);
    }
  });
  
  return upload;
}

/*
输入：
##0328ST=31;CN=2011;PW=123456;MN=88888880000001;CP=&&DataTime=20171219115817;S01-Rtd=0.00,S01-Flag=D;S02-Rtd=0.00,S02-Flag=D;S03-Rtd=0.00,S03-Flag=D;02-Rtd=0.00,02-Flag=D;S05-Rtd=0.00,S05-Flag=D;03-Rtd=0.00,03-Flag=D;01-ZsRtd=0.00;S08-Rtd=0.000000,S08-Flag=D;B02-Rtd=0.00,B02-Flag=D;01-Rtd=0.00,01-Flag=D;02-ZsRtd=0.00;03-ZsRtd=0.00&&B681

输出：
{"machineId":"88888880000001","epochTime":1513655897,"rawSO2":0,"calculatedSO2":0,"rawNOx":0,"calculatedNOx":0,"rawDust":0,"calculatedDust":0,"rawO2":0,"gasTemp":0,"gasPressure":0,"gasVelocity":0,"gasQuantity":0,"gasHumidity":0}*/
