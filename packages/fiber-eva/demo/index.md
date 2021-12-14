---
title: fiber-eva demo
---

```jsx
import {
  createElement,
  render,
  useState,
  useCallback,
  Fragment,
  useRef,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';
import ReactDOM from 'react-dom';
// import {Eva} from '@eva/rax-eva';
// import Image, {useImageResource} from '@eva/rax-eva-image';

function App() {
  const [remove, setRemove] = useState(false);
  const [alpha, setAlpha] = useState(1);
  const [scale, setScale] = useState(1);
  const clicked = useCallback(() => {
    alert(1);
    setAlpha(pre => {
      if (pre === 1) {
        return 0.5;
      } else {
        return 1;
      }
    });
    setScale(pre => {
      if (pre === 1) {
        return 1.2;
      } else {
        return 1;
      }
    });
  }, []);

  const toggle = useCallback(() => {
    alert(2);
    setRemove(pre => !pre);
  }, []);
  // const resource1 = useImageResource({
  //   image: 'https://gw.alicdn.com/tfs/TB1pHcJaycKOu4jSZKbXXc19XXa-84-85.png',
  // });

  // const resource2 = useImageResource({
  //   image: '//gw.alicdn.com/tfs/TB1Gbb.ONv1gK0jSZFFXXb0sXXa-159-44.png',
  // });

  // const [resource, setResource] = useState(resource1);

  const change = useCallback(() => {
    setResource(pre => {
      if (pre === resource1) {
        return resource2;
      } else {
        return resource1;
      }
    });
  }, []);

  return (
    <eva width={750} height={1334} transparent={true}>
      <background
        style={{
          background: '#000',
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'flex-start',
        }}
      >
        <img
          src="//gw.alicdn.com/tfs/TB1c16edmR26e4jSZFEXXbwuXXa-357-72.png"
          style={{width: 600, marginTop: 500}}
        />
      </background>
      <scene>
        {!remove ? (
          <gameobject
            onClick={clicked}
            anchorX={0.5}
            anchorY={0.5}
            scaleX={scale}
            scaleY={scale}
            originX={0.5}
            originY={0.5}
            scaleX={scale}
            scaleY={scale}
            fill="#fff"
            fontSize={38}
            alpha={alpha}
          >
            用于开发互动的React解决方案
          </gameobject>
        ) : null}
      </scene>
      <hud
        style={{
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'flex-end',
        }}
      >
        <div style={{marginBottom: 500}} onClick={toggle}>
          <img src="//gw.alicdn.com/tfs/TB1Gbb.ONv1gK0jSZFFXXb0sXXa-159-44.png" />
        </div>
      </hud>
    </eva>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```
