### 一、漏洞简介 ###

### 二、漏洞影响###
YCCMS 3.4

### 三、复现过程 ###
首先来看一下漏洞利用过程，在未登录的情况下构造url,只需要更改username password notpassword的值即可更改数据库中admin账号的相关信息
![](YCCMS3.4未授权更改管理员账号密码/20200510141045-fc74068a-9284-1.png)
去数据库中查看发现已经更改了账号密码

![](YCCMS3.4未授权更改管理员账号密码/20200510141951-41f6fa04-9286-1.png)
根据url来定位一下漏洞函数，函数位于controller\AdminAction.class.php中的update函数

    public function update(){
    if(isset($_POST['send'])){
    if(validate::isNullString($_POST['username'])) Tool::t_back('用户名不能为空','?a=admin&m=update');
    if(validate::isNullString($_POST['password'])) Tool::t_back('密码不能为空!','?a=admin&m=update');
    if(!(validate::checkStrEquals($_POST['password'], $_POST['notpassword']))) Tool::t_back('两次密码不一致!','?a=admin&m=update');
    $this->_model->username=$_POST['username'];
    $this->_model->password=sha1($_POST['password']);
    $_edit=$this->_model->editAdmin();
    if($_edit){
    tool::layer_alert('密码修改成功!','?a=admin&m=update',6);
    }else{
    tool::layer_alert('密码未修改!','?a=admin&m=update',6);
    }
    }
    
    $this->_tpl->assign('admin', $_SESSION['admin']);
    $this->_tpl->display('admin/public/update.tpl');
    }
可以看到前面都是一些判断，重点关注下editAdmin()函数，该函数位于model\AdminModel.class.php
    
    public function editAdmin(){
    $_sql="UPDATE
    my_admin
    SET
    username='$this->username',
    password='$this->password'
    WHERE
    id=1
    LIMIT 1";
    return parent::update($_sql);
    }
该函数的父类为Model, 位于model\Model.class.php，看一下update函数

    protected function update($_sql){
    return $this->execute($_sql)->rowCount();
    }
调用execute函数去执行sql语句

    protected function execute($_sql){
    try{
    $_stmt=$this->_db->prepare($_sql);
    $_stmt->execute();
    }catch (PDOException $e){
    exit('SQL语句:'.$_sql.'<br />错误信息:'.$e->getMessage());
    }
    return $_stmt;
    }
    }
这一系列的操作主要是用来生成SQL语句然后执行SQL语句，editAdmin函数直接把传进来的username password拼接到sql语句中，然后去更新相关表中id=1的数据，这也就造成了任意更改管理员账号密码

### 参考链接 ###

https://xz.aliyun.com/t/7748#toc-2