import {ReactElement} from 'react';
import {FiberRoot} from 'react-reconciler';
import createRenderer from './renderer';

// const containers = new Map<FiberRoot, any>();

function getPublicRootInstance(container: FiberRoot) {
  const containerFiber = container.current;
  if (!containerFiber.child) {
    return null;
  }
  return containerFiber.child.stateNode;
}
const {createInstance, reconciler} = createRenderer();
// export {createInstance, reconciler};
const Reconciler = {
  render(element: ReactElement, container: FiberRoot, props) {
    // Create a root Container if it doesnt exist
    if (!container._rootContainer) {
      container._rootContainer = reconciler.createContainer(container, false);
      createInstance(props);
    }

    return reconciler.updateContainer(element, container._rootContainer, null);
    // return getPublicRootInstance(container);
  },

  unmountComponentAtNode(container: FiberRoot) {
    // alert(2)
    // reconciler.updateContainer(null, container._rootContainer, null, () => {
    //   //noop
    // });
  },
};
export default Reconciler;
