function showMusicToHTML(){
    document.querySelector('.list').innerHTML = bg.obj.folderList.map((o,i)=>`<li data-index="${i}"> ${bg.obj.defaultFolder === o.name?'<canvas width="20" height="16" class="play_ico"></canvas>':'<i></i>'}${o.name}<span>[共:${o.total}首]</span></li>`).join("")||`<li>无</li>`
    let c = document.querySelector('.play_ico')
    if (!c) return
    ctx = c.getContext('2d')
    gradient = ctx.createLinearGradient(0, 0, 0, 14)
    gradient.addColorStop(0, '#ff6600')
    gradient.addColorStop(0.25, '#fe9901')
    gradient.addColorStop(0.5, '#feff00')
    gradient.addColorStop(1, '#29ff01')
}
function playShowIco(){
    if(ctx){
        ctx.clearRect(0, 0, 20, 15)
        ctx.fillStyle = gradient
        for(let x = 4;x--;){
            let y = bg.obj.init && bg.obj.context.state === 'running' ? Math.floor(Math.random() * 10) : 4
            ctx.fillRect(x * 5, y + 2, 3, 15)
        }
    }
}
function showError(msg){
    let div = document.querySelector('.error')
    div.querySelector('p').textContent = msg
    div.style.display = 'block'
    setTimeout(()=>{
        div.style.display = 'none'
    },3000)
}
const bg = chrome.extension.getBackgroundPage()
let gradient
let ctx
document.addEventListener('DOMContentLoaded', function () {
    showMusicToHTML()
    setInterval(playShowIco,70)
    let delName;
    let delBut = document.querySelector('.dell')
    let autoPlay = document.querySelector('input[name=autoPlay]')
    let songPush = document.querySelector('input[name=songPush]')
    autoPlay.checked = bg.obj.autoPlay
    songPush.checked = bg.obj.songPush
    autoPlay.addEventListener('change',(e)=>{
        bg.obj.autoPlay = e.target.checked
        bg.setStorage()
    },false)
    songPush.addEventListener('change',(e)=>{
        bg.obj.songPush = e.target.checked
        bg.setStorage()
    },false)
    let setTime
    // 确定删除目录
    delBut.addEventListener('click',()=>{
        clearTimeout(setTime)
        delBut.style.display = 'none'
        bg.fileSystem.dropDirs(delName).then(()=>{
            bg.fileSystem.updateMusicList().then(showMusicToHTML)
        })
    },false)
    document.querySelector('.list').addEventListener('click',e =>{
        let tag = e.target
        switch (tag.tagName) {
            case 'I':
                delName = bg.obj.folderList[tag.parentNode.dataset.index].name
                delBut.style.display = 'block'
                setTime = setTimeout(() => {
                    delBut.style.display = 'none'
                }, 5000)
                break
            case 'LI':
                let name = bg.obj.folderList[tag.dataset.index].name
                if (!tag.dataset.index || bg.obj.defaultFolder === name && bg.obj.init) return // 暂无播放列表或已经是当前播放列表
                bg.obj.defaultFolder = name
                bg.obj.manual = 'click li'
                bg.fileSystem.updateMusicList().then(()=>{
                    showMusicToHTML()
                    bg.obj.index = 0
                    bg.playSong(0)
                })
                bg.setStorage()
                break
            default:
        }
    })
    document.querySelector('.buildList').addEventListener('click',()=>{
        let input = document.querySelector('.folder')
        let name = input.value.trim()
        if(/^$|[\\\/:*?"<>|]/.test(name)){
            input.value = input.value.replace(/[\\\/:*?"<>|]+/g,'')
            showError('请输入正确的列表名称！')
        }else{
            if(bg.obj.folderList.find(o => o.name === name)){
                showError('此列表名称已经存在！')
            }else{
                bg.fileSystem.createFolder(name).then(function(){
                    bg.fileSystem.updateMusicList().then(showMusicToHTML)
                    input.value = ''
                })
            }
        }
    },false)
    // 定时检测
    let str = ''
    setInterval(()=>{
        let list = JSON.stringify(bg.obj.folderList)
        if(str !== list){
            str = list
            showMusicToHTML()
        }
    },1000)
})
