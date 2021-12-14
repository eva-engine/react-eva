import {RefObject} from 'react';
import {
  EvaRefObject,
  ResourceIdentify,
  ResourceItem,
  ResourceSchema,
  EVAComponentProps
} from '@eva/react-eva';
import {Lottie as LottieComponent} from '@eva/plugin-renderer-lottie';

declare global {
  namespace EVA {
    interface EvaRefObject {
      Lottie?: LottieComponent;
    }

    interface ResourceSchema {
      LOTTIE: {
        name?: string;
        json: string | ResourceItem<'json'>;
      };
    }
  }
}

type LottieEvents = 'complete';

type vector = {
  x: number;
  y: number;
}

declare interface IStyle extends vector {
  width: number;
  height: number;
  anchor: vector;
  pivot: vector;
  TextStyle: Record<string, any>;
}

declare interface IOptions {
  repeats?: number;
  infinite?: boolean;
  slot?: Array<{
      name: string;
      type: 'TEXT' | 'IMAGE';
      value: string;
      style: IStyle;
  }>;
}

export interface LottieRefObject extends EvaRefObject {
  play(params?: Array<number>, options?: IOptions): LottieRefObject;
  onTap(name: string, fn: () => void): LottieRefObject;
  on(eventName: LottieEvents, fn: () => void): LottieRefObject;
  off(eventName: LottieEvents, fn: () => void): LottieRefObject;
  once(eventName: LottieEvents, fn: () => void): LottieRefObject;
}

type LottieParams = ConstructorParameters<typeof LottieComponent>[0] & {
  autoPlay?: boolean;
  repeats?: number;
}

interface LottieProps extends EVAComponentProps, LottieParams {
  ref?: RefObject<LottieRefObject>;
  src?: ResourceSchema['LOTTIE'] | string;
}

export function useLottieResource(src: ResourceSchema['LOTTIE']): ResourceIdentify;
export function useLottie(params: LottieParams): LottieComponent;
export default function Lottie(props: LottieProps): JSX.Element;
