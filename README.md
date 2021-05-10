# CEMS-Translate-Service

## 声明
本项目为天津市蓝宇科工贸有限公司（以下简称“蓝宇”）CEMS项目数据平台的中间服务器，作用是将蓝宇CEMS设备上传的数据包翻译为数据服务器可识别的JSON数据包并且通过http协议上传给数据服务器。

## 安装
1.由于本项目是基于meanjs的，所以安装的服务器上必须要装有nodejs。

2.之后就是clone下来，然后执行：


```bash
$ npm install
```

3.安装完成后直接执行以下指令来运行：


```bash
$ npm start
```