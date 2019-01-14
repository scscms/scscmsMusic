// 画圆角矩形
function roundedRect(x, y, width, height, radius) {
    ctx.beginPath()
    ctx.moveTo(x, y + radius)
    ctx.lineTo(x, y + height - radius)
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
    ctx.lineTo(x + width - radius, y + height)
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
    ctx.lineTo(x + width, y + radius)
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
    ctx.lineTo(x + radius, y)
    ctx.quadraticCurveTo(x, y, x, y + radius)
    ctx.stroke()
}
// 画线
function drawLine(x, y, X, Y, color) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(X, Y)
    ctx.strokeStyle = color
    ctx.stroke()
}
// 截取歌曲名
function getNameByteLen() {
    let name = bg.obj.songName
    let len = 30
    let str = ''
    for (let i = 0; i < name.length; i++) {
        len -= /[^\x00-\xff]/.test(name[i]) ? 2 : 1
        if(len < 0){
            str = name.slice(0,i)
            break
        }
    }
    return len < 0 ? str : name
}
function getSongTime() {
    const f = v => parseInt(v).toString().padStart(2, '0')
    let t = bg.source.context.currentTime
    let d = bg.obj.songDuration
    return `${f(t / 60)}:${f(t % 60)}/${f(d / 60)}:${f(d % 60)}`
}

