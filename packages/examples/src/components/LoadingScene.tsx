import {createElement, useCallback} from 'react';
import {useComponents, usePreload} from '@eva/react-eva';
import {useGraphics} from '@eva/react-eva-graphics';

export default function LoadingScene() {
  const preload = usePreload();

  const drawOutter = useCallback(context => {
    context.graphics.beginFill(0x000000, 1);
    context.graphics.drawRoundedRect(0, 0, 300, 48, 24);
    context.graphics.endFill();
  }, []);
  const outterGraphics = useGraphics(drawOutter);
  const outterComponent = useComponents(outterGraphics);

  const drawInner = useCallback((context, percent?: number) => {
    const width = Math.max(40, Math.min(292, 292 * percent));
    context.graphics.clear();
    context.graphics.beginFill(0xde3249, 1);
    context.graphics.drawRoundedRect(0, 0, width, 40, 20);
    context.graphics.endFill();
  }, []);
  const innerGraphics = useGraphics(drawInner);
  const innerComponent = useComponents(innerGraphics);

  preload.onProgress(e => {
    drawInner(innerGraphics, e.progress / 100);
  });

  return (
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
  );
}
