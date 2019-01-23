# SCSCMS音乐播放器<sup>chrome扩展程序</sup>

这是一个chrome扩展程序的音乐播放器，方便在没有安装音乐播放器时使用chrome浏览器听歌。可以建立播放列表，导入的歌曲可以存储，并支持播放远程音乐。

### 安装方法：
 - 普通使用者：打开谷歌商店网页<a href="https://chrome.google.com/webstore/detail/scscms%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8/djkddblnfgendjoklmfmocaboelkmdkm/related?hl=zh-CN" target="_blank">SCSCMS音乐播放器</a>点击`添加至Chrom。
 - 开发者：打开浏览器输入地址`chrome://extensions`回车，点击`加载已解压的扩展程序`，并选择本站的`scsMusic`文件夹。
 - 其他安装：打开浏览器输入地址`chrome://extensions`回车，然后把本站的``文件拖进去即可安装。
### 使用方法：
 - 在chrome浏览器右上角点击 ![](pictrue/icons.png) 图标，并双击添加歌曲。右键查看播放列表。
 - 在chrome浏览器右上角右键 ![](pictrue/icons.png) 选择`选项`，进入播放列表管理。
 - 在任意网页下右键可显示`SCSCMS音乐播放器`操作菜单。

### 特别说明：

 - 以开发者安装的扩展，每次启动浏览器都会提示`“请信用以开发者模式运行的扩展程序”`可忽略并关闭。在谷歌商店上安装不存在此问题。
 - 因数组资源有限，播放时间长的音乐会导致扩展程序崩溃。
 - 添加网络歌曲失败原因：权限问题，因扩展程序申请过泛的权限需要谷歌严格审核，为了不影响发布进程，所以权限做了减缩。恢复方法：

	1、在`chrome浏览器`里打开`chrome://extensions/`

	2、记下`SCSCMS音乐播放器`程序的ID

	3、打开`chrome扩展程序`目录`C:\Users\用户名\AppData\Local\Google\Chrome\User Data\Default\Extensions\ID`（这里以win7为例，其他系统请自行百度）

	4、打开`manifest.json`添加　"permissions": [ `"http://*/*", "https://*/*"`,　并把"matches": [ `"http://www.scscms.com/*"` ],改为"matches": [ `"<all_urls>"` ],　搞定。
 
### 程序图片:

![](pictrue/1.png)

首先需要添加歌曲，默认播放列表为`music`

![](pictrue/2.png)

添加好歌曲右键可查看播放列表

![](pictrue/3.png)

播放界面

![](pictrue/4.png)

选项操作界面，主要是管理播放列表。

- 点击列表名就播放本列表
- 可删除列表（暂无重命名功能）
- 监听：表示监听你打开的任意页面，判断是否能捕获到可播放的音乐
- 自动：表示打开浏览器就自动播放歌曲，慎用！

#### 如有任何问题，请留Issues
