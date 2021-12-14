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
  useComponents,
} from '@eva/react-eva';
import {Lottie as LottieComponent, LottieSystem} from '@eva/plugin-renderer-lottie';

addSystem(new LottieSystem());

export class LottieRefObject extends EvaRefObject {
  constructor(_ref) {
    super(_ref);
  }

  play(params = [], options = {repeats: 1}) {
    const lottie = this.Lottie as LottieComponent;
    lottie.play(params, options);
    return this;
  }

  onTap(name, fn) {
    const lottie = this.Lottie as LottieComponent;
    lottie.onTap(name, fn);
    return this;
  }

  on(eventName, fn) {
    const lottie = this.Lottie as LottieComponent;
    lottie.on(eventName, fn);
    return this;
  }

  off(eventName, fn) {
    const lottie = this.Lottie as LottieComponent;
    lottie.off(eventName, fn);
    return this;
  }

  once(eventName, fn) {
    const lottie = this.Lottie as LottieComponent;
    lottie.once(eventName, fn);
    return this;
  }
}

export function useLottieResource({name = undefined, json}) {
  const jsonType = typeof json === 'string' ? 'json' : json.type;
  const jsonUrl = typeof json === 'string' ? json : json.url;

  const src = useMemo(() => {
    return {
      json: {
        type: jsonType,
        url: jsonUrl,
      },
    };
  }, [jsonUrl]);

  return useResource({
    name,
    type: 'LOTTIE',
    src,
  });
}

export function useLottie({
  resource,
  width,
  height,
  autoPlay,
  repeats
}) {
  const component = useComponent(LottieComponent, {
    resource,
    width: width,
    height: height
  });

  useMemo(() => {
    if (autoPlay) {
      component.play([], {repeats: repeats ?? 1})
    }
  }, []);

  return component;
}

const Lottie = forwardRef<LottieRefObject, Record<string, any>>(
  (
    {
      src,
      resource,
      width,
      height,
      repeats,
      autoPlay,
      children,
      components = [],
      ...props
    },
    ref,
  ) => {
    const _ref = useRef(null);

    useImperativeHandle(ref, () => new LottieRefObject(_ref), []);

    if (src) {
      if (typeof src === 'string') {
        resource = useLottieResource({
          json: src
        });
      } else {
        resource = useLottieResource(src);
      }
    }

    const component = useLottie({
      resource,
      width,
      height,
      repeats,
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

export default Lottie;
