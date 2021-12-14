import {RefObject} from 'react';
import {Component} from '@eva/eva.js';
import {
  EvaRefObject,
  EVAComponentProps
} from '@eva/react-eva';
import {Transition as TransitionComponent} from '@eva/plugin-transition';

declare global {
  namespace EVA {
    interface EvaRefObject {
      Transition?: TransitionComponent
    }
  }
}

type TransitionComponentEvent = 'finish';

export interface TransitionRefObject extends EvaRefObject {
  play(name: string, iteration?: number): this;
  stop(name: string): this;
  on(eventName: TransitionComponentEvent, fn: () => void): this;
  off(eventName: TransitionComponentEvent, fn: () => void): this;
  once(eventName: TransitionComponentEvent, fn: () => void): this;
}

interface TransitionData {
  name: string;
  component: Component;
  values: {
      time: number;
      value: number;
      tween?: string;
  }[];
}

interface TransitionGroup {
  [propName: string]: TransitionData[];
}

type initial = (context: EvaRefObject) => TransitionGroup;

interface TransitionProps extends EVAComponentProps {
  ref?: RefObject<TransitionRefObject>;
  initial: initial;
}

export function useTransition(initial: initial, deps?: any[]): TransitionComponent;
export default function Transition(props: TransitionProps): JSX.Element;
