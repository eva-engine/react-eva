import {createElement, render} from 'react';

import {
  Eva,
  addSystem,
  useResource,
  ResourceType,
  useComponent,
  useComponents,
} from '@eva/react-eva';
import {Img as ImgComponent, ImgSystem} from '@eva/plugin-renderer-img';

addSystem(new ImgSystem());

function Image() {
  // 创建图片资源标识符
  const res = useResource({
    type: ResourceType.IMAGE,
    src: {
      image: {
        type: 'png',
        url: 'https://gw.alicdn.com/tfs/TB1DtJYD.H1gK0jSZSyXXXtlpXa-424-234.png',
      },
    },
  });

  // 创建图片能力组件
  const imgCom = useComponent(ImgComponent, {
    resource: res,
  });

  // 创建能力组件列表
  const components = useComponents(imgCom);

  return (
    <gameobject
      width={424}
      height={234}
      originX={0.5}
      originY={0.5}
      anchorX={0.5}
      anchorY={0.5}
      components={components}
    ></gameobject>
  );
}

function App() {
  return (
    <Eva width="100%" height="100%">
      <scene>
        <Image />
      </scene>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal),
});
