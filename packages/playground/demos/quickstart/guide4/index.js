import {createElement, render, useMemo} from 'react';

import {Eva} from '@eva/react-eva';
import Spine from '@eva/react-eva-spine';

function App() {

  const spineSrc = useMemo(() => ({
    image: 'https://gw.alicdn.com/tfs/TB1bZPn18r0gK0jSZFnXXbRRXXa-684-684.png',
    ske:  './json/a71755e337bb77d9a6c1e93232d8aac7.json',
    atlas: './json/b1a5c40fbd582a0e5ac073b6493f7fe8.atlas',
  }), []);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <Spine
          src={spineSrc}
          animationName="idle"
          loop={true}
          autoPlay={true}
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
        />
      </scene>
    </Eva>
  );
}


render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal)
});
