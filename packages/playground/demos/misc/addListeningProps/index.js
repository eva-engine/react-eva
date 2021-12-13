import {createElement, render, useRef, useEffect} from 'react';

import {Eva, addListeningProps, addSystem, useResource, ResourceType} from '@eva/rax-eva';
import {useImageResource} from '@eva/rax-eva-image'
import {Img} from '@eva/plugin-renderer-img';

addListeningProps(['resource'], Img);

function App() {
  const resource = useImageResource({
    image: 'https://gw.alicdn.com/tfs/TB1pHcJaycKOu4jSZKbXXc19XXa-84-85.png'
  });

  return (
    <Eva width="100%" height="100%">
      <scene>
        <gameobject
          resource={resource}
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
  driver: new DriverEva(DriverUniversal, true)
});
