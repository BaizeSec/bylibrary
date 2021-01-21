# WordPress评论插件wpDiscuz任意文件上传漏洞

漏洞描述
wordpress评论插件wpDiscuz导致的任意文件上传漏洞，没有安装wpDiscuz插件是没有此漏洞的。
影响范围
wpDiscuz v7.0.0-v7.0.4
环境搭建
https://cn.wordpress.org/latest-zh_CN.zip
https://downloads.wordpress.org/plugin/wpdiscuz.7.0.3.zip
管理员登录，在插件模块安装wpdiscuz插件，即可看到评论界面变成这个样子，点击图片的小标可上传图片。
![img](wordpress%E8%AF%84%E8%AE%BA%E6%8F%92%E4%BB%B6wpDiscuz%E4%BB%BB%E6%84%8F%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E6%BC%8F%E6%B4%9E/wp_editor_md_c812f626a0e2b2236eba98f0dbc44e62.jpg)

上传一句话木马，修改为GTF头
![img](wordpress%E8%AF%84%E8%AE%BA%E6%8F%92%E4%BB%B6wpDiscuz%E4%BB%BB%E6%84%8F%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E6%BC%8F%E6%B4%9E/wp_editor_md_26cd0f7846ca4dc67068c848dedd9e9b.jpg)
蚁剑连接成功
![img](wordpress%E8%AF%84%E8%AE%BA%E6%8F%92%E4%BB%B6wpDiscuz%E4%BB%BB%E6%84%8F%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E6%BC%8F%E6%B4%9E/wp_editor_md_93476dc9f2edfe4c3d72c963f7607175.jpg)