import {createElement, render, useEffect} from 'react';

import {Eva} from '@eva/react-eva';
import {useTransition} from '@eva/react-eva-transition';
import SpriteAnimation from '@eva/react-eva-sprite-animation';

function App() {
  const MoveAnimation = useTransition((context) => {
    return {
      move: [{
        name: 'position.x',
        component: context.Transform,
        values: [{
          time: 0,
          value: 0,
          tween: 'linear'
        }, {
          time: 3000,
          value: 750
        }]
      }]
    }
  }, []);

  useEffect(() => {
    MoveAnimation.play('move', Infinity);
  }, [MoveAnimation]);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <SpriteAnimation
          src={{
            image: 'https://gw.alicdn.com/tfs/TB1n3LyFhn1gK0jSZKPXXXvUXXa-168-85.png',
            json: './json/e6250b5ddf5bad9cf5dbbeed7bb95896.json',
          }}
          speed={300}
          autoPlay={true}
          anchorX={0}
          anchorY={0.5}
          originX={1}
          originY={0.5}
          width={84}
          height={85}
          components={[MoveAnimation]}
        />
      </scene>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal),
});
