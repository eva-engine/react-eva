import {RefObject} from 'react';
import {
  EvaRefObject,
  ResourceIdentify,
  ResourceItem,
  ResourceSchema,
  EVAComponentProps
} from '@eva/react-eva';
import {DragonBone as DragonBoneComponent, DragonBoneParams as DragonBoneInitParams} from '@eva/plugin-renderer-dragonbone';

declare global {
  namespace EVA {
    interface EvaRefObject {
      DragonBone?: DragonBoneComponent;
    }

    interface ResourceSchema {
      DRAGONBONE: {
        name?: string;
        image: string | ResourceItem<'png' | 'jpg' | 'jpeg' | 'webp' | 'svg'>;
        tex: string | ResourceItem<'json'>;
        ske: string | ResourceItem<'json'>;
      };
    }
  }
}

type DragonBoneEvents =
  | 'start'
  | 'loopComplete'
  | 'complete'
  | 'fadeIn'
  | 'fadeInComplete'
  | 'fadeOut'
  | 'fadeOutComplete'
  | 'frameEvent'
  | 'soundEvent';
export interface DragonBoneRefObject extends EvaRefObject {
  play(animationName: string, times?: number): DragonBoneRefObject;
  stop(animationName: string): DragonBoneRefObject;
  on(eventName: DragonBoneEvents, fn: () => void): DragonBoneRefObject;
  off(eventName: DragonBoneEvents, fn: () => void): DragonBoneRefObject;
  once(eventName: DragonBoneEvents, fn: () => void): DragonBoneRefObject;
}

type DragonBoneParams = DragonBoneInitParams & {
  playTimes?: number;
}

interface DragonBoneProps extends EVAComponentProps, DragonBoneParams {
  ref?: RefObject<DragonBoneRefObject>;
  src?: ResourceSchema['DRAGONBONE'];
}

export function useDragonBoneResource(src: ResourceSchema['DRAGONBONE']): ResourceIdentify;
export function useDragonBone(params: DragonBoneParams): DragonBoneComponent;
export default function DragonBone(props: DragonBoneProps): JSX.Element;
