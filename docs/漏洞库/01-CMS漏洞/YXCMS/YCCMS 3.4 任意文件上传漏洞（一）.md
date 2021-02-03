### 一、漏洞简介 ###

### 二、漏洞影响

YCCMS 3.4

### 三、复现过程 
在不需要登录的情况上传成功
![](YCCMS3.4任意文件上传漏洞（一）/20200510144621-f54ef75c-9289-1.png)
定位到漏洞位置： controller\CallAction.class.php

    public function upLoad() {
    if (isset($_POST['send'])) {
    $_logoupload = new LogoUpload('pic',$_POST['MAX_FILE_SIZE']);
    $_path = $_logoupload->getPath();
    $_img = new Image($_path);
    $_img->xhImg(960,0);
    $_img->out();
    //echo $_path;
    $_logoupload->alertOpenerClose('图片上传成功！','..'.$_path);
    } else {
    exit('警告：文件过大或者其他未知错误导致浏览器崩溃！');
    }
    }

然后跟进到类LogoUpload ,位于public\class\LogoUpload.class.php，上传首要关注上传是是否允许上传非图片格式的文件


    private function checkType() {
    if (!in_array($this->type,$this->typeArr)) {
    Tool::alertBack('警告：LOGO图片必须是PNG格式！');
    }
    }
    
    private $typeArr = array('image/png','image/x-png');//类型合集
    

根据Content-Type的值来判断是否是图片格式，只要Content-Type是这两种类型就可以，那直接伪造Content-Type就可以了
![](YCCMS3.4任意文件上传漏洞（一）/20200510144939-6b7866c0-928a-1.png)

### 参考链接 ###

https://xz.aliyun.com/t/7748#toc-4