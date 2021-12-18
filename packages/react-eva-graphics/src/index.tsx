import React, {
  createElement,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import {
  addSystem,
  EvaRefObject,
  useComponent,
  useComponents,
} from '@eva/react-eva';
import {Graphics as GraphicsComponent, GraphicsSystem} from '@eva/plugin-renderer-graphics';

addSystem(new GraphicsSystem());

export class GraphicsRefObject extends EvaRefObject {
  constructor(_ref) {
    super(_ref);
  }
}

export function useGraphics(draw, deps = []) {
  const component = useComponent(GraphicsComponent);

  useEffect(() => {
    draw(component);
  }, deps);

  return component;
}

const Graphics = forwardRef<GraphicsRefObject, Record<string, any>>(
  ({draw, children, components = [], ...props}, ref) => {
    const _ref = useRef(null);

    useImperativeHandle(ref, () => new GraphicsRefObject(_ref), []);

    const component = useGraphics(draw, [draw]);

    const _components = useComponents(component, ...components);

    return (
      <gameobject ref={_ref} components={_components} {...props}>
        {children as any}
      </gameobject>
    );
  },
);

export default Graphics;
