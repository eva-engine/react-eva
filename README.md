# ReactEva

> 用于开发互动的React解决方案

ReactEva是一个让开发同学能够在React技术体系下，利用Eva.js的游戏研发能力，开发动画、游戏类场景的框架。它可以让开发同学用熟悉的JSX和（仅支持）Hooks语法编写动画、游戏场景的代码。

ReactEva借助React的fiber机制，把React VDOM的操作映射到Eva.js的上下文中，并用Immutable的Hooks提供高性能的运行时。因Eva.js是每帧更新的，所以在ReactEva中并不需要state来驱动，唯一要做的就是改变component的属性值即可。

ReactEva还提供了，游戏结点和DOM结点混合开发的能力（需由fiber-eva/react-dom配合），目前暂提供Web环境的解决方案。

## 开发
```bash
npm i
npm run init
```

### 调试 packages/examples
```bash
npm start
```

### 调试某个包
例如 react-eva-image

```bash
npm run start -- --package=react-eva-image
```

### 启动 playground 模式
```bash
npm run playground-dev
```

### 发布
修改项目目录 package.json 版本号
```js
npm run update
npm run publish -- "--tag alpha" "--packages=*"
```