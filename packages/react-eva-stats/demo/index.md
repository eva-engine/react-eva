---
title: react-eva-stats demo
---

```jsx
import {createElement, render, useCallback, useState} from 'react';
import ReactDOM from 'react-dom';
import {Eva} from '@eva/react-eva';
import '@eva/react-eva-stats';

function App() {

  return (
    <Eva width={750} height={750} statShow={true}>
      <scene>
        <gameobject
          anchorX={0.5}
          anchorY={0.2}
          originX={0.5}
          originY={0.5}
          fill="#b35d9e"
          fontSize={38}
        >
          react-eva-stats 测试
        </gameobject>
      </scene>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'));
```
