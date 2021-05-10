
exports.check = function (Str) {
  var buf = new Array();
  for (var i = 0; i < Str.length; i++)
  {
    buf[i] = Str.charCodeAt(i);
  }
  return crcCheck(buf, buf.length);
}

function crcCheck(buf, len) {
    var buffer = 0xFFFF;
  
  for (var i = 0; i < len; i++)
  {
    buffer = Hi(buffer) ^ buf[i];
    for (var j = 0; j < 8; j++)
    {
      var flg = buffer & 0x0001;
      buffer = buffer >> 1;
      if (flg === 1) buffer = buffer ^ 0xA001;
    }
  }
  
  return buffer;
}

function Hi(buffer) {
  return buffer >> 8;
}