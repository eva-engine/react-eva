import {
  createElement,
  useMemo,
  useRef,
  useImperativeHandle,
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
import {Img, ImgSystem} from '@eva/plugin-renderer-img';

addSystem(new ImgSystem());
export class ImageRefObject extends EvaRefObject {
  constructor(_ref) {
    super(_ref);
  }
}

export function useImageResource({name = undefined, image}) {
  const imageType =
    typeof image === 'string'
      ? image.match(/\.(png|jpg|jpeg)/)?.[1] || 'png'
      : image.type;
  const imageUrl = typeof image === 'string' ? image : image.url;

  const src = useMemo(
    () => ({
      image: {
        type: imageType,
        url: imageUrl,
      },
    }),
    [imageUrl],
  );

  return useResource({
    name,
    type: ResourceType.IMAGE,
    src,
  });
}

export function useImage({resource}) {
  const component = useComponent(Img, {
    resource,
  });

  useMemo(() => {
    component.resource = resource;
  }, [resource]);

  return component;
}

const Image = forwardRef<ImageRefObject, Record<string, any>>(
  ({src, resource, components = [], children, ...props}, ref) => {
    const _ref = useRef(null);
    useImperativeHandle(ref, () => new ImageRefObject(_ref), []);

    if (src) {
      if (typeof src === 'string') {
        resource = useImageResource({
          image: src
        });
      } else {
        resource = useImageResource(src);
      }
    }

    const component = useImage({resource});

    const _components = useComponents(component, ...components);

    return (
      <gameobject ref={_ref} components={_components} {...props}>
        {children as any}
      </gameobject>
    );
  },
);

export default Image;
