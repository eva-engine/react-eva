import {createElement, render} from 'react';

import {Eva, useComponents} from '@eva/react-eva';
import {useSpriteResource, useSprite} from '@eva/react-eva-sprite';

document.title = 'react-eva-sprite demo';

function App() {
  const resource = useSpriteResource({
    image: {
      type: 'png',
      url: 'https://gw.alicdn.com/tfs/TB13IOEDEY1gK0jSZFMXXaWcVXa-172-80.png',
    },
    json: {
      type: 'json',
      url:
        './json/05238b83ea4285cc94005ee25dad2634.json',
    },
  });

  const Sprite1 = useSprite({
    resource,
    spriteName: 'symbol_1',
  });
  const components1 = useComponents(Sprite1);

  const Sprite2 = useSprite({
    resource,
    spriteName: 'symbol_2',
  });
  const components2 = useComponents(Sprite2);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <gameobject
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={86}
          height={80}
          y={-50}
          components={components1}
        />
        <gameobject
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={86}
          height={80}
          y={50}
          components={components2}
        />
      </scene>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal),
});
