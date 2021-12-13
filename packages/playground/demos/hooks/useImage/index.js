import {createElement, render, useCallback} from 'react';

import {Eva, useComponents} from '@eva/rax-eva';
import {useImageResource, useImage} from '@eva/rax-eva-image';

function App() {
  const resource1 = useImageResource({
    image: {
      type: 'png',
      url: 'https://gw.alicdn.com/tfs/TB1pHcJaycKOu4jSZKbXXc19XXa-84-85.png',
    },
  });

  const resource2 = useImageResource({
    image: {
      type: 'png',
      url: 'https://gw.alicdn.com/tfs/TB1GfBpvUT1gK0jSZFhXXaAtVXa-84-85.png',
    },
  });

  const Image = useImage({
    resource: resource1,
  });

  const change = useCallback(() => {
    if (Image.resource === resource1) {
      Image.resource = resource2;
    } else {
      Image.resource = resource1;
    }
  }, []);

  const components = useComponents(Image);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <gameobject
          onClick={change}
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={84}
          height={85}
          components={components}
        />
      </scene>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal),
});
