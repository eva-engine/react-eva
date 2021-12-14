import {createElement, render, useEffect} from 'react';

import {Eva, useComponents} from '@eva/react-eva';
import {useImageResource, useImage} from '@eva/react-eva-image';
import {useTransition} from '@eva/react-eva-transition';
import {useMask, MaskType} from '@eva/react-eva-mask';

function App() {
  const resource = useImageResource({
    image: 'https://gw.alicdn.com/tfs/TB1pHcJaycKOu4jSZKbXXc19XXa-84-85.png'
  });

  const image = useImage({
    resource
  });

  const mask = useMask({
    type: MaskType.Circle,
    style: {
      x: 42,
      y: 42,
      radius: 20,
    },
  });

  const transition = useTransition(() => ({
    bounceIn: [{
      name: 'style.radius',
      component: mask,
      values: [{
        time: 0,
        value: 20,
        tween: 'ease-in'
      },{
        time: 1000,
        value: 100
      }]
    }]
  }))

  const components = useComponents(image, mask, transition);

  useEffect(() => {
    transition.play('bounceIn', 1);
  }, []);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <gameobject
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

ReactDOM.render(<App></App>, document.getElementById('root'));
