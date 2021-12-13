import {createElement, render} from 'react';

import {Eva} from '@eva/rax-eva';
import Image from '@eva/rax-eva-image';

function App() {
  return (
    <Eva width='100%' height='100%'>
      <scene>
        <Image
          src="https://gw.alicdn.com/tfs/TB1c16edmR26e4jSZFEXXbwuXXa-357-72.png"
          width={714}
          height={144}
        />
      </scene>
    </Eva>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal)
});
