import React, {
  createElement,
  useImperativeHandle,
  useRef,
  useMemo,
  forwardRef,
} from 'react';
import {
  addSystem,
  EvaRefObject,
  useResource,
  ResourceType,
  useComponent,
  useComponents,
} from '@eva/react-eva';
import {
  TilingSprite as TilingSpriteComponent,
  TilingSpriteSystem,
} from '@eva/plugin-renderer-tiling-sprite';

addSystem(new TilingSpriteSystem());

export class TilingSpriteRefObject extends EvaRefObject {
  constructor(_ref) {
    super(_ref);
  }
}

export function useTilingSpriteResource({name = undefined, image}) {
  const imageType =
    typeof image === 'string'
      ? image.match(/\.(png|jpg|jpeg)/)?.[1] || 'png'
      : image.type;
  const imageUrl = typeof image === 'string' ? image : image.url;

  const src = useMemo(() => {
    return {
      image: {
        type: imageType,
        url: imageUrl,
      }

    };
  }, [imageUrl]);

  return useResource({
    name,
    type: ResourceType.IMAGE,
    src,
  });
}

export function useTilingSprite({
  resource,
  tileScaleX,
  tileScaleY,
  tilePositionX,
  tilePositionY
}) {
  const component = useComponent(TilingSpriteComponent, {
    resource,
    tileScale: {
      x: tileScaleX ?? 1,
      y: tileScaleY ?? 1
    },
    tilePosition: {
      x: tilePositionX ?? 0,
      y: tilePositionY ?? 0
    },
  });

  useMemo(() => {
    component.resource = resource;
    component.tileScale.x = tileScaleX ?? component.tileScale.x;
    component.tileScale.y = tileScaleY ?? component.tileScale.y;
    component.tilePosition.x = tilePositionX ?? component.tilePosition.x;
    component.tilePosition.y = tilePositionY ?? component.tilePosition.x;
  }, [resource, tileScaleX, tileScaleY, tilePositionX, tilePositionY]);

  return component;
}

const TilingSprite = forwardRef<TilingSpriteRefObject, Record<string, any>>(
  ({src, resource, tileScaleX, tileScaleY, tilePositionX, tilePositionY, children, components = [], ...props}, ref) => {
    const _ref = useRef(null);

    useImperativeHandle(ref, () => new TilingSpriteRefObject(_ref), []);

    if (src) {
      if (typeof src === 'string') {
        resource = useTilingSpriteResource({
          image: src
        });
      } else {
        resource = useTilingSpriteResource(src);
      }
    }

    const component = useTilingSprite({
      resource,
      tileScaleX,
      tileScaleY,
      tilePositionX,
      tilePositionY
    });

    const _components = useComponents(component, ...components);

    return (
      <gameobject ref={_ref} components={_components} {...props}>
        {children as any}
      </gameobject>
    );
  },
);

export default TilingSprite;
