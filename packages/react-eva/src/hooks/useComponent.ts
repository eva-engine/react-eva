import {useMemo} from 'react';

export default function useComponent(ComponentClass, params) {
  if (!(typeof ComponentClass === 'function')) {
    throw new Error('ComponentClass must be a class function of component');
  }

  const component = useMemo(() => new ComponentClass(params), []);
  return component;
}
