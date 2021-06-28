let extList = []
const ul = document.querySelector('ul')
function getExt(){
    let html = '<li><strong>应用名称</strong><p>是否启用</p></li>'
    chrome.management.getAll(function(exInfoArray){
        extList = exInfoArray
        html += exInfoArray.map((o, i)=>`<li><strong>${o.name}</strong><p>${o.enabled?'是':'否'}<button data-index="${i}" type="button">改</button></p></li>`).join('')
        ul.innerHTML = html
    });
}
getExt()
ul.addEventListener('click',function(e){
    const index = e.target.getAttribute('data-index')
    const item = extList[index]
    if(item){
        if(confirm(`确定要${item.enabled?'禁用':'启用'}[${item.name}]?`)){
            chrome.management.setEnabled(item.id, !item.enabled, function(){
                alert('操作成功！')
                getExt()
            });
            /*
            * // 卸载
                chrome.management.uninstall(exId, {
                    showConfirmDialog: true
                }, function(){
                    console.log('Extension '+exId+' has been uninstalled.');
                });
                // 卸载自身
                chrome.management.uninstallSelf({
                    showConfirmDialog: true
                }, function(){
                    console.log('This extension has been uninstalled.');
                });
            * */
        }
    }
},false)

/*
exInfo是扩展信息对象:
{
    id: 扩展id,
    name: 扩展名称,
    shortName: 扩展短名称,
    description: 扩展描述,
    version: 扩展版本,
    mayDisable: 是否可被用户卸载或禁用,
    enabled: 是否已启用,
    disabledReason: 扩展被禁用原因,
    type: 类型,
    appLaunchUrl: 启动url,
    homepageUrl: 主页url,
    updateUrl: 更新url,
    offlineEnabled: 离线是否可用,
    optionsUrl: 选项页面url,
    icons: [{
    size: 图片尺寸,
    url: 图片URL
    }],
    permissions: 扩展权限,
    hostPermissions: 扩展有权限访问的host,
    installType: 扩展被安装的方式
}

// 事件监听 (background.js)
chrome.management.onInstalled.addListener(function(exInfo){
    console.log('Extension '+exInfo.id+' has been installed.')
});
chrome.management.onUninstalled.addListener(function(exId){
    console.log('Extension '+exId+' has been uninstalled.');
});
chrome.management.onEnabled.addListener(function(exInfo){
    console.log('Extension '+exInfo.id+' has been enabled.');
});
chrome.management.onDisabled.addListener(function(exInfo){
    console.log('Extension '+exInfo.id+' has been disabled.');
});
*/
