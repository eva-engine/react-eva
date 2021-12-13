import {createElement, render, useState, Fragment as RaxFragment} from 'react';

import {
  Eva,
  addSystem,
  usePreload,
  ResourceType,
  useComponent,
  useComponents,
} from '@eva/rax-eva';
import {Img as ImgComponent, ImgSystem} from '@eva/plugin-renderer-img';

addSystem(new ImgSystem());

// 定义好预加载的资源列表（必须提供name字段）
const preloadResources = [
  {
    name: 'logo',
    type: ResourceType.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '//gw.alicdn.com/tfs/TB1c16edmR26e4jSZFEXXbwuXXa-357-72.png'
      }
    }
  },
  {
    name: 'start',
    type: ResourceType.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '//gw.alicdn.com/tfs/TB1Gbb.ONv1gK0jSZFFXXb0sXXa-159-44.png'
      }
    }
  }
]

function Slogon() {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  const preload = usePreload();

  const logoComponent = useComponent(ImgComponent, {
    resource: preload.resources.logo
  });

  const logoComponents = useComponents(logoComponent);

  const startComponent = useComponent(ImgComponent, {
    resource: preload.resources.start
  });

  const startComponents = useComponents(startComponent);

  // 监听加载的进度
  preload.onProgress(e => {
    setProgress(e.progress);
  });

  // 监听加载完成
  preload.onComplete(() => {
    setComplete(true);
  });

  return (
    <RaxFragment>
      <gameobject
          originX={0.5}
          originY={0.5}
          anchorX={0.5}
          anchorY={0.5}
          width={714}
          height={144}
          scaleX={0.8}
          scaleY={0.8}
          y={-100}
          components={logoComponents}
        ></gameobject>
        <gameobject
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          fill="#fff"
          fontSize={38}
        >
          {complete ? '用于开发互动的Rax解决方案' : `${progress}%`}
      </gameobject>
      <gameobject
        anchorX={0.5}
        anchorY={0.5}
        originX={0.5}
        originY={0.5}
        width={318}
        height={88}
        components={startComponents}
        y={100}
      />
    </RaxFragment>
  )
}

function App() {
  return (
    <Eva
      preloadResources={preloadResources}
      width="100%"
      height="100%"
    >
      <scene>
        <Slogon />
      </scene>
    </Eva>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal),
});
