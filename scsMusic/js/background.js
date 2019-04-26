// https://github.com/tc39/proposal-promise-finally/blob/master/polyfill.js
if (typeof Promise.prototype.finally !== 'function') {
    var speciesConstructor = function (O, defaultConstructor) {
        if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
            throw new TypeError('Assertion failed: Type(O) is not Object')
        }
        var C = O.constructor
        if (typeof C === 'undefined') {
            return defaultConstructor
        }
        if (!C || (typeof C !== 'object' && typeof C !== 'function')) {
            throw new TypeError('O.constructor is not an Object')
        }
        var S = typeof Symbol === 'function' && typeof Symbol.species === 'symbol' ? C[Symbol.species] : undefined
        if (S == null) {
            return defaultConstructor
        }
        if (typeof S === 'function' && S.prototype) {
            return S
        }
        throw new TypeError('no constructor found')
    }

    var shim = {
        finally(onFinally) {
            var promise = this
            if (typeof promise !== 'object' || promise === null) {
                throw new TypeError('"this" value is not an Object')
            }
            var C = speciesConstructor(promise, Promise) // throws if SpeciesConstructor throws
            if (typeof onFinally !== 'function') {
                return Promise.prototype.then.call(promise, onFinally, onFinally)
            }
            return Promise.prototype.then.call(
              promise,
              x => new C(resolve => resolve(onFinally())).then(() => x),
              e => new C(resolve => resolve(onFinally())).then(() => {
                  throw e
              })
            )
        }
    }
    Object.defineProperty(Promise.prototype, 'finally', {configurable: true, writable: true, value: shim.finally})
}
var W = window
W.requestFileSystem = W.requestFileSystem || W.webkitRequestFileSystem
var fileSystem = {
    fs: null,//文件系统对象
    usage: 0,// 已经使用空间
    size: 1024 * 1024 * 1024,//申请多少1024M空间
    judgeObjectType(obj, type){
        return Object.prototype.toString.call(obj) === '[object ' + type + ']'
    },
    // 生成文件夹
    createFolder(folderName) {
        return new Promise((resolve, reject) => {
            fileSystem.fs.root.getDirectory(folderName, {create: true}, function(dirEntry) {
                resolve(dirEntry)
            }, e => reject(e.name))
        })
    },
    // 列出指定文件夹的文件
    listFiles(path) {
        return new Promise((resolve, reject) => {
            fileSystem.fs.root.getDirectory(path, {create: true}, function (dirEntry) {
                let dirReader = dirEntry.createReader()
                dirReader.readEntries(function (results) {
                    resolve(results)
                }, e => reject(e.name))
            }, e => reject(e.name))
        })
    },
    // 读取根目录下的文件
    readerFile(file) {
        return new Promise((resolve, reject) => {
            fileSystem.fs.root.getFile(file, {create: false}, function (fileEntry) {
                fileEntry.file(function (file) {
                    let reader = new FileReader()
                    reader.onloadend = function () {
                        resolve(this.result)
                    }
                    reader.readAsArrayBuffer(file)
                }, e => reject(e.name))
            }, e => reject(e.name))
        })
    },
    // 重命名(限修改当前列表)
    renameFile(oldName, newName) {
        return new Promise((resolve, reject) => {
            fileSystem.fs.root.getDirectory(obj.defaultFolder, {}, function (parentDir) {
                parentDir.getFile(oldName, {}, function (fileEntry) {
                    fileEntry.moveTo(parentDir, newName)
                    resolve(newName)
                }, e => reject(e.name))
            }, e => reject(e.name))
        })
    },
    // 删除文件
    delFile(file){
        return new Promise((resolve, reject) => {
            fileSystem.fs.root.getFile(file, {create: false}, function (fileEntry) {
                fileEntry.remove(function () {
                    fileSystem.updateMusicList().then(()=>{
                        resolve()
                    })
                }, e => reject(e.name))
            }, e => reject(e.name))
        })
    },
    // 删除文件夹
    dropDirs(path){
        return new Promise((resolve, reject) => {
            fileSystem.fs.root.getDirectory(path, {}, function (dirEntry) {
                dirEntry.removeRecursively(function () {
                    fileSystem.updateMusicList().then(()=>{
                        resolve(dirEntry)
                    })
                }, e => reject(e.name))
            })
        })
    },
    // 保存文件
    saveFile(config){
        return new Promise((resolve, reject) => {
            fileSystem.createFolder(config.pathname).then(()=>{
                fileSystem.fs.root.getFile(config.pathname + '/' + config.fileName, {create: true, exclusive: false}, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function () {
                            if (fileWriter.length === 0) {
                                if(fileSystem.judgeObjectType(config.content,'Blob')){
                                    fileWriter.write(config.content)
                                }else if(fileSystem.judgeObjectType(config.content,'ArrayBuffer')){
                                    fileWriter.write(new Blob([new Uint8Array(config.content)], {type: config.mineType}))
                                }else{
                                    reject('未知数据类型')
                                }
                            } else {
                                fileSystem.updateMusicList().then(()=>{
                                    resolve()
                                })
                            }
                        }
                        fileWriter.onerror = function (e) {
                            reject(e.message)
                        }
                        fileWriter.truncate(0)//先清空
                    })
                })
            })
        })
    },
    // 更新歌曲列表
    updateMusicList(){
        return new Promise((resolve,reject) => {
            fileSystem.fs.root.getDirectory('/', {}, function (dirEntry) {
                let dirReader = dirEntry.createReader()
                dirReader.readEntries(function (results) {
                    let count = 0
                    let lists = []
                    results.forEach(o => {
                        fileSystem.listFiles(o.name).then(arr=>{
                            if(o.name === obj.defaultFolder){
                                lists.push({name: o.name, total: arr.length, musics: arr})
                                obj.totalSongs = arr.length // 总共多少首歌曲
                                arr.forEach((song, index)=>{
                                    if(song.name === obj.songName){
                                        obj.index = index // 修正index
                                    }
                                })
                            }else{
                                lists.push({name: o.name, total: arr.length})
                            }
                        }).finally(()=>{
                            if(++count === results.length){
                                obj.folderList = lists
                                resolve()
                            }
                        })
                    })
                }, e => reject(e.name))
            })
        })
    }
}
// 截取歌曲名
function getNameByteLen(name) {
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
var obj = {
    context: new AudioContext(),
    manual: null, // 手动操作
    folderList: [], // 所有文件夹列表
    defaultFolder: 'music', // 默认文件夹
    autoPlay: false, // 自动播放
    index: 0, // 当前播放序号
    totalSongs: 0, // 总共多少首歌曲
    songPush: false,// 监听音乐并推送
    songName: '', //　当前播放歌名
    songDuration: 0, //　当前播放总播放时间
    pattern: ['loop', 'ordinal', 'single', 'random'], // 播放模式
    serial: 0, // 播放模式序号
    init: false, // 是否已经初始化
    volume: 0.5, // 音量 [0-1]
    mute: false, // 静音
    downPrior: false,
    downNext: false,
    downPlay: false,
    downStop: false,
    capYArray: new Array(1024).fill(0), //帽子
    analyser: null,
    frequencyArray: [], //采样频率缓冲数组,
    storageTime : performance.now(),
    storageSet : 0
}
let gainNode // 音量控制器
var source = {} // 音频源
// 获取当前列表所有歌曲
function getCurrentMusicList() {
    let musicFiles = obj.folderList.find(o => o.name === obj.defaultFolder)
    return musicFiles ? musicFiles.musics : []
}
// 开始初始化函数
function startInitialize() {
    chrome.storage.sync.get({defaultFolder: 'music',volume:0.5,serial:0,autoPlay:false,songPush:true}, function(items) {
        Object.assign(obj,items)
        obj.defaultFolder = items.defaultFolder
        fileSystem.updateMusicList().then(() => {
            // 判断默认文件夹是否存在
            let lists = obj.folderList
            if (lists.find(o => o.name === obj.defaultFolder)) {
                obj.autoPlay && playSong(0)
            } else {
                // 默认文件夹不存在
                if (lists.length === 0) {
                    fileSystem.createFolder(config.pathname).then(startInitialize)
                } else {
                    obj.defaultFolder = lists[0].name
                    setStorage(startInitialize)
                }
            }
        })
    })
}
// 存储缓存
// chrome40及以后，每秒至多执行storage两次操作

function setStorage(fun) {
    let t = performance.now()
    if (t - obj.storageTime > 500) {
        obj.storageTime = t
        fun = fun || function () {
        }
        let {defaultFolder, volume, serial, autoPlay, songPush} = obj
        chrome.storage.sync.set({defaultFolder, volume, serial, autoPlay, songPush}, fun)
    } else {
        obj.storageSet = setTimeout(setStorage, 500, fun)
    }
}
// 指定序号播放歌曲
function playSong(step,index){
    let musics = getCurrentMusicList()
    let maxLength = musics.length
    if(maxLength === 0){
        obj.init = false
        obj.context.suspend()
        source.stop && source.stop(0)
        return sendNotice('播放器通知','暂无音乐请先添加音乐文件！')
    }
    if (step === 'playing') {
        // 直接点击播放或者暂停
        if(obj.init){
            obj.context.state === 'running' ? obj.context.suspend() : obj.context.resume()
            setTimeout(updatePlayMenus,100)
        }else{
            playSong(0)
        }
        obj.manual = null
        return
    }
    source.stop && source.stop(0)
    let pat = obj.pattern[obj.serial]
    if (!obj.init) obj.index = 0
    if(Number.isInteger(index)){
        obj.index = index
    }else{
        obj.index += step
        if(pat === 'random'){
            obj.index = Math.floor(Math.random() * maxLength)
        }
    }
    obj.index >= maxLength && (obj.index = 0)
    obj.index < 0 && (obj.index = maxLength - 1)
    let music = musics[obj.index]
    obj.songName = getNameByteLen(music.name)  // 更新当前歌名
    obj.init = true
    obj.manual = 'ing'
    fileSystem.readerFile(music.fullPath).then(b=>{
        obj.context.decodeAudioData(b).then(buffer => {
            let duration = parseInt(buffer.duration)
            let pad = t => parseInt(t).toString().padStart(2, '0')
            music.duration = duration
            music.time = `[${pad(duration / 60)}:${pad(duration % 60)}]`
            source.stop && source.stop(0)
            obj.context.close() // 旧浏览器对创建AudioContext有数量限制
            obj.context = new AudioContext() // 新建对象，否则播放时间不对
            source = obj.context.createBufferSource()
            gainNode = obj.context.createGain()
            gainNode.gain.value = obj.volume
            obj.analyser = obj.context.createAnalyser()
            source.connect(obj.analyser)
            obj.analyser.connect(gainNode)
            gainNode.connect(obj.context.destination)
            source.buffer = buffer
            source.loopStart = source.context.currentTime + 20
            source.start(0)
            obj.songDuration = buffer.duration
            source.onended = handlePlayOnEnded
            obj.frequencyArray = new Uint8Array(obj.analyser.frequencyBinCount)
            obj.manual = null
            updatePlayMenus()
        },()=>{
            sendNotice('播放音乐出错',`《${music.name}》音乐文件解码失败,已自动删除！`)
            fileSystem.delFile(music.fullPath).then(()=>{
                obj.manual = 'self-motion'
                playSong(1) // 自动播放下一首
            })
        })
    }).catch(e =>{
        sendNotice('读取文件出错',e.message)
        obj.manual = 'self-next'
        playSong(1) // 自动播放下一首
    })
}
// 播放结束事件
function handlePlayOnEnded(){
    if(!obj.manual){
        let pat = obj.pattern[obj.serial]
        let musics = getCurrentMusicList()
        let maxLength = musics.length
        if(pat === 'ordinal' && obj.index === maxLength - 1){
            obj.init = false
            obj.index = 0
            source.stop && source.stop(0)
            obj.context.suspend() // 为了出现播放菜单
            setTimeout(updatePlayMenus,100)
        }else if(pat === 'random'){
            playSong(0,Math.floor(Math.random() * maxLength))
        }else if(pat === 'single'){
            playSong(0,obj.index)
        }else{
            playSong(0, obj.index + 1)
        }
    }
}
// 新增音乐
function addingMusic(arr, isLocal){
    let reg = /^https?:\/\/.+\.(mp3|ogg|m4a)(\?.+)?/i
    let lists = getCurrentMusicList()
    arr.forEach(item => {
        let name = isLocal ? item.name : item.split(/[?#]/)[0].split('/').slice(-1)[0]
        if (lists.find(o => o.name === name)) {
            sendNotice('播放器通知',`《${name}》已经存在列表了`)
        }else if(!isLocal && !reg.test(item)){
            sendNotice('无效的远程音乐地址', item)
        }else if(isLocal){
            const fileReader = new FileReader()
            fileReader.onloadend = function (e) {
                saveMusicToList(name, e.target.result)
            }
            fileReader.readAsArrayBuffer(item)
        }else{
            fetch(item).then(res => res.blob().then(blob => {
                let reg = /^audio\/(mp3|ogg|mp4|mpeg)$/i
                reg.test(blob.type) && blob.size > 1048576 ? saveMusicToList(name, blob):sendNotice('音乐文件格式或大小不符合', blob.toString())
            })).catch(e=>{
                sendNotice('音乐文件下载失败', e.message + item)
            })
        }
    })
}
// 保存到音乐列表
function saveMusicToList(name, data){
    let type = {mp3: 'audio/mpeg', ogg: 'audio/ogg', m4a: 'audio/x-m4a'}
    let suffix = name.match(/([^.]+)$/)[1].toLowerCase()
    fileSystem.saveFile({
        pathname: obj.defaultFolder,
        fileName: name,
        content: data,
        mineType: type[suffix] || 'audio/midi'
    }).then(()=>{
        fileSystem.updateMusicList().then(()=>{
            !obj.init && playSong(0)
        })
    },e=>{
        sendNotice('音乐保存失败',`《${name}》因“${e}”加载失败！`)
    })
}
// 读取缓存
if (W.requestFileSystem) {
    navigator.webkitTemporaryStorage.queryUsageAndQuota(function (usage, quota) {
        if (quota) {
            W.requestFileSystem(TEMPORARY, this.size, function (fs) {
                fileSystem.fs = fs
                startInitialize()
            })
            fileSystem.usage = usage
        } else {
            sendNotice('播放器初始化失败','本地FileSystem申请失败！')
        }
    })
}else{
    sendNotice('播放器初始化失败','本地FileSystem初始化失败！')
}

// 发浏览器通知
function sendNotice(title,message,fun){
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'img/icons128.png',
        title,
        message,
    },function(id){
        fun && fun(id)
    })
}

// 操作播放器
function operation(action, val) {
    if(obj.manual === 'ing') {
        console.log('操作太快了！')
        return // 避免不断操作bug
    }
    obj.manual = action
    switch (action) {
        case 'remove':
            let index = obj.index
            let list = getCurrentMusicList()
            fileSystem.delFile(list[val].fullPath).then(() => {
                fileSystem.updateMusicList().then(()=>{
                    if (val === index) {
                        playSong(0, index === list.length - 1 ? 0 : index)
                    }
                })
            })
            break
        case 'prior':
            playSong(-1)
            break
        case 'playing':
            playSong('playing')
            break
        case 'next':
            playSong(1)
            break
        case 'serial':
            obj.serial = ++obj.serial % 4
            setStorage()
            break
        case 'setVolume':
            obj.volume = Math.min(40, val) / 40
            gainNode.gain.value = obj.volume
            setStorage()
            break
        case 'mute':
            (obj.mute = !obj.mute) ? obj.analyser.disconnect(gainNode) :
              obj.analyser.connect(gainNode)
            break
        default:
    }
}

// 监听来自content-script的消息
let noticeId, ajaxSong, menuId
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    let type = request.type
    let data = request.data
    if(obj.songPush && type === 'ajaxSong'){
        ajaxSong = data
        sendNotice('监听到本站有音乐','是否需要听听本站音乐？点击本信息表示接受！',function(id){
            noticeId = id
        })
    }
})
// 点击通知回调
chrome.notifications.onClicked.addListener((id)=>{
    id === noticeId && addingMusic(ajaxSong, false)
    chrome.notifications.clear(id)
})

// 更新播放菜单
function updatePlayMenus(){
    chrome.contextMenus.update(menuId,{
        title: obj.context.state !== 'suspended' ?'暂停':'播放',
    })
}
// 添加菜单
function addMenus(name,fun){
    return chrome.contextMenus.create({
        type: 'normal',
        title: name,
        contexts: ['page'],
        onclick: fun
    })
}
chrome.contextMenus.removeAll(()=>{
    menuId = addMenus('播放',function(){operation('playing')})
    addMenus('上一曲',function(){operation('prior')})
    addMenus('下一曲',function(){operation('next')})
    addMenus('添加网络歌曲',function(){
        let song = prompt('请输入完整的远程音乐地址，多个以英文逗号分开','')
        song && addingMusic(song.split(','), false)
    })
})
