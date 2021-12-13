import {createElement, render} from 'react';

import {
  Eva
} from '@eva/rax-eva';

function App() {
  return (
    <div id="demo" className="perspective">
      <Eva className="eva" width='100%' height={900}>
        <background className="bg">
          <b>Background</b>
        </background>
        <scene>
          <gameobject
            fill="#5E5E5E"
            fontSize={38}
          >
            Scene
          </gameobject>
        </scene>
        <hud className="hud">
          <b>HUD</b>
        </hud>
      </Eva>
      <div className="normal">
        <b>Normal</b>
      </div>
    </div>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal)
});
