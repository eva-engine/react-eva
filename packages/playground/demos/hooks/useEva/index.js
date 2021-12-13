import {createElement, render, useCallback} from 'react';

import {
  Eva,
  addSystem,
  useEva,
  useResource,
  ResourceType,
  useComponent,
  useComponents,
} from '@eva/rax-eva';
import {SpriteAnimation as SpriteAnimationComponent, SpriteAnimationSystem} from '@eva/plugin-renderer-sprite-animation';

addSystem(new SpriteAnimationSystem());

function ShoppingCar() {
  const eva = useEva();

  // 创建一个帧动画资源
  const shoppingCarSrc = useResource({
    type: ResourceType.SPRITE_ANIMATION,
    src: {
      image: {
        type: 'png',
        url: 'https://gw.alicdn.com/tfs/TB1n3LyFhn1gK0jSZKPXXXvUXXa-168-85.png',
      },
      json: {
        type: 'json',
        url: './json/e6250b5ddf5bad9cf5dbbeed7bb95896.json',
      },
    },
  });

  // 创建一个帧动画能力组件
  const shoppingCarComponent = useComponent(SpriteAnimationComponent, {
    resource: shoppingCarSrc,
    speed: 100,
    autoPlay: true
  });

  // 创建组件列表
  const shoppingCarComponents = useComponents(shoppingCarComponent);

  const toggleTicker = useCallback(() => {
    // 访问上下文的游戏实例
    if (eva.gameInstance.playing) {
      eva.gameInstance.pause();
    } else {
      eva.gameInstance.resume();
    }
  }, []);

  return (
    <gameobject
      onClick={toggleTicker}
      originX={0.5}
      originY={0.5}
      anchorX={0.5}
      anchorY={0.5}
      width={168}
      height={170}
      components={shoppingCarComponents}
    ></gameobject>
  );
}

function App() {
  return (
    <Eva width="100%" height="100%">
      <scene>
        <ShoppingCar />
      </scene>
    </Eva>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEVA(DriverUniversal),
});
