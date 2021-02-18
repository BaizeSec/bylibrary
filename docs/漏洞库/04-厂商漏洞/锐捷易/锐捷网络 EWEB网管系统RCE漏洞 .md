php

    查询用户是否上线了
    $userip = @$_POST['ip'];
    $usermac = @$_POST['mac'];
    
    if (!$userip  !$usermac) {
        exit;
    }
     判断该用户是否已经放行 
     验证IP参数是否合法。以修复漏洞
    if(filter_var($userip, FILTER_VALIDATE_IP)){
        $cmd = 'sbinapp_auth_hook.elf -f ' . $userip;
        $res = exec($cmd, $out, $status);
         如果已经上线成功 
        if (strstr($out[0], status1)) {
            echo 'true';
        }
    }else {
        echo hacker fuck u;
    }
