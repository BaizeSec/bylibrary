### 一、漏洞简介 ###

### 二、漏洞影响
YCCMS 3.4
### 三、复现过程 ###
![](YCCMS3.4任意文件上传漏洞（二）/20200510145117-a5da8b22-928a-1.png)
在不需要登录的情况下可以看到已经上传成功，上传地址为E:/phpstudy/WWW/yccms/uploads/20200509133351770.php
定位漏洞位置为controller\CallAction.class.php中的xhUp函数

    public function xhUp() {
    if (isset($_GET['type'])) {
    $_fileupload = new FileUpload('filedata',10);
    $_err=$_fileupload->checkError();
    $_path = $_fileupload->getPath();
    $_msg="'..$_path'";
    $_img = new Image($_path);
    $_img->xhImg(650,0);
    $_img->out();
    echo "{'err':'".$_err."','msg':".$_msg."}";
    exit();
    } else {
    Tool::alertBack('警告：由于非法操作导致上传失败！');
    }
    }
跟进到类FileUpload， 位于public\class\FileUpload.class.php，然后看到同样也是检查的传入的Content-Type的值

    private function checkType() {
    if (!in_array($this->type,$this->typeArr)) {
    Tool::alertBack('警告：不合法的上传类型！');
    }
    }
    
    private $typeArr = 
    array('image/jpeg','image/pjpeg','image/png','image/x-png','image/gif');


### 参考链接 ###
https://xz.aliyun.com/t/7748#toc-4