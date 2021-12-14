import {useMemo} from 'react';
import {Component} from '@eva/eva.js';

export default function useComponents(...components: Component[]) {
  return useMemo<Component[]>(() => {
    if (!components) {
      components = [];
    }

    return components;
  }, [...components]);
}
