---
title: react-eva-spine demo
---

```jsx
import {createElement, render, useCallback, useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import {Eva} from '@eva/rax-eva';
import Spine, {useSpineResource} from '@eva/rax-eva-spine';

function App() {
  const [animationName, setAnimationName] = useState(`idle`);

  const resource = useSpineResource({
    image: 'https://gw.alicdn.com/tfs/TB18mfY1FY7gK0jSZKzXXaikpXa-805-804.png',
    ske: './public/json/08a16034db954b2dc2c7f7cff38d5b4c.json',
    atlas: './public/json/41799e38f99969d2d6f39c4fa75f8861.atlas',
  });

  const change = useCallback(() => {
    setAnimationName(pre =>
      pre === 'idle' ? 'pet' : pre === 'pet' ? 'feed' : 'idle',
    );
  }, []);

  return (
    <Eva width={750} height={1334}>
      <scene>
        <Spine
          resource={resource}
          animationName={animationName}
          loop={true}
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
