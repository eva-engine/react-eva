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
  useComponent,
  useResource,
  ResourceType,
  useComponents,
} from '@eva/rax-eva';
import {Spine as SpineComponent, SpineSystem} from '@eva/plugin-renderer-spine';

addSystem(new SpineSystem());

export class SpineRefObject extends EvaRefObject {
  constructor(_ref) {
    super(_ref);
  }

  play(animationName, loop) {
    const Spine = this.Spine as SpineComponent;
    Spine.play(animationName, loop);
    return this;
  }

  stop() {
    const Spine = this.Spine as SpineComponent;
    Spine.stop();
    return this;
  }

  on(eventName, fn) {
    const Spine = this.Spine as SpineComponent;
    Spine.on(eventName, fn);
    return this;
  }

  off(eventName, fn) {
    const Spine = this.Spine as SpineComponent;
    Spine.off(eventName, fn);
    return this;
  }

  once(eventName, fn) {
    const Spine = this.Spine as SpineComponent;
    Spine.once(eventName, fn);
    return this;
  }
}

export function useSpineResource({name, image, ske, atlas}) {
  const imageType =
    typeof image === 'string'
      ? image.match(/\.(png|jpg|jpeg)/)?.[1] || 'png'
      : image.type;
  const imageUrl = typeof image === 'string' ? image : image.url;

  const skeType = typeof ske === 'string' ? 'json' : ske.type;
  const skeUrl = typeof ske === 'string' ? ske : ske.url;

  const atlasType = typeof atlas === 'string' ? 'atlas' : atlas.type;
  const atlasUrl = typeof atlas === 'string' ? atlas : atlas.url;

  const src = useMemo(() => {
    return {
      image: {
        type: imageType,
        url: imageUrl,
      },
      ske: {
        type: skeType,
        url: skeUrl,
      },
      atlas: {
        type: atlasType,
        url: atlasUrl,
      },
    };
  }, [imageUrl, skeUrl, atlasUrl]);

  return useResource({
    name,
    type: ResourceType.SPINE,
    src,
  });
}

export function useSpine({
  resource,
  animationName,
  loop = false,
  autoPlay = false
}) {
  const component = useComponent(SpineComponent, {
    resource,
    animationName,
    autoPlay
  });

  useMemo(() => {
    if (component.animationName) {
      component.stop();
    }

    component.resource = resource;
    component.animationName = animationName;

    if (autoPlay) {
      component.play(animationName, loop);
    }
  }, [resource, animationName, loop, autoPlay]);

  return component;
}

const Spine = forwardRef<SpineRefObject, Record<string, any>>(
  (
    {
      src,
      resource,
      animationName,
      loop,
      autoPlay,
      children,
      components = [],
      ...props
    },
    ref,
  ) => {
    const _ref = useRef(null);

    useImperativeHandle(ref, () => new SpineRefObject(_ref), []);

    if (src) {
      resource = useSpineResource(src);
    }

    const component = useSpine({
      resource,
      animationName,
      loop,
      autoPlay,
    });

    const _components = useComponents(component, ...components);

    return (
      <gameobject ref={_ref} components={_components} {...props}>
        {children as any}
      </gameobject>
    );
  },
);

export default Spine;
