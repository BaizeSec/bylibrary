define("pages/voice_component.js",["biz_common/dom/event.js","biz_common/tmpl.js","pages/music_player.js","pages/player_adaptor.js","biz_common/dom/class.js","pages/report.js","biz_common/utils/monitor.js","pages/music_report_conf.js","pages/player_tips.js","biz_wap/jsapi/leaveReport.js","biz_wap/utils/mmversion.js","biz_wap/utils/ajax.js","biz_wap/utils/openUrl.js","pages/qqmusic_ctrl.js","pages/kugoumusic_ctrl.js"],function(e){
"use strict";
function t(){
j.hasInit||(n(),r(),s(),j.hasInit=!0);
}
function a(e){
t(),this._o={
protocal:"",
wxIndex:0,
type:0,
comment_id:"",
src:"",
jsapi2Src:"",
mid:"",
songId:"",
otherid:"",
albumid:"",
jumpurlkey:"",
autoPlay:!1,
duration:0,
needVioceMutex:!0,
appPlay:!0,
title:"",
allowPause:!1,
singer:"",
epname:"",
coverImgUrl:"",
webUrl:[location.protocol,"//mp.weixin.qq.com/s?referFrom=#referFrom#&songid=#songId#&__biz=",window.biz,"&mid=",window.mid,"&idx=",window.idx,"&sn=",window.sn,"#wechat_redirect"].join(""),
musicbar_url:"",
playingCss:"",
pauseCss:"",
playCssDom:"",
playArea:"",
progress:"",
detailUrl:"",
detailArea:"",
fileSize:0,
playtimeDom:"",
loadingDom:"",
bufferDom:"",
playdotDom:"",
seekRange:"",
seekContainer:""
},this._init(e),j.allComponent.push(this);
}
function o(e,t,a,o){
j.num++,t.musicSupport=j.musicSupport,t.show_not_support=!1,j.musicSupport||1!=j.num||(t.show_not_support=!0);
var r=document.createElement("div"),n="";
if(n=y.tmpl(e,t),r.innerHTML=n,o===!0)a.appendChild(r.children[0]);else{
var i=a.parentNode;
if(!i)return;
i.lastChild===a?i.appendChild(r.children[0]):i.insertBefore(r.children[0],a.nextSibling);
}
}
function r(){
j.hasInit||f.inQMClient&&i("QMClient_pv",1);
}
function n(){
window.reportMid=[],window.reportVoiceid=[];
for(var e in w)if(w.hasOwnProperty(e)){
var t=w[e],a=t.split("_");
j.reportData2[e]={
id:a[0],
key:a[1],
count:0
};
}
}
function i(e,t){
j.reportData2[e]&&(t=t||1,j.reportData2[e].count+=t,j.debug&&console.log("addpv:"+e+" count:"+j.reportData2[e].count));
}
function s(){
b.gtVersion("7.0.6")?x.addSpecificReport("music_data",p):g.on(window,"unload",function(){
for(var e=p(),t=JSON.parse(e.report_list),a=0;a<t.length;a++)I({
type:"POST",
url:"/mp/musicreport?#wechat_redirect",
timeout:2e4,
async:!0,
data:t[a]
});
});
}
function p(){
m.triggerUnloadPlaying(),l();
for(var e,t={},a=0,o=j.allComponent.length;o>a;a++){
var r=j.allComponent[a];
r.player&&"function"==typeof r.player.getPlayTotalTime&&(j.reportData[r._o.type].play_last_time[r._g.posIndex]=parseInt(1e3*r.player.getPlayTotalTime())),
"number"!=typeof r._status||1!==r._status&&4!==r._status||(e=r._o.songId);
}
e&&(t.current_musicid=e);
var i=[];
for(var a in j.reportData)i=i.concat(D.musicreport({
data:j.reportData[a]
}));
t.report_list=JSON.stringify(i),n();
for(var a=0,o=j.allComponent.length;o>a;a++){
var r=j.allComponent[a];
r&&"function"==typeof r._initReportData&&r._initReportData(),r.player&&"function"==typeof r.player.resetPlayTotalTime&&r.player.resetPlayTotalTime();
}
return t;
}
function l(){
for(var e in j.reportData2)if(j.reportData2.hasOwnProperty(e)){
var t=j.reportData2[e];
t.count>0&&v.setSum(t.id,t.key,t.count);
}
v.send();
}
function c(e){
return new a(e);
}
function d(e){
if(isNaN(e))return"00:00";
e=Math.floor(e);
var t=Math.floor(e/3600),a=Math.floor((e-3600*t)/60),o=e-3600*t-60*a;
return 0!=t?(10>t&&(t="0"+t),t+=":"):t="",10>a&&(a="0"+a),10>o&&(o="0"+o),t+a+":"+o;
}
function u(e){
return e=(e||"").replace(/&#96;/g,"`").replace(/&#61;/g,"=").replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");
}
function _(e){
return e=(e||"").replace(/&/g,"&amp;").replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/=/g,"&#61;").replace(/`/g,"&#96;");
}
var g=e("biz_common/dom/event.js"),y=e("biz_common/tmpl.js"),m=e("pages/music_player.js"),f=e("pages/player_adaptor.js"),h=e("biz_common/dom/class.js"),D=e("pages/report.js"),v=e("biz_common/utils/monitor.js"),w=e("pages/music_report_conf.js"),k=e("pages/player_tips.js"),x=e("biz_wap/jsapi/leaveReport.js"),b=e("biz_wap/utils/mmversion.js"),I=e("biz_wap/utils/ajax.js"),C=e("biz_wap/utils/openUrl.js").openUrlWithExtraWebview,j={
allComponent:[],
hasInit:!1,
reportId:"28306",
musicSupport:m.getSurportType(),
debug:location.href.indexOf("vconsole=1")>0||document.cookie&&document.cookie.indexOf("vconsole_open=1")>-1?!0:!1,
reportData:{},
posIndex:{},
num:0,
reportData2:{},
adapter:{
m:e("pages/qqmusic_ctrl.js"),
k:e("pages/kugoumusic_ctrl.js")
}
};
return a.prototype._init=function(e){
this._extend(e),this._g={
posIndex:void 0,
tag:"",
canDragBar:!1,
barDraging:!1,
canGoDetail:!0
},5==this._o.type||6==this._o.type||9==this._o.type?this._g.tag="k":this._o.type>=2&&this._o.type<=4?this._g.tag="v":7==this._o.type?this._g.tag="a":(0==this._o.type||1==this._o.type||8==this._o.type)&&(this._g.tag="m"),
this._initData(),this._initQQmusicLyric(),this._initReportData(),this._initPlayer();
},a.prototype._initData=function(){},a.prototype._initQQmusicLyric=function(){
var e=this._o,t=this._g;
e.webUrl="m"==t.tag?e.webUrl.replace("#songId#",e.songId||"").replace("#referFrom#","music.qq.com"):e.webUrl.replace("#songId#","").replace("#referFrom#","");
},a.prototype._initReportData=function(){
var e=this._o,t=this._g;
"v"==t.tag?window.reportVoiceid.push(e.songId):"m"==t.tag&&window.reportMid.push(e.songId),
"undefined"==typeof j.reportData[e.type]&&(j.reportData[e.type]=D.getMusicReportData(e),
j.posIndex[e.type]=0),"undefined"==typeof t.posIndex&&(t.posIndex=j.posIndex[e.type]++);
var a=j.reportData[e.type];
a.musicid[t.posIndex]=e.songId,a.commentid[t.posIndex]=e.comment_id,a.hasended[t.posIndex]=0,
a.mtitle[t.posIndex]=e.title,a.detail_click[t.posIndex]=0,a.duration2[t.posIndex]=parseInt(1e3*e.duration),
a.errorcode[t.posIndex]=0,a.play_duration2[t.posIndex]=0,a.seek[t.posIndex]=0,a.seek_position[t.posIndex]=[],
a.play_last_time[t.posIndex]=0,a.local_time[t.posIndex]=0,a.seek_loaded[t.posIndex]=[];
},a.prototype._initPlayer=function(){
if(j.musicSupport){
var e=this,t=this._o,a=this._g.tag;
t.onStatusChange=this._statusChangeCallBack(),t.onTimeupdate=this._timeupdateCallBack(),
t.onError=this._errorCallBack(),t.onUpdateSeekRange=this._onUpdateSeekRange(),t.onAndroidForceH5=function(){
i("force_h5",1);
},t.onH5Begin2Play=function(){
i(a+"_pv",1),i(a+"_h5_pv",1);
},t.onH5Error=function(t,o){
i(a+"_h5_err_total",1),i(a+"_h5_err_"+o.code,1),e._reportH5Error({
type:1,
code:o.code
});
},t.onJsapi1Begin2Play=function(){
i(a+"_pv",1),i(a+"_wx_pv",1),i(a+"_wx_pv_1",1);
},t.onJsapi2Begin2Play=function(e,o){
i(a+"_pv",1),i(a+"_wx_pv",1),i(a+"_wx_pv_2",1),t.jsapi2Src&&t.jsapi2Src!=t.src&&i("aac_pv",1),
t.musicPlayerOnJsapi2Begin2Play&&t.musicPlayerOnJsapi2Begin2Play(o);
},t.onJsapi2PlaySuccess=function(e,a){
t.musicPlayerOnJsapi2PlaySuccess&&t.musicPlayerOnJsapi2PlaySuccess(a);
},t.onJsapi2Begin2PlayErr=function(){
if(i(a+"_wx_err_1",1),t.jsapi2Src&&t.jsapi2Src!=t.src){
var e="acc_start_error;type:#type#;uin:"+(window.user_uin||"")+";playurl:"+t.jsapi2Src+";pageurl:"+location.href;
m.isAndroid?(D.logReport("",e.replace("#type#","android"),"ajax"),i("android_aac_err_1",1)):(D.logReport("",e.replace("#type#","ios"),"ajax"),
i("ios_aac_err_1",1));
}
},t.onJsapi2PlayingErr=function(){
if(i(a+"_wx_err_2",1),t.jsapi2Src&&t.jsapi2Src!=t.src){
var e="acc_ing_error;type:#type#;uin:"+(window.user_uin||"")+";playurl:"+t.jsapi2Src+";pageurl:"+location.href;
m.isAndroid?(D.logReport("",e.replace("#type#","android"),"ajax"),i("android_aac_err_2",1)):(D.logReport("",e.replace("#type#","ios"),"ajax"),
i("ios_aac_err_2",1));
}
},t.onJsapi2PlayingStop=function(){
var e=a+"_stoped_";
e+=m.isAndroid?"android":"ios",i(e,1);
},t.onJsapi2PlayingPause=function(){
var e=a+"_paused_";
e+=m.isAndroid?"android":"ios",i(e,1);
},t.onSeekErr=function(){
if(i(a+"_seek_err",1),t.jsapi2Src&&t.jsapi2Src!=t.src){
var e="acc_seek_error;type:#type#;uin:"+(window.user_uin||"")+";playurl:"+t.jsapi2Src+";pageurl:"+location.href;
m.isAndroid?(D.logReport("",e.replace("#type#","android"),"ajax"),i("android_aac_err_3",1)):(D.logReport("",e.replace("#type#","ios"),"ajax"),
i("ios_aac_err_3",1));
}
},t.onUnloadPlaying=function(){
i(a+"_unload_wx_pv",1);
},t.onQMClientPlay=function(){
i("QMClient_play",1);
},t.onSeekNeed2Load=function(){
if(e.player&&e.player.surportSeekRange()&&t.playdotDom){
var a=j.reportData[e._o.type],o=a.seek_position[e._g.posIndex].length;
o>0&&(a.seek_loaded[e._g.posIndex][o-1]=1);
}
},t.onSeekNotNeed2Load=function(){
if(e.player&&e.player.surportSeekRange()&&t.playdotDom){
var a=j.reportData[e._o.type],o=a.seek_position[e._g.posIndex].length;
o>0&&(a.seek_loaded[e._g.posIndex][o-1]=0);
}
},f.create(this._o,{
callback:function(t){
e.player=t,e.afterCreatePlayer();
}
});
}
},a.prototype.afterCreatePlayer=function(){
this._playEvent();
},a.prototype.isInSeekrang=function(e){
var t=this._o.seekRange;
if(!t)return!1;
if(t===e)return!0;
for(var a=t.getElementsByTagName("*"),o=0,r=a.length;r>o;o++)if(a[o]===e)return!0;
return!1;
},a.prototype._playEvent=function(){
var e=this,t=this._o,a=this._g;
if(t.detailUrl&&t.detailArea&&g.on(t.detailArea,"click",function(o){
if(!a.barDraging&&a.canGoDetail){
var r=o.target||o.srcElement;
r&&e.isInSeekrang(r)||("v"==a.tag?(j.reportData[t.type].detail_click[a.posIndex]=1,
window.__second_open__?C(t.detailUrl):window.location.href=t.detailUrl):("m"==a.tag||"k"==a.tag)&&j.adapter[a.tag].getPlayUrl(t,{
callback:function(e){
e.canplay?(j.reportData[t.type].detail_click[a.posIndex]=1,window.__second_open__?C(t.detailUrl):window.location.href=t.detailUrl):e.msg&&new k({
msg:e.msg
});
}
}));
}
}),j.musicSupport){
var o=0,r=4,n=5;
switch(1*t.type){
case 0:
o=1;
break;

case 1:
o=13;
break;

case 8:
o=14;
break;

case 2:
o=3;
break;

case 3:
o=6;
break;

case 4:
o=7;
break;

case 5:
o=10;
break;

case 6:
o=15;
break;

case 7:
o=11;
break;

case 9:
o=12;
}
var i="";
i=t.allowPause?t.pauseCss||t.playingCss:t.playingCss,g.tap(t.playArea,function(){
return console.log("click playArea",h.hasClass(t.playCssDom,i)),h.hasClass(t.playCssDom,i)?(t.allowPause?e.player.pause():e.player.stop(),
D.report({
type:o,
comment_id:t.comment_id,
voiceid:t.songId,
action:n
})):"v"==a.tag||"a"==a.tag?e._playMusic(o,r):j.adapter[a.tag].getPlayUrl(t,{
callback:function(n){
n.canplay&&n.play_url?(n.duration&&(t.duration=n.duration,e.player.setDuration(t.duration),
j.reportData[t.type].duration2[a.posIndex]=parseInt(1e3*t.duration)),e.player.setSrc(n.play_url),
8!=n.status||n.in_cache?e._playMusic(o,r):new k({
msg:"该音乐为付费音乐，当前为你播放试听片段",
onClick:function(){
e._playMusic(o,r);
}
})):n.msg&&new k({
msg:n.msg
});
}
}),!1;
}),e._dragEvent();
}
},a.prototype._dragEvent=function(){
var e=this,t=this._o,a=this._g,o=t.seekRange;
if(o){
var r=0,n=o,i=!1,s=window.__zoom||1;
for(1!=s&&(i=!0);n&&n!=document.body;)r+=i?n.offsetLeft*s:n.offsetLeft,"page-content"==n.id&&(i=!1),
n=n.offsetParent;
var p=e.player.getDuration();
a.seekData={
zoom:s,
offsetLeft:r,
duration:p,
rangeWidth:o.offsetWidth,
startTime:0,
dragTime:0,
downX:0,
moveX:0
},g.on(o,"mousedown",function(t){
a.canDragBar&&(e._pointerDownHandler({
x:t.pageX||t.clientX
}),t.preventDefault());
}),g.on(t.seekContainer,"mousemove",function(t){
a.canDragBar&&a.barDraging&&(e._pointerMoveHandler({
x:t.pageX||t.clientX
}),t.preventDefault(),t.stopPropagation());
}),g.on(document.body,"mouseup",function(t){
return a.canDragBar&&a.barDraging?(e._pointerUpHandler({
x:t.pageX||t.clientX
}),t.preventDefault(),t.stopPropagation(),!1):void 0;
}),g.on(o,"touchstart",function(t){
a.canDragBar&&(e._pointerDownHandler({
x:t.changedTouches[0].clientX
}),t.preventDefault());
}),g.on(o,"touchmove",function(t){
return a.canDragBar&&a.barDraging?(e._pointerMoveHandler({
x:t.changedTouches[0].clientX
}),t.preventDefault(),void t.stopPropagation()):void console.log("no can drag",a.canDragBar,a.barDraging);
}),g.on(o,"touchend",function(t){
return a.canDragBar&&a.barDraging?(e._pointerUpHandler({
x:t.changedTouches[0].clientX
}),t.preventDefault(),t.stopPropagation(),!1):void console.log("no can drag",a.canDragBar,a.barDraging);
});
}
},a.prototype._pointerDownHandler=function(e){
var t=this._g;
t.barDraging=!0,t.canGoDetail=!1,t.seekData.downX=e.x,t.seekData.startTime=this.player.getCurTime();
},a.prototype._pointerMoveHandler=function(e){
var t=this._g,a=t.seekData;
a.moveX=e.x;
var o=(a.moveX-a.offsetLeft)/a.zoom/a.rangeWidth;
o=Math.min(o,1),o=Math.max(o,0),a.dragTime=o*a.duration,a.dragTime!=a.startTime&&this._updateProgressBar(a.dragTime);
},a.prototype._pointerUpHandler=function(e){
var t=this._g,a=t.seekData;
a.dragTime||this._pointerMoveHandler({
x:e.x
}),console.log("up dragging",a.dragTime),t.barDraging=!1,this.player.seek(a.dragTime),
j.reportData[this._o.type].seek[t.posIndex]=1,j.reportData[this._o.type].seek_position[t.posIndex].push(parseInt(1e3*a.startTime)+","+parseInt(1e3*a.dragTime));
var o=j.reportData[this._o.type].seek_position[t.posIndex].length;
j.reportData[this._o.type].seek_loaded[t.posIndex][o-1]=0,t.seekData.startTime=0,
t.seekData.dragTime=0,t.seekData.downX=0,t.seekData.moveX=0,setTimeout(function(){
t.canGoDetail=!0;
},1e3);
},a.prototype._playMusic=function(e,t){
var a=this._o,o=this._g;
this.player.play(),j.reportData[a.type].hasended[o.posIndex]=1,0==j.reportData[a.type].local_time[o.posIndex]&&(j.reportData[a.type].local_time[o.posIndex]=parseInt(+new Date/1e3)),
D.report({
type:e,
comment_id:a.comment_id,
voiceid:a.songId,
action:t
});
},a.prototype._extend=function(e){
for(var t in e)this._o[t]=e[t];
},a.prototype._onUpdateSeekRange=function(){
var e=this,t=e._o,a=e._g;
return function(e){
this.surportSeekRange()&&t.bufferDom&&t.playdotDom?(a.canDragBar=!0,t.playdotDom.style.display="block",
t.bufferDom.style.width=1*e+"%"):(a.canDragBar=!1,t.playdotDom&&(t.playdotDom.style.display="none"));
};
},a.prototype._statusChangeCallBack=function(){
var e=this;
return function(t,a){
e._status=a,e._updatePlayerCss(this,a),e._o.musicPlayerStatusChange&&e._o.musicPlayerStatusChange(a);
};
},a.prototype._timeupdateCallBack=function(){
var e=this,t=this._o,a=this._g;
return function(o,r){
e._updateProgress(r),0!=r&&(j.reportData[t.type].play_duration2[a.posIndex]=parseInt(1e3*r));
};
},a.prototype._errorCallBack=function(){
var e=this,t=this._o,a=this._g;
return function(o,r){
j.reportData[t.type].errorcode[a.posIndex]=r.code,e._updatePlayerCss(this,3);
};
},a.prototype._reportH5Error=function(e){
if("mp.weixin.qq.com"==location.host&&1==e.type||j.debug){
var t=["code:",e.code,";type:",this._o.type,";url:",window.location.href];
this.player&&t.push(";src:"+this.player.getSrc());
var a=new Image;
a.src=["https://badjs.weixinbridge.com/badjs?level=4&id=112&msg=",encodeURIComponent(t.join("")),"&uin=",window.uin||"","&from=",this._o.type].join("");
}
},a.prototype._updatePlayerCss=function(e,t){
!!j.debug&&console.log("status:"+t);
{
var a=this._o,o=a.playCssDom;
a.progress;
}
2==t?(h.removeClass(o,a.playingCss),a.pauseCss&&h.removeClass(o,a.pauseCss),a.playdotDom&&(e.surportSeekRange()?(a.playdotDom.style.display="block",
this._g.canDragBar=!0):(a.playdotDom.style.display="none",this._g.canDragBar=!1))):3==t?(h.removeClass(o,a.playingCss),
a.pauseCss&&h.removeClass(o,a.pauseCss),a.playdotDom&&(a.playdotDom.style.display="none",
this._g.canDragBar=!1),this._updateProgress(0)):(1==t||4==t)&&(a.allowPause?h.addClass(o,a.pauseCss||a.playingCss):h.addClass(o,a.playingCss),
a.playdotDom&&(e.surportSeekRange()?(a.playdotDom.style.display="block",this._g.canDragBar=!0):(a.playdotDom.style.display="none",
this._g.canDragBar=!1))),a.loadingDom&&(a.loadingDom.style.display=4==t?"block":"none");
},a.prototype._updateProgress=function(e){
return this._g.barDraging?void console.log("no dragging return",e):void this._updateProgressBar(e);
},a.prototype._updateProgressBar=function(e){
var t=this._o,a=this.player,o=a.getDuration();
if(o){
var r=this._countProgress(o,e);
t.progress&&(t.progress.style.width=r),t.playtimeDom&&e>=0&&(t.playtimeDom.innerHTML=d(e)),
t.playdotDom&&(t.playdotDom.style.left=r);
}
},a.prototype._countProgress=function(e,t){
return Math.min(t/e*100,100)+"%";
},a.prototype.destory=function(){
this.player&&this.player.destory();
},a.prototype.setOption=function(e){
e.duration&&(this._g.seekData.duration=e.duration),this._extend(e);
},a.prototype.setMusicPlayerOption=function(e){
e.duration&&this._g&&this._g.seekData&&(this._g.seekData.duration=e.duration),this.player&&this.player.setOption(e);
},a.prototype.getBackgroundAudioState=function(e){
return this.player.getBackgroundAudioState(e);
},{
init:c,
renderPlayer:o,
formatTime:d,
decodeStr:u,
encodeStr:_
};
});define("pages/qqmusic_tpl.html.js",[],function(){
return'<span id="qqmusic_main_<#=musicid#>_<#=posIndex#>" class="db qqmusic_area <#if(!musicSupport){#> unsupport<#}#>">\n    <span class="tc tips_global unsupport_tips" <#if(show_not_support!==true){#>style="display:none;"<#}#>>\n    当前浏览器不支持播放音乐或语音，请在微信或其他浏览器中播放    </span>\n    <span class="db qqmusic_wrp appmsg_card_context appmsg_card_active">\n        <span class="db qqmusic_bd">\n            <span id="qqmusic_play_<#=musicid#>_<#=posIndex#>" class="play_area">\n                <i class="icon_qqmusic_switch"></i>\n                <img src="<#=window.icon_qqmusic_default#>" alt="" class="pic_qqmusic_default">\n                <img src="<#=albumurl#>" data-autourl="<#=audiourl#>" data-musicid="<#=musicid#>" class="qqmusic_thumb" alt="">\n            </span>\n            <a id="qqmusic_home_<#=musicid#>_<#=posIndex#>" class="access_area">\n                <span class="qqmusic_songname"><#=music_name#></span>\n                <span class="qqmusic_singername"><#=singer#></span>\n                <span class="qqmusic_source"><img src="<#=musicIcon#>" alt=""></span>\n            </a>\n        </span>\n    </span>       \n</span>\n';
});define("new_video/ctl.js",["biz_wap/utils/ajax.js"],function(e){
"use strict";
var i;
if(parent==window)i=window;else try{
{
parent.window.location.href;
}
i=parent.window;
}catch(n){
i=window;
}
var t=i.user_uin,r=Math.floor(i.user_uin/100)%20;
t||(r=-1);
var a=function(){
return r>=0;
};
i.__webviewid||(i.__webviewid=+new Date+"_"+Math.ceil(1e3*Math.random()));
var d=function(){
var e=i.mid,n=i.idx,r="";
r=e&&n?e+"_"+n:"";
var a=i.__webviewid,d=[t,r,a].join("_");
return d;
},o=function(i){
if(20>r)try{
var n=i.vid||"",t={};
t.__biz=parent.window.biz||"",t.vid=n,t.clienttime=+new Date;
var o=parent.window.mid,s=parent.window.idx,w="";
w=o&&s?o+"_"+s:n,t.type="undefined"!=typeof i.type?i.type:o&&s?1:2,t.id=w,t.hit_bizuin=i.hit_bizuin||"",
t.hit_vid=i.hit_vid||"",t.webviewid=d(),t.step=i.step||0,t.orderid=i.orderid||0,
t.ad_source=i.ad_source||0,t.traceid=i.traceid||0,t.ext1=i.ext1||"",t.ext2=i.ext2||"",
t.r=Math.random(),t.devicetype=parent.window.devicetype,t.version=parent.window.clientversion,
t.is_gray=a()?1:0,t.mid=o||"",t.idx=s||"",t.url=parent.window.location.href,t.screen_num=i.screen_num||0,
t.screen_height=i.screen_height||0,t.ori_status=i.ori_status||3,t.fromid=i.fromid||0,
t.sessionid=window.sessionid||"",t.appmsg_scene=window.source||(window.cgiData?window.cgiData.scene:0)||0,
!t.appmsg_scene&&t.fromid?t.appmsg_scene=t.fromid:!t.fromid&&t.appmsg_scene&&(t.fromid=t.appmsg_scene),
t.total_range=i.total_range||0,t.current_range=i.current_range||0,t.duration=i.duration||0;
var _=e("biz_wap/utils/ajax.js");
_({
url:"/mp/ad_video_report?action=user_action",
type:"post",
data:t
});
}catch(c){}
};
return{
report:o,
getWebviewid:d,
showAd:a
};
});define("pages/utils.js",["appmsg/appmsg_report.js","biz_common/utils/emoji_data.js","pages/version4video.js","biz_wap/utils/mmversion.js","biz_wap/jsapi/core.js","biz_common/dom/event.js"],function(e){
"use strict";
var i=e("appmsg/appmsg_report.js"),o=e("biz_common/utils/emoji_data.js"),t=e("pages/version4video.js"),n=e("biz_wap/utils/mmversion.js"),a=e("biz_wap/jsapi/core.js"),r=e("biz_common/dom/event.js"),c={
inWechat:t.device.inWechat,
windowWechat:/WindowsWechat/i.test(navigator.userAgent),
macWechat:/wechat.*mac os/i.test(navigator.userAgent),
emojiImg:'<img src="https://res.wx.qq.com/mpres/zh_CN/htmledition/comm_htmledition/images/pic/common/pic_blank.gif" class="icon_emotion_single #style#" alt="#name#">',
emojiDataMap:{}
};
!function(){
for(var e=0,i=o.length;i>e;e++){
var t=o[e];
t.cn&&!c.emojiDataMap[t.cn]&&(c.emojiDataMap[t.cn]={
index:e
}),t.hk&&!c.emojiDataMap[t.hk]&&(c.emojiDataMap[t.hk]={
index:e
}),t.us&&!c.emojiDataMap[t.us]&&(c.emojiDataMap[t.us]={
index:e
});
}
}();
var s=function(e){
return/\[[^\[\]]+\]/.test(e)?e.replace(/\[[^\[\]]+\]/g,function(e){
if(c.emojiDataMap[e]&&o[c.emojiDataMap[e].index]){
var i=o[c.emojiDataMap[e].index];
return c.emojiImg.replace("#name#",e).replace("#style#",i.style);
}
return e;
}):e;
},m=function(e,i){
c.inWechat?c.windowWechat||c.macWechat?i===!0?window.parent.open(e):window.parent.location.href=e:a.invoke("openUrlWithExtraWebview",{
url:e,
openType:1
},function(o){
-1==o.err_msg.indexOf("ok")&&(i===!0?window.parent.open(e):window.parent.location.href=e);
}):i===!0?window.open(e):location.href=e;
},p=function(){
!c.inWechat||c.windowWechat||c.macWechat?window.close():a.invoke("closeWindow",function(e){
-1==e.err_msg.indexOf("ok")&&window.close();
});
},l=function(e){
return document.getElementById(e);
},u=function(e){
return e.replace(/^\s+|\s+$/g,"");
},d=function(e,i){
return(i||document).querySelector(e);
},f=function(e,i){
return(i||document).querySelectorAll(e);
},w=function(e){
var o=e.$container;
o&&!n.isInMiniProgram&&r.on(o,"tap",".js_go_profile",function(o){
var t=o.delegatedTarget;
if(t){
var n=t.getAttribute("data-biz")||e.biz||window.biz||"";
if("function"==typeof e.beforeGo2Profile&&e.beforeGo2Profile(t),1==window.isprofileblock)a.invoke("openUrlWithExtraWebview",{
url:"https://mp.weixin.qq.com/mp/profileblock?__biz="+n+"#wechat_redirect",
openType:1
},function(e){
-1==e.err_msg.indexOf("ok")&&(location.href="https://mp.weixin.qq.com/mp/profileblock?__biz="+n+"#wechat_redirect");
});else{
var r=t.getAttribute("data-scene")||e.profile_scene||"";
i.profileReport({
isnew:0,
title:e.title||"",
item_show_type:e.item_show_type||""
}),a.invoke("profile",{
username:e.user_name,
profileReportInfo:"",
scene:r
},function(){});
}
}
});
};
return{
jumpUrl:m,
closeWin:p,
trim:u,
getId:l,
qs:d,
qsAll:f,
inWechat:c.inWechat,
windowWechat:c.windowWechat,
macWechat:c.macWechat,
emojiFormat:s,
go2ProfileEvent:w
};
});define("appmsg/open_url_with_webview.js",["biz_wap/jsapi/core.js"],function(e){
"use strict";
var r=e("biz_wap/jsapi/core.js"),n=-1!=navigator.userAgent.indexOf("WindowsWechat"),i=function(e,i){
if(n)return location.href=e,!1;
i=i||{};
var o=i.sample||0;
o*=1e3;
var t=window.user_uin||0,s=0!==t&&Math.floor(t/100)%1e3<o;
return s?void r.invoke("openUrlWithExtraWebview",{
url:e,
openType:i.openType||1,
scene:i.scene||"",
bizUsername:i.user_name||""
},function(e){
e&&"openUrlWithExtraWebview:ok"===e.err_msg?i.resolve&&i.resolve():i.reject&&i.reject();
}):void(i.reject&&i.reject());
};
return i;
});define("appmsg/more_read.js",["biz_common/utils/string/html.js","biz_common/tmpl.js","biz_wap/utils/ajax.js","appmsg/more_read_tpl.html.js","biz_wap/utils/openUrl.js","biz_common/dom/event.js","biz_common/utils/monitor.js","common/utils.js"],function(n){
"use strict";
function i(n){
for(var i=c.getInnerHeight(),e=document.documentElement.clientWidth||window.innerWidth,t=document.body.scrollHeight||document.body.offsetHeight,s=document.body.scrollTop||document.documentElement.scrollTop,m=[],d=0;d<l.length;d++){
var w=[l[d].bizuin||window.biz||"",l[d].mid||"",l[d].idx||""].join("_");
m.push(w);
}
m=m.join("#");
var h=r[n.index].getBoundingClientRect(),p="fans_read_cnt="+l[n.index].fans_read_cnt,g={
act:n.action||0,
bizuin:window.biz||"",
msgid:window.mid||"",
idx:window.idx||"",
scene:window.source||"",
sub_scene:window.subscene||"",
get_a8_key_scene:window.ascene||"",
screen_height:i,
screen_width:e,
screen_num:Math.ceil(t/i),
action_screen_num:Math.ceil((h.top+h.height+s)/i),
start_time_ms:_,
action_time_ms:Date.now(),
more_msg:m,
a_bizuin:l[n.index].bizuin||window.biz||"",
a_msgid:l[n.index].mid||"",
a_idx:l[n.index].idx||"",
rank:n.index+1,
tip:p,
session_id:u
};
o({
url:"/mp/appmsgreport?action=more_read",
type:"POST",
data:g,
timeout:2e3,
async:!1,
mayAbort:!0
});
var b=1===n.action?4:5;
a.setSum(110809,b,1).send();
}
function e(){
if(l){
for(var n=0,t=c.getInnerHeight(),o=0;o<r.length;o++)if(r[o].dataset.show)n++;else{
var s=r[o].getBoundingClientRect();
s.top+s.height<t&&(r[o].dataset.show=1,i({
action:1,
index:o
}));
}
n>=r.length&&d.off(window,"scroll",e);
}
}
n("biz_common/utils/string/html.js");
var t=n("biz_common/tmpl.js"),o=n("biz_wap/utils/ajax.js"),s=n("appmsg/more_read_tpl.html.js"),m=n("biz_wap/utils/openUrl.js"),d=n("biz_common/dom/event.js"),a=n("biz_common/utils/monitor.js"),c=n("common/utils.js"),l=null,r=null,_=Date.now(),u=""+_+"_"+Math.random().toString(36).substring(2);
return d.on(window,"scroll",e),function(n,e){
l=e,n.innerHTML=t.tmpl(s,{
list:l
}),r=n.getElementsByClassName("more_read_link");
for(var o=0;o<r.length;o++)d.on(r[o],"click",function(n){
return function(){
window.__second_open__?m.openUrlWithExtraWebview(l[n].link.htmlDecode()):window.location.href=l[n].link.htmlDecode(),
i({
action:2,
index:n
});
};
}(o));
n.style.display="";
};
});define("appmsg/comment.js",["biz_common/utils/string/html.js","biz_common/dom/class.js","appmsg/cmt_tpl.html.js","biz_common/utils/wxgspeedsdk.js","appmsg/comment_report.js","biz_wap/utils/device.js","appmsg/retry_ajax.js","biz_common/dom/offset.js","biz_common/utils/url/parse.js","biz_wap/jsapi/core.js","common/utils.js","appmsg/emotion/selection.js","appmsg/i18n.js","biz_common/dom/event.js","biz_wap/utils/ajax.js","biz_common/tmpl.js","biz_wap/utils/fakehash.js","appmsg/log.js","appmsg/my_comment_tpl.html.js","appmsg/emotion/dom.js","appmsg/emotion/emotion_pc.js","appmsg/emotion/emotion.js","appmsg/comment_tpl.html.js","appmsg/comment_pc_tpl.html.js","appmsg/friend_comment_tpl.html.js"],function(e,t,n,o){
"use strict";
function i(e){
var t=document.getElementById(e);
t.parentNode.removeChild(t);
}
function m(e,t){
e&&(e.style.display=t||"block");
}
function d(e){
e&&(e.style.display="none");
}
function a(){
bt.mylist.children.length?(m(bt.mylist.parentNode),Mt||q.removeClass(document.body,Ht)):(d(bt.mylist.parentNode),
Mt||q.addClass(document.body,Ht));
}
function c(e){
bt.el_alertContent.innerHTML=e,bt.el_alertPanel.style.display="";
}
function l(){
Mt?(q.removeClass(document.getElementById("js_success_panel_pc"),"weui-transition_opacity-hide"),
setTimeout(function(){
q.addClass(document.getElementById("js_success_panel_pc"),"weui-transition_opacity-hide");
},750)):(setTimeout(function(){
m(bt.toast);
},750),setTimeout(function(){
d(bt.toast);
},1500));
}
function s(e){
return e.toString().replace(/^\s+|\s+$/g,"");
}
function r(e,t){
if(!(Math.random()<.999)){
var n=9;
"https:"===window.location.protocol&&(n=18),Y.saveSpeeds({
uin:window.uin,
pid:n,
speeds:[{
sid:29,
time:e
},{
sid:30,
time:t
}]
}),Y.send();
}
}
function _(e){
var t=arguments.length<=1||void 0===arguments[1]?"":arguments[1];
if("undefined"!=typeof e){
var n=new Image,o=Math.random();
n.src=ct.idkey?"/mp/jsmonitor?idkey="+ct.idkey+"_"+e+"_1&t="+o:"/mp/jsreport?key="+e+"&content="+t+"&r="+o;
}
}
function p(){
_t||(_t=!0,new Q({
comment_id:gt,
appmsgid:window.appmsgid,
idx:window.idx,
item_show_type:window.item_show_type||0,
biz:window.biz
}));
}
function u(){
try{
var e=bt.loading.getBoundingClientRect(),t=Math.random()<1;
e.top<K.getInnerHeight()&&wt&&t&&((new Image).src="/mp/jsmonitor?idkey=28307_45_1&lc=1&log0",
tt.off(window,"scroll",u));
}catch(n){
console.error(n);
}
}
function g(e){
var t=(new Date).getTime(),n=new Date;
n.setDate(n.getDate()+1),n.setHours(0),n.setMinutes(0),n.setSeconds(0),n=n.getTime();
var o=t/1e3-e,i=n/1e3-e,m=new Date(n).getFullYear(),d=new Date(1e3*e);
return 3600>o?Math.ceil(o/60)+"分钟前":86400>i?Math.floor(o/60/60)+"小时前":172800>i?"昨天":604800>i?Math.floor(i/24/60/60)+"天前":d.getFullYear()===m?d.getMonth()+1+"月"+d.getDate()+"日":d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日";
}
function f(e){
at.each(e.querySelectorAll("div.discuss_message_content"),function(e){
e.innerHTML=Ot.encode(e.innerHTML);
});
}
function y(e,t,n){
var o=void 0,i=void 0,m="",d="",a=document.createElement("div");
"elected"===n?d=0:"friend"===n&&(d=1),Tt={};
for(var c=0;c<e.length;c++){
if(i=e[c],i.time=g(i.create_time),i.status="",i.logo_url=i.logo_url||Ut,i.logo_url=-1!==i.logo_url.indexOf("wx.qlogo.cn")?i.logo_url.replace(/\/132$/,"/96"):i.logo_url,
i.content=i.content.htmlDecodeLite().htmlEncodeLite(),i.nick_name=i.nick_name.htmlDecodeLite().htmlEncodeLite(),
i.like_num_format=parseInt(i.like_num,10)>=1e4?(i.like_num/1e4).toFixed(1)+"万":i.like_num,
"en"===window.LANG&&(i.like_num_format=et.dealLikeReadShow_en(i.like_num)),i.is_from_friend="friend"===n?0:i.is_from_friend||0,
i.is_from_me="mine"===n?1:i.is_from_me||0,i.reply=i.reply||{
reply_list:[]
},i.is_mine=!n,i.is_elected="elected"===n||"friend"===n?1:i.is_elected,i.is_top="friend"===n?0:i.is_top,
i.report_elected=i.is_elected||0,i.report_friend=i.is_from_friend||0,i.scene=d,i.reply.reply_list.length>0){
var l=i.reply.reply_list[0];
l.time=g(l.create_time),l.content=(l.content||"").htmlEncodeLite(),l.reply_like_status=l.reply_like_status||0,
l.reply_like_num=l.reply_like_num||0,l.reply_like_num_format=parseInt(l.reply_like_num,10)>=1e4?(l.reply_like_num/1e4).toFixed(1)+"万":l.reply_like_num,
"en"===window.LANG&&(l.reply_like_num_format=et.dealLikeReadShow_en(l.reply_like_num));
}
i.new_appmsg=window.new_appmsg,m+=ot.tmpl(G,i);
try{
var s=i.nick_name+i.content,r=!1,p=ct.repeatContentID;
Tt[s]&&(r=!0,p=ct.repeatContent),Bt.indexOf(i.content_id)>-1&&(r=!0,p=ct.repeatContentID),
Bt.push(i.content_id),Tt[s]=!0,r&&_(p,encodeURIComponent(JSON.stringify({
comment_id:gt,
content_id:i.content_id,
offset:ft,
length:e.length,
url:Lt
})));
}catch(u){
console.error(u);
}
}
for(a.innerHTML=m,f(a);a.children.item(0);)o=a.children.item(0),t.appendChild(o);
}
function w(e){
var t=void 0,n=void 0,o=Date.now(),i=e.resp,a=e.loadTime,c=e.forceRefresh,l=document.createDocumentFragment(),s=document.createDocumentFragment();
if(pt=i.only_fans_can_comment,_(ct.handleList,encodeURIComponent(JSON.stringify({
comment_id:gt,
offset:ft,
url:Lt
}))),1!==i.enabled?(Rt&&(Rt.style.display="none"),zt&&d(zt),i.elected_comment=[],
i.friend_comment=[],i.elected_comment_total_cnt=0,i.friend_comment_total_cnt=0):(Rt&&(Rt.style.display="block"),
zt&&m(zt)),0===ft){
if(ht=i.logo_url,It=i.nick_name,c&&(Bt=[]),t=i.elected_comment,t&&t.length){
if(y(t,l,"elected"),c&&(bt.list.innerHTML=""),bt.list.appendChild(l),m(bt.main),
!pt||pt&&1===i.is_fans?Mt?(m(bt.commentPC),m(bt.inputPC)):m(bt.addCmtBtn1):m(document.getElementById("js_cmt_nofans1"),"block"),
i.elected_comment_total_cnt<=10&&(m(document.getElementById("js_cmt_statement")),
m(document.getElementById("js_cmt_qa"))),!ut&&"5"===window.item_show_type){
var u=Date.now()-window.logs.pagetime.page_begin;
if(ut=!0,Math.random()>.1)return;
Y.saveSpeeds({
uin:window.uin,
pid:675,
speeds:[{
sid:27,
time:u
}]
}),Y.send();
}
}else d(bt.main),!pt||pt&&1===i.is_fans?Mt?(m(bt.commentPC),m(bt.inputPC)):m(bt.addCmtBtn2):m(document.getElementById("js_cmt_nofans2"),"block");
n=i.friend_comment,y(n,s,"friend"),n&&0===n.length&&d(zt),c&&(bt.fdlist.innerHTML=""),
bt.fdlist.appendChild(s),n&&n.length?(m(bt.fdmain),(!pt||pt&&1===i.is_fans)&&(Mt||(d(bt.addCmtBtn1),
d(bt.addCmtBtn2),m(bt.addCmtBtn3)))):d(bt.fdmain);
var g=document.getElementById("js_cmt_area");
location.href.indexOf("scrolltodown")>-1&&g&&g.offsetTop&&window.scrollTo(0,g.offsetTop-25);
}else t=i.elected_comment,t&&t.length&&(y(t,l,"elected"),bt.list.appendChild(l));
0===i.elected_comment_total_cnt?(ft=-1,d(document.getElementById("js_cmt_loading")),
d(document.getElementById("js_cmt_statement")),d(document.getElementById("js_cmt_qa"))):ft+Dt>=i.elected_comment_total_cnt?(ft=-1,
d(document.getElementById("js_cmt_loading")),m(document.getElementById("js_cmt_statement")),
m(document.getElementById("js_cmt_qa"))):ft+=i.elected_comment.length,p(),a&&r(a,Date.now()-o);
}
function h(e){
if(0!==Number(gt)){
var t=e.forceRefresh,n=e.cb;
t=t===!0,t&&(ft=0);
var o=K.getScrollTop(),i=document.documentElement.scrollHeight;
if(!(wt||-1===ft||ft>0&&i-o-K.getInnerHeight()>500)){
if("number"==typeof st&&0===st&&!t)return void w({
resp:{
enabled:1,
elected_comment:[],
friend_comment:[],
elected_comment_total_cnt:0,
my_comment:[],
only_fans_can_comment:pt,
is_fans:lt,
logo_url:ht,
nick_name:It
}
});
var a=Z.join("/mp/appmsg_comment",{
action:"getcomment",
scene:ct.scene,
appmsgid:window.appmsgid,
idx:window.idx,
comment_id:gt,
offset:ft,
limit:Dt,
send_time:window.send_time
},!0),c=+new Date;
wt=!0,d(bt.tips),m(bt.loading);
try{
Ct++,t&&(vt=[]),Ct>1&&!t&&_(ct.moreList,encodeURIComponent(a)),vt.indexOf(a)>-1&&_(ct.repeatList,encodeURIComponent(a)),
vt.push(a);
}catch(l){
console.error(l);
}
At&&console.info("[图文评论] 开始请求评论数据:",a),mt("[Appmsg comment] start get comment data, url:"+a),
nt({
url:a,
dataType:"json",
success:function(e){
var o=e.base_resp&&e.base_resp.ret;
0===o?n&&n({
resp:e,
forceRefresh:t,
loadTime:Date.now()-c
}):_(ct.errList,"type:resperr;url:"+encodeURIComponent(a)+";ret="+o),mt("[Appmsg comment] get comment success");
},
error:function(){
_(ct.errList,"type:ajaxerr;url:"+encodeURIComponent(a)),mt("[Appmsg comment] get comment ajax error");
},
complete:function(){
wt=!1,d(bt.loading),tt.off(window,"scroll",u);
}
});
}
}
}
function j(){
bt.list.children.length?bt.fdlist.children.length?(m(bt.addCmtBtn3),d(bt.addCmtBtn1),
d(bt.addCmtBtn2),d(bt.addCmtBtn4)):(m(bt.addCmtBtn1),d(bt.addCmtBtn2),d(bt.addCmtBtn3),
d(bt.addCmtBtn4)):bt.fdlist.children.length?(m(bt.addCmtBtn3),d(bt.addCmtBtn4),d(bt.addCmtBtn1),
d(bt.addCmtBtn2)):(m(bt.addCmtBtn2),d(bt.addCmtBtn3),d(bt.addCmtBtn1),d(bt.addCmtBtn4)),
Mt&&(d(bt.addCmtBtn1),d(bt.addCmtBtn2),d(bt.addCmtBtn3));
}
function C(e,t){
var n=document.createDocumentFragment();
l(),y([{
content:t,
nick_name:It,
create_time:Date.now()/1e3|0,
is_elected:0,
logo_url:ht,
like_status:0,
like_num_format:0,
like_num:0,
is_from_friend:0,
is_from_me:1,
my_id:e.my_id,
content_id:e.content_id
}],n,"mine"),bt.mylist.insertBefore(n,bt.mylist.firstChild),a(),Mt?(bt.input.innerHTML="",
bt.inputHolder.style.display=""):bt.input.value="",j();
}
function v(){
at.log("tag1");
var e=void 0,t=Z.join("/mp/appmsg_comment",{
action:"addcomment",
scene:ct.scene,
appmsgid:window.appmsgid,
idx:window.idx,
comment_id:gt,
sn:window.sn
},!0);
if(e=Mt?s(kt).replace(/<br\/>/g,"").replace(/\n/g,"")||"":s(bt.input.value),at.log("tag2"),
!q.hasClass(bt.submit,"btn_disabled")&&bt.submit.disabled!==!0){
if(at.log("tag3"),e.length<1)return void c("留言不能为空");
if(at.log("tag4"),e.length>600)return void c("字数不能多于600个");
Mt&&(e=kt),at.log("tag5"),Mt?bt.submit.disabled=!0:q.addClass(bt.submit,"btn_disabled"),
at.log("tag6");
var n=document.getElementById("activity-name");
at.log("tag7"),rt!==e&&(xt=Date.now()),nt({
url:t,
data:{
content:e,
title:n&&s(n.innerText),
head_img:ht,
nickname:It,
client_id:xt
},
type:"POST",
dataType:"json",
success:function(n){
switch(at.log("tag8"),Mt||Ot.hidePannel(),+n.ret){
case 0:
C(n,e);
break;

case-6:
c("你留言的太频繁了，休息一下吧");
break;

case-7:
c("你还未关注该公众号，不能参与留言");
break;

case-10:
c("字数不能多于600个");
break;

case-15:
c("留言已关闭");
break;

default:
rt=e,c("系统错误，请重试");
}
0!==Number(n.ret)&&_(ct.addCommentErr,"type:resperr;url:"+encodeURIComponent(t)+";ret="+n.ret);
},
error:function(e){
at.log("shit;"+e.status+";"+e.statusText),_(ct.addCommentErr,"type:ajaxerr;url:"+encodeURIComponent(t));
},
complete:function(){
""!==bt.input.value&&q.removeClass(bt.submit,"btn_disabled");
}
});
}
}
function b(e){
return e.filter(function(e){
return!e.is_elected&&1!==e.is_elected;
});
}
function B(){
var e=document.getElementById("js_mycmt_loading"),t=Z.join("/mp/appmsg_comment",{
action:"getmycomment",
scene:ct.scene,
appmsgid:window.appmsgid,
idx:window.idx,
comment_id:gt
},!0);
a(),0===Et&&(Et=1,m(e),nt({
url:t,
dataType:"json",
success:function(e){
var n=e.base_resp&&e.base_resp.ret;
if(0===n){
var o=e.my_comment,i=document.createDocumentFragment();
o&&o.length&&(Mt&&(m(bt.myareaPC),m(bt.mylist),o=b(o)),y(o,i,"mine"),bt.mylist.appendChild(i)),
Et=2;
}else Et=0,_(ct.errComment,"type:resperr;url:"+encodeURIComponent(t)+";ret="+n);
},
error:function(){
Et=0,_(ct.errComment,"type:ajaxerr;url:"+encodeURIComponent(t));
},
complete:function(){
d(e),a();
}
}));
}
function k(e){
yt=K.getScrollTop(),d(bt.article),m(bt.mine),bt.deletePanel=document.getElementById("js_delete_panel_mobile"),
bt.deleteConfirm=document.getElementById("js_delete_confirm_mobile"),bt.deleteCancel=document.getElementById("js_delete_cancel_mobile"),
window.__second_open__&&J.os.ios&&m(bt.fakebar),window.scrollTo(0,0),B(),e||at.later(function(){
bt.input.focus();
});
}
function I(){
"1"===Z.getQuery("js_my_comment")&&k(!0);
}
function E(){
var e=document.getElementById("activity-name");
return K.isNativePage()?($.invoke("handleMPPageAction",{
action:"writeComment",
title:e&&s(e.innerText),
comment_id:gt,
style:"8"===window.item_show_type||"5"===window.item_show_type?"black":"white"
}),!0):!1;
}
function T(){
d(bt.mine),m(bt.article),bt.deletePanel=document.getElementById("js_delete_panel"),
bt.deleteConfirm=document.getElementById("js_delete_confirm"),bt.deleteCancel=document.getElementById("js_delete_cancel"),
window.scrollTo(0,yt),bt.input.blur(),q.removeClass(document.body,Pt),q.removeClass(document.body,Ht),
K.isNativePage()||"5"!==window.item_show_type||($.invoke("setNavigationBarColor",{
color:"#1f1f1f"
}),$.invoke("setBounceBackground",{
backgroundColor:"#1f1f1f"
}));
}
function x(e){
var t=q.hasClass(e,"praised"),n=e.querySelector(".praise_num"),o=n.innerHTML,i=o.indexOf("万"),m=parseInt(o,10)?parseInt(o,10):0;
t?(-1===i&&(n.innerHTML=m-1>0?m-1:""),q.removeClass(e,"praised"),e.dataset.status=0):(-1===i&&(n.innerHTML=m+1),
q.addClass(e,"praised"),e.dataset.status=1);
}
function D(e){
var t=e.delegatedTarget||e.srcElement,n=null;
if(q.hasClass(t,"js_comment_praise")&&(n=t),n){
for(var o=parseInt(n.dataset.status,10),i=0===o?1:0,m=n.dataset.contentId,d=n.dataset.scene,a=document.querySelectorAll('.js_comment_praise[data-content-id="'+m+'"]'),c=0;c<a.length;c++)x(a[c]);
W({
url:"/mp/appmsg_comment?action=likecomment",
type:"POST",
data:{
like:i,
appmsgid:window.appmsgid,
comment_id:gt,
content_id:m,
item_show_type:window.item_show_type||0,
scene:d
}
});
}
}
function L(e){
for(var t=e.delegatedTarget,n=parseInt(t.dataset.status,10),o=n?0:1,i=t.dataset.contentId,m=t.dataset.replyId,d=t.dataset.scene,a=document.querySelectorAll('.js_reply_praise[data-content-id="'+i+'"]'),c=0;c<a.length;c++)x(a[c]);
nt({
url:"/mp/appmsg_comment?action=like_author_reply",
type:"post",
data:{
comment_id:gt,
content_id:i,
reply_id:m,
like:o,
scene:d,
item_show_type:window.item_show_type||0
}
});
}
function M(e,t){
e.parentNode.removeChild(e),q.addClass(bt.deletePanel,"weui-transition_opacity-hide");
for(var n=document.querySelectorAll(".cid"+t),o=0;o<n.length;o++)n[o].parentNode.removeChild(n[o]);
bt.list.children.length?bt.fdlist.children.length||d(bt.fdmain):(d(bt.main),d(document.getElementById("js_cmt_statement")),
d(document.getElementById("js_cmt_qa")),bt.fdlist.children.length||d(bt.fdmain)),
a(),j();
}
function P(e){
var t=void 0,n=e.delegatedTarget,i=n.getAttribute("data-my-id"),m=Z.join("/mp/appmsg_comment",{
action:"delete",
scene:ct.scene,
appmsgid:window.appmsgid,
my_id:i,
comment_id:gt
},!0);
q.removeClass(bt.deletePanel,"weui-transition_opacity-hide"),tt.on(bt.deleteConfirm,"click",function(){
t!==i&&(t=i,nt({
url:m,
dataType:"json",
success:function(e){
var t=n;
if(0===e.ret){
for(;t&&(t.nodeType!==t.ELEMENT_NODE||"li"!==t.tagName.toLowerCase());)t=t.parentNode;
t&&M(t,i);
}else o("删除失败，请重试");
},
error:function(){
o("网络错误，请重试");
}
}));
}),tt.on(bt.deleteCancel,"click",function(){
t!==i&&(t=i,q.addClass(bt.deletePanel,"weui-transition_opacity-hide"));
});
}
function H(e){
e&&e.preventDefault(),T(),d(bt.fakebar);
}
function N(e,t){
if(!E()){
if(K.isNativePage()||"5"!==window.item_show_type||(q.addClass(document.body,Pt),
$.invoke("setNavigationBarColor",{
color:"#191919"
}),$.invoke("setBounceBackground",{
backgroundColor:"#191919"
})),t)return At&&console.log("FakeHash on comment"),void k();
e.preventDefault(),window.__second_open__&&J.os.ios?k():(At&&console.log("push comment"),
it.push("comment"));
}
}
function R(e){
window.scrollTo(0,window.scrollY+e.getBoundingClientRect().height);
}
function z(e){
return e.getBoundingClientRect().top+e.getBoundingClientRect().height>=K.getInnerHeight()?!0:!1;
}
function S(){
it.on("comment",function(){
N(null,!0);
}),it.on("article",function(){
At&&console.log("FakeHash on article"),T();
}),it.on(function(e){
"comment"===e&&T();
});
}
function A(){
tt.on(bt.input,"input",function(e){
if(Mt){
var t=bt.input.innerHTML;
""===t||"<br>"===t?(bt.inputHolder.style.display="",bt.input.innerHTML=""):bt.inputHolder.style.display="none";
}
var n=s(bt.input.value||bt.input.innerHTML);
n.length<1?q.addClass(bt.submit,"btn_disabled"):q.removeClass(bt.submit,"btn_disabled"),
J.os.ios&&e.data&&Ft.indexOf(e.data)>-1&&(jt=!0);
}),tt.on(bt.input,"click",function(){
J.os.ios&&jt&&(bt.input.blur(),bt.input.focus(),jt=!1);
}),tt.on(bt.el_alertConfirm,"click",function(){
bt.el_alertPanel.style.display="none";
}),Mt&&tt.on(bt.input,"click",function(){
d(document.getElementById("js_emotion_panel_pc"));
}),tt.on(bt.list,"click",".js_comment_praise",D),tt.on(bt.mylist,"click",".js_comment_praise",D),
tt.on(bt.fdlist,"click",".js_comment_praise",D),tt.on(bt.list,"click",".js_reply_praise",L),
tt.on(bt.fdlist,"click",".js_reply_praise",L),tt.on(bt.list,"click",".js_del",P),
tt.on(bt.mylist,"click",".js_del",P),tt.on(bt.fdlist,"click",".js_del",P),K.listenMpPageAction(function(e){
"deleteComment"===e.action&&M(document.getElementById("cid"+e.personal_comment_id),e.personal_comment_id);
}),tt.on(bt.list,"click",".js_del",function(e){
e.preventDefault();
}),tt.on(bt.mylist,"click",".js_del",function(e){
e.preventDefault();
}),tt.on(bt.fdlist,"click",".js_del",function(e){
e.preventDefault();
}),tt.on(bt.submit,"click",v),tt.on(bt.submit,"click",function(e){
e.preventDefault();
}),bt.goback&&(tt.on(bt.goback,"click",H),tt.on(bt.goback,"click",H)),window.__second_open__&&J.os.ios&&!function(){
tt.on(bt.input,"click",function(){
d(bt.fakebar);
}),tt.on(bt.input,"blur",function(){
"none"!==bt.mine.style.display&&m(bt.fakebar);
});
var e=null,t=null;
tt.on(window,"orientationchange",function(){
"none"!==bt.fakebar.style.display&&(clearTimeout(e),e=setTimeout(function(){
window.innerWidth!==parseFloat(getComputedStyle(bt.fakebar).width)&&(clearTimeout(t),
bt.mine.style.height=K.getInnerHeight()+"px",window.scrollBy&&window.scrollBy(0,1),
t=setTimeout(function(){
window.scrollBy&&window.scrollBy(0,-1),bt.mine.style.height="";
},100));
},50));
});
}(),tt.on(window,"scroll",u),tt.on(document.getElementById("js_cmt_write1"),"click",function(e){
N(e);
}),tt.on(document.getElementById("js_cmt_write2"),"click",function(e){
N(e);
}),tt.on(document.getElementById("js_cmt_write3"),"click",function(e){
N(e);
}),tt.on(document.getElementById("js_cmt_write4"),"click",function(e){
N(e);
}),tt.on(bt.inputPC,"click",function(){
d(bt.inputPC),m(bt.containerPC),z(bt.containerPC)&&R(bt.containerPC),bt.input.focus();
}),tt.bindVisibilityChangeEvt(function(e){
e&&K.getScrollTop()<X.getOffset(bt.cmtContainer).offsetTop-K.getInnerHeight()&&h({
forceRefresh:!0,
cb:w
});
});
}
function O(){
function e(){
var e=document.createElement("div"),t="";
e.innerHTML=bt.input.innerHTML;
for(var n=e.childNodes.length-1;n>=0;n--){
var o=e.childNodes[n];
switch(o.nodeType){
case 1:
if("BR"!==o.nodeName.toUpperCase()){
var i=void 0,m=!1;
if(i="IMG"===o.nodeName.toUpperCase()?o:"",i||(i=o.textContent||o.innerText||"",
m=!0),i){
var d=m?document.createTextNode(i):i;
e.replaceChild(d,o);
}else e.removeChild(o);
}
break;

case 3:
break;

default:
e.removeChild(o);
}
}
return t=e.innerHTML;
}
function t(){
g=V.getRange();
}
function n(){
if(g){
var e=V.getSelection();
if(e.addRange)e.removeAllRanges(),e.addRange(g);else{
var t=V.getRange();
t.setEndPoint&&(t.setEndPoint("EndToEnd",g),t.setEndPoint("StartToStart",g)),t.select();
}
}
}
function o(){
bt.input.focus(),bt.input.scrollTop=bt.input.scrollHeight,n();
}
function i(){
var e=s(kt).replace(/<br\/>/g,"").replace(/\n/g,"").length;
w.innerText=e,e>600?(y.style.display="",q.addClass(y,"comment_primary_counter_warn"),
bt.submit.disabled=!0):1>e?(y.style.display="none",q.removeClass(y,"comment_primary_counter_warn"),
bt.submit.disabled=!0):(y.style.display="none",q.removeClass(y,"comment_primary_counter_warn"),
bt.submit.disabled=!1);
}
function a(e,t){
var n=["&#96;","`","&#39;","'","&quot;",'"',"&nbsp;"," ","&gt;",">","&lt;","<","&yen;","¥","&amp;","&"],o=["&","&amp;","¥","&yen;","<","&lt;",">","&gt;"," ","&nbsp;",'"',"&quot;","'","&#39;","`","&#96;"],i=void 0;
i=t?o:n;
for(var m=0;m<i.length;m+=2)e=e.replace(new RegExp(i[m],"g"),i[m+1]);
return e;
}
function c(){
document.execCommand("AutoUrlDetect",!1,!1);
var t=e();
t=a(t),kt=Ot.textFilter(t),i();
}
function l(e){
o();
var n=V.getRange();
if(n){
if(n.createContextualFragment){
e+='<img style="width:1px;height:1px;"></img>';
var i=n.createContextualFragment(e),m=i.lastChild,d=V.getSelection();
n.deleteContents(),n.insertNode(i),n.setStartBefore(m),n.setEndAfter(m),d.removeAllRanges(),
d.addRange(n),document.execCommand("Delete",!1,null);
}else n.pasteHTML&&e&&(n.pasteHTML(e),n.select(),n.collapse&&n.collapse(!1));
t(),c();
}
}
function r(e){
var t=e.currentTarget,n=t.getAttribute("data-index"),o=f[n].name,i='<img src="/mpres/zh_CN/htmledition/comm_htmledition/images/pic/common/pic_blank.gif"\n      class="icon_emotion_single '+o+'" alt="mo-'+f[n].title+'"></img>';
l(i),Ot.emotionPanelMove();
}
function _(){
for(var e=bt.input,t=void 0,n=e.childNodes.length-1;n>=0;n--){
var o=e.childNodes[n];
switch(o.nodeType){
case 1:
if("BR"!==o.nodeName.toUpperCase()){
var i=void 0,m=!1;
if(i="IMG"===o.nodeName.toUpperCase()?o:"",i||(i=o.textContent||o.innerText||"",
m=!0),i){
var d=m?document.createTextNode(i):i;
t||(t=d),e.replaceChild(d,o);
}else e.removeChild(o);
}
break;

case 3:
break;

default:
e.removeChild(o);
}
}
V.setCursorToEnd(t);
}
function p(e,t){
for(;void 0!==e&&null!==e&&null!==e.tagName&&"BODY"!==e.tagName.toUpperCase();){
if(e===t)return!0;
e=e.parentNode;
}
return!1;
}
var u=void 0,g=V.getRange(),f=Ot.edata,y=document.getElementById("js_length_notice_pc"),w=document.getElementById("js_word_length_pc");
J.os.Mac&&(window.onblur=function(){
bt.input&&"none"!==bt.input.display&&""!==bt.input.innerHTML&&bt.input.blur();
}),tt.on(bt.input,"keyup",function(){
t(),c();
}),tt.on(bt.input,"keydown",function(e){
return 13===e.keyCode?(l("<br/>"),t(),!1):void 0;
}),tt.on(bt.input,"mouseup",function(){
t(),c();
}),tt.on(bt.input,"paste",function(){
u&&clearTimeout(u),u=setTimeout(function(){
return _(),t(),c(),!1;
},10);
}),tt.on(document,"click",function(e){
var t=e.srcElement||e.delegatedTarget,n=document.getElementById("js_emotion_panel_pc");
if(!p(t,bt.addbtnPC)&&"none"!==bt.containerPC.style.display){
var o=bt.input.innerHTML;
""===s(o)&&(d(bt.containerPC),m(bt.inputPC),d(n));
}
p(t,n)||p(t,bt.emotionSwitchPC)||"none"===n.style.display||d(n);
},!1),at("li.js_emotion_item").on("click",r);
}
function U(t){
if(pt=t.only_fans_can_comment,It=t.nick_name,lt=t.is_fans,ht=t.logo_url,st=t.comment_count,
window._has_comment=!0,!Nt||0===Number(gt))return void(window._has_comment=!1);
if(Rt){
var n=e("appmsg/comment_tpl.html.js"),o=e("appmsg/comment_pc_tpl.html.js");
Rt.innerHTML=ot.tmpl(n,{
new_appmsg:window.new_appmsg
}),St.insertAdjacentHTML("afterbegin",ot.tmpl(o,{
new_appmsg:window.new_appmsg
}));
}
if(zt){
var m=e("appmsg/friend_comment_tpl.html.js");
zt.innerHTML=ot.tmpl(m,{
new_appmsg:window.new_appmsg
});
}
var d=document.createElement("div");
d.innerHTML=ot.tmpl(dt,{
new_appmsg:window.new_appmsg,
isIos:J.os.ios
}),document.body.appendChild(d),Mt?(i("js_cmt_mine"),document.getElementById("js_avatar_pc").src=ht,
q.addClass(document.body,"pages_skin_pc")):i("js_cmt_addbtn_pc"),bt={
article:document.getElementById("js_article"),
mine:document.getElementById("js_cmt_mine"),
main:document.getElementById("js_cmt_main"),
input:document.getElementById("js_cmt_input"),
submit:document.getElementById("js_cmt_submit"),
goback:document.getElementById("js_cmt_goback"),
addbtn:document.getElementById("js_cmt_addbtn"),
list:document.getElementById("js_cmt_list"),
mylist:document.getElementById(Mt?"js_cmt_mylist_pc":"js_cmt_mylist"),
morelist:document.getElementById("js_cmt_morelist"),
toast:document.getElementById("js_cmt_toast"),
tips:document.getElementById("js_cmt_tips"),
loading:document.getElementById("js_cmt_loading"),
fdmain:document.getElementById("js_friend_cmt_main"),
fdlist:document.getElementById("js_friend_cmt_list"),
fdlisthide:document.getElementById("js_friend_cmt_list_hide"),
morefdlist:document.getElementById("js_more_friend_cmt_area"),
morefd:document.getElementById("js_more_friend_cmt"),
fakebar:document.getElementById("js_fake_bar"),
cmtContainer:document.getElementById("js_cmt_container"),
inputPC:document.getElementById("js_cmt_input_pc"),
containerPC:document.getElementById("js_cmt_container_pc"),
commentPC:document.getElementById("js_comment_pc"),
addbtnPC:document.getElementById("js_cmt_addbtn_pc"),
myareaPC:document.getElementById("js_cmt_myarea_pc"),
emotionSwitchPC:document.getElementById("js_emotion_wrp_pc"),
deletePanel:document.getElementById("js_delete_panel"),
deleteConfirm:document.getElementById("js_delete_confirm"),
deleteCancel:document.getElementById("js_delete_cancel"),
inputHolder:document.getElementById("js_cmt_input_holder"),
el_alertPanel:document.getElementById("js_alert_panel"),
el_alertContent:document.getElementById("js_alert_content"),
el_alertConfirm:document.getElementById("js_alert_confirm"),
addCmtBtn1:document.getElementById("js_cmt_addbtn1"),
addCmtBtn2:document.getElementById("js_cmt_addbtn2"),
addCmtBtn3:document.getElementById("js_cmt_addbtn3"),
addCmtBtn4:document.getElementById("js_cmt_addbtn4")
},window.__second_open__&&J.os.ios&&(bt.mine.style.marginBottom=getComputedStyle(bt.fakebar).height),
!t.notAutoGetComment&&h({
forceRefresh:!0,
cb:w
}),I(),Mt&&B(),Ot.init(),A(),Mt&&O();
}
function F(){
S();
}
e("biz_common/utils/string/html.js");
var q=e("biz_common/dom/class.js"),G=e("appmsg/cmt_tpl.html.js"),Y=e("biz_common/utils/wxgspeedsdk.js"),Q=e("appmsg/comment_report.js"),J=e("biz_wap/utils/device.js"),W=e("appmsg/retry_ajax.js"),X=e("biz_common/dom/offset.js"),Z=e("biz_common/utils/url/parse.js"),$=e("biz_wap/jsapi/core.js"),K=e("common/utils.js"),V=e("appmsg/emotion/selection.js"),et=e("appmsg/i18n.js"),tt=e("biz_common/dom/event.js"),nt=e("biz_wap/utils/ajax.js"),ot=e("biz_common/tmpl.js"),it=e("biz_wap/utils/fakehash.js"),mt=e("appmsg/log.js"),dt=e("appmsg/my_comment_tpl.html.js"),at=e("appmsg/emotion/dom.js"),ct={
scene:0,
idkey:"",
moreList:27,
repeatList:25,
errList:18,
handleList:26,
addCommentErr:19,
errComment:18,
repeatContent:24,
repeatContentID:23
},lt=void 0,st=void 0,rt=void 0,_t=void 0,pt=void 0,ut=void 0,gt=0,ft=0,yt=void 0,wt=!1,ht="",jt=!1,Ct=0,vt=[],bt={},Bt=[],kt="",It="我",Et=0,Tt={},xt=Date.now(),Dt=100,Lt=location.href,Mt=J.os.pc,Pt="comment_editing",Ht="my_comment_empty_data",Nt=navigator.userAgent.indexOf("MicroMessenger")>-1,Rt=document.getElementById("js_cmt_area"),zt=document.getElementById("js_friend_cmt_area"),St=document.getElementById("js_cmt_container"),At=Lt.indexOf("vconsole=1")>0||document.cookie&&document.cookie.indexOf("vconsole_open=1")>-1,Ot=e(Mt?"appmsg/emotion/emotion_pc.js":"appmsg/emotion/emotion.js"),Ut="http://mmbiz.qpic.cn/mmbiz/ByCS3p9sHiak6fjSeA7cianwo25C0CIt5ib8nAcZjW7QT1ZEmUo4r5iazzAKhuQibEXOReDGmXzj8rNg/0",Ft=["“”","‘’","（）","《》","〈〉","「」","『』","〔〕","【】","［］","[]","｛｝","{}","()","<>"];
return window.pageCommentReportData&&window.pageCommentReportData.idkey&&(At&&console.log("init reportData"),
ct=window.pageCommentReportData),"undefined"!=typeof window.comment_id?gt=window.comment_id:window.cgiData&&"undefined"!=typeof window.cgiData.comment_id&&(gt=window.cgiData.comment_id),
Nt||(Rt&&(Rt.style.display="none"),zt&&(zt.style.display="none"),gt=0),At&&console.info("[图文评论] 评论ID:",gt),
F(),{
initComment:U,
getCommentData:h,
renderComment:w
};
});define("appmsg/like.js",["biz_common/dom/event.js","biz_common/dom/class.js","biz_wap/utils/ajax.js","biz_common/base64.js","appmsg/log.js","complain/tips.js","appmsg/retry_ajax.js","biz_wap/jsapi/core.js","biz_wap/utils/mmversion.js","common/utils.js","appmsg/i18n.js","biz_wap/utils/device.js"],function(require,exports,module,alert){
"use strict";
function qs(e){
return document.getElementById(e);
}
function showAppToast(e,i){
JSAPI.invoke("handleMPPageAction",{
action:"showToast",
wording:e||"",
status:i||"success"
});
}
function initLikeEvent(opt){
function show(e){
e.style.display="";
}
function hide(e){
e.style.display="none";
}
function vShow(e){
e.style.visibility="visible";
}
function vHide(e){
e.style.visibility="hidden";
}
function clear(e){
e.value="";
}
function showLoading(){
commonUtils.isNativePage()?showAppToast("发送中","loading"):show(qs("js_loading"));
}
function hideLoading(){
commonUtils.isNativePage()?showAppToast("","dismissloading"):hide(qs("js_loading"));
}
function showToast(e){
commonUtils.isNativePage()?showAppToast(e):(el_toastMsg.innerHTML=e,show(el_likeToast),
setTimeout(function(){
hide(el_likeToast);
},1e3));
}
function newAlert(e){
el_alertContent.innerHTML=e,el_alertPanel.style.display="";
}
function alert2(e){
"0"===window.item_show_type?newAlert(e):alert(e);
}
function failAlert(e){
return e&&e.length>maxLikeCommentWord?void alert2("想法不可以超过%s字".replace("%s",maxLikeCommentWord)):void alert2("网络异常，请稍后重试");
}
var scrollTop,el_like=opt.likeAreaDom,el_likeNum=opt.likeNumDom,showType=opt.showType,prompted=opt.prompted,haokanLock=!1,startY,jumpWowLock=!1,el_likeToast=qs("js_like_toast"),el_likeBtn=qs("js_like_btn"),el_toastMsg=qs("js_toast_msg"),el_likeEducate=qs("js_like_educate"),el_friend_like=qs("js_friend_like_area"),el_go_wow=qs("js_go_wow"),el_likeComment=qs("js_like_comment"),el_bcommentPanel2=qs("js_comment_panel"),el_likeCommentShare=qs("js_like_comment_share"),el_likeCommentText=qs("js_comment_text"),el_commentCancel=qs("js_comment_cancel"),el_commentConfirm=qs("js_comment_confirm"),el_commentErrorMsg=qs("js_like_comment_msg"),el_commentCurrentCount=qs("js_like_current_cnt"),el_commentArea=qs("js_comment_area"),el_wowClosePanel=qs("wow_close_inform"),el_wowCloseAck=qs("wow_close_ack"),el_alertPanel=qs("js_alert_panel"),el_alertContent=qs("js_alert_content"),el_alertConfirm=qs("js_alert_confirm");
if(el_like&&el_likeNum){
var img=new Image;
window.appmsg_like_type&&2===window.appmsg_like_type?img.src=location.protocol+"//mp.weixin.qq.com/mp/jsmonitor?idkey=114217_0_1":window.appmsg_like_type&&1===window.appmsg_like_type&&(img.src=location.protocol+"//mp.weixin.qq.com/mp/jsmonitor?idkey=114217_1_1");
var like_report=function(){
log("[Appmsg] click like");
var e=el_like.getAttribute("like"),i=el_likeNum.innerHTML,o=parseInt(e)?parseInt(e):0,t=o?0:1,n=parseInt(i)?parseInt(i):0,s=opt.appmsgid||opt.mid,l=opt.itemidx||opt.idx;
if(o){
if(1!==appmsg_like_type)return void sendRecommendAjax(0);
Class.removeClass(el_like,opt.className),el_like.setAttribute("like",0),n>0&&"100000+"!==i&&(el_likeNum.innerHTML=n-1==0?"赞":n-1);
}else if(1===appmsg_like_type)el_like.setAttribute("like",1),Class.addClass(el_like,opt.className),
"100000+"!==i&&(el_likeNum.innerHTML=n+1);else if(2===appmsg_like_type)return void initRecommendPanel();
RetryAjax({
url:"/mp/appmsg_like?__biz="+opt.biz+"&mid="+opt.mid+"&idx="+opt.idx+"&like="+t+"&f=json&appmsgid="+s+"&itemidx="+l,
data:{
is_temp_url:opt.is_temp_url||0,
scene:window.source,
subscene:window.subscene,
appmsg_like_type:window.appmsg_like_type,
item_show_type:parseInt(window.item_show_type,10),
client_version:window.clientversion,
action_type:t?1:2,
device_type:window.devicetype
},
type:"POST"
});
},initRecommendPanel=function(){
sendRecommendAjax(1,"",1);
},isBeenUnvisible=function(e){
return e.offsetTop-document.body.scrollTop>=commonUtils.getInnerHeight()-60?!0:!1;
},disableMove=function(){
document.addEventListener("touchmove",preventMove,{
passive:!1
}),el_likeCommentText.addEventListener("touchstart",getTouchStart,{
passive:!1
}),el_likeCommentText.addEventListener("touchmove",preventText,!1);
},enableMove=function(){
document.removeEventListener("touchmove",preventMove,{
passive:!1
}),el_likeCommentText.removeEventListener("touchstart",getTouchStart,{
passive:!1
}),el_likeCommentText.removeEventListener("touchmove",preventText,!1);
},preventMove=function(e){
var i=e.target;
"TEXTAREA"!==i.tagName&&"BUTTON"!==i.tagName&&(e.preventDefault(),e.stopPropagation());
},getTouchStart=function(e){
var i=e.targetTouches||[];
if(i.length>0){
var o=i[0]||{};
startY=o.clientY;
}
},preventText=function(e){
var i=!1,o=e.changedTouches,t=this.scrollTop,n=this.offsetHeight,s=this.scrollHeight;
if(o.length>0){
var l=o[0]||{},a=l.clientY;
i=a>startY&&0>=t?!1:startY>a&&t+n>=s?!1:!0,i||e.preventDefault();
}
},isShow=function(e){
return"none"===e.style.display||"hidden"===e.style.visibility?!1:""===e.style.display||"block"===e.style.display||"visible"===e.style.visibility?!0:void 0;
},validataComment=function(e,i){
var o=e.value.replace(/^\s+|\s+$/g,"");
sendRecommendAjax(1,o,i);
},showEducatePanel=function(e,i,o){
show(el_likeComment);
var t=window.source||window.cgiData&&window.cgiData.source||0;
return t&&(t=parseInt(t,10),94===t)?void(e&&5===e&&hide(el_likeComment)):void(i||(show(el_likeEducate),
o&&o>0&&(el_friend_like.innerHTML="%s位朋友也在看,".replace("%s",o),document.getElementById("js_friend_like_word").innerText="前往“发现”-“看一看”浏览",
show(el_friend_like)),1===showType&&(hide(el_go_wow),hide(el_likeCommentShare)),
isBeenUnvisible(el_likeComment)&&scrollToShow(el_likeComment),educateExpose()));
},setBtnLike=function(){
el_like.setAttribute("like",1),Class.addClass(el_likeBtn,opt.className),realLikeNum+=1;
var e=el_likeNum.innerHTML;
"10万+"!==e&&(el_likeNum.innerHTML=dealLikeReadShow(realLikeNum));
},setLike2Status=function(e,i,o){
var t="在看";
switch(showType){
case 1:
switch(prompted){
case 0:
showEducatePanel(e,i,o),show(el_likeComment),prompted=1;
break;

case 1:
hide(el_likeEducate),showToast(t);
}
setBtnLike();
break;

case 2:
switch(hide(el_bcommentPanel2),clear(el_likeCommentText),prompted){
case 0:
showEducatePanel(e,i,o),5===e&&hide(el_likeCommentShare);
break;

case 1:
(4===e||5===e)&&showToast(4===e?"已发送":t);
}
5!==e&&(4===e&&"none"!==el_likeEducate.style.display?hide(el_likeCommentShare):4===e?hide(el_likeComment):(show(el_commentArea),
show(el_likeCommentShare),1===prompted&&hide(el_likeEducate),show(el_likeComment),
isBeenUnvisible(el_likeComment)&&scrollToShow(el_likeComment))),4!==e&&setBtnLike(),
prompted=1;
}
enableMove(),commonUtils.isNativePage()&&JSAPI.invoke("handleHaokanAction",{
action:"closeComment"
});
},unsetLike2Status=function(e){
1===e?setTimeout(function(){
alert2(" 已取消，想法已同步删除");
},20):showToast("已取消"),2===showType&&isShow(el_likeComment)&&hide(el_likeComment);
var i=el_likeNum.innerHTML;
Class.removeClass(el_likeBtn,opt.className),el_like.setAttribute("like",0),el_likeComment&&hide(el_likeComment),
realLikeNum-=1,realLikeNum>=0&&"10万+"!==i&&(el_likeNum.innerHTML=dealLikeReadShow(realLikeNum));
},sendRecommendAjax=function sendRecommendAjax(like,comment,type,clientType){
if(!haokanLock){
showLoading();
var appmsgid=opt.appmsgid||opt.mid,itemidx=opt.itemidx||opt.idx;
haokanLock=!0;
var action_type;
action_type=like?type:2,ajax({
url:"/mp/appmsg_like?__biz="+opt.biz+"&mid="+opt.mid+"&idx="+opt.idx+"&like="+like+"&f=json&appmsgid="+appmsgid+"&itemidx="+itemidx,
data:{
is_temp_url:opt.is_temp_url||0,
scene:window.source,
subscene:window.subscene,
appmsg_like_type:window.appmsg_like_type,
item_show_type:parseInt(window.item_show_type,10),
client_version:window.clientversion,
comment:comment?comment:"",
prompted:1,
style:clientType||showType,
action_type:action_type,
passparam:window.passparam,
request_id:(new Date).getTime(),
device_type:window.devicetype
},
type:"POST",
success:function success(res){
haokanLock=!1;
var data=eval("("+res+")");
hideLoading(),0==data.base_resp.ret?(like?setLike2Status(type,data.is_eu_user,data.friend_like_num):unsetLike2Status(data.has_comment),
connectWithApp(like,comment,clientType)):failAlert(comment);
},
error:function(){
hideLoading(),failAlert(),haokanLock=!1;
}
});
}
};
JSAPI.on("menu:haokan",function(e){
var i=0===parseInt(e.recommend)?0:1;
if(0===i)sendRecommendAjax(i,"",2,clientShowType);else{
var o="";
o=e.comment;
var t=1===e.scene?4:5;
sendRecommendAjax(i,o,t,clientShowType);
}
});
var connectWithApp=function(e,i){
var o={
origin:"mp",
isLike:e?1:0,
url:encodeURIComponent(msg_link.html(!1)),
content:i?i:""
};
JSAPI.invoke("handleHaokanAction",{
action:actionString,
recommend:e?1:0,
server_data:JSON.stringify(o)
},function(e){
console.log("handleHaokanAction",e);
}),JSAPI.invoke("handleHaokanAction",{
action:actionForClient,
permission:1,
recommend:e?1:0
},function(e){
console.log("handleHaokanAction for client",e);
});
},goWoW=function(){
jumpWowLock||(jumpToWowClickReport(),jumpWowLock=!0,JSAPI.invoke("handleHaokanAction",{
action:"jumpToWow",
extParams:JSON.stringify({
autoDropLoad:!0
})
},function(e){
jumpWowLock=!1,console.log("jumpToWow",e),e.err_msg&&"handleHaokanAction:fail_entrance_not_open"===e.err_msg?show(el_wowClosePanel):"handleHaokanAction:fail  action not support"===e.err_msg||"handleHaokanAction:fail, action not support"===e.err_msg?alert2("微信版本过低，暂不支持该操作"):"handleHaokanAction:ok"===e.err_msg&&hide(el_likeComment),
JSAPI.invoke("handleHaokanAction",{
action:actionString,
server_data:JSON.stringify({
origin:"mp",
autoDropLoad:!0
})
},function(e){
console.log("sendAutoDropLoad",e);
});
}));
},likeClickReport=function(){
ajax({
url:"/mp/appmsgreport?action=appmsglikeclickcomment&__biz="+opt.biz+"&mid="+opt.mid+"&idx="+opt.idx+"&f=json&appmsgid="+appmsgid+"&itemidx="+itemidx,
data:{
is_temp_url:opt.is_temp_url||0,
scene:window.source,
subscene:window.subscene,
appmsg_like_type:window.appmsg_like_type,
item_show_type:parseInt(window.item_show_type,10),
client_version:window.clientversion,
device_type:window.devicetype
},
type:"POST"
});
},likeExpose=function e(){
var i=document.documentElement.scrollTop||window.pageYOffset||document.body.scrollTop,o=qs("like3").offsetTop,t=opt.appmsgid||opt.mid,n=opt.itemidx||opt.idx;
i+commonUtils.getInnerHeight()>o&&o>=i&&(ajax({
url:"/mp/appmsgreport?action=appmsglikeexposure&__biz="+opt.biz+"&mid="+opt.mid+"&idx="+opt.idx+"&f=json&appmsgid="+t+"&itemidx="+n,
data:{
is_temp_url:opt.is_temp_url||0,
scene:window.source,
subscene:window.subscene,
appmsg_like_type:window.appmsg_like_type,
item_show_type:parseInt(window.item_show_type,10),
client_version:window.clientversion,
device_type:window.devicetype
},
type:"POST"
}),DomEvent.off(window,"scroll",e));
},educateExpose=function i(){
var e=(document.documentElement.scrollTop||window.pageYOffset||document.body.scrollTop,
opt.appmsgid||opt.mid),o=opt.itemidx||opt.idx,t=window.item_show_type,n=window.enterid||window.cgiData&&window.cgiData.enterid||"";
el_likeEducate&&"none"!=el_likeEducate.style.display&&commonUtils.getInnerHeight()>el_likeEducate.getBoundingClientRect().top&&el_likeEducate.getBoundingClientRect().top+el_likeEducate.getBoundingClientRect().height>0&&(ajax({
url:"/mp/webcommreport?action=report&report_useruin=1&__biz="+window.biz,
type:"POST",
data:{
logid:18266,
buffer:["",Base64.decode(opt.biz),e,o,window.source,window.subscene,1,t,sessionid,n]
},
async:!1,
timeout:2e3
}),DomEvent.off(window,"scroll",i));
},jumpToWowClickReport=function(){
var e=opt.appmsgid||opt.mid,i=opt.itemidx||opt.idx,o=window.enterid||window.cgiData&&window.cgiData.enterid||"";
ajax({
url:"/mp/webcommreport?action=report&report_useruin=1&__biz="+window.biz,
type:"POST",
data:{
logid:18266,
buffer:["",Base64.decode(opt.biz),e,i,window.source,window.subscene,2,window.item_show_type,sessionid,o]
},
async:!1,
timeout:2e3
});
};
DomEvent.on(el_alertConfirm,"click",function(){
el_alertPanel.style.display="none";
}),DomEvent.on(el_like,"click",function(e){
return like_report(e),!1;
}),DomEvent.on(el_wowCloseAck,"click",function(){
hide(el_wowClosePanel);
}),DomEvent.on(qs("js_mask_2"),"mousedown",function(){
hide(el_bcommentPanel2),clear(el_likeCommentText),vHide(el_commentErrorMsg),enableMove();
}),DomEvent.on(el_commentConfirm,"mousedown",function(){
validataComment(el_likeCommentText,4);
}),DomEvent.on(el_commentCancel,"mousedown",function(){
hide(el_bcommentPanel2),clear(el_likeCommentText),vHide(el_commentErrorMsg),enableMove();
}),DomEvent.on(el_likeCommentShare,"click",function(){
return commonUtils.isNativePage()?void JSAPI.invoke("handleHaokanAction",{
action:"writeComment",
style:"8"===item_show_type||"5"===item_show_type?"black":"white"
}):(scrollTop=document.body.scrollTop||document.documentElement.scrollTop,show(el_bcommentPanel2),
el_likeCommentText.focus(),el_commentConfirm.setAttribute("disabled","disabled"),
disableMove(),void likeClickReport());
}),DomEvent.on(el_likeCommentText,"focus",function(){}),DomEvent.on(el_likeCommentText,"blur",function(){
window.scrollTo(0,scrollTop);
}),DomEvent.on(window,"scroll",likeExpose),DomEvent.on(window,"scroll",educateExpose),
DomEvent.on(el_go_wow,"click",goWoW);
var scrollToShow=function(e){
e.scrollIntoView(!1);
};
DomEvent.on(el_likeCommentText,"input",function(e){
var i=el_likeCommentText.value.replace(/^\s+|\s+$/g,"");
i.length>maxLikeCommentWord?(el_commentCurrentCount.innerHTML=i.length,vShow(el_commentErrorMsg)):vHide(el_commentErrorMsg),
i.length>0&&i.length<=maxLikeCommentWord?el_commentConfirm.removeAttribute("disabled"):el_commentConfirm.setAttribute("disabled","disabled"),
Device.os.ios&&e.data&&doubleInputChar.indexOf(e.data)>-1&&(focusTag=!0);
}),DomEvent.on(el_likeCommentText,"click",function(){
Device.os.ios&&focusTag&&(el_likeCommentText.blur(),el_likeCommentText.focus(),focusTag=!1);
});
}
}
function showLikeNum(e){
var i=e||{};
if(i.show){
var o=i.likeAreaDom,t=i.likeNumDom,n=document.getElementById("js_like_btn");
o&&(o.style.display=i.likeAreaDisplayValue,o.style.visibility="",i.liked&&(1===appmsg_like_type?Class.addClass(o,i.className):Class.addClass(n,i.className)),
o.setAttribute("like",i.liked?"1":"0"));
var s=1===appmsg_like_type?"赞":"";
realLikeNum=i.likeNum||s,1===appmsg_like_type?(parseInt(realLikeNum)>1e5?realLikeNum="100000+":"",
t&&(t.innerHTML=realLikeNum)):2===appmsg_like_type&&(t.innerHTML=dealLikeReadShow(realLikeNum));
}
}
function dealLikeReadShow(e){
if("en"==LANG)return i18n.dealLikeReadShow_en(e);
var i="";
if(parseInt(e)>1e5)i="10万+";else if(parseInt(e)>1e4&&parseInt(e)<=1e5){
var o=""+parseInt(e)/1e4,t=o.indexOf(".");
i=-1===t?o+"万":o.substr(0,t)+"."+o.charAt(t+1)+"万";
}else i=0===parseInt(e)?"":e;
return i;
}
function showReadNum(e){
var i=e||{};
if(i.show){
var o=i.readAreaDom,t=i.readNumDom;
o&&(o.style.display=i.readAreaDisplayValue);
var n=i.readNum||1,s=window.ori_send_time||window.cgiData&&window.cgiData.ori_send_time||0,l=/(WindowsNT)|(Windows NT)|(Macintosh)/i.test(navigator.userAgent),a=1566025200,m=1565971200,r=Device.os.ios||l?a:m;
parseInt(s,10)>r&&window.item_show_type&&"5"===window.item_show_type&&("en"!=LANG&&(document.getElementById("readTxt").innerText="播放"),
n=i.videouv||0),1===appmsg_like_type?(parseInt(n)>1e5?n="100000+":"",t&&(t.innerHTML=n)):2===appmsg_like_type&&(t.innerHTML=dealLikeReadShow(n),
""===t.innerHTML&&(t.innerHTML="0"));
}
}
var DomEvent=require("biz_common/dom/event.js"),Class=require("biz_common/dom/class.js"),ajax=require("biz_wap/utils/ajax.js"),Base64=require("biz_common/base64.js"),log=require("appmsg/log.js"),Tips=require("complain/tips.js"),RetryAjax=require("appmsg/retry_ajax.js"),JSAPI=require("biz_wap/jsapi/core.js"),actionString="submitMsgToTL",actionForClient="update_recommend_status",mmversion=require("biz_wap/utils/mmversion.js"),commonUtils=require("common/utils.js"),realLikeNum,clientShowType=5,i18n=require("appmsg/i18n.js"),Device=require("biz_wap/utils/device.js"),maxLikeCommentWord=200,focusTag=!1,doubleInputChar=["“”","‘’","（）","《》","〈〉","「」","『』","〔〕","【】","［］","[]","｛｝","{}","()","<>"];
return i18n.setLikeRead_en(document.getElementById("readTxt")),{
initLikeEvent:initLikeEvent,
showLikeNum:showLikeNum,
showReadNum:showReadNum
};
});define("appmsg/share_tpl.html.js",[],function(){
return'<div class="rich_media_extra">\n    <a href="<#= url #>" class="share_appmsg_container appmsg_card_context flex_context">\n        <div class="flex_hd">\n            <i class="share_appmsg_icon"> </i>\n        </div>\n        <div class="flex_bd">\n            <div class="share_appmsg_title">分享给订阅用户</div>\n            <p class="share_appmsg_desc">可快速分享原创文章给你的公众号订阅用户</p>\n        </div>\n    </a>\n</div>\n';
});define("appmsg/appmsgext.js",["appmsg/log.js","biz_wap/utils/ajax.js","rt/appmsg/getappmsgext.rt.js","biz_common/utils/wxgspeedsdk.js"],function(e){
"use strict";
function t(e){
function t(e){
for(var t=window.location.href,s=t.indexOf("?"),i=t.substr(s+1),n=i.split("&"),a=0;a<n.length;a++){
var _=n[a].split("=");
if(_[0].toUpperCase()==e.toUpperCase())return _[1];
}
return"";
}
var d={
biz:"",
appmsg_type:"",
mid:"",
sn:"",
idx:"",
scene:"",
title:"",
ct:"",
abtest_cookie:"",
devicetype:"",
version:"",
is_need_ticket:0,
is_need_ad:0,
comment_id:"",
is_need_reward:0,
both_ad:0,
reward_uin_count:0,
send_time:"",
msg_daily_idx:"",
is_original:0,
is_only_read:0,
req_id:"",
pass_ticket:"",
is_temp_url:0,
more_read_type:0,
rtId:"",
rtKey:"",
appmsg_like_type:1,
related_video_sn:"",
vid:"",
onSuccess:function(){},
onError:function(){}
};
for(var o in e)e.hasOwnProperty(o)&&(d[o]=e[o]);
console.info("[(评论、点赞、赞赏) 发送请求]: ",new Date),i({
url:"/mp/getappmsgext?f=json&mock="+t("mock"),
data:{
r:Math.random(),
__biz:d.biz,
appmsg_type:d.appmsg_type,
mid:d.mid,
sn:d.sn,
idx:d.idx,
scene:d.scene,
title:encodeURIComponent(d.title.htmlDecode()),
ct:d.ct,
abtest_cookie:d.abtest_cookie,
devicetype:d.devicetype.htmlDecode(),
version:d.version.htmlDecode(),
is_need_ticket:d.is_need_ticket,
is_need_ad:d.is_need_ad,
comment_id:d.comment_id,
is_need_reward:d.is_need_reward,
both_ad:d.both_ad,
reward_uin_count:d.is_need_reward?d.reward_uin_count:0,
send_time:d.send_time,
msg_daily_idx:d.msg_daily_idx,
is_original:d.is_original,
is_only_read:d.is_only_read,
req_id:d.req_id,
pass_ticket:d.pass_ticket,
is_temp_url:d.is_temp_url,
item_show_type:d.item_show_type,
tmp_version:1,
more_read_type:d.more_read_type,
appmsg_like_type:d.appmsg_like_type,
related_video_sn:d.related_video_sn,
vid:d.vid
},
type:"POST",
dataType:"json",
rtId:d.rtId,
rtKey:d.rtKey,
rtDesc:n,
async:!0,
success:function(e){
if(console.info("[(评论、点赞、赞赏) 响应请求]: ",new Date,e),s("[Appmsg] success get async data"),
"function"==typeof d.onSuccess&&d.onSuccess(e),e)try{
s("[Appmsg] success get async data, async data is: "+JSON.stringify(e));
}catch(t){}else s("[Appmsg] success get async data, async data is empty");
if(!_&&"5"===window.item_show_type){
var i=Date.now()-window.logs.pagetime.page_begin;
if(_=!0,Math.random()>.1)return;
a.saveSpeeds({
uin:window.uin,
pid:675,
speeds:[{
sid:29,
time:i
}]
}),a.send();
}
},
error:function(){
s("[Appmsg] error get async data, biz="+d.biz+", mid="+d.mid),"function"==typeof d.onError&&d.onError();
}
});
}
var s=e("appmsg/log.js"),i=e("biz_wap/utils/ajax.js"),n=e("rt/appmsg/getappmsgext.rt.js"),a=e("biz_common/utils/wxgspeedsdk.js"),_=void 0;
return{
getData:t
};
});define("appmsg/img_copyright_tpl.html.js",[],function(){
return'<span class="original_img_wrp">            \n    <span class="tips_global">来自: <#=source_nickname#></span>\n</span>    ';
});define("pages/video_ctrl.js",[],function(){
"use strict";
function n(n){
n=n||window;
var i=n.cgiData;
return i&&2==i.ori_status&&1==i.is_mp_video&&(i.nick_name||i.hit_username)?!0:!1;
}
function i(n){
return n=n||window,!1;
}
function e(){
return-1!=r.indexOf("&vl=1")?!1:"54"==parent.window.appmsg_type?!1:!0;
}
function t(){
return-1!=r.indexOf("&dd=1")?!1:"54"==parent.window.appmsg_type?!1:!0;
}
function o(){
var n;
if(parent==window)n=window;else try{
{
parent.window.__videoDefaultRatio;
}
n=parent.window;
}catch(i){
n=window;
}
var e=n.__videoDefaultRatio||16/9;
return"54"==n.appmsg_type?e:e;
}
var r=window.location.href;
return{
showPauseTips:t,
showVideoLike:e,
showVideoDetail:i,
showReprint:n,
getRatio:o
};
});define("pages/create_txv.js",["biz_common/utils/monitor.js","biz_wap/utils/ajax_load_js.js","pages/loadscript.js"],function(e){
"use strict";
function n(){
"function"!=typeof window.__createTxVideo&&(window.__createTxVideo=function(e){
o(e);
});
}
function o(e){
var n=function(){},o=function(){};
"function"==typeof e.onSuccess&&(o=e.onSuccess),"function"==typeof e.onError&&(n=e.onError),
r.Load({
url:c.jsUrl,
version:c.jsVersion,
useCache:!0,
win:e.win,
onSuccess:function(s){
2!=s.code&&3!=s.code||0!=s.queueIndex||(i.setSum("64728","111",1),i.setSum("64728","112",1));
var u=e.win||window,a=!0;
if(u.Txp&&"function"==typeof u.Txp.Player?(a=!0,0==s.queueIndex&&(2==s.code?i.setSum("64728","116",1):3==s.code&&i.setSum("64728","117",1),
i.send())):(a=!1,0==s.queueIndex&&(2==s.code?i.setSum("64728","114",1):3==s.code&&i.setSum("64728","115",1),
i.send())),a){
var d=t({
win:u,
options:e
});
o({
player:d
});
}else r.ClearCache({
win:u,
version:c.jsVersion,
url:c.jsUrl
}),n();
},
onError:function(n){
0==n.queueIndex&&(i.setSum("64728","111",1),i.setSum("64728","118",1),51==n.code?i.setSum("64728","119",1):52==n.code?i.setSum("64728","120",1):53==n.code&&i.setSum("64728","121",1),
i.send()),s(e);
}
});
}
function t(e){
var n=e.win||window,o=e.options,t=new n.Txp.Player({
containerId:o.containerId,
vid:o.vid,
width:o.width,
height:o.height,
autoplay:o.autoplay===!0?!0:!1,
allowFullScreen:o.allowFullScreen===!0?!0:!1
});
return t;
}
function s(e){
var n=function(){},o=function(){};
"function"==typeof e.onSuccess&&(o=e.onSuccess),"function"==typeof e.onError&&(n=e.onError);
var s=c.jsUrl;
s+=-1==s.indexOf("?")?"?"+c.customerParam+"="+c.jsVersion:"&"+c.customerParam+"="+c.jsVersion,
u({
win:e.win,
url:s,
timeout:1e4,
type:"JS",
callback:function(){
i.setSum("64728","122",1);
var s=e.win||window;
if(s.Txp&&"function"==typeof s.Txp.Player){
i.setSum("64728","124",1),i.send();
var r=t({
win:e.win,
options:e
});
o({
player:r
});
}else i.setSum("64728","123",1),i.send(),n();
},
onerror:function(e){
switch(i.setSum("64728","122",1),1*e){
case 400:
c.jsLoadState=4,i.setSum("64728","125",1);
break;

case 500:
c.jsLoadState=5,i.setSum("64728","126",1);
break;

default:
c.jsLoadState=6,i.setSum("64728","127",1);
}
i.send(),n();
}
});
}
var i=e("biz_common/utils/monitor.js"),r=e("biz_wap/utils/ajax_load_js.js"),u=e("pages/loadscript.js"),c={
customerParam:"wxv",
jsUrl:"//vm.gtimg.cn/tencentvideo/txp/js/iframe/api.js?",
jsVersion:"v1"
};
return{
createTxVideo:o,
createGlobalFunc:n
};
});define("appmsg/reward_utils.js",["appmsg/reward_entry.js","biz_wap/utils/mmversion.js","biz_common/dom/class.js","biz_common/dom/event.js"],function(e,r,n,a){
"use strict";
var i=e("appmsg/reward_entry.js"),t=e("biz_wap/utils/mmversion.js"),d=e("biz_common/dom/class.js"),s=e("biz_common/dom/event.js"),o=window.navigator.userAgent,_={
perLine:0,
hasBindResize:!1,
hasInit:!1,
pageContainerId:"img-content",
rewardInnerId:"js_reward_inner"
},w=function(e){
return document.getElementById(e);
},m=function(){
var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],r=e.pageContainerId||_.pageContainerId,n=e.rewardInnerId||_.rewardInnerId,a=window.innerWidth||document.documentElement.clientWidth;
try{
var i=w(r).getBoundingClientRect();
i.width&&(a=i.width);
}catch(t){}
var d=36;
_.perLine=Math.floor(.8*a/d);
var s=w(n);
return s&&(s.style.width=_.perLine*d+"px"),_.perLine;
},u=function(){
var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],r=e.pageContainerId||_.pageContainerId,n=e.rewardInnerId||_.rewardInnerId;
return e.can_reward&&w(r)&&w(n)?(_.hasBindResize||!function(){
_.hasBindResize=!0;
var r=window.innerWidth;
s.on(window,"resize",function(){
window.innerWidth!==r&&(r=window.innerWidth,m(e),_.hasInit&&i.render(_.perLine));
});
}(),_.perLine||m(e),_.perLine):0;
},p=function(e,r){
_.hasInit=!0;
var n=e.author_id||window.author_id;
e.reward_head_imgs=e.reward_head_imgs||[];
var m=w("js_author_name");
if(r.reward_entrance_enable_for_preview)if(t.isInMiniProgram)t.isInMiniProgram&&m&&d.removeClass(m,"rich_media_meta_link");else{
if(n||t.isAndroid){
var p=w("js_preview_reward_author");
p&&(p.style.display="block");
var h=w("js_preview_reward_author_wording");
r.reward_wording&&h&&(h.innerText=r.reward_wording,h.style.display="block");
var c=w("js_preview_reward_author_link");
c&&s.on(c,"tap",function(e){
e.preventDefault(),a("预览状态下无法操作");
});
}
if(n){
var l=w("js_preview_reward_author_avatar"),v=w("js_preview_reward_author_head");
r.reward_author_head&&l&&v&&(v.setAttribute("src",r.reward_author_head),l.style.display="block");
var g=w("js_preview_reward_link_text");
g&&(g.innerText="喜欢作者");
}else t.isAndroid&&(w("js_preview_reward_author_name").style.display="none");
}else!t.isInMiniProgram&&(o.indexOf("WindowsWechat")>-1||t.isIOS||t.isAndroid)?(i.handle(e,u({
pageContainerId:r.pageContainerId,
rewardInnerId:r.rewardInnerId,
can_reward:1==e.can_reward?!0:!1
})),m&&e.rewardsn&&e.timestamp&&(m.setAttribute("data-rewardsn",e.rewardsn),m.setAttribute("data-timestamp",e.timestamp),
m.setAttribute("data-canreward",e.can_reward)),m&&!e.can_reward&&d.removeClass(m,"rich_media_meta_link")):m&&d.removeClass(m,"rich_media_meta_link");
};
return{
init:p,
getCountPerLine:u
};
});define("biz_common/ui/imgonepx.js",[],function(){
"use strict";
return"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJDQzA1MTVGNkE2MjExRTRBRjEzODVCM0Q0NEVFMjFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJDQzA1MTYwNkE2MjExRTRBRjEzODVCM0Q0NEVFMjFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkNDMDUxNUQ2QTYyMTFFNEFGMTM4NUIzRDQ0RUUyMUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkNDMDUxNUU2QTYyMTFFNEFGMTM4NUIzRDQ0RUUyMUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6p+a6fAAAAD0lEQVR42mJ89/Y1QIABAAWXAsgVS/hWAAAAAElFTkSuQmCC";
});define("appmsg/malicious_wording.js",[],function(){
"use strict";
var i={
0:{
90041:"此标题包含夸大误导信息",
20012:"此标题包含低俗恶俗内容"
},
1:{
90041:"",
20012:""
},
2:{
90041:"此文章包含夸大误导信息",
20012:"此文章包含低俗恶俗内容"
}
},s={
0:{
90041:"标题使用夸大、煽动、低俗等词语造成误导或引人不适",
20012:"标题使用低俗或恶俗词语造成不正当影响或引人不适"
},
1:{
90041:"摘要包含误导、煽动的信息引人不适或造成微信用户混淆",
20012:"摘要包含低俗或恶俗内容造成不正当影响或引人不适"
},
2:{
90041:"文章包含误导、煽动的信息引人不适或造成微信用户混淆",
20012:"文章包含低俗或恶俗内容造成不正当影响或引人不适"
}
};
return{
maliciousTitleMap:i,
maliciousDescMap:s
};
});