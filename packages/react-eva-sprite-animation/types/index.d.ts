import {RefObject} from 'react';
import {
  EvaRefObject,
  ResourceIdentify,
  ResourceItem,
  ResourceSchema,
  EVAComponentProps
} from '@eva/react-eva';
import {SpriteAnimation as SpriteAnimationComponent, SpriteAnimationParams as SpriteAnimationInitParams} from '@eva/plugin-renderer-sprite-animation';

declare global {
  namespace EVA {
    interface EvaRefObject {
      SpriteAnimation? :SpriteAnimationComponent
    }

    interface ResourceSchema {
      SPRITE_ANIMATION: {
        name?: string;
        image: string | ResourceItem<'png' | 'jpg' | 'jpeg' | 'webp' | 'svg'>;
        json: string | ResourceItem<'json'>;
      };
    }
  }
}

type SpriteAnimationParams = SpriteAnimationInitParams;

export interface SpriteAnimationRefObject extends EvaRefObject {
  play(speed: number): void;
  stop(): void;
}

interface SpriteAnimationProps extends EVAComponentProps, SpriteAnimationInitParams {
  ref?: RefObject<SpriteAnimationRefObject>;
  src?: ResourceSchema['SPRITE_ANIMATION'];
}

export function useSpriteAnimationResource(src: ResourceSchema['SPRITE_ANIMATION']): ResourceIdentify;
export function useSpriteAnimation(params: SpriteAnimationParams): SpriteAnimationComponent;
export default function SpriteAnimation(props: SpriteAnimationProps): JSX.Element;
