import {RefObject} from 'rax-types';
import {
  EvaRefObject,
  ResourceItem,
  ResourceIdentify,
  ResourceSchema,
  EVAComponentProps
} from '@eva/rax-eva';
import {Spine as SpineComponent, SpineParams as SpineInitParams} from '@eva/plugin-renderer-spine';


declare global {
  namespace EVA {
    interface EvaRefObject {
      Spine?: SpineComponent
    }

    interface ResourceSchema {
      SPINE: {
        name?: string;
        image: string | ResourceItem<'png' | 'jpg' | 'jpeg' | 'webp' | 'svg'>;
        atlas: string | ResourceItem<'atlas'>;
        ske: string | ResourceItem<'json'>;
      };
    }
  }
}

type SpineEvents =
  | 'complete';
export interface SpineRefObject extends EvaRefObject {
  play(animationName: string, loop: boolean): SpineRefObject;
  stop(): SpineRefObject;
  on(eventName: SpineEvents, fn: () => void): SpineRefObject;
  off(eventName: SpineEvents, fn: () => void): SpineRefObject;
  once(eventName: SpineEvents, fn: () => void): SpineRefObject;
}

type SpineParams = SpineInitParams & {
  loop?: boolean;
}


interface SpineProps extends EVAComponentProps, SpineInitParams {
  ref?: RefObject<SpineRefObject>;
  src?: ResourceSchema['SPINE'];
}

export function useSpineResource(src: ResourceSchema['SPINE']): ResourceIdentify;
export function useSpine(params: SpineParams): SpineComponent;
export default function Spine(props: SpineProps): JSX.Element;
