import {createElement, render, useEffect} from 'react';

import {Eva} from '@eva/react-eva';
import {useTransition} from '@eva/react-eva-transition';
import {
  useSpriteAnimationResource,
  useSpriteAnimation,
} from '@eva/react-eva-sprite-animation';

function useCarComponents({
  src,
  animationSpeed,
  moveSpeed
}) {
  const resource = useSpriteAnimationResource(src);

  const CarAnimation = useSpriteAnimation({
    resource,
    speed: animationSpeed,
    autoPlay: true
  });

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
          time: moveSpeed,
          value: 750
        }]
      }]
    }
  }, []);

  useEffect(() => {
    MoveAnimation.play('move', Infinity);
  }, [MoveAnimation]);

  return [CarAnimation, MoveAnimation];
}

function App() {
  const car1Components = useCarComponents({
    src: {
      image: 'https://gw.alicdn.com/tfs/TB1n3LyFhn1gK0jSZKPXXXvUXXa-168-85.png',
      json: './json/e6250b5ddf5bad9cf5dbbeed7bb95896.json',
    },
    animationSpeed: 300,
    moveSpeed: 3000
  });

  const car2Components = useCarComponents({
    src: {
      image: 'https://gw.alicdn.com/tfs/TB1B0hovRv0gK0jSZKbXXbK2FXa-168-85.png',
      json: './json/hdassets1581651161006.json',
    },
    animationSpeed: 500,
    moveSpeed: 5000
  });

  return (
    <Eva width="100%" height="100%">
      <scene>
        <gameobject
          anchorX={0}
          anchorY={0.5}
          originX={1}
          originY={0.5}
          y={-100}
          width={84}
          height={85}
          components={car1Components}
        />
        <gameobject
          anchorX={0}
          anchorY={0.5}
          originX={1}
          originY={0.5}
          y={100}
          width={84}
          height={85}
          components={car2Components}
        />
      </scene>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal),
});
