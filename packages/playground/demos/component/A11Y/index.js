import {createElement, useCallback, render, useState, useMemo} from 'react';

import {Eva} from '@eva/react-eva';
import Image from '@eva/react-eva-image';
import '@eva/react-eva-a11y';

const src1 = 'https://gw.alicdn.com/tfs/TB1pHcJaycKOu4jSZKbXXc19XXa-84-85.png';
const src2 = 'https://gw.alicdn.com/tfs/TB1GfBpvUT1gK0jSZFhXXaAtVXa-84-85.png';

function App() {
  const [src, setSrc] = useState(src1);

  const change = useCallback(() => {
    setSrc(pre => {
      if (pre === src1) {
        return src2;
      } else {
        return src1;
      }
    });
  }, []);

  return (
    <Eva width='100%' height='100%' a11yDebug={true} a11yActivate={true}>
      <scene>
        <Image
          onClick={change}
          src={src}
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={84}
          height={85}
          aria-label="点击切换图片"
          role="button"
        />
      </scene>
    </Eva>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal, true)
});
