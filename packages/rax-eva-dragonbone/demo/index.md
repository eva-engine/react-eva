---
title: rax-eva-dragonbone demo
---

```jsx
import {createElement, render, useCallback, useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import {Eva} from '@eva/rax-eva';
import DragonBone, {useDragonBoneResource} from '@eva/rax-eva-dragonbone';


function App() {
  let state = 1;
  const ref = useRef(null);
  const [animationName, setAnimationName] = useState(`idle_${state}`);
  const [playTimes, setPlayTimes] = useState(Infinity);

  const resource = useDragonBoneResource({
    image: 'https://gw.alicdn.com/mt/TB1CHhDykP2gK0jSZPxXXacQpXa-1621-1025.png',
    ske: 'https://gw.alicdn.com/mt/TB1MxVByoz1gK0jSZLeXXb9kVXa.json',
    tex: 'https://gw.alicdn.com/mt/TB1i34Iybj1gK0jSZFuXXcrHpXa.json',
  });

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
    <Eva width={750} height={1334}>
      <scene>
        <DragonBone
          ref={ref}
          resource={resource}
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

ReactDOM.render(<App></App>, document.getElementById('root'));
```
