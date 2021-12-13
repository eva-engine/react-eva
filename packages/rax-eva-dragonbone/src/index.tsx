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
import {DragonBone as DragonBoneComponent, DragonBoneSystem} from '@eva/plugin-renderer-dragonbone';

addSystem(new DragonBoneSystem());

export class DragonBoneRefObject extends EvaRefObject {
  constructor(_ref) {
    super(_ref);
  }

  play(animationName, times) {
    const DragonBone = this.DragonBone as DragonBoneComponent;
    DragonBone.play(animationName, times);
    return this;
  }

  stop(animationName) {
    const DragonBone = this.DragonBone as DragonBoneComponent;
    DragonBone.stop(animationName);
    return this;
  }

  on(eventName, fn) {
    const DragonBone = this.DragonBone as DragonBoneComponent;
    DragonBone.on(eventName, fn);
    return this;
  }

  off(eventName, fn) {
    const DragonBone = this.DragonBone as DragonBoneComponent;
    DragonBone.off(eventName, fn);
    return this;
  }

  once(eventName, fn) {
    const DragonBone = this.DragonBone as DragonBoneComponent;
    DragonBone.once(eventName, fn);
    return this;
  }
}

export function useDragonBoneResource({name, image, ske, tex}) {
  const imageType =
    typeof image === 'string'
      ? image.match(/\.(png|jpg|jpeg)/)?.[1] || 'png'
      : image.type;
  const imageUrl = typeof image === 'string' ? image : image.url;

  const skeType = typeof ske === 'string' ? 'json' : ske.type;
  const skeUrl = typeof ske === 'string' ? ske : ske.url;

  const texType = typeof tex === 'string' ? 'json' : tex.type;
  const texUrl = typeof tex === 'string' ? tex : tex.url;

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
      tex: {
        type: texType,
        url: texUrl,
      },
    };
  }, [imageUrl, skeUrl, texUrl]);

  return useResource({
    name,
    type: ResourceType.DRAGONBONE,
    src,
  });
}

export function useDragonBone({
  resource,
  armatureName,
  animationName,
  autoPlay,
  playTimes = Infinity,
}) {
  const component = useComponent(DragonBoneComponent, {
    resource,
    armatureName: armatureName,
    animationName: animationName,
    autoPlay: autoPlay,
  });

  useMemo(() => {
    if (component.armature) {
      component.stop(component.animationName);
    }
    component.resource = resource;
    component.armatureName = armatureName;
    component.animationName = animationName;

    if (autoPlay) {
      component.play(animationName, playTimes);
    }
  }, [resource, armatureName, animationName, autoPlay]);

  return component;
}

const DragonBone = forwardRef<DragonBoneRefObject, Record<string, any>>(
  (
    {
      src,
      resource,
      armatureName,
      animationName,
      playTimes,
      autoPlay,
      children,
      components = [],
      ...props
    },
    ref,
  ) => {
    const _ref = useRef(null);

    useImperativeHandle(ref, () => new DragonBoneRefObject(_ref), []);

    if (src) {
      resource = useDragonBoneResource(src);
    }

    const component = useDragonBone({
      resource,
      armatureName,
      animationName,
      playTimes,
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

export default DragonBone;
