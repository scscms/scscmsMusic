Chrome浏览器插件开发<sup>shine</sup>

#### 什么是Chrome插件
    严格来讲，我们说的东西应该叫Chrome扩展(Chrome Extension)，真正意义上的Chrome插件是更底层的浏览器功能扩展，需要对浏览器源码有一定掌握才有能力去开发。Chrome插件的叫法只是大家已经习惯而已。
    Chrome插件是一个用Web技术开发、用来增强浏览器功能的软件，它其实就是一个由HTML、CSS、JS、图片等资源组成的一个.crx后缀的压缩包.
    另外，其实不只是前端技术，Chrome插件还可以配合C++编写的dll动态链接库实现一些更底层的功能(PPAPI)
>Extensions are software programs, built on web technologies (such as HTML, CSS, and JavaScript) that enable users to customize the Chrome browsing experience.

####　Chrome插件能做什么

增强浏览器功能，轻松实现属于自己的`定制版`浏览器，等等。Chrome插件提供了很多实用API供我们使用，包括但不限于：
- tab控制；
- 书签控制；
- 下载控制；
- 窗口控制；
- 网络请求控制，各类事件监听；
- 自定义原生菜单；
- 完善的通信机制；
- 等等；


### Chrome扩展应用开发
![结构](img/jg.png)
####　Manifest文件格式
[Manifest文件说明](base/manifest.json)
- [示例base/hello-world-1](base/hello-world-1/manifest.json)
- [示例base/hello-world-2](base/hello-world-2/manifest.json)
####　Popup页面
- [示例base/popup](base/popup)

popup页面会根据内容自动显示合适的大小，建议popup页面的高度最好不要超过500像素。
####　常驻后台
- 示例[base/background](base/background)

background可以包含三种属性，分别是scripts、page和persistent属性。如果指定了scripts属性，则Chrome会在扩展启动时自动创建一个包含所有指定脚本的页面；如果指定了page属性，则Chrome会将指定的HTML文件作为后台页面运行。通常我们只需要使用scripts属性即可。persistent属性表示是否一直在后台运行，默认是true。建议为false，表示扩展在后台按需运行。
####　选项页面
- 示例[base/options](base/options)

有一些扩展允许用户进行个性化设置，这样就需要向用户提供一个选项页面。Chrome通过Manifest文件
的options_page属性为开发者提供了这样的接口，可以为扩展指定一个选项页面。
####　i18n多语言支持
在扩展应用程序的根目录下创建_locales文件夹，在_locales下以每个支持的语言的代码为名称创建子文
件夹，然后在其中放入message.json指定对应语言的字符串。
- [示例base/getMessage](base/getMessage)
#### 操作用户正在浏览的页面
通过Chrome扩展我们可以对用户当前浏览的页面进行操作，实际上就是对用户当前浏览页面的DOM进行操
作。通过Manifest中的`content_scripts`属性可以指定将哪些脚本何时注入到哪些页面中，当用户访问这些
页面后，相应脚本即可自动运行，从而对页面DOM进行操作。
- [示例base/irootech](base/irootech)
####　跨域请求
跨域指的是JavaScript通过XMLHttpRequest请求数据时，调用JavaScript的页面所在的域和被请求页面的域不
一致。对于网站来说，浏览器出于安全考虑是不允许跨域。
- [示例base/translate](base/translate)
####　扩展页面间的通信
A、popup         chrome.extension.getViews({type:'popup'}) chrome.runtime.sendMessage chrome.runtime.connect
B、background    chrome.extension.getBackgroundPage() chrome.extension.getViews()
C、page js       chrome.tabs.query() window.postMessage
D、content_scripts   chrome.runtime.sendMessage chrome.runtime.connect chrome.tabs.sendMessage
####　储存数据
localStorage sessionStorage
Web SQL Database
chrome.storage sync和local
fileSystem
- [示例base/storage](base/storage)
####　Browser Actions
Browser Actions将扩展图标置于Chrome浏览器工具栏中，地址栏的右侧。如果声明了popup页面，当用户点
击图标时，在图标的下侧会打开这个页面1。同时图标上面还可以附带badge——一个带有显示有限字符空间
的区域——用以显示一些有用的信息，如未读邮件数、当前音乐播放时间等。
- [示例base/browserActions](base/browserActions)
####　Page Actions
Page Actions与Browser Actions非常类似，除了Page Actions没有badge外，其他Browser Actions所有的方
法Page Actions都有。另外的区别就是，Page Actions并不像Browser Actions那样一直显示图标，而是可以在
特定标签特定情况下显示或隐藏，所以它还具有独有的show和hide方法。
- [示例base/pageActions](base/pageActions)
####　标题和 badge
- [示例base/icon-badge](base/icon-badge)
####　右键菜单
当用户在网页中点击鼠标右键后，会唤出一个菜单，在上面有复制、粘贴和翻译等选项，为用户提供快捷便
利的功能。
- [示例base/contextMenus](base/contextMenus)
#### 快捷键
同样扩展程序也可以监听一些自定义的快捷键，触发相应事件。
- [示例base/commands](base/commands)
####　桌面提醒 (同上)
####　Omnibox
Chrome浏览器的地址栏其实是一个多功能的输入框，Google将其称为omnibox（中文为“多功能框”）。
- [示例base/omnibox](base/omnibox)

