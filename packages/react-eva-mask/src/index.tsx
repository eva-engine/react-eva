import React, {
  createElement,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  addSystem,
  EvaRefObject,
  useComponent,
  useComponents,
} from '@eva/react-eva';
import {Mask as MaskComponent, MaskSystem, MASK_TYPE} from '@eva/plugin-renderer-mask';

addSystem(new MaskSystem());

export const MaskType = MASK_TYPE;

export class MaskRefObject extends EvaRefObject {
  constructor(_ref) {
    super(_ref);
  }
}

export function useMask({
  type,
  style,
  resource,
  spriteName,
}) {
  const component = useComponent(MaskComponent, {
    type,
    style,
    resource,
  });

  useMemo(() => {
    component.type = type;
    component.style = style;
    component.resource = resource;
    component.spriteName = spriteName;
  }, [type, ...Object.values(style), resource, spriteName]);

  return component;
}

const Mask = forwardRef<MaskRefObject, Record<string, any>>(
  ({type, x, y, width, height, radius, paths, resource, spriteName, components = [], children, ...props}, ref) => {
    const _ref = useRef(null);

    useImperativeHandle(ref, () => new MaskRefObject(_ref), []);

    const component = useMask({
      type,
      style: {
        x,
        y,
        width,
        height,
        radius,
        paths,
      },
      resource,
      spriteName
    });

    const _components = useComponents(component, ...components);

    return (
      <gameobject ref={_ref} components={_components} {...props}>
        {children as any}
      </gameobject>
    );
  },
);

export default Mask;
