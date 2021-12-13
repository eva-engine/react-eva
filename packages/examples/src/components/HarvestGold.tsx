import {
  createElement,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {useComponents, usePreload, useEva} from '@eva/rax-eva';
import Image from '@eva/rax-eva-image';
import {useTransition} from '@eva/rax-eva-transition';

export interface HarvestGoldRef {
  play(): void;
  onfinish(handler: () => void): void;
}

const HarvestGold = forwardRef<HarvestGoldRef, Record<string, any>>((props: any, ref) => {
  const width = 60;
  const height = 60;

  const preload = usePreload();
  const eva = useEva();

  const transition = useTransition(
    ({Render, Transform}) => {
      if (!eva) return {};

      const x = (eva.currentSceneSize.width - width) / 2;
      const y = (eva.currentSceneSize.height - height) / 2;

      const goldIconDOMRect = document
        .querySelector('.nav .goldinfo .icon')
        .getBoundingClientRect();

      const goldIconGameRect = eva.fromDOMRect(goldIconDOMRect);

      return {
        harvest: [
          {
            name: 'alpha',
            component: Render,
            values: [
              {
                time: 0,
                value: 0,
                tween: 'ease-in',
              },
              {
                time: 300,
                value: 1,
                tween: 'linear',
              },
              {
                time: 700,
                value: 1,
                tween: 'ease-out',
              },
              {
                time: 1000,
                value: 0,
              },
            ],
          },
          {
            name: 'position.x',
            component: Transform,
            values: [
              {
                time: 0,
                value: x,
                tween: 'linear',
              },
              {
                time: 300,
                value: x,
                tween: 'ease-out',
              },
              {
                time: 1000,
                value: goldIconGameRect.x,
              },
            ],
          },
          {
            name: 'position.y',
            component: Transform,
            values: [
              {
                time: 0,
                value: y,
                tween: 'linear',
              },
              {
                time: 300,
                value: y,
                tween: 'ease-out',
              },
              {
                time: 1000,
                value: goldIconGameRect.y,
              },
            ],
          },
        ],
      };
    },
    [eva],
  );

  const components = useComponents(transition);

  useImperativeHandle(
    ref,
    () => ({
      play() {
        transition.play('harvest', 1);
      },
      onfinish(handler) {
        transition.on('finish', handler);
      },
    }),
    [],
  );

  return (
    <Image
      {...props}
      resource={preload.resources.gold}
      alpha={0}
      components={components}
      width={width}
      height={height}
      originX={0}
      originY={0}
    />
  );
});

export default HarvestGold;
