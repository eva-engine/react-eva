import {createElement, render, useCallback, useState, useRef, useMemo} from 'react';

import {Eva} from '@eva/react-eva';
import DragonBone from '@eva/react-eva-dragonbone';

function App() {
  let state = 1;
  const ref = useRef(null);
  const [animationName, setAnimationName] = useState(`idle_${state}`);
  const [playTimes, setPlayTimes] = useState(Infinity);

  const src = useMemo(() => ({
    image: 'https://gw.alicdn.com/mt/TB1CHhDykP2gK0jSZPxXXacQpXa-1621-1025.png',
    ske: 'https://gw.alicdn.com/mt/TB1MxVByoz1gK0jSZLeXXb9kVXa.json',
    tex: 'https://gw.alicdn.com/mt/TB1i34Iybj1gK0jSZFuXXcrHpXa.json'
  }), []);

  const change = useCallback(() => {
    state += 1;
    const animationName = state > 6 ? 'harvest' : `idle_${state}`;
    if (animationName === 'harvest') {
      state = 1;
      ref.current.DragonBone.once('complete', () => {
        setAnimationName(`idle_${state}`);
        setPlayTimes(Infinity);
      });
      setAnimationName(animationName);
      setPlayTimes(1);
    } else {
      setAnimationName(animationName);
    }
  }, []);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <DragonBone
          ref={ref}
          src={src}
          armatureName="Armature_plant_eggplant"
          animationName={animationName}
          playTimes={playTimes}
          autoPlay={true}
          onClick={change}
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
