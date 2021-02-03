#### 漏洞详情： ####
漏洞位置：files/content.php

    <div class="manageinfo">
    <ul>
    <div class="lou">回复 #<?php echo $pinglun['id']?> 楼</div>
    <?php 
    $query2 = "SELECT * FROM manage";
    $resul2 = mysql_query($query2) or die('SQL语句有误：'.mysql_error());
    $manage2 = mysql_fetch_array($resul2);
    if ($manage2['img']==""){
    $touxiang="images/manage.jpg";
    } else{
    $touxiang=$manage2['img'];  
    }
    ?>
    <img src="<?php echo $touxiang?>">
    <strong><?php echo $manage2['name']?><span>认证站长</span></strong>
    <li>位置：<a><?php echo $pinglun['rip']?></a></li>
    <li>时间：<a><?php echo tranTime(strtotime($pinglun['rdate']))?></a></li>
    <li>来自：<a><?php echo $pinglun['rshebei']?></a></li>
    </ul>
    </div>

这里是从$pinglun这个变量中取出其中的信息，随后插入存储信息的interaction表

在/files/submit.php中将content内容给过滤。

    $content=addslashes(strip_tags($content));  //过滤HTML
在评论处可以提交昵称、邮箱、网址、评论内容，但是显示评论和留言的地方有昵称，所以只有昵称处有存储型XSS。

### 参考链接 ###
https://xz.aliyun.com/t/7629