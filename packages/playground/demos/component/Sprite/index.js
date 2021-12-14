import {createElement, render, useMemo} from 'react';

import {Eva} from '@eva/react-eva';
import Sprite from '@eva/react-eva-sprite';

function App() {
  const src = useMemo(() => ({
    image: 'https://gw.alicdn.com/tfs/TB13IOEDEY1gK0jSZFMXXaWcVXa-172-80.png',
    json: './json/05238b83ea4285cc94005ee25dad2634.json'
  }), []);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <Sprite
          src={src}
          spriteName="symbol_1"
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={86}
          height={80}
          y={-50}
        />
        <Sprite
          src={src}
          spriteName="symbol_2"
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={86}
          height={80}
          y={50}
        />
      </scene>
    </Eva>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal)
});
