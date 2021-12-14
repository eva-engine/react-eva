import {
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
import { Sprite as SpriteComponent, SpriteSystem } from '@eva/plugin-renderer-sprite';

addSystem(new SpriteSystem());

export class SpriteRefObject extends EvaRefObject {
  constructor(_ref) {
    super(_ref);
  }
}

export function useSpriteResource({name, image, json}) {
  const imageType =
    typeof image === 'string'
      ? image.match(/\.(png|jpg|jpeg)/)?.[1] || 'png'
      : image.type;
  const imageUrl = typeof image === 'string' ? image : image.url;

  const jsonType = typeof json === 'string' ? 'json' : json.type;
  const jsonUrl = typeof json === 'string' ? json : json.url;

  const src = useMemo(() => {
    return {
      image: {
        type: imageType,
        url: imageUrl,
      },
      json: {
        type: jsonType,
        url: jsonUrl,
      },
    };
  }, [imageUrl, jsonUrl]);

  return useResource({
    name,
    type: ResourceType.SPRITE,
    src,
  });
}

export function useSprite({resource, spriteName}) {
  const component = useComponent(SpriteComponent, {
    resource,
    spriteName,
  });

  useMemo(() => {
    component.resource = resource;
    component.spriteName = spriteName;
  }, [resource, spriteName]);

  return component;
}

const Sprite = forwardRef<SpriteRefObject, Record<string, any>>(
  ({src, resource, spriteName, children, components = [], ...props}, ref) => {
    const _ref = useRef(null);

    useImperativeHandle(ref, () => new SpriteRefObject(_ref), []);

    if (src) {
      resource = useSpriteResource(src);
    }

    const component = useSprite({
      resource,
      spriteName,
    });

    const _components = useComponents(component, ...components);

    return (
      <gameobject ref={_ref} components={_components} {...props}>
        {children as any}
      </gameobject>
    );
  },
);

export default Sprite;
