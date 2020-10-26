#!/usr/bin/env python
# _*_ coding:utf-8 _*_




def scripts(url,command):
    processor = Idea()
    if "gov.cn" in url or "edu.cn" in url:
        print("[- ]存在敏感域名，停止检测，请使用其他工具或自行手工检测,抱歉")
        return False
    processed = processor.process(url,command)


class Idea(object):
    PLUGINS = {}

    def process(self,url,command,plugins=()):
        if plugins is ():
            for plugin_name in self.PLUGINS.keys():
                try:
                    print("[*]  开始检测模块",plugin_name)
                    self.PLUGINS[plugin_name]().process(url,command,20)
                except Exception as e:
                    print(e)
                    print ("[-]{} 检测失败，请检查网络连接或目标是否存活".format(plugin_name))
        else:
            for plugin_name in plugins:
                try:
                    print("[*]开始检测 ",self.PLUGINS[plugin_name])
                    self.PLUGINS[plugin_name]().process(url,command)
                except:
                    print ("[-]{}检测失败，请检查网络连接或目标是否存活".format(self.PLUGINS[plugin_name]))
        return

    @classmethod
    def plugin_register(cls, plugin_name):
        def wrapper(plugin):
            cls.PLUGINS.update({plugin_name:plugin})
            return plugin
        return wrapper
