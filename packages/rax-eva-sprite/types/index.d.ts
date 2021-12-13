import {RefObject} from 'rax-types';
import {
  EvaRefObject,
  ResourceIdentify,
  ResourceItem,
  ResourceSchema,
  EVAComponentProps
} from '@eva/rax-eva';
import {Sprite as SpriteComponent, SpriteParams as SpriteInitParams} from '@eva/plugin-renderer-sprite';

declare global {
  namespace EVA {
    interface EvaRefObject {
      Sprite?: SpriteComponent
    }

    interface ResourceSchema {
      SPRITE: {
        name?: string;
        image: string | ResourceItem<'png' | 'jpg' | 'jpeg' | 'webp' | 'svg'>;
        json: string | ResourceItem<'json'>;
      };
    }
  }
}

export interface SpriteRefObject extends EvaRefObject {}

type SpriteParams = SpriteInitParams;

interface SpriteProps extends EVAComponentProps, SpriteParams {
  ref?: RefObject<SpriteRefObject>;
  src?: ResourceSchema['SPRITE'];
}


export function useSpriteResource(src: ResourceSchema['SPRITE']): ResourceIdentify;
export function useSprite(params: SpriteParams): SpriteComponent;
export default function Sprite(props: SpriteProps): JSX.Element;
