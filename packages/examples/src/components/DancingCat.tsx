import {
  createElement,
  useEffect,
} from 'react';
import {usePreload} from '@eva/rax-eva';
import '@eva/rax-eva-a11y';
import Spine from '@eva/rax-eva-spine';
import { useMask } from '@eva/rax-eva-mask';
import { useTransition } from '@eva/rax-eva-transition';

export default function DancingCat() {
  const preload = usePreload();

  const mask = useMask({
    type: 'Circle',
    style: {
      x: 0,
      y: -280,
      radius: 100
    },
  });

  const transition = useTransition(() => ({
    bounceIn: [{
      name: 'style.radius',
      component: mask,
      values: [{
        time: 0,
        value: 100,
        tween: 'ease-in'
      },{
        time: 1000,
        value: 500,
        tween: 'ease-in'
      }]
    }]
  }), []);

  useEffect(() => {
    transition.play('bounceIn', 1);
  }, []);

  return (
    <Spine
      resource={preload.resources.cat}
      animationName="idle"
      scaleX={0.4}
      scaleY={0.4}
      anchorX={0.5}
      anchorY={0.5}
      originX={0.5}
      originY={0.5}
      x={-200}
      autoPlay={true}
      role="text"
      aria-label="双11星秀喵"
      components={[mask, transition]}
    />
  );
}
