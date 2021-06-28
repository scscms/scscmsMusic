/*
* 书签对象有8个属性，分别是id、parentId、index、url、title、dateAdded、dateGroupModified和children
* chrome.bookmarks 主要方法
* .create
* .get
* .getChildren
* .getRecent
* .getSubTree
* .getTree
* .move
* .remove
* .removeTree
* .search
* .update
* */

// 获取所有标签
document.getElementById('getAll').addEventListener('click',()=>{
    chrome.bookmarks.getTree(function(bookmarkArray){
        console.log(bookmarkArray);
    });
}, false)

// 添加标签
document.getElementById('add').addEventListener('click',()=>{
    chrome.bookmarks.create({
        parentId: '1',
        index: 0,
        title: 'Google',
        url: 'http://www.google.com/'
    }, function(bookmark){
        console.log(bookmark);
    });
}, false)

// 删除标签
document.getElementById('del').addEventListener('click',()=>{
    const id = prompt('请输入要删除标签的id')
    if(/^\d+$/.test(id)){
        chrome.bookmarks.remove(id, function(){
            console.log('删除成功！');
        });
    }
}, false)
