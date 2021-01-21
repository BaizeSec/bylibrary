---
title: 'fastadmin最新版前台getshell'
date: Sat, 26 Sep 2020 10:47:11 +0000
draft: false
tags: ['白阁-漏洞库']
---

前提：开启⽤户注册 漏洞原因： 直接将$name参数带⼊到fetch函数,fetch函数是ThinkPHP解析模版的函数，⾥⾯⽀持原⽣PHP，所以造成 RCE，直接上传成功就可以调⽤这个点解析。 [![](./fastadmin最新版前台getshell/wp_editor_md_72ca25f1b0ce3e4238c54ef9675dd3ea.jpg)](./fastadmin最新版前台getshell/wp_editor_md_72ca25f1b0ce3e4238c54ef9675dd3ea.jpg) Php代玛可以和标益在模板⽂件中漏合使⽤,可以在模板⽂件⾥⾯千写任意的P句代码,包括下⾯两种⽅式: 使⽤php标签 例如: [![](./fastadmin最新版前台getshell/wp_editor_md_f48bfecceeb50771968293f3474a730f.jpg)](./fastadmin最新版前台getshell/wp_editor_md_f48bfecceeb50771968293f3474a730f.jpg) 

我们建这需要使⽤PHP代的时候尽量采⽤hp签,因为原⽣的PHP法可能会被配置禁⽤⽽导致解析错误. 使⽤原⽣php代码 [![](./fastadmin最新版前台getshell/wp_editor_md_ad18302ba648c8dcb1713c5e2270cf48.jpg)](./fastadmin最新版前台getshell/wp_editor_md_ad18302ba648c8dcb1713c5e2270cf48.jpg) 

注意:php标签或者h代码⾥⾯就不能再使⽤标签(包普通标盗和么标)了,因此下⾯的⼏种⽅式都是⽆效的; [![](./fastadmin最新版前台getshell/wp_editor_md_852198f8abbd64a68a88dde090bc591f.jpg)](./fastadmin最新版前台getshell/wp_editor_md_852198f8abbd64a68a88dde090bc591f.jpg)