function draw() {
    bg = chrome.extension.getBackgroundPage()
    obj = bg.obj
    if(!obj.init){
        ctx.clearRect(0, 0, 400, 200) // 清空画布
        ctx.font = '18px sans-serif'
        ctx.fillStyle = '#006600'
        ctx.align = 'center'
        ctx.fillText('双击添加歌曲,右键播放列表', 90, 100)
        requestAnimationFrame(draw)
        return
    }
    let cap = obj.capYArray
    let freq = obj.frequencyArray
    obj.analyser.getByteFrequencyData(freq)
    ctx.font = '12px sans-serif' // 歌曲名称
    ctx.align = 'right'
    if(obj.context.state === 'running'){
        ctx.clearRect(0, 0, 400, 200)
        ctx.fillText(getNameByteLen(), 220, 14, 170) //歌名
        for (let i = freq.length; i--;) {
            cap[i] = freq[i * 10] < cap[i] ? cap[i] - 1 : freq[i * 10]
            ctx.fillStyle = '#fff'
            ctx.fillRect(i * 6, 170 - cap[i], 4, 2)
            ctx.fillStyle = gradient
            ctx.fillRect(i * 6, Math.max(0, 170 - freq[i * 10]), 4, 170)
        }
        //进度条
        ctx.fillStyle = 'rgba(0,0,0,0.8)'
        ctx.fillRect(0, 164, 400, 3)
        ctx.fillStyle = '#f60'
        ctx.fillRect(0, 165, Math.floor(bg.source.context.currentTime / bg.obj.songDuration * 400), 2)
    }else{
        ctx.clearRect(0, 167, 400, 200)
    }
    // 画控制台背景
    let clg = ctx.createLinearGradient(0, 168, 0, 200)
    clg.addColorStop(0, '#36342b')
    clg.addColorStop(1, '#232018')
    ctx.fillStyle = clg
    ctx.fillRect(0, 168, 400, 200)
    drawLine(0, 167.5, 400, 167.5, '#003300')
    drawLine(0, 168.5, 400, 168.5, '#51514a')
    let pattern = obj.pattern[obj.serial]
    let y = obj.downPrior || (pattern === 'ordinal' && obj.index === 0) ? 0 : 18
    ctx.drawImage(img, 0, y, 18, 18, 14, 175, 18, 18) // 上一首
    y = obj.context.state !== 'suspended' ? (obj.downStop ? 234 : 54) : (obj.downPlay ? 216 : 36)
    ctx.drawImage(img, 0, y, 18, 18, 14 + 18 + 10, 175, 18, 18) // 播放｜停止
    y = obj.downNext || (pattern === 'ordinal' && obj.index === obj.totalSongs - 1) ? 72 : 90
    ctx.drawImage(img, 0, y, 18, 18, 14 + (18 + 10) * 2, 175, 18, 18) // 下一首
    y = {loop: 108, single: 126, random: 144, ordinal: 162}[pattern]
    ctx.drawImage(img, 0, y, 18, 18, 14 + (18 + 10) * 3, 175, 18, 18) // 循环
    y = obj.mute ? 198 : 180
    ctx.drawImage(img, 0, y, 18, 18, 14 + (18 + 10) * 4, 175, 18, 18) // 静音
    ctx.strokeStyle = '#626262' // 音量
    ctx.lineWidth = 1
    roundedRect(150, 182, 42, 5, 2)
    ctx.fillStyle = '#33ff00'
    ctx.fillRect(151, 183, Math.floor(obj.volume * 40), 3)
    ctx.fillText(getSongTime(), 220, 188, 170)
    ctx.drawImage(img, 0, 253, 30, 19, 365, 177, 30, 19) // scs
    requestAnimationFrame(draw)
}
let bg,obj,ctx,img,list,gradient // 是否已经在绘画
window.onload = function () {
    let input = document.querySelector('input')
    list = document.querySelector('.list')
    list.addEventListener('click', (e) => {
        console.log(e)
        let tag = e.target
        if(tag.tagName==='LI'){
            obj.manual = 'clickLI'
            bg.playSong(0,parseInt(tag.dataset.index))
        }else if(tag.tagName === 'I'){
            if(confirm('确定要删除此音乐？')){
                bg.operation('remove', parseInt(tag.parentNode.dataset.index))
            }
        }
        list.style.display = 'none'
    },false)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        let html = bg.getCurrentMusicList().map((o,index) => `<li data-index="${index}">${index + 1}.${o.name}${o.time?'<span>'+o.time+'</span>':''}<i></i></li>`).join('')
        list.innerHTML = html || '<li class="empty-list">暂无音乐，请双击添加</li>'
        list.style.display = 'block'
    }, false)
    document.addEventListener('dblclick', () => {
       input.click()
    }, false)
    input.addEventListener('change', e => {
        bg.addingMusic(Array.from(e.target.files), true)
    }, false)
    let canvas = document.querySelector('canvas')
    let div = document.querySelector('div')
    img = document.querySelector('img')
    ctx = canvas.getContext('2d')
    gradient = ctx.createLinearGradient(0, 0, 0, 170)
    gradient.addColorStop(0, '#ff6600')
    gradient.addColorStop(0.25, '#fe9901')
    gradient.addColorStop(0.5, '#feff00')
    gradient.addColorStop(1, '#29ff01')
    draw()
    div.addEventListener('mousedown', function (e) {
        let x = e.pageX
        let y = e.pageY
        let action
        if (y > 175 && y < 175 + 18) {
            if (x > 14 && x < 14 + 18) {
                action = 'prior' // 上一首
                obj.downPrior = true
            } else if (x > 14 + 18 + 10 && x < 14 + 18 + 10 + 18) {
                action = 'playing' // 播放｜停止
                obj.downPlay = obj.downStop = true
            } else if (x > 14 + (18 + 10) * 2 && x < 14 + (18 + 10) * 2 + 18) {
                action = 'next' // 下一首
                obj.downNext = true
            } else if (x > 14 + (18 + 10) * 3 && x < 14 + (18 + 10) * 3 + 18) {
                action = 'serial' // 循环
            } else if (x > 14 + (18 + 10) * 4 && x < 14 + (18 + 10) * 4 + 18) {
                action = 'mute' // 静音
            }
        }
        if (x > 150 && x < 150 + 42 && y > 182 && y < 182 + 5) {
            bg.operation('setVolume',x - 150)
            document.onmousemove = function (e) {
                bg.operation('setVolume',Math.max(0, e.pageX - 150))
            }
        }
        if (x > 365 && y > 177) {
            chrome.tabs.create({url:'http://www.scscms.com/'})
        }
        document.onmouseup = function () {
            bg.operation(action)
            document.onmousemove = document.onmouseup = null
        }
    }, false)
}
