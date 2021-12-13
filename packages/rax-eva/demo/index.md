---
title: react-eva demo
---

```jsx
import {
  createElement,
  render,
  useCallback,
  useState,
  useEffect,
  memo,
  Fragment,
} from 'react';
import ReactDOM from 'react-dom';
import {
  Eva,
  useEva,
  usePreload,
  addSystem,
  useComponent,
  useComponents,
  ResourceType,
} from '@eva/rax-eva';
import {Img, ImgSystem} from '@eva/plugin-renderer-img';
import {DragonBone, DragonBoneSystem} from '@eva/plugin-renderer-dragonbone';

addSystem(new ImgSystem());
addSystem(new DragonBoneSystem());

window.DragonBoneSystem = DragonBoneSystem;
window.DragonBone = DragonBone;

document.title = 'rax-eva demo';

const Loading = memo(() => {
  const [progress, setProgress] = useState(0);
  const preload = usePreload();
  preload?.onProgress(e => {
    setProgress(e.progress);
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
         color: '#000',
        'font-size': '20px',
      }}
    >
      Loading: {parseInt(progress)}%
    </div>
  );
});

const Intro = memo(() => {
  const preload = usePreload();
  const logoImgComponent = useComponent(Img, {
    resource: preload.resources.logo,
  });

  const logoComponents = useComponents(logoImgComponent);

  const startImgComponent = useComponent(Img, {
    resource: preload.resources.start,
  });

  const startComponents = useComponents(startImgComponent);

  const gotoStart = useCallback(() => {
    location.href = 'https://yuque.com/eva/rax-eva/';
  }, []);

  return (
    <Fragment>
      <gameobject
        anchorX={0.5}
        anchorY={0.5}
        originX={0.5}
        originY={0.5}
        width={714}
        height={144}
        scaleX={0.8}
        scaleY={0.8}
        components={logoComponents}
        y={-100}
      />
      <gameobject
        anchorX={0.5}
        anchorY={0.5}
        originX={0.5}
        originY={0.5}
        fill="#fff"
        fontSize={38}
      >
        用于开发互动的React解决方案
      </gameobject>
      <gameobject
        onClick={gotoStart}
        anchorX={0.5}
        anchorY={0.5}
        originX={0.5}
        originY={0.5}
        width={318}
        height={88}
        components={startComponents}
        y={100}
      />
    </Fragment>
  );
});

const Idol = memo(() => {
  const [pos, setPos] = useState({x: 0, y: 0});
  const [visible, setVisible] = useState(false);
  const eva = useEva();
  const preload = usePreload();

  const dragonbone = useComponent(DragonBone, {
    resource: preload.resources.taoidol,
    armatureName: 'armatureName',
    animationName: 'newAnimation',
  });

  const components = useComponents(dragonbone);
  useEffect(() => {
    if (eva) {
      const {width, height} = eva.currentSceneSize;
      setPos({
        x: width / 2,
        y: height / 2 - 300,
      });
      setVisible(true);
    }
  }, [eva]);

  return (
    <gameobject
      x={pos.x}
      y={pos.y}
      visible={visible}
      originX={0.5}
      originY={0.5}
      components={components}
    ></gameobject>
  );
});

const preloadResources = [
  {
    name: 'taoidol',
    type: ResourceType.DRAGONBONE,
    src: {
      image: {
        type: 'png',
        url: 'https://gw.alicdn.com/tfs/TB1RIpUBhn1gK0jSZKPXXXvUXXa-1024-1024.png',
      },
      tex: {
        type: 'json',
        url: './public/json/fb18baf3a1af41a88f9d1a4426d47832.json',
      },
      ske: {
        type: 'json',
        url: './public/json/c904e6867062e21123e1a44d2be2a0bf.json',
      },
    },
  },
  {
    name: 'logo',
    type: ResourceType.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '//gw.alicdn.com/tfs/TB1c16edmR26e4jSZFEXXbwuXXa-357-72.png',
      },
    },
  },
  {
    name: 'start',
    type: ResourceType.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '//gw.alicdn.com/tfs/TB1Gbb.ONv1gK0jSZFFXXb0sXXa-159-44.png',
      },
    },
  },
];

function App() {
  const [showLoading, setShowLoading] = useState(true);

  const preloadComplete = useCallback(() => {
    setShowLoading(false);
  }, []);

  return (
    <Eva
      preloadResources={preloadResources}
      onPreloadComplete={preloadComplete}
      width={750}
      height={1334}
    >
      <scene>
        {!showLoading ? (
          <Fragment>
            <Idol />
            <Intro />
          </Fragment>
        ) : null}
      </scene>
      <hud>{showLoading ? <Loading /> : null}</hud>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'));
```
