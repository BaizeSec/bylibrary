# Thinkphp 3.2.3 缓存漏洞

## 一、漏洞简介

## 二、漏洞影响

Thinkphp 3.2.3

## 三、复现过程

### 漏洞分析

- 直接跟进到`/Library/Think/Cache/File.class.php`文件，看到set方法：

  ```
  /**
       * 写入缓存
       * @access public
       * @param string $name 缓存变量名
       * @param mixed $value  存储数据
       * @param int $expire  有效时间 0为永久
       * @return boolean
       */
      public function set($name,$value,$expire=null) {
          N('cache_write',1);
          if(is_null($expire)) {
              $expire =  $this->options['expire'];
          }
          $filename   =   $this->filename($name);
          $data   =   serialize($value);
          if( C('DATA_CACHE_COMPRESS') && function_exists('gzcompress')) {
              //数据压缩
              $data   =   gzcompress($data,3);
          }
          if(C('DATA_CACHE_CHECK')) {//开启数据校验
              $check  =  md5($data);
          }else {
              $check  =  '';
          }
          $data    = "<?php\n//".sprintf('%012d',$expire).$check.$data."\n?>";
          //data参数经过序列化，直接被写到文件内。
  
          $result  =   file_put_contents($filename,$data);
          if($result) {
              if($this->options['length']>0) {
                  // 记录缓存队列
                  $this->queue($name);
              }
              clearstatcache();
              return true;
          }else {
              return false;
          }
      }
  ```

- 写一个调用缓存函数的的方法，运行一下。看看写进去什么

  ```
  <?php
  namespace Home\Controller;
  use Think\Controller;
  class IndexController extends Controller {
  
      public function index(){
          $a=I('post.a3');
          S('name',$a);
      }
  }
  ```

- 在set方法下断点，访问 `http://www.0-sec.org/index.php/Home/Index/index.html` ，post数据：`a3=aaaa`