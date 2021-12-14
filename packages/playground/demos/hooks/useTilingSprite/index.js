import {createElement, render, useCallback} from 'react';

import {Eva, useComponent, useComponents} from '@eva/react-eva';
import {useTilingSpriteResource, useTilingSprite} from '@eva/react-eva-tiling-sprite';

function App() {
  const resource = useTilingSpriteResource({
    image: 'https://gw.alicdn.com/tfs/TB1pHcJaycKOu4jSZKbXXc19XXa-84-85.png'
  });

  const tilingSprite = useTilingSprite({
    resource,
    tileScaleX: 1.5,
    tileScaleY: 1.5,
    tilePositionX: 0,
    tilePositionY: 1
  });

  const components = useComponents(tilingSprite);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <gameobject
          components={components}
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={84 * 5 * 1.5}
          height={85 * 8 * 1.5}
          y={-50}
        />
      </scene>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal),
});