###　管理浏览器

####　Cookies
Cookies是浏览器记录在本地的用户数据，如用户的登录信息。Chrome为扩展提供了Cookies API用以管
理Cookies。
- [示例base/cookie-clearer](base/cookie-clearer)
####　管理扩展与应用
除了通过`chrome://extensions/`管理Chrome扩展和应用外，也可以通过Chrome的management接口管
理。management接口可以获取用户已安装的扩展和应用信息，同时还可以卸载和禁用它们。通
过management接口可以编写出智能管理扩展和应用的程序。
- [示例base/management](base/management)
####　标签
Chrome通过tabs方法提供了管理标签的方法与监听标签行为的事件，大多数方法与事件是无需声明特殊权限的，但有关标签
的url、title和favIconUrl的操作（包括读取），都需要声明tabs权限。
- [示例base/tabs](base/tabs)
- [OneTab](https://chrome.google.com/webstore/detail/onetab/chphlpgkkbolifaimnlloiipkdnihall?hl=zh-CN)
####　Override Pages
####　历史
Chrome不仅提供了管理书签、历史和标签的接口，还支持用自定义的页面替换Chrome相应默认的页面，这
就是override pages
- [示例base/override](base/override)
####　书签
- [示例base/bookmark](base/bookmark)
####　下载
- [示例base/downloads](base/downloads)
####　网络请求
- [示例base/webRequest](base/webRequest)
####　代理
- [xswitch](https://github.com/yize/xswitch)
- [SwitchyOmega](https://github.com/FelisCatus/SwitchyOmega)
####　系统信息
- [示例base/system](base/system)

其他　制作Chrome主题
- 示例[theme/theme](theme/theme)
[在线制作主题](https://www.themebeta.com/chrome-theme-creator-online.html)

###　MV3 Feature summary
- Service workers replace background pages.
- Network request modification is now handled with the new declarativeNetRequest API.
- Remotely hosted code is no longer allowed; an extension can only execute JavaScript that is included within its package.
- Promise support has been added to many methods, though callbacks are still supported as an alternative. (We will eventually support promises on all appropriate methods.)
- A number of other, relatively minor feature changes are also introduced in MV3.

####　MV2和 MV3区别
- manifest_version版本号不一样
- 域权限指定
![域权限指定](img/1.png)
- 子资源安全策略
![子资源安全策略](img/2.png)
- 统一的Action API
```javascript
// Manifest v2
{
    "browser_action": {},
    "page_action":{},
}
// Manifest v3
{
    "action": {}
}
```
- 访问资源规则
![子资源安全策略](img/3.png)
- 代码执行方式更安全
```javascript
//MV3禁止远程末经审核的代码执行。
//MV3禁止执行任何字符串代码。
function shwAlert(){}
chrome.tabs.executeScript({
    code: "alert('test!')", //MV2
    file: "const-script.js", //MV3
    function: showAlert //MV3
})
```
- Background以Service Worker方式执行
- 修改网络请求
- 弃用部分API:
    - chrome.extension.sendRequest()
    - chrome.extension.onRequest
    - chrome.extension.onRequestExternal
    - chrome.extension.lastError
    - chrome.extension.getURL()
    - chrome.extension.getExtensionTabs()
    - chrome.tabs.Tab.selected
    - chrome.tabs.sendRequest()
    - chrome.tabs.getSelected()
    - chrome.tabs.getAllInWindow()
    - chrome.tabs.onSelectionChanged
    - chrome.tabs.onActiveChanged
    - chrome.tabs.onHighlightChanged
    - chrome.extension.sendMessage()
    - chrome.extension.connect()
    - chrome.extension.onConnect
    - chrome.extension.onMessage
