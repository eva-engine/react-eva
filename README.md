# RaxEva

> 用于开发互动的Rax解决方案

RaxEva是一个让开发同学能够在Rax技术体系下，利用Eva.js的游戏研发能力，开发动画、游戏类场景的框架。它可以让开发同学用熟悉的JSX和（仅支持）Hooks语法编写动画、游戏场景的代码。

RaxEva借助Rax的Driver机制，把Rax VDOM的操作映射到Eva.js的上下文中，并用Immutable的Hooks提供高性能的运行时。因Eva.js是每帧更新的，所以在RaxEva中并不需要state来驱动，唯一要做的就是改变component的属性值即可。

RaxEva还提供了，游戏结点和DOM结点混合开发的能力（需由driver-universal/driver-dom配合），目前暂提供Web环境的解决方案。

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
例如 rax-eva-image

```bash
npm run start -- --package=rax-eva-image
```

### 启动 playground 模式
```bash
npm run playground-dev
```