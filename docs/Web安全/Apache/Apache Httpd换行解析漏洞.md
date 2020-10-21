---
title: 'Apache Httpd换行解析漏洞'
date: Mon, 21 Sep 2020 17:26:57 +0000
draft: false
tags: ['白阁-漏洞库']
---

### 漏洞影响

Apache httpd2.4.0~2.4.29

### 漏洞验证

1.a.php文件 内容： [![](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_789ed57196f236028425896940d24107.jpg)](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_789ed57196f236028425896940d24107.jpg) 2.上传a.php并抓包 [![](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_eb6d405edf2b90e866b3eca737c0d36d.jpg)](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_eb6d405edf2b90e866b3eca737c0d36d.jpg) 3.修改a.php HEX的后面加上0a后放包 [![](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_13204794780e082d70014e677cda19b1.jpg)](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_13204794780e082d70014e677cda19b1.jpg) 4.文件上传成功 [![](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_ec9983dd6cd541af8b4b5b75281d8afd.jpg)](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_ec9983dd6cd541af8b4b5b75281d8afd.jpg) 5.访问a.php,后缀加上%0A [![](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_eb68fd10eee4df557a52570a3084ad04.jpg)](https://www.bylibrary.cn/wp-content/uploads/2020/09/wp_editor_md_eb68fd10eee4df557a52570a3084ad04.jpg)