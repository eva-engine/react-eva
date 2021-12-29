import {FiberRoot} from 'react-reconciler';
// // export default function Reconciler(element: any, root: any): ReactNode;

export const Reconciler: {
  render: (element: React.ReactElement, root: FiberRoot, props: any) => void;
  unmountComponentAtNode: (root: FiberRoot, callback: any) => void;
};
export default Reconciler;

