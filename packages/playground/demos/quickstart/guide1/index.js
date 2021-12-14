import {createElement, render} from 'react';

import {Eva} from '@eva/react-eva';

function App() {
  return (
    <Eva width='100%' height='100%'>
      <scene>
        <gameobject fill="#fff" fontSize={38}>
          Hello React EVA
        </gameobject>
      </scene>
    </Eva>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEVA(DriverUniversal),
});
