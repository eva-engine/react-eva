import {createElement, render, useRef, useEffect, useCallback} from 'react';

import { Component, decorators, System, OBSERVER_TYPE, GameObject } from '@eva/eva.js';
import {Eva, addSystem, ResourceType, useComponent, useComponents} from '@eva/rax-eva';
import {useImageResource, useImage} from '@eva/rax-eva-image';

class Change extends Component {
  static componentName = 'Change';
  resource = '';
  originResource = '';
  useOrigin = true;

  init(params) {
    this.resource = params.resource;
  }

  change() {
    this.useOrigin = !this.useOrigin;
  }
}

@decorators.componentObserver({
  'Change': ['useOrigin']
})
class ChangeSystem extends System {
  update() {
    const changed = this.componentObserver.clear();

    for (const {gameObject, type} of changed) {
      const imgComponent = gameObject.getComponent('Img');
      const changeComponent = gameObject.getComponent('Change');

      if (type === OBSERVER_TYPE.ADD) {
        changeComponent.originResource = imgComponent.resource;
      } else if (type === OBSERVER_TYPE.CHANGE) {
        imgComponent.resource = changeComponent.useOrigin ? changeComponent.originResource : changeComponent.resource;
      } else if (type === OBSERVER_TYPE.REMOVE) {
        imgComponent.resource = changeComponent.originResource;
        this.helpGameObjects[gameObject.name] = undefined;
        delete this.helpGameObjects[gameObject.name];
      }
    }
  }
}

addSystem(new ChangeSystem());

function App() {
  const resource1 = useImageResource({
    image: 'https://gw.alicdn.com/tfs/TB1pHcJaycKOu4jSZKbXXc19XXa-84-85.png'
  });

  const image = useImage({
    resource: resource1
  })

  const resource2 = useImageResource({
    image: 'https://gw.alicdn.com/tfs/TB1GfBpvUT1gK0jSZFhXXaAtVXa-84-85.png'
  });

  const change = new Change({
    resource: resource2
  });

  const components = useComponents(image, change);

  const clicked = useCallback(() => {
    change.change();
  }, [])

  return (
    <Eva width="100%" height="100%">
      <scene>
        <gameobject
          components={components}
          onClick={clicked}
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          width={84}
          height={85}
        />
      </scene>
    </Eva>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal)
});
