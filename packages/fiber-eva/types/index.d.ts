import {FiberRoot} from 'react-reconciler';
// // export default function Reconciler(element: any, root: any): ReactNode;

export const Reconciler: {
  render: (element: React.ReactElement, root: FiberRoot, props: any) => void;
  unmountComponentAtNode: (root: FiberRoot, callback: any) => void;
};
export default Reconciler;
// export default class Driver {
//   constructor(driver: any, debug?: boolean);
//   createBody(): void;
//   createEmpty(component: any): void;
//   createText(): void;
//   updateText(node: any, text: any);
//   createElement(type: any, props: any, component: any);
//   appendChild(node: any, parent: any);
//   removeChild(node: any, parent: any);
//   replaceChild(newChild: any, oldChild: any, parent: any);
//   insertAfter(node: any, after: any, parent: any);
//   insertBefore(node: any, before: any, parent: any);
//   addEventListener(node: any, eventName: any, eventHandler: any);
//   removeEventListener(node: any, eventName: any, eventHandler: any);
//   setAttribute(node: any, propKey: any, propValue: any);
//   removeAttribute(node: any, propKey: any);
//   setStyle(node: any, styleObject: any);
// }
