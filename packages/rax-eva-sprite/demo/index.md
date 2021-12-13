---
title: react-eva-sprite demo
---

```jsx
import {createElement, render} from 'react';
import ReactDOM from 'react-dom';
import {Eva} from '@eva/rax-eva';
import Sprite, {useSpriteResource} from '@eva/rax-eva-sprite';

function App() {
  const resource = useSpriteResource({
    image: 'https://gw.alicdn.com/tfs/TB13IOEDEY1gK0jSZFMXXaWcVXa-172-80.png',
    json: './public/json/05238b83ea4285cc94005ee25dad2634.json'
  });

  return (
    <Eva width={750} height={1334}>
      <scene>
        <Sprite
          resource={resource}
          spriteName="symbol_1"
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={86}
          height={80}
          y={-50}
        />
        <Sprite
          resource={resource}
          spriteName="symbol_2"
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={86}
          height={80}
          y={50}
        />
      </scene>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'));
```