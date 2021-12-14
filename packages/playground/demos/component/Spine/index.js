import {createElement, useCallback, render, useState, useMemo} from 'react';

import {Eva} from '@eva/react-eva';
import Spine from '@eva/react-eva-spine';

function App() {
  const [animationName, setAnimationName] = useState('idle');

  const src = useMemo(() => ({
    image: 'https://gw.alicdn.com/tfs/TB18mfY1FY7gK0jSZKzXXaikpXa-805-804.png',
    ske:  './json/08a16034db954b2dc2c7f7cff38d5b4c.json',
    atlas: './json/41799e38f99969d2d6f39c4fa75f8861.atlas',
  }), []);

  const change = useCallback(() => {
    setAnimationName(pre => pre === 'idle' ? 'pet' : pre === 'pet' ? 'feed' : 'idle')
  }, []);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <Spine
          onClick={change}
          src={src}
          animationName={animationName}
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
