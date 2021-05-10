var global = require('./assets/global');
var server = require('net').createServer(serverCreated).listen(global.local.port);
var decoder = require('./tools/decoders/T212decoder');
var sender = require('./tools/senders/httpSender');

function serverCreated(socket) {
  console.log('A new connection was accepted.');
  
  socket.setEncoding('utf8');
  
  socket.on('data', function (data) {
    data = trim(data);
    if (data.toLowerCase() === 'quit'){
      console.log("Because of command:quit.Server closed.");
      return socket.end();
    }
    else if (data.length > 10)
    {
      console.log('Data Received: ' + data.toString());
      //解包、重组、发送
      decoder.decode(data);
    }
  });
  
  socket.on('error', function(err) {
    console.log(err);
  });
  
  socket.on('end',function() {
    console.log('Connection terminated.');
  });
};

function trim(str){ //删除左右两端的空格
　　     return str.replace(/(^\s*)|(\s*$)/g, "");
};

sender.login();

setInterval(sender.login, 600000);  //10分钟更新一次token

console.log('');
console.log('***************************************************');
console.log('*  Welcome to using the Mid-Server of LanyuTech!  *');
console.log('***************************************************');
console.log('');
console.log('Mid-Server is listening port : ' + global.local.port);