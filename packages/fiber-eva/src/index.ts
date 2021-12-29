import {ReactElement} from 'react';
import {FiberRoot} from 'react-reconciler';
import createRenderer from './renderer';

const {createInstance, unmountComponentAtNode, reconciler} = createRenderer();
const Reconciler = {
  render(element: ReactElement, container: FiberRoot, props) {
    // Create a root Container if it doesnt exist
    if (!container._rootContainer) {
      container._rootContainer = null;
      container._rootContainer = reconciler.createContainer(container, false);
      createInstance(props);
      console.log('mounted');
    }

    return reconciler.updateContainer(element, container._rootContainer, null);
    // return getPublicRootInstance(container);
  },
  unmountComponentAtNode,
};
export default Reconciler;
