import {createElement, render, useCallback, useMemo, useState} from 'react';

import {Eva} from '@eva/rax-eva';
import SpriteAnimation from '@eva/rax-eva-sprite-animation';

function App() {
  const [speed, setSpeed] = useState(100);

  const src = useMemo(() => ({
    image: 'https://gw.alicdn.com/tfs/TB1n3LyFhn1gK0jSZKPXXXvUXXa-168-85.png',
    json: './json/e6250b5ddf5bad9cf5dbbeed7bb95896.json',
  }), []);

  const change = useCallback(() => {
    setSpeed(pre => {
      if (pre > 50) {
        pre -= 10;
      }
      return pre;
    });
  }, []);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <SpriteAnimation
          src={src}
          speed={speed}
          autoPlay={true}
          onClick={change}
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={84}
          height={85}
        />
      </scene>
    </Eva>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal)
});
