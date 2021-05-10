var http = require('http'),
    path = require('path'),
    global = require(path.resolve('./assets/global'));
  
exports.send = function (data) {
  var send = JSON.stringify(data);
  
  var options = {  
    host : global.remote.host,
    port : global.remote.port,
    path : global.remote.uploadPath,
    method: 'POST',
    headers: {  
      'Content-Type': 'application/json;charset=UTF-8'
    }
  };
    
  var req = http.request(options, function (res) {
    //console.log('STATUS: ' + res.statusCode);  
    //console.log('HEADERS: ' + JSON.stringify(res.headers));  
    res.setEncoding('utf8'); 

    var str = '';
    res.on('data', function (chunk) {
      //console.log('BODY: ' + chunk);
      str += chunk;
    });
    
    res.on('end', function (chunk) {
      console.log(str);
      var re = JSON.parse(str);
      if (re.token) login ();
    });

    res.on('error', function (e) {
      console.log('获取结果错误：' + e.message);
    });
  });  
    
  req.on('error', function (e) { 
    console.log('Post请求发送失败: ' + e.message);  
  });  
    
  // write data to request body
  req.write(send);  
    
  req.end();
}

exports.login = login;

function login () {
  var options = {  
    host : global.remote.host,
    port : global.remote.port,
    path : global.remote.loginPath,
    method: 'POST',
    headers: {  
      'Content-Type': 'application/json;charset=UTF-8'
    }
  };

  var req = http.request(options, function (res) {  
    //console.log('STATUS: ' + res.statusCode);  
    //console.log('HEADERS: ' + JSON.stringify(res.headers));  
    res.setEncoding('utf8'); 

    var str = '';
    res.on('data', function (chunk) {
      //console.log('BODY: ' + chunk);
      str += chunk;
    });
    
    res.on('end', function (chunk) {
      console.log(str);
      var re = JSON.parse(str);
      global.token = re.token;
    });

    res.on('error', function (e) {
      console.log('获取结果错误：' + e.message);
    });
  });  
    
  req.on('error', function (e) { 
    console.log('Post请求发送失败: ' + e.message);  
  });  
    
  // write data to request body
  req.write(JSON.stringify({userName : global.login.userName, passWord : global.login.passWord}));
    
  req.end();
}