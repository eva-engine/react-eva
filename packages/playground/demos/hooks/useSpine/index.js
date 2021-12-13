import {createElement, render, useCallback, useState} from 'react';

import {Eva, useComponents} from '@eva/rax-eva';
import {useSpineResource, useSpine} from '@eva/rax-eva-spine';

function App() {
  const [animationName, setAnimationName] = useState('idle');

  const resource = useSpineResource({
    image: 'https://gw.alicdn.com/tfs/TB18mfY1FY7gK0jSZKzXXaikpXa-805-804.png',
    ske:  './json/08a16034db954b2dc2c7f7cff38d5b4c.json',
    atlas: './json/41799e38f99969d2d6f39c4fa75f8861.atlas',
  });

  const Spine = useSpine({
    resource,
    animationName,
    loop: true,
    autoPlay: true,
  });

  const components = useComponents(Spine);

  const change = useCallback(() => {
    setAnimationName(pre => pre === 'idle' ? 'pet' : pre === 'pet' ? 'feed' : 'idle')
  }, []);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <gameobject
          onClick={change}
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          components={components}
        />
      </scene>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal),
});
