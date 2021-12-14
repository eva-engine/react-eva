import {createElement, render, useCallback, useEffect, useRef} from 'react';

import {
  Eva,
  useResource,
  ResourceType,
  useComponents
} from '@eva/react-eva';
import Image from '@eva/react-eva-image';
import {useTransition} from '@eva/react-eva-transition';

function App() {
  const startSrc = useResource({
    type: ResourceType.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '//gw.alicdn.com/tfs/TB1Gbb.ONv1gK0jSZFFXXb0sXXa-159-44.png'
      }
    }
  });

  const transition = useTransition(({Transform}) => {
    return {
      idle: [
        {
          name: 'scale.x',
          component: Transform,
          values: [
            {
              time: 0,
              value: 1,
              tween: 'ease-out',
            },
            {
              time: 400,
              value: 1.2,
              tween: 'ease-in',
            },
            {
              time: 800,
              value: 1,
            },
          ],
        },
        {
          name: 'scale.y',
          component: Transform,
          values: [
            {
              time: 0,
              value: 1,
              tween: 'ease-out',
            },
            {
              time: 400,
              value: 1.2,
              tween: 'ease-in',
            },
            {
              time: 800,
              value: 1,
            },
          ],
        },
      ],
      bounce: [
        {
          name: 'position.y',
          component: Transform,
          values: [
            {
              time: 0,
              value: 0,
              tween: 'ease-out',
            },
            {
              time: 50,
              value: 40,
              tween: 'ease-in',
            },
            {
              time: 150,
              value: -40,
              tween: 'ease-out',
            },
            {
              time: 200,
              value: 0,
            },
          ],
        },
      ],
    };
  }, []);

  const components = useComponents(transition);

  useEffect(() => {
    transition.play('idle', Infinity);
  }, []);

  const change = useCallback(() => {
    transition.once('finish', () => {
      location.href = 'https://yuque.com/eva/react-eva/intro';
    }).play('bounce', 1);
  }, []);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <Image
          onClick={change}
          resource={startSrc}
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={318}
          height={88}
          components={components}
        />
      </scene>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'));
