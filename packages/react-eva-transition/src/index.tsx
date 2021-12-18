import React, {
  createElement,
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import {addSystem, EvaRefObject, useComponent, useComponents} from '@eva/react-eva';
import {Transition as TransitionComponent, TransitionSystem} from '@eva/plugin-transition';

addSystem(new TransitionSystem());

export class TransitionRefObject extends EvaRefObject {
  constructor(_ref) {
    super(_ref);
  }
  play(name, iteration = 1) {
    const Transition = this.Transition as TransitionComponent;
    Transition.play(name, iteration);
    return this;
  }
  stop(name) {
    const Transition = this.Transition as TransitionComponent;
    Transition.stop(name);
    return this;
  }
  on(eventName, fn) {
    const Transition = this.Transition as TransitionComponent;
    Transition.on(eventName, fn);
    return this;
  }

  off(eventName, fn) {
    const Transition = this.Transition as TransitionComponent;
    Transition.off(eventName, fn);
    return this;
  }

  once(eventName, fn) {
    const Transition = this.Transition as TransitionComponent;
    Transition.once(eventName, fn);
    return this;
  }
}

export function useTransition(initial, deps = []) {
  const component = useComponent(TransitionComponent, {
    group: {}
  });

  useEffect(() => {
    if (component.gameObject) {
      const refObject = new EvaRefObject({current: component.gameObject});
      component.group = initial(refObject);
    }
  }, deps);

  return component;
}

const Transition = forwardRef<TransitionRefObject, Record<string, any>>(
  ({initial, children, components = [], ...props}, ref) => {
    const _ref = useRef(null);

    useImperativeHandle(ref, () => new TransitionRefObject(_ref), []);

    const component = useTransition(initial, [initial]);

    const _components = useComponents(component, ...components);

    return (
      <gameobject ref={_ref} components={_components} {...props}>
        {children as any}
      </gameobject>
    );
  },
);

export default Transition;
