import {createElement, render, useState, useEffect, memo} from 'react';

import {
  Eva,
  useEva,
  usePreload,
  addSystem,
  useComponent,
  useComponents,
  ResourceType
} from '@eva/rax-eva';
import {DragonBone, DragonBoneSystem} from '@eva/plugin-renderer-dragonbone';

addSystem(new DragonBoneSystem());

const Loading = memo(() => {
  const [progress, setProgress] = useState(0);
  const preload = usePreload();

  preload.onProgress(e => {
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
        color: '#ffffff',
        'font-size': '20px',
      }}
    >
      Loading: {Math.round(progress)}%
    </div>
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
    autoPlay: true
  });

  const components = useComponents(dragonbone);

  useEffect(() => {
    if (eva) {
      const {width, height} = eva.currentSceneSize;
      setPos({
        x: width / 2,
        y: height / 2,
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
    >
    </gameobject>
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
        url: './json/fb18baf3a1af41a88f9d1a4426d47832.json',
      },
      ske: {
        type: 'json',
        url: './json/c904e6867062e21123e1a44d2be2a0bf.json',
      },
    }
  }
]

function App() {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <Eva
      preloadResources={preloadResources}
      onPreloadComplete={() => setShowLoading(false)}
      width="100%"
      height="100%"
    >
      <scene>
        {!showLoading ? <Idol /> : null}
      </scene>
      <hud>
        {showLoading ? <Loading /> : null}
      </hud>
    </Eva>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal)
});
