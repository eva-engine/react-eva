import {RefObject} from 'rax-types';
import {
  EvaRefObject,
  EVAComponentProps
} from '@eva/rax-eva';
import {Graphics as GraphicsComponent} from '@eva/plugin-renderer-graphics';

declare global {
  namespace EVA {
    interface EvaRefObject {
      Graphics?: GraphicsComponent;
    }
  }
}

export interface GraphicsRefObject extends EvaRefObject {}

type draw = (context: GraphicsComponent) => void;

interface GraphicsProps extends EVAComponentProps {
  ref?: RefObject<GraphicsRefObject>;
  draw: draw;
}

export function useGraphics(
  draw: draw,
  deps?: any[],
);
export default function Graphics(props: GraphicsProps): JSX.Element;
