#### 漏洞详情： ####
漏洞出现在`/ucenter/repass.php`第1-44行:

    <?php 
    include('../system/inc.php');
    if(isset($_SESSION['user_name'])){
    header('location:index.php');
    };
    
    if(isset($_POST['submit'])){
    $username = stripslashes(trim($_POST['name']));
    $email = trim($_POST['email']);
    // 检测用户名是否存在
    $query = mysql_query("select u_id from mkcms_user where u_name='$username' and u_email='$email'");
    if(!! $row = mysql_fetch_array($query)){
    $_data['u_password'] = md5(123456);
    $sql = 'update mkcms_user set '.arrtoupdate($_data).' where u_name="'.$username.'"';
    if (mysql_query($sql)) {
    
    $token =$row['u_question'];
    include("emailconfig.php");
    //创建$smtp对象 这里面的一个true是表示使用身份验证,否则不使用身份验证.
    $smtp = new Smtp($MailServer, $MailPort, $smtpuser, $smtppass, true); 
    $smtp->debug = false; 
    $mailType = "HTML"; //信件类型，文本:text；网页：HTML
    $email = $email;  //收件人邮箱
    $emailTitle = "".$mkcms_name."用户找回密码"; //邮件主题
    $emailBody = "亲爱的".$username."：<br/>感谢您在我站注册帐号。<br/>您的初始密码为123456<br/>如果此次找回密码请求非你本人所发，请忽略本邮件。<br/><p style='text-align:right'>-------- ".$mkcms_name." 敬上</p>";
    
    // sendmail方法
    // 参数1是收件人邮箱
    // 参数2是发件人邮箱
    // 参数3是主题（标题）
    // 参数4是邮件主题（标题）
    // 参数4是邮件内容  参数是内容类型文本:text 网页:HTML
    $rs = $smtp->sendmail($email, $smtpMail, $emailTitle, $emailBody, $mailType);
    if($rs==true){
    echo '<script>alert("请登录到您的邮箱查看您的密码！");window.history.go(-1);</script>';
    }else{
    echo "找回密码失败";
    }
    
    }
    }
    }
    
    ?>
本质上来说此处是一个逻辑问题，程序未通过邮箱等验证是否为用户本身就直接先在第13-14行把用户密码重置为123456了，根本没管邮件发送成功没有。

![](KCMS5.0任意用户密码重置/20190223150934-f90753aa-3739-1.jpeg)

此处过滤了单引号，所以无法通过然后邮箱账号进行重置
### 参考链接 ###
https://xz.aliyun.com/t/4189