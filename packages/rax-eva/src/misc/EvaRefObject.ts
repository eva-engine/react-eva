import {RefObject} from 'react';
import {GameObject} from '@eva/eva.js';

export default class EvaRefObject {
  gameobject: GameObject;

  constructor(ref: RefObject<GameObject>) {
    this.gameobject = ref.current;

    for (const component of this.gameobject.components) {
      this[component.name] = component;
    }
  }
}
