import {createElement, render, useCallback} from 'react';

import {Eva, useComponents} from '@eva/react-eva';
import {useDragonBoneResource, useDragonBone} from '@eva/react-eva-dragonbone';

function App() {
  let state = 1;

  const resource = useDragonBoneResource({
    image: {
      type: 'png',
      url: 'https://gw.alicdn.com/mt/TB1CHhDykP2gK0jSZPxXXacQpXa-1621-1025.png',
    },
    ske: {
      type: 'json',
      url: 'https://gw.alicdn.com/mt/TB1MxVByoz1gK0jSZLeXXb9kVXa.json',
    },
    tex: {
      type: 'json',
      url: 'https://gw.alicdn.com/mt/TB1i34Iybj1gK0jSZFuXXcrHpXa.json',
    },
  });

  const DragonBone = useDragonBone({
    resource,
    armatureName: 'Armature_plant_eggplant',
    animationName: `idle_${state}`,
    playTimes: Infinity,
    autoPlay: true,
  });

  const components = useComponents(DragonBone);

  const change = useCallback(() => {
    state += 1;
    const animationName = state > 6 ? 'harvest' : `idle_${state}`;
    if (animationName === 'harvest') {
      state = 1;
      DragonBone.on('complete', () => {
        DragonBone.play(`idle_${state}`, Infinity);
      });
      DragonBone.play(animationName, 1);
    } else {
      DragonBone.play(animationName, Infinity);
    }
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
