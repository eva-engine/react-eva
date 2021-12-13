import {createElement, render} from 'react';

import {Eva} from '@eva/rax-eva';
import Image from '@eva/rax-eva-image';

function App() {
  return (
    <Eva width='100%' height='100%'>
      <scene>
        <Image
          src="https://gw.alicdn.com/tfs/TB1pHcJaycKOu4jSZKbXXc19XXa-84-85.png"
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={84}
          height={85}
        />
      </scene>
    </Eva>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal)
});
