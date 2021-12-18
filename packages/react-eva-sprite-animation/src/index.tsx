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
import {SpriteAnimation as SpriteAnimationComponent, SpriteAnimationSystem} from '@eva/plugin-renderer-sprite-animation';

addSystem(new SpriteAnimationSystem());

export class SpriteAnimationRefObject extends EvaRefObject {
  constructor(_ref) {
    super(_ref);
  }

  play(speed) {
    const SpriteAnimation = this.SpriteAnimation as SpriteAnimationComponent;
    SpriteAnimation.speed = speed;
    SpriteAnimation.play();
  }

  stop() {
    const SpriteAnimation = this.SpriteAnimation as SpriteAnimationComponent;
    SpriteAnimation.stop();
  }
}

export function useSpriteAnimationResource({name, image, json}) {
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
    type: ResourceType.SPRITE_ANIMATION,
    src,
  });
}

export function useSpriteAnimation({resource, speed, autoPlay}) {
  const component = useComponent(SpriteAnimationComponent, {
    resource,
    speed,
    autoPlay
  });

  useMemo(() => {
    component.resource = resource;
    component.speed = speed;
    component.autoPlay = autoPlay
  }, [resource, speed, autoPlay]);

  return component;
}

const SpriteAnimation = forwardRef<SpriteAnimationRefObject, Record<string, any>>(
  ({src, resource, speed, autoPlay, children, components = [], ...props}, ref) => {
    const _ref = useRef(null);

    useImperativeHandle(ref, () => new SpriteAnimationRefObject(_ref), []);

    if (src) {
      resource = useSpriteAnimationResource(src);
    }

    const component = useSpriteAnimation({
      resource,
      speed,
      autoPlay
    });

    const _components = useComponents(component, ...components);

    return (
      <gameobject ref={_ref} components={_components} {...props}>
        {children as any}
      </gameobject>
    );
  },
);

export default SpriteAnimation;
