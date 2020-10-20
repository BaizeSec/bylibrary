# Thinkphp 5.0.24 mysql账号密码泄露

## 一、漏洞简介

Thinkphp 5.0.24 在开启debug的模式下，可通过高线程爆破mysql导致tp报错泄露mysql账号密码。

## 二、漏洞影响

Thinkphp 5.0.24

## 三、复现过程

利用条件：

- 开启debug模式
- mysql开启外连

## 修复方案

- 关闭tp5 debug选项（推荐）
- 注释掉thinkphp\library\think\db\Connection.php 中305行附近的throw $e;（不推荐）

## 参考链接

> https://zhuanlan.zhihu.com/p/131414060