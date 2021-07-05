# 在 React 中使用 Agora Web SDK NG 实现视频通话

## 关于 Agora

声网 Agora 提供了一套简单而强大的视频语音通话 SDK，开发者可以利用其中的资源在任何手机或电脑应用中加入高清语音和视频通讯功能。
Agora Web SDK 给予 Web 开发者提供了一套快速开发视频通话应用的方案，借助它开发者能够便捷的实现稳定的视频通话应用。<br>
最新的 Agora Web SDK NG 版更是在新的 SDK 中增加了一些新特性，如：所有异步方法使用 Promise，完美支持 TypeScript，更灵活的音视频控制等等，新版本比之老版本集成起来更顺滑，开发体验得到了极大的提升。[最新版 Agora Web SDK 文档](https://agoraio-community.github.io/AgoraWebSDK-NG/zh-CN/)<br>
今天我就来分享一下在 React 应用中如何快速接入该 SDK 并实现一些简单的实时视频通话。

## 准备工作

1. 注册一个声网账号([注册地址](https://sso.agora.io/cn/v2/signup))。
2. 然后进入控制台，完成实名验证，在项目列表中创建一个项目（选择安全模式），拿到**AppID**。
   ![新建项目](https://i.loli.net/2020/12/30/rhof4bB8qZN9nE6.jpg)
3. 编辑项目，点击生成临时 token，填写频道名**channel**，拿到临时**token**。（在项目发布时，可以参考文档和官方仓库编写对应的 token 生成代码，部署到自己的服务器上通过调用接口的形式来获取 token。）
   ![生成Token](https://i.loli.net/2020/12/30/npV73YWkc1XyTKz.jpg)
   ![获取Token](https://i.loli.net/2020/12/30/L9pj2TthEZBGqQv.jpg)

## 创建项目并集成 SDK

1. 创建 React 应用（[如何创建 React 应用](https://www.html.cn/create-react-app/docs/getting-started/)）

```bash
create-react-app agora-app
```

2. 安装 SDK

```bash
npm install agora-rtc-sdk-ng --save
# or
yarn add agora-rtc-sdk-ng
```

3. 在 App.js 文件中引入这个模块

```js
import AgoraRTC from 'agora-rtc-sdk-ng'
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
```

如果你使用 TypeScript，还可以引入 SDK 的类型声明对象：

```ts
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng'
const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
```

## 实现基础的视频通话

现在我们来实现视频通话功能，在 App.js 中创建一个 async 函数`startBasicCall()`，我们之后的代码都将在这个函数内部编写（NG 版本中我们可以使用 Promise 配合 async/await 让整个代码逻辑更加清晰易懂）。

```js
async function startBasicCall() {
  // 代码将在此编写...
}
```

### 1.创建本地客户端

调用 `createClient()` 方法创建本地客户端对象。`mode`设置频道场景，我们选择实时音视频`"rtc"`；`codec`设置编解码格式，我们选择`"vp8"`。

```js
const rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
```

### 2.加入目标频道

加入频道需要传入 4 个参数：

- 项目 ID AppID
- 频道名 Channel Name
- 安全模式生成的临时 Token
- 最后传入 UID，为`null`时 SDK 会临时给你生成一个

```js
const uid = await rtcClient.join(<AppId>, <Channel Name>, <Token>, null);
```

### 3.创建本地音视频轨道

再加入频道后我们再来创建本地音视频轨道

- 调用`createMicrophoneAudioTrack()`创建本地音频轨道对象`localAudioTrack`。
- 调用`createCameraVideoTrack()`创建本地视频轨道对象`localVideoTrack`。

```js
// 通过麦克风采集的音频创建本地音频轨道对象。
localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
// 通过摄像头采集的视频创建本地视频轨道对象。
localVideoTrack = await AgoraRTC.createCameraVideoTrack()
```

### 4.播放本地音视频轨道

在创建完成本地音视频轨道后，我们可以调用`play()`方法播放本地视频和音频。播放视频轨道的时候需要先指定一个 DOM 元素，你可以传入一个 DOM 对象（原生的 DOM 对象，被 React 封装后的不行），也可以传入元素的 ID 值。之后 SDK 会在该元素内部自动生成一个`<video>`元素播放视频。<br>
startBasicCall()函数内部：

```js
// 播放视频轨道
localVideoTrack.play(document.getElementById('playerContainer'))
// or
localVideoTrack.play('playerContainer')
// 播放音频轨道
localAudioTrack.play()
```

App()组件内部：

```jsx
// 在组件挂载时调用 startBasicCall()
useEffect(() => {
  startBasicCall()
}, [])
// React返回的DOM元素
return (
  <div className="App">
    <div id="playerContainer" className="player-container"></div>
  </div>
)
```

同时注意：播放视频轨道的 DOM 元素一定要设置宽度和高度：

```css
.player-container {
  height: 480px;
  width: 720px;
}
```

### 5. 发布本地音视频轨道

完成本地轨道的创建并且成功加入频道后，就可以调用 `publish()`方法将本地的音视频数据发布到当前频道，以供频道中的其他用户订阅。

```js
await rtcClient.publish([localAudioTrack, localVideoTrack])
```

关于发布，注意事项如下：

- 一个 `RTCClient` 对象可以同时发布多个音频轨道，SDK 会自动混音，将多个音频轨道合并为一个音频轨道。
- 一个 `RTCClient` 对象同一时间只能发布一个视频轨道。如果你想要更换视频轨道，例如已经发布了一个摄像头视频轨道，想要切换为屏幕共享视频轨道，你必须先取消发布。
- 可以多次调用该方法来发布不同的轨道，但是不能重复发布同一个轨道对象。
- 该方法为异步方法，使用时需要配合 Promise 或 async/await。

### 6. 订阅远端用户并播放音视频

当同一频道的远端用户成功发布音视频轨道（远端用户调用了`publish()`）之后，SDK 会触发 `user-published` 事件。这个事件携带两个参数：远端用户对象（user）和远端发布的媒体类型（mediaType）。此时我们需要监听这个事件并调用 `subscribe()` 发起订阅。

```js
rtcClient.on('user-published', async (user, mediaType) => {
  // 开始订阅远端用户。
  await rtc.client.subscribe(user, mediaType)
  console.log('subscribe success')

  // 表示本次订阅的是视频。
  if (mediaType === 'video') {
    // 订阅完成后，从 `user` 中获取远端视频轨道对象。
    const remoteVideoTrack = localVideoTrack
    // 创建一个 DIV 元素
    const playerContainer = document.createElement('div')
    // 给这个 DIV 节点指定一个 ID，这里指定的是远端用户的 UID。
    playerContainer.id = uid.toString()
    // 添加类，设置高度和宽度
    playerContainer.classList.add('player-container')
    // 动态插入 App组件 一个 DIV 节点作为播放远端视频轨道的容器。
    const App = document.querySelector('.App')
    App.append(playerContainer)
    // 传入 DIV 节点，让 SDK 在这个节点下创建相应的播放器播放远端视频。
    remoteVideoTrack.play(playerContainer)
  }

  // 表示本次订阅的是音频。
  if (mediaType === 'audio') {
    // 订阅完成后，从 `user` 中获取远端音频轨道对象。
    const remoteAudioTrack = loaclAudioTrack
    // 播放音频因为不会有画面，不需要提供 DOM 元素的信息。
    remoteAudioTrack.play()
  }
})
```

当远端用户取消发布或离开频道时，SDK 会触发 `user-unpublished` 事件。此时我们需要销毁刚刚动态创建的 DIV 节点。

```js
rtcClient.on('user-unpublished', (user, mediaType) => {
  if (mediaType === 'video') {
    // 获取刚刚动态创建的 DIV 节点。
    const playerContainer = document.getElementById(uid.toString())
    // 销毁这个节点。
    playerContainer.remove()
  }
})
```

测试阶段采用一个 PC 端一个手机端分别进入网址，上方为本地的摄像头画面，下方为远端的摄像头画面，至此我们就初步实现了一个简单的视频通话功能。
![手机端效果图](https://i.loli.net/2020/12/30/8dqwuLVmYOrp2zX.jpg)

## 总结

声网的 Agora Web SDK NG（Next Generation）作为最新的 Web 端音视频解决方案使用起来的整体体验十分不错。首先，接入方式简单易，可以嵌入各个 Web 框架之中；其次文档清晰，可以快速上手；再者功能强大，API 接口齐全，视频通话质量有可靠的保障。<br>
与之前版本(3.0)相比，NG 版本吸收了 WEB 编程的新特性：

- 所有异步方法拥抱 Promise 摆脱了回调地狱的糟糕体验，同时使用 Promise 配合 async/await 让整个代码逻辑更加清晰简洁。
- NG 版本完美支持 TypeScript，帮助我们写出高质量、高可维护性的代码，对于大型的前端应用开发具有非常重要的意义。
- 同时 NG 版本删除了 Stream 对象，使用 Track 对象来控制音视频。把音视频控制的最小单位从一个音视频流改成了一个一个音视频轨道，每种轨道对象都有它自己的方法，拥有了更小的粒度，使编写的代码变得更加灵活。

## 展望

回到项目上来，虽然 Agora Web SDK NG 可以平滑的嵌入 React 项目，但是其中使用的方法还是原生的 DOM API，对于 React 的一些特性并没有很好的支持（比如说与 React 虚拟 DOM 的绑定，推出好用的自定义 Hooks 等等），希望 Agora 团队可以提供 React 专用的 SDK，帮助 React 的开发者快速基础 SDK ，实现音视频的互动场景。<br>
<br>
本文为个人原创，首发于 RTC开发者社区。
