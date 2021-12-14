import {
  createElement
} from 'react';
import {
  useResource,
  useComponents,
  ResourceType,
  addSystem,
} from '@eva/react-eva';
import {Img, ImgSystem} from '@eva/plugin-renderer-img';

addSystem(new ImgSystem());

function useImageResource(src) {
  return useResource({
    type: ResourceType.IMAGE,
    src: {
      image: {
        type: 'png',
        url: src
      }
    }
  });
}

function Image({resource, children}) {
  const component = new Img({
    resource
  });

  const components = useComponents(component);

  return (
    <gameobject components={components}>
      {children}
    </gameobject>
  );
}
