import {createElement, render, useCallback, useEffect} from 'react';

import {Eva, useComponents} from '@eva/react-eva';
import {useGraphics} from '@eva/react-eva-graphics';

function App() {
  const drawOutter = useCallback(context => {
    context.graphics.beginFill(0xde3249, 1);
    context.graphics.drawRoundedRect(0, 0, 300, 48, 24);
    context.graphics.endFill();
  }, []);
  const outterGraphics = useGraphics(drawOutter);
  const outterComponent = useComponents(outterGraphics);

  const drawInner = useCallback((context, time = 0) => {
    const width = Math.max(40, Math.min(292, 292 * ((time % 5000) / 5000)));
    context.graphics.clear();
    context.graphics.beginFill(0x000000, 1);
    context.graphics.drawRoundedRect(0, 0, width, 40, 20);
    context.graphics.endFill();
  }, []);
  const innerGraphics = useGraphics(drawInner);
  const innerComponent = useComponents(innerGraphics);

  useEffect(() => {
    let lastTime = Date.now();
    function draw() {
      requestAnimationFrame(draw);
      drawInner(innerGraphics, Date.now() - lastTime);
    }
    draw();
  }, []);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <gameobject
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={300}
          height={48}
          components={outterComponent}
        />
        <gameobject
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={292}
          height={40}
          components={innerComponent}
        />
      </scene>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal),
});
